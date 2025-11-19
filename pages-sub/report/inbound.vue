<template>
	<view class="container">
		<view class="page-header">
			<view>
        <text class="page-title">入库管理报表</text>
        <text class="page-subtitle">北京欢乐谷医务室 · Inbound Reports</text>
			</view>
			<view class="page-actions">
        <view class="header-btn ghost" @tap="resetFilters">
          <text class="btn-icon">↺</text>
          <text class="btn-text">重置条件</text>
				</view>
        <view class="header-btn primary" @tap="fetchCurrentTab">
					<text class="btn-icon">🔄</text>
          <text class="btn-text">刷新数据</text>
				</view>
			</view>
		</view>

    <view class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tab-item', { active: tab.value === activeTab }]"
        @tap="switchTab(tab.value)"
      >
        <text class="tab-label">{{ tab.label }}</text>
        <text class="tab-desc">{{ tab.desc }}</text>
			</view>
		</view>
		
		<filter-panel
      v-if="activeTab !== 'period'"
			class="filter-panel-wrapper"
			:show-date="true"
      :start-date="filters.startDate"
      :end-date="filters.endDate"
			:quick-filters="quickFilters"
      :active-quick-filter="filters.quick"
			:show-search-button="false"
      keyword-placeholder="输入单号/药品"
      :keyword="filters.recordNo"
      @update:startDate="val => updateFilter('startDate', val)"
      @update:endDate="val => updateFilter('endDate', val)"
			@quick-filter="selectQuickFilter"
			@date-change="onDateChange"
      @update:keyword="val => updateFilter('recordNo', val)"
      @search="fetchCurrentTab"
		>
			<view class="filter-extra">
				<view class="extra-item">
					<text class="extra-label">药品名称</text>
          <input
            class="extra-input"
            v-model.trim="filters.drugName"
            placeholder="模糊查询药品名"
            @confirm="fetchCurrentTab"
          />
				</view>
        <view class="extra-item">
					<text class="extra-label">操作人</text>
          <input
            class="extra-input"
            v-model.trim="filters.operator"
            placeholder="输入操作人"
            @confirm="fetchCurrentTab"
          />
        </view>
        <view class="extra-item">
          <text class="extra-label">批号</text>
          <input
            class="extra-input"
            v-model.trim="filters.batchNo"
            placeholder="输入批号"
            @confirm="fetchCurrentTab"
          />
        </view>
        <view class="extra-item toggle-item" @tap="toggleIncludeDraft">
          <text class="extra-label">草稿数据</text>
          <view class="toggle" :class="{ active: filters.includeDraft }">
            <view class="toggle-dot"></view>
          </view>
				</view>
				</view>
		</filter-panel>
		
    <view v-else class="period-filter-card">
      <view class="period-title">时间段快速查询（自动列出所有药材明细）</view>
      <view class="period-chips">
        <view
          v-for="item in periodQuickFilters"
          :key="item.value"
          :class="['period-chip', { active: periodFilter === item.value }]"
          @tap="selectPeriodFilter(item.value)"
        >
          {{ item.label }}
        </view>
      </view>
      <view class="period-range">
        <text>当前区间：{{ periodRange.startDate }} ~ {{ periodRange.endDate }}</text>
        <text class="range-hint">系统自动套用时间段，直接生成报表</text>
      </view>
			</view>
		
    <view class="stats-card" v-if="statistics">
      <view class="stat-item">
        <text class="stat-value">{{ statistics.totalRecords }}</text>
        <text class="stat-label">记录数</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ statistics.totalDrugs }}</text>
        <text class="stat-label">药品种类</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ statistics.totalQuantity }}</text>
        <text class="stat-label">总数量</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">¥{{ statistics.totalAmount }}</text>
        <text class="stat-label">总金额</text>
      </view>
		</view>
		
    <view v-if="activeTab === 'summary'" class="table-section">
      <view v-if="summaryRows.length" class="table-wrapper">
			<view class="table-header">
				<text class="col col-no">单号</text>
				<text class="col col-date">日期</text>
				<text class="col col-operator">操作人</text>
          <text class="col col-status">状态</text>
          <text class="col col-drugs">品种数</text>
				<text class="col col-quantity">数量</text>
				<text class="col col-amount">金额</text>
			</view>
        <view class="table-body">
				<view 
					class="table-row"
            v-for="item in summaryRows"
            :key="item._id"
					@tap="viewDetail(item._id)"
				>
					<text class="col col-no">{{ item.recordNo }}</text>
					<text class="col col-date">{{ formatDate(item.createTime) }}</text>
            <text class="col col-operator">{{ item.operator || '-' }}</text>
            <text class="col col-status">{{ renderStatus(item.status) }}</text>
					<text class="col col-drugs">{{ item.drugCount }}</text>
					<text class="col col-quantity">{{ item.totalQuantity }}</text>
					<text class="col col-amount">¥{{ item.totalAmount }}</text>
				</view>
		</view>
      </view>
      <view v-else class="empty-state">
			<text class="empty-icon">📊</text>
			<text class="empty-text">暂无数据</text>
        <text class="empty-hint">调整筛选条件后重新生成报表</text>
      </view>
		</view>
		
    <view v-if="activeTab === 'detail'" class="table-section">
      <view v-if="detailRows.length" class="table-wrapper detail">
        <view class="table-header detail">
          <text class="col w-no">单号</text>
          <text class="col w-date">日期</text>
          <text class="col w-drug">药材名</text>
          <text class="col w-spec">规格</text>
          <text class="col w-unit">单位</text>
          <text class="col w-batch">批号</text>
          <text class="col w-date">生产日期</text>
          <text class="col w-date">有效期</text>
          <text class="col w-manufacturer">生产厂家</text>
          <text class="col w-number">数量</text>
          <text class="col w-number">单价</text>
          <text class="col w-number">金额</text>
          <text class="col w-operator">操作人</text>
			</view>
        <view class="table-body">
          <view class="table-row detail" v-for="(item, idx) in detailRows" :key="idx">
            <text class="col w-no">{{ item.recordNo }}</text>
            <text class="col w-date">{{ formatDate(item.date) }}</text>
            <text class="col w-drug">{{ item.drugName }}</text>
            <text class="col w-spec">{{ item.specification }}</text>
            <text class="col w-unit">{{ item.unit }}</text>
            <text class="col w-batch">{{ item.batchNo }}</text>
            <text class="col w-date">{{ item.productionDate }}</text>
            <text class="col w-date">{{ item.expireDate }}</text>
            <text class="col w-manufacturer">{{ item.manufacturer }}</text>
            <text class="col w-number">{{ item.quantity }}</text>
            <text class="col w-number">{{ item.price }}</text>
            <text class="col w-number">{{ item.amount }}</text>
            <text class="col w-operator">{{ item.operator }}</text>
			</view>
        </view>
      </view>
      <view v-else class="empty-state">
        <text class="empty-icon">📄</text>
        <text class="empty-text">未找到明细</text>
        <text class="empty-hint">可以放宽搜索条件后再试</text>
			</view>
		</view>
		
    <view v-if="activeTab === 'period'" class="table-section">
      <view v-if="periodRows.length" class="table-wrapper detail">
        <view class="table-header detail">
          <text class="col w-no">单号</text>
          <text class="col w-date">日期</text>
          <text class="col w-drug">药材名</text>
          <text class="col w-spec">规格</text>
          <text class="col w-unit">单位</text>
          <text class="col w-batch">批号</text>
          <text class="col w-date">生产日期</text>
          <text class="col w-date">有效期</text>
          <text class="col w-manufacturer">生产厂家</text>
          <text class="col w-number">数量</text>
          <text class="col w-number">单价</text>
          <text class="col w-number">金额</text>
          <text class="col w-operator">操作人</text>
				</view>
        <view class="table-body">
          <view class="table-row detail" v-for="(item, idx) in periodRows" :key="idx">
            <text class="col w-no">{{ item.recordNo }}</text>
            <text class="col w-date">{{ formatDate(item.date) }}</text>
            <text class="col w-drug">{{ item.drugName }}</text>
            <text class="col w-spec">{{ item.specification }}</text>
            <text class="col w-unit">{{ item.unit }}</text>
            <text class="col w-batch">{{ item.batchNo }}</text>
            <text class="col w-date">{{ item.productionDate }}</text>
            <text class="col w-date">{{ item.expireDate }}</text>
            <text class="col w-manufacturer">{{ item.manufacturer }}</text>
            <text class="col w-number">{{ item.quantity }}</text>
            <text class="col w-number">{{ item.price }}</text>
            <text class="col w-number">{{ item.amount }}</text>
            <text class="col w-operator">{{ item.operator }}</text>
					</view>
				</view>
			</view>
      <view v-else class="empty-state">
        <text class="empty-icon">🗓️</text>
        <text class="empty-text">该时间段暂无入库</text>
        <text class="empty-hint">试试其它时间段</text>
      </view>
    </view>

    <view class="export-section" v-if="hasData">
      <view class="export-btn" @tap="exportExcel">
        <text class="export-icon">📄</text>
        <text class="export-text">导出Excel</text>
				</view>
      <view class="export-btn" @tap="exportPDF">
        <text class="export-icon">📑</text>
        <text class="export-text">导出PDF</text>
					</view>
      <view class="export-btn disabled">
        <text class="export-icon">🖨️</text>
        <text class="export-text">打印(开发中)</text>
				</view>
			</view>
	</view>
