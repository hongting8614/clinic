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
      // 获取库存列表（按药材汇总）
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
      
      // 近效期药材列表
      case 'getNearExpiryList':
        return await getNearExpiryList(data)
      
      // FIFO批次分配算法 ⭐ 新增
      case 'allocateBatchesFIFO':
        return await allocateBatchesFIFO(data)
      
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

// 获取库存列表（按药材汇总）
async function getList(data) {
  const { page = 1, pageSize = 100 } = data
  
  try {
    // 聚合查询：按药材分组统计库存
    const $ = db.command.aggregate
    const result = await db.collection('stock')
      .aggregate()
      .group({
        _id: '$drugId',
        drugName: $.first('$drugName'),
        // 入库时写入的是 specification 字段，这里按药材汇总时需要用同一字段
        spec: $.first('$specification'),
        unit: $.first('$unit'),
        manufacturer: $.first('$manufacturer'),
        // 为了在库存总览中展示有效期，取该药材在当前库存中的最早有效期
        expireDate: $.min('$expireDate'),
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

// 根据药材ID获取批次列表（用于批次选择器）
async function getBatchesByDrugId(data) {
  const { drugId, location, enableFIFO = true } = data
  
  console.log('📊 [云函数] getBatchesByDrugId 调试:')
  console.log('  - drugId:', drugId)
  console.log('  - location:', location)
  console.log('  - enableFIFO:', enableFIFO)
  
  if (!drugId) {
    return {
      success: false,
      message: '药材ID不能为空'
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
  
  console.log('  - 查询条件:', JSON.stringify(where))
  
  let query = db.collection('stock').where(where)
  
  // FIFO排序：优先推荐最早批次
  if (enableFIFO) {
    query = query.orderBy('expireDate', 'asc')
  } else {
    query = query.orderBy('createTime', 'desc')
  }
  
  const result = await query.get()
  
  console.log('  - 查询结果数量:', result.data.length)
  
  if (result.data.length === 0) {
    console.warn('  ⚠️ 未找到库存批次')
    
    // 尝试查询该药材的所有批次（包括库存为0的）
    const allBatches = await db.collection('stock')
      .where({ drugId: drugId })
      .get()
    
    console.log('  - 该药材所有批次数量:', allBatches.data.length)
    if (allBatches.data.length > 0) {
      console.log('  - 所有批次:', allBatches.data)
      const hasStock = allBatches.data.filter(b => b.quantity > 0)
      console.log('  - 有库存的批次数量:', hasStock.length)
      
      if (hasStock.length > 0 && location) {
        console.warn('  ⚠️ 其他园区可能有库存，当前园区无库存')
      }
    } else {
      console.warn('  ⚠️ 数据库中完全没有该药材的批次记录')
      console.warn('  - 可能是 drugId 不匹配')
    }
  } else {
    console.log('  ✅ 找到批次:', result.data.length, '个')
    result.data.forEach((batch, i) => {
      console.log(`    批次${i + 1}:`, {
        batch: batch.batch,
        quantity: batch.quantity,
        location: batch.location,
        expireDate: batch.expireDate
      })
    })
  }
  
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

// 近效期药材列表
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

/**
 * FIFO批次分配算法 ⭐
 * @param {Object} data - 参数对象
 * @param {String} data.drugId - 药材ID
 * @param {Number} data.requiredQuantity - 需要的数量
 * @param {String} data.location - 库存位置（默认：drug_storage）
 * @returns {Object} 分配结果 {success, data: {allocation, totalAllocated, batchCount, hasNearExpiry}}
 */
async function allocateBatchesFIFO(data) {
  const { drugId, requiredQuantity, location } = data
  
  console.log('=== FIFO批次分配开始 ===')
  console.log('药材ID:', drugId)
  console.log('需要数量:', requiredQuantity)
  console.log('库存位置:', location || 'drug_storage')
  
  // 1. 参数验证
  if (!drugId) {
    return {
      success: false,
      message: '药材ID不能为空'
    }
  }
  
  if (!requiredQuantity || requiredQuantity <= 0) {
    return {
      success: false,
      message: '出库数量必须大于0'
    }
  }
  
  try {
    // 2. 查询所有可用批次（按FIFO排序）
    const batches = await db.collection('stock')
      .where({
        drugId: drugId,
        location: location || 'drug_storage',
        quantity: _.gt(0)
      })
      .orderBy('expireDate', 'asc')   // FIFO：最早有效期优先
      .orderBy('createTime', 'asc')   // 同一天的按入库时间
      .get()
    
    console.log('查询到批次数量:', batches.data.length)
    
    if (batches.data.length === 0) {
      return {
        success: false,
        message: '该药材暂无库存'
      }
    }
    
    // 3. 检查总库存是否足够
    const totalStock = batches.data.reduce((sum, b) => sum + b.quantity, 0)
    console.log('总库存:', totalStock)
    
    if (totalStock < requiredQuantity) {
      return {
        success: false,
        message: `库存不足，当前总库存：${totalStock}，需要：${requiredQuantity}`,
        totalStock: totalStock
      }
    }
    
    // 4. FIFO分配算法
    const allocation = []
    let remaining = requiredQuantity
    const now = new Date()
    
    for (const batch of batches.data) {
      if (remaining <= 0) break
      
      // 检查是否过期
      const expireDate = new Date(batch.expireDate)
      if (expireDate < now) {
        console.warn(`批次 ${batch.batch} 已过期，跳过`)
        continue
      }
      
      // 检查是否近效期（90天内）
      const daysToExpire = Math.floor((expireDate - now) / (1000 * 60 * 60 * 24))
      const isNearExpiry = daysToExpire <= 90
      
      // 从当前批次分配
      const allocateQty = Math.min(remaining, batch.quantity)
      
      console.log(`从批次 ${batch.batch} 分配 ${allocateQty}，剩余库存 ${batch.quantity}`)
      
      allocation.push({
        batchId: batch._id,
        batch: batch.batch,
        quantity: allocateQty,
        availableQuantity: batch.quantity,
        expireDate: batch.expireDate,
        productionDate: batch.productionDate,
        price: batch.price || 0,
        isNearExpiry: isNearExpiry,
        daysToExpire: daysToExpire,
        location: batch.location,
        // 添加药材基本信息
        drugId: batch.drugId,
        drugName: batch.drugName,
        specification: batch.specification,
        unit: batch.unit
      })
      
      remaining -= allocateQty
    }
    
    console.log('分配完成，共分配批次数:', allocation.length)
    console.log('剩余未分配数量:', remaining)
    
    // 5. 返回分配结果
    return {
      success: true,
      data: {
        allocation: allocation,
        totalAllocated: requiredQuantity - remaining,
        batchCount: allocation.length,
        hasNearExpiry: allocation.some(a => a.isNearExpiry)
      },
      message: `成功分配 ${allocation.length} 个批次`
    }
    
  } catch (err) {
    console.error('FIFO分配失败:', err)
    return {
      success: false,
      message: err.message || 'FIFO分配失败'
    }
  }
}

