// 库存查询云函数
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const {
    action = 'getList',
    ...data
  } = event
  
  try {
    switch (action) {
      case 'getList':
        return await getStockList(data)
      case 'getBatchList':
        return await getBatchList(data)
      case 'getDetail':
        return await getStockDetail(data)
      case 'checkExpiry':
        return await checkExpiry(data)
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

// 获取库存列表（按药品汇总）
async function getStockList(data) {
  const {
    keyword = '',
    location = 'all',
    page = 1,
    pageSize = 20
  } = data
  
  // 使用聚合查询汇总库存
  const result = await db.collection('stock')
    .aggregate()
    .match(location !== 'all' ? { location } : {})
    .group({
      _id: '$drugId',
      drugName: _.$.first('$drugName'),
      spec: _.$.first('$spec'),
      unit: _.$.first('$unit'),
      totalQuantity: _.$.sum('$quantity'),
      batches: _.$.push({
        batch: '$batch',
        quantity: '$quantity',
        expireDate: '$expireDate',
        status: '$status'
      })
    })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .end()
  
  return {
    success: true,
    data: result.list,
    total: result.list.length
  }
}

// 获取批次列表（按药品和园区）
async function getBatchList(data) {
  const {
    drugId,
    location = 'all',
    hideExpired = true
  } = data
  
  if (!drugId) {
    throw new Error('药品ID不能为空')
  }
  
  let whereCondition = { drugId }
  
  if (location && location !== 'all') {
    whereCondition.location = location
  }
  
  // 是否隐藏过期批次
  if (hideExpired) {
    whereCondition.status = _.neq('expired')
  }
  
  const result = await db.collection('stock')
    .where(whereCondition)
    .orderBy('expireDate', 'asc')
    .get()
  
  // 计算距离过期天数
  const now = new Date()
  const stockList = result.data.map(item => {
    const expireDate = new Date(item.expireDate)
    const daysToExpire = Math.floor((expireDate - now) / (1000 * 60 * 60 * 24))
    
    return {
      ...item,
      daysToExpire,
      isExpired: daysToExpire < 0,
      isNearExpiry: daysToExpire >= 0 && daysToExpire <= 90
    }
  })
  
  return {
    success: true,
    data: stockList
  }
}

// 获取库存详情
async function getStockDetail(data) {
  const { _id } = data
  
  if (!_id) {
    throw new Error('库存ID不能为空')
  }
  
  const result = await db.collection('stock').doc(_id).get()
  
  if (!result.data) {
    throw new Error('库存记录不存在')
  }
  
  return {
    success: true,
    data: result.data
  }
}

// 检查近效期和过期药品
async function checkExpiry(data) {
  const { days = 90 } = data
  
  const now = new Date()
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  
  // 近效期药品
  const nearExpiry = await db.collection('stock')
    .where({
      expireDate: _.and(_.gte(now.toISOString()), _.lte(futureDate.toISOString())),
      quantity: _.gt(0)
    })
    .orderBy('expireDate', 'asc')
    .get()
  
  // 已过期药品
  const expired = await db.collection('stock')
    .where({
      expireDate: _.lt(now.toISOString()),
      quantity: _.gt(0)
    })
    .orderBy('expireDate', 'desc')
    .get()
  
  return {
    success: true,
    data: {
      nearExpiry: nearExpiry.data,
      nearExpiryCount: nearExpiry.data.length,
      expired: expired.data,
      expiredCount: expired.data.length
    }
  }
}

