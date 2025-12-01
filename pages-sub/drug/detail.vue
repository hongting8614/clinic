<template>
	<view class="page">
		<!-- 顶部标题卡：药材名称 + 标签 -->
		<view class="page-header" v-if="drug">
			<view class="title-row">
				<text class="drug-name">{{ drug.name }}</text>
				<view class="tag-group">
					<text v-if="drug.isHighValue" class="pill pill-high">高值</text>
					<text v-if="drug.isEmergency" class="pill pill-emergency">急救</text>
				</view>
			</view>
			<text class="drug-spec">{{ drug.spec || '未填写规格' }}</text>
			<text class="drug-sub">编码：{{ drug.barcode || '未填写条形码' }}</text>
		</view>

		<!-- 基本信息卡 -->
		<view class="info-card" v-if="drug">
			<view class="card-title-row">
				<text class="card-title">基础信息</text>
			</view>
			<view class="info-row">
				<text class="info-label">名称</text>
				<text class="info-value">{{ drug.name }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">规格</text>
				<text class="info-value">{{ drug.spec || '-' }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">单位</text>
				<text class="info-value">{{ drug.unit || '-' }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">厂家</text>
				<text class="info-value">{{ drug.manufacturer || '-' }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">分类</text>
				<text class="info-value">{{ drug.category || '未分类' }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">条形码</text>
				<text class="info-value">{{ drug.barcode || '-' }}</text>
			</view>
		</view>

		<!-- 库存与风险摘要（占位数据，后续可接后端） -->
		<view class="summary-card">
			<view class="card-title-row">
				<text class="card-title">库存与风险</text>
			</view>
			<view class="summary-grid">
				<view class="summary-item">
					<text class="summary-label">当前总库存</text>
					<text class="summary-value">{{ mockStock.total }}{{ drug.unit || '' }}</text>
				</view>
				<view class="summary-item">
					<text class="summary-label">安全库存</text>
					<text class="summary-value">{{ mockStock.safe }}{{ drug.unit || '' }}</text>
				</view>
				<view class="summary-item">
					<text class="summary-label">近效期批次</text>
					<text class="summary-value warning">{{ mockStock.nearExpiry }}</text>
				</view>
				<view class="summary-item">
					<text class="summary-label">已过期批次</text>
					<text class="summary-value danger">{{ mockStock.expired }}</text>
				</view>
			</view>
		</view>

		<!-- 操作区：编辑 & 相关报表 -->
		<view class="actions-card" v-if="drug">
			<view class="card-title-row">
				<text class="card-title">操作</text>
			</view>
			<view class="actions-row">
				<button class="action-btn primary" @tap="goEdit">编辑药材资料</button>
			</view>
			<view class="actions-row">
				<button class="action-btn" @tap="goInboundReport">查看入库记录</button>
				<button class="action-btn" @tap="goOutboundReport">查看出库记录</button>
			</view>
			<view class="actions-row">
				<button class="action-btn" @tap="goStockReport">查看库存分布</button>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-if="!drug" class="empty-state">
			<text class="empty-text">未找到药材信息</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'DrugDetail',
	data() {
		return {
			id: '',
			drug: null,
			mockStock: {
				total: 0,
				safe: 0,
				nearExpiry: 0,
				expired: 0
			}
		}
	},
	onLoad(options) {
		this.id = options.id || ''
		if (this.id) {
			this.loadDrugDetail(options)
		} else {
			// 没有 id 时退回占位逻辑，避免页面空白
			this.initFromListMock(options)
		}
	},
	methods: {
		async loadDrugDetail(options = {}) {
			try {
				uni.showLoading({ title: '加载中...' })
				const res = await wx.cloud.callFunction({
					name: 'drugManage',
					data: {
						action: 'getDetail',
						_id: this.id
					}
				})
				if (res && res.result && res.result.success && res.result.data) {
					const d = res.result.data
					this.drug = {
						_id: d._id,
						name: d.drugName || d.name || '未命名药材',
						spec: d.specification || d.spec || '',
						unit: d.packUnit || d.unit || '',
						manufacturer: d.manufacturer || '',
						category: d.category || '',
						barcode: d.barcode || '',
						isHighValue: !!d.isHighValue,
						isEmergency: !!d.isEmergency
					}
					// 根据主数据中的库存策略填充概要（占位为主，不改真实库存）
					this.mockStock = {
						total: Number(d.currentStock || 0),
						safe: Number(d.safeStock || 0),
						nearExpiry: Number(d.nearExpiryCount || 0),
						expired: Number(d.expiredCount || 0)
					}
					return
				}
				// 接口未返回有效数据时，退回占位逻辑
				this.initFromListMock(options)
			} catch (e) {
				console.error('加载药材详情失败', e)
				uni.showToast({ title: '加载药材详情失败', icon: 'none' })
				this.initFromListMock(options)
			} finally {
				uni.hideLoading()
			}
		},
		
		initFromListMock(options) {
			// 简单根据传入的 id 和可能的 query 构造一份占位数据，后续可改成真实接口
			// 这里优先从上一个页面传递的 query 中还原关键字段
			const name = options.name || '示例药材'
			this.drug = {
				_id: this.id,
				name,
				spec: options.spec || '',
				unit: options.unit || '',
				manufacturer: options.manufacturer || '',
				category: options.category || '',
				barcode: options.barcode || '',
				isHighValue: options.isHighValue === 'true',
				isEmergency: options.isEmergency === 'true'
			}
			// 占位库存摘要，用于先看布局效果
			this.mockStock = {
				total: Number(options.totalStock || 120),
				safe: Number(options.safeStock || 80),
				nearExpiry: Number(options.nearExpiry || 2),
				expired: Number(options.expired || 0)
			}
		},
		goEdit() {
			if (!this.drug || !this.drug._id) return
			uni.navigateTo({
				url: `/pages-sub/drug/add?id=${this.drug._id}`
			})
		},
		goInboundReport() {
			uni.navigateTo({
				url: '/pages-sub/report/inbound'
			})
		},
		goOutboundReport() {
			uni.navigateTo({
				url: '/pages-sub/report/outbound'
			})
		},
		goStockReport() {
			uni.navigateTo({
				url: '/pages-sub/report/stock'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	/* 与出入库/库存页面统一的蓝色渐变背景 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding: 24rpx 24rpx 140rpx;
}

.page-header {
	max-width: 702rpx;
	margin: 10rpx auto 8rpx;
	padding: 22rpx 22rpx 18rpx;
	background: #fffff0;
	border-radius: 22rpx;
	box-shadow:
		0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
		0 -1rpx 0 rgba(15, 23, 42, 0.06) inset,
		0 18rpx 40rpx rgba(15, 23, 42, 0.14);
}

.title-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8rpx;
}

.drug-name {
	font-size: 34rpx;
	font-weight: 650;
	color: #0f172a;
}

.tag-group {
	display: flex;
	flex-direction: row;
	gap: 8rpx;
}

.pill {
	font-size: 20rpx;
	padding: 4rpx 12rpx;
	border-radius: 999rpx;
	background: #e5f3ff;
	color: #1d4ed8;
}

.pill-high {
	background: #fff7ed;
	color: #ea580c;
}

.pill-emergency {
	background: #fef2f2;
	color: #dc2626;
}

.drug-spec {
	display: block;
	font-size: 26rpx;
	color: #4b5563;
}

.drug-sub {
	display: block;
	margin-top: 4rpx;
	font-size: 22rpx;
	color: #9ca3af;
}

.info-card,
.summary-card,
.actions-card {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	background: #fffff0;
	border-radius: 20rpx;
	padding: 20rpx 22rpx 18rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.card-title-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.card-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #0f172a;
}

.info-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 8rpx;
}

.info-label {
	width: 160rpx;
	font-size: 24rpx;
	color: #9ca3af;
}

.info-value {
	flex: 1;
	font-size: 26rpx;
	color: #111827;
}

.summary-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 12rpx;
}

.summary-item {
	padding: 10rpx 12rpx;
	border-radius: 16rpx;
	background: rgba(255, 255, 255, 0.6);
}

.summary-label {
	display: block;
	font-size: 22rpx;
	color: #6b7280;
}

.summary-value {
	display: block;
	margin-top: 4rpx;
	font-size: 26rpx;
	font-weight: 600;
	color: #0f172a;
}

.summary-value.warning {
	color: #f97316;
}

.summary-value.danger {
	color: #dc2626;
}

.actions-row {
	display: flex;
	flex-direction: row;
	gap: 12rpx;
	margin-top: 10rpx;
}

.action-btn {
	flex: 1;
	height: 68rpx;
	line-height: 68rpx;
	border-radius: 999rpx;
	font-size: 26rpx;
	color: #1d4ed8;
	background: #e0f2fe;
	border: none;
}

.action-btn.primary {
	background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
	color: #ffffff;
	box-shadow: 0 8rpx 20rpx rgba(0, 160, 255, 0.3);
}

.empty-state {
	margin-top: 120rpx;
	align-items: center;
	justify-content: center;
	text-align: center;
}

.empty-text {
	font-size: 26rpx;
	color: #9ca3af;
}
</style>
