<template>
	<view class="page">
		<view class="header">
			<text class="title">👤 我的</text>
		</view>
		<view class="content">
			<text class="info">个人中心开发中...</text>
			<text class="tip">云函数上传后即可使用</text>
		</view>
	</view>
</template>

<script>
export default {
	onLoad() {
		console.log('我的页面加载成功')
	}
}
</script>

<style>
.page {
	padding: 40rpx;
	background: #f5f5f5;
	min-height: 100vh;
}
.header {
	background: white;
	padding: 40rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	text-align: center;
}
.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}
.content {
	background: white;
	padding: 80rpx 40rpx;
	border-radius: 20rpx;
	text-align: center;
}
.info {
	display: block;
	font-size: 32rpx;
	color: #3cc51f;
	margin-bottom: 20rpx;
}
.tip {
	display: block;
	font-size: 24rpx;
	color: #999;
}
</style>

