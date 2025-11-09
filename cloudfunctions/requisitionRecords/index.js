// 云函数 - 请领管理
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
      // 添加请领单
      case 'add':
        return await addRequisition(event)
      
      // 获取请领单列表
      case 'getList':
        return await getList(data)
      
      // 获取请领单详情
      case 'getDetail':
        return await getDetail(data)
      
      // 更新请领单
      case 'update':
        return await updateRequisition(data)
      
      // 审批请领单
      case 'approve':
        return await approveRequisition(data)
      
      // 删除请领单
      case 'delete':
        return await deleteRequisition(data)
      
      // 统计数据
      case 'getCounts':
        return await getCounts(data)
      
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

// 添加请领单
async function addRequisition(event) {
  const { recordNo, location, requisitioner, department, purpose, drugList, requisitionerSign, status, createTime } = event
  
  const result = await db.collection('requisition_records').add({
    data: {
      recordNo,
      location,
      requisitioner,
      department: department || '',
      purpose: purpose || '',
      drugList,
      requisitionerSign: requisitionerSign || '',
      status: status || 'pending_review',
      reviewer: '',
      reviewerSign: '',
      reviewTime: null,
      reviewRemark: '',
      createTime: createTime || db.serverDate(),
      updateTime: db.serverDate()
    }
  })
  
  return {
    success: true,
    message: '提交成功',
    data: {
      _id: result._id
    }
  }
}

// 获取请领单列表
async function getList(data) {
  const { pageSize = 20, pageNum = 1, status = '', location = '' } = data
  
  let where = {}
  if (status) {
    where.status = status
  }
  if (location) {
    where.location = location
  }
  
  const skip = (pageNum - 1) * pageSize
  
  const countResult = await db.collection('requisition_records')
    .where(where)
    .count()
  
  const listResult = await db.collection('requisition_records')
    .where(where)
    .skip(skip)
    .limit(pageSize)
    .orderBy('createTime', 'desc')
    .get()
  
  return {
    success: true,
    data: {
      list: listResult.data,
      total: countResult.total,
      pageNum,
      pageSize
    }
  }
}

// 获取请领单详情
async function getDetail(data) {
  const { _id } = data
  
  if (!_id) {
    return {
      success: false,
      message: '请领单ID不能为空'
    }
  }
  
  const result = await db.collection('requisition_records')
    .doc(_id)
    .get()
  
  return {
    success: true,
    data: result.data
  }
}

// 更新请领单
async function updateRequisition(data) {
  const { _id, ...updateData } = data
  
  if (!_id) {
    return {
      success: false,
      message: '请领单ID不能为空'
    }
  }
  
  await db.collection('requisition_records')
    .doc(_id)
    .update({
      data: {
        ...updateData,
        updateTime: db.serverDate()
      }
    })
  
  return {
    success: true,
    message: '更新成功'
  }
}

// 审批请领单
async function approveRequisition(data) {
  const { _id, approved, reviewer, reviewerSign, reviewRemark } = data
  
  if (!_id) {
    return {
      success: false,
      message: '请领单ID不能为空'
    }
  }
  
  await db.collection('requisition_records')
    .doc(_id)
    .update({
      data: {
        status: approved ? 'approved' : 'rejected',
        reviewer,
        reviewerSign,
        reviewRemark: reviewRemark || '',
        reviewTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
  
  return {
    success: true,
    message: approved ? '审批通过' : '已驳回'
  }
}

// 删除请领单
async function deleteRequisition(data) {
  const { _id } = data
  
  if (!_id) {
    return {
      success: false,
      message: '请领单ID不能为空'
    }
  }
  
  await db.collection('requisition_records')
    .doc(_id)
    .remove()
  
  return {
    success: true,
    message: '删除成功'
  }
}

// 统计数据
async function getCounts(data) {
  const { location = '' } = data
  
  let where = {}
  if (location) {
    where.location = location
  }
  
  // 今日请领数
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayCount = await db.collection('requisition_records')
    .where({
      ...where,
      createTime: _.gte(today)
    })
    .count()
  
  // 待审批数
  const pendingCount = await db.collection('requisition_records')
    .where({
      ...where,
      status: 'pending_review'
    })
    .count()
  
  // 本月请领数
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  
  const monthCount = await db.collection('requisition_records')
    .where({
      ...where,
      createTime: _.gte(monthStart)
    })
    .count()
  
  return {
    success: true,
    data: {
      today: todayCount.total,
      pending: pendingCount.total,
      month: monthCount.total
    }
  }
}


