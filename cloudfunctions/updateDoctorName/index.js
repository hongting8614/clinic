// cloudfunctions/updateDoctorName/index.js
// 批量更新门诊记录的签名医生名称（一次性使用）

const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { oldName, newName } = event
  
  if (!oldName || !newName) {
    return {
      success: false,
      message: '缺少必填参数：oldName 和 newName'
    }
  }

  try {
    // 查询所有签名医生为 oldName 的记录
    const records = []
    let skip = 0
    const limit = 100
    
    while (true) {
      const res = await db.collection('clinic_records')
        .where({
          signedByName: oldName
        })
        .skip(skip)
        .limit(limit)
        .get()
      
      if (res.data && res.data.length > 0) {
        records.push(...res.data)
        skip += limit
        
        if (res.data.length < limit) {
          break
        }
      } else {
        break
      }
    }

    console.log(`找到 ${records.length} 条记录需要更新`)

    if (records.length === 0) {
      return {
        success: true,
        message: `没有找到签名医生为"${oldName}"的记录`,
        updatedCount: 0
      }
    }

    // 批量更新记录
    let updatedCount = 0
    const errors = []

    for (const record of records) {
      try {
        await db.collection('clinic_records')
          .doc(record._id)
          .update({
            data: {
              signedByName: newName
            }
          })
        updatedCount++
      } catch (err) {
        console.error(`更新记录 ${record._id} 失败:`, err)
        errors.push({
          recordId: record._id,
          error: err.message
        })
      }
    }

    return {
      success: true,
      message: `成功更新 ${updatedCount} 条记录`,
      totalFound: records.length,
      updatedCount: updatedCount,
      errors: errors.length > 0 ? errors : undefined
    }

  } catch (error) {
    console.error('批量更新失败:', error)
    return {
      success: false,
      message: error.message || '批量更新失败'
    }
  }
}

