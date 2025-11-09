// 云函数：获取用户列表（仅管理员）
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 验证权限：管理员和项目经理可查看用户列表
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
        message: '权限不足，仅管理员和项目经理可查看用户列表'
      }
    }
    
    // 获取所有用户
    const userRes = await db.collection('users')
      .orderBy('createTime', 'desc')
      .get()
    
    // 处理数据
    const users = userRes.data.map(user => ({
      _id: user._id,
      openid: user.openid,
      name: user.name,
      realName: user.realName || user.name, // 实名
      nickname: user.nickname || user.name,
      phone: user.phone,
      role: user.role,
      roleText: getRoleText(user.role),
      status: user.status,
      statusText: user.status === 'active' ? '启用' : '禁用',
      createTime: user.createTime,
      lastLogin: user.lastLogin
    }))
    
    return {
      code: 0,
      message: '获取成功',
      data: users
    }
  } catch (err) {
    console.error('获取用户列表失败:', err)
    return {
      code: -1,
      message: '获取失败',
      error: err.message
    }
  }
}

function getRoleText(role) {
  const roleMap = {
    'admin': '管理员',
    'project_manager': '项目经理',
    'doctor': '医生',
    'pharmacy': '药房人员',
    'viewer': '查看者'
  }
  return roleMap[role] || '未知角色'
}





























