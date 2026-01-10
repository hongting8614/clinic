<template>
	<view class="page">
		<!-- 统一页面头部 -->
		<view class="page-header">
			<view>
				<text class="page-title">药材库存</text>
			</view>
			<view class="header-actions">
				<view class="header-btn secondary" @tap="onExpirySettingTap">
					<text class="btn-icon">⏱</text>
					<text class="btn-text">预警设置</text>
				</view>
			</view>
		</view>
		
		<!-- 库存模块入口 -->
		<view class="menu-section">
			<view class="menu-item" @tap="goToPage('/pages-sub/stock/overview')">
				<view class="menu-icon-wrapper primary">
					<text class="menu-icon">📊</text>
				</view>
				<view class="menu-content">
					<text class="menu-title">库存总览</text>
					<text class="menu-desc">查询、统计、导出库存数据</text>
				</view>
				<text class="menu-arrow">→</text>
			</view>
			
			<view class="menu-item" @tap="goToPage('/pages-sub/stock/park')">
				<view class="menu-icon-wrapper success">
					<text class="menu-icon">🏞️</text>
				</view>
				<view class="menu-content">
					<text class="menu-title">园区库存</text>
					<text class="menu-desc">查看园区批次明细</text>
				</view>
				<text class="menu-arrow">→</text>
			</view>
		</view>
		
		<filter-panel
			class="panel-wrapper"
			:keyword="searchKeyword"
			keyword-placeholder="搜索药材名称/规格/拼音"
			:quick-filters="statusOptions"
			:active-quick-filter="statusFilter"
			:show-date="false"
			:show-search-button="false"
			@update:keyword="onKeywordChange"
			@quick-filter="onStatusFilter"
		/>
		
		<!-- 数据统计仪表板 -->
		<view class="dashboard">
			<view class="dashboard-card primary">
				<view class="dashboard-icon">📊</view>
				<view class="dashboard-content">
					<text class="dashboard-value">{{ dashboardStats.totalDrugs }}</text>
					<text class="dashboard-label">药材种类</text>
				</view>
				<view class="dashboard-badge">总计</view>
			</view>
			
			<view class="dashboard-card warning">
				<view class="dashboard-icon">⚠️</view>
				<view class="dashboard-content">
					<text class="dashboard-value">{{ dashboardStats.lowStockCount }}</text>
					<text class="dashboard-label">库存预警</text>
				</view>
				<view class="dashboard-badge">预警</view>
			</view>
			
			<view class="dashboard-card danger">
				<view class="dashboard-icon">🚨</view>
				<view class="dashboard-content">
					<text class="dashboard-value">{{ dashboardStats.expiredCount }}</text>
					<text class="dashboard-label">缺货药材</text>
				</view>
				<view class="dashboard-badge">缺货</view>
			</view>
			
			<!-- 近效期药材统计 -->
			<view class="dashboard-card info">
				<view class="dashboard-icon">⏰</view>
				<view class="dashboard-content">
					<text class="dashboard-value">{{ dashboardStats.nearExpiryCount }}</text>
					<text class="dashboard-label single-line">近效期药材</text>
				</view>
			</view>
		</view>
		
		<!-- 库存列表：仅在有搜索条件或选择了特定状态时显示 -->
		<view v-if="(searchKeyword || statusFilter !== 'all') && filteredDrugList.length > 0" class="stock-list">
			<view
				v-for="(item, index) in filteredDrugList"
				:key="index"
				class="stock-card"
			>
				<view class="stock-card-header">
					<text class="stock-name">{{ item.drugName || item.name || '未命名药材' }}</text>
					<view class="stock-status-tag" :class="item.expireStatusClass">
						<text class="stock-status-text">{{ getExpireStatusText(item) }}</text>
					</view>
				</view>
				
				<view class="stock-row">
					<text class="stock-label">规格/单位：</text>
					<text class="stock-value">
						{{ item.spec || '未录入规格' }}
						<text v-if="item.unit" class="stock-unit-inline">（{{ item.unit }}）</text>
					</text>
				</view>
				<view class="stock-row">
					<text class="stock-label">当前数量：</text>
					<text class="stock-value">{{ (item.totalQuantity || item.quantity || 0) }}</text>
				</view>
				
				<view class="stock-row">
					<text class="stock-label">有效期：</text>
					<text class="stock-value">
						{{ item.expireDate || '未录入有效期' }}
						<text class="expire-days-tag" :class="item.expireStatusClass">
							{{ formatExpireDays(item.expireDays) }}
						</text>
					</text>
				</view>
			</view>
		</view>
		
		<!-- 空状态：仅在有搜索条件或选择了特定状态时才提示未找到数据 -->
		<view v-if="!loading && (searchKeyword || statusFilter !== 'all') && filteredDrugList.length === 0" class="empty-state">
			<view class="empty-icon-wrapper">
				<text class="empty-icon">📦</text>
			</view>
			<text class="empty-title">{{ searchKeyword ? '未找到相关药材' : '暂无药材数据' }}</text>
			<text class="empty-desc">{{ searchKeyword ? '试试其他关键词' : '请先添加药材档案' }}</text>
		</view>

		<!-- 加载状态 -->
		<view v-if="loading" class="loading-overlay">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载中...</text>
		</view>
	</view>
