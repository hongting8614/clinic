<template>
	<view class="container">
		<!-- 页面头部：标题 + 报表入口 -->
		<view class="page-header">
			<view>
				<text class="page-title">出库管理</text>
			</view>
			<view class="page-actions">
				<view class="header-btn ghost" @click="goReport">出库报表</view>
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
		
		<!-- 园区筛选 -->
		<view class="location-filter">
			<view 
				v-for="loc in locationFilters" 
				:key="loc.value"
				:class="['location-item', { active: currentLocation === loc.value }]"
				@click="switchLocation(loc.value)"
			>
				<text>{{ loc.label }}</text>
			</view>
		</view>
		
		<!-- 列表 -->
		<view class="list-container">
			<view 
				v-for="item in recordList" 
				:key="item._id"
				class="record-card"
				@click="goDetail(item._id)"
			>
				<!-- 单号和状态 -->
				<view class="record-header">
					<view class="record-no">{{ item.recordNo }}</view>
					<view :class="['record-status', `status-${item.status}`]">
						{{ getStatusText(item.status) }}
					</view>
				</view>
				
				<!-- 园区标签 -->
				<view class="location-badge">
					<text>{{ item.locationName }}</text>
				</view>
				
				<!-- 基本信息 -->
				<view class="record-info">
					<view class="info-item">
						<text class="info-label">发放人：</text>
						<text class="info-value">{{ item.dispenser }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">创建时间：</text>
						<text class="info-value">{{ item.createTime }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">药品种类：</text>
						<text class="info-value">{{ item.items.length }} 种</text>
					</view>
					<view class="info-item" v-if="item.remark">
						<text class="info-label">备注：</text>
						<text class="info-value">{{ item.remark }}</text>
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
				
				<!-- 已驳回时显示操作按钮 -->
				<view v-if="item.status === 'rejected' && canEdit(item)" class="record-actions">
					<view class="reject-reason">驳回原因：{{ item.rejectReason }}</view>
					<u-button 
						text="重新编辑" 
						type="warning" 
						size="small"
						@click.stop="goEdit(item._id)"
					></u-button>
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
	</view>
</template>

<script>
import { callFunction } from '@/utils/request.js'

export default {
	data() {
		return {
			currentTab: 'all',
			tabs: [
				{ label: '全部', value: 'all', count: 0 },
				{ label: '草稿', value: 'draft', count: 0 },
				{ label: '待复核', value: 'pending_review', count: 0 },
				{ label: '已完成', value: 'completed', count: 0 },
				{ label: '已驳回', value: 'rejected', count: 0 }
			],
			currentLocation: 'all',
			locationFilters: [
				{ label: '全部园区', value: 'all' },
				{ label: '陆园', value: 'land_park' },
				{ label: '水园', value: 'water_park' }
			],
			recordList: [],
			page: 1,
			pageSize: 10,
			hasMore: true,
			currentUserId: ''
		}
	},
	
	onLoad() {
		this.initPage()
	},
	
	onShow() {
		this.refreshList()
	},
	
	onPullDownRefresh() {
		this.refreshList()
		setTimeout(() => {
			uni.stopPullDownRefresh()
		}, 1000)
	},
	
	methods: {
		initPage() {
			const userInfo = uni.getStorageSync('userInfo')
			this.currentUserId = userInfo?._id || ''
			
			this.loadRecords()
			this.loadCounts()
		},
		
		switchTab(value) {
			if (this.currentTab === value) return
			
			this.currentTab = value
			this.page = 1
			this.recordList = []
			this.hasMore = true
			this.loadRecords()
		},
		
		switchLocation(value) {
			if (this.currentLocation === value) return
			
			this.currentLocation = value
			this.page = 1
			this.recordList = []
			this.hasMore = true
			this.loadRecords()
		},
		
		getTabName() {
			const tab = this.tabs.find(t => t.value === this.currentTab)
			return tab ? tab.label : ''
		},
		
	async loadRecords() {
		uni.showLoading({ title: '加载中...' })
		
		try {
			const result = await this.$api.callFunction('outRecords', {
				action: 'getList',
				data: {
					status: this.currentTab === 'all' ? 'all' : this.currentTab,
					location: this.currentLocation === 'all' ? 'all' : this.currentLocation,
					page: this.page,
					pageSize: this.pageSize
				}
			})
			
			if (result.success) {
				const newData = result.data || []
				this.recordList = this.page === 1 ? newData : [...this.recordList, ...newData]
				this.hasMore = newData.length >= this.pageSize
			} else {
				throw new Error(result.message || '加载失败')
			}
			
			uni.hideLoading()
		} catch (err) {
			console.error('加载失败:', err)
			uni.hideLoading()
			uni.showToast({
				title: err.message || '加载失败',
				icon: 'none'
			})
		}
	},
	
	async loadCounts() {
		try {
			const result = await this.$api.callFunction('outRecords', {
				action: 'getCounts',
				data: {}
			})
			
			if (result.success) {
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
			}
		} catch (err) {
			console.error('加载数量失败:', err)
		}
	},
		
		refreshList() {
			this.page = 1
			this.recordList = []
			this.hasMore = true
			this.loadRecords()
			this.loadCounts()
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
			return item.status === 'pending_review' && item.dispenserId !== this.currentUserId
		},
		
		canEdit(item) {
			return (item.status === 'draft' || item.status === 'rejected') && 
			       item.dispenserId === this.currentUserId
		},
		
		goDetail(id) {
			uni.navigateTo({
				url: `/pages-sub/out/detail?id=${id}`
			})
		},
		
		goReview(id) {
			uni.navigateTo({
				url: `/pages-sub/out/detail?id=${id}&action=review`
			})
		},
		
		goEdit(id) {
			uni.navigateTo({
				url: `/pages-sub/out/add?id=${id}`
			})
		},
		
		goReport() {
			uni.navigateTo({
				url: '/pages-sub/report/outbound'
			})
		},
		
		goAdd() {
			uni.navigateTo({
				url: '/pages-sub/out/add'
			})
		},
		
		// 模拟数据
		getMockData() {
			const mockList = [
				{
					_id: 'out_001',
					recordNo: 'CK20251028001',
					status: 'pending_review',
					location: 'land_park',
					locationName: '陆园',
					dispenser: '张三',
					dispenserId: 'user_001',
					createTime: '2025-10-28 10:30:00',
					remark: '',
					items: [
						{ drugName: '阿莫西林胶囊', spec: '0.25g*24粒', quantity: 50 },
						{ drugName: '布洛芬缓释胶囊', spec: '0.3g*20粒', quantity: 30 }
					]
				},
				{
					_id: 'out_002',
					recordNo: 'CK20251028002',
					status: 'completed',
					location: 'water_park',
					locationName: '水园',
					dispenser: '李四',
					dispenserId: 'user_002',
					receiver: '王五',
					receiverId: 'user_003',
					createTime: '2025-10-27 15:20:00',
					completeTime: '2025-10-27 16:00:00',
					remark: '',
					items: [
						{ drugName: '感冒灵颗粒', spec: '10g*10袋', quantity: 100 }
					]
				},
				{
					_id: 'out_003',
					recordNo: 'CK20251027001',
					status: 'draft',
					location: 'land_park',
					locationName: '陆园',
					dispenser: '张三',
					dispenserId: 'user_001',
					createTime: '2025-10-27 11:00:00',
					remark: '紧急出库',
					items: [
						{ drugName: '速效救心丸', spec: '40mg*60粒', quantity: 10 }
					]
				},
				{
					_id: 'out_004',
					recordNo: 'CK20251026001',
					status: 'rejected',
					location: 'land_park',
					locationName: '陆园',
					dispenser: '李四',
					dispenserId: 'user_002',
					receiver: '张三',
					receiverId: 'user_001',
					createTime: '2025-10-26 17:00:00',
					rejectReason: '数量填写错误',
					remark: '',
					items: [
						{ drugName: '维生素C片', spec: '0.1g*100片', quantity: 50 }
					]
				}
			]
			
			// 根据筛选条件过滤
			let filtered = mockList
			
			if (this.currentTab !== 'all') {
				filtered = filtered.filter(item => item.status === this.currentTab)
			}
			
			if (this.currentLocation !== 'all') {
				filtered = filtered.filter(item => item.location === this.currentLocation)
			}
			
			return filtered
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

.page-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx 30rpx 10rpx;
}

.page-title {
	display: block;
	font-size: 36rpx;
	font-weight: 700;
	color: #111827;
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
	color: #FF6B6B;
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
	background-color: #FF6B6B;
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

.location-filter {
	display: flex;
	gap: 15rpx;
	padding: 20rpx;
	background-color: #FFFFFF;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.location-item {
	flex: 1;
	text-align: center;
	padding: 15rpx 0;
	background-color: #F8F8F8;
	border-radius: 10rpx;
	font-size: 26rpx;
	color: #666666;
}

.location-item.active {
	background-color: #FF6B6B;
	color: #FFFFFF;
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
	position: relative;
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

.location-badge {
	position: absolute;
	top: 25rpx;
	right: 25rpx;
	background-color: #E3F2FD;
	color: #2196F3;
	font-size: 22rpx;
	padding: 6rpx 15rpx;
	border-radius: 15rpx;
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
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 20rpx rgba(255, 107, 107, 0.4);
	z-index: 1000;
}

.fab-icon {
	font-size: 60rpx;
	color: #FFFFFF;
	font-weight: 300;
}
</style>

