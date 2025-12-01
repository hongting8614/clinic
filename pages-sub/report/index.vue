<template>
	<view class="page">
		<view class="page-header">
			<text class="page-title">数据报表</text>
			<text class="page-subtitle">查看各类统计报表</text>
		</view>

		<view class="report-menu">
			<view class="menu-item" @tap="goToReport('daily')">
				<view class="menu-icon">📊</view>
				<view class="menu-content">
					<text class="menu-title">日报表</text>
					<text class="menu-desc">每日数据统计</text>
				</view>
				<text class="menu-arrow">→</text>
			</view>

			<view class="menu-item" @tap="goToReport('weekly')">
				<view class="menu-icon">📈</view>
				<view class="menu-content">
					<text class="menu-title">周报表</text>
					<text class="menu-desc">每周数据汇总</text>
				</view>
				<text class="menu-arrow">→</text>
			</view>

			<view class="menu-item" @tap="goToReport('monthly')">
				<view class="menu-icon">📉</view>
				<view class="menu-content">
					<text class="menu-title">月报表</text>
					<text class="menu-desc">每月数据分析</text>
				</view>
				<text class="menu-arrow">→</text>
			</view>

			<!-- 门诊登记报表入口 -->
			<view class="menu-item" @tap="goToReport('clinic')">
				<view class="menu-icon">🩺</view>
				<view class="menu-content">
					<text class="menu-title">门诊登记导出</text>
					<text class="menu-desc">门诊登记Excel/PDF导出</text>
				</view>
				<text class="menu-arrow">→</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {}
	},
	methods: {
		goToReport(type) {
			uni.navigateTo({
				url: `/pages-sub/report/${type}`
			})
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background: linear-gradient(180deg, #00c9ff 0%, #00e0b8 45%, #e0fdfb 100%);
	padding-bottom: 40rpx;
}

.page-header {
	margin: 24rpx 24rpx 18rpx;
	padding: 32rpx 30rpx 26rpx;
	background: linear-gradient(135deg, #ffffff 0%, #f5f7ff 100%);
	border-radius: 26rpx;
	box-shadow: 0 22rpx 60rpx rgba(15, 23, 42, 0.18);
	text-align: center;
}

.page-title {
	display: block;
	font-size: 40rpx;
	font-weight: 700;
	color: #0f172a;
}

.page-subtitle {
	display: block;
	font-size: 26rpx;
	color: #6b7280;
	margin-top: 10rpx;
}

.report-menu {
	padding: 0 24rpx;
}

.menu-item {
	background-color: #ffffff;
	border-radius: 22rpx;
	padding: 24rpx 22rpx;
	margin-bottom: 18rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 18rpx 40rpx rgba(15, 23, 42, 0.14);
}

.menu-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 999rpx;
	background: linear-gradient(135deg, #22c1c3, #00e0b8);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 40rpx;
	margin-right: 20rpx;
}

.menu-content {
	flex: 1;
}

.menu-title {
	display: block;
	font-size: 32rpx;
	font-weight: 600;
	color: #0f172a;
	margin-bottom: 6rpx;
}

.menu-desc {
	display: block;
	font-size: 24rpx;
	color: #6b7280;
}

.menu-arrow {
	font-size: 30rpx;
	color: #cbd5f5;
}
</style>
