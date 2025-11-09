<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<view class="header-content">
				<text class="header-title">修改实名</text>
			</view>
		</view>
		
		<!-- 表单卡片 -->
		<view class="form-card">
			<view class="form-item">
				<view class="form-label">
					<text class="label-text">实名</text>
					<text class="required">*</text>
				</view>
				<input 
					class="form-input"
					v-model="realName"
					placeholder="请输入真实姓名（2-10个中文字符）"
					maxlength="10"
				/>
				<view class="form-hint">
					<text class="hint-text">请输入您的真实姓名，用于系统实名认证</text>
				</view>
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
			realName: ''
		}
	},
	
	onLoad() {
		const userInfo = uni.getStorageSync('userInfo')
		if (userInfo && userInfo.realName) {
			this.realName = userInfo.realName
		}
	},
	
	methods: {
		// 验证实名格式
		validateRealName(name) {
			if (!name) {
				return { valid: false, message: '实名不能为空' }
			}
			
			if (!/^[\u4e00-\u9fa5]{2,10}$/.test(name)) {
				return { valid: false, message: '实名格式不正确，请输入2-10个中文字符' }
			}
			
			return { valid: true, message: '格式正确' }
		},
		
		// 提交修改
		async handleSubmit() {
			// 1. 验证实名格式
			const validation = this.validateRealName(this.realName)
			if (!validation.valid) {
				uni.showToast({
					title: validation.message,
					icon: 'none',
					duration: 2000
				})
				return
			}
			
			// 2. 提交修改
			uni.showLoading({ title: '修改中...', mask: true })
			
			try {
				const userInfo = uni.getStorageSync('userInfo')
				const result = await wx.cloud.callFunction({
					name: 'updateMyInfo',
					data: {
						realName: this.realName
					}
				})
				
				uni.hideLoading()
				
				if (result.result && result.result.success) {
					// 更新本地用户信息
					userInfo.realName = this.realName
					uni.setStorageSync('userInfo', userInfo)
					
					uni.showToast({
						title: '实名修改成功',
						icon: 'success'
					})
					
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				} else {
					throw new Error(result.result?.message || '实名修改失败')
				}
			} catch (err) {
				uni.hideLoading()
				console.error('实名修改失败:', err)
				uni.showToast({
					title: err.message || '实名修改失败',
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
	}
	
	.form-hint {
		margin-top: 15rpx;
		
		.hint-text {
			font-size: 24rpx;
			color: #969799;
		}
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

