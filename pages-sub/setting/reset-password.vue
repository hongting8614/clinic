<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<view class="header-content">
				<text class="header-title">重置密码</text>
			</view>
		</view>
		
		<!-- 表单卡片 -->
		<view class="form-card">
			<!-- 微信号 -->
			<view class="form-item">
				<view class="form-label">
					<text class="label-text">微信号</text>
					<text class="required">*</text>
				</view>
				<input 
					class="form-input"
					v-model="form.wechatId"
					placeholder="请输入您的微信号"
					:disabled="step > 1"
				/>
				<view class="form-hint">
					<text class="hint-text">请输入您注册时使用的微信号</text>
				</view>
			</view>
			
			<!-- 验证码 -->
			<view class="form-item" v-if="step >= 2">
				<view class="form-label">
					<text class="label-text">验证码</text>
					<text class="required">*</text>
				</view>
				<view class="code-input-row">
					<input 
						class="form-input code-input"
						v-model="form.verifyCode"
						placeholder="请输入6位验证码"
						type="number"
						maxlength="6"
					/>
					<view class="send-code-btn" @click="sendVerifyCode" :class="{ 'disabled': countdown > 0 }">
						<text class="code-btn-text">{{ countdown > 0 ? `${countdown}秒后重发` : '发送验证码' }}</text>
					</view>
				</view>
				<view class="form-hint">
					<text class="hint-text">验证码已发送到您的微信，请查收</text>
				</view>
			</view>
			
			<!-- 新密码 -->
			<view class="form-item" v-if="step >= 3">
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
			<view v-if="step >= 3 && form.newPassword" class="password-tips">
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
			<view class="form-item" v-if="step >= 3">
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
			<view v-if="step >= 3 && form.confirmPassword && form.newPassword !== form.confirmPassword" class="error-tip">
				<text class="error-icon">⚠️</text>
				<text class="error-text">两次输入的密码不一致</text>
			</view>
		</view>
		
		<!-- 提交按钮 -->
		<view class="submit-container">
			<view class="submit-btn" @tap="handleNext" v-if="step === 1">
				<text class="submit-text">下一步：发送验证码</text>
			</view>
			<view class="submit-btn" @tap="handleVerify" v-if="step === 2">
				<text class="submit-text">验证验证码</text>
			</view>
			<view class="submit-btn" @tap="handleReset" v-if="step === 3">
				<text class="submit-text">确认重置密码</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			step: 1, // 1: 输入微信号, 2: 输入验证码, 3: 输入新密码
			form: {
				wechatId: '',
				verifyCode: '',
				newPassword: '',
				confirmPassword: ''
			},
			showNewPassword: false,
			showConfirmPassword: false,
			countdown: 0,
			countdownTimer: null,
			verifyToken: '' // 验证码验证后的token
		}
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
	
	onUnload() {
		// 清除倒计时
		if (this.countdownTimer) {
			clearInterval(this.countdownTimer)
		}
	},
	
	methods: {
		// 验证微信号格式
		validateWechatId(wechatId) {
			if (!wechatId) {
				return { valid: false, message: '微信号不能为空' }
			}
			
			// 微信号格式：6-20个字符，字母、数字、下划线、减号
			if (!/^[a-zA-Z0-9_-]{6,20}$/.test(wechatId)) {
				return { valid: false, message: '微信号格式不正确，请输入6-20个字符（字母、数字、下划线、减号）' }
			}
			
			return { valid: true, message: '格式正确' }
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
		
		// 下一步：发送验证码
		async handleNext() {
			// 1. 验证微信号
			const wechatCheck = this.validateWechatId(this.form.wechatId)
			if (!wechatCheck.valid) {
				uni.showToast({
					title: wechatCheck.message,
					icon: 'none',
					duration: 2000
				})
				return
			}
			
			// 2. 发送验证码
			await this.sendVerifyCode()
		},
		
		// 发送验证码
		async sendVerifyCode() {
			if (this.countdown > 0) {
				return
			}
			
			// 如果是第一步，需要先验证微信号
			if (this.step === 1) {
				const wechatCheck = this.validateWechatId(this.form.wechatId)
				if (!wechatCheck.valid) {
					uni.showToast({
						title: wechatCheck.message,
						icon: 'none',
						duration: 2000
					})
					return
				}
			}
			
			uni.showLoading({ title: '发送中...', mask: true })
			
			try {
				const result = await wx.cloud.callFunction({
					name: 'sendResetPasswordCode',
					data: {
						wechatId: this.form.wechatId
					}
				})
				
				uni.hideLoading()
				
				if (result.result && result.result.success) {
					// 如果返回了验证码，显示在页面上
					if (result.result.verifyCode) {
						uni.showModal({
							title: '验证码已生成',
							content: `您的验证码是：${result.result.verifyCode}\n\n请妥善保管，5分钟内有效`,
							showCancel: false,
							confirmText: '我知道了'
						})
					} else {
						uni.showToast({
							title: '验证码已发送到您的微信',
							icon: 'success'
						})
					}
					
					// 进入下一步
					if (this.step === 1) {
						this.step = 2
					}
					
					// 开始倒计时
					this.startCountdown()
				} else {
					throw new Error(result.result?.message || '发送验证码失败')
				}
			} catch (err) {
				uni.hideLoading()
				console.error('发送验证码失败:', err)
				uni.showToast({
					title: err.message || '发送验证码失败',
					icon: 'none',
					duration: 2000
				})
			}
		},
		
		// 开始倒计时
		startCountdown() {
			this.countdown = 60
			this.countdownTimer = setInterval(() => {
				this.countdown--
				if (this.countdown <= 0) {
					clearInterval(this.countdownTimer)
					this.countdownTimer = null
				}
			}, 1000)
		},
		
		// 验证验证码
		async handleVerify() {
			// 1. 验证验证码
			if (!this.form.verifyCode || this.form.verifyCode.length !== 6) {
				uni.showToast({
					title: '请输入6位验证码',
					icon: 'none'
				})
				return
			}
			
			uni.showLoading({ title: '验证中...', mask: true })
			
			try {
				const result = await wx.cloud.callFunction({
					name: 'verifyResetPasswordCode',
					data: {
						wechatId: this.form.wechatId,
						verifyCode: this.form.verifyCode
					}
				})
				
				uni.hideLoading()
				
				if (result.result && result.result.success) {
					// 保存验证token
					this.verifyToken = result.result.token
					
					uni.showToast({
						title: '验证码正确',
						icon: 'success'
					})
					
					// 进入下一步
					this.step = 3
				} else {
					throw new Error(result.result?.message || '验证码错误')
				}
			} catch (err) {
				uni.hideLoading()
				console.error('验证验证码失败:', err)
				uni.showToast({
					title: err.message || '验证码错误',
					icon: 'none',
					duration: 2000
				})
			}
		},
		
		// 重置密码
		async handleReset() {
			// 1. 验证新密码格式
			const passwordCheck = this.validatePassword(this.form.newPassword)
			if (!passwordCheck.valid) {
				uni.showToast({
					title: passwordCheck.message,
					icon: 'none',
					duration: 2000
				})
				return
			}
			
			// 2. 验证确认密码
			if (this.form.newPassword !== this.form.confirmPassword) {
				uni.showToast({
					title: '两次输入的密码不一致',
					icon: 'none'
				})
				return
			}
			
			// 3. 提交重置
			uni.showLoading({ title: '重置中...', mask: true })
			
			try {
				const result = await wx.cloud.callFunction({
					name: 'resetPassword',
					data: {
						wechatId: this.form.wechatId,
						verifyToken: this.verifyToken,
						newPassword: this.form.newPassword
					}
				})
				
				uni.hideLoading()
				
				if (result.result && result.result.success) {
					uni.showToast({
						title: '密码重置成功',
						icon: 'success'
					})
					
					// 延迟返回登录页
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/login/index'
						})
					}, 1500)
				} else {
					throw new Error(result.result?.message || '密码重置失败')
				}
			} catch (err) {
				uni.hideLoading()
				console.error('密码重置失败:', err)
				uni.showToast({
					title: err.message || '密码重置失败',
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
	
	.header-content {
		.header-title {
			display: block;
			font-size: 40rpx;
			font-weight: bold;
			color: white;
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
	}
	
	.form-input {
		width: 100%;
		height: 88rpx;
		padding: 0 30rpx;
		background: #f7f8fa;
		border: 2rpx solid #ebedf0;
		border-radius: 12rpx;
		 font-size: 28rpx;
		color: #323233;
		
		&:focus {
			border-color: #07C160;
			background: white;
		}
		
		&:disabled {
			background: #f5f5f5;
			color: #969799;
		}
	}
	
	.code-input-row {
		display: flex;
		align-items: center;
		gap: 20rpx;
		
		.code-input {
			flex: 1;
		}
		
		.send-code-btn {
			width: 200rpx;
			height: 88rpx;
			background: linear-gradient(135deg, #07C160 0%, #05a550 100%);
			border-radius: 12rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 2rpx 8rpx rgba(7, 193, 96, 0.2);
			
			.code-btn-text {
				color: white;
				font-size: 26rpx;
				font-weight: 500;
			}
			
			&.disabled {
				background: #c8c9cc;
				box-shadow: none;
			}
			
			&:active:not(.disabled) {
				transform: scale(0.98);
			}
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
	
	.form-hint {
		margin-top: 15rpx;
		
		.hint-text {
			font-size: 24rpx;
			color: #969799;
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

