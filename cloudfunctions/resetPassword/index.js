// 云函数：重置密码
const cloud = require('wx-server-sdk')
const crypto = require('crypto')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const { wechatId, verifyToken, newPassword } = event
  
  try {
    // 1. 验证参数
    if (!wechatId || !verifyToken || !newPassword) {
      return {
        code: 400,
        success: false,
        message: '参数不完整'
      }
    }
    
    // 2. 验证新密码格式
    if (newPassword.length < 8) {
      return {
        code: 400,
        success: false,
        message: '密码长度不能少于8位'
      }
    }
    
    if (!/[A-Z]/.test(newPassword)) {
      return {
        code: 400,
        success: false,
        message: '密码必须包含至少一个大写字母'
      }
    }
    
    if (!/[a-z]/.test(newPassword)) {
      return {
        code: 400,
        success: false,
        message: '密码必须包含至少一个小写字母'
      }
    }
    
    if (!/[0-9]/.test(newPassword)) {
      return {
        code: 400,
        success: false,
        message: '密码必须包含至少一个数字'
      }
    }
    
    // 3. 验证token
    const tokenRes = await db.collection('reset_password_tokens')
      .where({
        wechatId,
        token: verifyToken,
        used: false
      })
      .orderBy('createTime', 'desc')
      .limit(1)
      .get()
    
    if (tokenRes.data.length === 0) {
      return {
        code: 404,
        success: false,
        message: '验证token不存在或已使用'
      }
    }
    
    const tokenRecord = tokenRes.data[0]
    
    // 4. 检查token是否过期
    const now = new Date()
    const expireTime = new Date(tokenRecord.expireTime)
    
    if (now > expireTime) {
      // 标记为已使用
      await db.collection('reset_password_tokens').doc(tokenRecord._id).update({
        data: {
          used: true,
          updateTime: db.serverDate()
        }
      })
      
      return {
        code: 400,
        success: false,
        message: '验证token已过期，请重新获取验证码'
      }
    }
    
    // 5. 查询用户
    const userRes = await db.collection('users').doc(tokenRecord.userId).get()
    if (!userRes.data) {
      return {
        code: 404,
        success: false,
        message: '用户不存在'
      }
    }
    
    const user = userRes.data
    
    // 6. 加密新密码
    const passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex')
    
    // 7. 更新密码
    await db.collection('users').doc(user._id).update({
      data: {
        password: passwordHash,
        updateTime: db.serverDate()
      }
    })
    
    // 8. 标记token为已使用
    await db.collection('reset_password_tokens').doc(tokenRecord._id).update({
      data: {
        used: true,
        updateTime: db.serverDate()
      }
    })
    
    // 9. 记录操作日志
    await db.collection('operation_logs').add({
      data: {
        operator: user._id,
        operatorName: user.name,
        action: 'reset_password',
        target: user._id,
        details: {
          wechatId,
          type: 'forgot_password'
        },
        timestamp: db.serverDate()
      }
    })
    
    return {
      code: 0,
      success: true,
      message: '密码重置成功'
    }
  } catch (err) {
    console.error('重置密码失败:', err)
    return {
      code: -1,
      success: false,
      message: '重置密码失败',
      error: err.message
    }
  }
}

/**
 * 密码加密（使用SHA256）
 * @param {string} password - 明文密码
 * @returns {string} 加密后的密码
 */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

