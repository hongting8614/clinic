// 云函数 - 药材管理
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event
  
  try {
    switch (action) {
      // 根据条码查询药材
      case 'getByBarcode':
        return await getByBarcode(data)
      
      // 获取药材列表
      case 'getList':
        return await getList(data)
      
      // 添加药材
      case 'add':
        return await addDrug(data)
      
      // 更新药材
      case 'update':
        return await updateDrug(data)
      
      // 删除药材
      case 'delete':
        return await deleteDrug(data)
      
      // 搜索药材（支持拼音）
      case 'search':
        return await searchDrug(data)
      
      // ⭐ 新增：获取药品详情
      case 'getDetail':
      case 'getDrugDetail':  // 兼容两种写法
        return await getDrugDetail(data)
      
      // ⭐ 新增：获取药品和批次信息（合并查询，优化性能）
      case 'getDrugWithBatches':
        return await getDrugWithBatches(data)
      
      default:
        return {
          success: false,
          message: '未知的操作类型'
        }
    }
  } catch (err) {
    console.error('云函数执行失败:', err)
    return {
      success: false,
      message: err.message || '操作失败'
    }
  }
}

// 根据条码查询药材
async function getByBarcode(data) {
  const { barcode } = data
  
  if (!barcode) {
    return {
      success: false,
      message: '条码不能为空'
    }
  }
  
  const result = await db.collection('drugs')
    .where({
      barcode: barcode
    })
    .get()
  
  if (result.data && result.data.length > 0) {
    return {
      success: true,
      data: result.data[0]
    }
  } else {
    return {
      success: false,
      message: '未找到该药材',
      notFound: true
    }
  }
}

// 获取药材列表
async function getList(data) {
  const { pageSize = 20, pageNum = 1, category = '', keyword = '' } = data
  
  let query = db.collection('drugs')
  
  // 分类筛选
  if (category) {
    query = query.where({
      category: category
    })
  }
  
  // 关键词搜索
  if (keyword) {
    query = query.where({
      name: db.RegExp({
        regexp: keyword,
        options: 'i'
      })
    })
  }
  
  // 分页
  const skip = (pageNum - 1) * pageSize
  
  const countResult = await query.count()
  const listResult = await query
    .skip(skip)
    .limit(pageSize)
    .orderBy('createTime', 'desc')
    .get()
  
  return {
    success: true,
    data: {
      list: listResult.data,
      total: countResult.total,
      pageNum: pageNum,
      pageSize: pageSize
    }
  }
}

// 添加药材
async function addDrug(data) {
  const { barcode, name, pinyin, spec, unit, manufacturer, category, isHighValue, isEmergency, remark } = data
  
  // 验证必填字段
  if (!barcode || !name || !spec || !unit) {
    return {
      success: false,
      message: '条码、名称、规格、单位不能为空'
    }
  }
  
  // 检查条码是否已存在
  const existResult = await db.collection('drugs')
    .where({
      barcode: barcode
    })
    .count()
  
  if (existResult.total > 0) {
    return {
      success: false,
      message: '该条码已存在'
    }
  }
  
  // 添加药材
  const result = await db.collection('drugs').add({
    data: {
      barcode,
      name,
      pinyin: pinyin || '',
      spec,
      unit,
      manufacturer: manufacturer || '',
      category: category || '其他',
      isHighValue: isHighValue || false,
      isEmergency: isEmergency || false,
      remark: remark || '',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }
  })
  
  return {
    success: true,
    message: '添加成功',
    data: {
      _id: result._id
    }
  }
}

// ⭐ 更新药材（支持 updateData 格式）
async function updateDrug(data) {
  const { _id, updateData } = data
  
  if (!_id) {
    return {
      success: false,
      message: '药材ID不能为空'
    }
  }
  
  if (!updateData || Object.keys(updateData).length === 0) {
    return {
      success: false,
      message: '更新数据不能为空'
    }
  }
  
  console.log('🔧 云函数更新药品档案')
  console.log('药品ID:', _id)
  console.log('更新数据:', updateData)
  
  // 如果修改了条码，检查新条码是否已存在
  if (updateData.barcode || updateData.barCode) {
    const barcodeToCheck = updateData.barcode || updateData.barCode
    const existResult = await db.collection('drugs')
      .where(_.or([
        {
          barcode: barcodeToCheck,
          _id: _.neq(_id)
        },
        {
          barCode: barcodeToCheck,
          _id: _.neq(_id)
        }
      ]))
      .count()
    
    if (existResult.total > 0) {
      return {
        success: false,
        message: '该条码已被其他药材使用'
      }
    }
  }
  
  // 确保更新时间使用服务器时间
  const finalUpdateData = {
    ...updateData,
    updateTime: db.serverDate()
  }
  
  console.log('最终更新数据:', finalUpdateData)
  
  const result = await db.collection('drugs')
    .doc(_id)
    .update({
      data: finalUpdateData
    })
  
  console.log('✅ 云函数更新成功:', result)
  
  return {
    success: true,
    message: '更新成功',
    result: result
  }
}

