<template>
	<view class="page">
		<!-- 顶部标题 -->
		<view class="page-header">
			<text class="page-title">库存报表</text>
			<text class="page-subtitle">当前库存结构与风险总览</text>
		</view>
		
		<!-- 筛选区域 -->
		<view class="filter-card">
			<view class="filter-row">
				<view class="filter-item keyword-item">
					<text class="label">药材筛选</text>
					<view class="search-box">
						<text class="search-icon">🔍</text>
						<input
							class="search-input"
							placeholder="输入药材名称/规格/拼音"
							v-model.trim="keyword"
							confirm-type="search"
						/>
					</view>
				</view>
			</view>

			<view class="filter-row status-row">
				<view
					v-for="opt in statusOptions"
					:key="opt.value"
					class="status-pill"
					:class="{ active: activeStatus === opt.value }"
					@tap="onStatusChange(opt.value)"
				>
					<text class="status-text">{{ opt.label }}</text>
				</view>
			</view>

			<view class="filter-row actions-row">
				<view class="action-buttons">
					<button class="btn ghost" size="mini" @tap="onReset">重置</button>
					<button class="btn primary" size="mini" @tap="onQuery">刷新</button>
					<button class="btn export" size="mini" @tap="onExport">导出 ▾</button>
				</view>
			</view>
		</view>
		
		<!-- 概览卡片 -->
		<view class="summary-section">
				<view class="summary-card">
				<view class="summary-label">药材种类</view>
				<text class="summary-value">{{ summary.totalDrugs }}</text>
				<text class="summary-unit">种</text>
				</view>
				<view class="summary-card">
				<view class="summary-label">总库存数量</view>
				<text class="summary-value">{{ summary.totalQuantity }}</text>
				<text class="summary-unit">件</text>
				</view>
				<view class="summary-card warning">
				<view class="summary-label">库存预警药材</view>
				<text class="summary-value">{{ summary.warningCount }}</text>
				<text class="summary-unit">种</text>
			</view>
			<view class="summary-card danger">
				<view class="summary-label">近效期 / 已过期</view>
				<text class="summary-value">{{ summary.expiryRiskCount }}</text>
				<text class="summary-unit">批</text>
			</view>
		</view>
		
		<!-- 明细卡片列表 -->
		<view class="table-section">
			<scroll-view scroll-y class="table-body">
				<view 
					v-for="(item, index) in displayList"
					:key="item._id"
					class="detail-card"
				>
					<!-- 顶部：药名 + 序号 -->
					<view class="detail-row detail-row-top">
						<view class="detail-main-left">
							<text class="detail-drug">{{ item.drugName || '-' }}</text>
							<text class="detail-spec">{{ item.specification || '-' }}</text>
						</view>
						<text class="detail-no">#{{ index + 1 }}</text>
		</view>
		
					<!-- 数量 + 状态 -->
					<view class="detail-row detail-row-main">
						<view class="detail-main-left">
							<text class="meta-label">单位</text>
							<text class="meta-value">{{ item.unit || '-' }}</text>
		</view>
						<view class="detail-main-right">
							<text class="detail-qty">{{ item.quantity }}</text>
							<text class="detail-status" :class="'status-' + (item.statusTag || 'normal')">{{ item.statusText }}</text>
			</view>
		</view>
		
					<!-- 批号 -->
					<view class="detail-row detail-row-meta">
						<text class="meta-label">批号</text>
						<text class="meta-value mono">{{ item.batch || '-' }}</text>
					</view>

					<!-- 有效期 / 剩余天数 -->
					<view class="detail-row detail-row-meta">
						<text class="meta-label">有效期</text>
						<text class="meta-value">{{ item.expireDate || '-' }}</text>
						<text
							v-if="item.expireDaysText"
							class="expire-days"
							:class="'tag-' + (item.expireTag || 'normal')"
						>{{ item.expireDaysText }}</text>
					</view>
				</view>
			</scroll-view>
			</view>
	</view>
</template>

