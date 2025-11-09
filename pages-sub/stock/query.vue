<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-section">
			<view class="search-wrapper">
				<view class="search-icon">🔍</view>
				<input 
					class="search-input" 
					v-model="searchKeyword"
					placeholder="搜索药品名称/规格/批号"
					placeholder-class="placeholder"
					@input="onSearchInput"
					@confirm="onSearch"
				/>
				<view v-if="searchKeyword" class="clear-icon" @tap="clearSearch">✕</view>
			</view>
			<view class="scan-btn" @tap="scanBarcode">
				<text class="scan-icon">📷</text>
			</view>
		</view>
		
		<!-- 筛选条件 -->
		<view class="filter-section">
			<view class="filter-item" @tap="showCategoryPicker = true">
				<text class="filter-label">分类</text>
				<text class="filter-value">{{ selectedCategory || '全部' }}</text>
				<text class="filter-arrow">›</text>
			</view>
			<view class="filter-item" @tap="showStockPicker = true">
				<text class="filter-label">库存</text>
				<text class="filter-value">{{ stockFilterText }}</text>
				<text class="filter-arrow">›</text>
			</view>
			<view class="filter-item" @tap="showExpiryPicker = true">
				<text class="filter-label">效期</text>
				<text class="filter-value">{{ expiryFilterText }}</text>
				<text class="filter-arrow">›</text>
			</view>
		</view>
		
		<!-- 统计信息 -->
		<view class="stats-bar">
			<view class="stat-item">
				<text class="stat-label">品种数</text>
				<text class="stat-value">{{ stats.totalDrugs }}</text>
			</view>
			<view class="stat-item">
				<text class="stat-label">总库存</text>
				<text class="stat-value">{{ stats.totalStock }}</text>
			</view>
			<view class="stat-item">
				<text class="stat-label">预警</text>
				<text class="stat-value warning">{{ stats.warningCount }}</text>
			</view>
			<view class="stat-item">
				<text class="stat-label">近效期</text>
				<text class="stat-value danger">{{ stats.expiringCount }}</text>
			</view>
		</view>
		
		<!-- 库存列表 -->
		<view class="stock-list">
			<view 
				v-for="item in stockList" 
				:key="item._id"
				class="stock-card"
				@click="goDetail(item._id)"
			>
				<view class="card-header">
					<view class="drug-name">{{ item.drugName }}</view>
					<view :class="['stock-badge', getStockStatus(item)]">
						{{ getStockStatusText(item) }}
					</view>
				</view>
				
				<view class="drug-spec">{{ item.specification }}</view>
				
				<view class="stock-info">
					<view class="info-row">
						<text class="info-label">库存：</text>
						<text class="info-value">{{ item.quantity }} {{ item.unit }}</text>
					</view>
					<view class="info-row" v-if="item.manufacturer">
						<text class="info-label">厂家：</text>
						<text class="info-value">{{ item.manufacturer }}</text>
					</view>
				</view>
				
				<!-- 批次信息 -->
				<view v-if="item.batches && item.batches.length > 0" class="batch-section">
					<view class="batch-title">批次信息（{{ item.batches.length }}个）</view>
					<view 
						v-for="(batch, index) in item.batches.slice(0, 2)" 
						:key="index"
						class="batch-item"
					>
						<view class="batch-row">
							<text class="batch-label">批号：</text>
							<text class="batch-value">{{ batch.batch }}</text>
						</view>
						<view class="batch-row">
							<text class="batch-label">数量：</text>
							<text class="batch-value">{{ batch.quantity }} {{ item.unit }}</text>
						</view>
						<view class="batch-row">
							<text class="batch-label">效期：</text>
							<text :class="['batch-value', getExpiryClass(batch.daysToExpiry)]">
								{{ batch.expireDate }} ({{ batch.daysToExpiry }}天)
							</text>
						</view>
					</view>
					<view v-if="item.batches.length > 2" class="batch-more">
						还有 {{ item.batches.length - 2 }} 个批次...
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view v-if="stockList.length === 0" class="empty-state">
				<text class="empty-icon">📦</text>
				<text class="empty-text">暂无库存数据</text>
				<text class="empty-hint">{{ searchKeyword ? '换个关键词试试' : '快去添加药品入库吧' }}</text>
			</view>
			
			<!-- 加载更多 -->
			<view v-if="hasMore" class="load-more" @click="loadMore">
				<text>加载更多</text>
			</view>
			<view v-else-if="stockList.length > 0" class="no-more">
				<text>没有更多了</text>
			</view>
		</view>
		
		<!-- 分类选择器 -->
		<u-popup v-model="showCategoryPicker" mode="bottom">
			<view class="picker-popup">
				<view class="picker-header">
					<text class="picker-cancel" @tap="showCategoryPicker = false">取消</text>
					<text class="picker-title">选择分类</text>
					<text class="picker-confirm" @tap="confirmCategory">确定</text>
				</view>
				<view class="picker-list">
					<view 
						v-for="(item, index) in categories" 
						:key="index"
						:class="['picker-item', { active: selectedCategory === item }]"
						@tap="selectedCategory = item"
					>
						{{ item }}
					</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 库存筛选器 -->
		<u-popup v-model="showStockPicker" mode="bottom">
			<view class="picker-popup">
				<view class="picker-header">
					<text class="picker-cancel" @tap="showStockPicker = false">取消</text>
					<text class="picker-title">库存筛选</text>
					<text class="picker-confirm" @tap="confirmStockFilter">确定</text>
				</view>
				<view class="picker-list">
					<view 
						v-for="(item, index) in stockFilters" 
						:key="index"
						:class="['picker-item', { active: selectedStockFilter === item.value }]"
						@tap="selectedStockFilter = item.value"
					>
						{{ item.label }}
					</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 效期筛选器 -->
		<u-popup v-model="showExpiryPicker" mode="bottom">
			<view class="picker-popup">
				<view class="picker-header">
					<text class="picker-cancel" @tap="showExpiryPicker = false">取消</text>
					<text class="picker-title">效期筛选</text>
					<text class="picker-confirm" @tap="confirmExpiryFilter">确定</text>
				</view>
				<view class="picker-list">
					<view 
						v-for="(item, index) in expiryFilters" 
						:key="index"
						:class="['picker-item', { active: selectedExpiryFilter === item.value }]"
						@tap="selectedExpiryFilter = item.value"
					>
						{{ item.label }}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchKeyword: '',
			searchTimer: null,
			stockList: [],
			page: 1,
			pageSize: 20,
			hasMore: true,
			
			// 统计数据
			stats: {
				totalDrugs: 0,
				totalStock: 0,
				warningCount: 0,
				expiringCount: 0
			},
			
			// 筛选条件
			selectedCategory: '',
			selectedStockFilter: 'all',
			selectedExpiryFilter: 'all',
			
			// 选择器显示状态
			showCategoryPicker: false,
			showStockPicker: false,
			showExpiryPicker: false,
			
			// 选项列表
			categories: ['全部', '西药', '中成药', '中药饮片', '医疗器械', '其他'],
			stockFilters: [
				{ label: '全部', value: 'all' },
				{ label: '有库存', value: 'inStock' },
				{ label: '库存充足', value: 'sufficient' },
				{ label: '库存预警', value: 'warning' },
				{ label: '库存不足', value: 'low' },
				{ label: '无库存', value: 'empty' }
			],
			expiryFilters: [
				{ label: '全部', value: 'all' },
				{ label: '正常', value: 'normal' },
				{ label: '6个月内到期', value: 'expiring6' },
				{ label: '3个月内到期', value: 'expiring3' },
				{ label: '1个月内到期', value: 'expiring1' },
				{ label: '已过期', value: 'expired' }
			]
		}
	},
	
	computed: {
		stockFilterText() {
			const filter = this.stockFilters.find(f => f.value === this.selectedStockFilter)
			return filter ? filter.label : '全部'
		},
		
		expiryFilterText() {
			const filter = this.expiryFilters.find(f => f.value === this.selectedExpiryFilter)
			return filter ? filter.label : '全部'
		}
	},
	
	onLoad() {
		this.loadStockList()
		this.loadStats()
	},
	
	methods: {
		// 搜索相关
		onSearchInput() {
			if (this.searchTimer) {
				clearTimeout(this.searchTimer)
			}
			this.searchTimer = setTimeout(() => {
				this.onSearch()
			}, 500)
		},
		
		onSearch() {
			this.page = 1
			this.stockList = []
			this.hasMore = true
			this.loadStockList()
		},
		
		clearSearch() {
			this.searchKeyword = ''
			this.onSearch()
		},
		
		scanBarcode() {
			uni.scanCode({
				success: (res) => {
					this.searchKeyword = res.result
					this.onSearch()
				}
			})
		},
		
		// 筛选相关
		confirmCategory() {
			this.showCategoryPicker = false
			this.onSearch()
		},
		
		confirmStockFilter() {
			this.showStockPicker = false
			this.onSearch()
		},
		
		confirmExpiryFilter() {
			this.showExpiryPicker = false
			this.onSearch()
		},
		
		// 加载库存列表
		async loadStockList() {
			try {
				const result = await this.$api.callFunction('stock', {
					action: 'query',
					data: {
						keyword: this.searchKeyword,
						category: this.selectedCategory === '全部' ? '' : this.selectedCategory,
						stockFilter: this.selectedStockFilter,
						expiryFilter: this.selectedExpiryFilter,
						page: this.page,
						pageSize: this.pageSize
					}
				})
				
				if (result && result.success) {
					const newData = result.data || []
					this.stockList = this.page === 1 ? newData : [...this.stockList, ...newData]
					this.hasMore = newData.length >= this.pageSize
				} else {
					// 使用模拟数据
					const mockData = this.getMockData()
					this.stockList = this.page === 1 ? mockData : [...this.stockList, ...mockData]
					this.hasMore = false
				}
			} catch (err) {
				console.error('加载失败:', err)
				// 使用模拟数据
				const mockData = this.getMockData()
				this.stockList = this.page === 1 ? mockData : [...this.stockList, ...mockData]
				this.hasMore = false
			}
		},
		
		// 加载统计数据
		async loadStats() {
			try {
				const result = await this.$api.callFunction('stock', {
					action: 'getStats',
					data: {}
				}, false)
				
				if (result && result.success) {
					this.stats = result.data
				} else {
					// 使用模拟数据
					this.stats = {
						totalDrugs: 156,
						totalStock: 12580,
						warningCount: 8,
						expiringCount: 5
					}
				}
			} catch (err) {
				console.error('加载统计失败:', err)
				this.stats = {
					totalDrugs: 156,
					totalStock: 12580,
					warningCount: 8,
					expiringCount: 5
				}
			}
		},
		
		loadMore() {
			if (!this.hasMore) return
			this.page++
			this.loadStockList()
		},
		
		// 获取库存状态
		getStockStatus(item) {
			if (item.quantity <= 0) return 'empty'
			if (item.quantity <= (item.minStock || 10)) return 'warning'
			return 'normal'
		},
		
		getStockStatusText(item) {
			const status = this.getStockStatus(item)
			const statusMap = {
				empty: '无库存',
				warning: '库存预警',
				normal: '正常'
			}
			return statusMap[status] || '正常'
		},
		
		// 获取效期样式
		getExpiryClass(days) {
			if (days < 0) return 'expired'
			if (days <= 30) return 'expiring-soon'
			if (days <= 90) return 'expiring'
			return 'normal'
		},
		
		goDetail(id) {
			uni.navigateTo({
				url: `/pages-sub/stock/detail?id=${id}`
			})
		},
		
		// 模拟数据
		getMockData() {
			return [
				{
					_id: 'stock_001',
					drugId: 'drug_001',
					drugName: '阿莫西林胶囊',
					specification: '0.25g×24粒/盒',
					unit: '盒',
					manufacturer: 'XX制药',
					quantity: 150,
					minStock: 50,
					batches: [
						{ batch: '20231001', quantity: 100, expireDate: '2025-10-01', daysToExpiry: 330 },
						{ batch: '20231015', quantity: 50, expireDate: '2025-10-15', daysToExpiry: 344 }
					]
				},
				{
					_id: 'stock_002',
					drugId: 'drug_002',
					drugName: '布洛芬缓释胶囊',
					specification: '0.3g×20粒/盒',
					unit: '盒',
					manufacturer: 'YY药业',
					quantity: 30,
					minStock: 50,
					batches: [
						{ batch: '20240201', quantity: 30, expireDate: '2025-02-01', daysToExpiry: 85 }
					]
				},
				{
					_id: 'stock_003',
					drugId: 'drug_003',
					drugName: '感冒灵颗粒',
					specification: '10g×10袋/盒',
					unit: '盒',
					manufacturer: 'ZZ医药',
					quantity: 200,
					minStock: 100,
					batches: [
						{ batch: '20240301', quantity: 120, expireDate: '2026-03-01', daysToExpiry: 480 },
						{ batch: '20240315', quantity: 80, expireDate: '2026-03-15', daysToExpiry: 494 }
					]
				}
			]
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background: #f8f8f8;
	padding-bottom: 100rpx;
}

// 搜索栏
.search-section {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 20rpx 30rpx;
	background: white;
	
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
	
	.scan-btn {
		width: 70rpx;
		height: 70rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 35rpx;
		
		.scan-icon {
			font-size: 32rpx;
		}
	}
}

// 筛选条件
.filter-section {
	display: flex;
	background: white;
	padding: 0 30rpx;
	margin-top: 10rpx;
	
	.filter-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 25rpx 0;
		border-right: 1rpx solid #ebedf0;
		
		&:last-child {
			border-right: none;
		}
		
		.filter-label {
			font-size: 26rpx;
			color: #646566;
			margin-right: 10rpx;
		}
		
		.filter-value {
			flex: 1;
			font-size: 26rpx;
			color: #323233;
			text-align: center;
		}
		
		.filter-arrow {
			font-size: 28rpx;
			color: #c8c9cc;
		}
	}
}

