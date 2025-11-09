// 云函数：更新用户状态（启用/禁用）（仅管理员）
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { userId, status } = event
  
  try {
    // 1. 验证操作者权限（必须是管理员）
    const adminRes = await db.collection('users')
      .where({
        openid: wxContext.OPENID,
        role: 'admin',
        status: 'active'
      })
      .get()
    
    if (adminRes.data.length === 0) {
      return {
        code: 403,
        message: '权限不足，仅管理员可修改用户状态'
      }
    }
    
    // 2. 验证参数
    if (!userId || !status) {
      return {
        code: 400,
        message: '参数不完整'
      }
    }
    
    if (!['active', 'inactive'].includes(status)) {
      return {
        code: 400,
        message: '状态值不合法'
      }
    }
    
    // 3. 检查用户是否存在
    const userRes = await db.collection('users').doc(userId).get()
    if (!userRes.data) {
      return {
        code: 404,
        message: '用户不存在'
      }
    }
    
    // 4. 不能禁用自己
    if (userRes.data.openid === wxContext.OPENID && status === 'inactive') {
      return {
        code: 403,
        message: '不能禁用自己的账号'
      }
    }
    
    // 5. 如果要禁用管理员，检查是否是最后一个
    if (userRes.data.role === 'admin' && status === 'inactive') {
      const adminCount = await db.collection('users')
        .where({
          role: 'admin',
          status: 'active'
        })
        .count()
      
      if (adminCount.total <= 1) {
        return {
          code: 403,
          message: '不能禁用最后一个管理员账号'
        }
      }
    }
    
    // 6. 更新状态
    await db.collection('users').doc(userId).update({
      data: {
        status,
        updateTime: db.serverDate()
      }
    })
    
    // 7. 记录操作日志
    await db.collection('operation_logs').add({
      data: {
        operator: wxContext.OPENID,
        operatorName: adminRes.data[0].name,
        action: status === 'active' ? 'enable_user' : 'disable_user',
        target: userId,
        details: {
          name: userRes.data.name,
          oldStatus: userRes.data.status,
          newStatus: status
        },
        timestamp: db.serverDate()
      }
    })
    
    return {
      code: 0,
      message: status === 'active' ? '启用成功' : '禁用成功'
    }
  } catch (err) {
    console.error('更新用户状态失败:', err)
    return {
      code: -1,
      message: '操作失败',
      error: err.message
    }
  }
}





























