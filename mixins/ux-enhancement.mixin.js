/**
 * 用户体验优化 Mixin
 * 提供骨架屏、乐观更新、下拉刷新等功能
 * 优化点：提升用户感知性能和交互体验
 */

export default {
  data() {
    return {
      isLoading: false,
      isRefreshing: false,
      skeletonCount: 5 // 骨架屏显示数量
    }
  },
  
  methods: {
    /**
     * 显示加载状态
     * @param {String} title - 加载提示文字
     */
    showLoading(title = '加载中...') {
      this.isLoading = true
      uni.showLoading({
        title,
        mask: true
      })
    },
    
    /**
     * 隐藏加载状态
     */
    hideLoading() {
      this.isLoading = false
      uni.hideLoading()
    },
    
    /**
     * 乐观更新
     * 先更新UI，后同步服务器，失败时回滚
     * @param {Function} uiUpdater - UI更新函数
     * @param {Function} serverSync - 服务器同步函数
     * @param {Function} rollback - 回滚函数
     * @param {Object} options - 选项
     */
    async optimisticUpdate(uiUpdater, serverSync, rollback, options = {}) {
      const {
        successMsg = '操作成功',
        errorMsg = '操作失败，请重试',
        showSuccess = true
      } = options
      
      // 1. 立即更新UI
      try {
        await uiUpdater()
      } catch (error) {
        console.error('UI更新失败:', error)
        uni.showToast({
          title: 'UI更新失败',
          icon: 'none'
        })
        return false
      }
      
      // 2. 显示成功提示
      if (showSuccess) {
        uni.showToast({
          title: successMsg,
          icon: 'success',
          duration: 1500
        })
      }
      
      // 3. 后台同步到服务器
      try {
        await serverSync()
        return true
      } catch (error) {
        console.error('服务器同步失败:', error)
        
        // 4. 同步失败，回滚UI
        try {
          await rollback()
        } catch (rollbackError) {
          console.error('回滚失败:', rollbackError)
        }
        
        uni.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        })
        
        return false
      }
    },
    
    /**
     * 下拉刷新处理
     * @param {Function} refreshHandler - 刷新处理函数
     */
    async handleRefresh(refreshHandler) {
      this.isRefreshing = true
      
      try {
        await refreshHandler()
        
        uni.showToast({
          title: '刷新成功',
          icon: 'success',
          duration: 1000
        })
      } catch (error) {
        console.error('刷新失败:', error)
        uni.showToast({
          title: '刷新失败',
          icon: 'none'
        })
      } finally {
        this.isRefreshing = false
      }
    },
    
    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {Number} delay - 延迟时间（毫秒）
     * @returns {Function} 防抖后的函数
     */
    debounce(func, delay = 300) {
      let timer = null
      return function(...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      }
    },
    
    /**
     * 节流函数
     * @param {Function} func - 要节流的函数
     * @param {Number} delay - 延迟时间（毫秒）
     * @returns {Function} 节流后的函数
     */
    throttle(func, delay = 300) {
      let lastTime = 0
      return function(...args) {
        const now = Date.now()
        if (now - lastTime >= delay) {
          func.apply(this, args)
          lastTime = now
        }
      }
    },
    
    /**
     * 显示确认对话框
     * @param {String} content - 对话框内容
     * @param {String} title - 对话框标题
     * @returns {Promise<Boolean>} 用户是否确认
     */
    async confirm(content, title = '提示') {
      return new Promise((resolve) => {
        uni.showModal({
          title,
          content,
          success: (res) => {
            resolve(res.confirm)
          },
          fail: () => {
            resolve(false)
          }
        })
      })
    },
    
    /**
     * 显示成功提示
     * @param {String} title - 提示内容
     * @param {Number} duration - 持续时间
     */
    showSuccess(title, duration = 1500) {
      uni.showToast({
        title,
        icon: 'success',
        duration
      })
    },
    
    /**
     * 显示错误提示
     * @param {String} title - 提示内容
     * @param {Number} duration - 持续时间
     */
    showError(title, duration = 2000) {
      uni.showToast({
        title,
        icon: 'none',
        duration
      })
    },
    
    /**
     * 显示警告提示
     * @param {String} title - 提示内容
     * @param {Number} duration - 持续时间
     */
    showWarning(title, duration = 2000) {
      uni.showToast({
        title,
        icon: 'none',
        duration
      })
    }
  }
}


