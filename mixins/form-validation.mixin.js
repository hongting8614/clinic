/**
 * 表单验证 Mixin
 * 用于统一各模块的表单验证逻辑
 * 优化点：消除重复的验证代码，提高可维护性
 */

export default {
  methods: {
    /**
     * 验证数量
     * @param {Number} quantity - 数量
     * @param {String} fieldName - 字段名称
     * @param {Number} max - 最大值（可选）
     * @param {Number} min - 最小值（默认0）
     * @returns {Boolean} 是否有效
     */
    validateQuantity(quantity, fieldName = '数量', max = null, min = 0) {
      // 检查是否为空
      if (quantity === null || quantity === undefined || quantity === '') {
        uni.showToast({
          title: `${fieldName}不能为空`,
          icon: 'none'
        })
        return false
      }
      
      // 转换为数字
      const num = Number(quantity)
      
      // 检查是否为有效数字
      if (isNaN(num) || !isFinite(num)) {
        uni.showToast({
          title: `${fieldName}必须是有效数字`,
          icon: 'none'
        })
        return false
      }
      
      // 检查最小值
      if (num <= min) {
        uni.showToast({
          title: `${fieldName}必须大于${min}`,
          icon: 'none'
        })
        return false
      }
      
      // 检查最大值
      if (max !== null && num > max) {
        uni.showToast({
          title: `${fieldName}不能超过${max}`,
          icon: 'none'
        })
        return false
      }
      
      return true
    },
    
    /**
     * 验证日期
     * @param {String} date - 日期字符串
     * @param {String} fieldName - 字段名称
     * @returns {Boolean} 是否有效
     */
    validateDate(date, fieldName = '日期') {
      if (!date || date.trim() === '') {
        uni.showToast({
          title: `请选择${fieldName}`,
          icon: 'none'
        })
        return false
      }
      
      // 检查日期格式
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) {
        uni.showToast({
          title: `${fieldName}格式不正确`,
          icon: 'none'
        })
        return false
      }
      
      return true
    },
    
    /**
     * 验证有效期（必须晚于生产日期）
     * @param {String} productionDate - 生产日期
     * @param {String} expiryDate - 有效期
     * @returns {Boolean} 是否有效
     */
    validateExpiryDate(productionDate, expiryDate) {
      if (!productionDate || !expiryDate) {
        uni.showToast({
          title: '请选择生产日期和有效期',
          icon: 'none'
        })
        return false
      }
      
      const production = new Date(productionDate)
      const expiry = new Date(expiryDate)
      
      if (isNaN(production.getTime()) || isNaN(expiry.getTime())) {
        uni.showToast({
          title: '日期格式不正确',
          icon: 'none'
        })
        return false
      }
      
      if (expiry <= production) {
        uni.showToast({
          title: '有效期必须晚于生产日期',
          icon: 'none'
        })
        return false
      }
      
      return true
    },
    
    /**
     * 验证必填项
     * @param {Any} value - 值
     * @param {String} fieldName - 字段名称
     * @returns {Boolean} 是否有效
     */
    validateRequired(value, fieldName) {
      if (value === null || value === undefined) {
        uni.showToast({
          title: `${fieldName}不能为空`,
          icon: 'none'
        })
        return false
      }
      
      if (typeof value === 'string' && value.trim() === '') {
        uni.showToast({
          title: `${fieldName}不能为空`,
          icon: 'none'
        })
        return false
      }
      
      if (Array.isArray(value) && value.length === 0) {
        uni.showToast({
          title: `${fieldName}不能为空`,
          icon: 'none'
        })
        return false
      }
      
      return true
    },
    
    /**
     * 验证批号格式
     * @param {String} batch - 批号
     * @returns {Boolean} 是否有效
     */
    validateBatch(batch) {
      if (!batch || batch.trim() === '') {
        uni.showToast({
          title: '批号不能为空',
          icon: 'none'
        })
        return false
      }
      
      // 批号长度检查（一般不少于3位）
      if (batch.trim().length < 3) {
        uni.showToast({
          title: '批号格式不正确',
          icon: 'none'
        })
        return false
      }
      
      return true
    },
    
    /**
     * 验证价格
     * @param {Number} price - 价格
     * @param {String} fieldName - 字段名称
     * @returns {Boolean} 是否有效
     */
    validatePrice(price, fieldName = '价格') {
      if (price === null || price === undefined || price === '') {
        uni.showToast({
          title: `${fieldName}不能为空`,
          icon: 'none'
        })
        return false
      }
      
      const num = Number(price)
      
      if (isNaN(num) || !isFinite(num) || num < 0) {
        uni.showToast({
          title: `${fieldName}必须是有效的正数`,
          icon: 'none'
        })
        return false
      }
      
      return true
    },
    
    /**
     * 验证库存是否充足
     * @param {Number} required - 需要的数量
     * @param {Number} available - 可用库存
     * @param {String} drugName - 药品名称
     * @returns {Boolean} 是否充足
     */
    validateStock(required, available, drugName = '该药品') {
      if (required > available) {
        uni.showToast({
          title: `${drugName}库存不足，当前库存：${available}`,
          icon: 'none',
          duration: 2000
        })
        return false
      }
      return true
    },
    
    /**
     * 批量验证
     * @param {Array} validations - 验证规则数组 [{validator: Function, errorMsg: String}]
     * @returns {Boolean} 是否全部通过
     */
    validateAll(validations) {
      for (const validation of validations) {
        if (!validation.validator()) {
          if (validation.errorMsg) {
            uni.showToast({
              title: validation.errorMsg,
              icon: 'none'
            })
          }
          return false
        }
      }
      return true
    }
  }
}


