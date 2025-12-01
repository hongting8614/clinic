// 药材列表查询云函数
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const {
    keyword = '',
    category = 'all',
    page = 1,
    pageSize = 20
  } = event
  
  try {
    let query = db.collection('drugs')
    let whereCondition = {}
    
    // 关键词搜索（药材名称或拼音）
    if (keyword) {
      whereCondition = _.or([
        {
          name: db.RegExp({
            regexp: keyword,
            options: 'i'
          })
        },
        {
          pinyin: db.RegExp({
            regexp: keyword,
            options: 'i'
          })
        }
      ])
    }
    
    // 分类筛选
    if (category && category !== 'all') {
      if (keyword) {
        whereCondition = _.and([
          whereCondition,
          { category }
        ])
      } else {
        whereCondition.category = category
      }
    }
    
    if (Object.keys(whereCondition).length > 0) {
      query = query.where(whereCondition)
    }
    
    // 查询总数
    const countResult = await query.count()
    
    // 分页查询
    const result = await query
      .orderBy('name', 'asc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
    
    return {
      success: true,
      data: result.data,
      total: countResult.total,
      page,
      pageSize
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: err.message || '查询失败',
      data: []
    }
  }
}

