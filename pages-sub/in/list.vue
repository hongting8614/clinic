<template>
	<view class="container">
		<!-- 页面头部 -->
		<view class="page-header">
			<view>
				<text class="page-title">入库管理</text>
				<text class="page-subtitle">{{ currentTime }}</text>
			</view>
			<view class="page-actions">
				<view class="header-btn ghost" @tap="refreshList">刷新</view>
				<view class="header-btn primary" @tap="goAdd">新建入库单</view>
			</view>
		</view>
		
		<filter-panel
			class="panel-wrapper"
			:keyword="searchKeyword"
			keyword-placeholder="搜索单号/药品名称"
			:show-date="true"
			:start-date="startDate"
			:end-date="endDate"
			:quick-filters="quickFilters"
			:active-quick-filter="selectedQuickFilter"
			:show-search-button="false"
			@update:keyword="onKeywordUpdate"
			@update:startDate="onStartDateUpdate"
			@update:endDate="onEndDateUpdate"
			@quick-filter="selectQuickFilter"
			@date-change="onDateRangeChange"
			@search="generateList"
		>
			<view class="filter-extra">
				<view class="extra-item selectable" @tap="showStatusPicker = true">
					<text class="extra-label">状态</text>
					<text class="extra-value">{{ statusLabel }}</text>
				</view>
			</view>
		</filter-panel>
		
		<view class="filter-action-bar">
			<view class="action-btn ghost" @tap="resetFilters">重置</view>
			<view class="action-btn primary" @tap="generateList">查询</view>
		</view>
		
		<view class="result-meta">
			<text class="meta-item">记录数：{{ recordList.length }}</text>
			<text class="meta-dot">•</text>
			<text class="meta-item">待复核：{{ statusSummary.pending_review }}</text>
			<text class="meta-dot">•</text>
			<text class="meta-item">已完成：{{ statusSummary.completed }}</text>
			<text class="meta-dot">•</text>
			<text class="meta-item">驳回：{{ statusSummary.rejected }}</text>
		</view>
		
		<!-- 列表 -->
		<view class="list-container">
			<view 
				v-for="item in recordList" 
				:key="item._id"
				class="record-card"
				@click="goDetail(item._id, item)"
			>
				<!-- 单号和状态 -->
				<view class="record-header">
					<view class="record-no">{{ item.recordNo }}</view>
					<view :class="['record-status', `status-${item.status}`]">
						{{ getStatusText(item.status) }}
					</view>
				</view>
				
				<!-- 基本信息 -->
				<view class="record-info">
					<view class="info-item">
						<text class="info-label">操作人：</text>
						<text class="info-value">{{ item.operator }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">创建时间：</text>
						<text class="info-value">{{ item.createTime }}</text>
					</view>
					<view class="info-item" v-if="item.supplier">
						<text class="info-label">供应商：</text>
						<text class="info-value">{{ item.supplier }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">药品种类：</text>
						<text class="info-value">{{ item.items.length }} 种</text>
					</view>
				</view>
				
				<!-- 待复核时显示操作按钮 -->
				<view v-if="item.status === 'pending_review' && canReview(item)" class="record-actions">
					<u-button 
						text="去复核" 
						type="primary" 
						size="small"
						@click.stop="goReview(item._id)"
					></u-button>
				</view>
				
				<!-- 已驳回时显示驳回原因 -->
				<view v-if="item.status === 'rejected'" class="record-actions">
					<view class="reject-reason">驳回原因：{{ item.rejectReason }}</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view v-if="recordList.length === 0" class="empty-state">
				<text class="empty-icon">📋</text>
				<text class="empty-text">
					暂无{{ statusLabel === '全部' ? '' : statusLabel }}入库单
				</text>
			</view>
			
			<!-- 加载更多 -->
			<view v-if="hasMore" class="load-more" @click="loadMore">
				<text>加载更多</text>
			</view>
			<view v-else-if="recordList.length > 0" class="no-more">
				<text>没有更多了</text>
			</view>
		</view>
		
		<!-- 状态选择 -->
		<u-popup v-model="showStatusPicker" mode="bottom">
			<view class="status-picker">
				<view class="picker-header">
					<view>
						<text class="picker-title">筛选入库状态</text>
						<text class="picker-subtitle">选择后点击“应用”立即更新列表</text>
					</view>
					<text class="picker-close" @tap="showStatusPicker = false">✕</text>
				</view>
				
				<view class="status-grid">
					<view 
						v-for="item in statusOptions" 
						:key="item.value"
						:class="['status-chip', item.value, { active: tempStatus === item.value }]"
						@tap="tempStatus = item.value"
					>
						<view class="chip-left">
							<text class="chip-icon">{{ item.icon }}</text>
						</view>
						<view class="chip-center">
							<text class="chip-label">{{ item.label }}</text>
							<text class="chip-desc">{{ item.desc }}</text>
						</view>
						<text v-if="tempStatus === item.value" class="chip-check">✓</text>
					</view>
				</view>
				
				<view class="status-footer">
					<view class="footer-info">
						<text>当前选择：{{ tempStatusLabel }}</text>
					</view>
					<view class="footer-actions">
						<view class="action ghost" @tap="resetTempStatus">重置</view>
						<view class="action primary" @tap="confirmStatus">应用</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import FilterPanel from '@/components/filter-panel/index.vue'

export default {
	components: {
		FilterPanel
	},
	data() {
		return {
			currentTime: '',
			recordList: [],
			page: 1,
			pageSize: 10,
			hasMore: true,
			currentUserId: '',
			statusFilter: 'all',
			tempStatus: 'all',
			showStatusPicker: false,
			statusOptions: [
				{ label: '全部', value: 'all', icon: '🌐', desc: '展示全部记录' },
				{ label: '草稿', value: 'draft', icon: '📝', desc: '尚未提交的草稿单' },
				{ label: '待复核', value: 'pending_review', icon: '👁️', desc: '等待复核确认' },
				{ label: '已完成', value: 'completed', icon: '✅', desc: '复核通过并入库' },
				{ label: '已驳回', value: 'rejected', icon: '⚠️', desc: '存在问题被退回' }
			],
			statsData: {
				today: 0,
				thisWeek: 0,
				thisMonth: 0,
				pending: 0
			},
			statusSummary: {
				all: 0,
				draft: 0,
				pending_review: 0,
				completed: 0,
				rejected: 0
			},
			// 搜索相关
			searchKeyword: '',
			searchTimer: null,
			// 日期筛选相关
			startDate: '',
			endDate: '',
			selectedQuickFilter: 'month',
			quickFilters: [
				{ label: '全部', value: 'all' },
				{ label: '今天', value: 'today' },
				{ label: '本周', value: 'week' },
				{ label: '本月', value: 'month' },
				{ label: '自定义', value: 'custom' }
			]
		}
	},
	
	onLoad() {
		this.initPage()
	},
	
	computed: {
		statusLabel() {
			const found = this.statusOptions.find(item => item.value === this.statusFilter)
			return found ? found.label : '全部'
		},
		tempStatusLabel() {
			const found = this.statusOptions.find(item => item.value === this.tempStatus)
			return found ? found.label : '全部'
		},
		dateFilterText() {
			if (!this.startDate && !this.endDate) {
				return '全部时间'
			}
			if (this.selectedQuickFilter === 'today') {
				return '今天'
			}
			if (this.selectedQuickFilter === 'week') {
				return '本周'
			}
			if (this.selectedQuickFilter === 'month') {
				return '本月'
			}
			if (this.startDate && this.endDate) {
				return `${this.startDate} ~ ${this.endDate}`
			}
			if (this.startDate) {
				return `${this.startDate} 起`
			}
			if (this.endDate) {
				return `至 ${this.endDate}`
			}
			return '全部时间'
		}
	},
	
	onShow() {
		// 只在从其他页面返回时刷新，避免重复加载
		// 如果列表为空，说明可能是首次加载，此时不需要刷新
		if (this.recordList.length > 0) {
			this.refreshList()
		}
	},
	
	// 下拉刷新
	onPullDownRefresh() {
		this.refreshList()
		setTimeout(() => {
			uni.stopPullDownRefresh()
		}, 1000)
	},
	
	methods: {
	initPage() {
		// 获取当前用户ID（兼容 userId 和 _id）
		const userInfo = uni.getStorageSync('userInfo')
		this.currentUserId = userInfo?.userId || userInfo?._id || ''
		
		console.log('📋 入库列表页初始化:', {
			hasUserInfo: !!userInfo,
			currentUserId: this.currentUserId,
			userRole: userInfo?.role
		})
		
		// 设置当前时间
		this.updateCurrentTime()
		
		this.selectQuickFilter('month')
		this.loadStats()
	},
		
		updateCurrentTime() {
			const now = new Date()
			const year = now.getFullYear()
			const month = String(now.getMonth() + 1).padStart(2, '0')
			const day = String(now.getDate()).padStart(2, '0')
			this.currentTime = `${year}年${month}月${day}日`
		},
		
	async loadRecords() {
		// 首次加载显示 loading，刷新时不显示
		const isFirstLoad = this.page === 1 && this.recordList.length === 0
		
		try {
			// 使用 callFunction 的第三个参数控制是否显示 loading
			const result = await this.$api.callFunction('inRecords', {
				action: 'getList',
				data: {
					status: this.statusFilter,
					page: this.page,
					pageSize: this.pageSize,
					keyword: this.searchKeyword,
					startDate: this.startDate,
					endDate: this.endDate
				}
			}, isFirstLoad)  // 只在首次加载时显示 loading
			
			// result 已经是处理后的数据了（request.js 已处理）
			if (result && result.success) {
				let newData = result.data || []
				
				// 如果有搜索关键词，在前端再过滤一次（以防云函数不支持）
				if (this.searchKeyword) {
					newData = this.filterByKeyword(newData)
				}
				
				this.recordList = this.page === 1 ? newData : [...this.recordList, ...newData]
				this.hasMore = newData.length >= this.pageSize
			} else if (Array.isArray(result)) {
				// 兼容直接返回数组的情况
				let newData = result
				if (this.searchKeyword) {
					newData = this.filterByKeyword(newData)
				}
				this.recordList = this.page === 1 ? newData : [...this.recordList, ...newData]
				this.hasMore = newData.length >= this.pageSize
			} else {
				// 如果没有数据，设置为空数组
				this.recordList = this.page === 1 ? [] : this.recordList
				this.hasMore = false
			}
		} catch (err) {
			console.error('加载失败:', err)
			// request.js 已经处理了错误提示，这里只记录日志
			// 首次加载失败时设置空数据
			if (isFirstLoad) {
				this.recordList = []
				this.hasMore = false
			}
		}
	},
	
	// 前端关键词过滤
	filterByKeyword(list) {
		if (!this.searchKeyword) return list
		const keyword = this.searchKeyword.toLowerCase()
		return list.filter(item => {
			// 搜索单号
			if (item.recordNo && item.recordNo.toLowerCase().includes(keyword)) {
				return true
			}
			// 搜索药品名称
			if (item.items && Array.isArray(item.items)) {
				return item.items.some(drug => 
					drug.drugName && drug.drugName.toLowerCase().includes(keyword)
				)
			}
			return false
		})
	},
	
	async loadCounts() {
		try {
			const result = await this.$api.callFunction('inRecords', {
				action: 'getCounts',
				data: {}
			}, false)  // 不显示 loading
			
			if (result && result.success) {
				this.statusSummary = {
					all: result.all || 0,
					draft: result.draft || 0,
					pending_review: result.pending_review || 0,
					completed: result.completed || 0,
					rejected: result.rejected || 0
				}
			} else if (result) {
				this.statusSummary = {
					all: result.all || 0,
					draft: result.draft || 0,
					pending_review: result.pending_review || 0,
					completed: result.completed || 0,
					rejected: result.rejected || 0
				}
			}
		} catch (err) {
			console.error('加载数量失败:', err)
			// request.js 已处理错误提示
		}
	},
	
	async loadStats() {
		// 不使用 loading，避免影响用户体验
		try {
			const result = await this.$api.callFunction('inRecords', {
				action: 'getStats',
				data: {}
			}, false)  // 不显示 loading
			
			if (result && result.success) {
				this.statsData = {
					today: result.today || 0,
					thisWeek: result.thisWeek || 0,
					thisMonth: result.thisMonth || 0,
					pending: result.pending || 0
				}
			} else if (result) {
				// 兼容直接返回数据的情况
				this.statsData = {
					today: result.today || 0,
					thisWeek: result.thisWeek || 0,
					thisMonth: result.thisMonth || 0,
					pending: result.pending || 0
				}
			} else {
				// 如果 getStats 失败，使用 getCounts 作为备用
				this.fallbackStats()
			}
		} catch (err) {
			console.error('加载统计失败:', err)
			// 使用 getCounts 的数据作为备用
			this.fallbackStats()
		}
	},
	
	async fallbackStats() {
		try {
			const countsResult = await this.$api.callFunction('inRecords', {
				action: 'getCounts',
				data: {}
			}, false)  // 不显示 loading
			
			if (countsResult && countsResult.success) {
				this.statsData.today = countsResult.today || 0
				this.statsData.pending = countsResult.pending_review || 0
				// 本周和本月使用今日数据作为占位
				this.statsData.thisWeek = countsResult.today || 0
				this.statsData.thisMonth = countsResult.completed || 0
			} else if (countsResult) {
				// 兼容直接返回数据的情况
				this.statsData.today = countsResult.today || 0
				this.statsData.pending = countsResult.pending_review || 0
				this.statsData.thisWeek = countsResult.today || 0
				this.statsData.thisMonth = countsResult.completed || 0
			}
		} catch (err) {
			console.error('备用统计加载失败:', err)
			// 保持默认值 0
		}
	},
		
		resetFilters() {
			this.searchKeyword = ''
			this.startDate = ''
			this.endDate = ''
			this.selectedQuickFilter = 'month'
			this.statusFilter = 'all'
			this.tempStatus = 'all'
			this.page = 1
			this.recordList = []
			this.hasMore = true
			this.selectQuickFilter('month')
			this.generateList()
		},
		
		generateList() {
			this.page = 1
			this.recordList = []
			this.hasMore = true
			this.loadRecords()
			this.loadCounts()
		},
		
		confirmStatus() {
			this.statusFilter = this.tempStatus
			this.showStatusPicker = false
			this.generateList()
		},
		
		resetTempStatus() {
			this.tempStatus = 'all'
		},
		
		refreshList() {
			this.page = 1
			this.recordList = []
			this.hasMore = true
			this.updateCurrentTime()
			// 刷新时重新加载数据
			this.loadRecords()
			this.loadCounts()
			this.loadStats()
		},
		
		// 静默刷新（不显示 loading）
		silentRefresh() {
			this.loadRecords()
			this.loadCounts()
			this.loadStats()
		},
		
		loadMore() {
			if (!this.hasMore) return
			this.page++
			this.loadRecords()
		},
		
		getStatusText(status) {
			const statusMap = {
				draft: '草稿',
				pending_review: '待复核',
				completed: '已完成',
				rejected: '已驳回'
			}
			return statusMap[status] || status
		},
		
	canReview(item) {
		// 待复核的单据，且不是自己创建的，且当前用户有复核权限
		console.log('🔍 复核权限检查:', {
			itemStatus: item.status,
			operatorId: item.operatorId,
			currentUserId: this.currentUserId,
			isSameUser: item.operatorId === this.currentUserId
		})
		
		if (item.status !== 'pending_review' || item.operatorId === this.currentUserId) {
			console.log('❌ 不能复核: 状态不对或是自己创建的')
			return false
		}
		
		// 检查用户角色是否有复核权限（管理员或项目经理）
		const userInfo = uni.getStorageSync('userInfo')
		const userRole = userInfo?.role || ''
		const hasPermission = userRole === 'admin' || userRole === 'project_manager'
		
		console.log('✅ 复核权限结果:', {
			userRole,
			hasPermission
		})
		
		return hasPermission
	},
		
		goDetail(id, item) {
			// 如果是待复核状态且可以复核，跳转到复核页面
			if (item && item.status === 'pending_review' && this.canReview(item)) {
				this.goReview(id)
			} else {
			uni.navigateTo({
				url: `/pages-sub/in/detail?id=${id}`
			})
			}
		},
		
	goReview(id) {
		uni.navigateTo({
			url: `/pages-sub/in/review?id=${id}`
		})
	},
	
	goAdd() {
		uni.navigateTo({
			url: '/pages-sub/in/add'
		})
	},
	
	// ========== 搜索相关 ==========
	onKeywordUpdate(val) {
		this.searchKeyword = val
		if (this.searchTimer) clearTimeout(this.searchTimer)
		this.searchTimer = setTimeout(() => this.generateList(), 400)
	},
	onStartDateUpdate(val) {
		this.startDate = val
	},
	onEndDateUpdate(val) {
		this.endDate = val
	},
	onDateRangeChange({ start, end }) {
		this.startDate = start || ''
		this.endDate = end || ''
		this.generateList()
	},

	selectQuickFilter(value) {
		this.selectedQuickFilter = value
		const today = new Date()
		
		switch(value) {
			case 'all':
				this.startDate = ''
				this.endDate = ''
				break
			case 'today':
				this.startDate = this.formatDate(today)
				this.endDate = this.formatDate(today)
				break
			case 'week':
				const weekStart = new Date(today)
				weekStart.setDate(today.getDate() - today.getDay())
				this.startDate = this.formatDate(weekStart)
				this.endDate = this.formatDate(today)
				break
			case 'month':
				const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
				this.startDate = this.formatDate(monthStart)
				this.endDate = this.formatDate(today)
				break
			case 'custom':
				// 自定义由日期选择器回调控制
				break
		}
		if (value !== 'custom') {
			this.generateList()
		}
	},
	
	formatDate(date) {
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	},
	
	// 模拟数据
		getMockData() {
			const now = new Date()
			const mockList = [
				{
					_id: 'in_001',
					recordNo: 'RK20251028001',
					status: 'pending_review',
					operator: '张三',
					operatorId: 'user_001',
					createTime: '2025-10-28 09:30:00',
					supplier: 'XX医药公司',
					items: [
						{ drugName: '阿莫西林胶囊', spec: '0.25g*24粒', quantity: 100 },
						{ drugName: '布洛芬缓释胶囊', spec: '0.3g*20粒', quantity: 50 }
					]
				},
				{
					_id: 'in_002',
					recordNo: 'RK20251028002',
					status: 'completed',
					operator: '李四',
					operatorId: 'user_002',
					reviewer: '王五',
					reviewerId: 'user_003',
					createTime: '2025-10-27 14:20:00',
					completeTime: '2025-10-27 15:00:00',
					supplier: 'YY药业',
					items: [
						{ drugName: '感冒灵颗粒', spec: '10g*10袋', quantity: 200 }
					]
				},
				{
					_id: 'in_003',
					recordNo: 'RK20251027001',
					status: 'draft',
					operator: '张三',
					operatorId: 'user_001',
					createTime: '2025-10-27 10:00:00',
					supplier: '',
					items: [
						{ drugName: '维生素C片', spec: '0.1g*100片', quantity: 50 }
					]
				},
				{
					_id: 'in_004',
					recordNo: 'RK20251026001',
					status: 'rejected',
					operator: '李四',
					operatorId: 'user_002',
					reviewer: '张三',
					reviewerId: 'user_001',
					createTime: '2025-10-26 16:00:00',
					rejectReason: '批号填写不规范',
					supplier: 'ZZ医药',
					items: [
						{ drugName: '阿司匹林肠溶片', spec: '25mg*100片', quantity: 100 }
					]
				}
			]
			
			// 根据状态筛选
			if (this.statusFilter === 'all') {
				return mockList
			}
			return mockList.filter(item => item.status === this.statusFilter)
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background-color: #f5f7fb;
	padding-bottom: 60rpx;
}

.page-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 40rpx 30rpx 20rpx;
}

.page-title {
	display: block;
	font-size: 36rpx;
	font-weight: 700;
	color: #111827;
}

.page-subtitle {
	font-size: 24rpx;
	color: #94a3b8;
	margin-top: 6rpx;
}

.page-actions {
	display: flex;
	gap: 16rpx;
}

.header-btn {
	min-width: 150rpx;
	padding: 18rpx 30rpx;
	border-radius: 999rpx;
	font-size: 26rpx;
	font-weight: 600;
	text-align: center;
}

.header-btn.ghost {
	background: #ffffff;
	color: #475569;
	border: 1rpx solid #e2e8f0;
}

.header-btn.primary {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
	box-shadow: 0 6rpx 16rpx rgba(102, 126, 234, 0.3);
}

.panel-wrapper {
	margin: 0 30rpx 10rpx;
}

.filter-extra {
	margin-top: 12rpx;
	display: flex;
	gap: 12rpx;
}

.extra-item {
	flex: 1;
	background: #f8fafc;
	border-radius: 12rpx;
	padding: 16rpx 20rpx;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.extra-item.selectable {
	border: 1rpx solid #e2e8f0;
}

.extra-label {
	font-size: 24rpx;
	color: #94a3b8;
}

.extra-value {
	font-size: 28rpx;
	color: #1f2937;
}

.filter-action-bar {
	display: flex;
	gap: 16rpx;
	margin: 0 30rpx 16rpx;
}

.action-btn {
	flex: 1;
	height: 82rpx;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: 600;
}

.action-btn.ghost {
	background: #ffffff;
	color: #475569;
	border: 1rpx solid #e2e8f0;
}

.action-btn.primary {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
	box-shadow: 0 6rpx 16rpx rgba(102, 126, 234, 0.3);
}

.result-meta {
	margin: 0 30rpx 10rpx;
	padding: 16rpx 20rpx;
	background: #ffffff;
	border-radius: 16rpx;
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
	font-size: 26rpx;
	color: #475569;
}

.meta-item {
	color: #1f2937;
}

.meta-dot {
	color: #cbd5e1;
}

.list-container {
	padding: 20rpx;
}

.record-card {
	background-color: #FFFFFF;
	padding: 30rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.record-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1px solid #F0F0F0;
}

.record-no {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

.record-status {
	font-size: 24rpx;
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	color: #FFFFFF;
}

.status-draft {
	background-color: #999999;
}

.status-pending_review {
	background-color: #FF9800;
}

.status-completed {
	background-color: #4CAF50;
}

.status-rejected {
	background-color: #FF6B6B;
}

.record-info {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.info-item {
	display: flex;
	font-size: 26rpx;
}

.info-label {
	color: #999999;
	min-width: 140rpx;
}

.info-value {
	color: #333333;
	flex: 1;
}

.record-actions {
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1px solid #F0F0F0;
	display: flex;
	justify-content: flex-end;
}

.reject-reason {
	flex: 1;
	font-size: 24rpx;
	color: #FF6B6B;
	display: flex;
	align-items: center;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 0;
}

.empty-icon {
	font-size: 100rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999999;
}

.load-more, .no-more {
	text-align: center;
	padding: 30rpx 0;
	font-size: 26rpx;
	color: #999999;
}

.status-picker {
	background: #ffffff;
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
	padding: 32rpx 30rpx 40rpx;
	min-height: 520rpx;
}

.picker-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 24rpx;
}

.picker-header .picker-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #111827;
	display: block;
}

.picker-subtitle {
	font-size: 24rpx;
	color: #9CA3AF;
}

.picker-close {
	font-size: 28rpx;
	color: #cbd5e1;
	padding: 6rpx 12rpx;
}

.status-grid {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.status-chip {
	display: flex;
	align-items: center;
	padding: 18rpx 20rpx;
	border-radius: 18rpx;
	background: #f8fafc;
	border: 2rpx solid transparent;
}

.status-chip .chip-left {
	margin-right: 16rpx;
}

.chip-icon {
	font-size: 34rpx;
}

.chip-center {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.chip-label {
	font-size: 28rpx;
	color: #1f2937;
	font-weight: 600;
}

.chip-desc {
	font-size: 22rpx;
	color: #94a3b8;
	margin-top: 4rpx;
}

.chip-check {
	font-size: 30rpx;
	color: #5B77F9;
}

.status-chip.active {
	background: rgba(91, 119, 249, 0.08);
	border-color: #5B77F9;
}

.status-footer {
	margin-top: 28rpx;
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.footer-info {
	font-size: 26rpx;
	color: #4b5563;
}

.footer-actions {
	display: flex;
	gap: 16rpx;
}

.footer-actions .action {
	flex: 1;
	height: 80rpx;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: 600;
}

.footer-actions .action.ghost {
	background: #f8fafc;
	color: #475569;
	border: 1rpx solid #e2e8f0;
}

.footer-actions .action.primary {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
	box-shadow: 0 6rpx 16rpx rgba(102, 126, 234, 0.35);
}

</style>

