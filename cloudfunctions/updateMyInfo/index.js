// 云函数：更新个人信息（用户自行修改）
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { realName } = event
  
  try {
    // 1. 验证参数
    if (!realName) {
      return {
        code: 400,
        success: false,
        message: '实名不能为空'
      }
    }
    
    // 2. 验证实名格式（中文姓名，2-10个字符）
    if (!/^[\u4e00-\u9fa5]{2,10}$/.test(realName)) {
      return {
        code: 400,
        success: false,
        message: '实名格式不正确，请输入2-10个中文字符'
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
    
    // 4. 更新实名
    await db.collection('users').doc(user._id).update({
      data: {
        realName,
        updateTime: db.serverDate()
      }
    })
    
    // 5. 记录操作日志
    await db.collection('operation_logs').add({
      data: {
        operator: openid,
        operatorName: user.name,
        action: 'update_realname',
        target: user._id,
        details: {
          oldRealName: user.realName || '',
          newRealName: realName
        },
        timestamp: db.serverDate()
      }
    })
    
    return {
      code: 0,
      success: true,
      message: '实名修改成功'
    }
  } catch (err) {
    console.error('修改实名失败:', err)
    return {
      code: -1,
      success: false,
      message: '修改实名失败',
      error: err.message
    }
  }
}

