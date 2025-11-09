<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<view class="header-content">
				<text class="header-title">设置</text>
			</view>
		</view>
		
		<!-- 个人信息卡片 -->
		<view class="info-card">
			<view class="card-title">
				<text class="title-icon">👤</text>
				<text class="title-text">个人信息</text>
			</view>
			
			<view class="info-item">
				<text class="info-label">姓名</text>
				<text class="info-value">{{ userInfo.name }}</text>
			</view>
			
			<view class="info-item">
				<text class="info-label">实名</text>
				<text class="info-value">{{ userInfo.realName || '未设置' }}</text>
				<view class="info-action" @click="goEditRealName">
					<text class="action-text">{{ userInfo.realName ? '修改' : '设置' }}</text>
				</view>
			</view>
			
			<view class="info-item">
				<text class="info-label">手机号</text>
				<text class="info-value">{{ userInfo.phone || '未设置' }}</text>
			</view>
			
			<view class="info-item">
				<text class="info-label">角色</text>
				<text class="info-value">{{ userInfo.roleText }}</text>
			</view>
		</view>
		
		<!-- 安全设置卡片 -->
		<view class="security-card">
			<view class="card-title">
				<text class="title-icon">🔒</text>
				<text class="title-text">安全设置</text>
			</view>
			
			<view class="menu-item" @click="goChangePassword">
				<view class="menu-left">
					<text class="menu-icon">🔑</text>
					<text class="menu-text">修改密码</text>
				</view>
				<text class="menu-arrow">›</text>
			</view>
		</view>
		
		<!-- 其他设置 -->
		<view class="other-card">
			<view class="card-title">
				<text class="title-icon">⚙️</text>
				<text class="title-text">其他</text>
			</view>
			
			<view class="menu-item" @click="goUserList" v-if="canManageUser">
				<view class="menu-left">
					<text class="menu-icon">👥</text>
					<text class="menu-text">用户管理</text>
				</view>
				<text class="menu-arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script>
import { hasPermission } from '@/utils/permission.js'

export default {
	data() {
		return {
			userInfo: {}
		}
	},
	
	computed: {
		canManageUser() {
			const userInfo = uni.getStorageSync('userInfo')
			if (!userInfo) return false
			return hasPermission(userInfo.role, 'user.list')
		}
	},
	
	onLoad() {
		this.loadUserInfo()
	},
	
	onShow() {
		// 从实名编辑页面返回时刷新
		this.loadUserInfo()
	},
	
	methods: {
		loadUserInfo() {
			const userInfo = uni.getStorageSync('userInfo')
			if (userInfo) {
				this.userInfo = userInfo
			}
		},
		
		goEditRealName() {
			uni.navigateTo({
				url: '/pages-sub/setting/edit-realname'
			})
		},
		
		goChangePassword() {
			uni.navigateTo({
				url: '/pages-sub/setting/change-password'
			})
		},
		
		goUserList() {
			uni.navigateTo({
				url: '/pages-sub/setting/user-list'
			})
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

.info-card,
.security-card,
.other-card {
	background: white;
	margin: 30rpx;
	padding: 30rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.card-title {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 2rpx solid #f1f5f9;
	
	.title-icon {
		font-size: 32rpx;
	}
	
	.title-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #323233;
	}
}

.info-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f1f5f9;
	
	&:last-child {
		border-bottom: none;
	}
	
	.info-label {
		font-size: 28rpx;
		color: #646566;
		width: 120rpx;
	}
	
	.info-value {
		flex: 1;
		font-size: 28rpx;
		color: #323233;
		font-weight: 500;
		text-align: right;
		margin-right: 20rpx;
	}
	
	.info-action {
		padding: 8rpx 20rpx;
		background: #07C160;
		border-radius: 20rpx;
		
		.action-text {
			font-size: 24rpx;
			color: white;
		}
	}
}

.menu-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f1f5f9;
	
	&:last-child {
		border-bottom: none;
	}
	
	.menu-left {
		display: flex;
		align-items: center;
		gap: 20rpx;
		
		.menu-icon {
			font-size: 32rpx;
		}
		
		.menu-text {
			font-size: 28rpx;
			color: #323233;
		}
	}
	
	.menu-arrow {
		font-size: 32rpx;
		color: #c8c9cc;
	}
	
	&:active {
		background: #f7f8fa;
	}
}
</style>
