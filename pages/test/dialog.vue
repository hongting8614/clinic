<template>
	<view class="test-page">
		<view class="content">
			<text class="title">绑定微信号</text>
			<text class="desc">当前微信未在系统中绑定账号，请输入管理员在后台配置的微信号完成绑定。</text>
		</view>
		<!-- 始终显示绑定微信号弹窗 -->
		<view class="bind-mask">
			<view class="bind-dialog">
				<text class="bind-title">绑定微信号</text>
				<text class="bind-desc">请输入管理员在系统中录入的微信号，首登后将与当前微信永久绑定。</text>
				<input
					class="bind-input"
					v-model="wechatIdInput"
					placeholder="请输入微信号"
				/>
				<view class="bind-actions">
					<button class="bind-btn cancel" @tap="handleCancel">取消</button>
					<button class="bind-btn confirm" @tap="handleConfirm" :loading="isLoading">绑定并登录</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { login } from '@/utils/auth.js'

export default {
	data() {
		return {
			wechatIdInput: '',
			isLoading: false
		}
	},
	onLoad() {
		console.log('===== 绑定微信号页面 onLoad =====')
	},
	methods: {
		async handleConfirm() {
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
				console.log('绑定页 login 返回:', result)
				if (result && result.success) {
					uni.showToast({
						title: '绑定并登录成功',
						icon: 'success'
					})
					setTimeout(() => {
						uni.switchTab({ url: '/pages/user/index' })
					}, 500)
				} else {
					uni.showToast({
						title: (result && result.message) || '绑定失败，请联系管理员',
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
		handleCancel() {
			// 优先返回上一页，否则回到“我的”
			const pages = getCurrentPages()
			if (pages && pages.length > 1) {
				uni.navigateBack()
			} else {
				uni.switchTab({ url: '/pages/user/index' })
			}
		}
	}
}
</script>

<style>
.test-page {
	min-height: 100vh;
	background: #f3f4f6;
	padding: 40rpx 24rpx;
	box-sizing: border-box;
}

.content {
	margin-bottom: 40rpx;
}

.title {
	display: block;
	font-size: 32rpx;
	font-weight: 600;
	margin-bottom: 12rpx;
}

.desc {
	display: block;
	font-size: 24rpx;
	color: #6b7280;
}

/* 直接复用绑定弹窗样式 */
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
</style>
