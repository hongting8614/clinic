<template>
	<view class="container">
		<!-- 临时：获取OpenID按钮（配置完成后删除） -->
		<button @click="getOpenId" style="margin: 20rpx; background: #ff6b6b; color: white;">
			🔑 点击获取我的OpenID
		</button>
		
		<!-- 表头 -->
		<view class="page-header">
			<view class="clinic-icon">🏥</view>
			<view class="page-title">北京欢乐谷医务室</view>
			<view class="page-subtitle">药品管理系统</view>
		</view>
		
		<!-- 欢迎语 -->
		<view class="welcome-section">
			<view class="greeting">👤 {{ userName }}，{{ greeting }}！</view>
			<view class="date">{{ todayDate }}</view>
		</view>
		
		<!-- 快捷操作 -->
		<view class="quick-actions">
			<view class="section-title">快捷操作</view>
			<view class="action-grid">
				<view class="action-item" @click="scanCode">
					<view class="action-icon">📷</view>
					<view class="action-text">扫码入库</view>
				</view>
				<view class="action-item" @click="goToIn">
					<view class="action-icon">📦</view>
					<view class="action-text">入库单据</view>
				</view>
				<view class="action-item" @click="goToOut">
					<view class="action-icon">📤</view>
					<view class="action-text">出库单据</view>
				</view>
				<view class="action-item" @click="goToInventory">
					<view class="action-icon">🔍</view>
					<view class="action-text">库存盘点</view>
				</view>
			</view>
		</view>
		
		<!-- 今日数据 -->
		<view class="today-data">
			<view class="section-title">今日数据</view>
			<view class="data-grid">
				<view class="data-item">
					<view class="data-label">入库</view>
					<view class="data-value">{{ todayData.in }}</view>
					<view class="data-unit">盒</view>
				</view>
				<view class="data-item">
					<view class="data-label">出库</view>
					<view class="data-value">{{ todayData.out }}</view>
					<view class="data-unit">盒</view>
				</view>
				<view class="data-item">
					<view class="data-label">消耗</view>
					<view class="data-value">{{ todayData.consume }}</view>
					<view class="data-unit">盒</view>
				</view>
				<view class="data-item">
					<view class="data-label">请领</view>
					<view class="data-value">{{ todayData.requisition }}</view>
					<view class="data-unit">盒</view>
				</view>
			</view>
		</view>
		
		<!-- 预警提醒 -->
		<view class="alert-section">
			<view class="section-title">
				⚠️ 预警提醒
				<text class="view-all" @click="goToAlerts">查看详情 →</text>
			</view>
			<view class="alert-list">
				<view class="alert-item alert-danger">
					<view class="alert-icon">🔴</view>
					<view class="alert-content">
						<view class="alert-text">近效期药品：{{ alerts.nearExpire }}种</view>
					</view>
				</view>
				<view class="alert-item alert-warning">
					<view class="alert-icon">🟡</view>
					<view class="alert-content">
						<view class="alert-text">库存不足：{{ alerts.lowStock }}种</view>
					</view>
				</view>
				<view class="alert-item alert-info">
					<view class="alert-icon">🔵</view>
					<view class="alert-content">
						<view class="alert-text">待复核单据：{{ alerts.pendingReview }}条</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getTodayStats, getAlertStats } from '@/utils/api.js'

