<template>
	<view class="page">
		<!-- 顶部渐变背景卡片 -->
		<view class="header-card">
			<view class="header-content">
				<view class="clinic-info">
					<!-- 医务室专业Logo -->
					<view class="clinic-logo">
						<view class="logo-circle">
							<view class="logo-cross">
								<view class="cross-horizontal"></view>
								<view class="cross-vertical"></view>
							</view>
						</view>
						<view class="logo-pulse pulse-1"></view>
						<view class="logo-pulse pulse-2"></view>
					</view>
					
				<view class="clinic-text">
					<text class="clinic-name">爱康医务室管理系统</text>
					<text class="clinic-name-en">AIKANG CLINIC MANAGEMENT SYSTEM</text>
					<text class="clinic-subtitle">● 北京欢乐谷医务室 ●</text>
				</view>
	</view>
		</view>
	</view>
		
		<!-- 快捷操作区 - 科技风格 -->
		<view class="quick-actions">
			<view class="section-header">
				<text class="section-title">快捷操作</text>
				<text class="section-subtitle">Quick Actions</text>
			</view>
		<!-- 门诊登记 - 占满整行 -->
		<view class="clinic-banner" @tap="goToPage('/pages-sub/clinic/add')">
			<view class="clinic-banner-icon">
				<view class="clinic-cross-h"></view>
				<view class="clinic-cross-v"></view>
				<view class="clinic-circle-bg"></view>
			</view>
		<view class="clinic-banner-content">
			<view class="clinic-banner-title">门诊登记表</view>
		</view>
			<view class="clinic-banner-arrow">→</view>
		</view>
		
		<!-- 新建入库单 - 快捷入口 -->
		<view class="inbound-banner" @tap="goToPage('/pages-sub/in/add')">
			<view class="inbound-banner-icon">
				<view class="inbound-box">
					<view class="box-top"></view>
					<view class="box-front"></view>
					<view class="arrow-in">↓</view>
				</view>
			</view>
		<view class="inbound-banner-content">
			<view class="inbound-banner-title">新建入库单</view>
		</view>
			<view class="inbound-banner-badge">NEW</view>
			<view class="inbound-banner-arrow">→</view>
		</view>
		
		<view class="action-grid">
				<!-- 入库 -->
			<view class="action-card primary" @tap="goToPage('/pages-sub/in/list')">
					<view class="action-icon-bg primary">
						<view class="icon-shape">
							<view class="arrow-down"></view>
							<view class="box-base"></view>
						</view>
					</view>
				<text class="action-label">入库管理</text>
				<text class="action-desc">药品入库、复核审批</text>
					<view class="action-badge">IN</view>
				</view>
				
				<!-- 出库 -->
			<view class="action-card success" @tap="goToPage('/pages-sub/out/list')">
					<view class="action-icon-bg success">
						<view class="icon-shape">
							<view class="arrow-up"></view>
							<view class="box-base"></view>
						</view>
					</view>
				<text class="action-label">出库管理</text>
				<text class="action-desc">园区领用、双签审批</text>
					<view class="action-badge">OUT</view>
				</view>
				
				<!-- 库存 -->
				<view class="action-card warning" @tap="goToPage('/pages/stock/index')">
					<view class="action-icon-bg warning">
						<view class="icon-shape">
							<view class="stack-layer layer-1"></view>
							<view class="stack-layer layer-2"></view>
							<view class="stack-layer layer-3"></view>
						</view>
					</view>
					<text class="action-label">库存查询</text>
					<text class="action-desc">实时库存监控</text>
					<view class="action-badge">INV</view>
				</view>
				
			<!-- 日消耗 -->
			<view class="action-card info" @tap="goToPage('/pages-sub/consume/add')">
				<view class="action-icon-bg info">
					<view class="icon-shape">
						<view class="chart-bar bar-1"></view>
						<view class="chart-bar bar-2"></view>
						<view class="chart-bar bar-3"></view>
						<view class="chart-axis"></view>
					</view>
				</view>
				<text class="action-label">日消耗</text>
				<text class="action-desc">每日药品消耗</text>
				<view class="action-badge">USE</view>
			</view>
			
				<!-- 药品档案 -->
				<view class="action-card teal" @tap="goToPage('/pages-sub/drug/list')">
					<view class="action-icon-bg teal">
					<view class="icon-shape">
							<view class="pill-shape"></view>
							<view class="pill-shape pill-2"></view>
					</view>
				</view>
					<text class="action-label">药品档案</text>
					<text class="action-desc">档案管理</text>
					<view class="action-badge">DRG</view>
		</view>
		
				<!-- 报表统计 -->
				<view class="action-card purple" @tap="goToPage('/pages/record/index')">
					<view class="action-icon-bg purple">
						<view class="icon-shape">
							<view class="chart-bar bar-1"></view>
							<view class="chart-bar bar-2"></view>
							<view class="chart-bar bar-3"></view>
							<view class="chart-axis"></view>
			</view>
			</view>
					<text class="action-label">数据报表</text>
					<text class="action-desc">统计分析</text>
					<view class="action-badge">RPT</view>
		</view>
		</view>
	</view>
		
		
		<!-- 今日数据 - 数据可视化 -->
		<view class="stats-section">
			<view class="section-header">
				<text class="section-title">今日数据</text>
				<text class="section-subtitle">Today's Statistics</text>
			</view>
			<view class="stats-grid">
				<!-- 入库统计 -->
				<view class="stat-card">
					<view class="stat-icon-wrapper blue">
						<view class="stat-icon-shape">
							<view class="mini-arrow-down"></view>
							<view class="mini-box"></view>
						</view>
					</view>
					<view class="stat-content">
						<text class="stat-value">{{ todayStats.inCount }}</text>
						<text class="stat-label">入库单</text>
						<text class="stat-unit">笔</text>
					</view>
					<view class="stat-decorative-line blue"></view>
				</view>
				
				<!-- 出库统计 -->
				<view class="stat-card">
					<view class="stat-icon-wrapper green">
						<view class="stat-icon-shape">
							<view class="mini-arrow-up"></view>
							<view class="mini-box"></view>
						</view>
					</view>
					<view class="stat-content">
						<text class="stat-value">{{ todayStats.outCount }}</text>
						<text class="stat-label">出库单</text>
						<text class="stat-unit">笔</text>
					</view>
					<view class="stat-decorative-line green"></view>
				</view>
				
				<!-- 药品种类 -->
				<view class="stat-card">
					<view class="stat-icon-wrapper orange">
						<view class="stat-icon-shape">
							<view class="pill-shape"></view>
							<view class="pill-shape pill-2"></view>
						</view>
					</view>
					<view class="stat-content">
						<text class="stat-value">{{ todayStats.totalDrugs }}</text>
						<text class="stat-label">药品种类</text>
						<text class="stat-unit">种</text>
					</view>
					<view class="stat-decorative-line orange"></view>
				</view>
				
				<!-- 库存预警 -->
				<view class="stat-card">
					<view class="stat-icon-wrapper red">
						<view class="stat-icon-shape">
							<view class="alert-triangle"></view>
							<text class="alert-exclamation">!</text>
						</view>
					</view>
					<view class="stat-content">
						<text class="stat-value">{{ todayStats.lowStockCount }}</text>
						<text class="stat-label">库存预警</text>
						<text class="stat-unit">项</text>
					</view>
					<view class="stat-decorative-line red"></view>
				</view>
			</view>
		</view>
		
		<!-- 系统状态 - 专业监控面板 -->
		<view class="status-panel">
			<view class="section-header">
				<text class="section-title">系统状态</text>
				<text class="section-subtitle">System Status</text>
			</view>
			<view class="status-grid">
				<view class="status-item">
					<view class="status-indicator online"></view>
					<view class="status-info">
						<text class="status-label">云服务</text>
						<text class="status-value">运行中</text>
					</view>
					<text class="status-icon">✓</text>
				</view>
				<view class="status-item">
					<view class="status-indicator online"></view>
					<view class="status-info">
						<text class="status-label">数据同步</text>
						<text class="status-value">正常</text>
					</view>
					<text class="status-icon">✓</text>
				</view>
				<view class="status-item">
					<view class="status-indicator online"></view>
					<view class="status-info">
						<text class="status-label">最后更新</text>
						<text class="status-value">{{ lastUpdateTime }}</text>
					</view>
					<text class="status-icon">🕐</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { callFunction } from '@/utils/api.js'