// 删除药材
async function deleteDrug(data) {
  const { _id } = data
  
  if (!_id) {
    return {
      success: false,
      message: '药材ID不能为空'
    }
  }
  
  await db.collection('drugs')
    .doc(_id)
    .remove()
  
  return {
    success: true,
    message: '删除成功'
  }
}

// 搜索药材（支持拼音）
async function searchDrug(data) {
  const { keyword, limit = 10 } = data
  
  if (!keyword) {
    return {
      success: false,
      message: '搜索关键词不能为空'
    }
  }
  
  // 搜索名称或拼音
  const result = await db.collection('drugs')
    .where(_.or([
      {
        name: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      },
      {
        pinyin: db.RegExp({
          regexp: keyword.toUpperCase(),
          options: 'i'
        })
      }
    ]))
    .limit(limit)
    .get()
  
  return {
    success: true,
    data: result.data
  }
}

// ⭐ 新增：获取药品详情
async function getDrugDetail(data) {
  const { drugId } = data
  
  if (!drugId) {
    return {
      success: false,
      message: '药品ID不能为空'
    }
  }
  
  try {
    const result = await db.collection('drugs').doc(drugId).get()
    
    if (result.data) {
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: '未找到该药品'
      }
    }
  } catch (err) {
    console.error('获取药品详情失败:', err)
    return {
      success: false,
      message: err.message || '获取失败'
    }
  }
}

/**
 * ⭐ 新增：获取药品和批次信息（合并查询）
 * 优化点：将原本需要2次云函数调用合并为1次，减少网络请求，提升性能
 * @param {Object} data - 参数对象
 * @param {String} data.drugId - 药品ID
 * @param {String} data.location - 库存位置
 * @param {Boolean} data.enableFIFO - 是否启用FIFO排序（默认true）
 * @returns {Object} {success, data: {drug, batches}}
 */
async function getDrugWithBatches(data) {
  const { drugId, location, enableFIFO = true } = data
  
  console.log('=== getDrugWithBatches 合并查询 ===')
  console.log('drugId:', drugId)
  console.log('location:', location)
  console.log('enableFIFO:', enableFIFO)
  
  if (!drugId) {
    return {
      success: false,
      message: '药品ID不能为空'
    }
  }
  
  try {
    // 并行查询药品信息和批次信息
    const drugPromise = db.collection('drugs').doc(drugId).get()
    
    // 构建批次查询条件
    let batchWhere = {
      drugId: drugId,
      quantity: _.gt(0)  // 只查询有库存的批次
    }
    
    if (location) {
      batchWhere.location = location
    }
    
    let batchQuery = db.collection('stock').where(batchWhere)
    
    // FIFO排序：优先推荐最早批次
    if (enableFIFO) {
      batchQuery = batchQuery.orderBy('expireDate', 'asc')
    } else {
      batchQuery = batchQuery.orderBy('createTime', 'desc')
    }
    
    const batchPromise = batchQuery.get()
    
    // 并行执行查询
    const [drugResult, batchResult] = await Promise.all([drugPromise, batchPromise])
    
    console.log('查询完成 - 药品:', drugResult.data ? '✅' : '❌')
    console.log('查询完成 - 批次数量:', batchResult.data.length)
    
    // 检查是否近效期
    const now = new Date()
    const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
    
    const batches = batchResult.data.map(batch => {
      const expireDate = new Date(batch.expireDate)
      const isNearExpiry = expireDate <= threeMonthsLater
      
      return {
        ...batch,
        quantity: Number(batch.quantity) || 0,
        isNearExpiry: isNearExpiry,
        daysToExpiry: Math.floor((expireDate - now) / (1000 * 60 * 60 * 24))
      }
    })
    
    return {
      success: true,
      data: {
        drug: drugResult.data || null,
        batches: batches
      },
      message: '查询成功'
    }
  } catch (err) {
    console.error('合并查询失败:', err)
    return {
      success: false,
      message: err.message || '查询失败'
    }
  }
}
