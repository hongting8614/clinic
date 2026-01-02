/**
 * 缓存管理 Mixin
 * 用于统一管理本地缓存，减少云函数调用
 * 优化点：提升性能，减少网络请求
 */

export default {
  data() {
    return {
      drugCache: {},      // 药品信息缓存
      batchCache: {},     // 批次信息缓存
      stockCache: {},     // 库存信息缓存
      cacheExpiry: 5 * 60 * 1000  // 默认5分钟过期
    }
  },
  
  methods: {
    /**
     * 获取缓存数据
     * @param {String} cacheType - 缓存类型 (drug/batch/stock)
     * @param {String} key - 缓存键
     * @returns {Any} 缓存的数据，如果过期或不存在则返回null
     */
    getCache(cacheType, key) {
      const cacheMap = this[`${cacheType}Cache`]
      if (!cacheMap) return null
      
      const cached = cacheMap[key]
      if (!cached) return null
      
      const now = Date.now()
      if (now - cached.timestamp > this.cacheExpiry) {
        // 缓存已过期
        delete cacheMap[key]
        return null
      }
      
      console.log(`✅ 使用${cacheType}缓存:`, key)
      return cached.data
    },
    
    /**
     * 设置缓存数据
     * @param {String} cacheType - 缓存类型 (drug/batch/stock)
     * @param {String} key - 缓存键
     * @param {Any} data - 要缓存的数据
     */
    setCache(cacheType, key, data) {
      const cacheMap = this[`${cacheType}Cache`]
      if (!cacheMap) return
      
      cacheMap[key] = {
        data: data,
        timestamp: Date.now()
      }
      
      console.log(`💾 缓存${cacheType}数据:`, key)
    },
    
    /**
     * 清除指定缓存
     * @param {String} cacheType - 缓存类型 (drug/batch/stock)
     * @param {String} key - 缓存键（可选，不传则清除该类型所有缓存）
     */
    clearCache(cacheType, key = null) {
      const cacheMap = this[`${cacheType}Cache`]
      if (!cacheMap) return
      
      if (key) {
        delete cacheMap[key]
        console.log(`🗑️ 清除${cacheType}缓存:`, key)
      } else {
        this[`${cacheType}Cache`] = {}
        console.log(`🗑️ 清除所有${cacheType}缓存`)
      }
    },
    
    /**
     * 清除所有缓存
     */
    clearAllCache() {
      this.drugCache = {}
      this.batchCache = {}
      this.stockCache = {}
      console.log('🗑️ 已清除所有缓存')
    },
    
    /**
     * 获取药品信息（带缓存）
     * @param {String} drugId - 药品ID
     * @returns {Promise<Object>} 药品信息
     */
    async getDrugWithCache(drugId) {
      // 检查缓存
      const cached = this.getCache('drug', drugId)
      if (cached) return cached
      
      // 查询数据库
      try {
        const res = await wx.cloud.callFunction({
          name: 'drugManage',
          data: {
            action: 'getDetail',
            data: { drugId }
          }
        })
        
        const drug = res.result?.data
        if (drug) {
          this.setCache('drug', drugId, drug)
        }
        
        return drug
      } catch (error) {
        console.error('获取药品信息失败:', error)
        throw error
      }
    },
    
    /**
     * 获取批次信息（带缓存）
     * @param {String} drugId - 药品ID
     * @param {String} location - 库存位置
     * @returns {Promise<Array>} 批次列表
     */
    async getBatchesWithCache(drugId, location) {
      const cacheKey = `${drugId}_${location}`
      
      // 检查缓存
      const cached = this.getCache('batch', cacheKey)
      if (cached) return cached
      
      // 查询数据库
      try {
        const res = await wx.cloud.callFunction({
          name: 'stockManage',
          data: {
            action: 'getBatchesByDrugId',
            data: { drugId, location }
          }
        })
        
        const batches = res.result?.data || []
        this.setCache('batch', cacheKey, batches)
        
        return batches
      } catch (error) {
        console.error('获取批次信息失败:', error)
        throw error
      }
    },
    
    /**
     * 获取药品和批次信息（合并查询，带缓存）
     * @param {String} drugId - 药品ID
     * @param {String} location - 库存位置
     * @returns {Promise<Object>} {drug, batches}
     */
    async getDrugWithBatchesCache(drugId, location) {
      const cacheKey = `${drugId}_${location}`
      
      // 检查缓存
      const drugCached = this.getCache('drug', drugId)
      const batchCached = this.getCache('batch', cacheKey)
      
      if (drugCached && batchCached) {
        console.log('✅ 使用完整缓存（药品+批次）')
        return {
          drug: drugCached,
          batches: batchCached
        }
      }
      
      // 并行查询（如果部分缓存存在，只查询缺失的部分）
      try {
        const promises = []
        
        if (!drugCached) {
          promises.push(this.getDrugWithCache(drugId))
        } else {
          promises.push(Promise.resolve(drugCached))
        }
        
        if (!batchCached) {
          promises.push(this.getBatchesWithCache(drugId, location))
        } else {
          promises.push(Promise.resolve(batchCached))
        }
        
        const [drug, batches] = await Promise.all(promises)
        
        return { drug, batches }
      } catch (error) {
        console.error('获取药品和批次信息失败:', error)
        throw error
      }
    }
  },
  
  // 页面卸载时可选择是否清除缓存
  onUnload() {
    // 默认不清除缓存，让缓存在应用生命周期内有效
    // 如需清除，取消下面的注释
    // this.clearAllCache()
  }
}


