/**
 * 通用工具函数
 */

export default class Common {
	/**
	 * 生成单据编号
	 * @param {String} prefix 前缀（RK/CK/DB/QL/PD/BS/TH）
	 * @returns {String} 单据编号
	 */
	static generateRecordNo(prefix) {
		const date = new Date()
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
		
		return `${prefix}${year}${month}${day}${random}`
	}
	
	/**
	 * 格式化日期
	 * @param {Date|String} date 日期
	 * @param {String} format 格式（YYYY-MM-DD / YYYY-MM-DD HH:mm:ss）
	 * @returns {String} 格式化后的日期
	 */
	static formatDate(date, format = 'YYYY-MM-DD') {
		if (!date) return ''
		
		const d = new Date(date)
		const year = d.getFullYear()
		const month = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')
		const hour = String(d.getHours()).padStart(2, '0')
		const minute = String(d.getMinutes()).padStart(2, '0')
		const second = String(d.getSeconds()).padStart(2, '0')
		
		if (format === 'YYYY-MM-DD') {
			return `${year}-${month}-${day}`
		} else if (format === 'YYYY-MM-DD HH:mm:ss') {
			return `${year}-${month}-${day} ${hour}:${minute}:${second}`
		} else if (format === 'YYYY-MM-DD HH:mm') {
			return `${year}-${month}-${day} ${hour}:${minute}`
		}
		
		return `${year}-${month}-${day}`
	}
	
	/**
	 * 格式化时间（HH:mm）
	 * @param {Date|String} date 日期
	 * @returns {String} 格式化后的时间
	 */
	static formatTime(date) {
		if (!date) return ''
		
		const d = new Date(date)
		const hour = String(d.getHours()).padStart(2, '0')
		const minute = String(d.getMinutes()).padStart(2, '0')
		
		return `${hour}:${minute}`
	}
	
	/**
	 * 格式化日期时间（YYYY-MM-DD HH:mm:ss）
	 * @param {Date|String} date 日期
	 * @returns {String} 格式化后的日期时间
	 */
	static formatDateTime(date) {
		return this.formatDate(date, 'YYYY-MM-DD HH:mm:ss')
	}
	
	/**
	 * 计算距离过期天数
	 * @param {Date|String} expireDate 有效期
	 * @returns {Number} 天数
	 */
	static calcDaysToExpire(expireDate) {
		const today = new Date()
		const expire = new Date(expireDate)
		const days = Math.floor((expire - today) / (1000 * 60 * 60 * 24))
		return days
	}
	
	/**
	 * 判断是否近效期
	 * @param {Date|String} expireDate 有效期
	 * @param {Number} warningDays 预警天数（默认90天）
	 * @returns {Boolean} 是否近效期
	 */
	static isNearExpire(expireDate, warningDays = 90) {
		const days = this.calcDaysToExpire(expireDate)
		return days >= 0 && days <= warningDays
	}
	
	/**
	 * 判断是否已过期
	 * @param {Date|String} expireDate 有效期
	 * @returns {Boolean} 是否已过期
	 */
	static isExpired(expireDate) {
		const days = this.calcDaysToExpire(expireDate)
		return days < 0
	}
	

	
	/**
	 * 获取系统信息（兼容新旧API）
	 * @returns {Object} 系统信息对象
	 */
	static getSystemInfo() {
		try {
			// 优先使用新API
			if (uni.getWindowInfo) {
				return uni.getWindowInfo()
			}
			// 降级到旧API（会显示警告但功能正常）
			if (uni.getSystemInfoSync) {
				return uni.getSystemInfoSync()
			}
			// 最后降级
			return {
				windowWidth: 375,
				windowHeight: 667,
				pixelRatio: 1
			}
		} catch (e) {
			console.warn('获取系统信息失败:', e)
			return {
				windowWidth: 375,
				windowHeight: 667,
				pixelRatio: 1
			}
		}
	}
}


