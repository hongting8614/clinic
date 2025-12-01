<template>
	<view class="container">
		<!-- 顶部标题卡片 -->
		<view class="page-header">
			<view class="header-left">
				<text class="page-title">库存调拨</text>
				<text class="page-subtitle">陆园与水园之间的药材调拨记录</text>
			</view>
			<view class="page-actions">
				<view class="header-btn ghost" @tap="onRefresh">
					<text class="btn-text">刷新</text>
				</view>
				<view class="header-btn primary" @tap="onCreate">
					<text class="btn-text">新建调拨单</text>
				</view>
			</view>
		</view>

		<!-- 筛选：状态 + 方向 -->
		<view class="filter-section">
			<view class="filter-row">
				<view
					v-for="tab in statusTabs"
					:key="tab.value"
					:class="['filter-chip', { active: activeStatus === tab.value }]"
					@tap="selectStatus(tab.value)"
				>
					{{ tab.label }}
				</view>
			</view>
			<view class="filter-row">
				<view
					v-for="tab in directionTabs"
					:key="tab.value"
					:class="['filter-chip', { active: activeDirection === tab.value }]"
					@tap="selectDirection(tab.value)"
				>
					{{ tab.label }}
				</view>
			</view>
		</view>

		<!-- 调拨单列表 -->
		<view class="list-section">
			<view
				v-for="item in filteredList"
				:key="item.id"
				class="transfer-card"
				@tap="goDetail(item.id)"
			>
				<view class="card-header">
					<text class="record-no">{{ item.transferNo }}</text>
					<text :class="['status-tag', 'status-' + item.status]">{{ renderStatus(item.status) }}</text>
				</view>
				<view class="card-body">
					<view class="info-row">
						<text class="label">调拨日期：</text>
						<text class="value">{{ formatDateTime(item.createTime) }}</text>
					</view>
					<view class="info-row">
						<text class="label">调拨方向：</text>
						<text class="value">{{ renderDirection(item.fromLocation, item.toLocation) }}</text>
					</view>
					<view class="info-row">
						<text class="label">调拨人：</text>
						<text class="value">{{ item.operator || '-' }}</text>
					</view>
					<view class="info-row">
						<text class="label">涉及药材：</text>
						<text class="value">{{ item.itemCount }} 条明细</text>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-if="filteredList.length === 0" class="empty-state">
				<text class="empty-icon">🚚</text>
				<text class="empty-text">暂无调拨记录</text>
				<text class="empty-hint">可点击上方“新建调拨单”发起陆园与水园之间的调拨</text>
			</view>
		</view>

		<!-- 导出调拨报表：北京欢乐谷医务室内药材调拔表 -->
		<view v-if="filteredList.length > 0" class="export-section">
			<view class="export-btn" @tap="exportTransferReport">
				<text class="export-icon">📄</text>
				<text class="export-text">导出药材调拨表</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'TransferList',
	data() {
		return {
			statusTabs: [
				{ label: '全部', value: 'all' },
				{ label: '草稿', value: 'draft' },
				{ label: '已完成', value: 'completed' }
			],
			directionTabs: [
				{ label: '全部方向', value: 'all' },
				{ label: '陆园 → 水园', value: 'land_to_water' },
				{ label: '水园 → 陆园', value: 'water_to_land' }
			],
			activeStatus: 'all',
			activeDirection: 'all',
			transferList: []
		}
	},
	computed: {
		filteredList() {
			return this.transferList.filter(item => {
				const matchStatus = this.activeStatus === 'all' || item.status === this.activeStatus
				let matchDirection = true
				if (this.activeDirection === 'land_to_water') {
					matchDirection = item.fromLocation === 'land_park' && item.toLocation === 'water_park'
				} else if (this.activeDirection === 'water_to_land') {
					matchDirection = item.fromLocation === 'water_park' && item.toLocation === 'land_park'
				}
				return matchStatus && matchDirection
			})
		}
	},
	onLoad() {
		this.loadTransferList()
	},
	onShow() {
		this.loadTransferList()
	},
	methods: {
		async loadTransferList() {
			try {
				const db = wx.cloud.database()
				const res = await db
					.collection('transfer')
					.orderBy('createTime', 'desc')
					.get()
				this.transferList = (res.data || []).map(item => ({
					id: item._id,
					transferNo: item.transferNo || item.recordNo || '',
					status: item.status || 'draft',
					operator: item.operator || '',
					createTime: item.createTime,
					fromLocation: item.fromLocation || '',
					toLocation: item.toLocation || '',
					itemCount: Array.isArray(item.items) ? item.items.length : 0
				}))
			} catch (e) {
				console.error('加载调拨列表失败', e)
				uni.showToast({ title: '加载调拨列表失败', icon: 'none' })
			}
		},
		selectStatus(value) {
			this.activeStatus = value
		},
		selectDirection(value) {
			this.activeDirection = value
		},
		onRefresh() {
			this.loadTransferList()
		},
		onCreate() {
			uni.navigateTo({ url: '/pages-sub/transfer/add' })
		},
		goDetail(id) {
			if (!id) {
				uni.navigateTo({ url: '/pages-sub/transfer/add' })
				return
			}
			uni.navigateTo({ url: `/pages-sub/transfer/add?id=${id}` })
		},
		renderStatus(status) {
			const map = {
				all: '全部',
				draft: '草稿',
				completed: '已完成'
			}
			return map[status] || status
		},
		renderDirection(from, to) {
			if (from === 'land_park' && to === 'water_park') return '陆园 → 水园'
			if (from === 'water_park' && to === 'land_park') return '水园 → 陆园'
			if (from && to) return `${from} → ${to}`
			return '—'
		},
		formatDateTime(dateStr) {
			if (!dateStr) return ''
			const d = new Date(dateStr)
			if (Number.isNaN(d.getTime())) return ''
			const y = d.getFullYear()
			const m = String(d.getMonth() + 1).padStart(2, '0')
			const day = String(d.getDate()).padStart(2, '0')
			const hh = String(d.getHours()).padStart(2, '0')
			const mm = String(d.getMinutes()).padStart(2, '0')
			return `${y}-${m}-${day} ${hh}:${mm}`
		},
		async exportTransferReport() {
			if (!this.filteredList.length) {
				uni.showToast({ title: '暂无数据可导出', icon: 'none' })
				return
			}
			uni.showActionSheet({
				itemList: ['导出 Excel', '导出 PDF'],
				success: async (res) => {
					const tapIndex = res.tapIndex
					const exportType = tapIndex === 1 ? 'pdf' : 'excel'
					try {
						uni.showLoading({ title: '生成报表...', mask: true })
						const payload = {
							status: this.activeStatus,
							direction: this.activeDirection,
							export: exportType
						}
						const resFn = await this.$api.callFunction('reports', {
							action: 'transferReport',
							data: payload
						})
						uni.hideLoading()
						if (resFn && resFn.success) {
							const fileID = resFn.fileID
							if (!fileID) {
								uni.showToast({ title: '未返回文件ID', icon: 'none' })
								return
							}
							try {
								const urlRes = await wx.cloud.getTempFileURL({ fileList: [fileID] })
								const fileUrl = urlRes && urlRes.fileList && urlRes.fileList[0] && urlRes.fileList[0].tempFileURL
								let filename = ''
								if (exportType === 'excel' && resFn.filename) {
									filename = resFn.filename
								} else {
									const parts = String(fileID).split('/')
									filename = parts[parts.length - 1] || `transfer_${Date.now()}.${exportType === 'pdf' ? 'pdf' : 'xlsx'}`
								}
								if (fileUrl) {
									this.downloadAndSaveLocal(fileUrl, filename, exportType === 'pdf' ? 'PDF' : 'Excel')
								} else {
									uni.showToast({ title: '获取下载链接失败', icon: 'none' })
								}
							} catch (err) {
								console.error('获取调拨报表下载链接失败', err)
								uni.showToast({ title: '获取下载链接失败', icon: 'none' })
							}
						} else {
							uni.showToast({
								title: (resFn && resFn.message) || '导出失败',
								icon: 'none'
							})
						}
					} catch (e) {
						uni.hideLoading()
						console.error('导出调拨报表失败', e)
						uni.showToast({ title: '导出失败', icon: 'none' })
					}
				}
			})
		},
		// 复用盘点/出库报表的本地保存与打开逻辑
		downloadAndSaveLocal(fileUrl, filename, fileTypeLabel) {
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
											title: `${fileTypeLabel}文件已保存`,
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

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	/* 统一蓝色渐变背景 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding: 24rpx 24rpx 120rpx;
}

.page-header {
	max-width: 702rpx;
	margin: 10rpx auto 8rpx;
	padding: 22rpx 22rpx 20rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow:
		0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
		0 -1rpx 0 rgba(15, 23, 42, 0.06) inset,
		0 18rpx 40rpx rgba(15, 23, 42, 0.14);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.header-left {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.page-title {
	font-size: 32rpx;
	font-weight: 650;
	color: #111827;
}

.page-subtitle {
	font-size: 24rpx;
	color: #6b7280;
}

.page-actions {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 12rpx;
}

.header-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10rpx 22rpx;
	border-radius: 999rpx;
	font-size: 24rpx;
	font-weight: 500;
	border: none;
	background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
	color: #ffffff;
	box-shadow: 0 6rpx 16rpx rgba(0, 160, 255, 0.25);

	&.primary {
		background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
	}

	&.ghost {
		background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
		box-shadow: 0 6rpx 16rpx rgba(37, 99, 235, 0.3);
	}
}

.btn-text {
	font-size: 24rpx;
}

.filter-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 16rpx 18rpx 12rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.filter-row {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 10rpx;
	margin-bottom: 8rpx;
}

.filter-chip {
	padding: 10rpx 22rpx;
	border-radius: 999rpx;
	background: #f3f4f6;
	font-size: 24rpx;
	color: #4b5563;

	&.active {
		background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
		color: #ffffff;
		box-shadow: 0 6rpx 14rpx rgba(0, 160, 255, 0.3);
	}
}

.list-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
}

.transfer-card {
	background: #FFFFF0;
	border-radius: 20rpx;
	padding: 18rpx 20rpx 16rpx;
	margin-bottom: 8rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 10rpx;
}

.record-no {
	font-size: 28rpx;
	font-weight: 600;
	color: #111827;
}

.status-tag {
	padding: 6rpx 16rpx;
	border-radius: 999rpx;
	font-size: 22rpx;
	font-weight: 500;
	background: #e5e7eb;
	color: #374151;

	&.status-draft {
		background: #fef3c7;
		color: #92400e;
	}
	&.status-completed {
		background: #dcfce7;
		color: #166534;
	}
}

.card-body {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.info-row {
	display: flex;
	flex-direction: row;
}

.label {
	font-size: 24rpx;
	color: #6b7280;
}

.value {
	font-size: 24rpx;
	color: #111827;
}

.empty-state {
	margin: 60rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.empty-icon {
	font-size: 42rpx;
	margin-bottom: 12rpx;
}

.empty-text {
	font-size: 30rpx;
	margin-bottom: 8rpx;
}

.empty-hint {
	font-size: 24rpx;
	color: #cbd5e1;
}

.export-section {
	max-width: 702rpx;
	margin: 0 auto 20rpx;
}

.export-btn {
	border-radius: 999rpx;
	padding: 18rpx 22rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
	color: #ffffff;
	box-shadow: 0 6rpx 16rpx rgba(0, 160, 255, 0.25);
}

.export-icon {
	font-size: 28rpx;
	color: #ffffff;
}

.export-text {
	font-size: 26rpx;
	color: #ffffff;
}
</style>
