// 云函数 - 药品管理
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event
  
  try {
    switch (action) {
      // 根据条码查询药品
      case 'getByBarcode':
        return await getByBarcode(data)
      
      // 获取药品列表
      case 'getList':
        return await getList(data)
      
      // 添加药品
      case 'add':
        return await addDrug(data)
      
      // 更新药品
      case 'update':
        return await updateDrug(data)
      
      // 删除药品
      case 'delete':
        return await deleteDrug(data)
      
      // 搜索药品（支持拼音）
      case 'search':
        return await searchDrug(data)
      
      default:
        return {
          success: false,
          message: '未知的操作类型'
        }
    }
  } catch (err) {
    console.error('云函数执行失败:', err)
    return {
      success: false,
      message: err.message || '操作失败'
    }
  }
}

// 根据条码查询药品
async function getByBarcode(data) {
  const { barcode } = data
  
  if (!barcode) {
    return {
      success: false,
      message: '条码不能为空'
    }
  }
  
  const result = await db.collection('drugs')
    .where({
      barcode: barcode
    })
    .get()
  
  if (result.data && result.data.length > 0) {
    return {
      success: true,
      data: result.data[0]
    }
  } else {
    return {
      success: false,
      message: '未找到该药品',
      notFound: true
    }
  }
}

// 获取药品列表
async function getList(data) {
  const { pageSize = 20, pageNum = 1, category = '', keyword = '' } = data
  
  let query = db.collection('drugs')
  
  // 分类筛选
  if (category) {
    query = query.where({
      category: category
    })
  }
  
  // 关键词搜索
  if (keyword) {
    query = query.where({
      name: db.RegExp({
        regexp: keyword,
        options: 'i'
      })
    })
  }
  
  // 分页
  const skip = (pageNum - 1) * pageSize
  
  const countResult = await query.count()
  const listResult = await query
    .skip(skip)
    .limit(pageSize)
    .orderBy('createTime', 'desc')
    .get()
  
  return {
    success: true,
    data: {
      list: listResult.data,
      total: countResult.total,
      pageNum: pageNum,
      pageSize: pageSize
    }
  }
}

// 添加药品
async function addDrug(data) {
  const { barcode, name, pinyin, spec, unit, manufacturer, category, isHighValue, isEmergency, remark } = data
  
  // 验证必填字段
  if (!barcode || !name || !spec || !unit) {
    return {
      success: false,
      message: '条码、名称、规格、单位不能为空'
    }
  }
  
  // 检查条码是否已存在
  const existResult = await db.collection('drugs')
    .where({
      barcode: barcode
    })
    .count()
  
  if (existResult.total > 0) {
    return {
      success: false,
      message: '该条码已存在'
    }
  }
  
  // 添加药品
  const result = await db.collection('drugs').add({
    data: {
      barcode,
      name,
      pinyin: pinyin || '',
      spec,
      unit,
      manufacturer: manufacturer || '',
      category: category || '其他',
      isHighValue: isHighValue || false,
      isEmergency: isEmergency || false,
      remark: remark || '',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }
  })
  
  return {
    success: true,
    message: '添加成功',
    data: {
      _id: result._id
    }
  }
}

// 更新药品
async function updateDrug(data) {
  const { _id, barcode, name, pinyin, spec, unit, manufacturer, category, isHighValue, isEmergency, remark } = data
  
  if (!_id) {
    return {
      success: false,
      message: '药品ID不能为空'
    }
  }
  
  // 如果修改了条码，检查新条码是否已存在
  if (barcode) {
    const existResult = await db.collection('drugs')
      .where({
        barcode: barcode,
        _id: _.neq(_id)
      })
      .count()
    
    if (existResult.total > 0) {
      return {
        success: false,
        message: '该条码已被其他药品使用'
      }
    }
  }
  
  // 构建更新数据
  const updateData = {
    updateTime: db.serverDate()
  }
  
  if (barcode !== undefined) updateData.barcode = barcode
  if (name !== undefined) updateData.name = name
  if (pinyin !== undefined) updateData.pinyin = pinyin
  if (spec !== undefined) updateData.spec = spec
  if (unit !== undefined) updateData.unit = unit
  if (manufacturer !== undefined) updateData.manufacturer = manufacturer
  if (category !== undefined) updateData.category = category
  if (isHighValue !== undefined) updateData.isHighValue = isHighValue
  if (isEmergency !== undefined) updateData.isEmergency = isEmergency
  if (remark !== undefined) updateData.remark = remark
  
  await db.collection('drugs')
    .doc(_id)
    .update({
      data: updateData
    })
  
  return {
    success: true,
    message: '更新成功'
  }
}

// 删除药品
async function deleteDrug(data) {
  const { _id } = data
  
  if (!_id) {
    return {
      success: false,
      message: '药品ID不能为空'
    }
  }
  
  await db.collection('drugs')
    .doc(_id)
    .remove()
  
  return {
    success: true,
    message: '删除成功'
  }
}

// 搜索药品（支持拼音）
async function searchDrug(data) {
  const { keyword, limit = 10 } = data
  
  if (!keyword) {
    return {
      success: false,
      message: '搜索关键词不能为空'
    }
  }
  
  // 搜索名称或拼音
  const result = await db.collection('drugs')
    .where(_.or([
      {
        name: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      },
      {
        pinyin: db.RegExp({
          regexp: keyword.toUpperCase(),
          options: 'i'
        })
      }
    ]))
    .limit(limit)
    .get()
  
  return {
    success: true,
    data: result.data
  }
}


