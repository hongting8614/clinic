/**
 * 药品搜索 Mixin
 * 用于入库、出库、门诊等模块的药品搜索功能
 * 优化点：消除重复代码，统一搜索逻辑
 */

export default {
  data() {
    return {
      searchKeyword: '',
      searchResults: [],
      isSearching: false,
      searchCache: {}, // 搜索缓存
      cacheExpiry: 5 * 60 * 1000 // 5分钟过期
    }
  },
  
  methods: {
    /**
     * 药品搜索（带缓存）
     * @param {String} keyword - 搜索关键词
     * @param {Object} options - 搜索选项
     * @returns {Promise<Array>} 搜索结果
     */
    async searchDrugs(keyword, options = {}) {
      if (!keyword || keyword.trim() === '') {
        this.searchResults = []
        return []
      }
      
      const trimmedKeyword = keyword.trim()
      
      // 检查缓存
      const cached = this.searchCache[trimmedKeyword]
      const now = Date.now()
      
      if (cached && (now - cached.timestamp) < this.cacheExpiry) {
        console.log('🎯 使用缓存的搜索结果:', trimmedKeyword)
        this.searchResults = cached.data
        return cached.data
      }
      
      this.isSearching = true
      
      try {
        const res = await wx.cloud.callFunction({
          name: 'drugManage',
          data: {
            action: 'search',
            data: {
              keyword: trimmedKeyword,
              limit: options.limit || 20
            }
          }
        })
        
        const results = res.result?.data || []
        
        // 缓存结果
        this.searchCache[trimmedKeyword] = {
          data: results,
          timestamp: now
        }
        
        this.searchResults = results
        return results
        
      } catch (error) {
        console.error('搜索失败:', error)
        uni.showToast({
          title: '搜索失败',
          icon: 'none'
        })
        return []
      } finally {
        this.isSearching = false
      }
    },
    
    /**
     * 防抖搜索
     * @param {String} keyword - 搜索关键词
     * @param {Number} delay - 延迟时间（毫秒）
     */
    debounceSearch(keyword, delay = 300) {
      if (this._searchTimer) {
        clearTimeout(this._searchTimer)
      }
      
      this._searchTimer = setTimeout(() => {
        this.searchDrugs(keyword)
      }, delay)
    },
    
    /**
     * 搜索输入事件处理
     * @param {Event} e - 输入事件
     */
    onSearchInput(e) {
      const keyword = e.detail?.value || e
      this.searchKeyword = keyword
      this.debounceSearch(keyword)
    },
    
    /**
     * 清空搜索
     */
    clearSearch() {
      this.searchKeyword = ''
      this.searchResults = []
      if (this._searchTimer) {
        clearTimeout(this._searchTimer)
      }
    },
    
    /**
     * 清空搜索缓存
     */
    clearSearchCache() {
      this.searchCache = {}
      console.log('🗑️ 已清空搜索缓存')
    }
  },
  
  // 页面卸载时清理定时器
  onUnload() {
    if (this._searchTimer) {
      clearTimeout(this._searchTimer)
    }
  }
}


