<template>
	<view class="container">
		<!-- 报表头部 -->
		<view class="report-header">
			<view class="header-title">入库单报表</view>
			<view class="header-subtitle">{{ currentDate }}</view>
		</view>
		
		<!-- 筛选条件 -->
		<view class="filter-section">
			<view class="filter-row">
				<view class="filter-item" @tap="showDatePicker = true">
					<text class="filter-label">📅 时间范围</text>
					<text class="filter-value">{{ dateRangeText }}</text>
				</view>
			</view>
			<view class="filter-row">
				<view class="filter-item half" @tap="showSupplierPicker = true">
					<text class="filter-label">供应商</text>
					<text class="filter-value">{{ selectedSupplier || '全部' }}</text>
				</view>
				<view class="filter-item half" @tap="showOperatorPicker = true">
					<text class="filter-label">操作人</text>
					<text class="filter-value">{{ selectedOperator || '全部' }}</text>
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
			<view class="summary-title">📊 统计汇总</view>
			<view class="summary-grid">
				<view class="summary-card">
					<text class="summary-value">{{ reportData.totalRecords }}</text>
					<text class="summary-label">入库单数</text>
				</view>
				<view class="summary-card">
					<text class="summary-value">{{ reportData.totalDrugs }}</text>
					<text class="summary-label">药品种类</text>
				</view>
				<view class="summary-card">
					<text class="summary-value">{{ reportData.totalQuantity }}</text>
					<text class="summary-label">总数量</text>
				</view>
				<view class="summary-card">
					<text class="summary-value">¥{{ reportData.totalAmount }}</text>
					<text class="summary-label">总金额</text>
				</view>
			</view>
		</view>
		
		<!-- 报表表格 -->
		<view v-if="reportData && reportData.records.length > 0" class="table-section">
			<view class="table-header">
				<text class="col col-no">单号</text>
				<text class="col col-date">日期</text>
				<text class="col col-supplier">供应商</text>
				<text class="col col-operator">操作人</text>
				<text class="col col-drugs">品种</text>
				<text class="col col-quantity">数量</text>
				<text class="col col-amount">金额</text>
			</view>
			<scroll-view scroll-y class="table-body">
				<view 
					v-for="(item, index) in reportData.records" 
					:key="index"
					class="table-row"
					@tap="viewDetail(item._id)"
				>
					<text class="col col-no">{{ item.recordNo }}</text>
					<text class="col col-date">{{ formatDate(item.createTime) }}</text>
					<text class="col col-supplier">{{ item.supplier || '-' }}</text>
					<text class="col col-operator">{{ item.operator }}</text>
					<text class="col col-drugs">{{ item.drugCount }}</text>
					<text class="col col-quantity">{{ item.totalQuantity }}</text>
					<text class="col col-amount">¥{{ item.totalAmount }}</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 空状态 -->
		<view v-if="!reportData || reportData.records.length === 0" class="empty-state">
			<text class="empty-icon">📊</text>
			<text class="empty-text">暂无数据</text>
			<text class="empty-hint">请选择筛选条件后生成报表</text>
		</view>
		
		<!-- 导出按钮 -->
		<view v-if="reportData && reportData.records.length > 0" class="export-section">
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
		
		<!-- 日期选择器 -->
		<u-popup v-model="showDatePicker" mode="bottom">
			<view class="date-picker-popup">
				<view class="picker-header">
					<text class="picker-cancel" @tap="showDatePicker = false">取消</text>
					<text class="picker-title">选择时间范围</text>
					<text class="picker-confirm" @tap="confirmDateRange">确定</text>
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
		
		<!-- 供应商选择器 -->
		<u-popup v-model="showSupplierPicker" mode="bottom">
			<view class="picker-popup">
				<view class="picker-header">
					<text class="picker-cancel" @tap="showSupplierPicker = false">取消</text>
					<text class="picker-title">选择供应商</text>
					<text class="picker-confirm" @tap="confirmSupplier">确定</text>
				</view>
				<view class="picker-list">
					<view 
						v-for="(item, index) in suppliers" 
						:key="index"
						:class="['picker-item', { active: selectedSupplier === item }]"
						@tap="selectedSupplier = item"
					>
						{{ item }}
					</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 操作人选择器 -->
		<u-popup v-model="showOperatorPicker" mode="bottom">
			<view class="picker-popup">
				<view class="picker-header">
					<text class="picker-cancel" @tap="showOperatorPicker = false">取消</text>
					<text class="picker-title">选择操作人</text>
					<text class="picker-confirm" @tap="confirmOperator">确定</text>
				</view>
				<view class="picker-list">
					<view 
						v-for="(item, index) in operators" 
						:key="index"
						:class="['picker-item', { active: selectedOperator === item }]"
						@tap="selectedOperator = item"
					>
						{{ item }}
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
			startDate: '',
			endDate: '',
			selectedSupplier: '',
			selectedOperator: '',
			selectedQuickFilter: 'month',
			
			// 选择器显示状态
			showDatePicker: false,
			showSupplierPicker: false,
			showOperatorPicker: false,
			
			// 选项列表
			quickFilters: [
				{ label: '今天', value: 'today' },
				{ label: '本周', value: 'week' },
				{ label: '本月', value: 'month' },
				{ label: '本季度', value: 'quarter' },
				{ label: '本年', value: 'year' },
				{ label: '自定义', value: 'custom' }
			],
			suppliers: ['全部', 'XX医药公司', 'YY药业', 'ZZ医药'],
			operators: ['全部', '张三', '李四', '王五']
		}
	},
	
	computed: {
		dateRangeText() {
			if (!this.startDate && !this.endDate) {
				return '请选择'
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
			if (this.selectedQuickFilter === 'quarter') {
				return '本季度'
			}
			if (this.selectedQuickFilter === 'year') {
				return '本年'
			}
			if (this.startDate && this.endDate) {
				return `${this.startDate} ~ ${this.endDate}`
			}
			return '请选择'
		}
	},
	
	onLoad() {
		this.initPage()
	},
	
	methods: {
		initPage() {
			const now = new Date()
			this.currentDate = this.formatDateTime(now)
			
			// 默认选择本月
			this.selectQuickFilter('month')
			
			// 自动生成报表
			this.generateReport()
		},
		
		// 日期筛选
		selectQuickFilter(value) {
			this.selectedQuickFilter = value
			const today = new Date()
			
			switch(value) {
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
				case 'quarter':
					const quarter = Math.floor(today.getMonth() / 3)
					const quarterStart = new Date(today.getFullYear(), quarter * 3, 1)
					this.startDate = this.formatDate(quarterStart)
					this.endDate = this.formatDate(today)
					break
				case 'year':
					const yearStart = new Date(today.getFullYear(), 0, 1)
					this.startDate = this.formatDate(yearStart)
					this.endDate = this.formatDate(today)
					break
				case 'custom':
					// 保持当前日期不变
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
		
		confirmDateRange() {
			this.showDatePicker = false
		},
		
		confirmSupplier() {
			this.showSupplierPicker = false
		},
		
		confirmOperator() {
			this.showOperatorPicker = false
		},
		
		resetFilters() {
			this.selectQuickFilter('month')
			this.selectedSupplier = ''
			this.selectedOperator = ''
		},
		
		// 生成报表
		async generateReport() {
			if (!this.startDate || !this.endDate) {
				uni.showToast({
					title: '请选择时间范围',
					icon: 'none'
				})
				return
			}
			
			uni.showLoading({ title: '生成中...', mask: true })
			
			try {
				const result = await this.$api.callFunction('reports', {
					action: 'inboundReport',
					data: {
						startDate: this.startDate,
						endDate: this.endDate,
						supplier: this.selectedSupplier === '全部' ? '' : this.selectedSupplier,
						operator: this.selectedOperator === '全部' ? '' : this.selectedOperator
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
		
		viewDetail(id) {
			uni.navigateTo({
				url: `/pages-sub/in/detail?id=${id}`
			})
		},
		
		// 格式化日期
		formatDate(date) {
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			return `${year}-${month}-${day}`
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
				totalRecords: 15,
				totalDrugs: 45,
				totalQuantity: 1250,
				totalAmount: 58600.00,
				records: [
					{
						_id: 'in_001',
						recordNo: 'RK20251108001',
						createTime: '2025-11-08 09:30:00',
						supplier: 'XX医药公司',
						operator: '张三',
						drugCount: 3,
						totalQuantity: 150,
						totalAmount: 4500.00
					},
					{
						_id: 'in_002',
						recordNo: 'RK20251108002',
						createTime: '2025-11-08 14:20:00',
						supplier: 'YY药业',
						operator: '李四',
						drugCount: 2,
						totalQuantity: 100,
						totalAmount: 3200.00
					},
					{
						_id: 'in_003',
						recordNo: 'RK20251107001',
						createTime: '2025-11-07 10:00:00',
						supplier: 'ZZ医药',
						operator: '王五',
						drugCount: 4,
						totalQuantity: 200,
						totalAmount: 6800.00
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
		
		.summary-card {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 30rpx;
			background: linear-gradient(135deg, #f7f8ff 0%, #f0f1ff 100%);
			border-radius: 12rpx;
			
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
			
			&.col-no { width: 180rpx; }
			&.col-date { width: 140rpx; }
			&.col-supplier { flex: 1; }
			&.col-operator { width: 100rpx; }
			&.col-drugs { width: 80rpx; }
			&.col-quantity { width: 100rpx; }
			&.col-amount { width: 120rpx; }
		}
	}
	
	.table-body {
		max-height: 800rpx;
		
		.table-row {
			display: flex;
			padding: 20rpx 10rpx;
			font-size: 24rpx;
			color: #323233;
			border-bottom: 1rpx solid #f7f8fa;
			
			&:last-child {
				border-bottom: none;
			}
			
			.col {
				text-align: center;
				
				&.col-no { width: 180rpx; }
				&.col-date { width: 140rpx; }
				&.col-supplier { flex: 1; }
				&.col-operator { width: 100rpx; }
				&.col-drugs { width: 80rpx; }
				&.col-quantity { width: 100rpx; }
				&.col-amount { width: 120rpx; color: #667eea; }
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
.date-picker-popup, .picker-popup {
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