</template>

<script>
import FilterPanel from '@/components/filter-panel/index.vue'

export default {
  components: { FilterPanel },
	data() {
		return {
      tabs: [
        { value: 'summary', label: '入库汇总', desc: '逐单统计' },
        { value: 'detail', label: '药材明细', desc: '逐批记录' },
        { value: 'period', label: '时间段明细', desc: '一键时间段' }
      ],
      activeTab: 'summary',
      loading: false,
      summaryData: null,
      detailData: null,
      periodData: null,
      filters: {
			startDate: '',
			endDate: '',
			drugName: '',
        operator: '',
        recordNo: '',
        batchNo: '',
        quick: 'month',
        includeDraft: false
      },
      periodFilter: 'month',
      periodRange: {
        startDate: '',
        endDate: ''
      },
			quickFilters: [
				{ label: '今天', value: 'today' },
				{ label: '本周', value: 'week' },
				{ label: '本月', value: 'month' },
				{ label: '本季度', value: 'quarter' },
				{ label: '本年', value: 'year' },
				{ label: '自定义', value: 'custom' }
			],
      periodQuickFilters: [
        { label: '今天', value: 'today' },
        { label: '近7天', value: 'week' },
        { label: '本月', value: 'month' },
        { label: '本季度', value: 'quarter' },
        { label: '本年', value: 'year' }
      ],
      userInfo: uni.getStorageSync('userInfo') || {}
    }
  },
  computed: {
    summaryRows() {
      return this.summaryData?.records || []
    },
    detailRows() {
      return this.detailData?.details || []
    },
    periodRows() {
      return this.periodData?.details || []
    },
    statistics() {
      if (this.activeTab === 'summary') return this.summaryData?.statistics || null
      if (this.activeTab === 'detail') return this.detailData?.statistics || null
      if (this.activeTab === 'period') return this.periodData?.statistics || null
      return null
    },
    hasData() {
      if (this.activeTab === 'summary') return !!(this.summaryRows.length)
      if (this.activeTab === 'detail') return !!(this.detailRows.length)
      if (this.activeTab === 'period') return !!(this.periodRows.length)
      return false
    }
  },
  created() {
    this.initPage()
  },
  methods: {
		initPage() {
      this.applyQuickRange('month')
      this.fetchCurrentTab()
    },
    switchTab(value) {
      if (this.activeTab === value) return
      this.activeTab = value
      if (value === 'period' && !this.periodRange.startDate) {
        this.applyPeriodRange(this.periodFilter)
      }
      this.fetchCurrentTab()
    },
    fetchCurrentTab() {
      if (this.activeTab === 'summary') {
        this.loadSummary()
      } else if (this.activeTab === 'detail') {
        this.loadDetail()
      } else {
        this.loadPeriod()
      }
    },
    async loadSummary() {
      this.loading = true
      try {
        const payload = this.buildBasePayload()
        const res = await this.$api.callFunction('reports', {
          action: 'inboundReport',
          data: payload
        })
        if (res?.success) {
          this.summaryData = res.data
        }
      } catch (err) {
        console.error('加载汇总失败', err)
      } finally {
        this.loading = false
      }
    },
    async loadDetail() {
      this.loading = true
      try {
        const payload = this.buildBasePayload()
        const res = await this.$api.callFunction('reports', {
          action: 'inboundDetailReport',
          data: payload
        })
        if (res?.success) {
          this.detailData = res.data
        }
      } catch (err) {
        console.error('加载明细失败', err)
      } finally {
        this.loading = false
      }
    },
    async loadPeriod() {
      this.loading = true
      try {
        const res = await this.$api.callFunction('reports', {
          action: 'inboundDetailReport',
          data: {
            startDate: this.periodRange.startDate,
            endDate: this.periodRange.endDate
          }
        })
        if (res?.success) {
          this.periodData = res.data
        }
      } catch (err) {
        console.error('加载时间段明细失败', err)
      } finally {
        this.loading = false
      }
    },
    buildBasePayload() {
      return {
        startDate: this.filters.startDate,
        endDate: this.filters.endDate,
        drugName: this.filters.drugName,
        operator: this.filters.operator,
        recordNo: this.filters.recordNo,
        batchNo: this.filters.batchNo,
        includeDraft: this.filters.includeDraft
      }
    },
    updateFilter(key, value) {
      this.filters[key] = value
    },
    onDateChange({ start, end }) {
      this.filters.startDate = start || ''
      this.filters.endDate = end || ''
      this.filters.quick = 'custom'
    },
		selectQuickFilter(value) {
      this.applyQuickRange(value)
      if (value !== 'custom') {
        this.fetchCurrentTab()
      }
    },
    applyQuickRange(value) {
      this.filters.quick = value
      const { start, end } = this.getRangeByQuick(value)
      this.filters.startDate = start
      this.filters.endDate = end
    },
    selectPeriodFilter(value) {
      if (this.periodFilter === value) return
      this.periodFilter = value
      this.applyPeriodRange(value)
      this.loadPeriod()
    },
    applyPeriodRange(value) {
      const { start, end } = this.getRangeByQuick(value)
      this.periodRange.startDate = start
      this.periodRange.endDate = end
    },
    getRangeByQuick(value) {
			const today = new Date()
      const format = d => this.formatDate(d)
      let start = new Date(today)
      let end = new Date(today)
      switch (value) {
				case 'today':
					break
				case 'week': {
          const day = start.getDay() || 7
          start.setDate(start.getDate() - (day - 1))
					break
				}
        case 'month':
          start = new Date(today.getFullYear(), today.getMonth(), 1)
					break
				case 'quarter': {
					const quarter = Math.floor(today.getMonth() / 3)
          start = new Date(today.getFullYear(), quarter * 3, 1)
					break
				}
        case 'year':
          start = new Date(today.getFullYear(), 0, 1)
					break
        default:
          return { start: this.filters.startDate, end: this.filters.endDate }
      }
      return {
        start: format(start),
        end: format(end)
      }
    },
		resetFilters() {
      this.filters.drugName = ''
      this.filters.operator = ''
      this.filters.recordNo = ''
      this.filters.batchNo = ''
      this.filters.includeDraft = false
      this.applyQuickRange('month')
      this.fetchCurrentTab()
    },
    toggleIncludeDraft() {
      this.filters.includeDraft = !this.filters.includeDraft
      this.fetchCurrentTab()
    },
    viewDetail(id) {
      if (!id) return
      uni.navigateTo({
        url: `/pages-sub/in/detail?id=${id}`
      })
    },
    renderStatus(status) {
      const map = {
        draft: '草稿',
        pending_review: '待复核',
        rejected: '已驳回',
        completed: '已完成'
      }
      return map[status] || status || '-'
    },
    async exportExcel() {
      if (!this.hasData) {
        uni.showToast({ title: '暂无数据可导出', icon: 'none' })
        return
      }
      try {
        uni.showLoading({ title: '生成Excel...', mask: true })
        const payload = this.activeTab === 'period'
          ? { startDate: this.periodRange.startDate, endDate: this.periodRange.endDate }
          : this.buildBasePayload()
        const res = await this.$api.callFunction('reports', {
          action: 'exportInboundExcel',
          data: {
            ...payload,
            mode: this.activeTab === 'summary' ? 'summary' : 'detail',
            printUser: this.userInfo?.name || ''
          }
        })
        uni.hideLoading()
        if (res?.success && res.fileID && res.filename) {
          // 获取云临时下载链接
          const urlRes = await wx.cloud.getTempFileURL({ fileList: [res.fileID] })
          const fileUrl = urlRes?.fileList?.[0]?.tempFileURL
          if (fileUrl) {
            // 自动下载并保存到“医务室”文件夹
            this.downloadAndSaveLocal(fileUrl, res.filename, 'Excel')
          } else {
            uni.showToast({ title: '获取下载链接失败', icon: 'none' })
          }
        } else {
          uni.showToast({ title: '生成Excel失败', icon: 'none' })
        }
      } catch (err) {
        uni.hideLoading()
        console.error('导出Excel失败:', err)
        uni.showToast({ title: '导出失败', icon: 'none' })
      }
    },
    async exportPDF() {
      if (!this.hasData) {
        uni.showToast({ title: '暂无数据可导出', icon: 'none' })
        return
      }
      try {
        uni.showLoading({ title: '生成PDF...', mask: true })
        const payload = this.activeTab === 'period'
          ? { startDate: this.periodRange.startDate, endDate: this.periodRange.endDate }
          : this.buildBasePayload()
        const res = await this.$api.callFunction('reports', {
          action: 'exportInboundPDF',
          data: {
            ...payload,
            mode: this.activeTab === 'summary' ? 'summary' : 'detail',
            printUser: this.userInfo?.name || ''
          }
        })
        uni.hideLoading()
        if (res?.success && res.fileID) {
          // 用云文件ID生成临时下载链接
          const urlRes = await wx.cloud.getTempFileURL({ fileList: [res.fileID] })
          const fileUrl = urlRes?.fileList?.[0]?.tempFileURL
          // 自动下载并保存到“医务室”目录
          // 从云path推断pdf文件名
          let filename = ''
          if (res.fileID) {
            const idParts = res.fileID.split('/')
            filename = idParts[idParts.length - 1] || `inbound_report_${+new Date()}.pdf`
          }
          if (fileUrl) {
            this.downloadAndSaveLocal(fileUrl, filename, 'PDF')
          } else {
            uni.showToast({ title: '获取下载链接失败', icon: 'none' })
          }
        } else {
          uni.showToast({ title: '生成PDF失败', icon: 'none' })
        }
      } catch (err) {
        uni.hideLoading()
        uni.showToast({ title: '导出失败', icon: 'none' })
      }
    },
    // 通用本地保存方法
    downloadAndSaveLocal(fileUrl, filename, fileType) {
      const fs = wx.getFileSystemManager()
      const folder = `${wx.env.USER_DATA_PATH}`
      const savePath = `${folder}/${filename}`
      try {
        fs.mkdirSync(folder, true)
      } catch (e) {}
      uni.downloadFile({
        url: fileUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            fs.saveFile({
              tempFilePath: res.tempFilePath,
              filePath: savePath,
              success: () => {
                const lower = (filename || '').toLowerCase()
                let fileTypeExt = 'xlsx'
                if (lower.endsWith('.pdf')) fileTypeExt = 'pdf'
                wx.openDocument({
                  filePath: savePath,
                  fileType: fileTypeExt,
                  showMenu: true,
                  fail: () => {
                    uni.showModal({
                      title: `${fileType}文件已保存`,
                      content: `文件已保存到：微信-我-服务-小程序-我的文件/${filename}\n\n请前往微信-我-服务-小程序-我的文件 查看、分享或导出。`,
                      showCancel: false,
                      confirmText: '知道了'
                    })
                  }
                })
              },
              fail: () => {
                uni.showToast({ title: '保存失败', icon: 'none' })
              }
            })
          } else {
            uni.showToast({ title: '下载失败', icon: 'none' })
          }
        },
        fail: () => {
          uni.showToast({ title: '文件下载失败', icon: 'none' })
        }
      })
    },
		printReport() {
			uni.showToast({
				title: '打印功能开发中',
				icon: 'none'
			})
		},
		formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      if (Number.isNaN(d.getTime())) return ''
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 140rpx;
}

