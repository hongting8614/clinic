<template>
	<view class="container">
		<view class="content-column">
			<view v-if="!isExpiryMode" class="search-section">
			<view class="search-wrapper">
				<text class="search-icon">🔍</text>
				<input
					class="search-input"
					v-model.trim="searchKeyword"
					placeholder="搜索药材名称"
					confirm-type="search"
					@confirm="onSearch"
					@input="onKeywordInput"
				/>
				<view v-if="searchKeyword" class="clear-icon" @tap="clearKeyword">✕</view>
			</view>
			</view>
			<!-- 筛选条件：库存标签 + 效期标签（近效期简洁模式下隐藏） -->
			<view v-if="!isExpiryMode" class="filter-section">
			<!-- 库存标签：直接点标签刷新列表 -->
			<view class="filter-row chips-row">
				<text class="chips-label">库存</text>
				<view class="chips-group">
					<view
						v-for="item in stockFilters"
						:key="item.value"
						:class="['chip', { active: selectedStockFilter === item.value }]"
						@tap="setStockFilter(item.value)"
					>
						{{ item.label }}
					</view>
				</view>
			</view>
			<!-- 效期标签：直接点标签刷新列表 -->
			<view class="filter-row chips-row">
				<text class="chips-label">效期</text>
				<view class="chips-group">
					<view
						v-for="item in expiryFilters"
						:key="item.value"
						:class="['chip', { active: selectedExpiryFilter === item.value }]"
						@tap="setExpiryFilter(item.value)"
					>
						{{ item.label }}
					</view>
				</view>
			</view>
			</view>
			
			<!-- 统计信息（近效期简洁模式下隐藏） -->
			<view v-if="!isExpiryMode" class="stats-bar">
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
			
			<!-- 近效期模式：效期天数选择条 -->
			<view v-if="isExpiryMode" class="expiry-bar">
			<view class="expiry-row">
				<view class="left-part">
					<text class="expiry-label">效期小于</text>
					<input
						class="expiry-input"
						v-model.number="expiryDays"
						type="number"
						@confirm="applyExpiryDays"
					/>
					<text class="expiry-unit">天</text>
				</view>
				<view class="expiry-apply" @tap="applyExpiryDays">确定</view>
			</view>
			<view class="expiry-preset">
				<view class="preset-btn" @tap="setExpiryDays(30)">30天</view>
				<view class="preset-btn" @tap="setExpiryDays(60)">60天</view>
				<view class="preset-btn" @tap="setExpiryDays(90)">90天</view>
			</view>
			</view>
			
			<!-- 库存列表 -->
			<view class="stock-list">
			<!-- 近效期模式下的统计标题（无论有无数据都显示） -->
			<view
				v-if="isExpiryMode"
				class="expiry-summary"
			>
				有效期小于 {{ expiryDays }} 天的药材，共计 {{ stockList.length }} 个品种
			</view>
			
			<view 
				v-for="item in stockList" 
				:key="item._id"
				class="stock-card"
				@click="goDetail(item)"
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
						<text class="info-value">
							{{ (item.totalQuantity !== undefined ? item.totalQuantity : (item.quantity || 0)) + (item.unit || '') }}
						</text>
					</view>
					<view class="info-row" v-if="item.manufacturer">
						<text class="info-label">厂家：</text>
						<text class="info-value">{{ item.manufacturer }}</text>
					</view>
				</view>
				
				<!-- 批次信息（仅展示数量大于0的批次） -->
				<view v-if="item.batches && item.batches.length > 0" class="batch-section">
					<view class="batch-title">批次信息（{{ item.batches.filter(b => b.quantity > 0).length }}个）</view>
					<view 
						v-for="(batch, index) in item.batches.filter(b => b.quantity > 0)" 
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
				</view>
			</view>
			
			<!-- 空状态 -->
			<view v-if="stockList.length === 0" class="empty-state">
				<text class="empty-icon">📦</text>
				<text class="empty-text">暂无符合条件的药材</text>
				<text class="empty-hint">{{ searchKeyword ? '换个关键词试试' : '可调整上方筛选条件' }}</text>
			</view>
			
			<!-- 加载更多 -->
			<view v-if="hasMore" class="load-more" @click="loadMore">
				<text>加载更多</text>
			</view>
			<view v-else-if="stockList.length > 0" class="no-more">
				<text>没有更多了</text>
			</view>
 		</view>
		<!-- 分类选择器已移除，仅保留库存/效期标签 -->
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchKeyword: '',
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
			selectedStockFilter: 'all',
			selectedExpiryFilter: 'all',
			hasAnyStock: true,
			// 是否为“近效期药材”简洁明细模式
			isExpiryMode: false,
			// 近效期自定义天数（仅在近效期模式下使用）
			expiryDays: 60,
			
			// 选择器显示状态（分类已移除）
			showCategoryPicker: false,
			
			// 选项列表（仅库存和效期）
			// 库存筛选：简化为三档
			stockFilters: [
				{ label: '有库存', value: 'all' },      // 默认：总库存>0
				{ label: '预警', value: 'warning' },     // qty>0 且 <= minStock
				{ label: '零库存', value: 'empty' }      // qty<=0
			],
			// 效期筛选：常用三档
			expiryFilters: [
				{ label: '全部', value: 'all' },
				{ label: '近效期', value: 'expiring60' },
				{ label: '已过期', value: 'expired' }
			]
		}
	},
	
	computed: {},
	
	onLoad(options) {
		// 支持从首页“近效期药材”入口跳转时直接进入近效期视图
		if (options && options.filter === 'expiring') {
			// 近效期入口：只展示明细列表，不展示筛选/统计等控件
			this.isExpiryMode = true
			// 这里约定使用“有库存”+“60天内到期”作为近效期口径
			this.selectedStockFilter = 'inStock'
			this.selectedExpiryFilter = 'expiring60'
			uni.setNavigationBarTitle({ title: '近效期药材' })
			this.page = 1
			this.stockList = []
			this.hasMore = true
			this.loadStockList()
		} else {
			uni.setNavigationBarTitle({ title: '库存查询' })
			this.loadStockList()
		}
		this.loadStats()
	},
	
	methods: {
		// 搜索输入：简单节流，输入后短暂延迟触发查询
		onKeywordInput() {
			if (this._keywordTimer) {
				clearTimeout(this._keywordTimer)
			}
			this._keywordTimer = setTimeout(() => {
				this.page = 1
				this.stockList = []
				this.hasMore = true
				this.loadStockList()
			}, 300)
		},
		// 分类筛选已移除
		// 点击库存标签
		setStockFilter(value) {
			if (this.selectedStockFilter === value) return
			this.selectedStockFilter = value
			this.onSearch()
		},
		// 点击效期标签
		setExpiryFilter(value) {
			if (this.selectedExpiryFilter === value) return
			this.selectedExpiryFilter = value
			this.onSearch()
		},
		// 近效期模式：设置快速天数并应用
		setExpiryDays(days) {
			this.expiryDays = days
			this.applyExpiryDays()
		},
		// 近效期模式：应用当前输入的天数
		applyExpiryDays() {
			const v = Number(this.expiryDays)
			if (!v || v <= 0) {
				uni.showToast({ title: '请输入大于0的天数', icon: 'none' })
				return
			}
			this.page = 1
			this.stockList = []
			this.hasMore = true
			this.loadStockList()
		},
		
		onSearch() {
			this.page = 1
			this.stockList = []
			this.hasMore = true
			this.loadStockList()
		},
		
		clearKeyword() {
			if (!this.searchKeyword) return
			this.searchKeyword = ''
			this.onSearch()
		},
		
		// 加载库存列表
		async loadStockList() {
			try {
				// 使用已有的 getStockList 云函数封装
				const result = await this.$api.getStockList({
					keyword: this.searchKeyword,
					// 后端已按 drugId 聚合，这里只传入库存和效期筛选
					location: 'drug_storage',
					stockFilter: this.selectedStockFilter,
					expiryFilter: this.isExpiryMode ? 'all' : this.selectedExpiryFilter,
					customExpiryDays: this.isExpiryMode ? this.expiryDays : null,
					page: this.page,
					pageSize: this.pageSize
				})
				
				if (result && result.success) {
					const newData = result.data || []
					// 首次查询且无数据时给出提示
					if (this.page === 1 && newData.length === 0) {
						uni.showToast({
							title: '暂无符合条件的库存数据',
							icon: 'none'
						})
						// 确保筛选弹窗关闭
						this.showCategoryPicker = false
					}
					this.stockList = this.page === 1 ? newData : [...this.stockList, ...newData]
					this.hasMore = newData.length >= this.pageSize
				} else {
					if (this.page === 1) {
						this.stockList = []
					}
					this.hasMore = false
				}
			} catch (err) {
				console.error('加载失败:', err)
				if (this.page === 1) {
					this.stockList = []
				}
				this.hasMore = false
			}
		},
		
		// 加载统计数据
		async loadStats() {
			try {
				// 1）通过 getStockList 获取当前整体库存列表，用于统计品种数和总库存
				const listRes = await this.$api.getStockList({
					keyword: '',
					location: 'drug_storage',
					page: 1,
					pageSize: 500
				})
				let totalDrugs = 0
				let totalStock = 0
				let warningCount = 0
				if (listRes && listRes.success) {
					const items = listRes.data || []
					totalDrugs = items.length
					totalStock = items.reduce((sum, it) => sum + (it.totalQuantity || it.quantity || 0), 0)
					// 简单按照数量阈值统计预警数
					warningCount = items.filter(it => {
						const qty = it.totalQuantity || it.quantity || 0
						const min = it.minStock || 10
						return qty > 0 && qty <= min
					}).length
				}
				
				// 2）通过 checkExpiry(90) 获取近效期+已过期数量
				let expiringCount = 0
				try {
					const expiryRes = await this.$api.checkExpiry(90)
					if (expiryRes && expiryRes.success && expiryRes.data) {
						const d = expiryRes.data
						expiringCount = (d.nearExpiryCount || 0) + (d.expiredCount || 0)
					}
				} catch (e) {
					console.error('效期统计失败:', e)
				}
				
				this.stats = {
					totalDrugs: totalDrugs || 0,
					totalStock: totalStock || 0,
					warningCount: warningCount || 0,
					expiringCount: expiringCount || 0
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
		
		goDetail(item) {
			const drugId = item.drugId || item._id
			if (!drugId) {
				uni.showToast({
					title: '未找到药材ID',
					icon: 'none'
				})
				return
			}
			uni.navigateTo({
				url: `/pages-sub/drug/detail?id=${drugId}`
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
	// 使用与首页/门诊/药材工作台一致的蓝色渐变背景
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding: 24rpx 0 140rpx;
}

.content-column {
	max-width: 702rpx;
	margin: 0 auto;
	padding: 0 22rpx 8rpx;
}

.filter-section {
	background: #FFFFF0;
	/* 与其它卡片保持相同上下间距 */
	margin: 0 0 8rpx;
	padding: 14rpx 22rpx 10rpx;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);

	.filter-row {
		display: flex;
		align-items: center;
		margin-bottom: 8rpx;
	}

	.category-row {
		justify-content: flex-start;
		column-gap: 8rpx;
	}

	.filter-label {
		font-size: 26rpx;
		color: #6b7280;
		margin-right: 8rpx;
	}

	.filter-chip-text {
		font-size: 26rpx;
		color: #111827;
	}

	.filter-arrow {
		margin-left: auto;
		font-size: 26rpx;
		color: #cbd5e1;
	}

	.chips-row {
		align-items: center;
		margin-bottom: 6rpx;
	}

	.chips-label {
		font-size: 24rpx;
		color: #9ca3af;
		margin-right: 8rpx;
	}

	.chips-group {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		row-gap: 8rpx;
		column-gap: 10rpx;
	}

	.chip {
		min-width: 120rpx;
		padding: 8rpx 18rpx;
		border-radius: 999rpx;
		border: 1rpx solid #e5e7eb;
		font-size: 24rpx;
		color: #4b5563;
		background: #f9fafb;
		text-align: center;
	}

	.chip.active {
		background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
		color: #ffffff;
		border-color: transparent;
		box-shadow: 0 4rpx 12rpx rgba(37, 99, 235, 0.35);
	}
}

.search-section {
	/* 作为第一个卡片：底部统一留 8rpx 间距 */
	padding: 0;
	margin: 0 0 8rpx;
}

.search-wrapper {
	display: flex;
	align-items: center;
	background: #ffffff;
	border-radius: 999rpx;
	padding: 8rpx 16rpx;
	box-shadow: 0 4rpx 10rpx rgba(15, 23, 42, 0.06);
}

.search-icon {
	font-size: 28rpx;
	margin-right: 8rpx;
}

.search-input {
	flex: 1;
	font-size: 26rpx;
	color: #111827;
}

.clear-icon {
	font-size: 26rpx;
	color: #9ca3af;
	margin-left: 6rpx;
}

// 统计信息
.stats-bar {
	display: flex;
	/* 统计卡与上下卡片之间统一 8rpx 间距 */
	margin: 0 auto 8rpx;
	max-width: 702rpx;
	padding: 18rpx 22rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	
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
	/* 列表紧跟在统计卡或效期卡之后，不再额外增加间距 */
	padding: 0;
}

// 近效期标题行
.expiry-summary {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 16rpx 22rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	text-align: center;
	font-size: 30rpx;
	color: #f97373; // 较浅的红色提示
}

// 近效期顶部天数选择条
.expiry-bar {
	/* 近效期模式下的卡片，也与其它卡片保持统一间距 */
	margin: 0 auto 8rpx;
	max-width: 702rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	padding: 18rpx 22rpx 14rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);

	.expiry-row {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 14rpx;
		column-gap: 8rpx;

		// 左侧：文字 + 输入框 + 单位
		.left-part {
			display: flex;
			align-items: center;
		}

		.expiry-label {
			font-size: 26rpx;
			color: #646566;
			margin-right: 0;
		}

		.expiry-input {
			width: 120rpx;
			height: 56rpx;
			padding: 0 16rpx;
			border-radius: 28rpx;
			background: #f5f5f5;
			font-size: 26rpx;
			color: #323233;
			text-align: center;
			margin-right: 0;
		}

		.expiry-unit {
			font-size: 26rpx;
			color: #969799;
			margin-left: 0;
		}

		.expiry-apply {
			padding: 0 30rpx;
			height: 56rpx;
			line-height: 56rpx;
			border-radius: 28rpx;
			background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
			color: #ffffff;
			font-size: 26rpx;
			margin-left: 24rpx;
		}
	}

	.expiry-preset {
		display: flex;
		justify-content: center;
		margin-top: 6rpx;
		column-gap: 16rpx;

		.preset-btn {
			padding: 8rpx 26rpx;
			border-radius: 22rpx;
			font-size: 24rpx;
			color: #2563eb;
			background: #eff6ff;
		}
	}
}

.stock-card {
	background: #fffff0;
	border-radius: 18rpx;
	padding: 16rpx 22rpx 14rpx;
	/* 每个库存卡之间统一 8rpx 间距 */
	margin: 0 0 8rpx;
	box-shadow: 0 6rpx 18rpx rgba(15, 23, 42, 0.1);
	
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
	padding: 80rpx 24rpx 90rpx;
	
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
	padding: 26rpx 0 40rpx;
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


