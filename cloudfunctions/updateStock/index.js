// 云函数：更新库存
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { type, recordId } = event
  
  try {
    // 根据单据类型更新库存
    switch (type) {
      case 'in':
        return await handleInStock(recordId)
      case 'out':
        return await handleOutStock(recordId)
      case 'transfer':
        return await handleTransfer(recordId)
      case 'consume':
        return await handleConsume(recordId)
      case 'requisition':
        return await handleRequisition(recordId)
      case 'inventory':
        return await handleInventory(recordId)
      case 'damage':
        return await handleDamage(recordId)
      case 'return':
        return await handleReturn(recordId)
      default:
        return { code: -1, message: '未知的操作类型' }
    }
  } catch (err) {
    console.error('更新库存失败:', err)
    return { code: -1, message: err.message }
  }
}

// 处理入库
async function handleInStock(recordId) {
  const record = await db.collection('in_records').doc(recordId).get()
  const items = record.data.items
  
  for (const item of items) {
    // 查找是否存在该批次
    const stockRes = await db.collection('stock')
      .where({
        drugId: item.drugId,
        batch: item.batch
      })
      .get()
    
    if (stockRes.data.length > 0) {
      // 批次已存在，增加数量
      const stockId = stockRes.data[0]._id
      await db.collection('stock').doc(stockId).update({
        data: {
          quantity: _.inc(item.quantity),
          updateTime: db.serverDate()
        }
      })
    } else {
      // 批次不存在，新增
      await db.collection('stock').add({
        data: {
          drugId: item.drugId,
          drugName: item.drugName,
          spec: item.spec,
          unit: item.unit,
          manufacturer: item.manufacturer,
          batch: item.batch,
          productionDate: item.productionDate,
          expireDate: item.expireDate,
          quantity: item.quantity,
          price: item.price || 0,
          location: 'land_park', // 默认陆园
          status: 'normal',
          updateTime: db.serverDate()
        }
      })
    }
  }
  
  return { code: 0, message: '入库成功' }
}

// 处理出库
async function handleOutStock(recordId) {
  const record = await db.collection('out_records').doc(recordId).get()
  const items = record.data.items
  const location = record.data.location // 出库园区
  
  for (const item of items) {
    await db.collection('stock')
      .where({
        drugId: item.drugId,
        batch: item.batch,
        location: location // 从指定园区扣减
      })
      .update({
        data: {
          quantity: _.inc(-item.quantity),
          updateTime: db.serverDate()
        }
      })
  }
  
  return { code: 0, message: '出库成功' }
}

// 处理园区调拨
async function handleTransfer(recordId) {
  const record = await db.collection('transfer_records').doc(recordId).get()
  const items = record.data.items
  const fromLocation = record.data.fromLocation
  const toLocation = record.data.toLocation
  
  for (const item of items) {
    // 调出方库存减少
    await db.collection('stock')
      .where({
        drugId: item.drugId,
        batch: item.batch,
        location: fromLocation
      })
      .update({
        data: {
          quantity: _.inc(-item.quantity),
          updateTime: db.serverDate()
        }
      })
    
    // 调入方库存增加
    const stockRes = await db.collection('stock')
      .where({
        drugId: item.drugId,
        batch: item.batch,
        location: toLocation
      })
      .get()
    
    if (stockRes.data.length > 0) {
      const stockId = stockRes.data[0]._id
      await db.collection('stock').doc(stockId).update({
        data: {
          quantity: _.inc(item.quantity),
          updateTime: db.serverDate()
        }
      })
    } else {
      await db.collection('stock').add({
        data: {
          drugId: item.drugId,
          drugName: item.drugName,
          spec: item.spec,
          unit: item.unit,
          manufacturer: item.manufacturer,
          batch: item.batch,
          expireDate: item.expireDate,
          quantity: item.quantity,
          location: toLocation,
          status: 'normal',
          updateTime: db.serverDate()
        }
      })
    }
  }
  
  return { code: 0, message: '调拨成功' }
}

// 处理消耗
async function handleConsume(recordId) {
  const record = await db.collection('consume_records').doc(recordId).get()
  const items = record.data.items
  const location = record.data.location // 消耗园区
  
  for (const item of items) {
    await db.collection('stock')
      .where({
        drugId: item.drugId,
        batch: item.batch,
        location: location // 从指定园区扣减
      })
      .update({
        data: {
          quantity: _.inc(-item.quantity),
          updateTime: db.serverDate()
        }
      })
  }
  
  return { code: 0, message: '消耗记录成功' }
}

// 处理请领
async function handleRequisition(recordId) {
  const record = await db.collection('requisition_records').doc(recordId).get()
  const items = record.data.items
  const location = record.data.location // 请领园区
  
  for (const item of items) {
    await db.collection('stock')
      .where({
        drugId: item.drugId,
        batch: item.batch,
        location: location // 从指定园区扣减
      })
      .update({
        data: {
          quantity: _.inc(-item.quantity),
          updateTime: db.serverDate()
        }
      })
  }
  
  return { code: 0, message: '请领成功' }
}

// 处理盘点
async function handleInventory(recordId) {
  const record = await db.collection('inventory_records').doc(recordId).get()
  const items = record.data.items
  
  for (const item of items) {
    // 根据实盘数量更新库存
    await db.collection('stock')
      .where({
        drugId: item.drugId,
        batch: item.batch
      })
      .update({
        data: {
          quantity: item.actualQuantity,
          updateTime: db.serverDate()
        }
      })
  }
  
  return { code: 0, message: '盘点成功' }
}

// 处理报损
async function handleDamage(recordId) {
  const record = await db.collection('damage_records').doc(recordId).get()
  const items = record.data.items
  // TODO: 报损是否需要区分园区？建议添加 location 字段
  
  for (const item of items) {
    await db.collection('stock')
      .where({
        drugId: item.drugId,
        batch: item.batch
        // location: record.data.location // 如果需要区分园区，取消此注释
      })
      .update({
        data: {
          quantity: _.inc(-item.quantity),
          updateTime: db.serverDate()
        }
      })
  }
  
  return { code: 0, message: '报损成功' }
}

// 处理退货
async function handleReturn(recordId) {
  const record = await db.collection('return_records').doc(recordId).get()
  const items = record.data.items
  // TODO: 退货是否需要区分园区？建议添加 location 字段
  
  for (const item of items) {
    await db.collection('stock')
      .where({
        drugId: item.drugId,
        batch: item.batch
        // location: record.data.location // 如果需要区分园区，取消此注释
      })
      .update({
        data: {
          quantity: _.inc(-item.quantity),
          updateTime: db.serverDate()
        }
      })
  }
  
  return { code: 0, message: '退货成功' }
}


