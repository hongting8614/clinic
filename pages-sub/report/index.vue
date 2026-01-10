<template>
	<view class="page">
		<view class="page-header">
			<text class="page-title">报表中心</text>
			<text class="page-subtitle">数据导出 · 报表查询 · 快速生成</text>
		</view>

		<!-- 快捷操作 -->
		<view class="quick-section">
			<view class="section-header">
				<text class="section-icon">⚡</text>
				<text class="section-title">快捷操作</text>
			</view>
			<view class="quick-grid">
				<view class="quick-item" @tap="generateTodayReport">
					<view class="quick-icon today">📊</view>
					<text class="quick-title">今日门诊日报</text>
					<text class="quick-badge">快速生成</text>
				</view>
				
				<view class="quick-item" @tap="exportClinicRecords">
					<view class="quick-icon export">📋</view>
					<text class="quick-title">导出登记表</text>
					<text class="quick-badge">Excel</text>
				</view>
			</view>
		</view>

		<!-- 门诊报表分类 -->
		<view class="section">
			<view class="section-header">
				<text class="section-icon">🏥</text>
				<text class="section-title">门诊报表</text>
			</view>
			<view class="report-list">
				<view class="report-item" @tap="goToClinicReport('daily')">
					<view class="report-icon">📊</view>
					<view class="report-content">
						<text class="report-title">门诊日报</text>
						<text class="report-desc">每日接诊统计汇总</text>
					</view>
					<text class="report-arrow">→</text>
				</view>
				
				<view class="report-item" @tap="goToClinicReport('table')">
					<view class="report-icon">📋</view>
					<view class="report-content">
						<text class="report-title">门诊登记表</text>
						<text class="report-desc">登记记录查询导出</text>
					</view>
					<text class="report-arrow">→</text>
				</view>
			</view>
		</view>

		<!-- 药材报表分类 -->
		<view class="section">
			<view class="section-header">
				<text class="section-icon">💊</text>
				<text class="section-title">药材报表</text>
			</view>
			<view class="report-list">
				<view class="report-item" @tap="goToDrugReport('in')">
					<view class="report-icon">📥</view>
					<view class="report-content">
						<text class="report-title">入库报表</text>
						<text class="report-desc">入库记录统计分析</text>
					</view>
					<text class="report-arrow">→</text>
				</view>
				
				<view class="report-item" @tap="goToDrugReport('out')">
					<view class="report-icon">📤</view>
					<view class="report-content">
						<text class="report-title">出库报表</text>
						<text class="report-desc">出库记录统计分析</text>
					</view>
					<text class="report-arrow">→</text>
				</view>
				
				<view class="report-item" @tap="goToDrugReport('stock')">
					<view class="report-icon">📦</view>
					<view class="report-content">
						<text class="report-title">库存报表</text>
						<text class="report-desc">当前库存状态查询</text>
					</view>
					<text class="report-arrow">→</text>
				</view>
			</view>
		</view>

		<!-- 使用提示 -->
		<view class="tips-card">
			<view class="tips-header">
				<text class="tips-icon">💡</text>
				<text class="tips-title">使用说明</text>
			</view>
			<view class="tips-list">
				<text class="tips-item">• 快捷操作可一键生成今日报表</text>
				<text class="tips-item">• 所有报表支持按日期、园区筛选</text>
				<text class="tips-item">• 支持导出为 Excel 格式</text>
				<text class="tips-item">• 导出文件保存在"微信-我的文件"</text>
			</view>
		</view>
	</view>
</template>

<script>
import { callFunction } from '@/utils/api.js'

