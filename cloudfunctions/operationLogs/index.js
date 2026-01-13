const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()

  try {
    switch (action) {
      case 'add':
        return await addLog(data, wxContext)
      case 'list':
        return await listLogs(data, wxContext)
      case 'delete':
        return await deleteLog(data, wxContext)
      case 'clear':
        return await clearLogs(data, wxContext)
      default:
        return { success: false, message: 'Unknown action' }
    }
  } catch (e) {
    console.error('操作日志错误:', e)
    return { success: false, message: e.message || '操作失败' }
  }
}

// 添加日志
async function addLog(params, wxContext) {
  const {
    module = '',      // 模块名称：登录、门诊、库存、用户管理等
    action = '',      // 操作类型：登录、新增、修改、删除、查询、导出等
    target = '',      // 操作对象：具体的记录ID或名称
    details = '',     // 操作详情
    result = 'success', // 操作结果：success/fail
    errorMsg = ''     // 错误信息（如果失败）
  } = params

  // 获取用户信息
  const openid = wxContext.OPENID
  let userName = '未知用户'
  let userRole = ''
  
  try {
    const userRes = await db.collection('users').where({ openid }).get()
    if (userRes.data && userRes.data.length > 0) {
      const user = userRes.data[0]
      userName = user.name || '未知用户'
      userRole = user.role || ''
    }
  } catch (e) {
    console.error('获取用户信息失败:', e)
  }

  // 插入日志记录
  const logData = {
    openid,
    userName,
    userRole,
    module,
    action,
    target,
    details,
    result,
    errorMsg,
    createTime: new Date(),
    ip: wxContext.CLIENTIP || '',
    userAgent: wxContext.CLIENTIPV6 || ''
  }

  const res = await db.collection('operation_logs').add({
    data: logData
  })

  return {
    success: true,
    logId: res._id
  }
}

// 查询日志列表
async function listLogs(params, wxContext) {
  const {
    page = 1,
    pageSize = 20,
    module = '',
    action = '',
    userName = '',
    startDate = '',
    endDate = '',
    result = ''
  } = params

  // 验证权限：只有系统管理员可以查看日志
  const openid = wxContext.OPENID
  const userRes = await db.collection('users').where({ openid }).get()
  
  if (!userRes.data || userRes.data.length === 0) {
    return { success: false, message: '用户不存在' }
  }

  const user = userRes.data[0]
  if (user.role !== 'admin') {
    return { success: false, message: '无权限查看操作日志' }
  }

  // 构建查询条件
  const condition = {}
  
  if (module) {
    condition.module = module
  }
  
  if (action) {
    condition.action = action
  }
  
  if (userName) {
    condition.userName = db.RegExp({
      regexp: userName,
      options: 'i'
    })
  }
  
  if (result) {
    condition.result = result
  }
  
  if (startDate || endDate) {
    const start = startDate ? new Date(startDate + ' 00:00:00') : new Date('2020-01-01')
    const end = endDate ? new Date(endDate + ' 23:59:59') : new Date()
    condition.createTime = _.gte(start).and(_.lte(end))
  }

  // 查询总数
  const countRes = await db.collection('operation_logs').where(condition).count()
  const total = countRes.total

  // 查询列表
  const skip = (page - 1) * pageSize
  const listRes = await db.collection('operation_logs')
    .where(condition)
    .orderBy('createTime', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get()

  return {
    success: true,
    data: {
      list: listRes.data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }
}

// 删除单条日志
async function deleteLog(params, wxContext) {
  const { logId } = params

  // 验证权限
  const openid = wxContext.OPENID
  const userRes = await db.collection('users').where({ openid }).get()
  
  if (!userRes.data || userRes.data.length === 0) {
    return { success: false, message: '用户不存在' }
  }

  const user = userRes.data[0]
  if (user.role !== 'admin') {
    return { success: false, message: '无权限删除操作日志' }
  }

  await db.collection('operation_logs').doc(logId).remove()

  return { success: true, message: '删除成功' }
}

// 清空日志（可选择清空指定时间范围的日志）
async function clearLogs(params, wxContext) {
  const { beforeDate = '' } = params

  // 验证权限
  const openid = wxContext.OPENID
  const userRes = await db.collection('users').where({ openid }).get()
  
  if (!userRes.data || userRes.data.length === 0) {
    return { success: false, message: '用户不存在' }
  }

  const user = userRes.data[0]
  if (user.role !== 'admin') {
    return { success: false, message: '无权限清空操作日志' }
  }

  const condition = {}
  if (beforeDate) {
    condition.createTime = _.lt(new Date(beforeDate + ' 23:59:59'))
  }

  // 批量删除
  const MAX_LIMIT = 1000
  let hasMore = true
  let deletedCount = 0

  while (hasMore) {
    const res = await db.collection('operation_logs')
      .where(condition)
      .limit(MAX_LIMIT)
      .remove()
    
    deletedCount += res.stats.removed
    hasMore = res.stats.removed === MAX_LIMIT
  }

  return {
    success: true,
    message: `已清空 ${deletedCount} 条日志`
  }
}

