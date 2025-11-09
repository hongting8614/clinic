<script>
export default {
	onLaunch: function() {
		console.log('App Launch')
		
		// 初始化云开发
		if (wx.cloud) {
			wx.cloud.init({
				env: 'cloud1-3gv7spppf7d2d0f4', // 你的云开发环境ID
				traceUser: true
			})
			console.log('✅ 云开发初始化成功！环境ID: cloud1-3gv7spppf7d2d0f4')
		} else {
			console.error('❌ wx.cloud 未定义，请检查是否在微信开发者工具中运行')
		}
		
		// 检查登录状态
		this.checkLogin()
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	},
	methods: {
		checkLogin() {
			const userInfo = uni.getStorageSync('userInfo')
			if (!userInfo) {
				// 跳转到登录页
				console.log('用户未登录')
			}
		}
	}
}
</script>

<style>
/*每个页面公共css */

page {
	background-color: #F8F8F8;
}

.container {
	padding: 20rpx;
}

.page-header {
	background-color: #FFFFFF;
	padding: 30rpx;
	margin-bottom: 20rpx;
	border-radius: 10rpx;
	text-align: center;
}

.page-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333333;
}

.page-subtitle {
	font-size: 28rpx;
	color: #666666;
	margin-top: 10rpx;
}

.form-section {
	background-color: #FFFFFF;
	padding: 30rpx;
	margin-bottom: 20rpx;
	border-radius: 10rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 20rpx;
}

.form-item {
	margin-bottom: 30rpx;
}

.form-label {
	font-size: 28rpx;
	color: #666666;
	margin-bottom: 10rpx;
}

.form-required {
	color: #FF0000;
}

.btn-primary {
	background-color: #3cc51f;
	color: #FFFFFF;
}

.btn-secondary {
	background-color: #FFFFFF;
	color: #3cc51f;
	border: 1px solid #3cc51f;
}
</style>


