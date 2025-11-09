<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<view class="header-content">
				<text class="header-title">修改密码</text>
			</view>
			<view class="forgot-password-link" @click="goResetPassword">
				<text class="link-text">忘记密码？</text>
			</view>
		</view>
		
		<!-- 表单卡片 -->
		<view class="form-card">
			<!-- 当前密码 -->
			<view class="form-item">
				<view class="form-label">
					<text class="label-text">当前密码</text>
					<text class="required" v-if="hasPassword">*</text>
					<text class="optional" v-else>（首次设置可留空）</text>
				</view>
				<input 
					class="form-input"
					type="password"
					v-model="form.oldPassword"
					:placeholder="hasPassword ? '请输入当前密码' : '首次设置密码可留空'"
					:password="!showOldPassword"
				/>
				<view class="password-toggle" @click="showOldPassword = !showOldPassword">
					<text class="toggle-icon">{{ showOldPassword ? '👁️' : '👁️‍🗨️' }}</text>
				</view>
			</view>
			
			<!-- 新密码 -->
			<view class="form-item">
				<view class="form-label">
					<text class="label-text">新密码</text>
					<text class="required">*</text>
				</view>
				<input 
					class="form-input"
					type="password"
					v-model="form.newPassword"
					placeholder="请输入新密码（不少于8位，包含大小写字母和数字）"
					:password="!showNewPassword"
				/>
				<view class="password-toggle" @click="showNewPassword = !showNewPassword">
					<text class="toggle-icon">{{ showNewPassword ? '👁️' : '👁️‍🗨️' }}</text>
				</view>
			</view>
			
			<!-- 密码强度提示 -->
			<view v-if="form.newPassword" class="password-tips">
				<view class="tip-item" :class="{ 'valid': hasLength }">
					<text class="tip-icon">{{ hasLength ? '✓' : '○' }}</text>
					<text class="tip-text">至少8位</text>
				</view>
				<view class="tip-item" :class="{ 'valid': hasUpperCase }">
					<text class="tip-icon">{{ hasUpperCase ? '✓' : '○' }}</text>
					<text class="tip-text">包含大写字母</text>
				</view>
				<view class="tip-item" :class="{ 'valid': hasLowerCase }">
					<text class="tip-icon">{{ hasLowerCase ? '✓' : '○' }}</text>
					<text class="tip-text">包含小写字母</text>
				</view>
				<view class="tip-item" :class="{ 'valid': hasNumber }">
					<text class="tip-icon">{{ hasNumber ? '✓' : '○' }}</text>
					<text class="tip-text">包含数字</text>
				</view>
			</view>
			
			<!-- 确认新密码 -->
			<view class="form-item">
				<view class="form-label">
					<text class="label-text">确认新密码</text>
					<text class="required">*</text>
				</view>
				<input 
					class="form-input"
					type="password"
					v-model="form.confirmPassword"
					placeholder="请再次输入新密码"
					:password="!showConfirmPassword"
				/>
				<view class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
					<text class="toggle-icon">{{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}</text>
				</view>
			</view>
			
			<!-- 密码匹配提示 -->
			<view v-if="form.confirmPassword && form.newPassword !== form.confirmPassword" class="error-tip">
				<text class="error-icon">⚠️</text>
				<text class="error-text">两次输入的密码不一致</text>
			</view>
		</view>
		
		<!-- 提交按钮 -->
		<view class="submit-container">
			<view class="submit-btn" @tap="handleSubmit">
				<text class="submit-text">确认修改</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				oldPassword: '',
				newPassword: '',
				confirmPassword: ''
			},
			showOldPassword: false,
			showNewPassword: false,
			showConfirmPassword: false,
			hasPassword: false // 是否已设置密码
		}
	},
	
	onLoad() {
		// 检查用户是否已设置密码
		this.checkPasswordStatus()
	},
	
	computed: {
		// 密码长度检查
		hasLength() {
			return this.form.newPassword.length >= 8
		},
		
		// 包含大写字母
		hasUpperCase() {
			return /[A-Z]/.test(this.form.newPassword)
		},
		
		// 包含小写字母
		hasLowerCase() {
			return /[a-z]/.test(this.form.newPassword)
		},
		
		// 包含数字
		hasNumber() {
			return /[0-9]/.test(this.form.newPassword)
		},
		
		// 密码强度是否满足要求
		isPasswordValid() {
			return this.hasLength && this.hasUpperCase && this.hasLowerCase && this.hasNumber
		}
	},
	
	methods: {
		// 跳转到重置密码页面
		goResetPassword() {
			uni.navigateTo({
				url: '/pages-sub/setting/reset-password'
			})
		},
		
		// 验证密码格式
		validatePassword(password) {
			if (!password) {
				return { valid: false, message: '密码不能为空' }
			}
			
			if (password.length < 8) {
				return { valid: false, message: '密码长度不能少于8位' }
			}
			
			if (!/[A-Z]/.test(password)) {
				return { valid: false, message: '密码必须包含至少一个大写字母' }
			}
			
			if (!/[a-z]/.test(password)) {
				return { valid: false, message: '密码必须包含至少一个小写字母' }
			}
			
			if (!/[0-9]/.test(password)) {
				return { valid: false, message: '密码必须包含至少一个数字' }
			}
			
			return { valid: true, message: '密码格式正确' }
		},
		
		// 提交修改
		async handleSubmit() {
			// 1. 验证当前密码（首次设置密码时可以为空）
			// 如果用户没有设置密码，oldPassword可以为空
			// 系统会自动判断是首次设置还是修改密码
			
			// 2. 验证新密码格式
			const passwordCheck = this.validatePassword(this.form.newPassword)
			if (!passwordCheck.valid) {
				uni.showToast({
					title: passwordCheck.message,
					icon: 'none',
					duration: 2000
				})
				return
			}
			
			// 3. 验证确认密码
			if (this.form.newPassword !== this.form.confirmPassword) {
				uni.showToast({
					title: '两次输入的密码不一致',
					icon: 'none'
				})
				return
			}
			
			// 4. 验证新密码不能与旧密码相同（如果已设置密码）
			if (this.hasPassword && this.form.oldPassword && this.form.oldPassword === this.form.newPassword) {
				uni.showToast({
					title: '新密码不能与当前密码相同',
					icon: 'none'
				})
				return
			}
			
			// 5. 提交修改
			uni.showLoading({ title: '修改中...', mask: true })
			
			try {
				const result = await wx.cloud.callFunction({
					name: 'changePassword',
					data: {
						oldPassword: this.form.oldPassword,
						newPassword: this.form.newPassword
					}
				})
				
				uni.hideLoading()
				
				if (result.result && result.result.success) {
					uni.showToast({
						title: '密码修改成功',
						icon: 'success'
					})
					
					// 清空表单
					this.form = {
						oldPassword: '',
						newPassword: '',
						confirmPassword: ''
					}
					
					// 延迟返回
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				} else {
					throw new Error(result.result?.message || '密码修改失败')
				}
			} catch (err) {
				uni.hideLoading()
				console.error('密码修改失败:', err)
				uni.showToast({
					title: err.message || '密码修改失败',
					icon: 'none',
					duration: 2000
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #f7f8fa;
	padding-bottom: 40rpx;
}

.page-header {
	background: linear-gradient(135deg, #07C160 0%, #05a550 100%);
	padding: 40rpx 30rpx 30rpx;
	position: relative;
	
	.header-content {
		.header-title {
			display: block;
			font-size: 40rpx;
			font-weight: bold;
			color: white;
		}
	}
	
	.forgot-password-link {
		position: absolute;
		right: 30rpx;
		top: 40rpx;
		
		.link-text {
			font-size: 26rpx;
			color: white;
			text-decoration: underline;
			opacity: 0.9;
		}
		
		&:active {
			opacity: 0.7;
		}
	}
}

.form-card {
	background: white;
	margin: 30rpx;
	padding: 30rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.form-item {
	position: relative;
	margin-bottom: 40rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
	
	.form-label {
		display: flex;
		align-items: center;
		gap: 8rpx;
		margin-bottom: 20rpx;
		
		.label-text {
			font-size: 28rpx;
			font-weight: 500;
			color: #323233;
		}
		
		.required {
			color: #ee0a24;
			font-size: 28rpx;
		}
		
		.optional {
			color: #969799;
			font-size: 24rpx;
			margin-left: 8rpx;
		}
	}
	
	.form-input {
		width: 100%;
		height: 88rpx;
		padding: 0 100rpx 0 30rpx;
		background: #f7f8fa;
		border: 2rpx solid #ebedf0;
		border-radius: 12rpx;
		font-size: 28rpx;
		color: #323233;
		
		&:focus {
			border-color: #07C160;
			background: white;
		}
	}
	
	.password-toggle {
		position: absolute;
		right: 30rpx;
		top: 60rpx;
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.toggle-icon {
			font-size: 36rpx;
		}
	}
}

.password-tips {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	margin-top: 20rpx;
	padding: 20rpx;
	background: #f7f8fa;
	border-radius: 12rpx;
	
	.tip-item {
		display: flex;
		align-items: center;
		gap: 8rpx;
		flex: 1;
		min-width: 140rpx;
		
		.tip-icon {
			font-size: 24rpx;
			color: #c8c9cc;
		}
		
		.tip-text {
			font-size: 24rpx;
			color: #646566;
		}
		
		&.valid {
			.tip-icon {
				color: #07C160;
			}
			
			.tip-text {
				color: #07C160;
				font-weight: 500;
			}
		}
	}
}

.error-tip {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-top: 20rpx;
	padding: 20rpx;
	background: #fff3e0;
	border-radius: 12rpx;
	
	.error-icon {
		font-size: 28rpx;
	}
	
	.error-text {
		font-size: 26rpx;
		color: #ff9800;
	}
}

.submit-container {
	padding: 0 30rpx;
	margin-top: 40rpx;
	
	.submit-btn {
		width: 100%;
		height: 88rpx;
		background: linear-gradient(135deg, #07C160 0%, #05a550 100%);
		border-radius: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 16rpx rgba(7, 193, 96, 0.25);
		
		.submit-text {
			color: white;
			font-size: 32rpx;
			font-weight: 500;
		}
		
		&:active {
			transform: scale(0.98);
			box-shadow: 0 2rpx 8rpx rgba(7, 193, 96, 0.3);
		}
	}
}
</style>

