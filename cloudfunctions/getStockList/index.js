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

// 获取库存列表（按药材汇总），支持通用筛选和近效期自定义天数
async function getStockList(data) {
  const {
    keyword = '',
    // 默认只查询总库（drug_storage），如需全园区统计可显式传入 'all'
    location = 'drug_storage',
    stockFilter = 'all',
    expiryFilter = 'all',
    customExpiryDays = null,
    page = 1,
    pageSize = 20
  } = data
  
  // 构建查询条件
  const whereCondition = {}
  if (location && location !== 'all') {
    whereCondition.location = location
  }
  if (keyword) {
    // 简单按名称/规格模糊匹配
    whereCondition.drugName = db.RegExp({
      regexp: keyword,
      options: 'i'
    })
  }

  // 查询所有符合条件的库存记录
  const res = await db.collection('stock')
    .where(whereCondition)
    .get()

  const records = res.data || []

  const now = new Date()

  // 在云函数中按 drugId 汇总
  const groupedMap = {}
  for (const item of records) {
    const drugId = item.drugId || 'unknown'
    if (!groupedMap[drugId]) {
      groupedMap[drugId] = {
        _id: drugId,
        drugName: item.drugName || '',
        spec: item.spec || item.specification || '',
        unit: item.unit || '',
        totalQuantity: 0,
        minStock: item.minStock || 0,
        minDaysToExpiry: null,
        batches: []
      }
    }
    const group = groupedMap[drugId]
    const qty = item.quantity || 0
    group.totalQuantity += qty

    let daysToExpiry = null
    if (item.expireDate) {
      const expireDate = new Date(item.expireDate)
      daysToExpiry = Math.floor((expireDate - now) / (1000 * 60 * 60 * 24))
      if (group.minDaysToExpiry === null || daysToExpiry < group.minDaysToExpiry) {
        group.minDaysToExpiry = daysToExpiry
      }
    }

    // 仅保留有库存的批次，避免前端看到数量为 0 的批次
    if (qty > 0) {
      group.batches.push({
        batch: item.batch,
        quantity: qty,
        expireDate: item.expireDate,
        status: item.status,
        daysToExpiry
      })
    }
  }

  let allList = Object.values(groupedMap)

  // 按库存状态过滤
  allList = allList.filter(item => {
    const qty = item.totalQuantity || 0
    const minStock = item.minStock || 10
    switch (stockFilter) {
      case 'inStock':
        return qty > 0
      case 'sufficient':
        return qty > minStock
      case 'warning':
        return qty > 0 && qty <= minStock
      case 'low':
        return qty > 0 && qty < minStock
      case 'empty':
        return qty <= 0
      case 'all':
      default:
        // 查询全部时，也只看有库存的药材
        return qty > 0
    }
  })

  // 按效期状态过滤（以最早到期批次为准）
  allList = allList.filter(item => {
    const d = item.minDaysToExpiry
    if (d === null || typeof d !== 'number') {
      // 没有效期信息时，仅在选择“全部/正常”时保留
      if (customExpiryDays && customExpiryDays > 0) {
        // 自定义天数时，没有效期信息的记录忽略
        return false
      }
      return expiryFilter === 'all' || expiryFilter === 'normal'
    }

    // 自定义近效期天数优先
    if (customExpiryDays && customExpiryDays > 0) {
      return d >= 0 && d <= customExpiryDays
    }

    switch (expiryFilter) {
      case 'normal':
        return d > 90
      case 'expiring30':
        return d >= 0 && d <= 30
      case 'expiring60':
        return d >= 0 && d <= 60
      case 'expiring90':
        return d >= 0 && d <= 90
      case 'expired':
        return d < 0
      case 'all':
      default:
        return true
    }
  })
  // 简单按照药名排序，提升前端可读性
  allList.sort((a, b) => (a.drugName || '').localeCompare(b.drugName || ''))

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const pagedList = allList.slice(start, end)

  return {
    success: true,
    data: pagedList,
    total: allList.length
  }
}

// 获取批次列表（按药材和园区）
async function getBatchList(data) {
  const {
    drugId,
    location = 'all',
    hideExpired = true
  } = data
  
  if (!drugId) {
    throw new Error('药材ID不能为空')
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

// 检查近效期和过期药材
async function checkExpiry(data) {
  const { days = 90 } = data
  
  const now = new Date()
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  
  // 近效期药材
  const nearExpiry = await db.collection('stock')
    .where({
      expireDate: _.and(_.gte(now.toISOString()), _.lte(futureDate.toISOString())),
      quantity: _.gt(0)
    })
    .orderBy('expireDate', 'asc')
    .get()
  
  // 已过期药材
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

