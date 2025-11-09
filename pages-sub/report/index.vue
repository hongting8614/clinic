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
	background-color: #F8F8F8;
}

.page-header {
	background-color: #FFFFFF;
	padding: 30rpx;
	margin-bottom: 20rpx;
	text-align: center;
}

.page-title {
	display: block;
	font-size: 40rpx;
	font-weight: bold;
	color: #333333;
}

.page-subtitle {
	display: block;
	font-size: 28rpx;
	color: #666666;
	margin-top: 10rpx;
}

.report-menu {
	padding: 0 30rpx;
}

.menu-item {
	background-color: #FFFFFF;
	border-radius: 10rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	display: flex;
	align-items: center;
}

.menu-icon {
	font-size: 50rpx;
	margin-right: 20rpx;
}

.menu-content {
	flex: 1;
}

.menu-title {
	display: block;
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 8rpx;
}

.menu-desc {
	display: block;
	font-size: 26rpx;
	color: #999999;
}

.menu-arrow {
	font-size: 28rpx;
	color: #CCCCCC;
}
</style>
