<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="page-header">
      <text class="page-title">操作日志</text>
    </view>

    <!-- 筛选区域 -->
    <view class="filter-card">
      <view class="filter-row">
        <view class="filter-item">
          <text class="label">开始日期</text>
          <picker mode="date" :value="filters.startDate" @change="onStartDateChange">
            <view class="picker-text">{{ filters.startDate || '请选择' }}</view>
          </picker>
        </view>
        <view class="filter-item">
          <text class="label">结束日期</text>
          <picker mode="date" :value="filters.endDate" @change="onEndDateChange">
            <view class="picker-text">{{ filters.endDate || '请选择' }}</view>
          </picker>
        </view>
      </view>

      <view class="filter-row">
        <view class="filter-item">
          <text class="label">模块</text>
          <picker mode="selector" :range="moduleOptions" :value="moduleIndex" @change="onModuleChange">
            <view class="picker-text">{{ moduleOptions[moduleIndex] }}</view>
          </picker>
        </view>
        <view class="filter-item">
          <text class="label">操作类型</text>
          <picker mode="selector" :range="actionOptions" :value="actionIndex" @change="onActionChange">
            <view class="picker-text">{{ actionOptions[actionIndex] }}</view>
          </picker>
        </view>
      </view>

      <view class="filter-row">
        <view class="filter-item">
          <text class="label">用户名</text>
          <input
            class="input"
            v-model.trim="filters.userName"
            placeholder="输入用户名"
            @confirm="fetchLogs"
          />
        </view>
        <view class="filter-item">
          <text class="label">结果</text>
          <picker mode="selector" :range="resultOptions" :value="resultIndex" @change="onResultChange">
            <view class="picker-text">{{ resultOptions[resultIndex] }}</view>
          </picker>
        </view>
      </view>

      <view class="filter-actions">
        <button class="btn ghost" @tap="resetFilters">重置</button>
        <button class="btn primary" @tap="fetchLogs">查询</button>
        <button class="btn danger" @tap="showClearDialog">清空日志</button>
      </view>
    </view>

    <!-- 日志列表 -->
    <view class="log-section">
      <view v-if="logs.length" class="log-list">
        <view
          class="log-card"
          v-for="(item, index) in logs"
          :key="index"
        >
          <!-- 顶部：时间 + 结果状态 -->
          <view class="log-header">
            <text class="log-time">{{ formatDateTime(item.createTime) }}</text>
            <view :class="['log-status', item.result === 'success' ? 'success' : 'fail']">
              {{ item.result === 'success' ? '成功' : '失败' }}
            </view>
          </view>

          <!-- 用户信息 -->
          <view class="log-row">
            <text class="log-label">用户：</text>
            <text class="log-value">{{ item.userName }}（{{ getRoleName(item.userRole) }}）</text>
          </view>

          <!-- 模块和操作 -->
          <view class="log-row">
            <text class="log-label">操作：</text>
            <text class="log-value">{{ item.module }} - {{ item.action }}</text>
          </view>

          <!-- 操作对象 -->
          <view class="log-row" v-if="item.target">
            <text class="log-label">对象：</text>
            <text class="log-value">{{ item.target }}</text>
          </view>

          <!-- 详情 -->
          <view class="log-row" v-if="item.details">
            <text class="log-label">详情：</text>
            <text class="log-value">{{ item.details }}</text>
          </view>

          <!-- 错误信息 -->
          <view class="log-row error" v-if="item.errorMsg">
            <text class="log-label">错误：</text>
            <text class="log-value">{{ item.errorMsg }}</text>
          </view>

          <!-- IP地址 -->
          <view class="log-footer">
            <text class="log-ip">IP: {{ item.ip || '未知' }}</text>
          </view>
        </view>
      </view>

      <view v-else class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无操作日志</text>
      </view>

      <!-- 分页 -->
      <view v-if="totalPages > 1" class="pagination">
        <button class="page-btn" :disabled="currentPage === 1" @tap="prevPage">上一页</button>
        <text class="page-info">{{ currentPage }} / {{ totalPages }}</text>
        <button class="page-btn" :disabled="currentPage === totalPages" @tap="nextPage">下一页</button>
      </view>
    </view>

    <!-- 清空日志确认弹窗 -->
    <view v-if="showClearConfirm" class="modal-mask" @tap="closeClearDialog">
      <view class="modal-dialog" @tap.stop>
        <view class="modal-title">确认清空日志</view>
        <view class="modal-content">
          <text class="modal-text">请选择要清空的日志范围：</text>
          <view class="date-item">
            <text class="date-label">清空此日期之前的日志</text>
            <picker mode="date" :value="clearBeforeDate" @change="onClearDateChange">
              <view class="date-value">{{ clearBeforeDate || '请选择日期' }}</view>
            </picker>
          </view>
          <text class="modal-hint">留空则清空所有日志</text>
        </view>
        <view class="modal-actions">
          <button class="modal-btn cancel" @tap="closeClearDialog">取消</button>
          <button class="modal-btn confirm" @tap="confirmClear">确定清空</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'OperationLogs',
  data() {
    return {
      loading: false,
      logs: [],
      filters: {
        startDate: '',
        endDate: '',
        module: '',
        action: '',
        userName: '',
        result: ''
      },
      moduleOptions: ['全部模块', '登录', '门诊', '库存', '入库', '出库', '用户管理', '药品管理', '报表导出'],
      moduleIndex: 0,
      actionOptions: ['全部操作', '登录', '新增', '修改', '删除', '查询', '导出', '审核'],
      actionIndex: 0,
      resultOptions: ['全部结果', '成功', '失败'],
      resultIndex: 0,
      currentPage: 1,
      pageSize: 20,
      totalPages: 0,
      total: 0,
      showClearConfirm: false,
      clearBeforeDate: ''
    }
  },
  onLoad() {
    this.initDefaultDate()
    this.fetchLogs()
  },
  methods: {
    initDefaultDate() {
      const today = new Date()
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      
      const formatDate = (date) => {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
      }
      
      this.filters.startDate = formatDate(sevenDaysAgo)
      this.filters.endDate = formatDate(today)
    },
    onStartDateChange(e) {
      this.filters.startDate = e.detail.value
    },
    onEndDateChange(e) {
      this.filters.endDate = e.detail.value
    },
    onModuleChange(e) {
      this.moduleIndex = Number(e.detail.value)
      const modules = ['', '登录', '门诊', '库存', '入库', '出库', '用户管理', '药品管理', '报表导出']
      this.filters.module = modules[this.moduleIndex]
    },
    onActionChange(e) {
      this.actionIndex = Number(e.detail.value)
      const actions = ['', '登录', '新增', '修改', '删除', '查询', '导出', '审核']
      this.filters.action = actions[this.actionIndex]
    },
    onResultChange(e) {
      this.resultIndex = Number(e.detail.value)
      const results = ['', 'success', 'fail']
      this.filters.result = results[this.resultIndex]
    },
    resetFilters() {
      this.initDefaultDate()
      this.filters.module = ''
      this.filters.action = ''
      this.filters.userName = ''
      this.filters.result = ''
      this.moduleIndex = 0
      this.actionIndex = 0
      this.resultIndex = 0
      this.currentPage = 1
      this.fetchLogs()
    },
    async fetchLogs() {
      this.loading = true
      try {
        const res = await this.$api.callFunction('operationLogs', {
          action: 'list',
          data: {
            page: this.currentPage,
            pageSize: this.pageSize,
            startDate: this.filters.startDate,
            endDate: this.filters.endDate,
            module: this.filters.module,
            action: this.filters.action,
            userName: this.filters.userName,
            result: this.filters.result
          }
        })
        
        if (res.success) {
          this.logs = res.data.list
          this.total = res.data.total
          this.totalPages = res.data.totalPages
        } else {
          uni.showToast({ title: res.message || '加载失败', icon: 'none' })
        }
      } catch (err) {
        console.error('加载日志失败:', err)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchLogs()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchLogs()
      }
    },
    showClearDialog() {
      this.showClearConfirm = true
      this.clearBeforeDate = ''
    },
    closeClearDialog() {
      this.showClearConfirm = false
    },
    onClearDateChange(e) {
      this.clearBeforeDate = e.detail.value
    },
    async confirmClear() {
      try {
        uni.showLoading({ title: '清空中...', mask: true })
        const res = await this.$api.callFunction('operationLogs', {
          action: 'clear',
          data: {
            beforeDate: this.clearBeforeDate
          }
        })
        uni.hideLoading()
        
        if (res.success) {
          uni.showToast({ title: res.message, icon: 'success' })
          this.closeClearDialog()
          this.fetchLogs()
        } else {
          uni.showToast({ title: res.message || '清空失败', icon: 'none' })
        }
      } catch (err) {
        uni.hideLoading()
        console.error('清空日志失败:', err)
        uni.showToast({ title: '清空失败', icon: 'none' })
      }
    },
    formatDateTime(date) {
      if (!date) return ''
      const d = new Date(date)
      if (isNaN(d.getTime())) return ''
      
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      const ss = String(d.getSeconds()).padStart(2, '0')
      return `${y}-${m}-${day} ${hh}:${mm}:${ss}`
    },
    getRoleName(role) {
      const roleMap = {
        admin: '系统管理员',
        doctor: '医生',
        nurse: '护士',
        pharmacist: '药剂师'
      }
      return roleMap[role] || role || '未知'
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 35%, #e5e7eb 100%);
  padding-bottom: 40rpx;
}

.page-header {
  max-width: 702rpx;
  margin: 24rpx auto 16rpx;
  padding: 32rpx 30rpx;
  background: #FFFFF0;
  border-radius: 22rpx;
  box-shadow: 0 18rpx 40rpx rgba(15, 23, 42, 0.14);
  text-align: center;
}

.page-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #0f172a;
}

