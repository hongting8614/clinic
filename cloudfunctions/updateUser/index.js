// 云函数：更新用户信息（仅管理员）
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { userId, name, nickname, phone, role, realName } = event
  
  try {
    // 1. 验证操作者权限（必须是管理员或项目经理）
    const operatorRes = await db.collection('users')
      .where({
        openid: wxContext.OPENID,
        status: 'active'
      })
      .get()
    
    if (operatorRes.data.length === 0) {
      return {
        code: 403,
        message: '用户不存在或已被禁用'
      }
    }
    
    const operator = operatorRes.data[0]
    if (operator.role !== 'admin' && operator.role !== 'project_manager') {
      return {
        code: 403,
        message: '权限不足，仅管理员和项目经理可编辑用户'
      }
    }
    
    // 2. 验证参数
    if (!userId || !name || !phone || !role) {
      return {
        code: 400,
        message: '参数不完整'
      }
    }
    
    // 验证实名格式（如果提供）
    if (realName && !/^[\u4e00-\u9fa5]{2,10}$/.test(realName)) {
      return {
        code: 400,
        message: '实名格式不正确，请输入2-10个中文字符'
      }
    }
    
    // 验证角色是否合法（与前端角色选项保持一致）
    const validRoles = ['admin', 'project_manager', 'doctor', 'viewer']
    if (!validRoles.includes(role)) {
      return {
        code: 400,
        message: `角色不合法，只能是：${validRoles.join(', ')}`
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
    
    // 4. 不能修改自己的角色（防止误操作导致失去管理员权限）
    if (userRes.data.openid === wxContext.OPENID && userRes.data.role !== role) {
      return {
        code: 403,
        message: '不能修改自己的角色'
      }
    }
    
    // 5. 更新用户信息
    const updateData = {
      name,
      nickname: nickname || name,
      phone,
      role,
      updateTime: db.serverDate()
    }
    
    // 如果提供了实名，则更新
    if (realName) {
      updateData.realName = realName
    }
    
    await db.collection('users').doc(userId).update({
      data: updateData
    })
    
    // 6. 记录操作日志
    await db.collection('operation_logs').add({
      data: {
        operator: wxContext.OPENID,
        operatorName: operator.name,
        action: 'update_user',
        target: userId,
        details: {
          name,
          realName,
          phone,
          role,
          oldRole: userRes.data.role
        },
        timestamp: db.serverDate()
      }
    })
    
    return {
      code: 0,
      message: '更新成功'
    }
  } catch (err) {
    console.error('更新用户失败:', err)
    return {
      code: -1,
      message: '更新失败',
      error: err.message
    }
  }
}





























