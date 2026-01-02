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
					<text class="clinic-subtitle">● 北京欢乐谷医务室 ●</text>
				</view>
	</view>
		</view>
	</view>
		
		<!-- 快捷操作区 - 统一网格布局 -->
		<view class="quick-actions">
			<view class="section-header">
				<text class="section-title">快捷操作</text>
			</view>
			
			<!-- 统一的网格容器：根据角色展示不同数量的入口（管理员6个，项目经理4个，医生4个） -->
			<view class="unified-grid">
				<!-- 管理员：新建入库单 -->
				<view
					v-if="showInboundButton && role === 'admin'"
					class="grid-card clinic-card register"
					@tap="goToPage('/pages-sub/in/add')"
				>
					<view class="clinic-card-glass"></view>
					<view class="clinic-card-content">
						<view class="clinic-card-icon inbound"></view>
						<view class="clinic-card-text">
							<text class="clinic-card-title">新建入库单</text>
							<text class="clinic-card-desc"></text>
						</view>
					</view>
				</view>

				<!-- 管理员 & 项目经理：待复核入库单 -->
				<view
					v-if="showReviewEntry && (role === 'admin' || role === 'project_manager')"
					class="grid-card clinic-card review"
					@tap="goToPage('/pages-sub/in/list?status=pending_review')"
				>
					<view class="clinic-card-glass"></view>
					<view class="clinic-card-content">
						<view class="clinic-card-icon review"></view>
						<view class="clinic-card-text">
							<text class="clinic-card-title">待复核入库单</text>
							<view class="review-count-badge">
								<text class="review-count-text">{{ pendingReviewCount || 0 }}</text>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 管理员 & 医生：待复核出库单 -->
				<view
					v-if="canReviewOut && (role === 'admin' || role === 'doctor')"
					class="grid-card clinic-card summary"
					@tap="goToPage('/pages-sub/out/list?status=pending_review')"
				>
					<view class="clinic-card-glass"></view>
					<view class="clinic-card-content">
						<view class="clinic-card-icon summary"></view>
						<view class="clinic-card-text">
							<text class="clinic-card-title">待复核出库单</text>
							<view class="review-count-badge">
								<text class="review-count-text">{{ pendingOutReviewCount || 0 }}</text>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 管理员 & 医生：新建出库单（项目经理首页不再展示此入口） -->
				<view
					v-if="canEditInOut && (role === 'admin' || role === 'doctor')"
					class="grid-card clinic-card register"
					@tap="goToPage('/pages-sub/out/add')"
				>
					<view class="clinic-card-glass"></view>
					<view class="clinic-card-content">
						<view class="clinic-card-icon outbound"></view>
						<view class="clinic-card-text">
							<text class="clinic-card-title">新建出库单</text>
							<text class="clinic-card-desc"></text>
						</view>
					</view>
				</view>
				
				<!-- 管理员 & 医生：门诊登记 -->
				<view
					v-if="role === 'admin' || role === 'doctor'"
					class="grid-card clinic-card register"
					@tap="goToPage('/pages-sub/clinic/add')"
				>
					<view class="clinic-card-glass"></view>
					<view class="clinic-card-content">
						<view class="clinic-card-icon register"></view>
						<view class="clinic-card-text">
							<text class="clinic-card-title">门诊登记</text>
							<text class="clinic-card-desc"></text>
						</view>
					</view>
				</view>
				
				<!-- 管理员 & 医生：门诊日报 -->
				<view
					v-if="role === 'admin' || role === 'doctor'"
					class="grid-card clinic-card daily"
					@tap="generateDailyReport"
				>
					<view class="clinic-card-glass"></view>
					<view class="clinic-card-content">
						<view class="clinic-card-icon daily"></view>
						<view class="clinic-card-text">
							<text class="clinic-card-title">门诊日报</text>
							<text class="clinic-card-desc"></text>
						</view>
					</view>
				</view>
				
				<!-- 项目经理专属入口：库存查询 -->
				<view
					v-if="role === 'project_manager'"
					class="grid-card clinic-card summary"
					@tap="goToPage('/pages/stock/index')"
				>
					<view class="clinic-card-glass"></view>
					<view class="clinic-card-content">
						<view class="clinic-card-icon summary"></view>
						<view class="clinic-card-text">
							<text class="clinic-card-title">库存查询</text>
							<text class="clinic-card-desc"></text>
						</view>
					</view>
				</view>
				
				<!-- 项目经理专属入口：药材近效期 -->
				<view
					v-if="role === 'project_manager'"
					class="grid-card clinic-card daily"
					@tap="goToPage('/pages/stock/index?filter=expiring')"
				>
					<view class="clinic-card-glass"></view>
					<view class="clinic-card-content">
						<view class="clinic-card-icon daily"></view>
						<view class="clinic-card-text">
							<text class="clinic-card-title">药材近效期</text>
							<text class="clinic-card-desc"></text>
						</view>
					</view>
				</view>
				
				<!-- 项目经理专属入口：用户管理 -->
				<view
					v-if="role === 'project_manager'"
					class="grid-card clinic-card register"
					@tap="goToPage('/pages-sub/setting/user-list')"
				>
					<view class="clinic-card-glass"></view>
					<view class="clinic-card-content">
						<view class="clinic-card-icon register"></view>
						<view class="clinic-card-text">
							<text class="clinic-card-title">用户管理</text>
							<text class="clinic-card-desc"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 今日数据 - 数据可视化 -->
		<view class="stats-section">
			<view class="section-header">
				<text class="section-title">今日数据</text>
				
			</view>
			<view v-if="isLoadingStats" class="stats-grid">
				<view class="stat-card skeleton" v-for="i in 4" :key="i">
					<view class="skeleton-icon shimmer"></view>
					<view class="skeleton-line shimmer"></view>
					<view class="skeleton-line short shimmer"></view>
				</view>
			</view>
			<view v-else class="stats-grid">
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
						<text class="stat-unit"></text>
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
						<text class="stat-unit"></text>
					</view>
					<view class="stat-decorative-line green"></view>
				</view>
				
				<!-- 医生：一个门诊卡片 + 一个近效期药材卡片 -->
				<block v-if="role === 'doctor'">
					<!-- 当前园区的今日就诊人数 -->
					<view
						class="stat-card"
						@tap="goToPage(`/pages-sub/clinic/list?filter=today&location=${currentClinicLocation}`)"
					>
						<view class="stat-icon-wrapper orange">
							<view class="stat-icon-shape">
								<view class="pill-shape"></view>
								<view class="pill-shape pill-2"></view>
							</view>
						</view>
						<view class="stat-content">
							<text class="stat-value">
								{{ currentClinicLocation === 'water_park' ? (todayStats.clinicWaterCount || 0) : (todayStats.clinicLandCount || 0) }}人次
							</text>
							<text class="stat-label">今日就诊人数（{{ currentClinicLocationName }}）</text>
							<text class="stat-unit"></text>
						</view>
						<view class="stat-decorative-line orange"></view>
					</view>
					
					<!-- 近效期药材 -->
					<view class="stat-card" @tap="goToPage('/pages/stock/index?filter=expiring')">
						<view class="stat-icon-wrapper red">
							<view class="stat-icon-shape">
								<view class="alert-triangle"></view>
								<text class="alert-exclamation">!</text>
							</view>
						</view>
						<view class="stat-content">
							<text class="stat-value">{{ todayStats.lowStockCount }}</text>
							<text class="stat-label">近效期药材</text>
							<text class="stat-unit">种</text>
						</view>
						<view class="stat-decorative-line red"></view>
					</view>
				</block>
				
				<!-- 管理员 / 项目经理等：继续显示陆园 / 水园两张门诊卡片 -->
				<block v-else>
					<!-- 今日就诊人数（陆园） -->
					<view class="stat-card" @tap="goToPage('/pages-sub/clinic/list?filter=today&location=land_park')">
						<view class="stat-icon-wrapper orange">
							<view class="stat-icon-shape">
								<view class="pill-shape"></view>
								<view class="pill-shape pill-2"></view>
							</view>
						</view>
						<view class="stat-content">
							<text class="stat-value">{{ todayStats.clinicLandCount }}人次</text>
							<text class="stat-label">今日就诊人数（陆园）</text>
							<text class="stat-unit"></text>
						</view>
						<view class="stat-decorative-line orange"></view>
					</view>
					
					<!-- 今日就诊人数（水园） -->
					<view class="stat-card" @tap="goToPage('/pages-sub/clinic/list?filter=today&location=water_park')">
						<view class="stat-icon-wrapper red">
							<view class="stat-icon-shape">
								<view class="alert-triangle"></view>
								<text class="alert-exclamation">⛑</text>
							</view>
						</view>
						<view class="stat-content">
							<text class="stat-value">{{ todayStats.clinicWaterCount }}人次</text>
							<text class="stat-label">今日就诊人数（水园）</text>
							<text class="stat-unit"></text>
						</view>
						<view class="stat-decorative-line red"></view>
					</view>
				</block>
			</view>
		</view>
		
		<!-- 系统状态 - 专业监控面板 -->
		<view class="status-panel">
			<view class="section-header">
				<text class="section-title">系统状态</text>
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
import { hasPermission, canReview, canReviewOutbound, canEditInOutRecords, getCurrentRole } from '@/utils/permission.js'

