<template>
	<view class="page" @touchstart="onTabTouchStart" @touchend="onTabTouchEnd">
		<!-- 顶部专业搜索栏 -->
		<view class="search-header">
			<view class="search-wrapper">
				<text class="search-icon-left">🔍</text>
				<input 
					class="search-input" 
					placeholder="搜索药品名称、规格、拼音..." 
					v-model="searchKeyword"
					@input="onSearchInput"
					placeholder-class="search-placeholder"
				/>
				<text v-if="searchKeyword" class="search-clear" @tap="clearSearch">✕</text>
			</view>
		</view>
		
		<!-- 数据统计仪表板 -->
		<view class="dashboard">
			<view class="dashboard-card primary">
				<view class="dashboard-icon">📊</view>
				<view class="dashboard-content">
					<text class="dashboard-value">{{ stockStats.totalDrugs }}</text>
					<text class="dashboard-label">药品种类</text>
				</view>
				<view class="dashboard-badge">总计</view>
			</view>
			
			<view class="dashboard-card warning">
				<view class="dashboard-icon">⚠️</view>
				<view class="dashboard-content">
					<text class="dashboard-value">{{ stockStats.lowStockCount }}</text>
					<text class="dashboard-label">库存预警</text>
				</view>
				<view class="dashboard-badge">预警</view>
			</view>
			
			<view class="dashboard-card danger">
				<view class="dashboard-icon">🚨</view>
				<view class="dashboard-content">
					<text class="dashboard-value">{{ stockStats.expiredCount }}</text>
					<text class="dashboard-label">缺货药品</text>
				</view>
				<view class="dashboard-badge">缺货</view>
			</view>
		</view>
		
		<!-- 药品列表 - 专业展示 -->
		<view class="drug-section">
			<view class="section-header">
				<text class="section-title">库存清单</text>
				<text class="section-count">共 {{ filteredDrugList.length }} 种</text>
		</view>
		
		<view class="drug-list">
			<view 
					class="drug-card" 
					v-for="(item, index) in filteredDrugList" 
					:key="index"
					@tap="goToDetail(item)"
				>
					<!-- 药品信息 -->
				<view class="drug-header">
						<view class="drug-main-info">
							<text class="drug-name">{{ item.name }}</text>
							<view class="drug-meta">
								<text class="drug-spec">{{ item.spec }}</text>
								<text class="drug-divider">|</text>
								<text class="drug-manufacturer">{{ item.manufacturer || '未知' }}</text>
							</view>
					</view>
					<view class="drug-status-badge" :class="item.totalQuantity === 0 ? 'status-danger' : (item.totalQuantity <= item.reorderLevel ? 'status-warning' : 'status-success')">
						<text class="status-text">{{ getStatusText(item) }}</text>
					</view>
				</view>
				
					<!-- 库存信息 -->
					<view class="drug-stock-info">
						<view class="stock-item">
							<text class="stock-label">当前库存</text>
							<view class="stock-value-wrapper">
							<text class="stock-value" :class="item.totalQuantity === 0 ? 'color-danger' : (item.totalQuantity <= item.reorderLevel ? 'color-warning' : 'color-success')">
								{{ item.totalQuantity }}
							</text>
								<text class="stock-unit">{{ item.unit }}</text>
							</view>
				</view>
				
						<view class="stock-divider"></view>
						
						<view class="stock-item">
							<text class="stock-label">安全库存</text>
							<view class="stock-value-wrapper">
								<text class="stock-value-small">{{ item.reorderLevel || 100 }}</text>
								<text class="stock-unit">{{ item.unit }}</text>
							</view>
				</view>
			</view>
			
					<!-- 进度条 -->
					<view class="progress-bar">
					<view 
						class="progress-fill" 
						:class="item.totalQuantity === 0 ? 'progress-danger' : (item.totalQuantity <= item.reorderLevel ? 'progress-warning' : 'progress-success')"
						:style="{ width: (Math.min((item.totalQuantity / (item.reorderLevel || 100)) * 100, 100)) + '%' }"
					></view>
					</view>
					
					<!-- 操作指示 -->
					<view class="drug-action-hint">
						<text class="hint-text">点击查看详情</text>
						<text class="hint-arrow">→</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 空状态 - 专业设计 -->
		<view v-if="!loading && filteredDrugList.length === 0" class="empty-state">
			<view class="empty-icon-wrapper">
				<text class="empty-icon">📦</text>
			</view>
			<text class="empty-title">{{ searchKeyword ? '未找到相关药品' : '暂无药品数据' }}</text>
			<text class="empty-desc">{{ searchKeyword ? '试试其他关键词' : '请先添加药品档案' }}</text>
		</view>

		<!-- 加载状态 -->
		<view v-if="loading" class="loading-overlay">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载中...</text>
		</view>
	</view>
