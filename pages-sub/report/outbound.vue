<template>
	<view class="container">
		<view class="page-header">
			<view class="header-left">
	      <text class="page-title">出库管理报表</text>
			</view>
			<view class="page-actions">
	      <view class="header-btn ghost" @tap="resetFilters">
	        <text class="btn-icon">↺</text>
	        <text class="btn-text">重置</text>
				</view>
	      <view class="header-btn primary" @tap="fetchCurrentTab">
					<text class="btn-icon" style="color: blue;">↻</text>
	        <text class="btn-text">刷新</text>
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
			:hideKeyword="true"
      :show-search-button="false"
      keyword-placeholder="输入单号/药材"
      :keyword="filters.recordNo"
      @update:startDate="val => updateFilter('startDate', val)"
      @update:endDate="val => updateFilter('endDate', val)"
			@quick-filter="selectQuickFilter"
			@date-change="onDateChange"
      @update:keyword="val => updateFilter('recordNo', val)"
      @search="fetchCurrentTab"
		>
				<view class="filter-extra">
					<!-- 行1：药材名称 -->
					<view class="filter-row">
						<view class="extra-item extra-item--drug">
							<text class="extra-label">药材名称</text>
							<view class="extra-input-wrapper">
								<text class="extra-input-icon">🔍</text>
								<input
									class="extra-input"
									v-model.trim="filters.drugName"
									placeholder="模糊查询药材名"
									@confirm="fetchCurrentTab"
								/>
							</view>
						</view>
					</view>

					<!-- 行2：发放人 + 园区 -->
					<view class="filter-row filter-row--two">
						<view class="extra-item extra-item--operator">
							<text class="extra-label">发放人</text>
			      <view class="extra-input-wrapper">
			        <text class="extra-input-icon">🔍</text>
			        <input
			          class="extra-input"
			          v-model.trim="filters.operator"
			          placeholder="输入发放人"
			          @confirm="fetchCurrentTab"
			        />
			      </view>
			    </view>
			    <view class="extra-item extra-item--location">
							<text class="extra-label">园区</text>
			      <picker
			        mode="selector"
			        :range="locationOptions"
			        range-key="label"
			        :value="locationFilterIndex"
			        @change="onLocationFilterChange"
			      >
			        <view class="extra-input">
			          {{ locationOptions[locationFilterIndex].label }}
			        </view>
			      </picker>
			    </view>
				</view>

					<!-- 行3：批号 + 草稿数据 -->
					<view class="filter-row filter-row--two">
						<view class="extra-item extra-item--batch">
							<text class="extra-label">批号</text>
							<view class="extra-input-wrapper">
								<text class="extra-input-icon">🔍</text>
								<input
									class="extra-input"
									v-model.trim="filters.batchNo"
									placeholder="输入批号"
									@confirm="fetchCurrentTab"
								/>
							</view>
						</view>
						<view class="extra-item toggle-item" @tap="toggleIncludeDraft">
							<text class="extra-label">草稿数据</text>
							<view class="toggle" :class="{ active: filters.includeDraft }">
								<view class="toggle-dot"></view>
							</view>
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
        <text class="stat-label">药材种类</text>
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
			<view v-if="summaryRows.length" class="detail-list">
				<view
					class="detail-card"
					v-for="item in summaryRows"
					:key="item._id"
					@tap="viewDetail(item._id)"
				>
					<!-- 顶部：单号 + 日期 -->
					<view class="detail-row detail-row-top">
						<text class="detail-no">{{ item.recordNo }}</text>
						<text class="detail-date">{{ formatDate(item.createTime) }}</text>
					</view>

					<!-- 发放人 + 状态 -->
					<view class="detail-row detail-row-meta">
						<text class="meta-label">发放人</text>
						<text class="meta-value">{{ item.operator || '-' }}</text>
						<text class="meta-label">状态</text>
						<text class="meta-value">{{ renderStatus(item.status) }}</text>
					</view>

					<!-- 品种数 + 总数量 + 总金额 -->
					<view class="detail-row detail-row-main">
						<view class="detail-main-left">
							<text class="detail-spec">品种：{{ item.drugCount }} 种</text>
						</view>
						<view class="detail-main-right">
							<text class="detail-qty">{{ item.totalQuantity }}</text>
							<text class="detail-amount">¥{{ item.totalAmount }}</text>
						</view>
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
      <view v-if="detailRows.length" class="detail-list">
        <view
          class="detail-card"
          v-for="(item, idx) in detailRows"
          :key="idx"
        >
          <!-- 顶部：单号 + 日期 -->
          <view class="detail-row detail-row-top">
            <text class="detail-no">{{ item.recordNo }}</text>
            <text class="detail-date">{{ formatDate(item.date) }}</text>
          </view>

          <!-- 药名 + 数量 + 金额 -->
          <view class="detail-row detail-row-main">
            <view class="detail-main-left">
              <text class="detail-drug">{{ item.drugName }}</text>
              <text class="detail-spec">{{ item.specification }}</text>
            </view>
            <view class="detail-main-right">
              <text class="detail-qty">{{ item.quantity }}{{ item.unit }}</text>
              <text class="detail-amount" v-if="item.amount != null">¥{{ item.amount }}</text>
            </view>
          </view>

          <!-- 批号 + 发放人 -->
          <view class="detail-row detail-row-meta">
            <text class="meta-label">批号</text>
            <text class="meta-value mono">{{ item.batchNo || '-' }}</text>
            <text class="meta-label">发放人</text>
            <text class="meta-value">{{ item.operator || '-' }}</text>
          </view>

          <!-- 生产 / 有效期 -->
          <view class="detail-row detail-row-meta">
            <text class="meta-label">生产</text>
            <text class="meta-value">{{ item.productionDate || '-' }}</text>
            <text class="meta-label">有效</text>
            <text class="meta-value">{{ item.expireDate || '-' }}</text>
          </view>

          <!-- 厂家 -->
          <view class="detail-row detail-row-manufacturer" v-if="item.manufacturer">
            <text class="meta-label">厂家</text>
            <text class="meta-value">{{ item.manufacturer }}</text>
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
			<view v-if="periodRows.length" class="detail-list">
				<view
					class="detail-card"
					v-for="(item, idx) in periodRows"
					:key="idx"
				>
					<!-- 顶部：单号 + 日期 -->
					<view class="detail-row detail-row-top">
						<text class="detail-no">{{ item.recordNo }}</text>
						<text class="detail-date">{{ formatDate(item.date) }}</text>
					</view>

					<!-- 药名 + 数量 + 金额 -->
					<view class="detail-row detail-row-main">
						<view class="detail-main-left">
							<text class="detail-drug">{{ item.drugName }}</text>
							<text class="detail-spec">{{ item.specification }}</text>
						</view>
						<view class="detail-main-right">
							<text class="detail-qty">{{ item.quantity }}{{ item.unit }}</text>
							<text class="detail-amount" v-if="item.amount != null">¥{{ item.amount }}</text>
						</view>
					</view>

					<!-- 批号 + 操作人 -->
					<view class="detail-row detail-row-meta">
						<text class="meta-label">批号</text>
						<text class="meta-value mono">{{ item.batchNo || '-' }}</text>
						<text class="meta-label">操作人</text>
						<text class="meta-value">{{ item.operator || '-' }}</text>
					</view>

					<!-- 生产 / 有效期 -->
					<view class="detail-row detail-row-meta">
						<text class="meta-label">生产</text>
						<text class="meta-value">{{ item.productionDate || '-' }}</text>
						<text class="meta-label">有效</text>
						<text class="meta-value">{{ item.expireDate || '-' }}</text>
					</view>

					<!-- 厂家 -->
					<view class="detail-row detail-row-manufacturer" v-if="item.manufacturer">
						<text class="meta-label">厂家</text>
						<text class="meta-value">{{ item.manufacturer }}</text>
					</view>
				</view>
			</view>
			<view v-else class="empty-state">
				<text class="empty-icon">🗓️</text>
				<text class="empty-text">该时间段暂无出库</text>
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
        { value: 'summary', label: '出库汇总', desc: '逐单统计' },
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
        toLocation: '',
        quick: 'month',
        includeDraft: false
      },
      locationFilterIndex: 0,
      locationOptions: [
        { label: '全部园区', value: '' },
        { label: '陆园', value: 'land_park' },
        { label: '水园', value: 'water_park' }
      ],
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
    // 默认按当前快捷筛选和时间段加载数据
    this.applyQuickRange(this.filters.quick || 'month')
    this.applyPeriodRange(this.periodFilter || 'month')
  },
  methods: {
    // 顶部标签切换
    switchTab(value) {
      if (this.activeTab === value) return
      this.activeTab = value
      // 时间段标签使用独立的 periodRange
      if (value === 'period') {
        // 保证 periodRange 已根据当前 periodFilter 设置好
        this.applyPeriodRange(this.periodFilter || 'month')
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
          action: 'outboundReport',
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
          action: 'outboundDetailReport',
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
          action: 'outboundDetailReport',
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
        toLocation: this.filters.toLocation || '',
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
      this.filters.toLocation = ''
      this.locationFilterIndex = 0
      this.filters.includeDraft = false
      this.applyQuickRange('month')
      this.fetchCurrentTab()
    },
    onLocationFilterChange(e) {
      const idx = Number(e.detail.value || 0)
      this.locationFilterIndex = idx
      this.filters.toLocation = this.locationOptions[idx].value
      this.fetchCurrentTab()
    },
    toggleIncludeDraft() {
      this.filters.includeDraft = !this.filters.includeDraft
      this.fetchCurrentTab()
    },
    viewDetail(id) {
      if (!id) return
      uni.navigateTo({
        url: `/pages-sub/out/detail?id=${id}`
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
          action: 'exportOutboundExcel',
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
          action: 'exportOutboundPDF',
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
            filename = idParts[idParts.length - 1] || `outbound_report_${+new Date()}.pdf`
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
	/* 使用与其它工作台一致的蓝色渐变背景 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding: 24rpx 24rpx 140rpx;
}

.page-header {
	max-width: 702rpx;
	margin: 10rpx auto 8rpx;
	padding: 22rpx 22rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow:
		0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
		0 -1rpx 0 rgba(15, 23, 42, 0.06) inset,
		0 18rpx 40rpx rgba(15, 23, 42, 0.14);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.page-title {
	font-size: 36rpx;
	font-weight: 650;
	color: #0f172a;
}

.page-subtitle {
	font-size: 24rpx;
	color: #6366f1;
	margin-top: 6rpx;
}

.page-actions {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 12rpx;
}

.header-btn {
	display: flex;
	align-items: center;
	gap: 6rpx;
	padding: 10rpx 22rpx;
	border-radius: 999rpx;
	font-size: 24rpx;
	font-weight: 500;
	background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
	color: #ffffff;
	border: none;
	box-shadow: 0 6rpx 16rpx rgba(0, 160, 255, 0.25);

	&.primary {
		background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
		color: #ffffff;
	}
}

.filter-panel-wrapper {
	/* 与入库报表相同：仅在底部留 8rpx */
	margin: 0 auto 8rpx;
	max-width: 702rpx;
}

/* 统一筛选卡内部白卡片与明细卡的左右内边距（22rpx） */
:deep(.filter-panel) {
	padding-left: 22rpx;
	padding-right: 22rpx;
}

.filter-extra {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	margin-top: 14rpx;
}

.filter-row {
	display: flex;
	flex-direction: row;
	gap: 12rpx;
}

.filter-row--two {
	justify-content: space-between;
}

.extra-item {
	flex: 1 1 auto;
	background: #f3f4f6;
	padding: 16rpx 22rpx;
	border-radius: 14rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 16rpx;
	flex-wrap: nowrap;
}

.extra-item--operator {
	flex: 1.3 1 0;
}

.extra-item--location {
	flex: 0.7 1 0;
}

.toggle-item {
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

.extra-label {
	font-size: 24rpx;
	color: #94a3b8;
	white-space: nowrap;
}

.extra-input-wrapper {
	position: relative;
	background: #f5f5f5;
	border-radius: 999rpx;
	padding: 10rpx 20rpx 10rpx 52rpx;
}

.extra-input-icon {
	position: absolute;
	left: 24rpx;
	top: 50%;
	transform: translateY(-50%);
	font-size: 26rpx;
	color: #94a3b8;
}

.extra-input {
				font-size: 28rpx;
  color: #111827;
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
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 22rpx 24rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
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
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 18rpx 22rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 12rpx;
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

.tab-bar {
	display: flex;
	/* 与入库页一致：在 702rpx 内容区域内居中并左右留均匀空白 */
	justify-content: center;
	gap: 12rpx;
	max-width: 702rpx;
	/* 自身只在底部留 8rpx，下方卡片不再额外加上边距 */
	margin: 0 auto 8rpx;
	padding: 0;
}

.tab-item {
	/* 三个 Tab 平均分配整行宽度，覆盖编译生成的固定 width */
	flex: 1 1 0;
	width: auto !important;
	padding: 18rpx 16rpx;
	border-radius: 18rpx;
	background: #ffffff;
	border: 2rpx solid transparent;
	box-shadow: 0 8rpx 22rpx rgba(15, 23, 42, 0.08);
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: 6rpx;

	&.active {
		border-color: #06b6d4;
		box-shadow: 0 10rpx 26rpx rgba(8, 145, 178, 0.3);
	}
}

.tab-label {
	font-size: 30rpx;
	font-weight: 600;
	color: #0f172a;
}

.tab-desc {
	font-size: 22rpx;
	color: #6b7280;
}

.table-section {
	/* 与入库报表相同：只负责宽度与统一 8rpx 底部间距 */
	margin: 0 auto 8rpx;
	max-width: 702rpx;
	padding: 0 0 10rpx;
	background: transparent;
}

.table-wrapper {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 12rpx 30rpx rgba(15, 23, 42, 0.08);
	overflow: hidden;
}

// 药材明细卡片列表（detail tab 专用）
.detail-list {
	margin: 0 0 6rpx;
}

.detail-card {
	background: #FFFFF0;
	border-radius: 18rpx;
	padding: 18rpx 22rpx 14rpx;
	margin: 0 0 8rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	border: 1rpx solid #e5e7eb;
}

.detail-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 6rpx;
}

.detail-row-top {
	margin-bottom: 6rpx;
}

.detail-no {
	font-size: 26rpx;
	font-weight: 600;
	color: #111827;
}

.detail-date {
	font-size: 24rpx;
	color: #6b7280;
}

.detail-main-left {
	flex: 1;
	margin-right: 12rpx;
	display: flex;
	flex-direction: column;
}

.detail-drug {
	font-size: 28rpx;
	font-weight: 600;
	color: #111827;
}

.detail-spec {
	margin-top: 4rpx;
	font-size: 24rpx;
	color: #6b7280;
}

.detail-main-right {
	min-width: 150rpx;
	text-align: right;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.detail-qty {
	font-size: 26rpx;
	font-weight: 600;
	color: #2563eb;
}

.detail-amount {
	margin-top: 2rpx;
	font-size: 24rpx;
	color: #ef4444;
}

.detail-row-meta,
.detail-row-manufacturer {
	font-size: 22rpx;
	color: #4b5563;
}

.meta-label {
	color: #9ca3af;
	margin-right: 6rpx;
}

.meta-value {
	margin-right: 20rpx;
}

.meta-value.mono {
	font-family: 'DIN Alternate', 'Courier New', monospace;
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
	background: #ffffff;
	padding: 80rpx 24rpx 90rpx;
	border-radius: 20rpx;
	text-align: center;
	color: #94a3b8;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.08);
}

.empty-icon {
  font-size: 90rpx;
}

.export-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	display: flex;
	gap: 18rpx;
	padding: 0 0 40rpx;
}

.export-btn {
	flex: 1;
	border-radius: 999rpx;
	padding: 18rpx 18rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
	color: #ffffff;
	box-shadow: 0 6rpx 16rpx rgba(0, 160, 255, 0.25);
}

.export-icon {
	font-size: 40rpx;
}

.export-text {
	font-size: 24rpx;
	color: #ffffff;
}
</style>
