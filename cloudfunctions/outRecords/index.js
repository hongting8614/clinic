// 出库单管理云函数 v3.14 - 支持双轨制存储（关键转换点）
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

/**
 * 规格解析工具（简化版 - 内嵌）
 */
class UnitConverter {
  static parseSpecification(specification) {
    if (!specification || typeof specification !== 'string') {
      return null
    }
    
    const spec = specification.trim()
      .replace(/×/g, '×')
      .replace(/／/g, '/')
      .replace(/\s+/g, ' ')
    
    // 标准格式: 0.25g×24粒/盒
    // 2025-12-23: 扩展支持「板」作为包装单位，例如：10粒/板
    let match = spec.match(/^(\d+\.?\d*)(mg|g|ml|μg|mcg|ug)?\s*[×xX*]\s*(\d+)\s*(片|粒|支|瓶|袋|丸|滴|ml|毫升|ML)\s*[/／]\s*(盒|瓶|袋|桶|箱|包|板)$/i)
    if (match) {
      const rate = parseInt(match[3])
      return {
        dosage: match[1] ? parseFloat(match[1]) : null,
        dosageUnit: match[2] ? match[2].toLowerCase() : null,
        conversionRate: isNaN(rate) || rate <= 0 ? 1 : rate,
        minUnit: match[4],
        packUnit: match[5],
        fullSpec: specification,
        pattern: 'standard'
      }
    }
    
    // 简化格式: 24粒/盒
    // 同样支持 10粒/板 这类不带剂量的规格
    match = spec.match(/^(\d+\.?\d*)?\s*[×xX*]?\s*(\d+)\s*(片|粒|支|瓶|袋|丸|滴|ml|毫升|ML)\s*[/／]\s*(盒|瓶|袋|桶|箱|包|板)$/i)
    if (match) {
      const rate = parseInt(match[2])
      return {
        dosage: match[1] ? parseFloat(match[1]) : null,
        dosageUnit: null,
        conversionRate: isNaN(rate) || rate <= 0 ? 1 : rate,
        minUnit: match[3],
        packUnit: match[4],
        fullSpec: specification,
        pattern: 'simple'
      }
    }
    
    // 单一包装: 20g/支
    match = spec.match(/^(\d+\.?\d*)(mg|g|ml|μg|mcg|ug)\s*[/／]\s*(支|瓶|袋|桶|片|粒|丸)$/i)
    if (match) {
      const unit = match[3]
      return {
        dosage: parseFloat(match[1]),
        dosageUnit: match[2].toLowerCase(),
        conversionRate: 1,
        minUnit: unit,
        packUnit: unit,
        fullSpec: specification,
        pattern: 'single'
      }
    }
    
    return null
  }
  
  static packToMin(packQuantity, conversionRate) {
    // 兜底，避免因异常规格导致报错
    const rate = (!conversionRate || conversionRate <= 0) ? 1 : conversionRate
    return packQuantity * rate
  }
  
  static calcMinUnitPrice(packPrice, conversionRate) {
    if (conversionRate <= 0) return 0
    return packPrice / conversionRate
  }
}

exports.main = async (event, context) => {
  // 兼容旧版 query/detail 调用方式
  const { action } = event
  if (action === 'query') return await queryOutRecords(event)
  if (action === 'detail') return await outboundDetail(event.id)
  
  const wxContext = cloud.getWXContext()
  const data = event.data || {}
  
  try {
    switch (action) {
      case 'create':
      case 'add': // 添加 'add' 作为 'create' 的别名,保持API命名统一
        return await createRecord(data, wxContext)
      case 'update':
        return await updateRecord(data, wxContext)
      case 'delete':
        return await deleteRecord(data, wxContext)
      case 'getList':
        return await getList(data, wxContext)
      case 'getDetail':
        return await getDetail(data, wxContext)
      case 'complete':
        return await complete(data, wxContext)
      case 'getCounts':
        return await getCounts(data, wxContext)
      default:
        return {
          success: false,
          message: '未知操作'
        }
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: err.message || '操作失败'
    }
  }
}