.page-header {
	display: flex;
	justify-content: space-between;
  align-items: center;
  padding: 40rpx 30rpx 30rpx;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
}

.page-title {
		font-size: 40rpx;
  font-weight: 600;
  color: #1e1b4b;
}

.page-subtitle {
	font-size: 24rpx;
  color: #6366f1;
  margin-top: 8rpx;
}

.page-actions {
	display: flex;
	gap: 16rpx;
}

.header-btn {
	display: flex;
	align-items: center;
  gap: 8rpx;
  padding: 18rpx 32rpx;
	border-radius: 999rpx;
		font-size: 26rpx;
  font-weight: 500;
  border: 1rpx solid rgba(99, 102, 241, 0.4);
	
	&.primary {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: #fff;
		border: none;
    box-shadow: 0 8rpx 20rpx rgba(99, 102, 241, 0.25);
  }

  &.ghost {
    background: #fff;
    color: #4338ca;
	}
}

.btn-icon {
  font-size: 26rpx;
}

.tab-bar {
  display: flex;
  gap: 16rpx;
  padding: 20rpx 30rpx;
}

.tab-item {
  flex: 1;
  padding: 20rpx;
  border-radius: 18rpx;
  background: #fff;
  border: 2rpx solid transparent;
  box-shadow: 0 6rpx 20rpx rgba(15, 23, 42, 0.05);
	display: flex;
  flex-direction: column;
  gap: 10rpx;

  &.active {
    border-color: #4f46e5;
    box-shadow: 0 10rpx 22rpx rgba(79, 70, 229, 0.18);
  }
}

