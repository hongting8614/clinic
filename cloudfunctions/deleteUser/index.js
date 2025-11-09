// 云函数：删除用户（仅管理员）
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { userId } = event
  
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
        message: '权限不足，仅管理员可删除用户'
      }
    }
    
    // 2. 验证参数
    if (!userId) {
      return {
        code: 400,
        message: '参数不完整'
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
    
    // 4. 不能删除自己
    if (userRes.data.openid === wxContext.OPENID) {
      return {
        code: 403,
        message: '不能删除自己的账号'
      }
    }
    
    // 5. 检查是否是最后一个管理员
    if (userRes.data.role === 'admin') {
      const adminCount = await db.collection('users')
        .where({
          role: 'admin',
          status: 'active'
        })
        .count()
      
      if (adminCount.total <= 1) {
        return {
          code: 403,
          message: '不能删除最后一个管理员账号'
        }
      }
    }
    
    // 6. 删除用户
    await db.collection('users').doc(userId).remove()
    
    // 7. 记录操作日志
    await db.collection('operation_logs').add({
      data: {
        operator: wxContext.OPENID,
        operatorName: adminRes.data[0].name,
        action: 'delete_user',
        target: userId,
        details: {
          name: userRes.data.name,
          role: userRes.data.role
        },
        timestamp: db.serverDate()
      }
    })
    
    return {
      code: 0,
      message: '删除成功'
    }
  } catch (err) {
    console.error('删除用户失败:', err)
    return {
      code: -1,
      message: '删除失败',
      error: err.message
    }
  }
}





























