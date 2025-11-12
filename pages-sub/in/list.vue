<template>
	<view class="container">
		<!-- 统计面板 -->
		<view class="stats-panel">
			<view class="stats-header">
				<text class="stats-title">入库记录</text>
				<text class="stats-subtitle">{{ currentTime }}</text>
			</view>
			<view class="stats-grid">
				<view class="stat-card">
					<text class="stat-value">{{ statsData.today }}</text>
					<text class="stat-label">今日入库</text>
					<view class="stat-icon today">📦</view>
				</view>
				<view class="stat-card">
					<text class="stat-value">{{ statsData.thisWeek }}</text>
					<text class="stat-label">本周入库</text>
					<view class="stat-icon week">📊</view>
				</view>
				<view class="stat-card">
					<text class="stat-value">{{ statsData.thisMonth }}</text>
					<text class="stat-label">本月入库</text>
					<view class="stat-icon month">📈</view>
				</view>
				<view class="stat-card">
					<text class="stat-value">{{ statsData.pending }}</text>
					<text class="stat-label">待复核</text>
					<view class="stat-icon pending">⏳</view>
				</view>
			</view>
		</view>
		
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-wrapper">
				<view class="search-icon">🔍</view>
				<input 
					class="search-input" 
					v-model="searchKeyword"
					placeholder="搜索单号/药品名称"
					placeholder-class="placeholder"
					@input="onSearchInput"
					@confirm="onSearch"
				/>
				<view v-if="searchKeyword" class="clear-icon" @tap="clearSearch">✕</view>
			</view>
			<view class="date-filter" @tap="showDatePicker = true">
				<text class="date-text">{{ dateFilterText }}</text>
				<text class="date-icon">📅</text>
			</view>
		</view>
		
		<!-- 筛选标签 -->
		<view class="filter-tabs">
			<view 
				v-for="(tab, index) in tabs" 
				:key="index"
				:class="['tab-item', { active: currentTab === tab.value }]"
				@click="switchTab(tab.value)"
			>
				<text class="tab-text">{{ tab.label }}</text>
				<text v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</text>
			</view>
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
				<text class="empty-text">暂无{{ getTabName() }}单据</text>
			</view>
			
			<!-- 加载更多 -->
			<view v-if="hasMore" class="load-more" @click="loadMore">
				<text>加载更多</text>
			</view>
			<view v-else-if="recordList.length > 0" class="no-more">
				<text>没有更多了</text>
			</view>
		</view>
		
		<!-- 新建按钮 -->
		<view class="fab-button" @click="goAdd">
			<text class="fab-icon">+</text>
		</view>
		
		<!-- 日期选择器 -->
		<u-popup v-model="showDatePicker" mode="bottom">
			<view class="date-picker-popup">
				<view class="picker-header">
					<text class="picker-cancel" @tap="showDatePicker = false">取消</text>
					<text class="picker-title">选择日期范围</text>
					<text class="picker-confirm" @tap="confirmDateFilter">确定</text>
				</view>
				<view class="picker-body">
					<view class="quick-filters">
						<view 
							v-for="(item, index) in quickFilters" 
							:key="index"
							:class="['quick-filter-item', { active: selectedQuickFilter === item.value }]"
							@tap="selectQuickFilter(item.value)"
						>
							{{ item.label }}
						</view>
					</view>
					<view class="custom-date-range">
						<view class="date-range-item">
							<text class="date-label">开始日期</text>
							<picker mode="date" :value="startDate" @change="onStartDateChange">
								<view class="date-value">{{ startDate || '请选择' }}</view>
							</picker>
						</view>
						<view class="date-range-item">
							<text class="date-label">结束日期</text>
							<picker mode="date" :value="endDate" @change="onEndDateChange">
								<view class="date-value">{{ endDate || '请选择' }}</view>
							</picker>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { callFunction } from '@/utils/request.js'

