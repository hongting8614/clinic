<template>
	<view class="container">
		<!-- 报表头部 -->
		<view class="report-header">
			<view class="header-title">库存报表</view>
			<view class="header-subtitle">{{ currentDate }}</view>
		</view>
		
		<!-- 筛选条件 -->
		<view class="filter-section">
			<view class="filter-row">
				<view class="filter-item" @tap="showCategoryPicker = true">
					<text class="filter-label">📦 药品分类</text>
					<text class="filter-value">{{ selectedCategory || '全部' }}</text>
				</view>
			</view>
			<view class="filter-row">
				<view class="filter-item half" @tap="showStockPicker = true">
					<text class="filter-label">库存状态</text>
					<text class="filter-value">{{ stockFilterText }}</text>
				</view>
				<view class="filter-item half" @tap="showExpiryPicker = true">
					<text class="filter-label">效期状态</text>
					<text class="filter-value">{{ expiryFilterText }}</text>
				</view>
			</view>
			<view class="filter-actions">
				<view class="action-btn reset" @tap="resetFilters">
					<text>重置</text>
				</view>
				<view class="action-btn search" @tap="generateReport">
					<text>生成报表</text>
				</view>
			</view>
		</view>
		
		<!-- 统计汇总 -->
		<view v-if="reportData" class="summary-section">
			<view class="summary-title">📊 库存概况</view>
			<view class="summary-grid">
				<view class="summary-card">
					<text class="summary-value">{{ reportData.totalDrugs }}</text>
					<text class="summary-label">药品种类</text>
				</view>
				<view class="summary-card">
					<text class="summary-value">{{ reportData.totalStock }}</text>
					<text class="summary-label">总库存量</text>
				</view>
				<view class="summary-card warning">
					<text class="summary-value">{{ reportData.lowStockCount }}</text>
					<text class="summary-label">库存预警</text>
				</view>
				<view class="summary-card danger">
					<text class="summary-value">{{ reportData.expiringCount }}</text>
					<text class="summary-label">近效期</text>
				</view>
			</view>
			<view class="summary-amount">
				<text class="amount-label">库存总价值</text>
				<text class="amount-value">¥{{ reportData.totalValue }}</text>
			</view>
		</view>
		
		<!-- 报表表格 -->
		<view v-if="reportData && reportData.items.length > 0" class="table-section">
			<view class="table-header">
				<text class="col col-name">药品名称</text>
				<text class="col col-spec">规格</text>
				<text class="col col-stock">库存</text>
				<text class="col col-unit">单位</text>
				<text class="col col-status">状态</text>
				<text class="col col-value">价值</text>
			</view>
			<scroll-view scroll-y class="table-body">
				<view 
					v-for="(item, index) in reportData.items" 
					:key="index"
					class="table-row"
					@tap="viewDetail(item.drugId)"
				>
					<text class="col col-name">{{ item.drugName }}</text>
					<text class="col col-spec">{{ item.specification }}</text>
					<text :class="[
						'col', 
						'col-stock',
						item.quantity <= 0 ? 'stock-empty' : (item.quantity <= (item.minStock || 10) ? 'stock-warning' : 'stock-normal')
					]">{{ item.quantity }}</text>
					<text class="col col-unit">{{ item.unit }}</text>
					<text class="col col-status">
						<view :class="[
							'status-badge',
							item.quantity <= 0 ? 'status-empty' : (item.quantity <= (item.minStock || 10) ? 'status-warning' : (item.nearExpiry ? 'status-expiring' : 'status-normal'))
						]">
							{{ item.quantity <= 0 ? '无库存' : (item.quantity <= (item.minStock || 10) ? '预警' : (item.nearExpiry ? '近效期' : '正常')) }}
						</view>
					</text>
					<text class="col col-value">¥{{ item.totalValue }}</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 空状态 -->
		<view v-if="!reportData || reportData.items.length === 0" class="empty-state">
			<text class="empty-icon">📊</text>
			<text class="empty-text">暂无数据</text>
			<text class="empty-hint">请选择筛选条件后生成报表</text>
		</view>
		
		<!-- 导出按钮 -->
		<view v-if="reportData && reportData.items.length > 0" class="export-section">
			<view class="export-btn" @tap="exportExcel">
				<text class="export-icon">📄</text>
				<text class="export-text">导出Excel</text>
			</view>
			<view class="export-btn" @tap="exportPDF">
				<text class="export-icon">📑</text>
				<text class="export-text">导出PDF</text>
			</view>
			<view class="export-btn" @tap="printReport">
				<text class="export-icon">🖨️</text>
				<text class="export-text">打印报表</text>
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
					<text class="picker-title">库存状态</text>
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
					<text class="picker-title">效期状态</text>
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
			currentDate: '',
			reportData: null,
			
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
		this.initPage()
	},
	
	methods: {
		initPage() {
			const now = new Date()
			this.currentDate = this.formatDateTime(now)
			
			// 自动生成报表
			this.generateReport()
		},
		
		confirmCategory() {
			this.showCategoryPicker = false
		},
		
		confirmStockFilter() {
			this.showStockPicker = false
		},
		
		confirmExpiryFilter() {
			this.showExpiryPicker = false
		},
		
		resetFilters() {
			this.selectedCategory = ''
			this.selectedStockFilter = 'all'
			this.selectedExpiryFilter = 'all'
		},
		
		// 生成报表
		async generateReport() {
			uni.showLoading({ title: '生成中...', mask: true })
			
			try {
				const result = await this.$api.callFunction('reports', {
					action: 'stockReport',
					data: {
						category: this.selectedCategory === '全部' ? '' : this.selectedCategory,
						stockFilter: this.selectedStockFilter,
						expiryFilter: this.selectedExpiryFilter
					}
				})
				
				uni.hideLoading()
				
				if (result && result.success) {
					this.reportData = result.data
				} else {
					// 使用模拟数据
					this.reportData = this.getMockData()
				}
			} catch (err) {
				console.error('生成报表失败:', err)
				uni.hideLoading()
				// 使用模拟数据
				this.reportData = this.getMockData()
			}
		},
		
		// 导出功能
		exportExcel() {
			uni.showToast({
				title: '导出Excel功能开发中',
				icon: 'none'
			})
		},
		
		exportPDF() {
			uni.showToast({
				title: '导出PDF功能开发中',
				icon: 'none'
			})
		},
		
		printReport() {
			uni.showToast({
				title: '打印功能开发中',
				icon: 'none'
			})
		},
		
		viewDetail(drugId) {
			uni.navigateTo({
				url: `/pages-sub/stock/detail?id=${drugId}`
			})
		},
		
		// 获取库存样式
		getStockClass(item) {
			if (item.quantity <= 0) return 'stock-empty'
			if (item.quantity <= (item.minStock || 10)) return 'stock-warning'
			return 'stock-normal'
		},
		
		// 获取状态样式
		getStatusClass(item) {
			if (item.quantity <= 0) return 'status-empty'
			if (item.quantity <= (item.minStock || 10)) return 'status-warning'
			if (item.nearExpiry) return 'status-expiring'
			return 'status-normal'
		},
		
		// 获取状态文本
		getStatusText(item) {
			if (item.quantity <= 0) return '无库存'
			if (item.quantity <= (item.minStock || 10)) return '预警'
			if (item.nearExpiry) return '近效期'
			return '正常'
		},
		
		formatDateTime(date) {
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			return `${year}年${month}月${day}日`
		},
		
		// 模拟数据
		getMockData() {
			return {
				totalDrugs: 156,
				totalStock: 12580,
				lowStockCount: 8,
				expiringCount: 5,
				totalValue: 458600.00,
				items: [
					{
						drugId: 'drug_001',
						drugName: '阿莫西林胶囊',
						specification: '0.25g×24粒/盒',
						quantity: 150,
						unit: '盒',
						minStock: 50,
						nearExpiry: false,
						totalValue: 4500.00
					},
					{
						drugId: 'drug_002',
						drugName: '布洛芬缓释胶囊',
						specification: '0.3g×20粒/盒',
						quantity: 30,
						unit: '盒',
						minStock: 50,
						nearExpiry: true,
						totalValue: 960.00
					},
					{
						drugId: 'drug_003',
						drugName: '感冒灵颗粒',
						specification: '10g×10袋/盒',
						quantity: 200,
						unit: '盒',
						minStock: 100,
						nearExpiry: false,
						totalValue: 6000.00
					},
					{
						drugId: 'drug_004',
						drugName: '维生素C片',
						specification: '0.1g×100片/瓶',
						quantity: 5,
						unit: '瓶',
						minStock: 20,
						nearExpiry: false,
						totalValue: 75.00
					},
					{
						drugId: 'drug_005',
						drugName: '阿司匹林肠溶片',
						specification: '25mg×100片/瓶',
						quantity: 0,
						unit: '瓶',
						minStock: 30,
						nearExpiry: false,
						totalValue: 0.00
					}
				]
			}
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

// 报表头部
.report-header {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 40rpx 30rpx;
	
	.header-title {
		font-size: 40rpx;
		font-weight: bold;
		color: white;
		margin-bottom: 10rpx;
	}
	
	.header-subtitle {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.8);
	}
}

// 筛选条件
.filter-section {
	background: white;
	padding: 30rpx;
	margin: 20rpx 30rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	
	.filter-row {
		display: flex;
		gap: 20rpx;
		margin-bottom: 20rpx;
		
		&:last-child {
			margin-bottom: 0;
		}
		
		.filter-item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 25rpx;
			background: #f7f8fa;
			border-radius: 12rpx;
			
			&.half {
				flex: 1;
			}
			
			.filter-label {
				font-size: 28rpx;
				color: #646566;
			}
			
			.filter-value {
				font-size: 28rpx;
				color: #323233;
			}
		}
	}
	
	.filter-actions {
		display: flex;
		gap: 20rpx;
		margin-top: 30rpx;
		
		.action-btn {
			flex: 1;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 40rpx;
			font-size: 28rpx;
			
			&.reset {
				background: #f7f8fa;
				color: #646566;
			}
			
			&.search {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: white;
			}
		}
	}
}

