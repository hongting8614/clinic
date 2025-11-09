// 云函数 - 库存管理
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
      // 获取库存列表（按药品汇总）
      case 'getList':
        return await getList(data)
      
      // 获取批次列表
      case 'getBatchList':
        return await getBatchList(data)
      
      // 根据批次ID查询库存
      case 'getBatchesByDrugId':
        return await getBatchesByDrugId(data)
      
      // 根据条件查询库存
      case 'getStock':
        return await getStock(data)
      
      // 更新库存数量
      case 'updateStock':
        return await updateStock(data)
      
      // 库存预警列表
      case 'getLowStockList':
        return await getLowStockList(data)
      
      // 近效期药品列表
      case 'getNearExpiryList':
        return await getNearExpiryList(data)
      
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

// 获取库存列表（按药品汇总）
async function getList(data) {
  const { page = 1, pageSize = 100 } = data
  
  try {
    // 聚合查询：按药品分组统计库存
    const $ = db.command.aggregate
    const result = await db.collection('stock')
      .aggregate()
      .group({
        _id: '$drugId',
        drugName: $.first('$drugName'),
        spec: $.first('$spec'),
        unit: $.first('$unit'),
        manufacturer: $.first('$manufacturer'),
        totalQuantity: $.sum('$quantity'),
        batchCount: $.sum(1)
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .end()
    
    return {
      success: true,
      data: result.list || []
    }
  } catch (err) {
    console.error('获取库存列表失败:', err)
    return {
      success: false,
      message: err.message || '获取失败'
    }
  }
}

// 根据药品ID获取批次列表（用于批次选择器）
async function getBatchesByDrugId(data) {
  const { drugId, location, enableFIFO = true } = data
  
  if (!drugId) {
    return {
      success: false,
      message: '药品ID不能为空'
    }
  }
  
  let where = {
    drugId: drugId,
    quantity: _.gt(0)  // 只查询有库存的批次
  }
  
  // 按园区过滤
  if (location) {
    where.location = location
  }
  
  let query = db.collection('stock').where(where)
  
  // FIFO排序：优先推荐最早批次
  if (enableFIFO) {
    query = query.orderBy('expireDate', 'asc')
  } else {
    query = query.orderBy('createTime', 'desc')
  }
  
  const result = await query.get()
  
  // 检查是否近效期
  const now = new Date()
  const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
  
  const batchList = result.data.map(batch => {
    const expireDate = new Date(batch.expireDate)
    const isNearExpiry = expireDate <= threeMonthsLater
    
    return {
      ...batch,
      isNearExpiry: isNearExpiry
    }
  })
  
  return {
    success: true,
    data: batchList
  }
}

// 获取批次列表（保留兼容性）
async function getBatchList(data) {
  return await getBatchesByDrugId(data)
}

// 查询库存
async function getStock(data) {
  const { drugId, location, batch } = data
  
  const where = {}
  if (drugId) where.drugId = drugId
  if (location) where.location = location
  if (batch) where.batch = batch
  
  const result = await db.collection('stock')
    .where(where)
    .get()
  
  return {
    success: true,
    data: result.data
  }
}

// 更新库存数量
async function updateStock(data) {
  const { _id, quantity, operation = 'set' } = data
  
  if (!_id) {
    return {
      success: false,
      message: '库存ID不能为空'
    }
  }
  
  if (operation === 'set') {
    // 直接设置数量
    await db.collection('stock')
      .doc(_id)
      .update({
        data: {
          quantity: quantity,
          updateTime: db.serverDate()
        }
      })
  } else if (operation === 'inc') {
    // 增加数量
    await db.collection('stock')
      .doc(_id)
      .update({
        data: {
          quantity: _.inc(quantity),
          updateTime: db.serverDate()
        }
      })
  } else if (operation === 'dec') {
    // 减少数量
    await db.collection('stock')
      .doc(_id)
      .update({
        data: {
          quantity: _.inc(-Math.abs(quantity)),
          updateTime: db.serverDate()
        }
      })
  }
  
  return {
    success: true,
    message: '更新成功'
  }
}

// 库存预警列表
async function getLowStockList(data) {
  const { location } = data
  
  try {
    // 使用聚合查询来比较字段
    const $ = db.command.aggregate
    let pipeline = [
      {
        $match: {
          quantity: { $exists: true },
          reorderLevel: { $exists: true }
        }
      },
      {
        $addFields: {
          isLowStock: {
            $lte: ['$quantity', '$reorderLevel']
          }
        }
      },
      {
        $match: {
          isLowStock: true
        }
      },
      {
        $sort: {
          quantity: 1
        }
      }
    ]
    
    // 如果指定了园区，添加园区过滤
    if (location) {
      pipeline.unshift({
        $match: { location: location }
      })
    }
    
    const result = await db.collection('stock')
      .aggregate()
      .pipeline(pipeline)
      .end()
    
    return {
      success: true,
      data: result.list || []
    }
  } catch (err) {
    console.error('获取库存预警失败:', err)
    // 降级方案：简单查询所有库存，在应用层过滤
    try {
      let where = {}
      if (location) {
        where.location = location
      }
      
      const result = await db.collection('stock')
        .where(where)
        .orderBy('quantity', 'asc')
        .get()
      
      // 在应用层过滤低库存
      const lowStockList = result.data.filter(item => {
        return item.quantity <= (item.reorderLevel || 0)
      })
      
      return {
        success: true,
        data: lowStockList
      }
    } catch (fallbackErr) {
      console.error('降级查询也失败:', fallbackErr)
      return {
        success: false,
        message: fallbackErr.message || '获取失败'
      }
    }
  }
}

// 近效期药品列表
async function getNearExpiryList(data) {
  const { location, days = 90 } = data
  
  const now = new Date()
  const targetDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  
  let query = db.collection('stock')
    .where({
      expireDate: _.lte(targetDate),
      quantity: _.gt(0)
    })
  
  if (location) {
    query = query.where({ location: location })
  }
  
  const result = await query
    .orderBy('expireDate', 'asc')
    .get()
  
  return {
    success: true,
    data: result.data
  }
}