export default {
	data() {
		return {
			currentTab: 'all',
			currentTime: '',
			tabs: [
				{ label: '全部', value: 'all', count: 0 },
				{ label: '草稿', value: 'draft', count: 0 },
				{ label: '待复核', value: 'pending_review', count: 0 },
				{ label: '已完成', value: 'completed', count: 0 },
				{ label: '已驳回', value: 'rejected', count: 0 }
			],
			recordList: [],
			page: 1,
			pageSize: 10,
			hasMore: true,
			currentUserId: '',
			statsData: {
				today: 0,
				thisWeek: 0,
				thisMonth: 0,
				pending: 0
			},
			// 搜索相关
			searchKeyword: '',
			searchTimer: null,
			// 日期筛选相关
			showDatePicker: false,
			startDate: '',
			endDate: '',
			selectedQuickFilter: '',
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
		
		this.loadRecords()
		this.loadCounts()
		this.loadStats()
	},
		
		updateCurrentTime() {
			const now = new Date()
			const year = now.getFullYear()
			const month = String(now.getMonth() + 1).padStart(2, '0')
			const day = String(now.getDate()).padStart(2, '0')
			this.currentTime = `${year}年${month}月${day}日`
		},
		
		switchTab(value) {
			if (this.currentTab === value) return
			
			this.currentTab = value
			this.page = 1
			this.recordList = []
			this.hasMore = true
			// 切换标签时加载数据（会判断是否首次加载）
			this.loadRecords()
		},
		
		getTabName() {
			const tab = this.tabs.find(t => t.value === this.currentTab)
			return tab ? tab.label : ''
		},
		
	async loadRecords() {
		// 首次加载显示 loading，刷新时不显示
		const isFirstLoad = this.page === 1 && this.recordList.length === 0
		
		try {
			// 使用 callFunction 的第三个参数控制是否显示 loading
			const result = await this.$api.callFunction('inRecords', {
				action: 'getList',
				data: {
					status: this.currentTab === 'all' ? 'all' : this.currentTab,
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
				// 更新各标签的数量
				this.tabs.forEach(tab => {
					if (tab.value === 'all') {
						tab.count = result.all || 0
					} else if (tab.value === 'draft') {
						tab.count = result.draft || 0
					} else if (tab.value === 'pending_review') {
						tab.count = result.pending_review || 0
					} else if (tab.value === 'completed') {
						tab.count = result.completed || 0
					} else if (tab.value === 'rejected') {
						tab.count = result.rejected || 0
					}
				})
			} else if (result) {
				// 兼容直接返回数据的情况
				this.tabs.forEach(tab => {
					if (tab.value === 'all') {
						tab.count = result.all || 0
					} else if (tab.value === 'draft') {
						tab.count = result.draft || 0
					} else if (tab.value === 'pending_review') {
						tab.count = result.pending_review || 0
					} else if (tab.value === 'completed') {
						tab.count = result.completed || 0
					} else if (tab.value === 'rejected') {
						tab.count = result.rejected || 0
					}
				})
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
	onSearchInput(e) {
		// 防抖搜索
		if (this.searchTimer) {
			clearTimeout(this.searchTimer)
		}
		this.searchTimer = setTimeout(() => {
			this.onSearch()
		}, 500)
	},
	
	onSearch() {
		this.page = 1
		this.recordList = []
		this.hasMore = true
		this.loadRecords()
	},
	
	clearSearch() {
		this.searchKeyword = ''
		this.onSearch()
	},
	
	// ========== 日期筛选相关 ==========
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
				// 保持当前日期不变，让用户自己选择
				break
		}
	},
	
	onStartDateChange(e) {
		this.startDate = e.detail.value
		this.selectedQuickFilter = 'custom'
	},
	
	onEndDateChange(e) {
		this.endDate = e.detail.value
		this.selectedQuickFilter = 'custom'
	},
	
	confirmDateFilter() {
		this.showDatePicker = false
		this.page = 1
		this.recordList = []
		this.hasMore = true
		this.loadRecords()
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
			
			// 根据当前标签筛选
			if (this.currentTab === 'all') {
				return mockList
			}
			return mockList.filter(item => item.status === this.currentTab)
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background-color: #F8F8F8;
	padding-bottom: 100rpx;
}

// 搜索栏
.search-bar {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 20rpx 30rpx;
	background: white;
	margin-bottom: 10rpx;
	
	.search-wrapper {
		flex: 1;
		display: flex;
		align-items: center;
		height: 70rpx;
		background: #f5f5f5;
		border-radius: 35rpx;
		padding: 0 30rpx;
		
		.search-icon {
			font-size: 32rpx;
			margin-right: 15rpx;
		}
		
		.search-input {
			flex: 1;
			font-size: 28rpx;
			color: #323233;
		}
		
		.placeholder {
			color: #999;
		}
		
		.clear-icon {
			width: 40rpx;
			height: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			color: #999;
			background: #e0e0e0;
			border-radius: 50%;
		}
	}
	
	.date-filter {
		display: flex;
		align-items: center;
		gap: 10rpx;
		padding: 0 25rpx;
		height: 70rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 35rpx;
		
		.date-text {
			font-size: 24rpx;
			color: white;
			white-space: nowrap;
		}
		
		.date-icon {
			font-size: 28rpx;
		}
	}
}

.stats-panel {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 30rpx;
	margin-bottom: 10rpx;
}

.stats-header {
	margin-bottom: 25rpx;
	text-align: center;
}

.stats-title {
	display: block;
	font-size: 34rpx;
	font-weight: bold;
	color: #ffffff;
	margin-bottom: 8rpx;
	text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.2);
}

.stats-subtitle {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.9);
}

.stats-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20rpx;
}

.stat-card {
	position: relative;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10rpx);
	border-radius: 20rpx;
	padding: 30rpx 25rpx;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	overflow: hidden;
	border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.stat-value {
	font-size: 48rpx;
	font-weight: bold;
	color: #ffffff;
	margin-bottom: 8rpx;
	text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.2);
	font-family: 'DIN Alternate', 'Arial', sans-serif;
}

.stat-label {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.9);
}

