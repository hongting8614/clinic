<template>
	<view class="container">
		<!-- 顶部：园区切换 + 搜索 -->
		<view class="header-card">
			<view class="park-tabs">
				<view
					class="park-tab"
					:class="{ active: currentPark === 'land_park' }"
					@tap="setPark('land_park')"
				>
					陆园
				</view>
				<view
					class="park-tab"
					:class="{ active: currentPark === 'water_park' }"
					@tap="setPark('water_park')"
				>
					水园
				</view>
			</view>
			<view class="search-bar">
				<view class="search-input-wrapper">
					<text class="search-icon">🔍</text>
					<input
						class="search-input"
						v-model.trim="searchKeyword"
						placeholder="搜索药材名称"
						confirm-type="search"
						@confirm="loadList"
					/>
					<text v-if="searchKeyword" class="clear-icon" @tap="clearSearch">✕</text>
				</view>
			</view>
		</view>

		<!-- 列表 -->
		<view class="list-section">
			<view v-if="loading" class="loading">加载中...</view>
			<view
				v-for="item in stockList"
				:key="item._id"
				class="stock-card"
			>
				<view class="row-main">
					<view class="title-col">
						<text class="drug-name">{{ item.drugName }}</text>
						<text class="spec">{{ item.specification || item.spec || '-' }}</text>
					</view>
					<view class="qty-col">
						<text class="qty-text">{{ item.quantity }}{{ item.minUnit || item.unit || '' }}</text>
					</view>
				</view>
				<view class="row-sub">
					<text class="label">园区：</text>
					<text class="value">{{ renderLocation(item.location) }}</text>
				</view>
				<view class="row-sub">
					<text class="label">批号：</text>
					<text class="value">{{ item.batch || '-' }}</text>
				</view>
				<view class="row-sub">
					<text class="label">有效期：</text>
					<text class="value">{{ item.expireDate || '-' }}</text>
				</view>
				<view class="row-sub" v-if="item.manufacturer">
					<text class="label">厂家：</text>
					<text class="value">{{ item.manufacturer }}</text>
				</view>
			</view>

			<view v-if="!loading && stockList.length === 0" class="empty-state">
				<text class="empty-icon">📦</text>
				<text class="empty-text">该园区暂无库存药材</text>
			</view>
		</view>

		<!-- 导出 -->
		<view class="export-bar">
			<view class="export-btn" @tap="exportExcel">导出Excel</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentPark: 'land_park',
			searchKeyword: '',
			stockList: [],
			loading: false
		}
	},

	onLoad(options) {
		if (options && options.park && (options.park === 'land_park' || options.park === 'water_park')) {
			this.currentPark = options.park
		}
		this.loadList()
	},

	methods: {
		renderLocation(loc) {
			if (loc === 'land_park') return '陆园'
			if (loc === 'water_park') return '水园'
			return loc || ''
		},

		setPark(park) {
			if (this.currentPark === park) return
			this.currentPark = park
			this.loadList()
		},

		clearSearch() {
			this.searchKeyword = ''
			this.loadList()
		},

		async loadList() {
			this.loading = true
			try {
				const db = wx.cloud.database()
				const _ = db.command
				let where = {
					location: this.currentPark,
					quantity: _.gt(0)
				}
				if (this.searchKeyword) {
					where.drugName = db.RegExp({
						regexp: this.searchKeyword,
						options: 'i'
					})
				}
				const res = await db.collection('stock').where(where).get()
				const list = res.data || []
				this.stockList = list.map(s => ({
					...s,
					minUnit: s.minUnit || s.min_unit || '',
					packUnit: s.packUnit || s.unit || '',
					specification: s.specification || s.spec || ''
				}))
			} catch (e) {
				console.error('加载园区库存失败', e)
				uni.showToast({ title: '加载失败', icon: 'none' })
			} finally {
				this.loading = false
			}
		},

		async exportExcel() {
			try {
				uni.showLoading({ title: '生成报表...', mask: true })
				const res = await this.$api.callFunction('reports', {
					action: 'exportParkStockExcel',
					data: {
						location: this.currentPark,
						keyword: this.searchKeyword || ''
					}
				})
				uni.hideLoading()
				if (!res || !res.success || !res.fileID) {
					uni.showToast({ title: '导出失败', icon: 'none' })
					return
				}
				const fileID = res.fileID
				const urlRes = await wx.cloud.getTempFileURL({ fileList: [fileID] })
				const fileUrl = urlRes?.fileList?.[0]?.tempFileURL
				if (!fileUrl) {
					uni.showToast({ title: '获取下载链接失败', icon: 'none' })
					return
				}
				// 简单打开文档，保存位置由微信管理
				uni.downloadFile({
					url: fileUrl,
					success: (res) => {
						if (res.statusCode === 200) {
							wx.openDocument({
								filePath: res.tempFilePath,
								fileType: 'xlsx',
								showMenu: true
							})
						} else {
							uni.showToast({ title: '下载失败', icon: 'none' })
						}
					},
					fail: () => {
						uni.showToast({ title: '文件下载失败', icon: 'none' })
					}
				})
			} catch (e) {
				uni.hideLoading()
				console.error('导出园区库存失败', e)
				uni.showToast({ title: '导出失败', icon: 'none' })
			}
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

.header-card {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	padding: 18rpx 20rpx 16rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.park-tabs {
	display: flex;
	gap: 12rpx;
	margin-bottom: 12rpx;
}

.park-tab {
	flex: 1;
	text-align: center;
	padding: 14rpx 0;
	border-radius: 999rpx;
	font-size: 26rpx;
	background: #f3f4f6;
	color: #4b5563;
}

.park-tab.active {
	background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
	color: #ffffff;
	box-shadow: 0 6rpx 16rpx rgba(0, 160, 255, 0.25);
}

.search-bar {
	margin-top: 4rpx;
}

.search-input-wrapper {
	display: flex;
	align-items: center;
	background: #f3f4f6;
	border-radius: 999rpx;
	padding: 0 20rpx;
	height: 70rpx;
}

.search-icon {
	font-size: 30rpx;
	margin-right: 10rpx;
}

.search-input {
	flex: 1;
	font-size: 26rpx;
}

.clear-icon {
	font-size: 30rpx;
	color: #9ca3af;
	padding: 8rpx;
}

.list-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
}

.loading {
	text-align: center;
	padding: 40rpx 0;
	font-size: 26rpx;
	color: #9ca3af;
}

.stock-card {
	background: #FFFFF0;
	border-radius: 20rpx;
	padding: 18rpx 18rpx 14rpx;
	margin-bottom: 8rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.row-main {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8rpx;
}

.title-col {
	flex: 1;
	margin-right: 12rpx;
}

.drug-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #111827;
}

.spec {
	display: block;
	margin-top: 4rpx;
	font-size: 24rpx;
	color: #6b7280;
}

.qty-col {
	min-width: 140rpx;
	text-align: right;
}

.qty-text {
	font-size: 26rpx;
	font-weight: 600;
	color: #16a34a;
}

.row-sub {
	font-size: 24rpx;
	color: #4b5563;
	margin-top: 2rpx;
}

.label {
	color: #9ca3af;
}

.value {
	color: #111827;
}

.empty-state {
	padding: 100rpx 0 40rpx;
	text-align: center;
	color: #9ca3af;
}

.empty-icon {
	font-size: 80rpx;
	margin-bottom: 10rpx;
}

.empty-text {
	font-size: 28rpx;
}

.export-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 12rpx 30rpx 30rpx;
	background: #ffffff;
}

.export-btn {
	height: 72rpx;
	border-radius: 999rpx;
	background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
	color: #ffffff;
	font-size: 28rpx;
	font-weight: 500;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
