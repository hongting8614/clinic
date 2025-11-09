// 云函数：用户登录验证
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  try {
    // 查询用户信息
    const userRes = await db.collection('users')
      .where({ openid, status: 'active' })
      .get()
    
    // 用户不存在或已被禁用
    if (userRes.data.length === 0) {
      return {
        code: 403,
        authorized: false,
        message: '您不在系统白名单内，请联系管理员添加',
        openid
      }
    }
    
    const user = userRes.data[0]
    
    // 更新最后登录时间
    await db.collection('users').doc(user._id).update({
      data: {
        lastLogin: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
    
    // 返回用户信息
    return {
      code: 0,
      authorized: true,
      message: '登录成功',
      userInfo: {
        userId: user._id,
        openid: user.openid,
        name: user.name,
        realName: user.realName || user.name,
        nickname: user.nickname || user.name,
        phone: user.phone,
        role: user.role,
        roleText: getRoleText(user.role)
      }
    }
  } catch (err) {
    console.error('登录失败:', err)
    return {
      code: -1,
      authorized: false,
      message: '登录失败，请重试',
      error: err.message
    }
  }
}

// 获取角色中文名称
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





























