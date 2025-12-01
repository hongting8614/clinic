<template>
	<view class="container">
		<!-- 顶部标题卡片 -->
		<view class="page-header">
			<view class="header-left">
				<text class="page-title">库存盘点</text>
				<text class="page-subtitle">定期盘点，确保账实一致</text>
			</view>
			<view class="page-actions">
				<view class="header-btn ghost" @tap="onQuery">
					<text class="btn-text">查询</text>
				</view>
				<view class="header-btn ghost" @tap="exportInventorySummary">
					<text class="btn-text">导出</text>
				</view>
				<view class="header-btn primary" @tap="onCreate">
					<text class="btn-text">新建盘点单</text>
				</view>
			</view>
		</view>

		<!-- 筛选区域：状态 + 园区 -->
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
					v-for="tab in locationTabs"
					:key="tab.value"
					:class="['filter-chip', { active: activeLocation === tab.value }]"
					@tap="selectLocation(tab.value)"
				>
					{{ tab.label }}
				</view>
			</view>
		</view>

		<!-- 盘点单列表 -->
		<view class="list-section">
			<view
				v-for="item in filteredList"
				:key="item.id"
				class="inventory-card"
				@tap="goDetail(item.id)"
			>
				<view class="card-header">
					<text class="record-no">{{ item.recordNo }}</text>
					<text :class="['status-tag', 'status-' + item.status]">{{ renderStatus(item.status) }}</text>
				</view>
				<view class="card-body">
					<view class="info-row">
						<text class="label">盘点人：</text>
						<text class="value">{{ item.operator || '-' }}</text>
					</view>
					<view class="info-row">
						<text class="label">盘点时间：</text>
						<text class="value">{{ formatDateTime(item.createTime) }}</text>
					</view>
					<view class="info-row">
						<text class="label">涉及药材：</text>
						<text class="value">{{ item.drugCount }} 种</text>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-if="filteredList.length === 0" class="empty-state">
				<text class="empty-icon">📋</text>
				<text class="empty-text">暂无盘点记录</text>
				<text class="empty-hint">可点击上方“新建盘点单”开始首次盘点</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'InventoryList',
	data() {
		return {
			statusTabs: [
				{ label: '全部', value: 'all' },
				{ label: '草稿', value: 'draft' },
				{ label: '进行中', value: 'in_progress' },
				{ label: '已完成', value: 'completed' }
			],
			locationTabs: [
				{ label: '库存', value: 'all' },
				{ label: '陆园', value: 'land_park' },
				{ label: '水园', value: 'water_park' }
			],
			activeStatus: 'all',
			activeLocation: 'all',
			inventoryList: []
		}
	},
	computed: {
		filteredList() {
			return this.inventoryList.filter(item => {
				const matchStatus = this.activeStatus === 'all' || item.status === this.activeStatus
				// 库存：只看总库存盘点单（location 为空或为 'all'）
				let matchLocation = true
				if (this.activeLocation === 'all') {
					matchLocation = !item.location || item.location === 'all'
				} else {
					matchLocation = item.location === this.activeLocation
				}
				return matchStatus && matchLocation
			})
		}
	},
	onLoad() {
		this.loadInventoryList()
	},
	onShow() {
		// 每次返回列表时刷新一次，保证看到最新盘点记录
		this.loadInventoryList()
	},
	methods: {
		onQuery() {
			// 按当前筛选条件重新加载盘点列表
			this.loadInventoryList()
		},
		async loadInventoryList() {
			try {
				const db = wx.cloud.database()
				const res = await db
					.collection('inventory')
					.orderBy('createTime', 'desc')
					.get()
				// 将 _id 映射到本地使用的 id 字段
				this.inventoryList = (res.data || []).map(item => ({
					id: item._id,
					recordNo: item.recordNo,
					status: item.status,
					operator: item.operator,
					createTime: item.createTime,
					location: item.location || 'all',
					drugCount: Array.isArray(item.details) ? item.details.length : 0
				}))
			} catch (e) {
				console.error('加载盘点列表失败', e)
				uni.showToast({ title: '加载盘点列表失败', icon: 'none' })
			}
		},
		exportInventorySummary() {
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
							location: this.activeLocation,
							export: exportType
						}
						const resFn = await this.$api.callFunction('reports', {
							action: 'inventorySummaryReport',
							data: payload
						})
						uni.hideLoading()
						if (resFn && resFn.success) {
							// 处理文件下载并打开
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
									filename = parts[parts.length - 1] || `inventory_summary_${Date.now()}.${exportType === 'pdf' ? 'pdf' : 'xlsx'}`
								}
								if (fileUrl) {
									this.downloadAndSaveLocal(fileUrl, filename, exportType === 'pdf' ? 'PDF' : 'Excel')
								} else {
									uni.showToast({ title: '获取下载链接失败', icon: 'none' })
								}
							} catch (e) {
								console.error('获取盘点汇总下载链接失败', e)
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
						console.error('导出盘点汇总失败', e)
						uni.showToast({ title: '导出失败', icon: 'none' })
					}
				}
			})
		},
		// 复用出库报表的本地保存与打开逻辑
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
		},
		selectStatus(value) {
			this.activeStatus = value
		},
		selectLocation(value) {
			this.activeLocation = value
		},
		onRefresh() {
			// 预留：后续可调用云函数刷新列表
			uni.showToast({ title: '刷新成功', icon: 'none' })
		},
		onCreate() {
			// 跳转到新建盘点单详情页（暂不带 id，视为新建）
			uni.navigateTo({
				url: '/pages-sub/inventory/detail'
			})
		},
		goDetail(id) {
			// 跳转到指定盘点单详情页，后续可根据 id 加载真实数据
			if (!id) {
				uni.navigateTo({ url: '/pages-sub/inventory/detail' })
				return
			}
			uni.navigateTo({
				url: `/pages-sub/inventory/detail?id=${id}`
			})
		},
		renderStatus(status) {
			const map = {
				all: '全部',
				draft: '草稿',
				in_progress: '进行中',
				completed: '已完成'
			}
			return map[status] || status
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
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	/* 使用与首页/门诊/药材工作台一致的蓝色渐变背景 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding: 24rpx 24rpx 40rpx;
}

.page-header {
	/* 顶部标题卡片：象牙白圆角卡片，宽度与其它工作台 header-card 对齐 */
	max-width: 702rpx;
	margin: 10rpx auto 8rpx;
	padding: 20rpx 22rpx 18rpx;
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
	border-width: 1rpx;
	border-style: solid;

	&.primary {
		background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
		border-color: transparent;
		color: #ffffff;
		box-shadow: 0 6rpx 16rpx rgba(0, 160, 255, 0.25);
	}

	&.ghost {
		background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
		border-color: transparent;
		color: #ffffff;
		box-shadow: 0 6rpx 16rpx rgba(0, 160, 255, 0.25);
	}
}

