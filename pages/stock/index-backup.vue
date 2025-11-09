<template>
	<view class="container">
		<!-- 库存总览 -->
		<view class="overview-section">
			<view class="overview-card">
				<view class="overview-item">
					<view class="overview-label">药品种类</view>
					<view class="overview-value">{{ overview.drugCount }}</view>
					<view class="overview-unit">种</view>
				</view>
				<view class="overview-item">
					<view class="overview-label">总库存量</view>
					<view class="overview-value">{{ overview.totalQuantity }}</view>
					<view class="overview-unit">盒</view>
				</view>
				<view class="overview-item">
					<view class="overview-label">库存金额</view>
					<view class="overview-value">{{ overview.totalAmount }}</view>
					<view class="overview-unit">元</view>
				</view>
			</view>
		</view>
		
		<!-- 预警卡片 -->
		<view class="alert-cards">
			<view class="alert-card alert-danger" @click="goToNearExpire">
				<view class="alert-card-icon">🔴</view>
				<view class="alert-card-content">
					<view class="alert-card-title">近效期药品</view>
					<view class="alert-card-count">{{ alerts.nearExpire }}种</view>
				</view>
				<view class="alert-card-arrow">→</view>
			</view>
			
			<view class="alert-card alert-warning" @click="goToLowStock">
				<view class="alert-card-icon">🟡</view>
				<view class="alert-card-content">
					<view class="alert-card-title">库存不足</view>
					<view class="alert-card-count">{{ alerts.lowStock }}种</view>
				</view>
				<view class="alert-card-arrow">→</view>
			</view>
			
			<view class="alert-card alert-info" @click="goToZeroStock">
				<view class="alert-card-icon">⚪</view>
				<view class="alert-card-content">
					<view class="alert-card-title">零库存</view>
					<view class="alert-card-count">{{ alerts.zeroStock }}种</view>
				</view>
				<view class="alert-card-arrow">→</view>
			</view>
		</view>
		
		<!-- 搜索栏 -->
		<view class="search-section">
			<view class="search-bar">
				<u-search 
					v-model="keyword" 
					placeholder="搜索药品名称或拼音"
					:show-action="false"
					@search="onSearch"
					@clear="onClear"
				></u-search>
			</view>
			<view class="filter-bar">
				<u-button 
					size="small" 
					:type="filterType === 'all' ? 'primary' : 'default'"
					@click="setFilter('all')"
				>全部</u-button>
				<u-button 
					size="small" 
					:type="filterType === 'land_park' ? 'primary' : 'default'"
					@click="setFilter('land_park')"
				>陆园</u-button>
				<u-button 
					size="small" 
					:type="filterType === 'water_park' ? 'primary' : 'default'"
					@click="setFilter('water_park')"
				>水园</u-button>
			</view>
		</view>
		
		<!-- 药品列表 -->
		<view class="drug-list">
			<view 
				v-for="item in drugList" 
				:key="item._id" 
				class="drug-item"
				@click="goToDetail(item)"
			>
				<view class="drug-header">
					<view class="drug-name">
						{{ item.drugName }}
						<text v-if="item.isHighValue" class="drug-tag tag-high">高值</text>
						<text v-if="item.isEmergency" class="drug-tag tag-emergency">急救</text>
					</view>
				<view class="drug-quantity" :class="[item.totalQuantity <= item.reorderLevel ? 'text-warning' : '', item.totalQuantity === 0 ? 'text-danger' : '']">
					{{ item.totalQuantity }}{{ item.unit }}
				</view>
				</view>
				
				<view class="drug-info">
					<text class="drug-spec">{{ item.spec }}</text>
					<text class="drug-manufacturer">{{ item.manufacturer }}</text>
				</view>
				
				<view class="drug-batches">
					<text class="batch-count">{{ item.batchCount }}个批次</text>
					<text v-if="item.nearExpireBatch" class="batch-warning">
						⚠️ 有近效期批次
					</text>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view v-if="drugList.length === 0" class="empty-state">
				<u-empty text="暂无库存数据" mode="data"></u-empty>
			</view>
		</view>
		
		<!-- 加载更多 -->
		<view v-if="hasMore" class="load-more">
			<u-button 
				text="加载更多" 
				type="info" 
				plain 
				size="small"
				@click="loadMore"
				:loading="loading"
			></u-button>
		</view>
	</view>
</template>

<script>
import Request from '@/utils/request.js'
import Common from '@/utils/common.js'