.tab-label {
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
}

.tab-desc {
  font-size: 24rpx;
  color: #6b7280;
}

.filter-panel-wrapper {
	margin: 0 30rpx 20rpx;
}

.filter-extra {
			display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
  margin-top: 14rpx;
}

.extra-item {
	flex: 1;
  min-width: 220rpx;
  background: #f9fafb;
  padding: 16rpx 22rpx;
  border-radius: 14rpx;
	display: flex;
	flex-direction: column;
  gap: 8rpx;
}

.extra-label {
	font-size: 24rpx;
	color: #94a3b8;
}

.extra-input {
				font-size: 28rpx;
  color: #111827;
}

.toggle-item {
  flex: none;
  width: 220rpx;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

.toggle {
  width: 86rpx;
  height: 40rpx;
	border-radius: 999rpx;
  background: #e5e7eb;
  position: relative;

  &.active {
    background: #4ade80;
  }
}

.toggle-dot {
  position: absolute;
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  background: #fff;
  top: 3rpx;
  left: 4rpx;
  transition: transform 0.2s;
}

.toggle.active .toggle-dot {
  transform: translateX(44rpx);
}

.period-filter-card {
  margin: 0 30rpx 20rpx;
  padding: 28rpx;
  background: #fff;
  border-radius: 18rpx;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.08);
}

