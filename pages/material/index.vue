<!-- 药材管理主页 -->
<template>
	<view class="page">
		<view class="section-header">
			<text class="section-title">药材管理</text>
		</view>

		<!-- 药材入库 -->
		<view class="info-card inbound-card">
			<view class="card-title">
				<text class="title-icon">📥</text>
				<text class="title-text">药材入库</text>
			</view>
			<view class="card-list">
				<view class="card-item" @tap="go('/pages-sub/in/list')">
					<text class="item-text">入库单列表</text>
					<text class="item-arrow">›</text>
				</view>
				<view
					v-if="canEditInOut"
					class="card-item"
					@tap="go('/pages-sub/in/add')"
				>
					<text class="item-text">新建药材入库单</text>
					<text class="item-arrow">›</text>
				</view>
				<view
					v-if="canReviewInbound"
					class="card-item"
					@tap="go('/pages-sub/in/list?status=pending_review')"
				>
					<text class="item-text">待复核入库单</text>
					<text class="item-badge">{{ inboundPendingCount }}</text>
					<text class="item-arrow">›</text>
				</view>
				<view class="card-item" @tap="go('/pages-sub/report/inbound')">
					<text class="item-text">药材入库报表</text>
					<text class="item-arrow">›</text>
				</view>
			</view>
		</view>

		<!-- 药材出库（项目经理不展示） -->
		<view v-if="role !== 'project_manager'" class="info-card outbound-card">
			<view class="card-title">
				<text class="title-icon">📤</text>
				<text class="title-text">药材出库</text>
			</view>
			<view class="card-list">
				<view class="card-item" @tap="go('/pages-sub/out/list')">
					<text class="item-text">出库单列表</text>
					<text class="item-arrow">›</text>
				</view>
				<view
					v-if="canEditInOut"
					class="card-item"
					@tap="go('/pages-sub/out/add')"
				>
					<text class="item-text">新建药材出库单</text>
					<text class="item-arrow">›</text>
				</view>
				<view
					v-if="canReviewOutbound"
					class="card-item"
					@tap="go('/pages-sub/out/list?status=pending_review')"
				>
					<text class="item-text">待复核出库单</text>
					<text class="item-badge">{{ outboundPendingCount }}</text>
					<text class="item-arrow">›</text>
				</view>
				<view class="card-item" @tap="go('/pages-sub/report/outbound')">
					<text class="item-text">药材出库报表</text>
					<text class="item-arrow">›</text>
				</view>
			</view>
		</view>

		<!-- 药材库存 -->
		<view class="info-card stock-card">
			<view class="card-title">
				<text class="title-icon">📦</text>
				<text class="title-text">药材库存</text>
			</view>
			<view class="card-list">
				<view class="card-item" @tap="go('/pages-sub/stock/query')">
					<text class="item-text">库存查询</text>
					<text class="item-arrow">›</text>
				</view>
				<view
					v-if="canAdjustStock"
					class="card-item"
					@tap="go('/pages-sub/inventory/list')"
				>
					<text class="item-text">库存盘点</text>
					<text class="item-arrow">›</text>
				</view>
				<view class="card-item" @tap="go('/pages-sub/stock/query?filter=expiring')">
					<text class="item-text">近效期药材</text>
					<text class="item-arrow">›</text>
				</view>
				<view class="card-item" @tap="go('/pages-sub/report/stock')">
					<text class="item-text">药材库存报表</text>
					<text class="item-arrow">›</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { callFunction } from '@/utils/api.js'
import {
	getCurrentRole,
	canEditInOutRecords,
	canReviewInbound,
	canReviewOutbound,
	canAdjustStock
} from '@/utils/permission.js'