export default {
	data() {
		return {
			todayStats: {
				inCount: 0,
				outCount: 0,
				totalDrugs: 0,
				lowStockCount: 0,
				clinicCount: 0,
				clinicLandCount: 0,
				clinicWaterCount: 0
			},
			lastUpdateTime: '',
			userInfo: null,
			role: getCurrentRole(),
			currentClinicLocation: 'land_park',
			currentClinicLocationName: '陆园',
			canCreateIn: false,  // 是否可以创建入库单
			canReviewIn: false,  // 是否可以复核入库单
			canReviewOut: false, // 是否可以复核/接收出库单
			pendingReviewCount: 0,  // 待复核数量（入库）
			pendingOutReviewCount: 0, // 待复核数量（出库）
			isLoadingStats: true
		}
	},
	
	computed: {
		// 是否显示新建入库单按钮
		showInboundButton() {
			return this.canCreateIn
		},
		// 是否显示待复核入口
		showReviewEntry() {
			return this.canReviewIn
		},
		// 是否可以操作入/出库单（首页其它区域可能使用）
		canEditInOut() {
			return canEditInOutRecords(this.role)
		}
	},
	onLoad() {
		console.log('===== 首页 onLoad =====')
		this.checkPermissions()
		this.loadClinicLocation()
		this.updateLastUpdateTime()
		this.loadTodayStats()
	},
	onShow() {
		console.log('===== 首页 onShow =====')
		this.checkPermissions()
		this.loadClinicLocation()
		this.loadTodayStats()
		this.loadPendingReviewCount()
	},
	onReady() {
		console.log('===== 首页 onReady =====')
	},
	methods: {
		// 检查权限
		checkPermissions() {
			this.userInfo = uni.getStorageSync('userInfo')
			if (this.userInfo && this.userInfo.role) {
				this.role = this.userInfo.role
				// 检查是否可以创建入库单
				this.canCreateIn = hasPermission(this.userInfo.role, 'in.create')
				// 检查是否可以复核入库单
				this.canReviewIn = canReview(this.userInfo.role)
				// 检查是否可以复核/接收出库单
				this.canReviewOut = canReviewOutbound(this.userInfo.role)
				
				console.log('权限检查:', {
					role: this.userInfo.role,
					canCreateIn: this.canCreateIn,
					canReviewIn: this.canReviewIn
				})
			} else {
				this.canCreateIn = false
				this.canReviewIn = false
				this.canReviewOut = false
			}
		},

		// 加载最近使用的门诊园区，用于医生待办显示
		loadClinicLocation() {
			try {
				const last = uni.getStorageSync('clinic_last_location')
				if (last === 'land_park' || last === 'water_park') {
					this.currentClinicLocation = last
					this.currentClinicLocationName = last === 'water_park' ? '水园' : '陆园'
				} else {
					this.currentClinicLocation = 'land_park'
					this.currentClinicLocationName = '陆园'
				}
			} catch (e) {
				this.currentClinicLocation = 'land_park'
				this.currentClinicLocationName = '陆园'
			}
		},
		
		// 加载待复核数量
		async loadPendingReviewCount() {
			if (!this.canReviewIn) {
				this.pendingReviewCount = 0
				return
			}
			
			try {
				const result = await callFunction('inRecords', {
					action: 'getCounts',
					data: {}
				})
				
				if (result) {
					const pendingCount =
						result.pendingReview ??
						result.pending_review ??
						result.pending ??
						0
					this.pendingReviewCount = pendingCount
				}
			} catch (err) {
				console.error('获取待复核数量失败:', err)
				this.pendingReviewCount = 0
			}
		},
		
		// 更新最后更新时间
		updateLastUpdateTime() {
			const now = new Date()
			const hours = String(now.getHours()).padStart(2, '0')
			const minutes = String(now.getMinutes()).padStart(2, '0')
			this.lastUpdateTime = `${hours}:${minutes}`
		},
		
		// 加载今日统计数据
		async loadTodayStats() {
			this.isLoadingStats = true
			try {
				// 今天日期，用于门诊统计
				const today = new Date()
				const y = today.getFullYear()
				const m = String(today.getMonth() + 1).padStart(2, '0')
				const d = String(today.getDate()).padStart(2, '0')
				const dateStr = `${y}-${m}-${d}`

				const [inData, outData, drugData, stockData, clinicLandData, clinicWaterData] = await Promise.all([
					callFunction('inRecords', { action: 'getCounts', data: {} }, false),
					callFunction('outRecords', { action: 'getCounts', data: {} }, false),
					callFunction('drugManage', { action: 'getList', data: { pageSize: 1, pageNum: 1 } }, false).catch(e => {
						console.log('获取药材总数失败', e)
						return { data: { total: 0 } }
					}),
					callFunction('stockManage', { action: 'getLowStockList', data: {} }, false).catch(e => {
						console.log('获取库存预警失败', e)
						return { data: [] }
					}),
					// 今日门诊记录数量统计（陆园）
					callFunction('clinicRecords', {
						action: 'list',
						data: {
							location: 'land_park',
							startDate: dateStr,
							endDate: dateStr,
							pageSize: 1000,
							useClinicRecords: true
						}
					}, false).catch(e => {
						console.log('获取陆园门诊记录失败', e)
						return { data: { list: [] } }
					}),
					// 今日门诊记录数量统计（水园）
					callFunction('clinicRecords', {
						action: 'list',
						data: {
							location: 'water_park',
							startDate: dateStr,
							endDate: dateStr,
							pageSize: 1000,
							useClinicRecords: true
						}
					}, false).catch(e => {
						console.log('获取水园门诊记录失败', e)
						return { data: { list: [] } }
					})
				])
				
				// 待复核出库数量（如果接口支持）
				const outPending =
					outData?.pendingReview ??
					outData?.pending_review ??
					outData?.pending ??
					0
				this.pendingOutReviewCount = outPending
				
				// 今日门诊数量（陆园 / 水园）
				const clinicLandList = clinicLandData?.data?.list || clinicLandData?.result?.data?.list || []
				const clinicWaterList = clinicWaterData?.data?.list || clinicWaterData?.result?.data?.list || []
				
				this.todayStats = {
					inCount: inData?.today || 0,
					outCount: outData?.today || 0,
					totalDrugs: drugData?.data?.total || 0,
					lowStockCount: stockData?.data?.length || 0,
					clinicCount: (clinicLandList.length || 0) + (clinicWaterList.length || 0),
					clinicLandCount: clinicLandList.length || 0,
					clinicWaterCount: clinicWaterList.length || 0
				}
				this.updateLastUpdateTime()
				console.log('今日统计加载成功:', this.todayStats)
			} catch (err) {
				console.error('加载统计数据失败:', err)
				this.todayStats = { inCount: 0, outCount: 0, totalDrugs: 0, lowStockCount: 0 }
			} finally {
				this.isLoadingStats = false
			}
		},
		
		// 生成当日门诊日报并跳转
		async generateDailyReport() {
			try {
				uni.showLoading({ title: '生成中...' })
				
				// 日期与园区
				const today = new Date()
				const year = today.getFullYear()
				const month = String(today.getMonth() + 1).padStart(2, '0')
				const day = String(today.getDate()).padStart(2, '0')
				const dateStr = `${year}-${month}-${day}`
				
				let location = 'land_park'
				try {
					const last = uni.getStorageSync('clinic_last_location')
					if (last === 'land_park' || last === 'water_park') location = last
				} catch (e) {}
				const locationName = location === 'land_park' ? '陆园' : '水园'
				
				// 查询完整门诊记录
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
				
				// 若无数据
				if (!records || records.length === 0) {
					uni.hideLoading()
					uni.showToast({ title: '当日无门诊记录', icon: 'none' })
					return
				}
				
				// 复用登记页算法：在本页实现轻量版
				const reportPkg = this.$options.methods._buildDailyReport(records, dateStr, locationName)
				
				uni.hideLoading()
				uni.navigateTo({
					url: `/pages-sub/report/daily?content=${encodeURIComponent(reportPkg.report)}&date=${encodeURIComponent(`${year}年${month}月${day}日`)}&location=${encodeURIComponent(locationName)}&stats=${encodeURIComponent(JSON.stringify(reportPkg.stats))}&tableData=${encodeURIComponent(JSON.stringify(reportPkg.tableData))}`
				})
			} catch (err) {
				console.error('生成日报失败:', err)
				uni.hideLoading()
				uni.showToast({ title: '生成失败', icon: 'none' })
			}
		},
		
		// 私有：在首页也构建日报（与登记页口径一致）
		_buildDailyReport(records, dateStr, locationName) {
			const date = new Date(dateStr)
			const year = date.getFullYear()
			const month = date.getMonth() + 1
			const day = date.getDate()
			const dateFormatted = `${year}年${month}月${day}日`
			
			const statsAgg = {
				total: records.length,
				visitor: [],
				employee: [],
				outcall: []
			}
			
			records.forEach(r => {
				const identity = r.identity || '游客'
				const disease = r.diseaseName || r.diagnosis || r.chiefComplaint || '未知'
				const loc = r.injuryLocation || ''
				const isOut = r.isOutcall || r.visitType === 'outcall'
				
				if (isOut && loc) {
					const found = statsAgg.outcall.find(i => i.location === loc)
					found ? found.count++ : statsAgg.outcall.push({ location: loc, count: 1 })
				}
				const bucket = identity === '员工' ? 'employee' : 'visitor'
				const arr = statsAgg[bucket]
				const ex = arr.find(i => i.disease === disease)
				if (ex) {
					ex.total++
					if (bucket === 'visitor' && loc) {
						const l = ex.locations.find(x => x.name === loc)
						l ? l.count++ : ex.locations.push({ name: loc, count: 1 })
					}
				} else {
					arr.push({
						disease,
						total: 1,
						locations: bucket === 'visitor' && loc ? [{ name: loc, count: 1 }] : []
					})
				}
			})
			
			let report = `${dateFormatted}欢乐谷医务室（${locationName}）当日接诊${statsAgg.total}人。`
			if (statsAgg.visitor.length) {
				const vt = statsAgg.visitor.reduce((s, i) => s + i.total, 0)
				const parts = statsAgg.visitor.map(i => {
					if (i.locations?.length) {
						const lps = i.locations.map(l => `${l.name}${l.count}人`).join('，')
						return `${i.disease}${i.total}人（${lps}）`
					}
					return `${i.disease}${i.total}人`
				})
				report += `\n游客${vt}人：${parts.join('，')}。`
			}
			if (statsAgg.employee.length) {
				const et = statsAgg.employee.reduce((s, i) => s + i.total, 0)
				report += `\n员工${et}人：${statsAgg.employee.map(i => `${i.disease}${i.total}人`).join('，')}。`
			}
			if (statsAgg.outcall.length) {
				const ot = statsAgg.outcall.reduce((s, i) => s + i.count, 0)
				report += `\n出诊${ot}次：${statsAgg.outcall.map(i => `${i.location}${i.count}次`).join('，')}。`
			}
			
			// 构造表数据（按登记页逻辑）
			let doctorName = ''
			try {
				const u = uni.getStorageSync('userInfo'); doctorName = u?.name || ''
			} catch(e){}
			const tableData = {
				visitor: records.filter(r => (r.identity || '游客') === '游客').map(r => ({
					name: r.name || '',
					diseaseName: r.diseaseName || r.diagnosis || r.chiefComplaint || '未知',
					location: r.injuryLocation || '',
					visitTime: r.visitDateTime || r.createTime || '',
					isOutcall: r.isOutcall || r.visitType === 'outcall',
					doctorName
				})),
				employee: records.filter(r => r.identity === '员工').map(r => ({
					name: r.name || '',
					diseaseName: r.diseaseName || r.diagnosis || r.chiefComplaint || '未知',
					location: r.injuryLocation || '',
					visitTime: r.visitDateTime || r.createTime || '',
					isOutcall: r.isOutcall || r.visitType === 'outcall',
					doctorName
				}))
			}
			
			const statsSimple = {
				total: statsAgg.total,
				visitorTotal: tableData.visitor.length,
				employeeTotal: tableData.employee.length,
				outcallTotal: statsAgg.outcall.reduce((s,i)=>s+i.count,0)
			}
			
			return { report, stats: statsSimple, tableData }
		},
		
		
		// 页面跳转
		goToPage(url) {
			// tabBar 页面必须使用 switchTab，其它页面使用 navigateTo
			const tabPages = [
				'/pages/index/index',
				'/pages/stock/index',
				'/pages/record/index',
				'/pages/user/index'
			]
			const isTabPage = tabPages.includes(url)
			if (isTabPage) {
				uni.switchTab({
					url,
					fail: (err) => {
						console.log('页面跳转失败:', err)
						uni.showToast({
							title: '页面开发中',
							icon: 'none'
						})
					}
				})
			} else {
				uni.navigateTo({
					url,
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
}
</script>

<style>
.page {
	min-height: 100vh;
	/* 使用与“我的”页相同的蓝色渐变背景，统一整体风格 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	/* 兼容底部安全区，避免被 Tab 覆盖 */
	padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
}

/* 顶部工作台卡片：白色立体卡片，居中固定宽度 */
.header-card {
	position: relative;
	margin: 22rpx auto 12rpx;
	padding: 24rpx 24rpx 30rpx;
	max-width: 702rpx;
	/* 统一为象牙白圆角卡片，风格与“我的”页个人信息卡一致 */
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow:
		0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
		0 -1rpx 0 rgba(15, 23, 42, 0.06) inset,
		0 18rpx 40rpx rgba(15, 23, 42, 0.14);
}

.header-card::after {
	/* 去掉原来的底部过渡带，避免影响统一卡片形状 */
	content: none;
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
	border-radius: 50%;
	/* 蓝绿渐变医疗圆形底，带高光和边框 */
	background:
		linear-gradient(145deg, #2a91e9 0%, #22c1c3 40%, #e0f7ff 100%);
	border: 3rpx solid rgba(255, 255, 255, 0.9);
	box-shadow:
		0 10rpx 26rpx rgba(15, 23, 42, 0.25),
		0 0 0 1rpx rgba(15, 23, 42, 0.06),
		inset 0 2rpx 8rpx rgba(255, 255, 255, 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
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
	box-shadow:
		0 2rpx 4rpx rgba(15, 23, 42, 0.18);
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

/* 小绿叶：依附在十字右上，象征康复与生机 */
.logo-circle::after {
	content: none;
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
	font-size: 40rpx;
	font-weight: 800;
	color: #111827;
	margin-bottom: 6rpx;
	text-shadow: 0 2rpx 6rpx rgba(148, 163, 184, 0.5);
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
	color: #2a91e9;
	letter-spacing: 1rpx;
	font-weight: 500;
}

/* 快捷操作区：作为一张白色卡片容器 */
.quick-actions {
	margin: 4rpx auto 12rpx;
	padding: 20rpx 24rpx 22rpx;
	max-width: 702rpx;
	/* 与“我的”页菜单分组统一为象牙白大卡片 */
	background: #FFFFF0;
	border-radius: 24rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

/* 统一的6列网格布局系统：所有卡片统一宽度（每行两个） */
.unified-grid {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 20rpx;
	width: 100%;
}

/* 网格卡片基类：统一圆角、阴影、内边距与宽度 */
.grid-card {
	box-sizing: border-box;
	grid-column: span 3; /* 每个卡片占 3 列，一行两个 */
	border-radius: 20rpx;
	padding: 20rpx 18rpx;
	/* 身份证式浅青蓝纸质感：顶部加深一点暖黄高光，整体偏蓝 */
	background: linear-gradient(145deg, #fdf5e7 0%, #e6f0ff 26%, #c0d8ff 68%, #a1c1ff 100%);
	border: 1rpx solid rgba(48, 102, 189, 0.95);
	box-shadow:
		0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
		0 -1rpx 0 rgba(48, 102, 189, 0.5) inset,
		0 16rpx 34rpx rgba(15, 23, 42, 0.18);
}

/* 为了兼容旧代码，large/medium/small 不再区分宽度，统一为 span 3 */
.grid-card.large,
.grid-card.medium,
.grid-card.small {
	grid-column: span 3;
}
.role-badge {
	width: 100%;
	display: flex;
	align-items: center;
	gap: 14rpx;
	padding: 24rpx 26rpx;
	border-radius: 22rpx;
	color: #ffffff;
	box-shadow: 0 12rpx 26rpx rgba(31,41,55,0.18);
	position: relative;
	overflow: hidden;
	border: 1rpx solid rgba(255,255,255,0.18);
	/* 边框纳入宽度，防止右侧溢出 1rpx 导致看似不对齐 */
	box-sizing: border-box;
	min-height: 120rpx;
}
.role-badge:active { transform: scale(0.98); }
.role-badge.inbound { background: linear-gradient(135deg, #00e0c3 0%, #00c6ff 55%, #0088ff 100%); }
.role-badge.review { background: linear-gradient(135deg, #a78bfa 0%, #7c5cf4 55%, #4f46e5 100%); }
.role-badge::before {
	content: '';
	position: absolute;
	left: -30%;
	top: -20%;
	width: 40%;
	height: 160%;
	background: linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
	transform: rotate(15deg);
	animation: sweep 3.2s ease-in-out infinite;
	pointer-events: none;
}
.role-badge::after {
	content: '';
	position: absolute;
	right: -18%;
	top: -40%;
	width: 240rpx;
	height: 240rpx;
	border-radius: 50%;
	background: radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%);
}
.role-badge-icon {
	width: 68rpx;
	height: 68rpx;
	border-radius: 50%;
	background: rgba(255,255,255,0.22);
	backdrop-filter: blur(10rpx);
	border: 2rpx solid rgba(255,255,255,0.35);
	box-shadow: inset 0 0 0 2rpx rgba(255,255,255,0.2);
	position: relative;
	flex-shrink: 0;
}
/* 简化的图形：入库箭头/复核勾 */
.role-badge-icon.inbound::before {
	content: '';
	position: absolute;
	left: 50%;
	top: 16rpx;
	transform: translateX(-50%);
	width: 4rpx;
	height: 20rpx;
	background: #ffffff;
	border-radius: 2rpx;
}
.role-badge-icon.inbound::after {
	content: '';
	position: absolute;
	left: 50%;
	bottom: 10rpx;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-left: 8rpx solid transparent;
	border-right: 8rpx solid transparent;
	border-top: 10rpx solid #ffffff;
}
.role-badge-icon.review::after {
	content: '';
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%) rotate(-40deg);
	width: 26rpx;
	height: 14rpx;
	border-left: 4rpx solid #ffffff;
	border-bottom: 4rpx solid #ffffff;
	border-radius: 3rpx;
}
.role-badge-text { flex: 1; display: flex; flex-direction: column; gap: 4rpx; }
.role-badge-title { font-size: 34rpx; font-weight: 800; text-shadow: 0 2rpx 10rpx rgba(0,0,0,0.22); letter-spacing: 0.5rpx; }
.role-badge-desc { font-size: 22rpx; opacity: 0.9; }
.role-badge-tag {
	padding: 8rpx 16rpx;
	border-radius: 999rpx;
	background: rgba(255,255,255,0.28);
	font-size: 22rpx;
	font-weight: 700;
	color: #ffffff;
	box-shadow: 0 16rpx 40rpx rgba(15, 23, 42, 0.28);
}

/* 待办事项区：卡片化样式，呼应药材管理页 */
.todo-section {
	padding: 0 30rpx 10rpx;
}

.todo-card {
	background: #ffffff;
	border-radius: 24rpx;
	box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.06);
	padding: 8rpx 18rpx;
}

.todo-item {
	display: flex;
	align-items: center;
	padding: 12rpx 4rpx;
}

.todo-item + .todo-item {
	border-top: 1rpx solid rgba(148, 163, 184, 0.18);
}

.todo-icon {
	width: 52rpx;
	text-align: center;
	font-size: 30rpx;
	margin-right: 10rpx;
}

.todo-text {
	flex: 1;
	font-size: 26rpx;
	color: #111827;
}

.todo-count {
	min-width: 60rpx;
	text-align: right;
	font-size: 24rpx;
	color: #2563eb;
	font-weight: 600;
	margin-right: 4rpx;
}

.todo-arrow {
	font-size: 24rpx;
	color: #9ca3af;
}

.role-badge-tag.count {
	min-width: 56rpx;
	height: 56rpx;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999rpx;
	background: linear-gradient(135deg, #ff6b6b 0%, #ff3b3b 100%);
	border: 3rpx solid rgba(255,255,255,0.6);
	box-shadow: 0 6rpx 16rpx rgba(255, 59, 59, 0.35);
	animation: countPulse 2.4s ease-in-out infinite;
	font-size: 44rpx;
}
@keyframes sweep {
	0% { transform: translateX(0) rotate(15deg); opacity: 0.9; }
	50% { transform: translateX(260%) rotate(15deg); opacity: 0.7; }
	100% { transform: translateX(0) rotate(15deg); opacity: 0.9; }
}
@keyframes countPulse {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.06); }
}

/* 移除旧的 clinic-quick-grid，已集成到 unified-grid */

.clinic-card {
	position: relative;
	padding: 26rpx;
	border-radius: 24rpx;
	overflow: hidden;
	color: #ffffff;
	box-shadow: 0 16rpx 32rpx rgba(31, 41, 55, 0.22);
	transform: translateY(0);
	transition: transform 0.18s ease, box-shadow 0.18s ease;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 10rpx;
	min-height: 210rpx;
}

.clinic-card::after {
	content: '';
	position: absolute;
	inset: -20%;
	border-radius: 30rpx;
	background: rgba(255,255,255,0.08);
	opacity: 0;
	transition: opacity 0.18s ease;
}

.clinic-card:active {
	transform: scale(0.97);
	box-shadow: 0 10rpx 26rpx rgba(31, 41, 55, 0.26);
}

.clinic-card:active::after {
	opacity: 1;
}

/* 取消玻璃蒙层，保持更干净的白底 */
.clinic-card .clinic-card-glass {
	display: none;
}

.clinic-card-content {
	position: relative;
	display: flex;
	flex-direction: column; /* 图标在上，文字在下 */
	align-items: center;
	justify-content: space-between;
	gap: 12rpx;
	padding-top: 8rpx;
	height: 100%;
	width: 100%;
	z-index: 1;
}

/* 所有快捷卡片标题居中显示 */
.clinic-card .clinic-card-title {
	text-align: center;
	width: 100%;
	align-self: center;
}

/* 待复核入库单数量徽标样式 */
.review-count-badge {
	position: absolute;
	top: 20rpx;
	right: 22rpx;
	min-width: 40rpx;
	height: 40rpx;
	padding: 0 10rpx;
	border-radius: 999rpx;
	/* 在偏蓝卡片上更醒目的徽标：浅黄色，柔和一些 */
	background: linear-gradient(135deg, #fffcf0 0%, #fde68a 45%, #fbbf24 100%);
	box-shadow: 0 4rpx 10rpx rgba(234, 179, 8, 0.45);
	display: flex;
	align-items: center;
	justify-content: center;
}

.review-count-text {
	font-size: 24rpx;
	font-weight: 800;
	/* 数字颜色加深一点，提升对比度 */
	color: #92400e;
}

.clinic-card-icon {
	position: relative;
	width: 74rpx;
	height: 74rpx;
	border-radius: 50%;
	/* 蓝白线性图标底：浅蓝填充，适合线性图标 */
	background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.9) 45%, rgba(42,145,233,0.18) 100%);
	backdrop-filter: blur(10rpx);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	box-shadow: inset 0 0 0 2rpx rgba(255,255,255,0.28);
}

.clinic-card-icon::before,
.clinic-card-icon::after {
	content: '';
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	border-radius: 999rpx;
}

/* 门诊登记 / 加号：绿色十字 */
.clinic-card-icon.register::before {
	width: 40rpx;
	height: 6rpx;
	background: #16a34a;
}

.clinic-card-icon.register::after {
	width: 6rpx;
	height: 40rpx;
	background: #16a34a;
}

/* 待复核入库单：橙色对勾 */
.clinic-card-icon.review::before {
	width: 38rpx;
	height: 22rpx;
	border-radius: 12rpx;
	background: rgba(254, 226, 226, 0.95);
	border: 2rpx solid #ef4444;
}

.clinic-card-icon.review::after {
	content: '✓';
	width: auto;
	height: auto;
	border-radius: 0;
	border: none;
	background: transparent;
	color: #ef4444;
	font-size: 24rpx;
	font-weight: 700;
}

.clinic-card-icon.inbound::before {
	width: 8rpx;
	height: 32rpx;
	top: 30%;
	background: #2563eb;
}

.clinic-card-icon.inbound::after {
	width: 0;
	height: 0;
	border-left: 10rpx solid transparent;
	border-right: 10rpx solid transparent;
	border-top: 14rpx solid #2563eb;
	bottom: 10rpx;
}

.clinic-card-icon.daily::before {
	width: 46rpx;
	height: 46rpx;
	border-radius: 50%;
	border: 3rpx solid rgba(59,130,246,0.7);
	background: radial-gradient(circle, rgba(219,234,254,0.9) 0%, rgba(191,219,254,0.3) 70%, transparent 100%);
}

.clinic-card-icon.daily::after {
	width: 22rpx;
	height: 22rpx;
	border-radius: 50%;
	box-shadow: 0 0 12rpx rgba(59,130,246,0.7);
	background: radial-gradient(circle, #ffffff 0%, rgba(191,219,254,0.4) 80%);
}

/* 待复核出库单：蓝色出库箱 + 向上箭头 + 小对勾 */
.clinic-card-icon.summary::before {
	/* 箱体 */
	width: 40rpx;
	height: 22rpx;
	border-radius: 8rpx;
	background: rgba(254, 226, 226, 0.96);
	border: 2rpx solid #ef4444;
	bottom: 12rpx;
	top: auto;
}

.clinic-card-icon.summary::after {
	/* 向上箭头 + 对勾的组合：箭头主体 */
	width: 0;
	height: 0;
	border-left: 10rpx solid transparent;
	border-right: 10rpx solid transparent;
	border-bottom: 14rpx solid #ef4444;
	top: 20rpx;
}

/* 出库图标：小箱子 + 向上箭头，不使用加号 */
.clinic-card-icon.outbound::before {
	width: 40rpx;
	height: 22rpx;
	border-radius: 8rpx;
	background: rgba(219, 234, 254, 0.95);
	border: 2rpx solid #0ea5e9;
	bottom: 14rpx;
	top: auto;
}

.clinic-card-icon.outbound::after {
	width: 0;
	height: 0;
	border-left: 10rpx solid transparent;
	border-right: 10rpx solid transparent;
	border-bottom: 16rpx solid #0ea5e9;
	top: 24rpx;
}

.clinic-card-text {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	flex: 1;
}
.clinic-card-title {
	font-size: 32rpx;
	font-weight: 700;
	letter-spacing: 0.6rpx;
	color: #111827;
	text-shadow: 0 1rpx 2rpx rgba(209, 213, 219, 0.8);
}

.clinic-card-desc {
	display: none;
}

.card-tag,
.card-badge {
	position: absolute;
	top: 24rpx;
	right: 26rpx;
	padding: 10rpx 18rpx;
	border-radius: 999rpx;
	font-size: 22rpx;
	font-weight: 700;
	background: rgba(255,255,255,0.22);
	color: #0f172a;
	backdrop-filter: blur(12rpx);
	box-shadow: 0 6rpx 18rpx rgba(15,23,42,0.18);
}

/* 去掉按类型的整卡渐变色，颜色放在图标上 */

.clinic-card-tag {
	position: relative;
	padding: 10rpx 22rpx;
	border-radius: 999rpx;
	background: rgba(255,255,255,0.24);
	font-size: 22rpx;
	font-weight: 700;
	color: #0f172a;
	box-shadow: 0 8rpx 20rpx rgba(15,23,42,0.22);
}

@keyframes quick-pulse {
	0% {
		transform: scale(0.6);
		opacity: 0.8;
	}
	100% {
		transform: scale(1.05);
		opacity: 0;
	}
}

/* 门诊登记长标签 Banner */
.clinic-banner {
	margin: 0 0 20rpx 0;
	padding: 30rpx 35rpx;
	background: linear-gradient(135deg, #34d399 0%, #2ecc71 100%);
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 8rpx 32rpx rgba(52, 211, 153, 0.4);
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
	box-shadow: 0 4rpx 20rpx rgba(52, 211, 153, 0.5);
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
	color: #0f172a;
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

/* 待复核入口样式（与入库单样式类似，但使用绿色主题） */
.review-banner {
	margin: 0 0 20rpx 0;
	padding: 30rpx 35rpx;
	background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	position: relative;
	overflow: hidden;
	box-shadow: 0 8rpx 24rpx rgba(76, 175, 80, 0.3);
	transition: all 0.3s ease;
}

.review-banner::before {
	content: '';
	position: absolute;
	top: -50%;
	right: -20%;
	width: 200rpx;
	height: 200rpx;
	background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
	border-radius: 50%;
	z-index: 0;
}

.review-banner:active {
	transform: scale(0.98);
	box-shadow: 0 4rpx 20rpx rgba(76, 175, 80, 0.5);
}

.review-banner-icon {
	position: relative;
	width: 80rpx;
	height: 80rpx;
	z-index: 1;
}

.review-check {
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

.check-circle {
	position: absolute;
	width: 70rpx;
	height: 70rpx;
	border: 4rpx solid rgba(255, 255, 255, 0.8);
	border-radius: 50%;
	animation: pulse-circle 2s ease-in-out infinite;
}

.check-mark {
	font-size: 48rpx;
	color: #ffffff;
	font-weight: bold;
	z-index: 1;
}

@keyframes pulse-circle {
	0%, 100% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.1);
		opacity: 0.8;
	}
}

.review-banner-content {
	flex: 1;
	margin-left: 25rpx;
	z-index: 1;
}

.review-banner-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #ffffff;
	letter-spacing: 1rpx;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.review-banner-badge {
	min-width: 48rpx;
	height: 48rpx;
	padding: 0 12rpx;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: bold;
	color: #4caf50;
	margin-right: 15rpx;
	z-index: 1;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.review-banner-arrow {
	font-size: 48rpx;
	color: rgba(255, 255, 255, 0.8);
	font-weight: bold;
	z-index: 1;
}

/* 门诊报表双卡 */

.section-header {
	margin-bottom: 25rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
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

/* 移除重复的 unified-grid 和 grid-card 定义，已在上方定义 */

.action-card::before {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	width: 110rpx;
	height: 110rpx;
	border-radius: 50%;
	opacity: 0.12;
	transform: translate(26rpx, -36rpx);
}

.action-card::after {
	content: '';
	position: absolute;
	inset: -20%;
	border-radius: 32rpx;
	background: rgba(102,126,234,0.08);
	opacity: 0;
	transition: opacity 0.18s ease;
}

.action-card:active {
	transform: scale(0.97);
	box-shadow: 0 10rpx 26rpx rgba(31, 41, 55, 0.22);
}

.action-card:active::after {
	opacity: 1;
}

.action-icon-bg {
	width: 74rpx;
	height: 74rpx;
	border-radius: 50%;
	backdrop-filter: blur(14rpx);
	background: rgba(255, 255, 255, 0.18);
	border: 2rpx solid rgba(255, 255, 255, 0.32);
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
	width: 120%;
	height: 120%;
	background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.35) 0%, transparent 70%);
	mix-blend-mode: screen;
}

.action-icon-bg.primary { background: linear-gradient(135deg, rgba(108,123,255,0.85) 0%, rgba(99,102,241,0.95) 100%); }
.action-icon-bg.success { background: linear-gradient(135deg, rgba(45,212,170,0.85) 0%, rgba(16,185,129,0.95) 100%); }
.action-icon-bg.warning { background: linear-gradient(135deg, rgba(255,175,69,0.85) 0%, rgba(249,115,22,0.95) 100%); }
.action-icon-bg.info    { background: linear-gradient(135deg, rgba(96,148,255,0.85) 0%, rgba(37,99,235,0.95) 100%); }
.action-icon-bg.clinic  { background: linear-gradient(135deg, rgba(255,111,177,0.85) 0%, rgba(190,24,93,0.95) 100%); }
.action-icon-bg.purple  { background: linear-gradient(135deg, rgba(162,118,255,0.85) 0%, rgba(124,58,237,0.95) 100%); }
.action-icon-bg.teal    { background: linear-gradient(135deg, rgba(47,213,213,0.85) 0%, rgba(13,148,136,0.95) 100%); }

.action-label {
	display: block;
	font-size: 32rpx;
	font-weight: 700;
	color: #2c3e50;
	margin-bottom: 6rpx;
	letter-spacing: 0.6rpx;
}

.action-desc {
	display: none;
}

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

/* 数据统计区：整体一张象牙白统计卡片，风格与“我的”页信息卡一致 */
.stats-section {
	margin: 0 auto 16rpx;
	padding: 22rpx 24rpx 26rpx;
	max-width: 702rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.stats-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20rpx;
}

.stat-card {
	/* 今日数据卡片：白黄主色 + 红色边缘阴影，带立体感 */
	background: linear-gradient(145deg, #ffffff 0%, #fff9e6 45%, #ffeec2 100%);
	border-radius: 20rpx;
	padding: 26rpx 22rpx;
	position: relative;
	overflow: hidden;
	text-align: center;
	border: 1rpx solid rgba(248, 196, 113, 0.85);
	box-shadow:
		0 1rpx 0 rgba(255,255,255,0.9) inset,
		0 -1rpx 0 rgba(239, 68, 68, 0.35) inset,
		0 14rpx 32rpx rgba(148, 27, 27, 0.18);
}

/* 统计骨架屏 */
.stat-card.skeleton {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 14rpx;
}
.skeleton-icon {
	width: 65rpx;
	height: 65rpx;
	border-radius: 16rpx;
	background: #eef2f7;
}
.skeleton-line {
	width: 60%;
	height: 24rpx;
	border-radius: 12rpx;
	background: #eef2f7;
}
.skeleton-line.short {
	width: 40%;
	height: 20rpx;
}
.shimmer {
	background: linear-gradient(90deg, #eef2f7 25%, #f7f9fb 37%, #eef2f7 63%);
	background-size: 400% 100%;
	animation: shimmerMove 1.2s ease-in-out infinite;
}
@keyframes shimmerMove {
	0% { background-position: 100% 0; }
	100% { background-position: 0 0; }
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
	/* 左侧绿色立体色条：上下顶满卡片 */
	top: 0;
	bottom: 0;
	left: 0;
	width: 12rpx;
	border-radius: 0;
	overflow: visible;
}

.stat-decorative-line.blue,
.stat-decorative-line.green,
.stat-decorative-line.orange,
.stat-decorative-line.red {
	/* 竖条主体：由浅绿到深绿的渐变 */
	background: linear-gradient(to bottom, #4ade80 0%, #16a34a 40%, #0f766e 100%);
}

.stat-content {
	/* 统一数字+标签区域高度，略压缩垂直间距 */
	margin-bottom: 12rpx;
}

.stat-value {
	/* 与下方标签字号一致：数字 + 单位一体显示（如 0人次） */
	display: block;
	font-size: 28rpx;
	font-weight: bold;
	color: #2c3e50;
	line-height: 1;
	margin-bottom: 6rpx;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
}

.stat-label {
	display: inline-block;
	/* 略小于快捷卡片标题，避免长标签换行 */
	font-size: 28rpx;
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

/* 系统状态面板：统一白色卡片容器 */
.status-panel {
	margin: 0 auto 22rpx;
	padding: 22rpx 24rpx 26rpx;
	max-width: 702rpx;
	background: #ffffff;
	border-radius: 22rpx;
	box-shadow: 0 18rpx 40rpx rgba(15, 23, 42, 0.14);
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
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	margin-right: 18rpx;
	position: relative;
}

.status-indicator.online {
	background: #22c55e;
	box-shadow:
		0 0 0 2rpx rgba(187, 247, 208, 0.9),
		0 0 10rpx rgba(34, 197, 94, 0.8);
}

.status-indicator.online::after {
	content: '';
	position: absolute;
	width: 16rpx;
	height: 16rpx;
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



