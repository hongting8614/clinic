/**
 * 云函数请求封装
 */

export default class Request {
	/**
	 * 调用云函数
	 * @param {String} name 云函数名称
	 * @param {Object} data 参数
	 * @param {Boolean} showLoading 是否显示loading
	 */
	static async callFunction(name, data = {}, showLoading = true) {
		if (showLoading) {
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
		}
		
		try {
			const res = await wx.cloud.callFunction({
				name: name,
				data: data
			})
			
			if (showLoading) {
				uni.hideLoading()
			}
			
		// 适配新的云函数返回格式
		if (res.result && res.result.success !== undefined) {
			if (res.result.success) {
				return res.result  // 返回完整的 result，包含 success 和 data
			} else {
				uni.showToast({
					title: res.result.message || '操作失败',
					icon: 'none'
				})
				throw new Error(res.result.message)
			}
		}
			
			// 兼容旧格式
			if (res.result.code === 0) {
				return res.result.data
			} else {
				uni.showToast({
					title: res.result.message || '操作失败',
					icon: 'none'
				})
				throw new Error(res.result.message)
			}
		} catch (err) {
			if (showLoading) {
				uni.hideLoading()
			}
			console.error('云函数调用失败:', name, err)
			uni.showToast({
				title: err.message || '网络请求失败',
				icon: 'none'
			})
			throw err
		}
	}
	
	/**
	 * 查询云数据库
	 * @param {String} collection 集合名
	 * @param {Object} where 查询条件
	 * @param {Object} options 选项（field, orderBy, skip, limit）
	 */
	static async dbQuery(collection, where = {}, options = {}) {
		const db = wx.cloud.database()
		const _ = db.command
		
		let query = db.collection(collection).where(where)
		
		// 字段筛选
		if (options.field) {
			query = query.field(options.field)
		}
		
		// 排序
		if (options.orderBy) {
			const { field, order } = options.orderBy
			query = query.orderBy(field, order || 'asc')
		}
		
		// 分页
		if (options.skip) {
			query = query.skip(options.skip)
		}
		if (options.limit) {
			query = query.limit(options.limit)
		}
		
		try {
			const res = await query.get()
			return res.data
		} catch (err) {
			console.error('数据库查询失败:', err)
			throw err
		}
	}
	
	/**
	 * 添加云数据库记录
	 * @param {String} collection 集合名
	 * @param {Object} data 数据
	 */
	static async dbAdd(collection, data) {
		const db = wx.cloud.database()
		
		try {
			const res = await db.collection(collection).add({
				data: {
					...data,
					createTime: db.serverDate()
				}
			})
			return res._id
		} catch (err) {
			console.error('数据库添加失败:', err)
			throw err
		}
	}
	
	/**
	 * 更新云数据库记录
	 * @param {String} collection 集合名
	 * @param {String} id 记录ID
	 * @param {Object} data 更新数据
	 */
	static async dbUpdate(collection, id, data) {
		const db = wx.cloud.database()
		
		try {
			const res = await db.collection(collection).doc(id).update({
				data: {
					...data,
					updateTime: db.serverDate()
				}
			})
			return res.stats.updated
		} catch (err) {
			console.error('数据库更新失败:', err)
			throw err
		}
	}
	
	/**
	 * 删除云数据库记录
	 * @param {String} collection 集合名
	 * @param {String} id 记录ID
	 */
	static async dbDelete(collection, id) {
		const db = wx.cloud.database()
		
		try {
			const res = await db.collection(collection).doc(id).remove()
			return res.stats.removed
		} catch (err) {
			console.error('数据库删除失败:', err)
			throw err
		}
	}
}