<script>
export default {
	name: 'ReportStock',
	data() {
		return {
			keyword: '',
			loading: false,
			activeStatus: 'all',
			statusOptions: [
				{ label: '全部', value: 'all' },
				{ label: '充足', value: 'normal' },
				{ label: '预警', value: 'warning' },
				{ label: '缺货', value: 'empty' },
				{ label: '近效期', value: 'near_expiry' },
				{ label: '已过期', value: 'expired' }
			],
			// 概览统计（从云函数返回的数据计算）
			summary: {
				totalDrugs: 0,
				totalQuantity: 0,
				warningCount: 0,
				expiryRiskCount: 0
			},
			// 明细列表（按药材+批次/有效期粒度）
			rows: [],
			// 当前登录用户，用于导出文件时标记制表人
			userInfo: uni.getStorageSync('userInfo') || {}
		}
	},
	computed: {
		displayList() {
			let list = this.rows
			const kw = (this.keyword || '').toLowerCase()
			if (kw) {
				list = list.filter(item => {
					const name = (item.drugName || '').toLowerCase()
					const spec = (item.specification || '').toLowerCase()
					return name.includes(kw) || spec.includes(kw)
				})
			}
			if (this.activeStatus === 'all') return list
			if (this.activeStatus === 'near_expiry') {
				return list.filter(i => i.expireTag === 'near')
			}
			if (this.activeStatus === 'expired') {
				return list.filter(i => i.expireTag === 'expired')
			}
			if (this.activeStatus === 'normal') {
				return list.filter(i => i.statusTag === 'normal')
			}
			if (this.activeStatus === 'warning') {
				return list.filter(i => i.statusTag === 'warning')
			}
			if (this.activeStatus === 'empty') {
				return list.filter(i => i.statusTag === 'empty')
			}
			return list
		}
	},
	created() {
		this.fetchReport()
	},
	methods: {
		buildPayload() {
			// 将前端的状态筛选转换为后端 stockReport 可识别的参数
			let stockFilter = 'all'
			let expiryFilter = 'all'
			switch (this.activeStatus) {
				case 'normal':
					stockFilter = 'sufficient'
					break
				case 'warning':
					stockFilter = 'warning'
					break
				case 'empty':
					stockFilter = 'empty'
					break
				case 'near_expiry':
					expiryFilter = 'expiring3'
					break
				case 'expired':
					expiryFilter = 'expired'
					break
				default:
					break
			}
			return {
				stockFilter,
				expiryFilter
			}
		},
		async fetchReport() {
			this.loading = true
			try {
				const payload = this.buildPayload()
				const res = await this.$api.callFunction('reports', {
					action: 'stockReport',
					data: payload
				})
				if (res && res.success && res.data) {
					const { statistics = {}, items = [] } = res.data
					// 顶部概览数字映射
					this.summary = {
						totalDrugs: statistics.totalDrugs || 0,
						totalQuantity: statistics.totalStock || 0,
						warningCount: statistics.lowStockCount || 0,
						expiryRiskCount: statistics.expiringCount || 0
					}
					// 明细行：计算状态与有效期标签
					const today = new Date()
					this.rows = (items || []).map(raw => {
						const item = { ...raw }
						const qty = item.quantity || 0
						const min = item.minStock || item.reorderLevel || 10
						if (qty <= 0) {
							item.statusTag = 'empty'
							item.statusText = '缺货'
						} else if (qty <= min) {
							item.statusTag = 'warning'
							item.statusText = '预警'
						} else {
							item.statusTag = 'normal'
							item.statusText = '充足'
						}
						if (item.expireDate) {
							const d = new Date(item.expireDate)
							if (!Number.isNaN(d.getTime())) {
								const diffDays = Math.floor((d.getTime() - today.getTime()) / 86400000)
								item.expireDays = diffDays
								if (diffDays < 0) {
									item.expireTag = 'expired'
									item.expireDaysText = `已过期 ${Math.abs(diffDays)} 天`
								} else if (diffDays <= 90) {
									item.expireTag = 'near'
									item.expireDaysText = `剩余 ${diffDays} 天`
								} else {
									item.expireTag = 'normal'
									item.expireDaysText = `剩余 ${diffDays} 天`
								}
							}
						}
						return item
					})
				} else {
					this.rows = []
					this.summary = {
						totalDrugs: 0,
						totalQuantity: 0,
						warningCount: 0,
						expiryRiskCount: 0
					}
				}
			} catch (e) {
				console.error('加载库存报表失败:', e)
				uni.showToast({ title: '加载失败', icon: 'none' })
			} finally {
				this.loading = false
			}
		},
		onStatusChange(val) {
			this.activeStatus = val
			this.fetchReport()
		},
		onReset() {
			this.keyword = ''
			this.activeStatus = 'all'
			this.fetchReport()
		},
		onQuery() {
			this.fetchReport()
		},
		onExport() {
			if (!this.rows.length) {
				uni.showToast({ title: '暂无数据可导出', icon: 'none' })
				return
			}
			uni.showActionSheet({
				itemList: ['导出 Excel', '导出 PDF'],
				success: res => {
					if (res.tapIndex === 0) {
						this.exportExcel()
					} else if (res.tapIndex === 1) {
						this.exportPDF()
					}
				}
			})
		},
		async exportExcel() {
			try {
				uni.showLoading({ title: '生成Excel...', mask: true })
				const payload = this.buildPayload()
				const res = await this.$api.callFunction('reports', {
					action: 'exportStockExcel',
					data: {
						...payload,
						printUser: this.userInfo && this.userInfo.name ? this.userInfo.name : ''
					}
				})
				uni.hideLoading()
				if (res && res.success && res.fileID) {
					// 云函数返回的 filename 可选，这里优先用
					let filename = res.filename || ''
					if (!filename && res.fileID) {
						const parts = String(res.fileID).split('/')
						filename = parts[parts.length - 1] || `stock_${+new Date()}.xlsx`
					}
					const urlRes = await wx.cloud.getTempFileURL({ fileList: [res.fileID] })
					const fileUrl = urlRes && urlRes.fileList && urlRes.fileList[0] && urlRes.fileList[0].tempFileURL
					if (fileUrl) {
						this.downloadAndSaveLocal(fileUrl, filename, 'Excel')
					} else {
						uni.showToast({ title: '获取下载链接失败', icon: 'none' })
					}
				} else {
					uni.showToast({ title: '生成Excel失败', icon: 'none' })
				}
			} catch (e) {
				uni.hideLoading()
				console.error('导出库存Excel失败:', e)
				uni.showToast({ title: '导出失败', icon: 'none' })
			}
		},
		async exportPDF() {
			try {
				uni.showLoading({ title: '生成PDF...', mask: true })
				const payload = this.buildPayload()
				const res = await this.$api.callFunction('reports', {
					action: 'exportStockPDF',
					data: {
						...payload,
						printUser: this.userInfo && this.userInfo.name ? this.userInfo.name : ''
					}
				})
				uni.hideLoading()
				if (res && res.success && res.fileID) {
					let filename = ''
					if (res.fileID) {
						const parts = String(res.fileID).split('/')
						filename = parts[parts.length - 1] || `stock_${+new Date()}.pdf`
					}
					const urlRes = await wx.cloud.getTempFileURL({ fileList: [res.fileID] })
					const fileUrl = urlRes && urlRes.fileList && urlRes.fileList[0] && urlRes.fileList[0].tempFileURL
					if (fileUrl) {
						this.downloadAndSaveLocal(fileUrl, filename, 'PDF')
					} else {
						uni.showToast({ title: '获取下载链接失败', icon: 'none' })
					}
				} else {
					uni.showToast({ title: '生成PDF失败', icon: 'none' })
				}
			} catch (e) {
				uni.hideLoading()
				console.error('导出库存PDF失败:', e)
				uni.showToast({ title: '导出失败', icon: 'none' })
			}
		},
		// 通用：下载并保存到本地“我的文件”，与入库报表保持一致体验
		downloadAndSaveLocal(fileUrl, filename, fileType) {
			const fs = wx.getFileSystemManager()
			const folder = `${wx.env.USER_DATA_PATH}`
			const savePath = `${folder}/${filename}`
			try {
				fs.mkdirSync(folder, true)
			} catch (e) {}
			uni.downloadFile({
				url: fileUrl,
				success: (res) => {
					if (res.statusCode === 200) {
						fs.saveFile({
							tempFilePath: res.tempFilePath,
							filePath: savePath,
							success: () => {
								const lower = (filename || '').toLowerCase()
								let fileTypeExt = 'xlsx'
								if (lower.endsWith('.pdf')) fileTypeExt = 'pdf'
								wx.openDocument({
									filePath: savePath,
									fileType: fileTypeExt,
									showMenu: true,
									fail: () => {
										uni.showModal({
											title: `${fileType}文件已保存`,
											content: `文件已保存到：微信-我-服务-小程序-我的文件/${filename}\n\n请前往微信-我-服务-小程序-我的文件 查看、分享或导出。`,
											showCancel: false,
											confirmText: '知道了'
										})
									}
								})
							},
							fail: () => {
								uni.showToast({ title: '保存失败', icon: 'none' })
							}
						})
					} else {
						uni.showToast({ title: '下载失败', icon: 'none' })
					}
				},
				fail: () => {
					uni.showToast({ title: '文件下载失败', icon: 'none' })
				}
			})
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	/* 与入/出库报表统一的蓝色渐变背景 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding: 24rpx 24rpx 140rpx;
}

.page-header {
	/* 顶部标题卡片：象牙白圆角卡片，702rpx 轨道 */
	max-width: 702rpx;
	margin: 10rpx auto 8rpx;
	padding: 22rpx 22rpx 20rpx;
	background: #fffff0;
	border-radius: 22rpx;
	box-shadow:
		0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
		0 -1rpx 0 rgba(15, 23, 42, 0.06) inset,
		0 18rpx 40rpx rgba(15, 23, 42, 0.14);
	text-align: center;
}

.page-title {
	display: inline-block;
	font-size: 36rpx;
	font-weight: 700;
	color: #111827;
}

.page-subtitle {
	display: block;
	margin-top: 6rpx;
	font-size: 24rpx;
	color: #6b7280;
}

.filter-card {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 16rpx 18rpx 10rpx;
	background: #fffff0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}
	
	.filter-row {
		display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 8rpx;
}

.filter-row:last-child {
			margin-bottom: 0;
		}
		
		.filter-item {
			flex: 1;
}

.label {
	display: block;
	font-size: 24rpx;
	color: #6b7280;
	margin-bottom: 4rpx;
}

.search-box {
			display: flex;
			align-items: center;
	padding: 8rpx 14rpx;
	border-radius: 999rpx;
	background: #f3f4f6;
}

.search-icon {
	font-size: 24rpx;
	color: #9ca3af;
	margin-right: 8rpx;
}

.search-input {
				flex: 1;
	font-size: 24rpx;
	color: #111827;
}

.status-row {
	margin-top: 10rpx;
	flex-wrap: wrap;
	justify-content: flex-start;
}

.status-pill {
	padding: 10rpx 18rpx;
	border-radius: 999rpx;
	background: #f3f4f6;
	margin-right: 10rpx;
	margin-bottom: 8rpx;
}

.status-pill.active {
	background: #4f46e5;
}

.status-pill.active .status-text {
	color: #ffffff;
}

.status-text {
	font-size: 24rpx;
	color: #4b5563;
}

.actions-row {
	justify-content: space-between;
	margin-top: 6rpx;
}

.hint-text {
	font-size: 22rpx;
	color: #9ca3af;
	flex: 1;
	padding-right: 16rpx;
}

.action-buttons {
		display: flex;
	flex-direction: row;
	align-items: center;
	gap: 10rpx;
}

.btn {
	font-size: 22rpx;
	padding: 0 14rpx;
	border-radius: 999rpx;
			display: flex;
			align-items: center;
			justify-content: center;
	height: 56rpx;
	line-height: 56rpx;
}

.btn.ghost {
	background: #ffffff;
	color: #4f46e5;
	border: 1rpx solid #c7d2fe;
}

.btn.primary {
	background: linear-gradient(135deg, #4f46e5, #7c3aed);
	color: #ffffff;
	border: none;
}

.btn.export {
	background: #fff7ed;
	color: #ea580c;
	border: 1rpx solid #fed7aa;
}

.summary-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 18rpx 18rpx 14rpx;
	background: #fffff0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 8rpx;
}

		
		.summary-card {
	background: #ffffff;
	border-radius: 18rpx;
	padding: 16rpx 14rpx 12rpx;
	box-shadow: none;
			display: flex;
			flex-direction: column;
			align-items: center;
	justify-content: center;
	text-align: center;
}

.summary-card.warning {
	border-left: 4rpx solid #f59e0b;
}

.summary-card.danger {
	border-left: 4rpx solid #ef4444;
			}
			
			.summary-label {
				font-size: 24rpx;
	color: #6b7280;
	margin-bottom: 6rpx;
}

.summary-value {
	font-size: 32rpx;
	font-weight: 700;
	color: #111827;
}

.summary-unit {
	margin-left: 4rpx;
	font-size: 24rpx;
	color: #6b7280;
}

.table-section {
	margin: 0 auto 20rpx;
	max-width: 702rpx;
	padding-bottom: 8rpx;
	background: transparent;
}
	
	.table-header {
		display: flex;
	align-items: center;
	padding: 16rpx 10rpx;
	background: #f9fafb;
	border-bottom: 1rpx solid #e5e7eb;
 	font-size: 22rpx;
 	color: #4b5563;
 	font-weight: 600;
	}
	
	.table-body {
		max-height: 800rpx;
}
		
		.table-row {
			display: flex;
			align-items: center;
	padding: 14rpx 10rpx;
	font-size: 22rpx;
	color: #111827;
	border-bottom: 1rpx solid #f1f5f9;
}

.table-row:last-child {
				border-bottom: none;
			}
			
			.col {
	padding: 0 4rpx;
}

.w-no {
	width: 70rpx;
				text-align: center;
}

.w-name {
	flex: 1.2;
}

.w-spec {
	flex: 1.1;
}

.w-unit {
	width: 80rpx;
}

.w-batch {
	flex: 0.9;
}

.w-qty {
	width: 90rpx;
	text-align: right;
}

.w-status {
	width: 110rpx;
}

.w-expire {
	flex: 1.4;
}

.expire-cell {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.expire-date {
	font-size: 24rpx;
	color: #111827;
}

.expire-days {
	font-size: 22rpx;
}

.tag-normal {
	color: #16a34a;
}

.tag-near {
	color: #f97316;
}

.tag-expired {
	color: #ef4444;
}

.status-normal {
	color: #16a34a;
}

.status-warning {
	color: #f59e0b;
}

.status-empty {
	color: #ef4444;
}

/* 明细卡片样式：与出入库报表统一风格 */
.detail-card {
	background: #fffff0;
	border-radius: 18rpx;
	padding: 22rpx 24rpx 18rpx;
	margin: 0 0 14rpx;
	box-shadow: 0 8rpx 22rpx rgba(15, 23, 42, 0.16);
	border: 1rpx solid #e5e7eb;
}

.detail-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	margin-top: 6rpx;
}

.detail-row-top {
	margin-bottom: 6rpx;
}

.detail-no {
	font-size: 24rpx;
	color: #6b7280;
}

.detail-main-left {
	flex: 1;
	margin-right: 12rpx;
	display: flex;
	flex-direction: column;
}

.detail-drug {
			font-size: 28rpx;
	font-weight: 600;
	color: #111827;
}

.detail-spec {
	margin-top: 4rpx;
	font-size: 24rpx;
	color: #6b7280;
}

.detail-main-right {
	min-width: 150rpx;
	text-align: right;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.detail-qty {
	font-size: 26rpx;
	font-weight: 600;
	color: #2563eb;
}

.detail-status {
	margin-top: 2rpx;
	font-size: 22rpx;
}

.detail-row-meta {
	font-size: 22rpx;
	color: #4b5563;
}

.meta-label {
	color: #9ca3af;
	margin-right: 6rpx;
}

.meta-value {
	margin-right: 20rpx;
}

.meta-value.mono {
	font-family: 'DIN Alternate', 'Courier New', monospace;
}
</style>
