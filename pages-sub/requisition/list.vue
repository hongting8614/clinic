<template>
	<view class="container">
		<!-- 头部 -->
		<view class="page-header">
			<view class="header-content">
				<text class="page-title">请领管理</text>
				<text class="page-subtitle">Requisition Management</text>
			</view>
			<view class="header-action">
				<view class="add-btn" @tap="goToAdd">
					<text class="add-icon">+</text>
					<text class="add-text">新建请领</text>
				</view>
			</view>
		</view>
		
		<!-- 筛选标签 -->
		<view class="filter-tabs">
			<view 
				v-for="(tab, index) in tabs" 
				:key="index"
				class="tab-item"
				:class="{'active': currentTab === index}"
				@tap="switchTab(index)"
			>
				<text class="tab-text">{{ tab.label }}</text>
				<text v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</text>
			</view>
		</view>
		
		<!-- 列表 -->
		<scroll-view 
			class="record-list" 
			scroll-y
			@scrolltolower="loadMore"
		>
			<view 
				v-for="record in recordList" 
				:key="record._id"
				class="record-card"
				@tap="goToDetail(record)"
			>
				<!-- 状态标签 -->
				<view class="status-badge" :class="'status-' + record.status">
					<text>{{ getStatusText(record.status) }}</text>
				</view>
				
				<!-- 请领单号 -->
				<view class="record-header">
					<text class="record-no">{{ record.recordNo }}</text>
					<text class="record-time">{{ formatTime(record.createTime) }}</text>
				</view>
				
				<!-- 基本信息 -->
				<view class="record-info">
					<view class="info-row">
						<text class="info-label">请领部门：</text>
						<text class="info-value">{{ record.department }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">请领人：</text>
						<text class="info-value">{{ record.requisitioner }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">药材种类：</text>
						<text class="info-value">{{ record.drugList.length }}种</text>
					</view>
					<view class="info-row">
						<text class="info-label">用途：</text>
						<text class="info-value ellipsis">{{ record.purpose }}</text>
					</view>
				</view>
				
				<!-- 审批信息 -->
				<view v-if="record.reviewer" class="review-info">
					<text class="review-label">审批人：{{ record.reviewer }}</text>
					<text class="review-time">{{ formatTime(record.reviewTime) }}</text>
				</view>
			</view>
			
			<!-- 加载状态 -->
			<view v-if="loading" class="loading-hint">
				<text>加载中...</text>
			</view>
			
			<!-- 空状态 -->
			<view v-if="!loading && recordList.length === 0" class="empty-hint">
				<text class="empty-icon">📋</text>
				<text class="empty-text">暂无请领记录</text>
				<view class="empty-btn" @tap="goToAdd">
					<text>+ 新建请领单</text>
				</view>
			</view>
			
			<!-- 没有更多 -->
			<view v-if="!hasMore && recordList.length > 0" class="no-more-hint">
				<text>没有更多了</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import Common from '@/utils/common.js'

export default {
	data() {
		return {
			currentTab: 0,
			tabs: [
				{ label: '全部', status: '', count: 0 },
				{ label: '待审批', status: 'pending_review', count: 0 },
				{ label: '已通过', status: 'approved', count: 0 },
				{ label: '已驳回', status: 'rejected', count: 0 },
				{ label: '草稿', status: 'draft', count: 0 }
			],
			recordList: [],
			loading: false,
			pageNum: 1,
			pageSize: 20,
			hasMore: true
		}
	},
	
	onLoad() {
		this.loadRecords()
		this.loadCounts()
	},
	
	onShow() {
		// 从添加页面返回时刷新列表
		this.refreshList()
	},
	
	methods: {
		switchTab(index) {
			this.currentTab = index
			this.refreshList()
		},
		
		refreshList() {
			this.recordList = []
			this.pageNum = 1
			this.hasMore = true
			this.loadRecords()
			this.loadCounts()
		},
		
		async loadRecords() {
			if (this.loading || !this.hasMore) return
			
			this.loading = true
			
			try {
				const currentStatus = this.tabs[this.currentTab].status
				
				const result = await this.$api.callFunction('requisitionRecords', {
					action: 'getList',
					data: {
						pageSize: this.pageSize,
						pageNum: this.pageNum,
						status: currentStatus
					}
				})
				
				if (result.success) {
					const newList = result.data.list
					
					if (newList.length > 0) {
						this.recordList = [...this.recordList, ...newList]
						this.pageNum++
					}
					
					if (newList.length < this.pageSize) {
						this.hasMore = false
					}
				} else {
					throw new Error(result.message || '加载失败')
				}
			} catch (err) {
				console.error('加载请领单失败:', err)
				uni.showToast({
					title: err.message || '加载失败',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		},
		
		async loadCounts() {
			try {
				const result = await this.$api.callFunction('requisitionRecords', {
					action: 'getCounts',
					data: {}
				})
				
				if (result.success) {
					// 更新各状态的数量
					this.tabs[1].count = result.data.pending || 0  // 待审批
				}
			} catch (err) {
				console.error('加载统计失败:', err)
			}
		},
		
		loadMore() {
			this.loadRecords()
		},
		
		goToAdd() {
			uni.navigateTo({
				url: '/pages-sub/requisition/add'
			})
		},
		
		goToDetail(record) {
			uni.navigateTo({
				url: `/pages-sub/requisition/detail?id=${record._id}`
			})
		},
		
		getStatusText(status) {
			const statusMap = {
				'draft': '草稿',
				'pending_review': '待审批',
				'approved': '已通过',
				'rejected': '已驳回'
			}
			return statusMap[status] || '未知'
		},
		
		formatTime(time) {
			if (!time) return ''
			return Common.formatDate(new Date(time), 'MM-DD HH:mm')
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background-color: #F5F7FA;
	padding-bottom: 30rpx;
}

.page-header {
	background: linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%);
	padding: 40rpx 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.header-content {
	flex: 1;
}

.page-title {
	display: block;
	font-size: 42rpx;
	font-weight: bold;
	color: #FFFFFF;
	margin-bottom: 8rpx;
}

.page-subtitle {
	display: block;
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	letter-spacing: 2rpx;
}

.header-action {
	flex-shrink: 0;
}

.add-btn {
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(10rpx);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 50rpx;
	padding: 15rpx 30rpx;
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.add-icon {
	font-size: 32rpx;
	color: #FFFFFF;
	font-weight: bold;
}

.add-text {
	font-size: 28rpx;
	color: #FFFFFF;
	font-weight: 600;
}

.filter-tabs {
	display: flex;
	background-color: #FFFFFF;
	padding: 20rpx 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	overflow-x: auto;
	white-space: nowrap;
}

.tab-item {
	position: relative;
	flex-shrink: 0;
	padding: 15rpx 25rpx;
	margin-right: 20rpx;
	border-radius: 50rpx;
	background-color: #F5F5F5;
	display: flex;
	align-items: center;
	gap: 8rpx;
	transition: all 0.3s;
}

.tab-item.active {
	background: linear-gradient(135deg, #9C27B0, #BA68C8);
}

.tab-text {
	font-size: 28rpx;
	color: #666666;
}

.tab-item.active .tab-text {
	color: #FFFFFF;
	font-weight: bold;
}

.tab-badge {
	min-width: 36rpx;
	height: 36rpx;
	line-height: 36rpx;
	text-align: center;
	padding: 0 8rpx;
	background-color: #FF5722;
	color: #FFFFFF;
	font-size: 22rpx;
	border-radius: 18rpx;
}

.tab-item.active .tab-badge {
	background-color: rgba(255, 255, 255, 0.3);
}

.record-list {
	padding: 20rpx 30rpx;
}

.record-card {
	position: relative;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.status-badge {
	position: absolute;
	top: -8rpx;
	right: 30rpx;
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	color: #FFFFFF;
}

.status-badge.status-draft {
	background-color: #9E9E9E;
}

.status-badge.status-pending_review {
	background-color: #FF9800;
}

.status-badge.status-approved {
	background-color: #4CAF50;
}

.status-badge.status-rejected {
	background-color: #F44336;
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
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.record-time {
	font-size: 24rpx;
	color: #999999;
}

.record-info {
	margin-bottom: 15rpx;
}

.info-row {
	display: flex;
	font-size: 26rpx;
	line-height: 45rpx;
}

.info-label {
	color: #999999;
	min-width: 160rpx;
}

.info-value {
	color: #666666;
	flex: 1;
}

.info-value.ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.review-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 15rpx;
	border-top: 1px dashed #E0E0E0;
	font-size: 24rpx;
	color: #999999;
}

.loading-hint,
.no-more-hint {
	text-align: center;
	padding: 30rpx;
	color: #999999;
	font-size: 26rpx;
}

.empty-hint {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 150rpx 0;
}

.empty-icon {
	font-size: 120rpx;
	margin-bottom: 30rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999999;
	margin-bottom: 40rpx;
}

.empty-btn {
	padding: 20rpx 50rpx;
	background: linear-gradient(135deg, #9C27B0, #BA68C8);
	color: #FFFFFF;
	border-radius: 50rpx;
	font-size: 28rpx;
	font-weight: 600;
}
</style>