export default {
	data() {
		return {}
	},
	methods: {
		// 生成今日门诊日报
		async generateTodayReport() {
			try {
				uni.showLoading({ title: '生成中...' })
				
				const today = new Date()
				const year = today.getFullYear()
				const month = String(today.getMonth() + 1).padStart(2, '0')
				const day = String(today.getDate()).padStart(2, '0')
				const dateStr = `${year}-${month}-${day}`
				
				// 获取最近使用的园区
				let location = 'land_park'
				try {
					const last = uni.getStorageSync('clinic_last_location')
					if (last === 'land_park' || last === 'water_park') location = last
				} catch (e) {}
				
				// 查询今日门诊记录
				const res = await callFunction('clinicRecords', {
					action: 'list',
					data: {
						location,
						startDate: dateStr,
						endDate: dateStr,
						pageSize: 1000,
						useClinicRecords: true
					}
				})
				
				const records = res?.data?.list || res?.result?.data?.list || []
				
				uni.hideLoading()
				
				if (!records || records.length === 0) {
					uni.showToast({ title: '今日暂无门诊记录', icon: 'none' })
					return
				}
				
				// 跳转到门诊日报页面（统一路由）
				uni.navigateTo({
					url: `/pages-sub/report/daily?date=${dateStr}&location=${location}`
				})
			} catch (err) {
				console.error('生成日报失败:', err)
				uni.hideLoading()
				uni.showToast({ title: '生成失败', icon: 'none' })
			}
		},
		
		// 导出门诊登记表
		exportClinicRecords() {
			uni.navigateTo({
				url: '/pages-sub/clinic/export'
			})
		},
		
		// 门诊报表
		goToClinicReport(type) {
			if (type === 'daily') {
				// 跳转到门诊日报选择页面
				uni.navigateTo({
					url: '/pages-sub/clinic/daily-report'
				})
			} else if (type === 'table') {
				// 跳转到门诊登记表导出页面
				uni.navigateTo({
					url: '/pages-sub/clinic/export'
				})
			}
		},
		
		// 药材报表
		goToDrugReport(type) {
			if (type === 'in') {
				// 跳转到入库列表（可以在那里查看统计）
				uni.navigateTo({
					url: '/pages-sub/in/list'
				})
			} else if (type === 'out') {
				// 跳转到出库列表
				uni.navigateTo({
					url: '/pages-sub/out/list'
				})
			} else if (type === 'stock') {
				// 跳转到库存管理
				uni.switchTab({
					url: '/pages/stock/index'
				})
			}
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding-bottom: 40rpx;
}

.page-header {
	max-width: 702rpx;
	margin: 24rpx auto 16rpx;
	padding: 32rpx 30rpx 26rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 18rpx 40rpx rgba(15, 23, 42, 0.14);
	text-align: center;
}

.page-title {
	display: block;
	font-size: 40rpx;
	font-weight: 700;
	color: #0f172a;
	letter-spacing: 1rpx;
}

.page-subtitle {
	display: block;
	font-size: 24rpx;
	color: #6b7280;
	margin-top: 10rpx;
	letter-spacing: 0.5rpx;
}

/* 快捷操作区 */
.quick-section {
	max-width: 702rpx;
	margin: 0 auto 16rpx;
	padding: 20rpx 24rpx 24rpx;
	background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(234, 179, 8, 0.25);
	border: 2rpx solid #fbbf24;
}

.quick-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16rpx;
}

.quick-item {
	background: #ffffff;
	border-radius: 16rpx;
	padding: 24rpx 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	box-shadow: 0 4rpx 12rpx rgba(15, 23, 42, 0.1);
	transition: transform 0.2s;
	position: relative;
}

.quick-item:active {
	transform: scale(0.97);
}

.quick-icon {
	width: 68rpx;
	height: 68rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	margin-bottom: 12rpx;
	background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
	box-shadow: 0 4rpx 12rpx rgba(234, 179, 8, 0.2);
}

.quick-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #111827;
	margin-bottom: 8rpx;
}

.quick-badge {
	position: absolute;
	top: 12rpx;
	right: 12rpx;
	padding: 4rpx 12rpx;
	background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
	color: #ffffff;
	font-size: 20rpx;
	font-weight: 600;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(245, 158, 11, 0.3);
}

/* 报表分类区 */
.section {
	max-width: 702rpx;
	margin: 0 auto 16rpx;
	padding: 20rpx 24rpx 24rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.section-header {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 16rpx;
	border-bottom: 2rpx solid #f0f0f0;
}

.section-icon {
	font-size: 32rpx;
	margin-right: 12rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #0f172a;
}

.report-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.report-item {
	background: linear-gradient(145deg, #ffffff 0%, #f9fafb 100%);
	border-radius: 16rpx;
	padding: 20rpx 24rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(15, 23, 42, 0.06);
	transition: all 0.2s;
	border: 1rpx solid #e5e7eb;
}

.report-item:active {
	transform: scale(0.98);
	background: #f3f4f6;
}

.report-icon {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
	flex-shrink: 0;
}

.report-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.report-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #111827;
}

.report-desc {
	font-size: 22rpx;
	color: #6b7280;
}

.report-arrow {
	font-size: 28rpx;
	color: #cbd5e1;
	font-weight: bold;
}

/* 使用提示 */
.tips-card {
	max-width: 702rpx;
	margin: 0 auto 16rpx;
	padding: 20rpx 24rpx;
	background: #fff7ed;
	border-radius: 22rpx;
	border: 2rpx solid #fed7aa;
	box-shadow: 0 8rpx 20rpx rgba(234, 179, 8, 0.15);
}

.tips-header {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
}

.tips-icon {
	font-size: 28rpx;
	margin-right: 10rpx;
}

.tips-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #92400e;
}

.tips-list {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.tips-item {
	font-size: 24rpx;
	color: #78350f;
	line-height: 1.6;
}
</style>
