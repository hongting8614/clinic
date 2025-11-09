// 云函数：添加用户（仅管理员）
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { openid, name, phone, nickname, role = 'viewer', realName, password } = event
  
  try {
    // 1. 验证操作者权限（必须是管理员或项目经理）
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
        message: '权限不足，仅管理员和项目经理可添加用户'
      }
    }
    
    // 2. 验证参数
    if (!openid || !name || !phone || !realName) {
      return {
        code: 400,
        message: '参数不完整，openid、name、phone、realName 为必填项'
      }
    }
    
    // 验证实名格式（中文姓名，2-10个字符）
    if (!/^[\u4e00-\u9fa5]{2,10}$/.test(realName)) {
      return {
        code: 400,
        message: '实名格式不正确，请输入2-10个中文字符'
      }
    }
    
    // 验证角色是否合法
    const validRoles = ['admin', 'project_manager', 'doctor', 'pharmacy', 'viewer']
    if (!validRoles.includes(role)) {
      return {
        code: 400,
        message: `角色不合法，只能是：${validRoles.join(', ')}`
      }
    }
    
    // 3. 检查用户是否已存在
    const existRes = await db.collection('users')
      .where({ openid })
      .get()
    
    if (existRes.data.length > 0) {
      return {
        code: 409,
        message: '该用户已存在，请勿重复添加'
      }
    }
    
    // 4. 处理密码（如果提供）
    let passwordHash = null
    if (password) {
      // 验证密码格式
      if (password.length < 8) {
        return {
          code: 400,
          message: '密码长度不能少于8位'
        }
      }
      if (!/[A-Z]/.test(password)) {
        return {
          code: 400,
          message: '密码必须包含至少一个大写字母'
        }
      }
      if (!/[a-z]/.test(password)) {
        return {
          code: 400,
          message: '密码必须包含至少一个小写字母'
        }
      }
      if (!/[0-9]/.test(password)) {
        return {
          code: 400,
          message: '密码必须包含至少一个数字'
        }
      }
      // 加密密码
      const crypto = require('crypto')
      passwordHash = crypto.createHash('sha256').update(password).digest('hex')
    }
    
    // 5. 添加用户
    const result = await db.collection('users').add({
      data: {
        openid,
        name,
        realName: realName || name, // 实名
        nickname: nickname || name,
        phone,
        wechatId: '', // 微信号（可选，用户可自行设置）
        role,
        password: passwordHash, // 密码（加密后）
        status: 'active',
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
        lastLogin: null
      }
    })
    
    // 6. 记录操作日志
    await db.collection('operation_logs').add({
      data: {
        operator: wxContext.OPENID,
        operatorName: operator.name,
        action: 'add_user',
        target: result._id,
        details: {
          name,
          realName,
          role,
          phone
        },
        timestamp: db.serverDate()
      }
    })
    
    return {
      code: 0,
      message: '用户添加成功',
      userId: result._id
    }
  } catch (err) {
    console.error('添加用户失败:', err)
    return {
      code: -1,
      message: '添加用户失败',
      error: err.message
    }
  }
}





























