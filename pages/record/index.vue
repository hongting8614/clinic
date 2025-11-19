<template>
	<view class="page" @touchstart="onTabTouchStart" @touchend="onTabTouchEnd">
		<!-- 专业头部 -->
		<view class="page-header">
			<view class="header-actions">
				<view class="quick-btn primary" @tap="goToPage('/pages-sub/report/inbound')">
					<text class="btn-text">入库报表</text>
				</view>
				<view class="quick-btn success" @tap="goToPage('/pages-sub/out/list')">
					<text class="btn-text">出库报表</text>
				</view>
				<view class="quick-btn" @tap="goToPage('/pages-sub/report/clinic')">
					<text class="btn-text">门诊登记表</text>
				</view>
			</view>
		</view>

		<!-- 报表分析网格 -->
		<view class="function-section">
			<view class="section-header">
				<text class="section-title">报表分析</text>
				<text class="section-subtitle">Report Analysis</text>
			</view>
			
			<view class="function-grid">
				<view class="function-card" @tap="goToPage('/pages-sub/report/inbound')">
					<view class="function-icon-bg blue">
						<text class="function-icon">📊</text>
					</view>
					<text class="function-name">入库统计</text>
					<text class="function-desc">入库数据分析</text>
				</view>
				
				<view class="function-card" @tap="goToPage('/pages-sub/out/list')">
					<view class="function-icon-bg green">
						<text class="function-icon">📈</text>
					</view>
					<text class="function-name">出库统计</text>
					<text class="function-desc">出库数据分析</text>
				</view>
				
				<view class="function-card" @tap="goToPage('/pages/stock/index')">
					<view class="function-icon-bg purple">
						<text class="function-icon">📉</text>
					</view>
					<text class="function-name">库存趋势</text>
					<text class="function-desc">库存变化分析</text>
				</view>
				
			<view class="function-card" @tap="goToPage('/pages-sub/consume/list')">
				<view class="function-icon-bg orange">
					<text class="function-icon">💹</text>
				</view>
				<text class="function-name">消耗分析</text>
				<text class="function-desc">药品消耗统计</text>
			</view>
				
				<view class="function-card" @tap="showComingSoon">
					<view class="function-icon-bg teal">
						<text class="function-icon">📅</text>
					</view>
					<text class="function-name">月度报告</text>
					<text class="function-desc">月度汇总</text>
				</view>
				
				<view class="function-card" @tap="showComingSoon">
					<view class="function-icon-bg pink">
						<text class="function-icon">📑</text>
					</view>
					<text class="function-name">年度报告</text>
					<text class="function-desc">年度汇总</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { callFunction } from '@/utils/api.js'
import { createTabSwipeMixin } from '@/utils/tabSwipe.js'