.btn-text {
	font-size: 24rpx;
}

.filter-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 16rpx 18rpx 10rpx;
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
		box-shadow: 0 6rpx 16rpx rgba(0, 160, 255, 0.3);
	}
}

.list-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
}

.inventory-card {
	background: #FFFFF0;
	border-radius: 20rpx;
	padding: 22rpx 22rpx 18rpx;
	margin-bottom: 8rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
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
	color: #ffffff;

	&.status-draft {
		background: #9ca3af;
	}
	&.status-in_progress {
		background: #f59e0b;
	}
	&.status-completed {
		background: #22c55e;
	}
}

.card-body {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.info-row {
	font-size: 24rpx;
	color: #4b5563;
}

.label {
	color: #9ca3af;
}

.value {
	color: #111827;
}

.empty-state {
	padding: 120rpx 0 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #9ca3af;
}

.empty-icon {
	font-size: 80rpx;
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

// 导出盘点汇总按钮区域
.export-section {
	max-width: 702rpx;
	margin: 0 auto 24rpx;
}

.export-btn {
	background: #FFFFF0;
	border-radius: 20rpx;
	padding: 18rpx 22rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.export-icon {
	font-size: 28rpx;
	color: #4b5563;
}

.export-text {
	font-size: 26rpx;
	color: #111827;
}
</style>
