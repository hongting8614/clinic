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
	 * 汉字转拼音首字母
	 * @param {String} str 汉字字符串
	 * @returns {String} 拼音首字母
	 */
	static toPinyin(str) {
		// 简化版拼音首字母转换
		// 实际项目中建议使用专业的拼音库，如 pinyin-pro
		const pinyinMap = {
			'阿': 'A', '啊': 'A', '哎': 'A', '爱': 'A', '安': 'A',
			'八': 'B', '把': 'B', '白': 'B', '百': 'B', '半': 'B',
			'草': 'C', '层': 'C', '查': 'C', '长': 'C', '常': 'C',
			'的': 'D', '地': 'D', '点': 'D', '定': 'D', '东': 'D',
			'二': 'E',
			'发': 'F', '方': 'F', '放': 'F', '非': 'F', '分': 'F',
			'个': 'G', '给': 'G', '根': 'G', '更': 'G', '工': 'G',
			'哈': 'H', '还': 'H', '好': 'H', '和': 'H', '很': 'H',
			'基': 'J', '机': 'J', '几': 'J', '己': 'J', '济': 'J',
			'可': 'K', '克': 'K', '口': 'K', '快': 'K',
			'拉': 'L', '来': 'L', '老': 'L', '了': 'L', '里': 'L',
			'马': 'M', '吗': 'M', '么': 'M', '们': 'M', '米': 'M',
			'那': 'N', '哪': 'N', '呢': 'N', '能': 'N', '你': 'N',
			'片': 'P', '平': 'P', '破': 'P', '普': 'P',
			'七': 'Q', '期': 'Q', '其': 'Q', '起': 'Q', '前': 'Q',
			'人': 'R', '日': 'R', '如': 'R',
			'三': 'S', '色': 'S', '上': 'S', '少': 'S', '生': 'S',
			'他': 'T', '她': 'T', '它': 'T', '太': 'T', '特': 'T',
			'我': 'W', '五': 'W', '物': 'W',
			'西': 'X', '下': 'X', '先': 'X', '现': 'X', '小': 'X',
			'一': 'Y', '也': 'Y', '要': 'Y', '业': 'Y', '用': 'Y',
			'在': 'Z', '早': 'Z', '怎': 'Z', '这': 'Z', '中': 'Z'
		}
		
		let result = ''
		for (let i = 0; i < str.length; i++) {
			const char = str[i]
			result += pinyinMap[char] || char.toUpperCase()
		}
		return result
	}
	
	/**
	 * 金额格式化
	 * @param {Number} amount 金额
	 * @returns {String} 格式化后的金额
	 */
	static formatMoney(amount) {
		if (!amount) return '¥0.00'
		return `¥${amount.toFixed(2)}`
	}
	
	/**
	 * 上传图片到云存储
	 * @param {String} filePath 本地文件路径
	 * @param {String} cloudPath 云端路径
	 * @returns {Promise<String>} 云端文件ID
	 */
	static async uploadImage(filePath, cloudPath) {
		try {
			const res = await wx.cloud.uploadFile({
				cloudPath: cloudPath,
				filePath: filePath
			})
			return res.fileID
		} catch (err) {
			console.error('图片上传失败:', err)
			throw err
		}
	}
	
	/**
	 * 获取临时文件URL
	 * @param {Array<String>} fileList 文件ID列表
	 * @returns {Promise<Array>} 临时URL列表
	 */
	static async getTempFileURL(fileList) {
		try {
			const res = await wx.cloud.getTempFileURL({
				fileList: fileList
			})
			return res.fileList
		} catch (err) {
			console.error('获取临时URL失败:', err)
			throw err
		}
	}
	
	/**
	 * 防抖函数
	 * @param {Function} func 要防抖的函数
	 * @param {Number} delay 延迟时间（毫秒）
	 * @returns {Function} 防抖后的函数
	 */
	static debounce(func, delay = 300) {
		let timer = null
		return function(...args) {
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => {
				func.apply(this, args)
			}, delay)
		}
	}
	
	/**
	 * 节流函数
	 * @param {Function} func 要节流的函数
	 * @param {Number} delay 延迟时间（毫秒）
	 * @returns {Function} 节流后的函数
	 */
	static throttle(func, delay = 300) {
		let timer = null
		let lastTime = 0
		return function(...args) {
			const now = Date.now()
			if (now - lastTime >= delay) {
				func.apply(this, args)
				lastTime = now
			}
		}
	}
}


