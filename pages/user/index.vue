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
					<!-- 登录按钮 -->
					<view v-if="!isLoggedIn" class="login-btn-wrapper">
						<view class="login-btn" @tap="handleLogin" :class="{ 'loading': isLoading }">
							<text class="login-btn-text">{{ isLoading ? '登录中...' : '点击登录' }}</text>
						</view>
					</view>
					<view v-else class="logout-btn-wrapper">
						<view class="logout-btn" @tap="logoutUser" :class="{ 'loading': isLoading }">
							<text class="logout-btn-text">{{ isLoading ? '处理中...' : '退出登录' }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 功能菜单 - 专业分组，使用大卡片风格 -->
		<view class="menu-section">
			<view class="menu-group">
				<view class="group-header">
					<text class="group-icon"></text>
					<text class="group-title">核心业务</text>
				</view>
				<view class="menu-items">
					<view class="menu-item" @tap="goToPage('/pages-sub/in/list')">
						<view class="menu-icon-wrapper blue">
							<text class="menu-icon">📥</text>
						</view>
						<view class="menu-content">
							<text class="menu-title">入库管理</text>
							<text class="menu-desc">药材入库、复核审批</text>
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
					<text class="group-icon"></text>
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
					<text class="group-icon"></text>
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

		<!-- 首次登录绑定微信号弹窗 -->
		<view v-if="showWechatBindDialog" class="bind-mask">
			<view class="bind-dialog">
				<text class="bind-title">绑定微信号</text>
				<text class="bind-desc">您尚未在系统中绑定账号，请输入管理员已录入的微信号以完成绑定。</text>
				<input
					class="bind-input"
					v-model="wechatIdInput"
					placeholder="请输入您的微信号"
				/>
				<view class="bind-actions">
					<button class="bind-btn cancel" @tap="cancelWechatBind">取消</button>
					<button class="bind-btn confirm" @tap="confirmWechatBind">绑定并登录</button>
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
			avatarLoadError: false,
			// 首次登录绑定微信号弹窗
			showWechatBindDialog: false,
			wechatIdInput: ''
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
			console.log('checkAndLogin 调用')
			// 检查是否已登录
			const isLogin = checkLogin()
			const userInfo = getUserInfo()
			console.log('本地缓存登录状态:', { isLogin, userInfo })
			
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
				console.log('login 云函数返回:', result)
				
				if (result.success) {
					// 登录成功
					this.isLoggedIn = true
					this.loadUserInfo()
					console.log('登录成功，已更新用户信息')
					uni.showToast({
						title: '登录成功',
						icon: 'success',
						duration: 1500
					})
				} else {
					// 登录失败：当前 openid 未绑定任何用户，在本页弹出绑定微信号对话框
					console.log('登录失败，准备弹出绑定微信号对话框，原因:', result && result.message)
					this.isLoggedIn = false
					this.userInfo = {
						name: '未登录',
						role: '请先登录',
						roleText: '请先登录',
						department: '北京欢乐谷医务室',
						avatarUrl: '',
						wechatAvatarUrl: ''
					}
					this.wechatIdInput = ''
					this.showWechatBindDialog = true
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

		// 取消绑定微信号
		cancelWechatBind() {
			this.showWechatBindDialog = false
			this.wechatIdInput = ''
		},
		// 确认绑定微信号并重试登录
		async confirmWechatBind() {
			if (!this.wechatIdInput) {
				uni.showToast({
					title: '请输入微信号',
					icon: 'none'
				})
				return
			}
			this.isLoading = true
			try {
				const result = await login(this.wechatIdInput.trim())
				if (result.success) {
					this.isLoggedIn = true
					this.showWechatBindDialog = false
					this.loadUserInfo()
					uni.showToast({
						title: '绑定并登录成功',
						icon: 'success'
					})
				} else {
					uni.showToast({
						title: result.message || '绑定失败，请联系管理员',
						icon: 'none'
					})
				}
			} catch (err) {
				console.error('绑定微信号失败:', err)
				uni.showToast({
					title: '绑定失败，请重试',
					icon: 'none'
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
					// 英文角色值（admin/project_manager/doctor/viewer），备用
					role: userInfo.role,
					// 中文角色文本（管理员/项目经理/医务人员/查看者），用于展示
					roleText: userInfo.roleText || '未知角色',
					department: '北京欢乐谷医务室'
				}
			} else {
				this.userInfo = {
					name: '未登录',
					role: '',
					roleText: '请先登录',
					department: '北京欢乐谷医务室'
				}
			}
		},
		
		// 手动登录
		async handleLogin() {
			console.log('handleLogin 被点击')
			// 手动点击登录时，清除本地旧的登录缓存，强制重新走云函数登录
			try {
				if (typeof uni !== 'undefined') {
					uni.removeStorageSync('isLogin')
					uni.removeStorageSync('userInfo')
					uni.removeStorageSync('userRole')
					uni.removeStorageSync('userId')
				}
			} catch (e) {
				console.log('清除本地登录缓存失败:', e)
			}
			this.isLoading = true
			await this.checkAndLogin()
		},

		// 退出登录
		logoutUser() {
			try {
				if (typeof uni !== 'undefined') {
					uni.removeStorageSync('isLogin')
					uni.removeStorageSync('userInfo')
					uni.removeStorageSync('userRole')
					uni.removeStorageSync('userId')
				} else if (typeof wx !== 'undefined') {
					wx.removeStorageSync('isLogin')
					wx.removeStorageSync('userInfo')
					wx.removeStorageSync('userRole')
					wx.removeStorageSync('userId')
				}
			} catch (e) {
				console.log('退出登录时清除缓存失败:', e)
			}
			this.isLoggedIn = false
			this.userInfo = {
				name: '未登录',
				role: '',
				roleText: '请先登录',
				department: '北京欢乐谷医务室',
				avatarUrl: '',
				wechatAvatarUrl: ''
			}
			this.avatarLoadError = false
			this.wechatIdInput = ''
			this.showWechatBindDialog = false
			uni.showToast({
				title: '已退出登录',
				icon: 'none'
			})
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
				content: '北京欢乐谷医务室管理系统\n\n版本：v1.1.2\n开发者：于建华（微信：bjkfjz）',
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
	/* 使用与报表页相似的蓝色渐变背景 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	/* 兼容底部安全区，避免被 Tab 覆盖 */
	padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
}

/* 用户信息卡片 - 医疗工作台风格 */
.user-profile {
	position: relative;
	padding: 40rpx 0 16rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	margin-bottom: 10rpx;
}

.profile-bg {
	display: none;
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
	margin: 0 auto;
	max-width: 702rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	padding: 30rpx 26rpx;
	box-shadow:
		0 1rpx 0 rgba(255,255,255,0.9) inset,
		0 -1rpx 0 rgba(15,23,42,0.06) inset,
		0 18rpx 40rpx rgba(15, 23, 42, 0.14);
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
	/* 头像圆使用与首页 Logo 相近的蓝绿渐变 */
	background: linear-gradient(145deg, #2a91e9 0%, #22c1c3 45%, #e0f7ff 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.3);
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
	margin-top: 24rpx;
	padding: 0 20rpx 36rpx;
}

.menu-group {
	margin: 0 auto 26rpx;
	max-width: 710rpx;
	background: #FFFFF0;
	border-radius: 24rpx;
	padding: 22rpx 18rpx 10rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
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
	/* 容器本身不再作为一整块卡片，仅负责垂直排列子卡片 */
	background: transparent;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 18rpx 22rpx;
	margin: 4rpx 2rpx 10rpx;
	border-radius: 18rpx;
	background: rgba(255, 255, 255, 0.96);
	border: 1rpx solid #e2e8f0;
	box-shadow: 0 2rpx 6rpx rgba(15, 23, 42, 0.06);
	transition: all 0.3s;
	position: relative;
}

.menu-item:last-child {
	margin-bottom: 0;
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
	font-size: 26rpx;
}

.menu-content {
	flex: 1;
}

.menu-title {
	display: block;
	font-size: 30rpx;
	font-weight: 650;
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
	padding: 0 24rpx 30rpx;
	margin-top: 12rpx;
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
	background: #FFFFF0;
	border-radius: 20rpx;
	padding: 25rpx 26rpx;
	box-shadow:
		0 1rpx 0 rgba(255,255,255,0.9) inset,
		0 -1rpx 0 rgba(15,23,42,0.04) inset,
		0 14rpx 32rpx rgba(15,23,42,0.12);
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
	background: linear-gradient(135deg, #2a91e9 0%, #22c1c3 100%);
	padding: 16rpx 32rpx;
	border-radius: 40rpx;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(37, 99, 235, 0.35);
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

/* 绑定微信号弹窗 */
.bind-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.45);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.bind-dialog {
	width: 80%;
	max-width: 640rpx;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 32rpx 28rpx 24rpx;
	box-shadow: 0 16rpx 40rpx rgba(15, 23, 42, 0.25);
}

.bind-title {
	display: block;
	font-size: 32rpx;
	font-weight: 600;
	color: #111827;
	margin-bottom: 12rpx;
}

.bind-desc {
	display: block;
	font-size: 24rpx;
	color: #6b7280;
	line-height: 1.5;
	margin-bottom: 20rpx;
}

.bind-input {
	width: 100%;
	box-sizing: border-box;
	border: 1rpx solid #e5e7eb;
	border-radius: 999rpx;
	padding: 14rpx 22rpx;
	font-size: 26rpx;
	margin-bottom: 24rpx;
	background-color: #f9fafb;
}

.bind-actions {
	display: flex;
	justify-content: flex-end;
	gap: 16rpx;
}

.bind-btn {
	min-width: 140rpx;
	padding: 12rpx 20rpx;
	border-radius: 999rpx;
	font-size: 26rpx;
	line-height: 1.4;
	text-align: center;
}

.bind-btn.cancel {
	background-color: #e5e7eb;
	color: #374151;
}

.bind-btn.confirm {
	background: linear-gradient(135deg, #2a91e9 0%, #22c1c3 100%);
	color: #ffffff;
}
