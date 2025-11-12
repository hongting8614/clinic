// 云函数：清空所有入库单（测试用）
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  try {
    // 1. 检查权限（仅管理员可执行）
    const userRes = await db.collection('users')
      .where({ openid, status: 'active' })
      .get()
    
    if (userRes.data.length === 0) {
      return {
        code: 403,
        success: false,
        message: '您不在系统白名单内'
      }
    }
    
    const user = userRes.data[0]
    
    // 只有管理员可以清空数据
    if (user.role !== 'admin') {
      return {
        code: 403,
        success: false,
        message: '只有管理员可以执行此操作'
      }
    }
    
    // 2. 查询所有入库单
    const recordsRes = await db.collection('in_records')
      .get()
    
    const totalCount = recordsRes.data.length
    
    if (totalCount === 0) {
      return {
        code: 0,
        success: true,
        message: '没有需要删除的入库单',
        deletedCount: 0
      }
    }
    
    // 3. 批量删除所有入库单
    const deletePromises = recordsRes.data.map(record => {
      return db.collection('in_records').doc(record._id).remove()
    })
    
    await Promise.all(deletePromises)
    
    // 4. 记录操作日志
    await db.collection('operation_logs').add({
      data: {
        operator: openid,
        operatorName: user.name,
        action: 'clear_in_records',
        target: 'all',
        details: {
          deletedCount: totalCount,
          reason: '测试数据清理'
        },
        timestamp: db.serverDate()
      }
    })
    
    return {
      code: 0,
      success: true,
      message: `成功删除 ${totalCount} 条入库单`,
      deletedCount: totalCount
    }
  } catch (err) {
    console.error('清空入库单失败:', err)
    return {
      code: -1,
      success: false,
      message: '清空失败',
      error: err.message
    }
  }
}


