// 云函数：用户登录验证
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { wechatId } = event || {}

  try {
    // 1）先按 openid 查询用户信息
    let userRes = await db.collection('users')
      .where({ openid, status: 'active' })
      .get()

    // 2）如果当前 openid 未绑定任何账号，并且前端提供了 wechatId，则尝试按 wechatId 绑定
    if (userRes.data.length === 0 && wechatId) {
      const bindRes = await db.collection('users')
        .where({ wechatId, status: 'active' })
        .get()

      if (bindRes.data.length > 0) {
        const bindUser = bindRes.data[0]

        // 将此 wechatId 记录与当前 openid 绑定
        await db.collection('users').doc(bindUser._id).update({
          data: {
            openid,
            lastLogin: db.serverDate(),
            updateTime: db.serverDate()
          }
        })

        // 使用绑定后的用户作为当前登录用户
        userRes = { data: [{ ...bindUser, openid }] }
      }
    }

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

    // 如果是通过 openid 直接登录（非刚刚绑定），也要更新最后登录时间
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





