</template>

<script>
import { callFunction } from '@/utils/api.js'
import { createTabSwipeMixin } from '@/utils/tabSwipe.js'

export default {
	mixins: [createTabSwipeMixin(1)],
	data() {
		return {
			drugList: [],
			stockStats: {
				totalDrugs: 0,
				lowStockCount: 0,
				expiredCount: 0
			},
			searchKeyword: '',
			loading: false
		}
	},
	computed: {
		filteredDrugList() {
			if (!this.searchKeyword) {
				return this.drugList
			}
			const keyword = this.searchKeyword.toLowerCase()
			return this.drugList.filter(item => 
				item.name.toLowerCase().includes(keyword) ||
				item.spec.toLowerCase().includes(keyword) ||
				(item.pinyin && item.pinyin.toLowerCase().includes(keyword))
			)
		}
	},
	onLoad() {
		console.log('===== 库存页 onLoad =====')
		this.loadStockData()
	},
	onShow() {
		console.log('===== 库存页 onShow =====')
		this.loadStockData()
	},
	methods: {
	async loadStockData() {
		this.loading = true
		try {
			const result = await callFunction('stockManage', {
				action: 'getList',
				data: {
					page: 1,
					pageSize: 100
				}
			})
			
			if (result.success) {
				this.drugList = result.data || []
			} else {
				this.drugList = []
			}
			
			this.calculateStats()
			
			console.log('库存数据加载成功:', this.drugList.length)
		} catch (err) {
			console.error('加载库存数据失败:', err)
			this.drugList = []
		} finally {
			this.loading = false
		}
	},
		
		calculateStats() {
			this.stockStats = {
				totalDrugs: this.drugList.length,
				lowStockCount: this.drugList.filter(item => 
					item.totalQuantity > 0 && item.totalQuantity <= item.reorderLevel
				).length,
				expiredCount: this.drugList.filter(item => 
					item.totalQuantity === 0
				).length
			}
		},
		
		onSearchInput() {
			// 实时搜索
		},
		
		clearSearch() {
			this.searchKeyword = ''
		},
		
		getStatusText(item) {
			if (item.totalQuantity === 0) return '缺货'
			if (item.totalQuantity <= item.reorderLevel) return '库存不足'
			return '充足'
		},
		
		goToDetail(item) {
			uni.showToast({
				title: '详情页开发中',
				icon: 'none'
			})
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
	padding-bottom: 30rpx;
}

/* 专业搜索栏 */
.search-header {
	background: #ffffff;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04);
}

.search-wrapper {
	position: relative;
	background: #f8fafc;
	border-radius: 50rpx;
	padding: 20rpx 50rpx 20rpx 60rpx;
	border: 2rpx solid #e2e8f0;
	transition: all 0.3s;
}

.search-wrapper:focus-within {
	background: #ffffff;
	border-color: #667eea;
	box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
}

.search-icon-left {
	position: absolute;
	left: 25rpx;
	top: 50%;
	transform: translateY(-50%);
	font-size: 28rpx;
	color: #94a3b8;
}

.search-input {
	font-size: 28rpx;
	color: #2c3e50;
}

.search-placeholder {
	color: #cbd5e1;
}

.search-clear {
	position: absolute;
	right: 25rpx;
	top: 50%;
	transform: translateY(-50%);
	width: 36rpx;
	height: 36rpx;
	background: #cbd5e1;
	border-radius: 50%;
	color: #ffffff;
	font-size: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	line-height: 1;
}

/* 数据仪表板 */
.dashboard {
	display: flex;
	gap: 15rpx;
	padding: 30rpx;
	padding-top: 20rpx;
}

.dashboard-card {
	flex: 1;
	background: #ffffff;
	border-radius: 16rpx;
	padding: 25rpx 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
	position: relative;
	overflow: hidden;
}

.dashboard-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 4rpx;
}

.dashboard-card.primary::before { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); }
.dashboard-card.warning::before { background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); }
.dashboard-card.danger::before { background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%); }

.dashboard-icon {
	font-size: 36rpx;
	margin-bottom: 15rpx;
	filter: drop-shadow(0 2rpx 4rpx rgba(0,0,0,0.1));
}

.dashboard-content {
	margin-bottom: 10rpx;
}

.dashboard-value {
	display: block;
	font-size: 40rpx;
	font-weight: bold;
	color: #2c3e50;
	line-height: 1;
	margin-bottom: 8rpx;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
}