export default {
	data() {
		return {
			todayStats: {
				inCount: 0,
				outCount: 0,
				totalDrugs: 0,
				lowStockCount: 0
			},
			lastUpdateTime: ''
		}
	},
	onLoad() {
		console.log('===== 首页 onLoad =====')
		this.updateLastUpdateTime()
		this.loadTodayStats()
	},
	onShow() {
		console.log('===== 首页 onShow =====')
		this.loadTodayStats()
	},
	onReady() {
		console.log('===== 首页 onReady =====')
	},
	methods: {
		// 更新最后更新时间
		updateLastUpdateTime() {
			const now = new Date()
			const hours = String(now.getHours()).padStart(2, '0')
			const minutes = String(now.getMinutes()).padStart(2, '0')
			this.lastUpdateTime = `${hours}:${minutes}`
		},
		
		// 加载今日统计数据
		async loadTodayStats() {
			try {
				// 获取今日入库统计
				const inData = await callFunction('inRecords', {
					action: 'getCounts',
					data: {}
				}, false)
				
				// 获取今日出库统计
				const outData = await callFunction('outRecords', {
					action: 'getCounts',
					data: {}
				}, false)
				
				// 获取药品总数
				let totalDrugs = 0
				try {
					const drugData = await callFunction('drugManage', {
						action: 'getList',
						data: {
							pageSize: 1,
							pageNum: 1
						}
					}, false)
					totalDrugs = drugData.data?.total || 0
				} catch (e) {
					console.log('获取药品总数失败', e)
				}
				
				// 获取库存预警数
				let lowStockCount = 0
				try {
					const stockData = await callFunction('stockManage', {
						action: 'getLowStockList',
						data: {}
					}, false)
					lowStockCount = stockData.data?.length || 0
				} catch (e) {
					console.log('获取库存预警失败', e)
				}
				
				this.todayStats = {
					inCount: inData.today || 0,
					outCount: outData.today || 0,
					totalDrugs: totalDrugs,
					lowStockCount: lowStockCount
				}
				
				console.log('今日统计加载成功:', this.todayStats)
			} catch (err) {
				console.error('加载统计数据失败:', err)
				// 使用默认值，不显示错误提示
				this.todayStats = {
					inCount: 0,
					outCount: 0,
					totalDrugs: 0,
					lowStockCount: 0
				}
			}
		},
		
		// 页面跳转
		goToPage(url) {
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
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: linear-gradient(180deg, #f0f4f8 0%, #ffffff 100%);
	padding-bottom: 30rpx;
}

/* 顶部渐变卡片 */
.header-card {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 40rpx 30rpx 50rpx;
	margin-bottom: -20rpx;
	position: relative;
}

.header-card::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 40rpx;
	background: linear-gradient(180deg, #f0f4f8 0%, #ffffff 100%);
	border-radius: 40rpx 40rpx 0 0;
}

.header-content {
	position: relative;
	z-index: 1;
}

.clinic-info {
	display: flex;
	align-items: center;
	margin-bottom: 35rpx;
}

/* 医务室专业Logo设计 */
.clinic-logo {
	position: relative;
	width: 100rpx;
	height: 100rpx;
	margin-right: 25rpx;
	flex-shrink: 0;
}

.logo-circle {
	width: 100%;
	height: 100%;
	background: rgba(255, 255, 255, 0.25);
	backdrop-filter: blur(10rpx);
	border-radius: 50%;
	border: 3rpx solid rgba(255, 255, 255, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 
		0 8rpx 32rpx rgba(0, 0, 0, 0.2),
		inset 0 2rpx 8rpx rgba(255, 255, 255, 0.3);
	position: relative;
	z-index: 2;
}

.logo-cross {
	position: relative;
	width: 50rpx;
	height: 50rpx;
}

.cross-horizontal,
.cross-vertical {
	position: absolute;
	background: #ffffff;
	border-radius: 3rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.cross-horizontal {
	width: 50rpx;
	height: 12rpx;
	top: 50%;
	left: 0;
	transform: translateY(-50%);
}

.cross-vertical {
	width: 12rpx;
	height: 50rpx;
	left: 50%;
	top: 0;
	transform: translateX(-50%);
}

/* Logo脉冲动画 */
.logo-pulse {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
	height: 100%;
	border-radius: 50%;
	border: 2rpx solid rgba(255, 255, 255, 0.6);
	z-index: 1;
	animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.pulse-1 {
	animation-delay: 0s;
}

.pulse-2 {
	animation-delay: 1s;
}

@keyframes pulse-ring {
	0% {
		transform: translate(-50%, -50%) scale(0.8);
		opacity: 1;
	}
	100% {
		transform: translate(-50%, -50%) scale(1.3);
		opacity: 0;
	}
}

.clinic-text {
	flex: 1;
}

.clinic-name {
	display: block;
	font-size: 38rpx;
	font-weight: 800;
	color: #ffffff;
	margin-bottom: 6rpx;
	text-shadow: 0 2rpx 12rpx rgba(0,0,0,0.2);
	letter-spacing: 2rpx;
}

.clinic-name-en {
	display: block;
	font-size: 20rpx;
	color: rgba(255,255,255,0.85);
	font-weight: 600;
	letter-spacing: 3rpx;
	margin-bottom: 8rpx;
	text-transform: uppercase;
}

.clinic-subtitle {
	display: block;
	font-size: 22rpx;
	color: rgba(255,255,255,0.8);
	letter-spacing: 1rpx;
	font-weight: 500;
}

/* 快捷操作区 */
.quick-actions {
	padding: 30rpx;
}

/* 门诊登记长标签 Banner */
.clinic-banner {
	margin: 0 0 20rpx 0;
	padding: 30rpx 35rpx;
	background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 8rpx 32rpx rgba(236, 72, 153, 0.4);
	position: relative;
	overflow: hidden;
	transition: all 0.3s;
}

.clinic-banner::before {
	content: '';
	position: absolute;
	top: -50%;
	right: -20%;
	width: 300rpx;
	height: 300rpx;
	background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
	border-radius: 50%;
}

.clinic-banner:active {
	transform: scale(0.98);
	box-shadow: 0 4rpx 20rpx rgba(236, 72, 153, 0.5);
}

.clinic-banner-icon {
	position: relative;
	width: 80rpx;
	height: 80rpx;
	background: rgba(255, 255, 255, 0.25);
	backdrop-filter: blur(10rpx);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 3rpx solid rgba(255, 255, 255, 0.4);
	flex-shrink: 0;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
	z-index: 1;
}

.clinic-cross-h {
	position: absolute;
	width: 40rpx;
	height: 10rpx;
	background: #ffffff;
	border-radius: 3rpx;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.clinic-cross-v {
	position: absolute;
	width: 10rpx;
	height: 40rpx;
	background: #ffffff;
	border-radius: 3rpx;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.clinic-circle-bg {
	position: absolute;
	width: 60rpx;
	height: 60rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.clinic-banner-content {
	flex: 1;
	margin-left: 25rpx;
	z-index: 1;
}

.clinic-banner-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #ffffff;
	margin-bottom: 8rpx;
	text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
	letter-spacing: 1rpx;
}

.clinic-banner-desc {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.9);
	letter-spacing: 0.5rpx;
	font-weight: 500;
}

.clinic-banner-arrow {
	font-size: 48rpx;
	color: rgba(255, 255, 255, 0.8);
	font-weight: bold;
	z-index: 1;
}

/* 新建入库单 Banner */
.inbound-banner {
	margin: 0 0 20rpx 0;
	padding: 30rpx 35rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.4);
	position: relative;
	overflow: hidden;
	transition: all 0.3s;
}

.inbound-banner::before {
	content: '';
	position: absolute;
	top: -50%;
	right: -20%;
	width: 300rpx;
	height: 300rpx;
	background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
	border-radius: 50%;
}

.inbound-banner:active {
	transform: scale(0.98);
	box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.5);
}

.inbound-banner-icon {
	position: relative;
	width: 80rpx;
	height: 80rpx;
	background: rgba(255, 255, 255, 0.25);
	backdrop-filter: blur(10rpx);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 3rpx solid rgba(255, 255, 255, 0.4);
	flex-shrink: 0;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
	z-index: 1;
}

.inbound-box {
	position: relative;
	width: 40rpx;
	height: 40rpx;
}

.box-top {
	position: absolute;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 40rpx;
	height: 8rpx;
	background: #ffffff;
	border-radius: 2rpx 2rpx 0 0;
}

.box-front {
	position: absolute;
	top: 8rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 36rpx;
	height: 32rpx;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 0 0 4rpx 4rpx;
	border: 2rpx solid #ffffff;
}

.arrow-in {
	position: absolute;
	top: 12rpx;
	left: 50%;
	transform: translateX(-50%);
	font-size: 24rpx;
	color: #667eea;
	font-weight: bold;
	z-index: 1;
}

.inbound-banner-content {
	flex: 1;
	margin-left: 25rpx;
	z-index: 1;
}

.inbound-banner-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #ffffff;
	margin-bottom: 8rpx;
	text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
	letter-spacing: 1rpx;
}

.inbound-banner-desc {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.9);
	letter-spacing: 0.5rpx;
	font-weight: 500;
}

.inbound-banner-badge {
	padding: 6rpx 16rpx;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 20rpx;
	font-size: 20rpx;
	color: #ffffff;
	font-weight: bold;
	letter-spacing: 1rpx;
	margin-right: 15rpx;
	z-index: 1;
	backdrop-filter: blur(10rpx);
	border: 1rpx solid rgba(255, 255, 255, 0.4);
}

.inbound-banner-arrow {
	font-size: 48rpx;
	color: rgba(255, 255, 255, 0.8);
	font-weight: bold;
	z-index: 1;
}

.section-header {
	margin-bottom: 25rpx;
}

.section-title {
	display: block;
	font-size: 36rpx;
	font-weight: bold;
	color: #2c3e50;
	margin-bottom: 8rpx;
}

.section-subtitle {
	display: block;
	font-size: 24rpx;
	color: #95a5a6;
	letter-spacing: 1rpx;
	text-transform: uppercase;
}

.action-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 15rpx;
	margin-top: 20rpx;
}

.action-card {
	background: #ffffff;
	border-radius: 16rpx;
	padding: 25rpx 15rpx;
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06);
	position: relative;
	overflow: hidden;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	text-align: center;
}

.action-card::before {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	opacity: 0.1;
	transform: translate(30rpx, -30rpx);
}

.action-card.primary::before { background: #667eea; }
.action-card.success::before { background: #10b981; }
.action-card.warning::before { background: #f59e0b; }
.action-card.info::before { background: #3b82f6; }
.action-card.clinic::before { background: #ec4899; }
.action-card.purple::before { background: #8b5cf6; }
.action-card.teal::before { background: #14b8a6; }

.action-card:active {
	transform: scale(0.98);
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
}

.action-icon-bg {
	width: 70rpx;
	height: 70rpx;
	border-radius: 18rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 15rpx;
	position: relative;
	overflow: hidden;
}

.action-icon-bg::before {
	content: '';
	position: absolute;
	width: 100%;
	height: 100%;
	background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 70%);
}

.action-icon-bg.primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.action-icon-bg.success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.action-icon-bg.warning { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.action-icon-bg.info { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
.action-icon-bg.clinic { background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); }
.action-icon-bg.purple { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
.action-icon-bg.teal { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); }

/* 自定义图标形状 */
.icon-shape {
	position: relative;
	width: 40rpx;
	height: 40rpx;
	z-index: 1;
}

/* 入库图标 - 箭头向下 + 箱子 */
.arrow-down {
	position: absolute;
	width: 4rpx;
	height: 28rpx;
	background: #ffffff;
	left: 50%;
	top: 0;
	transform: translateX(-50%);
	border-radius: 2rpx;
}

.arrow-down::after {
	content: '';
	position: absolute;
	bottom: -6rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-left: 8rpx solid transparent;
	border-right: 8rpx solid transparent;
	border-top: 10rpx solid #ffffff;
}

.box-base {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 36rpx;
	height: 16rpx;
	background: rgba(255,255,255,0.4);
	border-radius: 3rpx;
	border: 2rpx solid #ffffff;
}

/* 出库图标 - 箭头向上 + 箱子 */
.arrow-up {
	position: absolute;
	width: 4rpx;
	height: 28rpx;
	background: #ffffff;
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);
	border-radius: 2rpx;
}

.arrow-up::after {
	content: '';
	position: absolute;
	top: -6rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-left: 8rpx solid transparent;
	border-right: 8rpx solid transparent;
	border-bottom: 10rpx solid #ffffff;
}

/* 库存图标 - 堆叠层 */
.stack-layer {
	position: absolute;
	width: 40rpx;
	height: 8rpx;
	background: #ffffff;
	border-radius: 2rpx;
	left: 50%;
	transform: translateX(-50%);
}

.layer-1 {
	bottom: 0;
	opacity: 1;
}

.layer-2 {
	bottom: 12rpx;
	opacity: 0.7;
	width: 36rpx;
}

.layer-3 {
	bottom: 24rpx;
	opacity: 0.5;
	width: 32rpx;
}


/* 报表图标 - 柱状图 */
.chart-axis {
	position: absolute;
	left: 8rpx;
	bottom: 8rpx;
	width: 36rpx;
	height: 2rpx;
	background: #ffffff;
	border-radius: 1rpx;
}

.chart-axis::before {
	content: '';
	position: absolute;
	left: 0;
	bottom: 0;
	width: 2rpx;
	height: 32rpx;
	background: #ffffff;
	border-radius: 1rpx;
}

.chart-bar {
	position: absolute;
	width: 8rpx;
	background: #ffffff;
	border-radius: 2rpx 2rpx 0 0;
	left: 12rpx;
	bottom: 10rpx;
}

.bar-1 {
	left: 14rpx;
	height: 16rpx;
	opacity: 0.7;
}

.bar-2 {
	left: 26rpx;
	height: 28rpx;
	opacity: 0.9;
}

.bar-3 {
	left: 38rpx;
	height: 22rpx;
	opacity: 0.8;
}

.action-badge {
	position: absolute;
	top: 15rpx;
	right: 15rpx;
	font-size: 18rpx;
	font-weight: 700;
	color: rgba(255,255,255,0.4);
	letter-spacing: 1rpx;
}

.action-label {
	display: block;
	font-size: 26rpx;
	font-weight: bold;
	color: #2c3e50;
	margin-bottom: 6rpx;
}

.action-desc {
	display: block;
	font-size: 20rpx;
	color: #7f8c8d;
}

/* 数据统计区 */
.stats-section {
	padding: 0 30rpx 30rpx;
}

.stats-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20rpx;
}

.stat-card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx 25rpx;
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06);
	position: relative;
	overflow: hidden;
	text-align: center;
}

.stat-icon-wrapper {
	width: 65rpx;
	height: 65rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 20rpx;
	position: relative;
	overflow: hidden;
}

.stat-icon-wrapper::before {
	content: '';
	position: absolute;
	width: 100%;
	height: 100%;
	background: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.25) 0%, transparent 60%);
}

.stat-icon-wrapper.blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-icon-wrapper.green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.stat-icon-wrapper.orange { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.stat-icon-wrapper.red { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }

.stat-icon-shape {
	position: relative;
	width: 36rpx;
	height: 36rpx;
	z-index: 1;
}

/* 迷你入库图标 */
.mini-arrow-down {
	position: absolute;
	width: 3rpx;
	height: 20rpx;
	background: #ffffff;
	left: 50%;
	top: 0;
	transform: translateX(-50%);
	border-radius: 2rpx;
}

.mini-arrow-down::after {
	content: '';
	position: absolute;
	bottom: -4rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-left: 6rpx solid transparent;
	border-right: 6rpx solid transparent;
	border-top: 7rpx solid #ffffff;
}

.mini-box {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 28rpx;
	height: 12rpx;
	background: rgba(255,255,255,0.3);
	border-radius: 2rpx;
	border: 2rpx solid #ffffff;
}

/* 迷你出库图标 */
.mini-arrow-up {
	position: absolute;
	width: 3rpx;
	height: 20rpx;
	background: #ffffff;
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);
	border-radius: 2rpx;
}

.mini-arrow-up::after {
	content: '';
	position: absolute;
	top: -4rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-left: 6rpx solid transparent;
	border-right: 6rpx solid transparent;
	border-bottom: 7rpx solid #ffffff;
}

/* 药片图标 */
.pill-shape {
	position: absolute;
	width: 24rpx;
	height: 10rpx;
	background: #ffffff;
	border-radius: 5rpx;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%) rotate(-25deg);
}

.pill-2 {
	transform: translate(-50%, -50%) rotate(25deg);
	opacity: 0.6;
}

/* 警告三角形图标 */
.alert-triangle {
	position: absolute;
	width: 0;
	height: 0;
	border-left: 18rpx solid transparent;
	border-right: 18rpx solid transparent;
	border-bottom: 32rpx solid #ffffff;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.alert-exclamation {
	position: absolute;
	font-size: 20rpx;
	font-weight: bold;
	color: #ef4444;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -30%);
	z-index: 1;
}

/* 装饰线 */
.stat-decorative-line {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 4rpx;
	border-radius: 4rpx 4rpx 0 0;
}

.stat-decorative-line.blue { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); }
.stat-decorative-line.green { background: linear-gradient(90deg, #10b981 0%, #059669 100%); }
.stat-decorative-line.orange { background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); }
.stat-decorative-line.red { background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%); }