export default {
	mixins: [createTabSwipeMixin(2)],
	data() {
		return {
			recordStats: {
				inTotal: 0,
				inPending: 0,
				outTotal: 0,
				outPending: 0
			},
			recentRecords: []
		}
	},
	onLoad() {
		console.log('===== 报表页 onLoad =====')
		this.loadRecordStats()
		this.loadRecentRecords()
	},
	onShow() {
		console.log('===== 报表页 onShow =====')
		this.loadRecordStats()
		this.loadRecentRecords()
	},
	methods: {
		async loadRecordStats() {
			try {
				const inData = await callFunction('inRecords', {
					action: 'getCounts',
					data: {}
				}, false)
				
				const outData = await callFunction('outRecords', {
					action: 'getCounts',
					data: {}
				}, false)
				
				this.recordStats = {
					inTotal: inData.all || 0,
					inPending: inData.pending_review || 0,
					outTotal: outData.all || 0,
					outPending: outData.pending_review || 0
				}
				
				console.log('单据统计加载成功:', this.recordStats)
			} catch (err) {
				console.error('加载单据统计失败:', err)
			}
		},
		
	async loadRecentRecords() {
		try {
			const inResult = await callFunction('inRecords', {
				action: 'getList',
				data: {
					page: 1,
					pageSize: 3
				}
			}, false)
			
			const outResult = await callFunction('outRecords', {
				action: 'getList',
				data: {
					page: 1,
					pageSize: 3
				}
			}, false)
			
			const inData = (inResult.success ? inResult.data : inResult) || []
			const outData = (outResult.success ? outResult.data : outResult) || []
			
			const allRecords = [
				...inData.map(item => ({ ...item, type: 'in' })),
				...outData.map(item => ({ ...item, type: 'out' }))
			]
			
			this.recentRecords = allRecords
				.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
				.slice(0, 5)
			
			console.log('最近记录加载成功:', this.recentRecords.length)
		} catch (err) {
			console.error('加载最近记录失败:', err)
			this.recentRecords = []
		}
	},
		
		getStatusText(status) {
			const statusMap = {
				'draft': '草稿',
				'pending_review': '待审核',
				'completed': '已完成',
				'rejected': '已拒绝'
			}
			return statusMap[status] || '未知'
		},
		
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
		},
		
		goToDetail(item) {
			const url = item.type === 'in' 
				? `/pages-sub/in/detail?id=${item._id}`
				: `/pages-sub/out/detail?id=${item._id}`
			this.goToPage(url)
		},
		
		showComingSoon() {
			uni.showToast({
				title: '功能即将推出',
				icon: 'none'
			})
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

/* 专业页面头部 */
.page-header {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 40rpx 30rpx;
	margin-bottom: 30rpx;
}

.header-content {
	margin-bottom: 25rpx;
}

.page-title {
	display: block;
	font-size: 36rpx;
	font-weight: 700;
	color: #ffffff;
	margin-bottom: 8rpx;
	text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.15);
}

.page-subtitle {
	display: block;
	font-size: 24rpx;
	color: rgba(255,255,255,0.8);
	letter-spacing: 2rpx;
	text-transform: uppercase;
}

.header-actions {
	display: flex;
	gap: 15rpx;
}

.quick-btn {
	flex: 1;
	background: rgba(255,255,255,0.2);
	backdrop-filter: blur(10rpx);
	border: 1rpx solid rgba(255,255,255,0.3);
	border-radius: 50rpx;
	padding: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	transition: all 0.3s;
}

.quick-btn:active {
	background: rgba(255,255,255,0.3);
	transform: scale(0.95);
}

.btn-icon {
	font-size: 32rpx;
	font-weight: bold;
	color: #ffffff;
}

.btn-text {
	font-size: 28rpx;
	color: #ffffff;
	font-weight: 600;
}

/* 统计仪表盘 */
.stats-dashboard {
	display: flex;
	gap: 20rpx;
	padding: 0 30rpx 30rpx;
}

.stat-card-large {
	flex: 1;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.08);
	position: relative;
	overflow: hidden;
	transition: all 0.3s;
}

.stat-card-large::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 6rpx;
}