</template>

<script>
import { callFunction } from '@/utils/api.js'
import FilterPanel from '@/components/filter-panel/index.vue'
import Common from '@/utils/common.js'

export default {
	components: {
		FilterPanel
	},
	data() {
		return {
			drugList: [],
			stockStats: {
				totalDrugs: 0,
				lowStockCount: 0,
				expiredCount: 0,
				nearExpiryCount: 0
			},
			searchKeyword: '',
			statusFilter: 'all',
			statusOptions: [
				{ label: '全部', value: 'all' },
				{ label: '充足', value: 'sufficient' },
				{ label: '预警', value: 'warning' },
				{ label: '缺货', value: 'empty' },
				{ label: '近效期', value: 'expiry_warning' },
				{ label: '已过期', value: 'expired' }
			],
			// 有效期预警配置：距离到期多少天以内视为近效期
			expiryWarningDays: 30,
			expiryDangerDays: 0,
			loading: false
		}
	},
	computed: {
		filteredDrugList() {
			let list = this.drugList
			const keyword = (this.searchKeyword || '').toLowerCase()
			if (keyword) {
				const isAlpha = /^[a-z]+$/.test(keyword)
				list = list.filter(item => {
					const name = (item.name || '').toLowerCase()
					const spec = (item.spec || '').toLowerCase()
					const manufacturer = (item.manufacturer || '').toLowerCase()
					const pinyin = (item.pinyin || '').toLowerCase()
					// 基础字段模糊匹配
					if (name.includes(keyword) || spec.includes(keyword) || manufacturer.includes(keyword) || pinyin.includes(keyword)) {
						return true
					}
					// 纯字母关键字：按药名即时生成拼音首字母匹配
					if (isAlpha && item.name) {
						const py = (Common.toPinyin(item.name) || '').toLowerCase()
						if (py.includes(keyword)) return true
					}
					return false
				})
			}
			if (this.statusFilter === 'sufficient') {
				return list.filter(item => (item.totalQuantity || 0) > (item.reorderLevel || 100))
			}
			if (this.statusFilter === 'warning') {
				return list.filter(item => (item.totalQuantity || 0) > 0 && (item.totalQuantity || 0) <= (item.reorderLevel || 100))
			}
			if (this.statusFilter === 'empty') {
				return list.filter(item => (item.totalQuantity || 0) === 0)
			}
			// 近效期：0 < expireDays <= expiryWarningDays
			if (this.statusFilter === 'expiry_warning') {
				return list.filter(item => {
					const d = item.expireDays
					return typeof d === 'number' && d > this.expiryDangerDays && d <= this.expiryWarningDays
				})
			}
			// 已过期：expireDays <= 0
			if (this.statusFilter === 'expired') {
				return list.filter(item => {
					const d = item.expireDays
					return typeof d === 'number' && d <= this.expiryDangerDays
				})
			}
			return list
		},
		dashboardStats() {
			const list = this.filteredDrugList
			const totalDrugs = list.length
			const lowStockCount = list.filter(item =>
				(item.totalQuantity || 0) > 0 && (item.totalQuantity || 0) <= (item.reorderLevel || 100)
			).length
			const expiredCount = list.filter(item => (item.totalQuantity || 0) === 0).length
			const nearExpiryCount = list.filter(item => {
				const d = item.expireDays
				return typeof d === 'number' && d > this.expiryDangerDays && d <= this.expiryWarningDays
			}).length
			return {
				totalDrugs,
				lowStockCount,
				expiredCount,
				nearExpiryCount
			}
		}
	},
	onLoad() {
		console.log('===== 库存页 onLoad =====')
		// 读取本地保存的有效期预警天数
		try {
			const saved = uni.getStorageSync('stock_expiry_warning_days')
			if (typeof saved === 'number' && !isNaN(saved) && saved > 0) {
				this.expiryWarningDays = saved
			}
		} catch (e) {
			console.warn('读取本地保存的有效期预警天数失败：', e)
		} finally {
			this.loadStockData()
		}
	},
	methods: {
		async loadStockData() {
			this.loading = true
			try {
				// 并行获取库存汇总和药材档案（含拼音）
				const [stockResult, drugResult] = await Promise.all([
					callFunction('stockManage', {
						action: 'getList',
						data: {
							page: 1,
							pageSize: 200
						}
					}),
					callFunction('getDrugList', {
						keyword: '',
						category: 'all',
						page: 1,
						pageSize: 500
					})
				])
				// 构建 drugId -> pinyin 的映射表
				console.log('stockManage.getList first item:', stockResult && stockResult.data && stockResult.data[0])
				const drugPinyinMap = {}
				if (drugResult && drugResult.success && Array.isArray(drugResult.data)) {
					(drugResult.data || []).forEach(drug => {
						const id = drug._id
						if (!id) return
						let py = drug.pinyin || ''
						if (!py && drug.name) {
							py = Common.toPinyin(drug.name) || ''
						}
						if (py) {
							drugPinyinMap[id] = String(py).toLowerCase()
						}
					})
				}
				const today = new Date()
				if (stockResult && stockResult.success) {
					const list = stockResult.data || []
					this.drugList = list.map(raw => {
						const item = { ...raw }
						// 统一 drugId 字段，便于映射
						item.drugId = item.drugId || item._id || ''
						// 统一搜索字段
						item.name = item.name || item.drugName || ''
						item.spec = item.spec || item.specification || ''
						// 优先使用 drugs 表中的拼音，其次使用本身拼音，最后兜底生成
						let py = drugPinyinMap[item.drugId] || item.pinyin || ''
						if (!py && item.name) {
							py = Common.toPinyin(item.name) || ''
						}
						if (py) {
							item.pinyin = String(py).toLowerCase()
						}
						// 计算距有效期天数
						if (item.expireDate) {
							const d = new Date(item.expireDate)
							if (!isNaN(d.getTime())) {
								const diffMs = d.getTime() - today.getTime()
								item.expireDays = Math.floor(diffMs / (24 * 3600 * 1000))
							}
						}
						// 预先计算有效期状态样式，避免在模板中调用函数
						item.expireStatusClass = this.getExpireStatusClass(item)
						return item
					})
				} else {
					this.drugList = []
				}
				this.calculateStats()
			} catch (e) {
				console.error('加载库存数据失败:', e)
				this.drugList = []
			} finally {
				this.loading = false
			}
		},
		onStatusFilter(val) {
			this.statusFilter = val
		},
		// 点击“预警设置”按钮：选择有效期预警天数
		onExpirySettingTap() {
			const that = this
			const options = [7, 15, 30, 60]
			uni.showActionSheet({
				itemList: options.map(d => `${d} 天内视为近效期`),
				success(res) {
					const days = options[res.tapIndex]
					that.expiryWarningDays = days
					try {
						uni.setStorageSync('stock_expiry_warning_days', days)
					} catch (e) {}
					that.calculateStats()
					uni.showToast({ title: `预警天数已设置为 ${days} 天`, icon: 'none' })
				}
			})
		},
		onKeywordChange(val) {
			this.searchKeyword = val
		},
		clearSearch() {
			this.searchKeyword = ''
		},
		calculateStats() {
			const totalDrugs = this.drugList.length
			const lowStockCount = this.drugList.filter(item =>
				(item.totalQuantity || 0) > 0 && (item.totalQuantity || 0) <= (item.reorderLevel || 100)
			).length
			const expiredCount = this.drugList.filter(item => (item.totalQuantity || 0) === 0).length
			const nearExpiryCount = this.drugList.filter(item => {
				const d = item.expireDays
				return typeof d === 'number' && d > this.expiryDangerDays && d <= this.expiryWarningDays
			}).length
			this.stockStats = {
				totalDrugs,
				lowStockCount,
				expiredCount,
				nearExpiryCount
			}
		},
		formatExpireDays(days) {
			if (days === undefined || days === null || isNaN(days)) return ''
			if (days < 0) return `已过期 ${Math.abs(days)} 天`
			if (days === 0) return '今日到期'
			return `剩余 ${days} 天`
		},
		getExpireStatusClass(item) {
			const qty = item.totalQuantity || item.quantity || 0
			const d = item.expireDays
			if (qty === 0) return 'status-empty'
			if (typeof d === 'number') {
				if (d <= 0) return 'status-expired'
				if (d <= this.expiryWarningDays) return 'status-warning'
			}
			return 'status-normal'
		},
		getExpireStatusText(item) {
			const qty = item.totalQuantity || item.quantity || 0
			const d = item.expireDays
			if (qty === 0) return '缺货'
			if (typeof d === 'number') {
				if (d <= 0) return '过期'
				if (d <= this.expiryWarningDays) return '近效期'
			}
			return '正常'
		},
		goToDetail(item) {
			uni.navigateTo({
				url: `/pages-sub/stock/detail?id=${item.drugId || item._id || ''}`,
				fail: () => {
					uni.showToast({ title: '详情开发中', icon: 'none' })
				}
			})
		},
		goToPage(url) {
			uni.navigateTo({
				url,
				fail: () => uni.showToast({ title: '页面开发中', icon: 'none' })
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

.page-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx;
}

.page-title {
	display: block;
	font-size: 36rpx;
	font-weight: 700;
	color: #1f2937;
}

/* 库存模块入口菜单 */
.menu-section {
	padding: 0 30rpx 20rpx;
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.menu-item {
	display: flex;
	align-items: center;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 24rpx 26rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
	transition: all 0.3s;
}

.menu-item:active {
	transform: translateY(-2rpx);
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.12);
}

.menu-icon-wrapper {
	width: 88rpx;
	height: 88rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.menu-icon-wrapper.primary {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.menu-icon-wrapper.success {
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.menu-icon {
	font-size: 44rpx;
}

.menu-content {
	flex: 1;
}

.menu-title {
	display: block;
	font-size: 32rpx;
	font-weight: 700;
	color: #1f2937;
	margin-bottom: 6rpx;
}

.menu-desc {
	display: block;
	font-size: 24rpx;
	color: #6b7280;
}

.menu-arrow {
	font-size: 32rpx;
	color: #cbd5e1;
	font-weight: bold;
}

.page-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx;
}

.page-title {
	display: block;
	font-size: 36rpx;
	font-weight: 700;
	color: #1f2937;
}

.page-subtitle {
	display: block;
	font-size: 22rpx;
	color: #94a3b8;
	margin-top: 4rpx;
	text-transform: uppercase;
	letter-spacing: 2rpx;
}

.header-actions {
	display: flex;
	gap: 12rpx;
}

.header-btn {
	display: flex;
	align-items: center;
	gap: 6rpx;
	padding: 12rpx 20rpx;
	border-radius: 999rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
	font-size: 24rpx;
}

.header-btn.secondary {
	background: #e5e7eb;
	color: #374151;
}

.btn-icon {
	font-size: 28rpx;
}

.panel-wrapper {
	padding: 0 30rpx 10rpx;
}

/* 数据仪表板 */
.dashboard {
	display: flex;
	gap: 15rpx;
	padding: 30rpx;
	padding-top: 20rpx;
}

.dashboard-card {
	flex: 1;
	background: #ffffff;
	border-radius: 16rpx;
	padding: 25rpx 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
	position: relative;
	overflow: hidden;
}

.dashboard-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 4rpx;
}

.dashboard-card.primary::before { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); }
.dashboard-card.warning::before { background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); }
.dashboard-card.danger::before { background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%); }

.dashboard-icon {
	font-size: 32rpx;
	margin-bottom: 15rpx;
	filter: drop-shadow(0 2rpx 4rpx rgba(0,0,0,0.1));
}

.dashboard-content {
	margin-bottom: 10rpx;
	text-align: center; /* 数字和标签居中 */
}

.dashboard-value {
	display: block;
	font-size: 40rpx;
	font-weight: bold;
	color: #2c3e50;
	line-height: 1;
	margin-bottom: 8rpx;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
}

.dashboard-label {
	display: block;
	font-size: 22rpx;
	color: #7f8c8d;
}

.dashboard-badge {
	position: absolute;
	top: 15rpx;
	right: 15rpx;
	font-size: 18rpx;
	color: #cbd5e1;
	font-weight: 500;
}

/* 库存列表整体区域 */
.stock-list {
	padding: 10rpx 30rpx 30rpx;
	display: flex;
	flex-direction: column;
	gap: 18rpx;
}

/* 单个库存卡片 */
.stock-card {
	background: #ffffff;
	border-radius: 18rpx;
	padding: 22rpx 22rpx 20rpx;
	box-shadow: 0 6rpx 18rpx rgba(15, 23, 42, 0.06);
	border: 1rpx solid #e5e7eb;
}

.stock-card-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 12rpx;
	margin-bottom: 8rpx;
}

.stock-name {
	flex: 1;
	font-size: 30rpx;
	font-weight: 700;
	color: #111827;
	line-height: 1.4;
}

.stock-spec {
	font-size: 22rpx;
	color: #6b7280;
}

.stock-status-tag {
	padding: 6rpx 12rpx;
	border-radius: 999rpx;
	font-size: 20rpx;
	font-weight: 600;
	color: #ffffff;
}

.stock-row {
	display: flex;
	margin-top: 4rpx;
}

.stock-label {
	min-width: 138rpx;
	font-size: 22rpx;
	color: #6b7280;
}

.stock-value {
	flex: 1;
	font-size: 24rpx;
	color: #111827;
}

.stock-unit-inline {
	font-size: 22rpx;
	color: #6b7280;
}

.expire-days-tag {
	margin-left: 10rpx;
	font-size: 22rpx;
	color: #6b7280;
}

/* 药材列表区域 */
.drug-section {
	padding: 0 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #2c3e50;
}

.section-count {
	font-size: 24rpx;
	color: #94a3b8;
}

.drug-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

/* 药材卡片 - 专业设计 */
.drug-card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
	border: 1rpx solid #f1f5f9;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	overflow: hidden;
}

