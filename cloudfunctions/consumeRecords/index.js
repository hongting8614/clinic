// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { action } = event

  try {
    switch (action) {
      case 'add':
        return await addRecord(event, wxContext)
      case 'list':
        return await getList(event, wxContext)
      case 'detail':
        return await getDetail(event, wxContext)
      case 'update':
        return await updateRecord(event, wxContext)
      case 'delete':
        return await deleteRecord(event, wxContext)
      case 'getStats':
        return await getStats(event, wxContext)
      default:
        return {
          success: false,
          message: '未知操作'
        }
    }
  } catch (err) {
    console.error('云函数执行错误:', err)
    return {
      success: false,
      message: err.message || '操作失败'
    }
  }
}

/**
 * 新增消耗记录
 */
async function addRecord(event, wxContext) {
  const { date, location, locationName, items, operator, remark } = event

  // 参数验证
  if (!date || !location || !items || items.length === 0) {
    return {
      success: false,
      message: '参数不完整'
    }
  }

  // 计算总数量
  let totalQuantity = 0
  items.forEach(item => {
    totalQuantity += item.quantity
  })

  // 创建消耗记录
  const record = {
    date,
    location,
    locationName,
    items,
    operator,
    remark: remark || '',
    totalQuantity,
    createTime: db.serverDate(),
    updateTime: db.serverDate(),
    createBy: wxContext.OPENID
  }

  // 插入消耗记录
  const recordResult = await db.collection('consume_records').add({
    data: record
  })

  // 更新库存
  for (let item of items) {
    const { drugId, batch, quantity } = item

    // 查找对应的库存记录
    const stockResult = await db.collection('stock')
      .where({
        drugId,
        batch,
        location
      })
      .get()

    if (stockResult.data.length > 0) {
      const stock = stockResult.data[0]
      const newQuantity = stock.quantity - quantity

      // 更新库存数量
      await db.collection('stock').doc(stock._id).update({
        data: {
          quantity: newQuantity,
          updateTime: db.serverDate()
        }
      })
    }
  }

  return {
    success: true,
    message: '消耗记录添加成功',
    data: {
      _id: recordResult._id
    }
  }
}

/**
 * 获取消耗记录列表
 */
async function getList(event, wxContext) {
  const { date, location, pageSize = 20, pageNum = 1 } = event

  // 构建查询条件
  let where = {}
  if (date) {
    where.date = date
  }
  if (location) {
    where.location = location
  }

  // 查询记录
  const result = await db.collection('consume_records')
    .where(where)
    .orderBy('createTime', 'desc')
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .get()

  // 获取总数
  const countResult = await db.collection('consume_records')
    .where(where)
    .count()

  return {
    success: true,
    data: result.data,
    total: countResult.total
  }
}

/**
 * 获取消耗记录详情
 */
async function getDetail(event, wxContext) {
  const { id } = event

  if (!id) {
    return {
      success: false,
      message: '记录ID不能为空'
    }
  }

  const result = await db.collection('consume_records')
    .doc(id)
    .get()

  if (!result.data) {
    return {
      success: false,
      message: '记录不存在'
    }
  }

  return {
    success: true,
    data: result.data
  }
}

/**
 * 更新消耗记录
 */
async function updateRecord(event, wxContext) {
  const { id, date, location, locationName, items, operator, remark } = event

  if (!id) {
    return {
      success: false,
      message: '记录ID不能为空'
    }
  }

  // 计算总数量
  let totalQuantity = 0
  items.forEach(item => {
    totalQuantity += item.quantity
  })

  // 更新记录
  await db.collection('consume_records').doc(id).update({
    data: {
      date,
      location,
      locationName,
      items,
      operator,
      remark: remark || '',
      totalQuantity,
      updateTime: db.serverDate()
    }
  })

  return {
    success: true,
    message: '消耗记录更新成功'
  }
}

/**
 * 删除消耗记录
 */
async function deleteRecord(event, wxContext) {
  const { id } = event

  if (!id) {
    return {
      success: false,
      message: '记录ID不能为空'
    }
  }

  await db.collection('consume_records').doc(id).remove()

  return {
    success: true,
    message: '消耗记录删除成功'
  }
}

/**
 * 获取统计数据
 */
async function getStats(event, wxContext) {
  const { startDate, endDate, location } = event

  // 构建查询条件
  let where = {}
  if (startDate && endDate) {
    where.date = _.gte(startDate).and(_.lte(endDate))
  }
  if (location) {
    where.location = location
  }

  // 获取记录列表
  const result = await db.collection('consume_records')
    .where(where)
    .get()

  // 统计数据
  let totalRecords = result.data.length
  let totalQuantity = 0
  let drugSet = new Set()

  result.data.forEach(record => {
    totalQuantity += record.totalQuantity
    record.items.forEach(item => {
      drugSet.add(item.drugId)
    })
  })

  return {
    success: true,
    data: {
      totalRecords,
      totalQuantity,
      totalDrugs: drugSet.size
    }
  }
}

