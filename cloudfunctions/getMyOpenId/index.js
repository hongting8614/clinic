// 临时云函数：获取你的OpenID
// 获取后可以删除此云函数
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  console.log('===== 用户信息 =====')
  console.log('OpenID:', wxContext.OPENID)
  console.log('AppID:', wxContext.APPID)
  console.log('==================')
  
  return {
    success: true,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    message: '获取OpenID成功！'
  }
}

