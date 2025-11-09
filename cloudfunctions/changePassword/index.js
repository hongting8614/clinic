// 云函数：修改密码
const cloud = require('wx-server-sdk')
const crypto = require('crypto')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { oldPassword, newPassword } = event
  
  try {
    // 1. 验证参数
    if (!oldPassword || !newPassword) {
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
    
    // 3. 查询用户
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
    
    // 4. 验证当前密码
    // 如果用户没有设置密码，oldPassword应该为空或特殊值
    if (user.password) {
      const oldPasswordHash = hashPassword(oldPassword)
      if (oldPasswordHash !== user.password) {
        return {
          code: 401,
          success: false,
          message: '当前密码错误'
        }
      }
    } else {
      // 首次设置密码，需要验证oldPassword是否为空或特殊值
      // 这里可以根据业务需求调整
      if (oldPassword && oldPassword !== '') {
        return {
          code: 401,
          success: false,
          message: '当前密码错误'
        }
      }
    }
    
    // 5. 验证新密码不能与旧密码相同
    const newPasswordHash = hashPassword(newPassword)
    if (user.password && newPasswordHash === user.password) {
      return {
        code: 400,
        success: false,
        message: '新密码不能与当前密码相同'
      }
    }
    
    // 6. 更新密码
    await db.collection('users').doc(user._id).update({
      data: {
        password: newPasswordHash,
        updateTime: db.serverDate()
      }
    })
    
    // 7. 记录操作日志
    await db.collection('operation_logs').add({
      data: {
        operator: openid,
        operatorName: user.name,
        action: 'change_password',
        target: user._id,
        details: {
          type: 'self'
        },
        timestamp: db.serverDate()
      }
    })
    
    return {
      code: 0,
      success: true,
      message: '密码修改成功'
    }
  } catch (err) {
    console.error('修改密码失败:', err)
    return {
      code: -1,
      success: false,
      message: '修改密码失败',
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