// 统计信息
.stats-bar {
	display: flex;
	background: white;
	padding: 25rpx 30rpx;
	margin-top: 10rpx;
	
	.stat-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
		
		.stat-label {
			font-size: 24rpx;
			color: #969799;
		}
		
		.stat-value {
			font-size: 32rpx;
			font-weight: bold;
			color: #323233;
			
			&.warning {
				color: #ff976a;
			}
			
			&.danger {
				color: #ee0a24;
			}
		}
	}
}

// 库存列表
.stock-list {
	padding: 20rpx 30rpx;
}

.stock-card {
	background: white;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	
	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 15rpx;
		
		.drug-name {
			font-size: 32rpx;
			font-weight: bold;
			color: #323233;
		}
		
		.stock-badge {
			padding: 8rpx 20rpx;
			border-radius: 20rpx;
			font-size: 22rpx;
			
			&.normal {
				background: #e8f5e9;
				color: #4caf50;
			}
			
			&.warning {
				background: #fff3e0;
				color: #ff9800;
			}
			
			&.empty {
				background: #ffebee;
				color: #f44336;
			}
		}
	}
	
	.drug-spec {
		font-size: 26rpx;
		color: #969799;
		margin-bottom: 20rpx;
	}
	
	.stock-info {
		.info-row {
			display: flex;
			align-items: center;
			margin-bottom: 10rpx;
			
			.info-label {
				font-size: 26rpx;
				color: #646566;
			}
			
			.info-value {
				font-size: 26rpx;
				color: #323233;
			}
		}
	}
	
	.batch-section {
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #ebedf0;
		
		.batch-title {
			font-size: 26rpx;
			color: #646566;
			margin-bottom: 15rpx;
		}
		
		.batch-item {
			background: #f7f8fa;
			border-radius: 12rpx;
			padding: 15rpx 20rpx;
			margin-bottom: 10rpx;
			
			.batch-row {
				display: flex;
				align-items: center;
				margin-bottom: 8rpx;
				
				&:last-child {
					margin-bottom: 0;
				}
				
				.batch-label {
					font-size: 24rpx;
					color: #969799;
					width: 100rpx;
				}
				
				.batch-value {
					flex: 1;
					font-size: 24rpx;
					color: #323233;
					
					&.normal {
						color: #323233;
					}
					
					&.expiring {
						color: #ff9800;
					}
					
					&.expiring-soon {
						color: #ff5722;
					}
					
					&.expired {
						color: #f44336;
					}
				}
			}
		}
		
		.batch-more {
			font-size: 24rpx;
			color: #667eea;
			text-align: center;
			padding: 10rpx 0;
		}
	}
}

// 空状态
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 120rpx 0;
	
	.empty-icon {
		font-size: 120rpx;
		margin-bottom: 30rpx;
	}
	
	.empty-text {
		font-size: 32rpx;
		color: #969799;
		margin-bottom: 15rpx;
	}
	
	.empty-hint {
		font-size: 26rpx;
		color: #c8c9cc;
	}
}

// 加载更多
.load-more, .no-more {
	text-align: center;
	padding: 30rpx 0;
	font-size: 26rpx;
	color: #999999;
}

// 选择器弹窗
.picker-popup {
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
	
	.picker-list {
		max-height: 600rpx;
		overflow-y: auto;
		
		.picker-item {
			padding: 30rpx 40rpx;
			font-size: 28rpx;
			color: #323233;
			border-bottom: 1rpx solid #f7f8fa;
			
			&.active {
				color: #667eea;
				background: #f7f8ff;
			}
		}
	}
}
</style>


