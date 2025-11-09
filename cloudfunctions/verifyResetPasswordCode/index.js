// 云函数：验证密码重置验证码
const cloud = require('wx-server-sdk')
const crypto = require('crypto')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const { wechatId, verifyCode } = event
  
  try {
    // 1. 验证参数
    if (!wechatId || !verifyCode) {
      return {
        code: 400,
        success: false,
        message: '参数不完整'
      }
    }
    
    // 2. 验证验证码格式
    if (!/^\d{6}$/.test(verifyCode)) {
      return {
        code: 400,
        success: false,
        message: '验证码格式不正确'
      }
    }
    
    // 3. 查询验证码记录
    const codeRes = await db.collection('verify_codes')
      .where({
        wechatId,
        code: verifyCode,
        type: 'reset_password',
        used: false
      })
      .orderBy('createTime', 'desc')
      .limit(1)
      .get()
    
    if (codeRes.data.length === 0) {
      return {
        code: 404,
        success: false,
        message: '验证码不存在或已使用'
      }
    }
    
    const codeRecord = codeRes.data[0]
    
    // 4. 检查验证码是否过期
    const now = new Date()
    const expireTime = new Date(codeRecord.expireTime)
    
    if (now > expireTime) {
      // 标记为已使用（虽然已过期）
      await db.collection('verify_codes').doc(codeRecord._id).update({
        data: {
          used: true,
          updateTime: db.serverDate()
        }
      })
      
      return {
        code: 400,
        success: false,
        message: '验证码已过期，请重新获取'
      }
    }
    
    // 5. 标记验证码为已使用
    await db.collection('verify_codes').doc(codeRecord._id).update({
      data: {
        used: true,
        updateTime: db.serverDate()
      }
    })
    
    // 6. 生成验证token（用于后续重置密码）
    const token = crypto.randomBytes(32).toString('hex')
    const tokenExpireTime = new Date(Date.now() + 10 * 60 * 1000) // 10分钟后过期
    
    // 7. 保存token到数据库
    const tokenResult = await db.collection('reset_password_tokens').add({
      data: {
        wechatId,
        userId: codeRecord.userId,
        token: token,
        expireTime: tokenExpireTime,
        used: false,
        createTime: db.serverDate()
      }
    })
    
    // 8. 记录操作日志
    await db.collection('operation_logs').add({
      data: {
        operator: codeRecord.userId,
        operatorName: '系统',
        action: 'verify_reset_password_code',
        target: codeRecord.userId,
        details: {
          wechatId,
          success: true
        },
        timestamp: db.serverDate()
      }
    })
    
    return {
      code: 0,
      success: true,
      message: '验证码验证成功',
      token: token
    }
  } catch (err) {
    console.error('验证验证码失败:', err)
    return {
      code: -1,
      success: false,
      message: '验证验证码失败',
      error: err.message
    }
  }
}