export default {
	data() {
		return {
			overview: {
				drugCount: 0,
				totalQuantity: 0,
				totalAmount: 0
			},
			alerts: {
				nearExpire: 0,
				lowStock: 0,
				zeroStock: 0
			},
			keyword: '',
			filterType: 'all', // all, land_park, water_park
			drugList: [],
			page: 1,
			pageSize: 20,
			hasMore: true,
			loading: false
		}
	},
	
	onLoad() {
		this.initPage()
	},
	
	onPullDownRefresh() {
		this.refreshData()
	},
	
	methods: {
		async initPage() {
			await this.loadOverview()
			await this.loadAlerts()
			await this.loadDrugList()
		},
		
		async refreshData() {
			this.page = 1
			this.drugList = []
			this.hasMore = true
			await this.initPage()
			uni.stopPullDownRefresh()
		},
		
		async loadOverview() {
			// TODO: 从云数据库加载库存总览
			// 这里先用模拟数据
			this.overview = {
				drugCount: 156,
				totalQuantity: 8500,
				totalAmount: 125000
			}
		},
		
		async loadAlerts() {
			// TODO: 从云数据库加载预警信息
			this.alerts = {
				nearExpire: 15,
				lowStock: 8,
				zeroStock: 3
			}
		},
		
		async loadDrugList() {
			if (this.loading) return
			
			this.loading = true
			
			try {
				// TODO: 从云数据库加载药品列表
				// 模拟数据
				const mockData = [
					{
						_id: 'stock_001',
						drugId: 'drug_001',
						drugName: '阿莫西林胶囊',
						spec: '0.25g*24粒',
						unit: '盒',
						manufacturer: 'XX制药有限公司',
						totalQuantity: 850,
						batchCount: 3,
						isHighValue: false,
						isEmergency: false,
						nearExpireBatch: true
					},
					{
						_id: 'stock_002',
						drugId: 'drug_002',
						drugName: '头孢克肟颗粒',
						spec: '0.5g*12袋',
						unit: '盒',
						manufacturer: 'YY制药',
						totalQuantity: 455,
						batchCount: 2,
						isHighValue: false,
						isEmergency: false,
						nearExpireBatch: false
					},
					{
						_id: 'stock_003',
						drugId: 'drug_003',
						drugName: '肾上腺素注射液',
						spec: '1ml:1mg',
						unit: '支',
						manufacturer: 'ZZ制药',
						totalQuantity: 20,
						batchCount: 1,
						isHighValue: true,
						isEmergency: true,
						nearExpireBatch: false
					}
				]
				
				if (this.page === 1) {
					this.drugList = mockData
				} else {
					this.drugList = [...this.drugList, ...mockData]
				}
				
				this.hasMore = mockData.length >= this.pageSize
				
			} catch (err) {
				console.error('加载药品列表失败:', err)
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		},
		
		loadMore() {
			if (!this.hasMore || this.loading) return
			this.page++
			this.loadDrugList()
		},
		
		onSearch() {
			this.page = 1
			this.drugList = []
			this.loadDrugList()
		},
		
		onClear() {
			this.keyword = ''
			this.onSearch()
		},
		
		setFilter(type) {
			this.filterType = type
			this.page = 1
			this.drugList = []
			this.loadDrugList()
		},
		
		getQuantityClass(item) {
			if (item.totalQuantity === 0) {
				return 'quantity-zero'
			} else if (item.totalQuantity <= 50) {
				return 'quantity-low'
			}
			return 'quantity-normal'
		},
		
		goToDetail(item) {
			uni.navigateTo({
				url: `/pages-sub/drug/detail?id=${item.drugId}`
			})
		},
		
		goToNearExpire() {
			// TODO: 跳转到近效期药品列表
			uni.showToast({
				title: '近效期药品列表',
				icon: 'none'
			})
		},
		
		goToLowStock() {
			// TODO: 跳转到库存不足列表
			uni.showToast({
				title: '库存不足列表',
				icon: 'none'
			})
		},
		
		goToZeroStock() {
			// TODO: 跳转到零库存列表
			uni.showToast({
				title: '零库存列表',
				icon: 'none'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
	background-color: #F8F8F8;
	min-height: 100vh;
}

.overview-section {
	margin-bottom: 20rpx;
}

.overview-card {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	display: flex;
	justify-content: space-around;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.overview-item {
	text-align: center;
}

.overview-label {
	font-size: 24rpx;
	color: #999999;
	margin-bottom: 10rpx;
}

.overview-value {
	font-size: 44rpx;
	font-weight: bold;
	color: #3cc51f;
	margin-bottom: 5rpx;
}

.overview-unit {
	font-size: 22rpx;
	color: #999999;
}

.alert-cards {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
	margin-bottom: 20rpx;
}

.alert-card {
	background-color: #FFFFFF;
	border-radius: 15rpx;
	padding: 25rpx 30rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.alert-card-icon {
	font-size: 40rpx;
	margin-right: 20rpx;
}

.alert-card-content {
	flex: 1;
}

.alert-card-title {
	font-size: 28rpx;
	color: #333333;
	margin-bottom: 5rpx;
}

.alert-card-count {
	font-size: 32rpx;
	font-weight: bold;
	color: #3cc51f;
}

.alert-card-arrow {
	font-size: 32rpx;
	color: #CCCCCC;
}

.search-section {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.search-bar {
	margin-bottom: 15rpx;
}

.filter-bar {
	display: flex;
	gap: 15rpx;
}

.drug-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.drug-item {
	background-color: #FFFFFF;
	border-radius: 15rpx;
	padding: 25rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.drug-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
}

.drug-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	display: flex;
	align-items: center;
	gap: 10rpx;
}

.drug-tag {
	font-size: 20rpx;
	padding: 4rpx 10rpx;
	border-radius: 8rpx;
	font-weight: normal;
}

.tag-high {
	background-color: #FFF3E0;
	color: #FF9800;
}

.tag-emergency {
	background-color: #FFEBEE;
	color: #F44336;
}

.drug-quantity {
	font-size: 36rpx;
	font-weight: bold;
}

.quantity-normal {
	color: #3cc51f;
}

.quantity-low {
	color: #FF9800;
}

.quantity-zero {
	color: #F44336;
}

.drug-info {
	display: flex;
	gap: 20rpx;
	margin-bottom: 10rpx;
}

.drug-spec {
	font-size: 26rpx;
	color: #666666;
}

.drug-manufacturer {
	font-size: 26rpx;
	color: #999999;
}

.drug-batches {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.batch-count {
	font-size: 24rpx;
	color: #999999;
}

.batch-warning {
	font-size: 24rpx;
	color: #FF9800;
}

.empty-state {
	padding: 100rpx 0;
}

.load-more {
	padding: 30rpx 0;
	text-align: center;
}
</style>


