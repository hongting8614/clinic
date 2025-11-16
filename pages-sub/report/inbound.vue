<template>
	<view class="container">
		<!-- 页面头部 -->
		<view class="page-header">
			<view>
				<text class="page-title">入库统计报表</text>
				<text class="page-subtitle">Inbound Report Overview</text>
			</view>
			<view class="page-actions">
				<view class="header-btn" @tap="simulateInboundData">
					<text class="btn-icon">⚙️</text>
					<text class="btn-text">生成模拟数据</text>
				</view>
				<view class="header-btn primary" @tap="generateReport">
					<text class="btn-icon">🔄</text>
					<text class="btn-text">刷新报表</text>
				</view>
			</view>
		</view>
		
		<filter-panel
			class="filter-panel-wrapper"
			:show-date="true"
			:start-date="startDate"
			:end-date="endDate"
			:quick-filters="quickFilters"
			:active-quick-filter="selectedQuickFilter"
			:show-search-button="false"
			@update:startDate="onStartDateUpdate"
			@update:endDate="onEndDateUpdate"
			@quick-filter="selectQuickFilter"
			@date-change="onDateChange"
			@search="generateReport"
		>
			<view class="filter-extra">
				<view class="extra-item">
					<text class="extra-label">药品名称</text>
					<input class="extra-input" v-model="drugName" placeholder="输入药品名称" @confirm="generateReport" />
				</view>
				<view class="extra-item selectable" @tap="showSupplierPicker = true">
					<text class="extra-label">供应商</text>
					<text class="extra-value">{{ selectedSupplier || '全部' }}</text>
			</view>
				<view class="extra-item selectable" @tap="showOperatorPicker = true">
					<text class="extra-label">操作人</text>
					<text class="extra-value">{{ selectedOperator || '全部' }}</text>
				</view>
				</view>
		</filter-panel>
		
		<view class="filter-action-bar">
			<view class="action-btn ghost" @tap="resetFilters">重置</view>
			<view class="action-btn primary" @tap="generateReport">生成报表</view>
			</view>
		
		<!-- 精简统计 -->
		<view v-if="reportData" class="result-meta">
			<text class="meta-item">记录数：{{ reportData.totalRecords }}</text>
			<text class="meta-dot">•</text>
			<text class="meta-item">药品种类：{{ reportData.totalDrugs }}</text>
			<text class="meta-dot">•</text>
			<text class="meta-item">总数量：{{ reportData.totalQuantity }}</text>
			<text class="meta-dot">•</text>
			<text class="meta-item">总金额：¥{{ reportData.totalAmount }}</text>
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
			<view class="mock-btn" @tap="simulateInboundData">生成模拟入库数据</view>
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
import FilterPanel from '@/components/filter-panel/index.vue'