.stat-card-large.primary::before { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); }
.stat-card-large.success::before { background: linear-gradient(90deg, #10b981 0%, #059669 100%); }

.stat-card-large:active {
	transform: translateY(-4rpx);
	box-shadow: 0 12rpx 32rpx rgba(0,0,0,0.12);
}

.stat-header {
	position: relative;
	margin-bottom: 20rpx;
}

.stat-icon-large {
	font-size: 40rpx;
	filter: drop-shadow(0 4rpx 8rpx rgba(0,0,0,0.1));
}

.stat-badge {
	position: absolute;
	top: 0;
	right: 0;
	min-width: 40rpx;
	height: 40rpx;
	background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 12rpx;
	box-shadow: 0 4rpx 12rpx rgba(239, 68, 68, 0.4);
}

.badge-text {
	font-size: 22rpx;
	font-weight: bold;
	color: #ffffff;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
}

.stat-body {
	margin-bottom: 20rpx;
}

.stat-number-large {
	display: block;
	font-size: 56rpx;
	font-weight: bold;
	color: #2c3e50;
	line-height: 1;
	margin-bottom: 12rpx;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
}

.stat-label-large {
	display: block;
	font-size: 26rpx;
	color: #64748b;
	font-weight: 500;
}

.stat-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 20rpx;
	border-top: 1rpx solid #f1f5f9;
}

.stat-detail-item {
	display: flex;
	align-items: baseline;
	gap: 10rpx;
}

.detail-label {
	font-size: 22rpx;
	color: #94a3b8;
}

.detail-value {
	font-size: 28rpx;
	font-weight: bold;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
}

.detail-value.warning { color: #f59e0b; }

.stat-arrow {
	font-size: 24rpx;
	color: #cbd5e1;
	font-weight: bold;
}

/* 功能入口网格 */
.function-section {
	padding: 0 30rpx 30rpx;
}

.section-header {
	margin-bottom: 25rpx;
}

.section-title {
	display: block;
	font-size: 32rpx;
	font-weight: bold;
	color: #2c3e50;
	margin-bottom: 8rpx;
}

.section-subtitle {
	display: block;
	font-size: 22rpx;
	color: #94a3b8;
	letter-spacing: 1rpx;
	text-transform: uppercase;
}

.function-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20rpx;
}

.function-card {
	background: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx 20rpx;
	text-align: center;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
	border: 1rpx solid #f1f5f9;
	transition: all 0.3s;
}

.function-card:active {
	transform: translateY(-4rpx);
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.12);
}

.function-icon-bg {
	width: 70rpx;
	height: 70rpx;
	border-radius: 18rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 15rpx;
}

.function-icon-bg.blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.function-icon-bg.green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.function-icon-bg.purple { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
.function-icon-bg.orange { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.function-icon-bg.teal { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); }
.function-icon-bg.pink { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); }

.function-icon {
	font-size: 36rpx;
}

.function-name {
	display: block;
	font-size: 26rpx;
	font-weight: bold;
	color: #2c3e50;
	margin-bottom: 6rpx;
}

.function-desc {
	display: block;
	font-size: 20rpx;
	color: #94a3b8;
}

/* 时间线 */
.timeline-section {
	padding: 0 30rpx;
}

.timeline {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 25rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
}

.timeline-item {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f1f5f9;
	position: relative;
	transition: all 0.3s;
}

.timeline-item:last-child {
	border-bottom: none;
}

.timeline-item:active {
	background: #f8fafc;
	margin: 0 -25rpx;
	padding: 20rpx 25rpx;
	border-radius: 12rpx;
}

.timeline-marker {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	margin-right: 20rpx;
	position: relative;
	flex-shrink: 0;
}

.marker-draft { background: #94a3b8; }
.marker-pending_review { 
	background: #f59e0b;
	box-shadow: 0 0 0 4rpx rgba(245, 158, 11, 0.2);
}
.marker-completed { 
	background: #10b981;
	box-shadow: 0 0 0 4rpx rgba(16, 185, 129, 0.2);
}
.marker-rejected { background: #ef4444; }

.timeline-content {
	flex: 1;
}

.timeline-header {
	display: flex;
	align-items: center;
	gap: 15rpx;
	margin-bottom: 8rpx;
}

.timeline-type {
	font-size: 28rpx;
	font-weight: 600;
	color: #2c3e50;
}

.timeline-status {
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
	font-weight: 500;
}

.status-draft {
	background: #f1f5f9;
	color: #64748b;
}

.status-pending_review {
	background: #fef3c7;
	color: #92400e;
}

.status-completed {
	background: #d1fae5;
	color: #065f46;
}

.status-rejected {
	background: #fee2e2;
	color: #991b1b;
}

.timeline-time {
	font-size: 22rpx;
	color: #94a3b8;
}

.timeline-arrow {
	font-size: 24rpx;
	color: #cbd5e1;
	font-weight: bold;
	margin-left: 15rpx;
}
</style>


