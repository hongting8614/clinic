<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="page-title">统计分析</text>
			<text class="page-subtitle">数据洞察 · 趋势分析 · 决策支持</text>
		</view>

		<!-- 时间范围选择 -->
		<view class="time-selector">
			<view class="time-tabs">
				<view 
					v-for="tab in timeTabs" 
					:key="tab.value"
					:class="['time-tab', { active: currentTimeRange === tab.value }]"
					@tap="switchTimeRange(tab.value)"
				>
					<text>{{ tab.label }}</text>
				</view>
			</view>
			<view class="custom-date" v-if="currentTimeRange === 'custom'">
				<picker mode="date" :value="startDate" @change="onStartDateChange">
					<view class="date-input">
						<text>{{ startDate || '开始日期' }}</text>
					</view>
				</picker>
				<text class="date-separator">至</text>
				<picker mode="date" :value="endDate" @change="onEndDateChange">
					<view class="date-input">
						<text>{{ endDate || '结束日期' }}</text>
					</view>
				</picker>
			</view>
		</view>

		<!-- 园区选择 -->
		<view class="location-selector">
			<view 
				v-for="loc in locations" 
				:key="loc.value"
				:class="['location-item', { active: currentLocation === loc.value }]"
				@tap="switchLocation(loc.value)"
			>
				<text>{{ loc.label }}</text>
			</view>
		</view>

		<!-- 核心数据概览 -->
		<view class="overview-section">
			<view class="section-header">
				<text class="section-title">核心指标</text>
				<text class="section-subtitle">{{ dateRangeText }}</text>
			</view>
			<view class="overview-grid">
				<view class="overview-card">
					<view class="card-icon blue">👥</view>
					<view class="card-content">
						<text class="card-value">{{ stats.totalPatients }}</text>
						<text class="card-label">就诊人次</text>
					</view>
				</view>
				<view class="overview-card">
					<view class="card-icon green">🏥</view>
					<view class="card-content">
						<text class="card-value">{{ stats.outcallCount }}</text>
						<text class="card-label">出诊次数</text>
					</view>
				</view>
				<view class="overview-card">
					<view class="card-icon orange">💊</view>
					<view class="card-content">
						<text class="card-value">{{ stats.drugUsageCount }}</text>
						<text class="card-label">用药人次</text>
					</view>
				</view>
				<view class="overview-card">
					<view class="card-icon red">📦</view>
					<view class="card-content">
						<text class="card-value">{{ stats.drugTypeCount }}</text>
						<text class="card-label">药品种类</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 伤情分析 -->
		<view class="analysis-section">
			<view class="section-header">
				<text class="section-icon">🩹</text>
				<text class="section-title">伤情分析</text>
			</view>
			<view class="analysis-card">
				<view class="chart-placeholder" v-if="injuryStats.length === 0">
					<text class="placeholder-text">暂无数据</text>
				</view>
				<view v-else class="data-list">
					<view 
						v-for="(item, index) in injuryStats" 
						:key="index"
						class="data-item"
					>
						<view class="item-rank">{{ index + 1 }}</view>
						<view class="item-info">
							<text class="item-name">{{ item.disease }}</text>
							<view class="item-bar">
								<view 
									class="bar-fill" 
									:style="{ width: (item.count / injuryStats[0].count * 100) + '%' }"
								></view>
							</view>
						</view>
						<text class="item-value">{{ item.count }}人</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 地点分析 -->
		<view class="analysis-section">
			<view class="section-header">
				<text class="section-icon">📍</text>
				<text class="section-title">受伤地点分析</text>
			</view>
			<view class="analysis-card">
				<view class="chart-placeholder" v-if="locationStats.length === 0">
					<text class="placeholder-text">暂无数据</text>
				</view>
				<view v-else class="data-list">
					<view 
						v-for="(item, index) in locationStats" 
						:key="index"
						class="data-item"
					>
						<view class="item-rank">{{ index + 1 }}</view>
						<view class="item-info">
							<text class="item-name">{{ item.location }}</text>
							<view class="item-bar">
								<view 
									class="bar-fill location" 
									:style="{ width: (item.count / locationStats[0].count * 100) + '%' }"
								></view>
							</view>
						</view>
						<text class="item-value">{{ item.count }}次</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 药品消耗分析 -->
		<view class="analysis-section">
			<view class="section-header">
				<text class="section-icon">💊</text>
				<text class="section-title">药品消耗分析</text>
			</view>
			<view class="analysis-card">
				<view class="chart-placeholder" v-if="drugStats.length === 0">
					<text class="placeholder-text">暂无数据</text>
				</view>
				<view v-else class="data-list">
					<view 
						v-for="(item, index) in drugStats" 
						:key="index"
						class="data-item"
					>
						<view class="item-rank">{{ index + 1 }}</view>
						<view class="item-info">
							<text class="item-name">{{ item.drugName }}</text>
							<view class="item-bar">
								<view 
									class="bar-fill drug" 
									:style="{ width: (item.quantity / drugStats[0].quantity * 100) + '%' }"
								></view>
							</view>
						</view>
						<text class="item-value">{{ item.quantity }}{{ item.unit }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 身份分布 -->
		<view class="analysis-section">
			<view class="section-header">
				<text class="section-icon">👤</text>
				<text class="section-title">患者身份分布</text>
			</view>
			<view class="analysis-card">
				<view class="identity-grid">
					<view 
						v-for="item in identityStats" 
						:key="item.identity"
						class="identity-item"
					>
						<view class="identity-circle">
							<text class="identity-percent">{{ item.percent }}%</text>
						</view>
						<text class="identity-label">{{ item.identity }}</text>
						<text class="identity-count">{{ item.count }}人</text>
					</view>
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
			currentTimeRange: 'month',
			timeTabs: [
				{ label: '本周', value: 'week' },
				{ label: '本月', value: 'month' },
				{ label: '本季', value: 'quarter' },
				{ label: '本年', value: 'year' },
				{ label: '自定义', value: 'custom' }
			],
			currentLocation: 'all',
			locations: [
				{ label: '全部园区', value: 'all' },
				{ label: '陆园', value: 'land_park' },
				{ label: '水园', value: 'water_park' }
			],
			startDate: '',
			endDate: '',
			stats: {
				totalPatients: 0,
				outcallCount: 0,
				drugUsageCount: 0,
				drugTypeCount: 0
			},
			injuryStats: [],
			locationStats: [],
			drugStats: [],
			identityStats: []
		}
	},
	
	computed: {
		dateRangeText() {
			if (this.currentTimeRange === 'custom' && this.startDate && this.endDate) {
				return `${this.startDate} 至 ${this.endDate}`
			}
			const map = {
				week: '本周',
				month: '本月',
				quarter: '本季度',
				year: '本年'
			}
			return map[this.currentTimeRange] || ''
		}
	},
	
	onLoad() {
		this.initDateRange()
		this.loadData()
	},
	
	methods: {
		initDateRange() {
			const today = new Date()
			const year = today.getFullYear()
			const month = today.getMonth()
			const date = today.getDate()
			
			// 结束日期：今天
			this.endDate = this.formatDate(today)
			
			// 开始日期：根据时间范围计算
			let startDate = new Date()
			
			switch (this.currentTimeRange) {
				case 'week':
					// 本周一
					const day = today.getDay() || 7 // 周日为0，转为7
					startDate.setDate(date - day + 1)
					break
				case 'month':
					// 本月1号
					startDate = new Date(year, month, 1)
					break
				case 'quarter':
					// 本季度第一天
					const quarterMonth = Math.floor(month / 3) * 3
					startDate = new Date(year, quarterMonth, 1)
					break
				case 'year':
					// 本年1月1号
					startDate = new Date(year, 0, 1)
					break
			}
			
			this.startDate = this.formatDate(startDate)
		},
		
		formatDate(date) {
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			return `${year}-${month}-${day}`
		},
		
		switchTimeRange(value) {
			this.currentTimeRange = value
			if (value !== 'custom') {
				this.initDateRange()
				this.loadData()
			}
		},
		
		switchLocation(value) {
			this.currentLocation = value
			this.loadData()
		},
		
		onStartDateChange(e) {
			this.startDate = e.detail.value
			if (this.endDate) {
				this.loadData()
			}
		},
		
		onEndDateChange(e) {
			this.endDate = e.detail.value
			if (this.startDate) {
				this.loadData()
			}
		},
		
		async loadData() {
			if (!this.startDate || !this.endDate) return
			
			uni.showLoading({ title: '加载中...' })
			
			try {
				// 查询门诊记录
				const params = {
					action: 'list',
					data: {
						startDate: this.startDate,
						endDate: this.endDate,
						pageSize: 10000,
						useClinicRecords: true
					}
				}
				
				if (this.currentLocation !== 'all') {
					params.data.location = this.currentLocation
				}
				
				const res = await callFunction('clinicRecords', params)
				const records = res?.data?.list || res?.result?.data?.list || []
				
				// 分析数据
				this.analyzeData(records)
				
				uni.hideLoading()
			} catch (err) {
				console.error('加载数据失败:', err)
				uni.hideLoading()
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			}
		},
		
		analyzeData(records) {
			// 核心指标
			this.stats.totalPatients = records.length
			this.stats.outcallCount = records.filter(r => r.isOutcall || r.visitType === 'outcall').length
			this.stats.drugUsageCount = records.filter(r => r.drugId || r.drugName).length
			
			// 伤情分析
			const injuryMap = {}
			records.forEach(r => {
				const disease = r.diseaseName || r.diagnosis || r.chiefComplaint || '未知'
				injuryMap[disease] = (injuryMap[disease] || 0) + 1
			})
			this.injuryStats = Object.entries(injuryMap)
				.map(([disease, count]) => ({ disease, count }))
				.sort((a, b) => b.count - a.count)
				.slice(0, 10)
			
			// 地点分析
			const locationMap = {}
			records.forEach(r => {
				if (r.injuryLocation) {
					locationMap[r.injuryLocation] = (locationMap[r.injuryLocation] || 0) + 1
				}
			})
			this.locationStats = Object.entries(locationMap)
				.map(([location, count]) => ({ location, count }))
				.sort((a, b) => b.count - a.count)
				.slice(0, 10)
			
			// 药品消耗分析
			const drugMap = {}
			records.forEach(r => {
				if (r.drugName) {
					const key = r.drugName
					if (!drugMap[key]) {
						drugMap[key] = {
							drugName: r.drugName,
							quantity: 0,
							unit: r.minUnit || '个'
						}
					}
					drugMap[key].quantity += (r.quantityMin || r.quantity || 0)
				}
			})
			this.drugStats = Object.values(drugMap)
				.sort((a, b) => b.quantity - a.quantity)
				.slice(0, 10)
			
			this.stats.drugTypeCount = Object.keys(drugMap).length
			
			// 身份分布
			const identityMap = {}
			records.forEach(r => {
				const identity = r.identity || '游客'
				identityMap[identity] = (identityMap[identity] || 0) + 1
			})
			const total = records.length || 1
			this.identityStats = Object.entries(identityMap)
				.map(([identity, count]) => ({
					identity,
					count,
					percent: Math.round(count / total * 100)
				}))
				.sort((a, b) => b.count - a.count)
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

.time-selector {
	max-width: 702rpx;
	margin: 0 auto 16rpx;
	padding: 20rpx 24rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.time-tabs {
	display: flex;
	gap: 12rpx;
	flex-wrap: wrap;
}

.time-tab {
	flex: 1;
	min-width: 100rpx;
	padding: 16rpx 20rpx;
	background: #f3f4f6;
	border-radius: 12rpx;
	text-align: center;
	font-size: 26rpx;
	color: #6b7280;
	transition: all 0.3s;
}

.time-tab.active {
	background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
	color: #ffffff;
	font-weight: 600;
	box-shadow: 0 4rpx 12rpx rgba(0, 160, 255, 0.3);
}

.custom-date {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-top: 16rpx;
}

.date-input {
	flex: 1;
	padding: 16rpx 20rpx;
	background: #f9fafb;
	border: 1rpx solid #e5e7eb;
	border-radius: 12rpx;
	font-size: 26rpx;
	color: #374151;
}

.date-separator {
	font-size: 24rpx;
	color: #9ca3af;
}

.location-selector {
	max-width: 702rpx;
	margin: 0 auto 16rpx;
	padding: 20rpx 24rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	display: flex;
	gap: 12rpx;
}

.location-item {
	flex: 1;
	padding: 16rpx 20rpx;
	background: #f3f4f6;
	border-radius: 12rpx;
	text-align: center;
	font-size: 26rpx;
	color: #6b7280;
	transition: all 0.3s;
}

.location-item.active {
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	color: #ffffff;
	font-weight: 600;
	box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.3);
}

.overview-section {
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
	justify-content: space-between;
	margin-bottom: 20rpx;
	padding-bottom: 16rpx;
	border-bottom: 2rpx solid #f0f0f0;
}

.section-icon {
	font-size: 28rpx;
	margin-right: 10rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #0f172a;
}

.section-subtitle {
	font-size: 22rpx;
	color: #9ca3af;
}

.overview-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16rpx;
}

.overview-card {
	background: linear-gradient(145deg, #ffffff 0%, #f9fafb 100%);
	border-radius: 16rpx;
	padding: 24rpx 20rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
	box-shadow: 0 4rpx 12rpx rgba(15, 23, 42, 0.08);
}

.card-icon {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	flex-shrink: 0;
}

.card-icon.blue {
	background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.card-icon.green {
	background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.card-icon.orange {
	background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
}

.card-icon.red {
	background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
}

.card-content {
	flex: 1;
}

.card-value {
	display: block;
	font-size: 36rpx;
	font-weight: 700;
	color: #0f172a;
	line-height: 1;
	margin-bottom: 8rpx;
}

.card-label {
	display: block;
	font-size: 22rpx;
	color: #6b7280;
}

.analysis-section {
	max-width: 702rpx;
	margin: 0 auto 16rpx;
	padding: 20rpx 24rpx 24rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.analysis-card {
	background: #ffffff;
	border-radius: 16rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(15, 23, 42, 0.06);
}

.chart-placeholder {
	padding: 80rpx 0;
	text-align: center;
}

.placeholder-text {
	font-size: 28rpx;
	color: #9ca3af;
}

.data-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.data-item {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.item-rank {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 22rpx;
	font-weight: 600;
	color: #6b7280;
	flex-shrink: 0;
}

.item-info {
	flex: 1;
	min-width: 0;
}

.item-name {
	display: block;
	font-size: 26rpx;
	color: #374151;
	margin-bottom: 8rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.item-bar {
	height: 12rpx;
	background: #f3f4f6;
	border-radius: 6rpx;
	overflow: hidden;
}

.bar-fill {
	height: 100%;
	background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
	border-radius: 6rpx;
	transition: width 0.3s;
}

.bar-fill.location {
	background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.bar-fill.drug {
	background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
}

.item-value {
	font-size: 24rpx;
	font-weight: 600;
	color: #0f172a;
	flex-shrink: 0;
}

.identity-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24rpx;
}

.identity-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
}

.identity-circle {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.2);
}

.identity-percent {
	font-size: 32rpx;
	font-weight: 700;
	color: #2563eb;
}

.identity-label {
	font-size: 26rpx;
	color: #374151;
	font-weight: 500;
}

.identity-count {
	font-size: 22rpx;
	color: #9ca3af;
}
</style>

