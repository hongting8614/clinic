<template>
	<view class="page">
		<!-- 专业顶部 -->
		<view class="page-header">
			<view class="header-info">
				<text class="page-title">门诊日消耗</text>
				<text class="page-subtitle">DAILY CONSUMPTION</text>
			</view>
			<view class="header-action" @tap="goAdd">
				<text class="action-icon">+</text>
			</view>
		</view>

		<!-- 日期筛选 -->
		<view class="date-filter">
			<picker mode="date" :value="selectedDate" @change="onDateChange">
				<view class="date-picker">
					<text class="date-icon">📅</text>
					<text class="date-text">{{ selectedDate || '选择日期' }}</text>
				</view>
			</picker>
			<view class="quick-dates">
				<text class="quick-btn" @tap="selectToday">今天</text>
				<text class="quick-btn" @tap="selectYesterday">昨天</text>
				<text class="quick-btn" @tap="selectThisMonth">本月</text>
			</view>
		</view>

		<!-- 统计卡片 -->
		<view class="stats-cards">
			<view class="stat-card">
				<text class="stat-value">{{ totalRecords }}</text>
				<text class="stat-label">消耗记录</text>
			</view>
			<view class="stat-card">
				<text class="stat-value">{{ totalDrugs }}</text>
				<text class="stat-label">药材种类</text>
			</view>
			<view class="stat-card">
				<text class="stat-value">{{ totalQuantity }}</text>
				<text class="stat-label">总消耗量</text>
			</view>
		</view>

		<!-- 记录列表 -->
		<view class="record-list">
			<view 
				v-for="(item, index) in recordList"
				:key="index"
				class="record-card"
				@tap="goDetail(item)"
			>
				<view class="card-header">
					<view class="date-badge">
						<text class="date-text">{{ item.date }}</text>
					</view>
					<view class="location-tag" :class="'tag-' + item.location">
						<text>{{ item.locationName }}</text>
					</view>
				</view>
				
				<view class="card-body">
					<view class="info-row">
						<text class="info-icon">💊</text>
						<text class="info-text">{{ item.items ? item.items.length : 0 }}种药材</text>
					</view>
					<view class="info-row">
						<text class="info-icon">👤</text>
						<text class="info-text">{{ item.operator }}</text>
					</view>
					<view class="info-row">
						<text class="info-icon">🕐</text>
						<text class="info-text">{{ item.createTime }}</text>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view v-if="recordList.length === 0" class="empty-state">
				<text class="empty-icon">💊</text>
				<text class="empty-text">暂无消耗记录</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			selectedDate: '',
			recordList: [],
			totalRecords: 0,
			totalDrugs: 0,
			totalQuantity: 0
		}
	},
	
	onLoad() {
		this.initPage()
	},
	
	methods: {
		initPage() {
			this.selectToday()
			this.loadRecords()
		},
		
		selectToday() {
			const now = new Date()
			this.selectedDate = this.formatDate(now)
			this.loadRecords()
		},
		
		selectYesterday() {
			const now = new Date()
			now.setDate(now.getDate() - 1)
			this.selectedDate = this.formatDate(now)
			this.loadRecords()
		},
		
		selectThisMonth() {
			// 设置为本月第一天
			const now = new Date()
			const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
			this.selectedDate = this.formatDate(firstDay)
			this.loadRecords()
		},
		
		formatDate(date) {
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			return `${year}-${month}-${day}`
		},
		
		onDateChange(e) {
			this.selectedDate = e.detail.value
			this.loadRecords()
		},
		
		async loadRecords() {
			uni.showLoading({ title: '加载中...', mask: true })
			try {
				// 调用门诊用药云函数，按日期读取 clinic_usage 明细
				const result = await this.$api.callFunction('clinicRecords', {
					action: 'list',
					data: {
						startDate: this.selectedDate,
						endDate: this.selectedDate,
						pageSize: 50
					}
				})
				
				uni.hideLoading()
				
				if (result.success) {
					// clinicRecords.list 返回 { list, total, page, pageSize }
					this.recordList = (result.data && result.data.list) ? result.data.list : []
					
					// 加载统计数据
					this.loadStats()
				} else {
					throw new Error(result.message || '加载失败')
				}
			} catch (err) {
				uni.hideLoading()
				console.error('加载消耗记录失败:', err)
				uni.showToast({
					title: err.message || '加载失败',
					icon: 'none'
				})
			}
		},
		
		async loadStats() {
			try {
				// 调用门诊日消耗统计接口（不显示loading，避免与loadRecords冲突）
				const result = await this.$api.callFunction('clinicRecords', {
					action: 'getDailyUsageStats',
					data: {
						date: this.selectedDate
					}
				}, false)
				
				if (result.success && result.data) {
					this.totalRecords = result.data.totalRecords || 0
					this.totalDrugs = result.data.totalDrugs || 0
					this.totalQuantity = result.data.totalQuantityMin || 0
				}
			} catch (err) {
				console.error('加载统计数据失败:', err)
			}
		},
		
		goAdd() {
			uni.navigateTo({
				url: '/pages-sub/consume/add'
			})
		},
		
		goDetail(item) {
			uni.showToast({
				title: '详情页开发中',
				icon: 'none'
			})
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

/* 页面头部 */
.page-header {
	background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
	padding: 40rpx 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.header-info {
	flex: 1;
}

.page-title {
	display: block;
	font-size: 38rpx;
	font-weight: bold;
	color: #ffffff;
	margin-bottom: 6rpx;
	text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.2);
}

.page-subtitle {
	font-size: 20rpx;
	color: rgba(255,255,255,0.85);
	font-weight: 600;
	letter-spacing: 2rpx;
}

.header-action {
	width: 56rpx;
	height: 56rpx;
	background: rgba(255,255,255,0.2);
	backdrop-filter: blur(10rpx);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2rpx solid rgba(255,255,255,0.3);
}

.action-icon {
	font-size: 32rpx;
	font-weight: bold;
	color: #ffffff;
}

/* 日期筛选 */
.date-filter {
	background: #ffffff;
	padding: 25rpx 30rpx;
	margin-bottom: 25rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04);
}

.date-picker {
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 18rpx 25rpx;
	background: #f8fafc;
	border: 2rpx solid #e2e8f0;
	border-radius: 50rpx;
	margin-bottom: 20rpx;
}

.date-icon {
	font-size: 28rpx;
}

.date-text {
	flex: 1;
	font-size: 28rpx;
	color: #2c3e50;
	font-weight: 500;
}

.quick-dates {
	display: flex;
	gap: 12rpx;
}

.quick-btn {
	flex: 1;
	text-align: center;
	padding: 12rpx 20rpx;
	background: #f8fafc;
	border: 2rpx solid #e2e8f0;
	border-radius: 12rpx;
	font-size: 24rpx;
	color: #64748b;
	font-weight: 500;
}

.quick-btn:active {
	background: #14b8a6;
	color: #ffffff;
	border-color: #14b8a6;
}

/* 统计卡片 */
.stats-cards {
	display: flex;
	gap: 15rpx;
	padding: 0 30rpx 25rpx;
}

.stat-card {
	flex: 1;
	background: #ffffff;
	border-radius: 16rpx;
	padding: 25rpx 20rpx;
	text-align: center;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
}

.stat-value {
	display: block;
	font-size: 42rpx;
	font-weight: bold;
	color: #14b8a6;
	margin-bottom: 8rpx;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
}

.stat-label {
	font-size: 22rpx;
	color: #94a3b8;
}

/* 记录列表 */
.record-list {
	padding: 0 30rpx 30rpx;
}

.record-card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 25rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
	border-left: 4rpx solid #14b8a6;
	transition: all 0.3s;
}

.record-card:active {
	transform: translateY(-4rpx);
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.12);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.date-badge {
	padding: 8rpx 18rpx;
	background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
	border-radius: 16rpx;
}

.date-text {
	font-size: 24rpx;
	font-weight: 600;
	color: #065f46;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
}

.location-tag {
	padding: 6rpx 14rpx;
	border-radius: 12rpx;
	font-size: 22rpx;
	font-weight: 600;
}

.tag-land_park {
	background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
	color: #065f46;
}

.tag-water_park {
	background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
	color: #1e40af;
}

.card-body {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.info-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.info-icon {
	font-size: 24rpx;
	width: 30rpx;
	text-align: center;
}

.info-text {
	font-size: 24rpx;
	color: #64748b;
}

/* 空状态 */
.empty-state {
	padding: 150rpx 60rpx;
	text-align: center;
}

.empty-icon {
	display: block;
	font-size: 100rpx;
	margin-bottom: 30rpx;
	opacity: 0.3;
}

.empty-text {
	font-size: 28rpx;
	color: #94a3b8;
}
</style>