.stat-content {
	margin-bottom: 15rpx;
}

.stat-value {
	display: block;
	font-size: 48rpx;
	font-weight: bold;
	color: #2c3e50;
	line-height: 1;
	margin-bottom: 8rpx;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
}

.stat-label {
	display: inline-block;
	font-size: 24rpx;
	color: #7f8c8d;
	margin-right: 8rpx;
}

.stat-unit {
	font-size: 22rpx;
	color: #95a5a6;
}

.stat-trend {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.stat-trend.up { color: #10b981; }
.stat-trend.down { color: #ef4444; }

.trend-icon {
	font-size: 24rpx;
	font-weight: bold;
}

.trend-text {
	font-size: 22rpx;
	font-weight: 600;
}

/* 系统状态面板 */
.status-panel {
	padding: 0 30rpx;
}

.status-grid {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 25rpx;
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06);
}

.status-item {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.status-item:last-child {
	border-bottom: none;
}

.status-indicator {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	margin-right: 20rpx;
	position: relative;
}

.status-indicator.online {
	background: #10b981;
	box-shadow: 0 0 0 4rpx rgba(16, 185, 129, 0.2);
}

.status-indicator.online::after {
	content: '';
	position: absolute;
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background: #10b981;
	animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
	0%, 100% {
		opacity: 1;
		transform: scale(1);
	}
	50% {
		opacity: 0;
		transform: scale(2);
	}
}

.status-info {
	flex: 1;
}

.status-label {
	display: block;
	font-size: 26rpx;
	color: #2c3e50;
	margin-bottom: 4rpx;
}

.status-value {
	display: block;
	font-size: 22rpx;
	color: #7f8c8d;
}

.status-icon {
	font-size: 28rpx;
	color: #10b981;
}
</style>



