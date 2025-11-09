// 云函数：发送密码重置验证码
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const { wechatId } = event
  
  try {
    // 1. 验证参数
    if (!wechatId) {
      return {
        code: 400,
        success: false,
        message: '微信号不能为空'
      }
    }
    
    // 2. 验证微信号格式
    if (!/^[a-zA-Z0-9_-]{6,20}$/.test(wechatId)) {
      return {
        code: 400,
        success: false,
        message: '微信号格式不正确'
      }
    }
    
    // 3. 查询用户（通过微信号匹配）
    // 方式1：如果用户表中有wechatId字段，直接查询
    let userRes = await db.collection('users')
      .where({
        wechatId: wechatId,
        status: 'active'
      })
      .get()
    
    let matchedUser = null
    
    // 如果通过wechatId找到了用户
    if (userRes.data.length > 0) {
      matchedUser = userRes.data[0]
    } else {
      // 方式2：如果用户表中没有wechatId字段，尝试通过其他方式匹配
      // 这里可以通过手机号或其他字段匹配，或者提示用户联系管理员
      // 实际业务中，建议在用户表中添加wechatId字段
      
      // 暂时返回错误，提示用户联系管理员
      return {
        code: 404,
        success: false,
        message: '未找到该微信号对应的用户，请联系管理员或确认微信号是否正确'
      }
    }
    
    // 4. 生成6位验证码
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // 5. 保存验证码到数据库（带过期时间，5分钟有效）
    const expireTime = new Date(Date.now() + 5 * 60 * 1000) // 5分钟后过期
    
    await db.collection('verify_codes').add({
      data: {
        wechatId,
        userId: matchedUser._id,
        code: verifyCode,
        type: 'reset_password',
        expireTime: expireTime,
        used: false,
        createTime: db.serverDate()
      }
    })
    
    // 6. 发送验证码到微信
    let sendSuccess = false
    try {
      // 方式1：通过微信订阅消息发送（需要用户授权和配置模板ID）
      // 如果配置了模板ID，尝试发送订阅消息
      if (process.env.SUBSCRIBE_MESSAGE_TEMPLATE_ID && process.env.SUBSCRIBE_MESSAGE_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID') {
        await cloud.openapi.subscribeMessage.send({
          touser: matchedUser.openid,
          page: 'pages-sub/setting/reset-password',
          data: {
            thing1: { value: '密码重置验证码' },
            number2: { value: verifyCode },
            time3: { value: new Date().toLocaleString('zh-CN') }
          },
          templateId: process.env.SUBSCRIBE_MESSAGE_TEMPLATE_ID
        })
        sendSuccess = true
      }
    } catch (msgErr) {
      console.error('发送订阅消息失败:', msgErr)
      // 如果订阅消息发送失败，不影响验证码生成
      // 验证码会在返回结果中返回给前端显示
    }
    
    // 7. 记录操作日志
    await db.collection('operation_logs').add({
      data: {
        operator: matchedUser._id,
        operatorName: matchedUser.name,
        action: 'send_reset_password_code',
        target: matchedUser._id,
        details: {
          wechatId,
          codeLength: 6,
          sendMethod: sendSuccess ? 'subscribe_message' : 'page_display'
        },
        timestamp: db.serverDate()
      }
    })
    
    // 8. 返回结果
    // 如果订阅消息发送成功，不返回验证码
    // 如果订阅消息发送失败或未配置，返回验证码供页面显示
    if (sendSuccess) {
      return {
        code: 0,
        success: true,
        message: '验证码已发送到您的微信，请查收'
      }
    } else {
      // 返回验证码，前端页面显示
      return {
        code: 0,
        success: true,
        message: '验证码已生成，请查看页面提示',
        verifyCode: verifyCode // 返回验证码，前端显示
      }
    }
  } catch (err) {
    console.error('发送验证码失败:', err)
    return {
      code: -1,
      success: false,
      message: '发送验证码失败',
      error: err.message
    }
  }
}

