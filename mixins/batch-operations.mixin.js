/**
 * 批量操作 Mixin
 * 用于优化批量出库、入库等操作
 * 优化点：并行处理，提升批量操作性能
 */

export default {
  data() {
    return {
      batchProcessing: false,
      batchProgress: {
        total: 0,
        current: 0,
        success: 0,
        failed: 0
      }
    }
  },
  
  methods: {
    /**
     * 批量处理（并行）
     * @param {Array} items - 要处理的项目列表
     * @param {Function} processor - 处理函数
     * @param {Object} options - 选项
     * @returns {Promise<Object>} 处理结果
     */
    async batchProcess(items, processor, options = {}) {
      const {
        showProgress = true,
        showResult = true,
        parallel = true,
        maxConcurrent = 5
      } = options
      
      if (!items || items.length === 0) {
        return {
          success: true,
          total: 0,
          successCount: 0,
          failedCount: 0,
          results: []
        }
      }
      
      this.batchProcessing = true
      this.batchProgress = {
        total: items.length,
        current: 0,
        success: 0,
        failed: 0
      }
      
      if (showProgress) {
        uni.showLoading({
          title: `处理中 0/${items.length}`,
          mask: true
        })
      }
      
      try {
        let results
        
        if (parallel) {
          // 并行处理（限制并发数）
          results = await this._parallelProcess(items, processor, maxConcurrent, showProgress)
        } else {
          // 串行处理
          results = await this._serialProcess(items, processor, showProgress)
        }
        
        const successCount = results.filter(r => r.status === 'fulfilled').length
        const failedCount = results.filter(r => r.status === 'rejected').length
        
        if (showResult) {
          if (failedCount === 0) {
            uni.showToast({
              title: `全部成功 (${successCount}/${items.length})`,
              icon: 'success',
              duration: 2000
            })
          } else {
            uni.showModal({
              title: '处理完成',
              content: `成功: ${successCount}, 失败: ${failedCount}`,
              showCancel: false
            })
          }
        }
        
        return {
          success: failedCount === 0,
          total: items.length,
          successCount,
          failedCount,
          results
        }
      } catch (error) {
        console.error('批量处理失败:', error)
        if (showProgress) {
          uni.hideLoading()
        }
        uni.showToast({
          title: '批量处理失败',
          icon: 'none'
        })
        throw error
      } finally {
        this.batchProcessing = false
        if (showProgress) {
          uni.hideLoading()
        }
      }
    },
    
    /**
     * 并行处理（内部方法）
     */
    async _parallelProcess(items, processor, maxConcurrent, showProgress) {
      const results = []
      const chunks = this._chunkArray(items, maxConcurrent)
      
      for (const chunk of chunks) {
        const chunkResults = await Promise.allSettled(
          chunk.map(async (item, index) => {
            try {
              const result = await processor(item, index)
              this.batchProgress.current++
              this.batchProgress.success++
              
              if (showProgress) {
                uni.showLoading({
                  title: `处理中 ${this.batchProgress.current}/${this.batchProgress.total}`,
                  mask: true
                })
              }
              
              return result
            } catch (error) {
              this.batchProgress.current++
              this.batchProgress.failed++
              
              if (showProgress) {
                uni.showLoading({
                  title: `处理中 ${this.batchProgress.current}/${this.batchProgress.total}`,
                  mask: true
                })
              }
              
              throw error
            }
          })
        )
        
        results.push(...chunkResults)
      }
      
      return results
    },
    
    /**
     * 串行处理（内部方法）
     */
    async _serialProcess(items, processor, showProgress) {
      const results = []
      
      for (let i = 0; i < items.length; i++) {
        try {
          const result = await processor(items[i], i)
          results.push({ status: 'fulfilled', value: result })
          this.batchProgress.success++
        } catch (error) {
          results.push({ status: 'rejected', reason: error })
          this.batchProgress.failed++
        }
        
        this.batchProgress.current++
        
        if (showProgress) {
          uni.showLoading({
            title: `处理中 ${this.batchProgress.current}/${this.batchProgress.total}`,
            mask: true
          })
        }
      }
      
      return results
    },
    
    /**
     * 数组分块（内部方法）
     */
    _chunkArray(array, size) {
      const chunks = []
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
      }
      return chunks
    },
    
    /**
     * 批量验证
     * @param {Array} items - 要验证的项目列表
     * @param {Function} validator - 验证函数
     * @returns {Object} 验证结果
     */
    batchValidate(items, validator) {
      const errors = []
      
      items.forEach((item, index) => {
        try {
          const valid = validator(item, index)
          if (!valid) {
            errors.push({
              index,
              item,
              error: '验证失败'
            })
          }
        } catch (error) {
          errors.push({
            index,
            item,
            error: error.message
          })
        }
      })
      
      return {
        valid: errors.length === 0,
        errors
      }
    }
  }
}


