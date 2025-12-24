// 入库单管理云函数 v3.14 - 支持双轨制存储
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 导入单位转换工具（需要部署）
// const UnitConverter = require('./unitConverter')

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
    let match = spec.match(/^(\d+\.?\d*)(mg|g|ml|μg|mcg|ug)?\s*[×xX*]\s*(\d+)\s*(片|粒|支|瓶|袋|丸|滴|ml|毫升|ML)\s*[/／]\s*(盒|瓶|袋|桶|箱|包)$/i)
    if (match) {
      return {
        dosage: match[1] ? parseFloat(match[1]) : null,
        dosageUnit: match[2] ? match[2].toLowerCase() : null,
        conversionRate: parseInt(match[3]),
        minUnit: match[4],
        packUnit: match[5],
        fullSpec: specification,
        pattern: 'standard'
      }
    }
    
    // 简化格式: 24粒/盒
    match = spec.match(/^(\d+\.?\d*)?\s*[×xX*]?\s*(\d+)\s*(片|粒|支|瓶|袋|丸|滴|ml|毫升|ML)\s*[/／]\s*(盒|瓶|袋|桶|箱|包)$/i)
    if (match) {
      return {
        dosage: match[1] ? parseFloat(match[1]) : null,
        dosageUnit: null,
        conversionRate: parseInt(match[2]),
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
  
  static calcMinUnitPrice(packPrice, conversionRate) {
    if (conversionRate <= 0) return 0
    return packPrice / conversionRate
  }
}

exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()
  
  try {
    switch (action) {
      case 'create':
      case 'add':  // 添加 'add' 作为 'create' 的别名,与设计方案保持一致
        return await createRecord(data, wxContext)
      case 'update':
        return await updateRecord(data, wxContext)
      case 'delete':
        return await deleteRecord(data, wxContext)
      case 'getList':
        return await getList(data, wxContext)
      case 'getDetail':
        return await getDetail(data, wxContext)
      case 'approve':
        return await approve(data, wxContext)
      case 'reject':
        return await reject(data, wxContext)
      case 'getCounts':
        return await getCounts(data, wxContext)
      case 'getStats':
        return await getStats(data, wxContext)
      case 'simulateBulk':
        return await simulateBulk(data, wxContext)
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

// 批量模拟写入（用于测试）——允许自定义时间与完成状态，并更新库存
async function simulateBulk(data, wxContext) {
  const { records = [] } = data || {}
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('records 不能为空')
  }
  const inserted = []
  for (const r of records) {
    const now = r.createTime ? new Date(r.createTime) : new Date()
    const record = {
      recordNo: r.recordNo,
      status: r.status || 'completed',
      items: r.items || [],
      operator: r.operator || '',
      operatorId: r.operatorId || '',
      operatorRole: r.operatorRole || '',
      // 同步写入 doctor 字段，含义等同于操作人，便于后续统一为医生
      doctor: r.doctor || r.operator || '',
      doctorId: r.doctorId || r.operatorId || '',
      operatorSign: r.operatorSign || r.operator || '',
      operatorSignTime: r.operatorSignTime ? new Date(r.operatorSignTime) : now,
      reviewer: r.reviewer || '',
      reviewerId: r.reviewerId || '',
      reviewerSign: r.reviewerSign || r.reviewer || '',
      reviewerSignTime: r.reviewerSignTime ? new Date(r.reviewerSignTime) : now,
      rejectReason: '',
      createTime: now,
      updateTime: now,
      completeTime: r.completeTime ? new Date(r.completeTime) : now
    }
    const res = await db.collection('in_records').add({ data: record })
    inserted.push(res._id)
    // 更新库存
    for (const item of record.items) {
      const specInfo = UnitConverter.parseSpecification(item.specification || item.spec)
      await updateStock({
        drugId: item.drugId,
        drugName: item.drugName,
        specification: item.specification || item.spec,
        unit: item.unit,
        manufacturer: item.manufacturer,
        batch: item.batch,
        productionDate: item.productionDate,
        expireDate: item.expireDate,
        quantity: item.quantity,
        price: item.price || 0,
        location: 'drug_storage',
        action: 'in',
        specInfo
      })
    }
  }
  return { success: true, message: '模拟入库完成', count: inserted.length, ids: inserted }
}

// 创建入库单
async function createRecord(data, wxContext) {
  const { 
    recordNo, 
    items, 
    operator,
    operatorId,
    operatorRole,
    operatorSign,
    operatorSignTime,
    status = 'pending_review',
    remark
  } = data
  
  // 验证必填字段
  if (!recordNo || !items || items.length === 0) {
    throw new Error('入库单号和药材明细不能为空')
  }
  
  const now = new Date()
  
  const record = {
    recordNo,
    status,
    items,
    remark: remark || '',
    operator,
    operatorId,
    // 同步写入 doctor 字段，含义等同于操作人，便于后续统一为医生
    doctor: operator,
    doctorId: operatorId,
    operatorRole: operatorRole || '',
    operatorSign,
    operatorSignTime,
    reviewer: '',
    reviewerId: '',
    reviewerSign: '',
    reviewerSignTime: '',
    rejectReason: '',
    createTime: now,
    updateTime: now,
    completeTime: null
  }
  
  const result = await db.collection('in_records').add({
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

// 更新入库单
async function updateRecord(data, wxContext) {
  const { _id, ...updateData } = data
  
  if (!_id) {
    throw new Error('记录ID不能为空')
  }
  
  // 只能更新草稿或已驳回的单据
  const record = await db.collection('in_records').doc(_id).get()
  if (!record.data) {
    throw new Error('记录不存在')
  }
  
  if (record.data.status !== 'draft' && record.data.status !== 'rejected') {
    throw new Error('只能修改草稿或已驳回的单据')
  }
  
  updateData.updateTime = new Date()
  
  await db.collection('in_records').doc(_id).update({
    data: updateData
  })
  
  return {
    success: true,
    message: '更新成功'
  }
}

// 删除入库单
async function deleteRecord(data, wxContext) {
  const { _id } = data
  
  if (!_id) {
    throw new Error('记录ID不能为空')
  }
  
  // 只能删除草稿
  const record = await db.collection('in_records').doc(_id).get()
  if (!record.data) {
    throw new Error('记录不存在')
  }
  
  if (record.data.status !== 'draft') {
    throw new Error('只能删除草稿单据')
  }
  
  await db.collection('in_records').doc(_id).remove()
  
  return {
    success: true,
    message: '删除成功'
  }
}

// 获取入库单列表
async function getList(data, wxContext) {
  const { 
    status = 'all', 
    page = 1, 
    pageSize = 10,
    operatorId = ''
  } = data
  
  let query = db.collection('in_records')
  
  // 状态筛选
  if (status && status !== 'all') {
    query = query.where({
      status: status
    })
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

// 获取入库单详情
async function getDetail(data, wxContext) {
  const { _id } = data
  
  if (!_id) {
    throw new Error('记录ID不能为空')
  }
  
  const result = await db.collection('in_records').doc(_id).get()
  
  if (!result.data) {
    throw new Error('记录不存在')
  }
  
  const record = result.data
  
  // 转换签名图片URL（云函数有权限访问云存储）
  try {
    const fileIds = []
    
    if (record.operatorSign && record.operatorSign.startsWith('cloud://')) {
      fileIds.push(record.operatorSign)
    }
    if (record.reviewerSign && record.reviewerSign.startsWith('cloud://')) {
      fileIds.push(record.reviewerSign)
    }
    
    if (fileIds.length > 0) {
      const res = await cloud.getTempFileURL({
        fileList: fileIds
      })
      
      if (res.fileList) {
        res.fileList.forEach(item => {
          if (item.fileID === record.operatorSign && item.tempFileURL) {
            record.operatorSign = item.tempFileURL
          }
          if (item.fileID === record.reviewerSign && item.tempFileURL) {
            record.reviewerSign = item.tempFileURL
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

// 复核通过
async function approve(data, wxContext) {
  const { 
    _id, 
    reviewer, 
    reviewerId, 
    reviewerSign, 
    reviewerSignTime 
  } = data
  
  if (!_id || !reviewer || !reviewerSign) {
    throw new Error('参数不完整')
  }
  
  // 检查记录状态
  const record = await db.collection('in_records').doc(_id).get()
  if (!record.data) {
    throw new Error('记录不存在')
  }
  
  if (record.data.status !== 'pending_review') {
    throw new Error('只能复核待审核的单据')
  }
  
  // 检查是否为同一人
  if (record.data.operatorId === reviewerId) {
    throw new Error('不能自己复核自己的单据')
  }
  
  const now = new Date()
  
  // 更新入库单状态
  await db.collection('in_records').doc(_id).update({
    data: {
      status: 'completed',
      reviewer,
      reviewerId,
      reviewerSign,
      reviewerSignTime,
      completeTime: now,
      updateTime: now
    }
  })
  
  // 增加库存（统一入库到药库 - 使用包装单位）⭐ v3.14
  for (const item of record.data.items) {
    // 解析规格信息
    const specInfo = UnitConverter.parseSpecification(item.specification || item.spec)
    
    // ⭐ 关键：入库到药库时，确保使用包装单位
    // item.unit 应该是包装单位（盒、瓶等）
    // item.quantity 应该是包装数量
    
    await updateStock({
      drugId: item.drugId,
      drugName: item.drugName,
      specification: item.specification || item.spec,
      unit: item.unit,  // 包装单位（盒、瓶）⭐
      manufacturer: item.manufacturer,
      batch: item.batch,
      productionDate: item.productionDate,
      expireDate: item.expireDate,
      quantity: item.quantity,  // 包装数量 ⭐
      price: item.price || 0,
      location: 'drug_storage', // 统一入库到药库 ⭐
      action: 'in',
      specInfo: specInfo
    })
  }
  
  return {
    success: true,
    message: '复核通过，库存已更新'
  }
}

// 复核驳回
async function reject(data, wxContext) {
  const { 
    _id, 
    reviewer, 
    reviewerId, 
    rejectReason 
  } = data
  
  if (!_id || !rejectReason) {
    throw new Error('参数不完整')
  }
  
  // 检查记录状态
  const record = await db.collection('in_records').doc(_id).get()
  if (!record.data) {
    throw new Error('记录不存在')
  }
  
  if (record.data.status !== 'pending_review') {
    throw new Error('只能驳回待审核的单据')
  }
  
  const now = new Date()
  
  // 更新入库单状态
  await db.collection('in_records').doc(_id).update({
    data: {
      status: 'rejected',
      reviewer,
      reviewerId,
      rejectReason,
      updateTime: now
    }
  })
  
  return {
    success: true,
    message: '已驳回'
  }
}

// 获取各状态数量
async function getCounts(data, wxContext) {
  const draft = await db.collection('in_records').where({ status: 'draft' }).count()
  const pendingReview = await db.collection('in_records').where({ status: 'pending_review' }).count()
  const rejected = await db.collection('in_records').where({ status: 'rejected' }).count()
  const completed = await db.collection('in_records').where({ status: 'completed' }).count()
  
  // 获取今日数量
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayRecords = await db.collection('in_records')
    .where({
      createTime: _.gte(today)
    })
    .count()
  
  return {
    success: true,
    draft: draft.total,
    pending_review: pendingReview.total,
    rejected: rejected.total,
    completed: completed.total,
    all: draft.total + pendingReview.total + rejected.total + completed.total,
    today: todayRecords.total
  }
}

// 获取统计数据
async function getStats(data, wxContext) {
  const now = new Date()
  
  // 今日开始时间
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  
  // 本周开始时间（周一）
  const weekStart = new Date()
  const day = weekStart.getDay()
  const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1)
  weekStart.setDate(diff)
  weekStart.setHours(0, 0, 0, 0)
  
  // 本月开始时间
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  
  // 今日入库数量（已完成）
  const todayCount = await db.collection('in_records')
    .where({
      status: 'completed',
      completeTime: _.gte(todayStart)
    })
    .count()
  
  // 本周入库数量
  const weekCount = await db.collection('in_records')
    .where({
      status: 'completed',
      completeTime: _.gte(weekStart)
    })
    .count()
  
  // 本月入库数量
  const monthCount = await db.collection('in_records')
    .where({
      status: 'completed',
      completeTime: _.gte(monthStart)
    })
    .count()
  
  // 待复核数量
  const pendingCount = await db.collection('in_records')
    .where({
      status: 'pending_review'
    })
    .count()
  
  return {
    success: true,
    today: todayCount.total,
    thisWeek: weekCount.total,
    thisMonth: monthCount.total,
    pending: pendingCount.total
  }
}

// 更新库存（增加或减少）v3.14 - 支持双轨制存储
async function updateStock(data) {
  const {
    drugId,
    drugName,
    specification,
    unit,
    manufacturer,
    batch,
    productionDate,
    expireDate,
    quantity,
    price,
    location,
    action, // 'in' 入库, 'out' 出库
    specInfo // 规格解析信息 ⭐
  } = data
  
  // 查找是否存在该批次的库存
  const stockQuery = await db.collection('stock').where({
    drugId,
    batch,
    location
  }).get()
  
  if (stockQuery.data.length > 0) {
    // 已存在，更新数量
    const stock = stockQuery.data[0]
    const newQuantity = action === 'in' 
      ? stock.quantity + quantity 
      : stock.quantity - quantity
    
    if (newQuantity < 0) {
      throw new Error(`${drugName} 库存不足`)
    }
    
    await db.collection('stock').doc(stock._id).update({
      data: {
        quantity: newQuantity,
        updateTime: new Date()
      }
    })
  } else {
    // 不存在，新增库存记录
    if (action === 'out') {
      throw new Error(`${drugName} 批次 ${batch} 不存在`)
    }
    
    // 计算效期状态
    const now = new Date()
    const expire = new Date(expireDate)
    const daysToExpire = Math.floor((expire - now) / (1000 * 60 * 60 * 24))
    let status = 'normal'
    if (daysToExpire < 0) {
      status = 'expired'
    } else if (daysToExpire <= 90) {
      status = 'near_expire'
    }
    
    // 计算最小单位单价
    const pricePerMin = specInfo && specInfo.conversionRate 
      ? UnitConverter.calcMinUnitPrice(price, specInfo.conversionRate)
      : 0
    
    await db.collection('stock').add({
      data: {
        drugId,
        drugName,
        specification: specification,
        unit: unit,
        manufacturer,
        batch,
        productionDate,
        expireDate,
        quantity: quantity,
        price: price,
        pricePerMin: pricePerMin, // 最小单位单价 ⭐
        location: location,
        specInfo: specInfo || null, // 规格解析信息 ⭐
        lockQuantity: 0,
        status: status,
        createTime: new Date(),
        updateTime: new Date()
      }
    })
  }
}

