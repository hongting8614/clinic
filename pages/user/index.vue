<template>
	<view class="page" @touchstart="onTabTouchStart" @touchend="onTabTouchEnd">
		<!-- 用户信息卡片 - 科技风格 -->
		<view class="user-profile">
			<view class="profile-bg">
				<view class="bg-pattern"></view>
			</view>
			<view class="profile-content">
				<view class="avatar-wrapper" @tap="showAvatarOptions">
					<view class="avatar-circle">
						<!-- 显示真实头像或默认图标 -->
						<image 
							v-if="displayAvatar" 
							:src="displayAvatar" 
							class="avatar-img"
							mode="aspectFill"
							@error="onAvatarError"
						/>
						<text v-else class="avatar-icon">👤</text>
					</view>
					<view class="online-indicator"></view>
					<!-- 相机图标提示可点击 -->
					<view v-if="isLoggedIn" class="camera-icon">📷</view>
				</view>
				<view class="user-details">
					<text class="user-name">{{ userInfo.name }}</text>
					<text class="user-role">{{ userInfo.roleText }}</text>
					<view class="user-dept-tag">
						<text class="dept-icon">🏥</text>
						<text class="dept-text">医务室</text>
					</view>
					<!-- 登录按钮 -->
					<view v-if="!isLoggedIn" class="login-btn-wrapper">
						<view class="login-btn" @tap="handleLogin" :class="{ 'loading': isLoading }">
							<text class="login-btn-text">{{ isLoading ? '登录中...' : '点击登录' }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 功能菜单 - 专业分组 -->
		<view class="menu-section">
			<view class="menu-group">
				<view class="group-header">
					<text class="group-icon">💼</text>
					<text class="group-title">核心业务</text>
				</view>
				<view class="menu-items">
					<view class="menu-item" @tap="goToPage('/pages-sub/in/list')">
						<view class="menu-icon-wrapper blue">
							<text class="menu-icon">📥</text>
						</view>
						<view class="menu-content">
							<text class="menu-title">入库管理</text>
							<text class="menu-desc">药品入库、复核审批</text>
						</view>
						<text class="menu-arrow">→</text>
					</view>
					
					<view class="menu-item" @tap="goToPage('/pages-sub/out/list')">
						<view class="menu-icon-wrapper green">
							<text class="menu-icon">📤</text>
						</view>
						<view class="menu-content">
							<text class="menu-title">园区领用</text>
							<text class="menu-desc">水园·陆园·园区项目</text>
						</view>
						<text class="menu-arrow">→</text>
					</view>
					
					<view class="menu-item" @tap="goToPage('/pages-sub/consume/list')">
						<view class="menu-icon-wrapper orange">
							<text class="menu-icon">📊</text>
						</view>
						<view class="menu-content">
							<text class="menu-title">日消耗管理</text>
							<text class="menu-desc">水园·陆园每日消耗</text>
						</view>
						<text class="menu-arrow">→</text>
					</view>
					
					<view class="menu-item" @tap="goToPage('/pages/stock/index')">
						<view class="menu-icon-wrapper purple">
							<text class="menu-icon">📦</text>
						</view>
						<view class="menu-content">
							<text class="menu-title">库存管理</text>
							<text class="menu-desc">实时库存、批次查询</text>
						</view>
						<text class="menu-arrow">→</text>
					</view>
				</view>
			</view>

			<view class="menu-group">
				<view class="group-header">
					<text class="group-icon">📊</text>
					<text class="group-title">数据分析</text>
				</view>
				<view class="menu-items">
					<view class="menu-item" @tap="goToPage('/pages-sub/report/index')">
						<view class="menu-icon-wrapper orange">
							<text class="menu-icon">📈</text>
						</view>
						<view class="menu-content">
							<text class="menu-title">数据报表</text>
							<text class="menu-desc">日报、周报、月报</text>
						</view>
						<text class="menu-arrow">→</text>
					</view>
					
					<view class="menu-item" @tap="goToPage('/pages/index/index')">
						<view class="menu-icon-wrapper teal">
							<text class="menu-icon">📉</text>
						</view>
						<view class="menu-content">
							<text class="menu-title">统计分析</text>
							<text class="menu-desc">数据统计、趋势分析</text>
						</view>
						<text class="menu-arrow">→</text>
					</view>
				</view>
			</view>

			<view class="menu-group">
				<view class="group-header">
					<text class="group-icon">⚙️</text>
					<text class="group-title">系统设置</text>
				</view>
				<view class="menu-items">
					<view class="menu-item" @tap="goToPage('/pages-sub/setting/user-list')">
						<view class="menu-icon-wrapper gray">
							<text class="menu-icon">👥</text>
						</view>
						<view class="menu-content">
							<text class="menu-title">用户管理</text>
							<text class="menu-desc">用户权限、角色管理</text>
						</view>
						<text class="menu-arrow">→</text>
					</view>
					
					<view class="menu-item" @tap="showAbout">
						<view class="menu-icon-wrapper indigo">
							<text class="menu-icon">ℹ️</text>
						</view>
						<view class="menu-content">
							<text class="menu-title">关于系统</text>
							<text class="menu-desc">版本信息、帮助文档</text>
						</view>
						<text class="menu-arrow">→</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 系统信息面板 -->
		<view class="system-panel">
			<view class="panel-header">
				<text class="panel-title">系统信息</text>
			</view>
			<view class="info-grid">
				<view class="info-item">
					<view class="info-icon-wrapper">
						<text class="info-icon">📱</text>
					</view>
					<text class="info-label">系统版本</text>
					<text class="info-value">v1.0.0</text>
				</view>
				
				<view class="info-item">
					<view class="info-icon-wrapper">
						<text class="info-icon">🕐</text>
					</view>
					<text class="info-label">最后更新</text>
					<text class="info-value">{{ lastUpdateTime }}</text>
				</view>
				
				<view class="info-item">
					<view class="info-icon-wrapper online">
						<text class="info-icon">✓</text>
					</view>
					<text class="info-label">运行状态</text>
					<text class="info-value success">正常运行</text>
				</view>
		</view>
		</view>
	</view>
</template>

<script>
import { login, checkLogin, getUserInfo } from '@/utils/auth.js'
import { createTabSwipeMixin } from '@/utils/tabSwipe.js'

export default {
	mixins: [createTabSwipeMixin(3)],
	data() {
		return {
			userInfo: {
				name: '未登录',
				role: '请先登录',
				roleText: '请先登录',
				department: '北京欢乐谷医务室',
				avatarUrl: '',
				wechatAvatarUrl: ''
			},
			lastUpdateTime: '',
			isLoading: false,
			isLoggedIn: false,
			avatarLoadError: false
		}
	},
	
	computed: {
		// 计算显示的头像
		displayAvatar() {
			if (this.avatarLoadError) {
				return ''
			}
			// 优先级：自定义头像 > 微信头像
			return this.userInfo.avatarUrl || this.userInfo.wechatAvatarUrl || ''
		}
	},
	
	onLoad() {
		console.log('===== 我的页面 onLoad =====')
		this.updateTime()
		this.checkAndLogin()
	},
	onShow() {
		// 每次显示页面时检查登录状态
		this.checkAndLogin()
	},
	methods: {
		// 检查并登录
		async checkAndLogin() {
			// 检查是否已登录
			const isLogin = checkLogin()
			const userInfo = getUserInfo()
			
			if (isLogin && userInfo) {
				// 已登录，加载用户信息
				this.isLoggedIn = true
				this.loadUserInfo()
				return
			}
			
			// 未登录，尝试自动登录
			this.isLoggedIn = false
			this.isLoading = true
			
			try {
				const result = await login()
				
				if (result.success) {
					// 登录成功
					this.isLoggedIn = true
					this.loadUserInfo()
					uni.showToast({
						title: '登录成功',
						icon: 'success',
						duration: 1500
					})
				} else {
					// 登录失败
					this.isLoggedIn = false
					this.userInfo = {
						name: '未登录',
						role: '请先登录',
						department: '北京欢乐谷医务室'
					}
					
					// 显示登录提示
					uni.showModal({
						title: '需要登录',
						content: result.message || '您不在系统白名单内，请联系管理员添加',
						showCancel: false,
						confirmText: '知道了',
						confirmColor: '#667eea'
					})
				}
			} catch (err) {
				console.error('登录失败:', err)
				this.isLoggedIn = false
				this.userInfo = {
					name: '未登录',
					role: '登录失败',
					department: '北京欢乐谷医务室'
				}
				
				uni.showToast({
					title: '登录失败，请重试',
					icon: 'none',
					duration: 2000
				})
			} finally {
				this.isLoading = false
			}
		},
		
		// 加载用户信息
		loadUserInfo() {
			const userInfo = getUserInfo()
			if (userInfo) {
				this.userInfo = {
					name: userInfo.realName || userInfo.name || '未设置',
					role: userInfo.roleText || '未知角色',
					department: '北京欢乐谷医务室'
				}
			} else {
				this.userInfo = {
					name: '未登录',
					role: '请先登录',
					department: '北京欢乐谷医务室'
				}
			}
		},
		
		// 手动登录
		async handleLogin() {
			this.isLoading = true
			await this.checkAndLogin()
		},
		
		updateTime() {
			const now = new Date()
			// 格式化为：2025/11/9
			const year = now.getFullYear()
			const month = now.getMonth() + 1
			const day = now.getDate()
			this.lastUpdateTime = `${year}/${month}/${day}`
		},
		
		goToPage(url) {
			// 检查登录状态
			if (!this.isLoggedIn) {
				uni.showModal({
					title: '需要登录',
					content: '请先登录后再使用此功能',
					showCancel: false,
					confirmText: '去登录',
					confirmColor: '#667eea',
					success: () => {
						this.handleLogin()
					}
				})
				return
			}
			
			// 判断是否是tabbar页面
			const tabbarPages = ['/pages/index/index', '/pages/stock/index', '/pages/record/index', '/pages/user/index']
			const isTabbar = tabbarPages.includes(url)
			
			if (isTabbar) {
				uni.switchTab({
					url: url,
					fail: (err) => {
						console.log('页面跳转失败:', err)
						uni.showToast({
							title: '跳转失败',
							icon: 'none'
						})
					}
				})
			} else {
				uni.navigateTo({
					url: url,
					fail: (err) => {
						console.log('页面跳转失败:', err)
						uni.showToast({
							title: '页面开发中',
							icon: 'none'
						})
					}
				})
			}
		},
		
		showComingSoon() {
			uni.showModal({
				title: '功能即将推出',
				content: '该功能正在开发中，敬请期待！',
				showCancel: false,
				confirmText: '知道了',
				confirmColor: '#667eea'
			})
		},
		
		goToUserManage() {
			// 临时方案：跳转到设置页面或显示提示
			uni.showToast({
				title: '用户管理功能开发中',
				icon: 'none'
			})
		},
		
		showAbout() {
			uni.showModal({
				title: '关于系统',
				content: '北京欢乐谷医务室药品管理系统\n\n版本：v1.0.0\n开发：AI助手\n\n专业的药品库存管理解决方案',
				showCancel: false,
				confirmText: '确定',
				confirmColor: '#667eea'
			})
		},
		
		// 显示头像选项
		showAvatarOptions() {
			if (!this.isLoggedIn) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				})
				return
			}
			
			uni.showActionSheet({
				itemList: ['从相册选择', '拍照'],
				success: (res) => {
					if (res.tapIndex === 0) {
						this.chooseImageFromAlbum()
					} else if (res.tapIndex === 1) {
						this.takePhoto()
					}
				}
			})
		},
		
		// 从相册选择
		async chooseImageFromAlbum() {
			await this.chooseAndUploadImage(['album'])
		},
		
		// 拍照
		async takePhoto() {
			await this.chooseAndUploadImage(['camera'])
		},
		
		// 选择并上传图片
		async chooseAndUploadImage(sourceType) {
			try {
				const res = await uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: sourceType
				})
				
				uni.showLoading({
					title: '上传中...'
				})
				
				const tempFilePath = res.tempFilePaths[0]
				
				// 上传到云存储
				const cloudPath = await this.uploadToCloud(tempFilePath)
				
				// 更新数据库
				await this.updateAvatar(cloudPath, 'custom')
				
				uni.hideLoading()
				uni.showToast({
					title: '头像已更新',
					icon: 'success'
				})
			} catch (err) {
				console.error('上传失败：', err)
				uni.hideLoading()
				if (err.errMsg && !err.errMsg.includes('cancel')) {
					uni.showToast({
						title: '上传失败',
						icon: 'error'
					})
				}
			}
		},
		
		// 上传到云存储
		async uploadToCloud(filePath) {
			const cloudPath = `avatars/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
			
			const result = await wx.cloud.uploadFile({
				cloudPath: cloudPath,
				filePath: filePath
			})
			
			return result.fileID
		},
		
		// 更新头像
		async updateAvatar(avatarUrl, type) {
			const res = await wx.cloud.callFunction({
				name: 'updateMyInfo',
				data: {
					[type === 'wechat' ? 'wechatAvatarUrl' : 'avatarUrl']: avatarUrl
				}
			})
			
			// 更新本地
			if (type === 'wechat') {
				this.userInfo.wechatAvatarUrl = avatarUrl
			} else {
				this.userInfo.avatarUrl = avatarUrl
			}
			
			this.avatarLoadError = false
			
			// 更新缓存
			const storedUserInfo = uni.getStorageSync('userInfo')
			if (storedUserInfo) {
				if (type === 'wechat') {
					storedUserInfo.wechatAvatarUrl = avatarUrl
				} else {
					storedUserInfo.avatarUrl = avatarUrl
				}
				uni.setStorageSync('userInfo', storedUserInfo)
			}
		},
		
		// 头像加载失败
		onAvatarError() {
			console.log('头像加载失败')
			this.avatarLoadError = true
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: linear-gradient(180deg, #f0f4f8 0%, #ffffff 100%);
	/* 兼容底部安全区，避免被 Tab 覆盖 */
	padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
}

/* 用户信息卡片 - 科技风格 */
.user-profile {
	position: relative;
	margin-bottom: 30rpx;
	overflow: hidden;
}

.profile-bg {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	height: 180rpx;
	position: relative;
	overflow: hidden;
}

.bg-pattern {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-image: 
		repeating-linear-gradient(45deg, transparent, transparent 35rpx, rgba(255,255,255,0.05) 35rpx, rgba(255,255,255,0.05) 70rpx);
}

.profile-content {
	position: absolute;
	bottom: -45rpx;
	left: 30rpx;
	right: 30rpx;
	background: #ffffff;
	border-radius: 24rpx;
	padding: 30rpx 25rpx;
	box-shadow: 0 12rpx 40rpx rgba(0,0,0,0.12);
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.avatar-wrapper {
	position: relative;
}

.avatar-circle {
	width: 100rpx;
	height: 100rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
	border: 5rpx solid #ffffff;
	overflow: hidden;
}

.avatar-img {
	width: 100%;
	height: 100%;
	border-radius: 50%;
}

.avatar-icon {
	font-size: 50rpx;
	color: #ffffff;
	filter: drop-shadow(0 2rpx 4rpx rgba(0,0,0,0.2));
}

.camera-icon {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 30rpx;
	height: 30rpx;
	background: #ffffff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.2);
	z-index: 2;
}

.online-indicator {
	position: absolute;
	bottom: 3rpx;
	right: 3rpx;
	width: 20rpx;
	height: 20rpx;
	background: #10b981;
	border-radius: 50%;
	border: 3rpx solid #ffffff;
	box-shadow: 0 0 0 4rpx rgba(16, 185, 129, 0.3);
}

.user-details {
	flex: 1;
}

.user-name {
	display: block;
	font-size: 34rpx;
	font-weight: 700;
	color: #1e293b;
	margin-bottom: 10rpx;
}

.user-role {
	display: block;
	font-size: 26rpx;
	color: #64748b;
	margin-bottom: 15rpx;
}

.user-dept-tag {
	display: inline-flex;
	align-items: center;
	gap: 8rpx;
	background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}

.dept-icon {
	font-size: 20rpx;
}

.dept-text {
	font-size: 22rpx;
	color: #475569;
}

/* 功能菜单 */
.menu-section {
	margin-top: 70rpx;
	padding: 0 30rpx;
}

.menu-group {
	margin-bottom: 25rpx;
}

.group-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 15rpx;
}

.group-icon {
	font-size: 28rpx;
}

.group-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #2c3e50;
}

.menu-items {
	background: #ffffff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f1f5f9;
	transition: all 0.3s;
	position: relative;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-item:active {
	background: #f8fafc;
}

.menu-icon-wrapper {
	width: 64rpx;
	height: 64rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.menu-icon-wrapper.blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.menu-icon-wrapper.green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.menu-icon-wrapper.pink { background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); }
.menu-icon-wrapper.purple { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
.menu-icon-wrapper.orange { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.menu-icon-wrapper.teal { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); }
.menu-icon-wrapper.gray { background: linear-gradient(135deg, #64748b 0%, #475569 100%); }
.menu-icon-wrapper.indigo { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); }

.menu-icon {
	font-size: 32rpx;
}

.menu-content {
	flex: 1;
}

.menu-title {
	display: block;
	font-size: 28rpx;
	font-weight: 600;
	color: #1e293b;
	margin-bottom: 6rpx;
}

.menu-desc {
	display: block;
	font-size: 22rpx;
	color: #94a3b8;
}

.menu-arrow {
	font-size: 24rpx;
	color: #cbd5e1;
	font-weight: bold;
	margin-left: 15rpx;
}

/* 系统信息面板 */
.system-panel {
	padding: 0 30rpx;
	margin-top: 25rpx;
}

.panel-header {
	margin-bottom: 15rpx;
}

.panel-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #2c3e50;
}

.info-grid {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 25rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 25rpx;
}

.info-item {
	text-align: center;
}

.info-icon-wrapper {
	width: 56rpx;
	height: 56rpx;
	background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
	border-radius: 14rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 12rpx;
}

.info-icon-wrapper.online {
	background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.info-icon {
	font-size: 28rpx;
	color: #64748b;
}

.info-icon-wrapper.online .info-icon {
	color: #10b981;
	font-weight: bold;
}

.info-label {
	display: block;
	font-size: 22rpx;
	color: #94a3b8;
	margin-bottom: 6rpx;
}

.info-value {
	display: block;
	font-size: 24rpx;
	font-weight: 600;
	color: #475569;
}

.info-value.success {
	color: #10b981;
}

/* 登录按钮 */
.login-btn-wrapper {
	margin-top: 20rpx;
}

.login-btn {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 16rpx 32rpx;
	border-radius: 40rpx;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
	transition: all 0.3s;
}

.login-btn.loading {
	opacity: 0.7;
}

.login-btn:active:not(.loading) {
	transform: scale(0.98);
	box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.4);
}

.login-btn-text {
	color: #ffffff;
	font-size: 26rpx;
	font-weight: 500;
}
</style>