.period-title {
			font-size: 28rpx;
	font-weight: 600;
  color: #1e293b;
  margin-bottom: 16rpx;
}

.period-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.period-chip {
  padding: 14rpx 28rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
  font-size: 26rpx;
	color: #475569;

  &.active {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: #fff;
    box-shadow: 0 8rpx 18rpx rgba(99, 102, 241, 0.24);
  }
}

.period-range {
  font-size: 26rpx;
  color: #334155;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.range-hint {
  font-size: 24rpx;
  color: #94a3b8;
}

.stats-card {
  margin: 0 30rpx 20rpx;
  padding: 24rpx;
  background: #fff;
  border-radius: 18rpx;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  box-shadow: 0 6rpx 20rpx rgba(15, 23, 42, 0.05);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 34rpx;
  font-weight: 600;
  color: #1d4ed8;
}

.stat-label {
  font-size: 24rpx;
  color: #94a3b8;
}

.table-section {
	margin: 0 30rpx 20rpx;
}

.table-wrapper {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 12rpx 30rpx rgba(15, 23, 42, 0.08);
	overflow: hidden;
}
	
	.table-header {
		display: flex;
  padding: 22rpx 16rpx;
  background: #f8fafc;
		font-size: 24rpx;
  font-weight: 600;
  color: #475569;

  &.detail {
    font-size: 22rpx;
		}
	}
	
	.table-body {
  max-height: 900rpx;
}
		
		.table-row {
			display: flex;
  align-items: center;
  padding: 18rpx 16rpx;
			font-size: 24rpx;
  color: #0f172a;
  border-bottom: 1rpx solid #f1f5f9;

  &.detail {
    font-size: 22rpx;
  }
}