.drug-card::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 6rpx;
	transition: all 0.3s;
}

.drug-card:active {
	transform: translateY(-4rpx);
	box-shadow: 0 12rpx 32rpx rgba(0,0,0,0.12);
}

.drug-card:active::before {
	width: 10rpx;
}

/* 药材头部 */
.drug-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 25rpx;
}

.drug-main-info {
	flex: 1;
	margin-right: 20rpx;
}

.drug-name {
	display: block;
	font-size: 32rpx;
	font-weight: bold;
	color: #1e293b;
	margin-bottom: 10rpx;
	line-height: 1.4;
}

.drug-meta {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.drug-spec {
	font-size: 24rpx;
	color: #64748b;
}

.drug-divider {
	color: #cbd5e1;
	font-size: 20rpx;
}

.drug-manufacturer {
	font-size: 22rpx;
	color: #94a3b8;
}

/* 状态徽章 */
.drug-status-badge {
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	font-weight: 600;
	white-space: nowrap;
}

.status-success {
	background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
	color: #065f46;
}

.status-warning {
	background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
	color: #92400e;
}

.status-danger {
	background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
	color: #991b1b;
}

/* 库存信息栏 */
.drug-stock-info {
	display: flex;
	align-items: center;
	background: #f8fafc;
	border-radius: 12rpx;
	padding: 20rpx 25rpx;
	margin-bottom: 20rpx;
}

.stock-item {
	flex: 1;
	text-align: center;
}

.stock-label {
	display: block;
	font-size: 22rpx;
	color: #64748b;
	margin-bottom: 8rpx;
}

.stock-value-wrapper {
	display: flex;
	align-items: baseline;
	justify-content: center;
	gap: 6rpx;
}

.stock-value {
	font-size: 42rpx;
	font-weight: bold;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
	line-height: 1;
}

.stock-value.color-success { color: #10b981; }
.stock-value.color-warning { color: #f59e0b; }
.stock-value.color-danger { color: #ef4444; }

.stock-value-small {
	font-size: 32rpx;
	font-weight: 600;
	color: #64748b;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
}

.stock-unit {
	font-size: 20rpx;
	color: #94a3b8;
}

.stock-divider {
	width: 1rpx;
	height: 40rpx;
	background: #e2e8f0;
}

/* 进度条 */
.progress-bar {
	height: 8rpx;
	background: #e2e8f0;
	border-radius: 10rpx;
	overflow: hidden;
	margin-bottom: 20rpx;
}

.progress-fill {
	height: 100%;
	border-radius: 10rpx;
	transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-success { background: linear-gradient(90deg, #10b981 0%, #059669 100%); }
.progress-warning { background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); }
.progress-danger { background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%); }

/* 操作提示 */
.drug-action-hint {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.hint-text {
	font-size: 22rpx;
	color: #94a3b8;
}

.hint-arrow {
	font-size: 24rpx;
	color: #cbd5e1;
	font-weight: bold;
}

/* 空状态 - 优雅设计 */
.empty-state {
	padding: 150rpx 60rpx;
	text-align: center;
}

.empty-icon-wrapper {
	width: 160rpx;
	height: 160rpx;
	margin: 0 auto 30rpx;
	background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.empty-icon {
	font-size: 80rpx;
	opacity: 0.5;
}

.empty-title {
	display: block;
	font-size: 32rpx;
	font-weight: bold;
	color: #475569;
	margin-bottom: 12rpx;
}

.empty-desc {
	display: block;
	font-size: 26rpx;
	color: #94a3b8;
}

/* 库存列表整体左右留白，与页面其它区域对齐 */
.stock-list {
	padding: 0 30rpx 30rpx;
}

/* 加载状态 */
.loading-overlay {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
}

.loading-spinner {
	width: 60rpx;
	height: 60rpx;
	border: 4rpx solid #e2e8f0;
	border-top-color: #667eea;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to { transform: rotate(360deg); }
}

.loading-text {
	font-size: 26rpx;
	color: #64748b;
}
</style>