export default {
	components: {
		FilterPanel
	},
	data() {
		return {
			currentDate: '',
			reportData: null,
			
			// 筛选条件
			startDate: '',
			endDate: '',
			drugName: '',
			selectedSupplier: '',
			selectedOperator: '',
			selectedQuickFilter: 'month',
			
			// 选择器显示状态
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
	
	onLoad() {
		this.initPage()
	},
	
	methods: {
		onStartDateUpdate(val) {
			this.startDate = val
		},

		onEndDateUpdate(val) {
			this.endDate = val
		},

		onDateChange({ start, end }) {
			this.startDate = start || ''
			this.endDate = end || ''
			this.selectedQuickFilter = 'custom'
		},

		initPage() {
			const now = new Date()
			this.currentDate = this.formatDateTime(now)
			
			// 默认选择本月
			this.selectQuickFilter('month')
			
			// 自动生成报表
			this.generateReport()
		},
			
			// 批量模拟数据（今天/近7天/近30天/本月）
			async simulateRange(range = 'week') {
				const userInfo = uni.getStorageSync('userInfo') || { name: '测试用户', _id: 'tester' }
				const operators = ['张三','李四','王五','赵六', userInfo.name]
				const reviewers = ['复核A','复核B','复核C']
				const drugs = [
					{ id: 'd1', name: '布洛芬缓释胶囊', spec: '0.3g×20粒/盒', unit: '盒', m: 'XX药业', price: 16 },
					{ id: 'd2', name: '感冒灵颗粒', spec: '10g×10袋/盒', unit: '盒', m: 'YY药业', price: 12 },
					{ id: 'd3', name: '阿莫西林胶囊', spec: '0.25g×24粒/盒', unit: '盒', m: 'ZZ医药', price: 15 },
					{ id: 'd4', name: '维生素C片', spec: '0.1g×100片/瓶', unit: '瓶', m: '健益制药', price: 8 }
				]
				const suppliers = ['XX医药公司','YY药业','ZZ医药','健益制药']
				
				const today = new Date()
				let start = new Date(today)
				if (range === 'week') start.setDate(today.getDate() - 6)
				else if (range === 'month') start = new Date(today.getFullYear(), today.getMonth(), 1)
				else if (range === '30') start.setDate(today.getDate() - 29)
				
				const records = []
				for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
					const count = 1 + Math.floor(Math.random() * 3)
					for (let i = 0; i < count; i++) {
						const op = operators[Math.floor(Math.random()*operators.length)]
						const rv = reviewers[Math.floor(Math.random()*reviewers.length)]
						const rNo = `SIM${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}${String(i+1).padStart(2,'0')}`
						const itemCount = 1 + Math.floor(Math.random()*3)
						const items = []
						for (let j = 0; j < itemCount; j++) {
							const dd = drugs[Math.floor(Math.random()*drugs.length)]
							items.push({
								drugId: dd.id,
								drugName: dd.name,
								specification: dd.spec,
								unit: dd.unit,
								manufacturer: dd.m,
								batch: `B${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}`,
								expireDate: `${d.getFullYear()+1}-12-31`,
								quantity: 10 + Math.floor(Math.random()*30),
								price: dd.price
							})
						}
						records.push({
							recordNo: rNo,
							supplier: suppliers[Math.floor(Math.random()*suppliers.length)],
							operator: op,
							operatorId: op,
							operatorSign: `签名-${op}`,
							operatorSignTime: d.toISOString(),
							reviewer: rv,
							reviewerId: rv,
							reviewerSign: `签名-${rv}`,
							reviewerSignTime: d.toISOString(),
							createTime: d.toISOString(),
							completeTime: d.toISOString(),
							status: 'completed',
							items
						})
					}
				}
				try {
					uni.showLoading({ title: '生成模拟数据...', mask: true })
					await this.$api.callFunction('inRecords', { action: 'simulateBulk', data: { records } })
					uni.hideLoading()
					uni.showToast({ title: '已生成', icon: 'success' })
					this.generateReport()
				} catch (e) {
					uni.hideLoading()
					uni.showToast({ title: '生成失败', icon: 'none' })
				}
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
				case 'week': {
					const weekStart = new Date(today)
					weekStart.setDate(today.getDate() - today.getDay())
					this.startDate = this.formatDate(weekStart)
					this.endDate = this.formatDate(today)
					break
				}
				case 'month': {
					const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
					this.startDate = this.formatDate(monthStart)
					this.endDate = this.formatDate(today)
					break
				}
				case 'quarter': {
					const quarter = Math.floor(today.getMonth() / 3)
					const quarterStart = new Date(today.getFullYear(), quarter * 3, 1)
					this.startDate = this.formatDate(quarterStart)
					this.endDate = this.formatDate(today)
					break
				}
				case 'year': {
					const yearStart = new Date(today.getFullYear(), 0, 1)
					this.startDate = this.formatDate(yearStart)
					this.endDate = this.formatDate(today)
					break
				}
				case 'custom':
					// 自定义区间由日期选择回调控制
					break
			}
			if (value !== 'custom') {
				this.generateReport()
			}
		},
		
		confirmSupplier() {
			this.showSupplierPicker = false
		},
		
		confirmOperator() {
			this.showOperatorPicker = false
		},
		
		resetFilters() {
			this.drugName = ''
			this.selectedSupplier = ''
			this.selectedOperator = ''
			this.selectQuickFilter('month')
			this.generateReport()
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
						drugName: (this.drugName || '').trim(),
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
			if (!this.reportData) return
			// 表头：北京欢乐谷医务室药材入库表
			let csv = `北京欢乐谷医务室药材入库表\n`
			csv += `时间范围,${this.startDate}~${this.endDate}\n`
			csv += `入库单号,日期,供应商,操作人(签名),品种,数量,金额\n`
			this.reportData.records.forEach(r => {
				const sign = r.operatorSignText || r.operator || ''
				csv += `${r.recordNo},${this.formatDate(new Date(r.createTime))},${r.supplier || ''},${sign},${r.drugCount},${r.totalQuantity},${r.totalAmount}\n`
			})
			
			try {
				const fs = wx.getFileSystemManager()
				const filePath = `${wx.env.USER_DATA_PATH}/入库报表_${Date.now()}.csv`
				fs.writeFile({
					filePath, data: csv, encoding: 'utf8',
					success: () => wx.openDocument({ filePath, fileType: 'csv', showMenu: true })
				})
			} catch (e) {
				uni.setClipboardData({ data: csv, success: () => uni.showToast({ title: '已复制CSV文本', icon: 'success' }) })
			}
		},
		
		async exportPDF() {
			if (!this.reportData) return
			try {
				uni.showLoading({ title: '导出中...', mask: true })
				const res = await this.$api.callFunction('reports', {
					action: 'exportInboundPDF',
					data: {
						title: '北京欢乐谷医务室药材入库表',
						startDate: this.startDate,
						endDate: this.endDate,
						drugName: (this.drugName || '').trim(),
						supplier: this.selectedSupplier === '全部' ? '' : this.selectedSupplier,
						operator: this.selectedOperator === '全部' ? '' : this.selectedOperator
					}
				})
				uni.hideLoading()
				if (res && res.success && res.fileID) {
					const dl = await wx.cloud.downloadFile({ fileID: res.fileID })
					if (dl && dl.tempFilePath) {
						wx.openDocument({ filePath: dl.tempFilePath, fileType: 'pdf', showMenu: true })
					} else {
						uni.showToast({ title: '下载失败', icon: 'none' })
					}
				} else {
					uni.showToast({ title: '生成失败', icon: 'none' })
				}
			} catch (err) {
				uni.hideLoading()
				uni.showToast({ title: '导出失败', icon: 'none' })
			}
		},
		
		printReport() {
			uni.showToast({
				title: '打印功能开发中',
				icon: 'none'
			})
		},
		
		// 生成模拟数据（测试用：签名使用登录名文本）
		async simulateInboundData() {
			try {
				const userInfo = uni.getStorageSync('userInfo') || { name: '测试用户', _id: 'tester' }
				const now = new Date()
				const recordNo = `SIM${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${now.getTime().toString().slice(-4)}`
				await this.$api.callFunction('inRecords', {
					action: 'create',
					data: {
						recordNo,
						supplier: '模拟供应商',
						operator: userInfo.name,
						operatorId: userInfo._id,
						operatorSign: userInfo.name, // 测试时用登录名替代签名
						operatorSignTime: new Date(),
						status: 'completed',
						items: [
							{ drugId: 'd1', drugName: '布洛芬缓释胶囊', specification: '0.3g×20粒/盒', unit: '盒', manufacturer: 'XX药业', batch: 'B202501', expireDate: '2026-12-31', quantity: 20, price: 16 },
							{ drugId: 'd2', drugName: '感冒灵颗粒', specification: '10g×10袋/盒', unit: '盒', manufacturer: 'YY药业', batch: 'C202501', expireDate: '2026-06-30', quantity: 30, price: 12 }
						]
					}
				})
				uni.showToast({ title: '已生成模拟入库', icon: 'success' })
			} catch (e) {
				console.error(e)
				uni.showToast({ title: '生成失败', icon: 'none' })
			}
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
				byOperator: [
					{ operator: '张三', totalAmount: 23000 },
					{ operator: '李四', totalAmount: 18000 }
				],
				bySupplier: [
					{ supplier: 'XX医药公司', totalAmount: 21000 },
					{ supplier: 'YY药业', totalAmount: 16000 }
				],
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
.page-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 40rpx 30rpx 20rpx;
	margin: 0 0 10rpx;
	background: linear-gradient(120deg, #eef2ff 0%, #fdf2ff 100%);
}

.page-title {
		font-size: 40rpx;
		font-weight: bold;
	color: #111827;
	display: block;
}

.page-subtitle {
	font-size: 24rpx;
	color: #94a3b8;
	margin-top: 6rpx;
	text-transform: uppercase;
	letter-spacing: 2rpx;
}

.page-actions {
	display: flex;
	gap: 16rpx;
}

.header-btn {
	display: flex;
	align-items: center;
	gap: 6rpx;
	padding: 16rpx 26rpx;
	border-radius: 999rpx;
	border: 1rpx solid rgba(102,126,234,0.4);
	color: #4c1d95;
		font-size: 26rpx;
	background: #ffffff;
	
	&.primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #ffffff;
		border: none;
	}
}

.btn-icon {
	font-size: 28rpx;
}

.btn-text {
	font-size: 24rpx;
}

.result-meta {
	margin: 0 30rpx 20rpx;
	padding: 20rpx 24rpx;
	border-radius: 16rpx;
	background: #f8fafc;
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

// 统计汇总
.filter-panel-wrapper {
	margin: 0 30rpx 20rpx;
}

.filter-extra {
	margin-top: 14rpx;
			display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
			align-items: center;
}

.extra-item {
	flex: 1;
	min-width: 200rpx;
			background: #f7f8fa;
	padding: 18rpx 20rpx;
			border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.extra-item.selectable {
	border: 1rpx solid #e2e8f0;
}

.extra-label {
	font-size: 24rpx;
	color: #94a3b8;
}

.extra-input,
.extra-value {
				font-size: 28rpx;
	color: #1f2937;
	}
	
.filter-action-bar {
		display: flex;
	gap: 16rpx;
	margin: 0 30rpx 20rpx;
}
		
		.action-btn {
			flex: 1;
			height: 80rpx;
	border-radius: 999rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
	font-weight: 600;
}

.action-btn.ghost {
	background: #f8fafc;
	color: #475569;
	border: 1rpx solid #e2e8f0;
}

.action-btn.primary {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
	box-shadow: 0 6rpx 16rpx rgba(102, 126, 234, 0.25);
}

.summary-section,
.quick-stats {
	display: none;
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
	
	.mock-btn {
		margin-top: 20rpx;
		padding: 16rpx 24rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 12rpx;
		font-size: 26rpx;
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