.table-row:last-child {
				border-bottom: none;
			}
			
			.col {
				text-align: center;
  padding: 0 8rpx;

  &.col-no {
    width: 200rpx;
    text-align: left;
  }
  &.col-date {
    width: 150rpx;
  }
  &.col-operator {
    width: 140rpx;
  }
  &.col-status {
    width: 120rpx;
  }
  &.col-drugs {
    width: 110rpx;
  }
  &.col-quantity,
  &.col-amount {
    width: 150rpx;
  }

  &.w-no {
    width: 200rpx;
    text-align: left;
  }
  &.w-date {
    width: 150rpx;
  }
  &.w-drug {
    width: 200rpx;
    text-align: left;
  }
  &.w-spec {
    width: 180rpx;
  }
  &.w-unit {
    width: 80rpx;
  }
  &.w-batch {
    width: 160rpx;
  }
  &.w-manufacturer {
    width: 200rpx;
    text-align: left;
  }
  &.w-number {
    width: 120rpx;
  }
  &.w-operator {
    width: 150rpx;
  }
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

.export-section {
  display: flex;
  gap: 18rpx;
  padding: 0 30rpx 40rpx;
}

.export-btn {
  flex: 1;
  background: #fff;
  border-radius: 18rpx;
  padding: 26rpx;
				display: flex;
				align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10rpx;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.08);
}

.export-icon {
  font-size: 42rpx;
}

.export-text {
  font-size: 24rpx;
  color: #475569;
}
</style>