export default {
	data() {
		return {
			userName: '张三',
			greeting: '下午好',
			todayDate: '',
			todayData: {
				in: 0,
				out: 0,
				consume: 0,
				requisition: 0
			},
			alerts: {
				nearExpire: 0,
				lowStock: 0,
				pendingReview: 0
			}
		}
	},
	
	onLoad() {
		this.initPage()
	},
	
	onShow() {
		// 每次显示时刷新数据
		this.loadData()
	},
	
	onPullDownRefresh() {
		this.loadData()
		setTimeout(() => {
			uni.stopPullDownRefresh()
		}, 1000)
	},
	
	methods: {
		// 临时方法：获取OpenID（配置完成后删除）
		async getOpenId() {
			// 方法1：使用云函数（需要先上传云函数）
			try {
				uni.showLoading({ title: '获取中...' })
				const res = await wx.cloud.callFunction({
					name: 'getMyOpenId'
				})
				uni.hideLoading()
				
				const openid = res.result.openid
				console.log('===== 你的OpenID =====')
				console.log(openid)
				console.log('====================')
				
				uni.showModal({
					title: '你的OpenID',
					content: openid,
					confirmText: '复制',
					success: (modalRes) => {
						if (modalRes.confirm) {
							uni.setClipboardData({
								data: openid,
								success: () => {
									uni.showToast({ title: '已复制', icon: 'success' })
								}
							})
						}
					}
				})
			} catch (err) {
				uni.hideLoading()
				console.error('云函数调用失败，尝试方法2...', err)
				
				// 方法2：使用 wx.login（不需要云函数）
				uni.showModal({
					title: '提示',
					content: '云函数未上传。\n\n请先：\n1. 开通云开发\n2. 上传 getMyOpenId 云函数\n\n或者查看控制台输出',
					showCancel: false
				})
				
				// 在控制台输出说明
				console.log('=====================================')
				console.log('如何获取OpenID：')
				console.log('1. 在微信开发者工具顶部点击"云开发"')
				console.log('2. 开通云开发环境')
				console.log('3. 右键 cloudfunctions/getMyOpenId')
				console.log('4. 选择"上传并部署：云端安装依赖"')
				console.log('5. 再次点击此按钮')
				console.log('=====================================')
			}
		},
		
		initPage() {
			this.setGreeting()
			this.setDate()
			this.loadUserInfo()
			this.loadData()
		},
		
		setGreeting() {
			const hour = new Date().getHours()
			if (hour < 12) {
				this.greeting = '上午好'
			} else if (hour < 18) {
				this.greeting = '下午好'
			} else {
				this.greeting = '晚上好'
			}
		},
		
		setDate() {
			const date = new Date()
			const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
			this.todayDate = `今天是 ${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekDays[date.getDay()]}`
		},
		
		loadUserInfo() {
			const userInfo = uni.getStorageSync('userInfo')
			if (userInfo) {
				this.userName = userInfo.name
			}
		},
		
	async loadData() {
		try {
			// 暂时使用默认数据，等云函数上传后再启用
			console.log('提示：云函数还未上传，使用默认数据')
			this.todayData = { in: 0, out: 0, consume: 0, requisition: 0 }
			this.alerts = { nearExpire: 0, lowStock: 0, pendingReview: 0 }
			
			// 云函数上传后，取消下面的注释
			// const [todayStats, alertStats] = await Promise.all([
			// 	getTodayStats().catch(() => ({ in: 0, out: 0, consume: 0, requisition: 0 })),
			// 	getAlertStats().catch(() => ({ nearExpire: 0, lowStock: 0, pendingReview: 0 }))
			// ])
			// this.todayData = todayStats
			// this.alerts = alertStats
		} catch (err) {
			console.error('加载数据失败:', err)
		}
	},
		
		scanCode() {
			uni.scanCode({
				success: (res) => {
					console.log('扫码结果：', res.result)
					// TODO: 处理扫码结果
				}
			})
		},
		
		goToIn() {
			uni.navigateTo({
				url: '/pages-sub/in/add'
			})
		},
		
		goToOut() {
			uni.navigateTo({
				url: '/pages-sub/out/add'
			})
		},
		
		goToInventory() {
			uni.navigateTo({
				url: '/pages-sub/inventory/add'
			})
		},
		
		goToAlerts() {
			uni.switchTab({
				url: '/pages/stock/index'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
}

.page-header {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 40rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	text-align: center;
	box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.3);
}

.clinic-icon {
	font-size: 80rpx;
	margin-bottom: 10rpx;
}

.page-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #FFFFFF;
	margin-bottom: 10rpx;
}

.page-subtitle {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.9);
}

.welcome-section {
	background-color: #FFFFFF;
	padding: 30rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
}

.greeting {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 10rpx;
}

.date {
	font-size: 26rpx;
	color: #999999;
}

.quick-actions {
	background-color: #FFFFFF;
	padding: 30rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.view-all {
	font-size: 26rpx;
	color: #3cc51f;
	font-weight: normal;
}

.action-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 20rpx;
}

.action-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx;
	border-radius: 15rpx;
	background-color: #F8F8F8;
}

.action-icon {
	font-size: 50rpx;
	margin-bottom: 10rpx;
}

.action-text {
	font-size: 24rpx;
	color: #666666;
}

.today-data {
	background-color: #FFFFFF;
	padding: 30rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
}

.data-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 20rpx;
}

.data-item {
	text-align: center;
	padding: 20rpx;
	border-radius: 15rpx;
	background-color: #F8F8F8;
}

.data-label {
	font-size: 24rpx;
	color: #999999;
	margin-bottom: 10rpx;
}

.data-value {
	font-size: 40rpx;
	font-weight: bold;
	color: #3cc51f;
	margin-bottom: 5rpx;
}

.data-unit {
	font-size: 22rpx;
	color: #999999;
}

.alert-section {
	background-color: #FFFFFF;
	padding: 30rpx;
	border-radius: 20rpx;
}

.alert-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.alert-item {
	display: flex;
	align-items: center;
	padding: 20rpx;
	border-radius: 15rpx;
	background-color: #F8F8F8;
}

.alert-icon {
	font-size: 40rpx;
	margin-right: 15rpx;
}

.alert-content {
	flex: 1;
}

.alert-text {
	font-size: 28rpx;
	color: #333333;
}
</style>


