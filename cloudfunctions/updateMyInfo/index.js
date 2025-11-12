// 云函数：更新个人信息（用户自行修改）
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { realName, avatarUrl, wechatAvatarUrl, updates } = event
  
  try {
    // 查询用户
    const userRes = await db.collection('users')
      .where({ openid, status: 'active' })
      .get()
    
    if (userRes.data.length === 0) {
      return {
        code: 404,
        success: false,
        message: '用户不存在或已被禁用'
      }
    }
    
    const user = userRes.data[0]
    
    // 准备更新数据
    const updateData = {
      updateTime: db.serverDate()
    }
    
    let action = 'update_info'
    let details = {}
    
    // 处理实名更新
    if (realName !== undefined) {
      // 验证实名格式（中文姓名，2-10个字符）
      if (realName && !/^[\u4e00-\u9fa5]{2,10}$/.test(realName)) {
        return {
          code: 400,
          success: false,
          message: '实名格式不正确，请输入2-10个中文字符'
        }
      }
      updateData.realName = realName
      action = 'update_realname'
      details.oldRealName = user.realName || ''
      details.newRealName = realName
    }
    
    // 处理头像更新
    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl
      updateData.avatarUpdateTime = db.serverDate()
      action = 'update_avatar'
      details.avatarType = 'custom'
    }
    
    if (wechatAvatarUrl !== undefined) {
      updateData.wechatAvatarUrl = wechatAvatarUrl
      updateData.avatarUpdateTime = db.serverDate()
      action = 'update_avatar'
      details.avatarType = 'wechat'
    }
    
    // 处理批量更新
    if (updates && typeof updates === 'object') {
      Object.assign(updateData, updates)
    }
    
    // 更新用户信息
    await db.collection('users').doc(user._id).update({
      data: updateData
    })
    
    // 记录操作日志
    await db.collection('operation_logs').add({
      data: {
        operator: openid,
        operatorName: user.name,
        action: action,
        target: user._id,
        details: details,
        timestamp: db.serverDate()
      }
    })
    
    return {
      code: 0,
      success: true,
      message: '信息更新成功'
    }
  } catch (err) {
    console.error('更新信息失败:', err)
    return {
      code: -1,
      success: false,
      message: '更新信息失败',
      error: err.message
    }
  }
}