.stat-icon {
	position: absolute;
	right: 15rpx;
	top: 15rpx;
	font-size: 40rpx;
	opacity: 0.3;
}

.filter-tabs {
	display: flex;
	background-color: #FFFFFF;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	position: sticky;
	top: 0;
	z-index: 100;
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 15rpx 10rpx;
	position: relative;
}

.tab-item.active .tab-text {
	color: #667eea;
	font-weight: bold;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 40rpx;
	height: 4rpx;
	background-color: #667eea;
	border-radius: 2rpx;
}

.tab-text {
	font-size: 28rpx;
	color: #666666;
}

.tab-badge {
	position: absolute;
	top: 5rpx;
	right: 10rpx;
	background-color: #FF6B6B;
	color: #FFFFFF;
	font-size: 20rpx;
	padding: 2rpx 8rpx;
	border-radius: 10rpx;
	min-width: 30rpx;
	text-align: center;
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

.fab-button {
	position: fixed;
	right: 30rpx;
	bottom: 100rpx;
	width: 100rpx;
	height: 100rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.4);
	z-index: 1000;
}

.fab-icon {
	font-size: 60rpx;
	color: #FFFFFF;
	font-weight: 300;
}

// 日期选择器弹窗
.date-picker-popup {
	background: white;
	border-radius: 32rpx 32rpx 0 0;
	
	.picker-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 40rpx;
		border-bottom: 1rpx solid #ebedf0;
		
		.picker-cancel, .picker-confirm {
			font-size: 28rpx;
			color: #667eea;
		}
		
		.picker-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #323233;
		}
	}
	
	.picker-body {
		padding: 40rpx;
		
		.quick-filters {
			display: flex;
			flex-wrap: wrap;
			gap: 20rpx;
			margin-bottom: 40rpx;
			
			.quick-filter-item {
				padding: 15rpx 30rpx;
				background: #f5f5f5;
				border-radius: 40rpx;
				font-size: 26rpx;
				color: #646566;
				
				&.active {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: white;
				}
			}
		}
		
		.custom-date-range {
			.date-range-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 25rpx 0;
				border-bottom: 1rpx solid #ebedf0;
				
				&:last-child {
					border-bottom: none;
				}
				
				.date-label {
					font-size: 28rpx;
					color: #323233;
				}
				
				.date-value {
					font-size: 28rpx;
					color: #667eea;
				}
			}
		}
	}
}
</style>