.dashboard-label {
	display: block;
	font-size: 22rpx;
	color: #7f8c8d;
}

.dashboard-badge {
	position: absolute;
	top: 15rpx;
	right: 15rpx;
	font-size: 18rpx;
	color: #cbd5e1;
	font-weight: 500;
}

/* 药品列表区域 */
.drug-section {
	padding: 0 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #2c3e50;
}

.section-count {
	font-size: 24rpx;
	color: #94a3b8;
}

.drug-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

/* 药品卡片 - 专业设计 */
.drug-card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
	border: 1rpx solid #f1f5f9;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	overflow: hidden;
}

.drug-card::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 6rpx;
	transition: all 0.3s;
}

.drug-card:active {
	transform: translateY(-4rpx);
	box-shadow: 0 12rpx 32rpx rgba(0,0,0,0.12);
}

.drug-card:active::before {
	width: 10rpx;
}

/* 药品头部 */
.drug-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 25rpx;
}

.drug-main-info {
	flex: 1;
	margin-right: 20rpx;
}

.drug-name {
	display: block;
	font-size: 32rpx;
	font-weight: bold;
	color: #1e293b;
	margin-bottom: 10rpx;
	line-height: 1.4;
}

.drug-meta {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.drug-spec {
	font-size: 24rpx;
	color: #64748b;
}

.drug-divider {
	color: #cbd5e1;
	font-size: 20rpx;
}

.drug-manufacturer {
	font-size: 22rpx;
	color: #94a3b8;
}

/* 状态徽章 */
.drug-status-badge {
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	font-weight: 600;
	white-space: nowrap;
}

.status-success {
	background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
	color: #065f46;
}

.status-warning {
	background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
	color: #92400e;
}

.status-danger {
	background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
	color: #991b1b;
}

/* 库存信息栏 */
.drug-stock-info {
	display: flex;
	align-items: center;
	background: #f8fafc;
	border-radius: 12rpx;
	padding: 20rpx 25rpx;
	margin-bottom: 20rpx;
}

.stock-item {
	flex: 1;
	text-align: center;
}

.stock-label {
	display: block;
	font-size: 22rpx;
	color: #64748b;
	margin-bottom: 8rpx;
}

.stock-value-wrapper {
	display: flex;
	align-items: baseline;
	justify-content: center;
	gap: 6rpx;
}

.stock-value {
	font-size: 42rpx;
	font-weight: bold;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
	line-height: 1;
}

.stock-value.color-success { color: #10b981; }
.stock-value.color-warning { color: #f59e0b; }
.stock-value.color-danger { color: #ef4444; }

.stock-value-small {
	font-size: 32rpx;
	font-weight: 600;
	color: #64748b;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
}

.stock-unit {
	font-size: 20rpx;
	color: #94a3b8;
}

.stock-divider {
	width: 1rpx;
	height: 40rpx;
	background: #e2e8f0;
}

/* 进度条 */
.progress-bar {
	height: 8rpx;
	background: #e2e8f0;
	border-radius: 10rpx;
	overflow: hidden;
	margin-bottom: 20rpx;
}

.progress-fill {
	height: 100%;
	border-radius: 10rpx;
	transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-success { background: linear-gradient(90deg, #10b981 0%, #059669 100%); }
.progress-warning { background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); }
.progress-danger { background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%); }

/* 操作提示 */
.drug-action-hint {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.hint-text {
	font-size: 22rpx;
	color: #94a3b8;
}

.hint-arrow {
	font-size: 24rpx;
	color: #cbd5e1;
	font-weight: bold;
}

/* 空状态 - 优雅设计 */
.empty-state {
	padding: 150rpx 60rpx;
	text-align: center;
}

.empty-icon-wrapper {
	width: 160rpx;
	height: 160rpx;
	margin: 0 auto 30rpx;
	background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.empty-icon {
	font-size: 80rpx;
	opacity: 0.5;
}

.empty-title {
	display: block;
	font-size: 32rpx;
	font-weight: bold;
	color: #475569;
	margin-bottom: 12rpx;
}

.empty-desc {
	display: block;
	font-size: 26rpx;
	color: #94a3b8;
}

/* 加载状态 */
.loading-overlay {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
}

.loading-spinner {
	width: 60rpx;
	height: 60rpx;
	border: 4rpx solid #e2e8f0;
	border-top-color: #667eea;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to { transform: rotate(360deg); }
}

.loading-text {
	font-size: 26rpx;
	color: #64748b;
}
</style>