.filter-card {
  max-width: 702rpx;
  margin: 0 auto 16rpx;
  padding: 24rpx 24rpx 20rpx;
  background: #FFFFF0;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.filter-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.filter-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.label {
  font-size: 24rpx;
  color: #6b7280;
}

.picker-text {
  padding: 18rpx 20rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e5e7eb;
  background: #f9fafb;
  font-size: 28rpx;
  color: #111827;
}

.input {
  padding: 18rpx 20rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e5e7eb;
  background: #f9fafb;
  font-size: 28rpx;
  color: #111827;
}

.filter-actions {
  margin-top: 8rpx;
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}

.btn {
  min-width: 150rpx;
  padding: 16rpx 24rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
}

.btn.ghost {
  background: #fff;
  color: #667eea;
  border: 1rpx solid #c7d2fe;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border: none;
}

.btn.danger {
  background: #fee;
  color: #dc2626;
  border: 1rpx solid #fecaca;
}

.log-section {
  max-width: 702rpx;
  margin: 0 auto;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.log-card {
  background: #ffffff;
  border-radius: 22rpx;
  padding: 22rpx 24rpx;
  box-shadow: 0 18rpx 40rpx rgba(15, 23, 42, 0.14);
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.log-time {
  font-size: 24rpx;
  color: #6b7280;
}

.log-status {
  padding: 4rpx 12rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
}

.log-status.success {
  background: #d1fae5;
  color: #059669;
}

.log-status.fail {
  background: #fee2e2;
  color: #dc2626;
}

.log-row {
  display: flex;
  margin-bottom: 8rpx;
}

.log-row.error {
  background: #fef2f2;
  padding: 8rpx;
  border-radius: 8rpx;
}

.log-label {
  font-size: 26rpx;
  color: #9ca3af;
  min-width: 100rpx;
}

.log-value {
  flex: 1;
  font-size: 26rpx;
  color: #111827;
  word-break: break-all;
}

.log-footer {
  margin-top: 8rpx;
  padding-top: 8rpx;
  border-top: 1rpx solid #f3f4f6;
}

.log-ip {
  font-size: 22rpx;
  color: #9ca3af;
}

.empty-state {
  background: #fff;
  padding: 120rpx 20rpx;
  border-radius: 20rpx;
  text-align: center;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.06);
}

.empty-icon {
  font-size: 90rpx;
}

.empty-text {
  font-size: 30rpx;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20rpx;
  margin-top: 24rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 20rpx;
}

.page-btn {
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
  background: #667eea;
  color: #fff;
  font-size: 26rpx;
}

.page-btn[disabled] {
  background: #e5e7eb;
  color: #9ca3af;
}

.page-info {
  font-size: 26rpx;
  color: #6b7280;
}

.modal-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-dialog {
  width: 86%;
  max-width: 640rpx;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx 28rpx;
  box-shadow: 0 18rpx 40rpx rgba(15, 23, 42, 0.35);
}

.modal-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24rpx;
  text-align: center;
}

.modal-content {
  margin-bottom: 24rpx;
}

.modal-text {
  display: block;
  font-size: 26rpx;
  color: #6b7280;
  margin-bottom: 16rpx;
}

.date-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  background: #f9fafb;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
}

.date-label {
  font-size: 26rpx;
  color: #374151;
}

.date-value {
  font-size: 26rpx;
  color: #667eea;
  padding: 8rpx 16rpx;
  background: #ffffff;
  border-radius: 8rpx;
  border: 1rpx solid #e5e7eb;
}

.modal-hint {
  display: block;
  font-size: 22rpx;
  color: #9ca3af;
  text-align: center;
}

.modal-actions {
  display: flex;
  gap: 12rpx;
}

.modal-btn {
  flex: 1;
  padding: 14rpx 0;
  border-radius: 999rpx;
  font-size: 28rpx;
  border: none;
}

.modal-btn.cancel {
  background: #f3f4f6;
  color: #6b7280;
}

.modal-btn.confirm {
  background: #dc2626;
  color: #ffffff;
}
</style>