async function queryOutRecords({ search = '', dateRange = [], location, page = 1, pageSize = 20 }) {
  const db = cloud.database();
  const _ = db.command;
  let cond = {};
  if (dateRange.length === 2) {
    cond.outboundTime = _.gte(new Date(dateRange[0])).and(_.lte(new Date(dateRange[1] + ' 23:59:59')));
  }
  if (location) cond.location = location;
  if (search) cond['items.name'] = db.RegExp({ regexp: search, options: 'i' });
  const res = await db.collection('out_records')
    .where(cond)
    .orderBy('outboundTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();
  return { success: true, list: res.data };
}

async function outboundDetail(id) {
  const db = cloud.database();
  const res = await db.collection('out_records').doc(id).get();
  if (res.data && res.data.length > 0) {
    return { success: true, data: res.data[0] };
  } else {
    return { success: false, message: '未找到出库单' };
  }
}

/**
 * 创建出库单 v3.14
 * 关键：用户输入包装单位，自动转换为最小单位
 */
async function createRecord(data, wxContext) {
  const { 
    recordNo,
    fromLocation = 'drug_storage',  // 默认从药库出库 ⭐
    toLocation,                     // 目标园区 ⭐
    remark, 
    items, 
    dispenser,
    dispenserId,
    dispenserSign,
    dispenserSignTime,
    receiver,
    receiverId,
    reviewer,
    reviewerId,
    status = 'draft'
  } = data
  
  // 验证必填字段
  if (!recordNo || !toLocation || !items || items.length === 0) {
    throw new Error('出库单号、目标园区和药材明细不能为空')
  }
  
  // 转换药材明细（关键转换点）⭐
  const convertedItems = []
  for (const item of items) {
    // 1. 解析规格
    const specInfo = UnitConverter.parseSpecification(item.specification)
    if (!specInfo) {
      throw new Error(`无法解析规格: ${item.specification}`)
    }
    
    // 2. 转换数量（包装→最小）
    const minQuantity = UnitConverter.packToMin(item.quantity, specInfo.conversionRate)
    
    // 3. 查询药库当前库存
    const drugStorageStock = await db.collection('stock').where({
      drugId: item.drugId,
      batch: item.batch,
      location: fromLocation
    }).get()
    
    if (drugStorageStock.data.length === 0) {
      throw new Error(`${item.drugName} 批次 ${item.batch} 在药库中不存在`)
    }
    
    const currentDrugStock = drugStorageStock.data[0]
    
    // 4. 验证库存（包装单位）
    if (currentDrugStock.quantity < item.quantity) {
      throw new Error(`${item.drugName} 药库库存不足，当前: ${currentDrugStock.quantity}${currentDrugStock.unit}，需要: ${item.quantity}${specInfo.packUnit}`)
    }
    
    // 5. 查询园区当前库存
    const parkStock = await db.collection('stock').where({
      drugId: item.drugId,
      batch: item.batch,
      location: toLocation
    }).get()
    
    const parkBefore = parkStock.data.length > 0 ? parkStock.data[0].quantity : 0
    
    // 6. 构建转换后的记录
    convertedItems.push({
      ...item,
      // 药库扣减（包装单位）
      packQuantity: item.quantity,
      packUnit: specInfo.packUnit,
      
      // 园区入库（最小单位）⭐ 关键！
      minQuantity: minQuantity,
      minUnit: specInfo.minUnit,
      
      // 规格信息
      specInfo: specInfo,
      
      // 库存变化记录
      drugStorageBefore: currentDrugStock.quantity,
      drugStorageAfter: currentDrugStock.quantity - item.quantity,
      parkBefore: parkBefore,
      parkAfter: parkBefore + minQuantity
    })
  }
  
  const now = new Date()
  
  const record = {
    recordNo,
    status,
    fromLocation,
    toLocation,
    items: convertedItems,
    remark: remark || '',
    dispenser,
    dispenserId,
    dispenserSign,
    dispenserSignTime,
    receiver: receiver || '',
    receiverId: receiverId || '',
    receiverSign: '',
    receiverSignTime: '',
    reviewer: reviewer || '',
    reviewerId: reviewerId || '',
    reviewerSign: '',
    reviewerSignTime: '',
    createTime: now,
    updateTime: now,
    completeTime: null
  }
  
  const result = await db.collection('out_records').add({
    data: record
  })
  
  return {
    success: true,
    message: '创建成功',
    data: {
      _id: result._id,
      ...record
    }
  }
}

/**
 * 完成出库（执行库存变更）⭐ 关键逻辑
 */
async function complete(data, wxContext) {
  const { 
    _id,
    receiver,
    receiverId,
    receiverSign,
    receiverSignTime,
    reviewer,
    reviewerId,
    reviewerSign,
    reviewerSignTime
  } = data
  
  if (!_id) {
    throw new Error('记录ID不能为空')
  }
  
  // 获取出库单
  const record = await db.collection('out_records').doc(_id).get()
  if (!record.data) {
    throw new Error('记录不存在')
  }
  
  if (record.data.status === 'completed') {
    throw new Error('该出库单已完成')
  }
  
  const now = new Date()
  
  // 开始事务
  try {
    // 1. 扣减药库库存（包装单位）
    for (const item of record.data.items) {
      const drugStock = await db.collection('stock').where({
        drugId: item.drugId,
        batch: item.batch,
        location: record.data.fromLocation
      }).get()
      
      if (drugStock.data.length === 0) {
        throw new Error(`${item.drugName} 批次 ${item.batch} 不存在`)
      }
      
      const stock = drugStock.data[0]
      
      // 再次验证库存
      if (stock.quantity < item.packQuantity) {
        throw new Error(`${item.drugName} 库存不足`)
      }
      
      // 扣减包装单位
      await db.collection('stock').doc(stock._id).update({
        data: {
          quantity: _.inc(-item.packQuantity),  // 扣减包装数量
          updateTime: now
        }
      })
    }
    
    // 2. 增加园区库存（最小单位）⭐ 关键！
    for (const item of record.data.items) {
      const parkStock = await db.collection('stock').where({
        drugId: item.drugId,
        batch: item.batch,
        location: record.data.toLocation
      }).get()
      
      if (parkStock.data.length > 0) {
        // 已存在，累加最小单位
        // 确保单位是最小单位（修复：如果原来单位是包装单位，需要更新为最小单位）
        const existingStock = parkStock.data[0]
        const updateData = {
            quantity: _.inc(item.minQuantity),  // 增加最小单位 ⭐
            updateTime: now
          }
        // 如果当前单位不是最小单位，更新为单位
        if (existingStock.unit !== item.minUnit && item.minUnit) {
          updateData.unit = item.minUnit
        }
        await db.collection('stock').doc(existingStock._id).update({
          data: updateData
        })
      } else {
        // 不存在，新建库存记录（最小单位）⭐
        // 获取药材完整信息
        const drugInfo = await db.collection('drugs').doc(item.drugId).get()
        
        // 计算效期状态
        const expire = new Date(item.expireDate)
        const daysToExpire = Math.floor((expire - now) / (1000 * 60 * 60 * 24))
        let stockStatus = 'normal'
        if (daysToExpire < 0) {
          stockStatus = 'expired'
        } else if (daysToExpire <= 90) {
          stockStatus = 'near_expire'
        }
        
        await db.collection('stock').add({
          data: {
            drugId: item.drugId,
            drugName: item.drugName,
            specification: item.specification,
            unit: item.minUnit,              // 最小单位 ⭐
            manufacturer: drugInfo.data?.manufacturer || '',
            batch: item.batch,
            productionDate: item.productionDate,
            expireDate: item.expireDate,
            quantity: item.minQuantity,      // 最小单位数量 ⭐
            price: item.price || 0,
            pricePerMin: item.specInfo ? UnitConverter.calcMinUnitPrice(item.price || 0, item.specInfo.conversionRate) : 0,
            location: record.data.toLocation,
            specInfo: item.specInfo,
            lockQuantity: 0,
            status: stockStatus,
            createTime: now,
            updateTime: now
          }
        })
      }
    }
    
    // 3. 更新出库单状态
    await db.collection('out_records').doc(_id).update({
      data: {
        status: 'completed',
        receiver,
        receiverId,
        receiverSign,
        receiverSignTime,
        reviewer,
        reviewerId,
        reviewerSign,
        reviewerSignTime,
        completeTime: now,
        updateTime: now
      }
    })
    
    return {
      success: true,
      message: '出库成功，库存已更新'
    }
    
  } catch (error) {
    console.error('出库失败:', error)
    throw error
  }
}

// 更新出库单
async function updateRecord(data, wxContext) {
  const { _id, ...updateData } = data
  
  if (!_id) {
    throw new Error('记录ID不能为空')
  }
  
  // 只能更新草稿
  const record = await db.collection('out_records').doc(_id).get()
  if (!record.data) {
    throw new Error('记录不存在')
  }
  
  if (record.data.status !== 'draft') {
    throw new Error('只能修改草稿单据')
  }
  
  updateData.updateTime = new Date()
  
  await db.collection('out_records').doc(_id).update({
    data: updateData
  })
  
  return {
    success: true,
    message: '更新成功'
  }
}

// 删除出库单
async function deleteRecord(data, wxContext) {
  const { _id } = data
  
  if (!_id) {
    throw new Error('记录ID不能为空')
  }
  
  // 只能删除草稿
  const record = await db.collection('out_records').doc(_id).get()
  if (!record.data) {
    throw new Error('记录不存在')
  }
  
  if (record.data.status !== 'draft') {
    throw new Error('只能删除草稿单据')
  }
  
  await db.collection('out_records').doc(_id).remove()
  
  return {
    success: true,
    message: '删除成功'
  }
}

// 获取出库单列表
async function getList(data, wxContext) {
  const { 
    status = 'all', 
    page = 1, 
    pageSize = 10,
    location = 'all'
  } = data
  
  let query = db.collection('out_records')
  
  // 状态筛选
  const where = {}
  if (status && status !== 'all') {
    where.status = status
  }
  if (location && location !== 'all') {
    where.toLocation = location
  }
  
  if (Object.keys(where).length > 0) {
    query = query.where(where)
  }
  
  // 按创建时间倒序
  const result = await query
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()
  
  return {
    success: true,
    data: result.data,
    total: result.data.length
  }
}

// 获取出库单详情
async function getDetail(data, wxContext) {
  const { _id } = data
  
  if (!_id) {
    throw new Error('记录ID不能为空')
  }
  
  const result = await db.collection('out_records').doc(_id).get()
  
  if (!result.data) {
    throw new Error('记录不存在')
  }
  
  const record = result.data
  
  // 转换签名图片URL（云函数有权限访问云存储）
  try {
    const fileIds = []
    
    if (record.dispenserSign && record.dispenserSign.startsWith('cloud://')) {
      fileIds.push(record.dispenserSign)
    }
    if (record.receiverSign && record.receiverSign.startsWith('cloud://')) {
      fileIds.push(record.receiverSign)
    }
    
    if (fileIds.length > 0) {
      const res = await cloud.getTempFileURL({
        fileList: fileIds
      })
      
      if (res.fileList) {
        res.fileList.forEach(item => {
          if (item.fileID === record.dispenserSign && item.tempFileURL) {
            record.dispenserSign = item.tempFileURL
          }
          if (item.fileID === record.receiverSign && item.tempFileURL) {
            record.receiverSign = item.tempFileURL
          }
        })
      }
    }
  } catch (err) {
    console.error('转换签名图片URL失败:', err)
    // 转换失败不影响返回数据
  }
  
  return {
    success: true,
    data: record
  }
}

// 获取各状态数量
async function getCounts(data, wxContext) {
  const draft = await db.collection('out_records').where({ status: 'draft' }).count()
  const pending = await db.collection('out_records').where({ status: 'pending_review' }).count()
  const completed = await db.collection('out_records').where({ status: 'completed' }).count()
  
  // 获取今日数量
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayRecords = await db.collection('out_records')
    .where({
      createTime: _.gte(today)
    })
    .count()
  
  const draftTotal = draft.total || 0
  const pendingTotal = pending.total || 0
  const completedTotal = completed.total || 0
  
  return {
    success: true,
    draft: draftTotal,
    pending_review: pendingTotal,
    pendingReview: pendingTotal,
    completed: completedTotal,
    all: draftTotal + pendingTotal + completedTotal,
    today: todayRecords.total || 0
  }
}