// 统计汇总
.summary-section {
	background: white;
	padding: 30rpx;
	margin: 0 30rpx 20rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	
	.summary-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #323233;
		margin-bottom: 25rpx;
	}
	
	.summary-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
		margin-bottom: 25rpx;
		
		.summary-card {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 30rpx;
			background: linear-gradient(135deg, #f7f8ff 0%, #f0f1ff 100%);
			border-radius: 12rpx;
			
			&.warning {
				background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
				
				.summary-value {
					color: #ff9800;
				}
			}
			
			&.danger {
				background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
				
				.summary-value {
					color: #f44336;
				}
			}
			
			.summary-value {
				font-size: 36rpx;
				font-weight: bold;
				color: #667eea;
				margin-bottom: 10rpx;
			}
			
			.summary-label {
				font-size: 24rpx;
				color: #969799;
			}
		}
	}
	
	.summary-amount {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 25rpx 30rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 12rpx;
		
		.amount-label {
			font-size: 28rpx;
			color: rgba(255, 255, 255, 0.9);
		}
		
		.amount-value {
			font-size: 36rpx;
			font-weight: bold;
			color: white;
		}
	}
}

// 报表表格
.table-section {
	background: white;
	margin: 0 30rpx 20rpx;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	
	.table-header {
		display: flex;
		background: #f7f8fa;
		padding: 20rpx 10rpx;
		font-size: 24rpx;
		font-weight: bold;
		color: #646566;
		
		.col {
			text-align: center;
			
			&.col-name { flex: 1.5; text-align: left; padding-left: 20rpx; }
			&.col-spec { flex: 1.2; }
			&.col-stock { width: 80rpx; }
			&.col-unit { width: 80rpx; }
			&.col-status { width: 100rpx; }
			&.col-value { width: 120rpx; }
		}
	}
	
	.table-body {
		max-height: 800rpx;
		
		.table-row {
			display: flex;
			align-items: center;
			padding: 20rpx 10rpx;
			font-size: 24rpx;
			color: #323233;
			border-bottom: 1rpx solid #f7f8fa;
			
			&:last-child {
				border-bottom: none;
			}
			
			.col {
				text-align: center;
				
				&.col-name { flex: 1.5; text-align: left; padding-left: 20rpx; }
				&.col-spec { flex: 1.2; }
				&.col-stock { 
					width: 80rpx; 
					font-weight: bold;
					
					&.stock-normal { color: #4caf50; }
					&.stock-warning { color: #ff9800; }
					&.stock-empty { color: #f44336; }
				}
				&.col-unit { width: 80rpx; }
				&.col-status { 
					width: 100rpx;
					
					.status-badge {
						display: inline-block;
						padding: 4rpx 12rpx;
						border-radius: 20rpx;
						font-size: 20rpx;
						
						&.status-normal {
							background: #e8f5e9;
							color: #4caf50;
						}
						
						&.status-warning {
							background: #fff3e0;
							color: #ff9800;
						}
						
						&.status-expiring {
							background: #ffebee;
							color: #f44336;
						}
						
						&.status-empty {
							background: #f5f5f5;
							color: #999;
						}
					}
				}
				&.col-value { width: 120rpx; color: #667eea; }
			}
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

// 导出按钮
.export-section {
	display: flex;
	gap: 20rpx;
	padding: 0 30rpx;
	margin-top: 20rpx;
	
	.export-btn {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
		padding: 30rpx 20rpx;
		background: white;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
		
		.export-icon {
			font-size: 48rpx;
		}
		
		.export-text {
			font-size: 24rpx;
			color: #646566;
		}
	}
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


