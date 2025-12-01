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
			const isLogin = uni.getStorageSync('isLogin')
			
			console.log('🔍 检查登录状态:', {
				hasUserInfo: !!userInfo,
				isLogin: isLogin,
				userInfo: userInfo
			})
			
			if (!userInfo) {
				// 跳转到登录页
				console.log('用户未登录')
			} else {
				console.log('✅ 用户已登录:', {
					name: userInfo.name,
					role: userInfo.role,
					userId: userInfo.userId || userInfo._id
				})
			}
		}
	}
}
</script>

<style>
/*每个页面公共css */

/* 全局基础字号：统一再放大一档，提升手机端可读性 */
page {
	background-color: #F8F8F8;
	font-size: 32rpx;
}

view,
text {
	font-size: 32rpx;
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
	font-size: 30rpx;
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
	font-size: 34rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 20rpx;
}

.form-item {
	margin-bottom: 30rpx;
}

.form-label {
	font-size: 34rpx;
	color: #666666;
	margin-bottom: 10rpx;
}

.form-required {
	color: #FF0000;
}

.btn-primary {
	background-color: #3cc51f;
	color: #FFFFFF;
	font-size: 32rpx;
}

.btn-secondary {
	background-color: #FFFFFF;
	color: #3cc51f;
	border: 1px solid #3cc51f;
	font-size: 32rpx;
}

/* 原生按钮统一放大字号 */
button {
	font-size: 32rpx;
}
</style>


