/**
 * API 接口封装
 */
import Request from './request.js'

// 导出通用的 callFunction 方法
export const callFunction = (name, data, showLoading) => {
	return Request.callFunction(name, data, showLoading)
}

// ==================== 入库单相关 ====================

/**
 * 创建入库单
 */
export const createInRecord = (data) => {
	return Request.callFunction('inRecords', {
		action: 'create',
		data
	})
}

/**
 * 获取入库单列表
 */
export const getInRecordList = (params) => {
	return Request.callFunction('inRecords', {
		action: 'getList',
		data: params
	}, false)
}

/**
 * 获取入库单详情
 */
export const getInRecordDetail = (id) => {
	return Request.callFunction('inRecords', {
		action: 'getDetail',
		data: { _id: id }
	})
}

/**
 * 更新入库单
 */
export const updateInRecord = (data) => {
	return Request.callFunction('inRecords', {
		action: 'update',
		data
	})
}

/**
 * 删除入库单
 */
export const deleteInRecord = (id) => {
	return Request.callFunction('inRecords', {
		action: 'delete',
		data: { _id: id }
	})
}

/**
 * 复核通过入库单
 */
export const approveInRecord = (data) => {
	return Request.callFunction('inRecords', {
		action: 'approve',
		data
	})
}

/**
 * 驳回入库单
 */
export const rejectInRecord = (data) => {
	return Request.callFunction('inRecords', {
		action: 'reject',
		data
	})
}

/**
 * 获取入库单各状态数量
 */
export const getInRecordCounts = () => {
	return Request.callFunction('inRecords', {
		action: 'getCounts',
		data: {}
	}, false)
}

// ==================== 出库单相关 ====================

/**
 * 创建出库单
 */
export const createOutRecord = (data) => {
	return Request.callFunction('outRecords', {
		action: 'create',
		data
	})
}

/**
 * 获取出库单列表
 */
export const getOutRecordList = (params) => {
	return Request.callFunction('outRecords', {
		action: 'getList',
		data: params
	}, false)
}

/**
 * 获取出库单详情
 */
export const getOutRecordDetail = (id) => {
	return Request.callFunction('outRecords', {
		action: 'getDetail',
		data: { _id: id }
	})
}

/**
 * 更新出库单
 */
export const updateOutRecord = (data) => {
	return Request.callFunction('outRecords', {
		action: 'update',
		data
	})
}

/**
 * 删除出库单
 */
export const deleteOutRecord = (id) => {
	return Request.callFunction('outRecords', {
		action: 'delete',
		data: { _id: id }
	})
}

/**
 * 接收确认出库单
 */
export const approveOutRecord = (data) => {
	return Request.callFunction('outRecords', {
		action: 'approve',
		data
	})
}

/**
 * 驳回出库单
 */
export const rejectOutRecord = (data) => {
	return Request.callFunction('outRecords', {
		action: 'reject',
		data
	})
}

/**
 * 获取出库单各状态数量
 */
export const getOutRecordCounts = () => {
	return Request.callFunction('outRecords', {
		action: 'getCounts',
		data: {}
	}, false)
}

// ==================== 药材相关 ====================

/**
 * 获取药材列表
 */
export const getDrugList = (params) => {
	return Request.callFunction('getDrugList', params, false)
}

/**
 * 根据条形码查询药材
 */
export const getDrugByBarcode = (barcode) => {
	return Request.dbQuery('drugs', { barcode })
}

// ==================== 库存相关 ====================

/**
 * 获取库存列表
 */
export const getStockList = (params) => {
	return Request.callFunction('getStockList', {
		action: 'getList',
		...params
	}, false)
}

/**
 * 获取批次列表
 */
export const getBatchList = (params) => {
	return Request.callFunction('getStockList', {
		action: 'getBatchList',
		...params
	}, false)
}

/**
 * 获取库存详情
 */
export const getStockDetail = (id) => {
	return Request.callFunction('getStockList', {
		action: 'getDetail',
		_id: id
	})
}

/**
 * 检查效期预警
 */
export const checkExpiry = (days = 90) => {
	return Request.callFunction('getStockList', {
		action: 'checkExpiry',
		days
	}, false)
}

// ==================== 用户相关 ====================

/**
 * 登录
 */
export const login = () => {
	return Request.callFunction('login', {})
}

/**
 * 获取用户列表
 */
export const getUserList = () => {
	return Request.callFunction('getUserList', {})
}

/**
 * 获取我的OpenID
 */
export const getMyOpenId = () => {
	return Request.callFunction('getMyOpenId', {})
}

// ==================== 统计相关 ====================

/**
 * 获取今日统计数据
 */
export const getTodayStats = async () => {
	try {
		const today = new Date()
		const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
		const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
		
		// 查询今日入库
		const inRecords = await Request.dbQuery('in_records', {
			createTime: Request.dbCommand().gte(startOfDay).lt(endOfDay),
			status: 'completed'
		})
		
		// 查询今日出库
		const outRecords = await Request.dbQuery('out_records', {
			createTime: Request.dbCommand().gte(startOfDay).lt(endOfDay),
			status: 'completed'
		})
		
		// 计算数量
		const inQuantity = inRecords.reduce((sum, record) => {
			return sum + record.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
		}, 0)
		
		const outQuantity = outRecords.reduce((sum, record) => {
			return sum + record.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
		}, 0)
		
		return {
			in: inQuantity,
			out: outQuantity,
			consume: 0, // TODO: 从消耗记录查询
			requisition: 0 // TODO: 从请领记录查询
		}
	} catch (err) {
		console.error('获取今日统计失败:', err)
		return {
			in: 0,
			out: 0,
			consume: 0,
			requisition: 0
		}
	}
}

/**
 * 获取预警统计
 */
export const getAlertStats = async () => {
	try {
		// 获取效期预警
		const expiryData = await checkExpiry(90)
		
		// 获取待复核数量
		const inCounts = await getInRecordCounts()
		const outCounts = await getOutRecordCounts()
		
		const pendingReview = (inCounts.pending_review || 0) + (outCounts.pending_review || 0)
		
		return {
			nearExpire: expiryData.nearExpiryCount || 0,
			lowStock: 0, // TODO: 从库存预警查询
			pendingReview
		}
	} catch (err) {
		console.error('获取预警统计失败:', err)
		return {
			nearExpire: 0,
			lowStock: 0,
			pendingReview: 0
		}
	}
}