export default {
	data() {
		return {
			role: getCurrentRole(),
			inboundPendingCount: 0,
			outboundPendingCount: 0
		}
	},
	computed: {
		canEditInOut() {
			return canEditInOutRecords(this.role)
		},
		canReviewInbound() {
			return canReviewInbound(this.role)
		},
		canReviewOutbound() {
			return canReviewOutbound(this.role)
		},
		canAdjustStock() {
			return canAdjustStock(this.role)
		}
	},
	onShow() {
		this.loadPendingCounts()
	},
	methods: {
		go(url) {
			uni.navigateTo({ url })
		},
		async loadPendingCounts() {
			try {
				// 入库待复核
				if (this.canReviewInbound) {
					const inResult = await callFunction('inRecords', {
						action: 'getCounts',
						data: {}
					})
					const inPending =
						inResult?.pendingReview ??
						inResult?.pending_review ??
						inResult?.pending ??
						0
					this.inboundPendingCount = inPending
				} else {
					this.inboundPendingCount = 0
				}

				// 出库待复核
				if (this.canReviewOutbound) {
					const outResult = await callFunction('outRecords', {
						action: 'getCounts',
						data: {}
					})
					const outPending =
						outResult?.pendingReview ??
						outResult?.pending_review ??
						outResult?.pending ??
						0
					this.outboundPendingCount = outPending
				} else {
					this.outboundPendingCount = 0
				}
			} catch (err) {
				console.error('加载待复核入/出库数量失败:', err)
				this.inboundPendingCount = 0
				this.outboundPendingCount = 0
			}
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	/* 使用与首页/门诊首页一致的蓝色渐变背景 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding: 24rpx 24rpx 40rpx;
}

.section-header {
	/* 顶部标题卡片：象牙白圆角卡片，宽度与首页 header-card 对齐 */
	max-width: 702rpx;
	margin: 10rpx auto 8rpx;
	padding: 26rpx 24rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow:
		0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
		0 -1rpx 0 rgba(15, 23, 42, 0.06) inset,
		0 18rpx 40rpx rgba(15, 23, 42, 0.14);
	display: flex;
	align-items: center;
	justify-content: center;
}

.section-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #0f172a;
	letter-spacing: 2rpx;
}

.info-card {
	position: relative;
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 20rpx 22rpx 12rpx;
	background: #FFFFF0;
	border-radius: 24rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	overflow: hidden;
}

.info-card::before {
	/* 去掉右上角渐变方块装饰，保持卡片干净简洁 */
	content: none;
}

.card-title {
	display: flex;
	align-items: center;
	margin-bottom: 14rpx;
}

.title-icon {
	width: 56rpx;
	height: 56rpx;
	border-radius: 20rpx;
	background: linear-gradient(135deg, #eff6ff 0%, #e0f2fe 35%, #fee2ff 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	margin-right: 12rpx;
	box-shadow: 0 4rpx 12rpx rgba(37, 99, 235, 0.2);
}

.title-text {
	font-size: 30rpx;
	font-weight: 650;
	color: #0f172a;
}

.card-list {
	border-top: none;
	margin-top: 10rpx;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	column-gap: 16rpx;
	row-gap: 16rpx;
}

.card-item {
	background: linear-gradient(135deg, #f9fafb 0%, #eef2ff 40%, #e0f2fe 100%);
	border-radius: 22rpx;
	padding: 20rpx 18rpx;
	box-shadow: 0 10rpx 24rpx rgba(148, 163, 184, 0.25);
	display: flex;
	flex-direction: row;
	align-items: center;
}

/* 入库模块按钮：蓝绿系 */
.inbound-card .card-item {
	background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 40%, #bfdbfe 100%);
}

/* 出库模块按钮：橙红系 */
.outbound-card .card-item {
	background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 40%, #fee2e2 100%);
}

/* 库存模块按钮：紫蓝系 */
.stock-card .card-item {
	background: linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 40%, #cffafe 100%);
}

.card-item + .card-item {
	border-top: none;
}

.card-item:active {
	opacity: 0.9;
	transform: scale(0.97);
}

.item-text {
	flex: 1;
	font-size: 30rpx;
	color: #0f172a;
	font-weight: 600;
}

.item-badge {
	min-width: 60rpx;
	text-align: right;
	font-size: 24rpx;
	color: #2563eb;
	font-weight: 650;
	margin-right: 4rpx;
}

.item-arrow {
	font-size: 30rpx;
	color: #64748b;
}
</style>
