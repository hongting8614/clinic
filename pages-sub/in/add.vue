<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<view class="header-content">
				<text class="header-title">药材入库</text>
				<text class="header-subtitle">入库日期：{{ currentDate }}</text>
			</view>
		</view>
		
		<!-- 基本信息卡片 -->
		<view class="info-card">
			<view class="info-row">
				<view class="info-item">
					<text class="label">单号：</text>
					<text class="value">{{ recordNo }}</text>
				</view>
				<view class="info-item">
					<text class="label">医生：</text>
					<text class="value">{{ operator }}</text>
				</view>
			</view>
			<view class="info-row">
				<view class="info-item full">
					<text class="label">备注</text>
					<input 
						class="input-value" 
						v-model="remark" 
						placeholder="请输入备注信息（选填）"
						placeholder-class="placeholder"
					/>
				</view>
			</view>
		</view>
		
		<!-- 智能输入框 -->
		<view class="search-card">
			<view class="search-wrapper" :class="{ 'focused': searchFocused }">
				<view class="search-icon-wrapper">
					<text class="search-icon">🔍</text>
				</view>
				<input 
					class="search-input"
					v-model="searchKeyword"
					placeholder="扫码/搜索药材名称"
					placeholder-class="placeholder"
					@focus="onSearchFocus"
					@blur="onSearchBlur"
					@input="onSearchInput"
					@confirm="onSearchConfirm"
				/>
				<view v-if="searchKeyword" class="clear-icon" @tap="clearSearch">
					<text>✕</text>
				</view>
				<view class="scan-btn" @tap="scanBarcode">
					<view class="scan-icon-frame"></view>
				</view>
			</view>
			
			<!-- 搜索结果下拉列表（使用transition） -->
			<view 
				class="search-results" 
				:class="{ 'show': showSearchResult && searchResults.length > 0 }"
			>
				<view 
					v-for="(drug, index) in searchResults" 
					:key="index"
					class="result-item"
					@tap="selectDrug(drug)"
				>
					<view class="drug-info">
						<text class="drug-name">{{ drug.name }}</text>
						<text class="drug-spec">{{ drug.spec }}</text>
					</view>
					<text class="select-icon">›</text>
				</view>
			</view>
			
			<!-- API搜索中 -->
			<view v-if="isSearchingAPI" class="api-searching">
				<view class="loading-wrapper">
					<text class="loading-icon">⏳</text>
					<text class="loading-text">正在查询药监局数据库...</text>
				</view>
			</view>
			
			<!-- 创建药材表单（内联） -->
			<view v-if="showCreateForm" class="create-form-inline">
				<!-- 提示信息 -->
				<view class="create-tip" :class="createFormSource === 'api' ? 'tip-success' : 'tip-warning'">
					<text class="tip-icon">{{ createFormSource === 'api' ? '✅' : '💡' }}</text>
					<view class="tip-content">
						<text class="tip-title">
							{{ createFormSource === 'api' ? '已从药监局获取数据' : '未找到相关药材' }}
						</text>
						<text class="tip-subtitle">
							{{ createFormSource === 'api' ? '确认信息后即可创建' : '请完善以下信息' }}
						</text>
					</view>
				</view>
				
				<!-- 创建表单 -->
				<view class="inline-form">
					<view class="inline-form-title">📝 新建药材档案</view>
					
				<!-- 药材名称 -->
				<view class="inline-form-item">
					<text class="inline-label">药材名称 <text class="required">*</text></text>
					<view class="input-with-voice">
						<input 
							class="inline-input voice-input" 
							v-model="newDrug.name" 
							placeholder="请输入药材名称"
							placeholder-class="placeholder"
						/>
						<view class="voice-btn" @tap="startVoiceInput('name')">
							<text class="voice-icon">🎤</text>
						</view>
					</view>
				</view>
					
					<!-- 规格 -->
					<view class="inline-form-item">
						<text class="inline-label">规格 <text class="required">*</text></text>
						<view class="input-with-voice">
							<input 
								class="inline-input voice-input" 
								v-model="newDrug.spec" 
								placeholder="如：0.25g×24粒/盒"
								placeholder-class="placeholder"
							/>
							<view class="voice-btn" @tap="startVoiceInput('spec')">
								<text class="voice-icon">🎤</text>
							</view>
						</view>
					</view>
					
					<!-- 单位 -->
					<view class="inline-form-item">
						<text class="inline-label">单位 <text class="required">*</text></text>
						<picker 
							mode="selector"
							:range="unitOptions"
							:value="unitIndex"
							@change="onUnitChange"
						>
							<view class="inline-picker">
								<text :class="['picker-text', !newDrug.unit && 'picker-placeholder']">
									{{ newDrug.unit || '请选择单位' }}
								</text>
								<text class="picker-arrow">▼</text>
							</view>
						</picker>
					</view>
					
					<!-- 操作按钮 -->
					<view class="inline-form-actions">
						<view class="inline-btn btn-cancel" @tap="cancelCreate">
							<text>取消</text>
						</view>
						<view class="inline-btn btn-confirm" @tap="confirmCreate">
							<text>确认创建并添加</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 药材列表 -->
		<view class="drug-list-section">
			<view class="section-header">
				<text class="section-title">入库明细</text>
				<text class="section-count">{{ drugList.length }} 种</text>
			</view>
			
			<!-- 药材卡片列表 -->
			<view v-if="drugList.length > 0" class="drug-cards">
				<view 
					v-for="(item, index) in drugList" 
					:key="index"
					class="drug-card"
					:class="{ 'has-error': item.hasError }"
				>
					<!-- 药材头部 -->
					<view class="card-header">
						<view class="drug-name-wrapper">
							<text class="drug-name">{{ item.drugName }}</text>
							<text class="drug-spec">{{ item.specification }}</text>
						</view>
						<view class="delete-btn" @tap="deleteDrug(index)">
							<text class="delete-icon">✕</text>
						</view>
					</view>
					
					<!-- 药材信息表单 -->
					<view class="card-form">
						<!-- 第一行：批号、生产日期、有效期 -->
						<view class="form-row">
							<view class="form-item third">
							<text class="form-label">批号 <text class="required">*</text></text>
							<input
								class="form-input"
								v-model="item.batch"
								placeholder="请输入批号"
								placeholder-class="placeholder"
								@blur="validateRow(index)"
							/>
						</view>
						
							<view class="form-item third">
							<text class="form-label">生产日期 <text class="required">*</text></text>
							<picker 
								mode="date"
								:value="item.productionDate"
								:start="minDate"
								:end="maxDate"
								@change="e => onDateChange(index, 'productionDate', e.detail.value)"
							>
								<view class="picker-input" :class="{ 'has-value': item.productionDate }">
									{{ item.productionDate || '请选择' }}
								</view>
							</picker>
						</view>
						
							<view class="form-item third">
							<text class="form-label">有效期 <text class="required">*</text></text>
							<picker 
								mode="date"
								:value="item.expireDate"
								:start="minDate"
								:end="maxExpDate"
								@change="e => onDateChange(index, 'expireDate', e.detail.value)"
							>
								<view class="picker-input" :class="{ 'has-value': item.expireDate }">
									{{ item.expireDate || '请选择' }}
								</view>
							</picker>
						</view>
						
					<!-- 距有效期 -->
							<view v-if="item.daysToExpiry !== null" class="expiry-badge-inline" :class="[
						item.daysToExpiry < 0 ? 'expired' : '',
						item.daysToExpiry >= 0 && item.daysToExpiry < 30 ? 'danger' : '',
						item.daysToExpiry >= 30 && item.daysToExpiry < 90 ? 'warning' : '',
						item.daysToExpiry >= 90 ? 'safe' : ''
					]">
						<text>{{ item.daysToExpiry }}天</text>
							</view>
					</view>
						
						<!-- 第二行：数量和单价 -->
						<view class="form-row">
							<view class="form-item half">
								<text class="form-label">数量 <text class="required">*</text></text>
								<view class="input-with-unit">
									<input
										class="form-input"
										type="number"
										v-model="item.quantity"
										placeholder="数量"
										placeholder-class="placeholder"
										@blur="validateRow(index)"
										@input="calculateAmount(index)"
									/>
									<text class="unit-text">{{ item.unit }}</text>
								</view>
							</view>
							
							<view class="form-item half">
								<text class="form-label">单价</text>
								<view class="input-with-unit">
									<input
										class="form-input"
										type="digit"
										v-model="item.price"
										placeholder="选填"
										placeholder-class="placeholder"
										@input="calculateAmount(index)"
									/>
									<text class="unit-text">元</text>
								</view>
							</view>
						</view>
						
						<!-- 金额 -->
						<view v-if="item.amount > 0" class="amount-display">
							<text class="amount-label">金额：</text>
							<text class="amount-value">¥{{ formatAmount(item.amount) }}</text>
						</view>
					</view>
				</view>
			</view>
			
		<!-- 空状态（仅在没有搜索时显示） -->
		<view v-if="drugList.length === 0 && !searchKeyword && !showSearchResult" class="empty-state">
			<text class="empty-icon">📦</text>
			<text class="empty-text">暂无药材</text>
			<text class="empty-hint">请在上方搜索框扫码或搜索添加药材</text>
		</view>
		</view>
		
	<!-- 签名区域（仅在有药材时显示） -->
	<view v-if="drugList.length > 0" class="signature-section">
		<!-- 合计信息 -->
		<view class="summary-card">
			<view class="summary-item">
				<text class="summary-label">品种</text>
				<text class="summary-value">{{ drugList.length }} 种</text>
			</view>
			<view class="summary-item">
				<text class="summary-label">总数量</text>
				<text class="summary-value">{{ totalQuantity }}</text>
			</view>
			<view v-if="totalAmount > 0" class="summary-item highlight">
				<text class="summary-label">总金额</text>
				<text class="summary-value">¥{{ formatAmount(totalAmount) }}</text>
			</view>
		</view>
		
	<!-- 操作员签名 -->
		<view class="signature-card">
			<view class="signature-header">
			<text class="signature-title">操作员签名</text>
				<text class="required">*</text>
			</view>
		<signature 
			v-model="operatorSign"
			title="操作员签名"
		></signature>
	</view>
		
	<!-- 提交按钮 -->
	<view class="submit-btn-container">
		<view class="submit-btn" @tap="submit">
			<view class="submit-icon">✓</view>
			<text class="submit-text">提交入库</text>
			</view>
			</view>
		</view>
		
	</view>
</template>

<script>
import Signature from '@/components/signature/index.vue'
import Common from '@/utils/common.js'

export default {
	components: {
		signature: Signature
	},
	
	data() {
		return {
		// 基本信息
		recordNo: '',
		currentDate: '',
		operator: '',
		remark: '',
		drugList: [],
		operatorSign: '',
		
		// 药材搜索相关
		searchKeyword: '',
		searchFocused: false,
		showSearchResult: false,
		searchResults: [],
		searchTimer: null,
		isSearchingAPI: false,
			
			// 新建药材（内联表单）
			showCreateForm: false,
			createFormSource: '',
			newDrug: {
				name: '',
				spec: '',
				unit: '',
				barcode: '',
				manufacturer: '',
				approvalNumber: ''
			},
			unitOptions: ['盒', '瓶', '袋', '支', '板', '片', '粒', '丸'],
			unitIndex: 0,
			
			// 日期范围
			minDate: '2020-01-01',
			maxDate: '',
			maxExpDate: '2035-12-31'
		}
	},
	
	computed: {
		totalQuantity() {
			return this.drugList.reduce((sum, item) => {
				return sum + (Number(item.quantity) || 0)
			}, 0)
		},
		
		totalAmount() {
			return this.drugList.reduce((sum, item) => {
				return sum + (Number(item.amount) || 0)
			}, 0)
		}
	},
	
	onLoad() {
		this.initPage()
	},
	
	methods: {
		initPage() {
			// 生成入库单号
			this.recordNo = Common.generateRecordNo('RK')
			
			// 获取当前时间
			const now = new Date()
			this.currentDate = Common.formatDate(now)
			this.maxDate = Common.formatDate(now)
			
			// 获取当前用户
			const userInfo = uni.getStorageSync('userInfo')
			this.operator = userInfo?.name || '未登录'
		},
		
		
		// ========== 药材搜索相关 ==========
		onSearchFocus() {
			this.searchFocused = true
			// 聚焦搜索框时，隐藏创建表单
			this.showCreateForm = false
			if (this.searchKeyword) {
				this.showSearchResult = true
			}
		},
		
		onSearchBlur() {
			this.searchFocused = false
			// 延迟隐藏，以便点击搜索结果
			setTimeout(() => {
				this.showSearchResult = false
			}, 200)
		},
		
		onSearchInput(e) {
			const keyword = e.detail.value.trim()
			
			if (!keyword) {
				this.searchResults = []
				this.showSearchResult = false
				return
			}
			
			// 防抖搜索
			if (this.searchTimer) {
				clearTimeout(this.searchTimer)
			}
			
			this.searchTimer = setTimeout(() => {
				this.searchDrugs(keyword)
			}, 300)
		},
		
		onSearchConfirm() {
			if (this.searchKeyword.trim()) {
				this.searchDrugs()
			}
		},
		
		// ⭐ 智能搜索：本地 → NMPA → 手动创建
	async searchDrugs(inputKeyword) {
		const keyword = (inputKeyword || this.searchKeyword).trim()
		if (!keyword) return
		
		try {
			// 显示搜索中状态
			this.isSearchingAPI = true
			this.showSearchResult = false
			
			// 调用云函数（内部会先查本地，本地无则查NMPA并保存）
			const result = await wx.cloud.callFunction({
				name: 'drugSearch',
				data: { drugName: keyword }
			})
			
			this.isSearchingAPI = false
			
			if (result.result && result.result.success) {
				// 找到结果（可能是本地或NMPA）
				const drugs = result.result.data
				
				// 格式化为统一结构
				this.searchResults = drugs.map(drug => ({
					_id: drug._id || 'temp_' + Date.now(),
					name: drug.name,
					spec: drug.specification || '',
					specification: drug.specification || '',
					unit: drug.unit || '盒',
					packUnit: drug.unit || '盒',
					manufacturer: drug.manufacturer || '',
					barcode: drug.barcode || '',
					approvalNumber: drug.approvalNumber || '',
					source: drug.source || result.result.source
				}))
				
				// 显示搜索结果，隐藏创建表单
				this.showSearchResult = true
				this.showCreateForm = false
				
				// 显示数据来源提示
				const sourceText = {
					'local': '本地档案',
					'nmpa': '国家药监局'
				}[result.result.source] || '数据库'
				
				uni.showToast({
					title: `找到 ${drugs.length} 条 (${sourceText})`,
					icon: 'none',
					duration: 1500
				})
				
			} else {
				// 未找到，提示手动创建
				this.showSearchResult = false
				this.activateCreateFormManual(keyword)
			}
			
		} catch (err) {
			console.error('搜索失败:', err)
			this.isSearchingAPI = false
			// 出错也激活手动创建
			this.activateCreateFormManual(keyword)
		}
	},
		
		// 激活创建表单（API数据）⭐
		activateCreateFormWithAPI(apiData) {
			this.showCreateForm = true
			this.createFormSource = 'api'
			this.showSearchResult = false
			
			// 自动填充API返回的数据
			this.newDrug = {
				name: apiData.name || '',
				spec: apiData.specification || apiData.spec || '',
				unit: apiData.unit || '',
				barcode: apiData.barcode || '',
				manufacturer: apiData.manufacturer || '',
				approvalNumber: apiData.approvalNumber || ''
			}
			
			// 设置单位选择器索引
			const unitIdx = this.unitOptions.indexOf(this.newDrug.unit)
			this.unitIndex = unitIdx >= 0 ? unitIdx : 0
			
			uni.showToast({
				title: '✅ 已从药监局获取数据',
				icon: 'none',
				duration: 2000
			})
		},
		
		// 激活创建表单（手动）⭐
		activateCreateFormManual(keyword) {
			this.showCreateForm = true
			this.createFormSource = 'manual'
			this.showSearchResult = false
			
			// 仅填充搜索词
			this.newDrug = {
				name: keyword,
				spec: '',
				unit: '',
				barcode: '',
				manufacturer: '',
				approvalNumber: ''
			}
			this.unitIndex = 0
			
			uni.showToast({
				title: '💡 未找到，请完善信息',
				icon: 'none',
				duration: 2000
			})
		},
		
		clearSearch() {
			this.searchKeyword = ''
			this.searchResults = []
			this.showSearchResult = false
			this.showCreateForm = false
			this.isSearchingAPI = false
		},
		
		// 取消创建
		cancelCreate() {
			this.showCreateForm = false
			this.newDrug = {
				name: '',
				spec: '',
				unit: '',
				barcode: '',
				manufacturer: '',
				approvalNumber: ''
			}
			this.unitIndex = 0
		},
		
		// 确认创建并添加 ⭐⭐⭐
		async confirmCreate() {
			// 验证必填项
			if (!this.newDrug.name || !this.newDrug.spec || !this.newDrug.unit) {
				uni.showToast({
					title: '请填写完整信息',
					icon: 'none'
				})
				return
			}
			
			uni.showLoading({ title: '创建中...', mask: true })
			
			try {
				const db = wx.cloud.database()
				
				// 1. 创建药材档案
				const result = await db.collection('drugs').add({
					data: {
						name: this.newDrug.name,
						spec: this.newDrug.spec,
						specification: this.newDrug.spec,  // 兼容字段
						packUnit: this.newDrug.unit,
						unit: this.newDrug.unit,  // 兼容字段
						barcode: this.newDrug.barcode || '',
						manufacturer: this.newDrug.manufacturer || '',
						approvalNumber: this.newDrug.approvalNumber || '',
						createTime: new Date(),
						createSource: this.createFormSource  // 记录来源：api 或 manual
					}
				})
				
				uni.hideLoading()
				
				if (result._id) {
					uni.showToast({
						title: '✅ 创建成功',
						icon: 'success',
						duration: 1500
					})
					
					// 2. 自动添加到入库列表 ⭐⭐⭐
					const newDrugItem = {
						drugId: result._id,
						drugName: this.newDrug.name,
						specification: this.newDrug.spec,
						unit: this.newDrug.unit,
						manufacturer: this.newDrug.manufacturer || '',
						batch: '',
						productionDate: '',
						expireDate: '',
						daysToExpiry: null,
						quantity: '',
						price: '',
						amount: '',
						hasError: false
					}
					
					// 添加到列表最前面（新的在上）
					this.drugList.unshift(newDrugItem)
					
					// 重置表单
					this.cancelCreate()
					this.searchKeyword = ''
				}
				
			} catch (error) {
				console.error('创建失败:', error)
				uni.hideLoading()
				uni.showToast({
					title: '创建失败: ' + error.message,
					icon: 'none'
				})
			}
		},
		
		selectDrug(drug) {
			// 检查是否已添加
			const exists = this.drugList.some(item => item.drugId === drug._id)
			if (exists) {
				uni.showToast({
					title: '该药材已添加',
					icon: 'none'
				})
				return
			}
			
			// 记录当前滚动位置
			uni.createSelectorQuery().selectViewport().scrollOffset((res) => {
				const currentScrollTop = res.scrollTop || 0
				
				// 立即清空搜索和隐藏结果
				this.searchKeyword = ''
				this.searchResults = []
				this.showSearchResult = false
				this.showCreateForm = false
				this.isSearchingAPI = false
				
				// 使用nextTick确保DOM更新后再添加药材
				this.$nextTick(() => {
					// 添加药材到列表顶部
					this.drugList.unshift({
						drugId: drug._id,
						drugName: drug.name,
						specification: drug.spec || drug.specification,
						unit: drug.packUnit || drug.unit || '盒',
						manufacturer: drug.manufacturer || '',
						batch: '',
						productionDate: '',
						expireDate: '',
						daysToExpiry: null,
						quantity: '',
						price: '',
						amount: 0,
						hasError: false
					})
					
					// 立即补偿滚动位置（新增药材卡片高度约450rpx）
					this.$nextTick(() => {
						uni.pageScrollTo({
							scrollTop: currentScrollTop + uni.upx2px(450),
							duration: 0  // 无动画，瞬间完成
						})
					})
					
					// 用户反馈
					uni.showToast({
						title: '已添加到列表',
						icon: 'success',
						duration: 1500
					})
					
					// 振动反馈
					wx.vibrateShort({ type: 'light' })
				})
			}).exec()
		},
		
		// ========== 扫码相关 ==========
		async scanBarcode() {
			
			try {
				// 检查API剩余次数
				const apiStats = await this.getAPIStats()
				
				if (apiStats.remaining === 0) {
					uni.showModal({
						title: '🚫 API次数已用完',
						content: `今日API调用次数已达上限 (${apiStats.todayUsed}/${apiStats.limit})\n\n建议：\n1. 手动搜索药材档案\n2. 新建药材档案\n3. 等待明天重置`,
						showCancel: false
					})
					return
				}
				
				// 警告提示
				if (apiStats.critical) {
					const res = await uni.showModal({
						title: '⚠️ API次数不足',
						content: `今日API次数仅剩 ${apiStats.remaining} 次\n\n是否继续扫码？`,
						confirmText: '继续',
						cancelText: '取消'
					})
					
					if (!res.confirm) {
						return
					}
				}
				
				// 调用微信官方扫码API
				const scanRes = await uni.scanCode({
					// 支持的码类型
					scanType: [
						'barCode',    // 条形码（一维码）
						'qrCode',     // 二维码
						'datamatrix', // Data Matrix码
						'pdf417'      // PDF417码
					],
					// 是否只能从相机扫码，默认false（可以从相册选择）
					onlyFromCamera: false,
					// 是否自动解码
					autoDecrypt: true
				})
				
				console.log('📷 扫码结果:', scanRes)
				console.log('📷 条形码:', scanRes.result)
				console.log('📷 条形码类型:', scanRes.scanType)
				
				// 检查扫码结果
				if (!scanRes || !scanRes.result) {
					console.error('❌ 扫码结果为空')
					uni.showToast({
						title: '扫码失败，请重试',
						icon: 'none'
					})
					return
				}
				
				// 清洗条形码：去除空格、特殊字符
				const cleanBarcode = scanRes.result.trim().replace(/\s/g, '')
				console.log('📷 清洗后条形码:', cleanBarcode)
				
				// 验证条形码格式
				if (!cleanBarcode || cleanBarcode.length < 8) {
					uni.showToast({
						title: '条形码格式错误',
						icon: 'none'
					})
					return
				}
				
				await this.queryDrugByBarcode(cleanBarcode)
				
			} catch (err) {
				console.error('扫码错误:', err)
				if (err.errMsg && !err.errMsg.includes('cancel')) {
					uni.showToast({
						title: '扫码失败',
						icon: 'none'
					})
				}
			}
		},
		
		async getAPIStats() {
			try {
				const result = await wx.cloud.callFunction({
					name: 'drugBarcodeQuery',
					data: {
						action: 'getUsageStats'
					}
				})
				
				if (result.result && result.result.success) {
					return result.result.data
				}
			} catch (err) {
				console.error('获取API统计失败:', err)
			}
			
			return {
				todayUsed: 0,
				remaining: 99,
				limit: 99,
				warning: false,
				critical: false
			}
		},
		
		async queryDrugByBarcode(barcode) {
			console.log('========================================')
			console.log('🔍 开始查询条形码:', barcode)
			console.log('========================================')
			
			uni.showLoading({ title: '识别中...', mask: true })
			
			try {
				// 调用云函数查询（优先本地档案 → API次数检查 → 第三方API）
				console.log('📡 调用云函数...')
				const res = await wx.cloud.callFunction({
					name: 'drugBarcodeQuery',
					data: {
						action: 'queryByBarcode',
						barcode: barcode
					}
				})
				
				console.log('📡 云函数返回:', res)
				console.log('result.success:', res.result?.success)
				console.log('result.data:', res.result?.data)
				
				uni.hideLoading()
				
				if (res.result && res.result.success) {
					console.log('✅ 找到药材！')
					// 找到药材
					const drugInfo = res.result.data
					
					// 检查是否已添加
					const exists = this.drugList.some(item => 
						item.drugName === drugInfo.name && 
						item.specification === drugInfo.specification
					)
					
					if (exists) {
						uni.showToast({
							title: '该药材已添加',
							icon: 'none'
						})
						return
					}
					
					// 添加到列表最前面(新的在上)
					this.drugList.unshift({
						drugId: drugInfo.drugId || 'temp_' + Date.now(),
						drugName: drugInfo.name,
						specification: drugInfo.specification,
						unit: drugInfo.unit || '盒',
						manufacturer: drugInfo.manufacturer || '',
						batch: '',
						productionDate: '',
						expireDate: '',
						daysToExpiry: null,
						quantity: '',
						price: '',
						amount: 0,
						hasError: false,
						isTemp: !drugInfo.drugId // 标记是否为临时药材
					})
					
					// 显示数据来源
					const sourceText = {
						'local': '本地档案',
						'api': 'API查询'
					}[res.result.source] || '数据库'
					
					uni.showToast({
						title: `✅ 已添加 (${sourceText})`,
						icon: 'success',
						duration: 2000
					})
					
					// 显示API使用情况
					if (res.result.source === 'api' && res.result.apiStats) {
						const stats = res.result.apiStats
						if (stats.warning) {
							setTimeout(() => {
								uni.showToast({
									title: `⚠️ 今日剩余${stats.remaining}次API`,
									icon: 'none',
									duration: 2000
								})
							}, 2000)
						}
					}
					
					// 振动反馈
					wx.vibrateShort({ type: 'light' })
					
				} else if (res.result && res.result.reason === 'api_limit_exceeded') {
					// API次数不足
					uni.showModal({
						title: '🚫 API次数不足',
						content: res.result.message + '\n\n' + res.result.suggestion,
						confirmText: '手动新建',
						cancelText: '取消',
						success: (modalRes) => {
							if (modalRes.confirm) {
								this.newDrug.barcode = barcode
								this.showCreateDrug = true
							}
						}
					})
					
				} else {
				// 未找到药材 - 简化录入
				console.log('❌ 未找到药材，云函数返回:', res.result)
				uni.hideLoading()
				
				// 选择关联方式（只有2种）
				uni.showActionSheet({
					title: '首次识别此条形码',
					itemList: ['从已有药材中选择', '手动新建药材'],
					success: async (actionRes) => {
						if (actionRes.tapIndex === 0) {
							// 从已有药材中选择
							await this.selectExistingDrug(barcode)
						} else if (actionRes.tapIndex === 1) {
							// 手动新建药材
							this.newDrug.barcode = barcode
							this.showCreateDrug = true
						}
					}
				})
				}
				
			} catch (err) {
				uni.hideLoading()
				console.error('查询失败:', err)
				
				uni.showModal({
					title: '查询失败',
					content: '条形码查询失败，是否手动新建药材？',
					confirmText: '新建',
					cancelText: '取消',
					success: (modalRes) => {
						if (modalRes.confirm) {
							this.newDrug.barcode = barcode
							this.showCreateDrug = true
						}
					}
				})
			}
		},
		
		// 创建映射并查询（首次录入）
		async createMappingAndQuery(barcode, drugName) {
			uni.showLoading({ title: '查询中...', mask: true })
			
			try {
				console.log('🆕 创建映射并查询NMPA...')
				console.log('条形码:', barcode)
				console.log('药材名称:', drugName)
				
				const res = await this.$api.callFunction({
					name: 'drugBarcodeQuery',
					data: {
						action: 'createMappingAndQuery',
						barcode: barcode,
						drugName: drugName,
						specification: '', // 可选，用户稍后填写
						unit: '盒'
					}
				})
				
				uni.hideLoading()
				
				console.log('云函数返回:', res.result)
				
				if (res.result.success && res.result.data) {
					const drug = res.result.data
					
					// 添加到入库列表
					this.drugList.push({
						drugId: null,
						barcode: drug.barcode,
						name: drug.name,
						specification: drug.specification || '',
						unit: drug.unit || '盒',
						manufacturer: drug.manufacturer || '',
						批号: '',
						有效期: '',
						数量: 1,
						单价: 0,
						apiSource: drug.apiSource
					})
					
					uni.showToast({
						title: '✅ 录入成功',
						icon: 'success',
						duration: 2000
					})
					
					// 显示提示信息
					setTimeout(() => {
						uni.showToast({
							title: '下次扫码可直接识别',
							icon: 'none',
							duration: 3000
						})
					}, 2100)
					
				} else {
					uni.showModal({
						title: '提示',
						content: res.result.message || '查询失败，请稍后重试',
						showCancel: false
					})
				}
				
			} catch (err) {
				uni.hideLoading()
				console.error('创建映射失败:', err)
				
				uni.showModal({
					title: '录入失败',
					content: '自动录入失败，请手动新建药材档案',
					confirmText: '新建档案',
					cancelText: '取消',
					success: (modalRes) => {
						if (modalRes.confirm) {
							this.newDrug.name = drugName
							this.newDrug.barcode = barcode
							this.showCreateDrug = true
						}
					}
				})
			}
		},
		
		// 从已有药材中选择
		async selectExistingDrug(barcode) {
			uni.showLoading({ title: '加载药材列表...', mask: true })
			
			try {
				// 查询所有药材
				const res = await this.$api.callFunction({
					name: 'drugSearch',
					data: {
						action: 'getAllDrugs'
					}
				})
				
				uni.hideLoading()
				
				if (res.result.success && res.result.data && res.result.data.length > 0) {
					// 显示药材选择器
					const drugNames = res.result.data.map(d => d.name)
					
					uni.showActionSheet({
						itemList: drugNames,
						success: async (pickRes) => {
							const selectedDrug = res.result.data[pickRes.tapIndex]
							console.log('选择的药材:', selectedDrug)
							
							// 关联条形码到选中的药材
							await this.linkBarcodeToDrug(barcode, selectedDrug)
						}
					})
				} else {
					uni.showToast({
						title: '暂无药材档案',
						icon: 'none'
					})
					// 提示手动新建
					setTimeout(() => {
						this.newDrug.barcode = barcode
						this.showCreateDrug = true
					}, 1000)
				}
				
			} catch (err) {
				uni.hideLoading()
				console.error('加载药材失败:', err)
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			}
		},
		
		// 关联条形码到现有药材
		async linkBarcodeToDrug(barcode, drug) {
			uni.showLoading({ title: '关联中...', mask: true })
			
			try {
				// 更新药材档案，添加条形码
				await this.$api.callFunction({
					name: 'drugSearch',
					data: {
						action: 'updateDrugBarcode',
						drugId: drug._id,
						barcode: barcode
					}
				})
				
				// 直接创建条形码映射到数据库（不需要云函数）
				const db = wx.cloud.database()
				await db.collection('barcode_mapping').add({
					data: {
						barcode: barcode,
						drugName: drug.name,
						specification: drug.specification || '',
						unit: drug.unit || '盒',
						manufacturer: drug.manufacturer || '',
						approvalNumber: drug.approvalNumber || '',
						isPrescription: drug.isPrescription || false,
						prescriptionType: drug.prescriptionType || '非处方药',
						source: 'manual',
						createTime: db.serverDate()
					}
				})
				
				uni.hideLoading()
				
				// 添加到入库列表
				this.drugList.push({
					drugId: drug._id,
					barcode: barcode,
					name: drug.name,
					specification: drug.specification || '',
					unit: drug.unit || '盒',
					manufacturer: drug.manufacturer || '',
					批号: '',
					有效期: '',
					数量: 1,
					单价: drug.price || 0
				})
				
				uni.showToast({
					title: '✅ 关联成功',
					icon: 'success'
				})
				
				setTimeout(() => {
					uni.showToast({
						title: '下次扫码可直接识别',
						icon: 'none',
						duration: 2000
					})
				}, 1500)
				
			} catch (err) {
				uni.hideLoading()
				console.error('关联失败:', err)
				uni.showToast({
					title: '关联失败',
					icon: 'none'
				})
			}
		},
		
		// ========== 新建药材 ==========
		onUnitChange(e) {
			this.unitIndex = e.detail.value
			this.newDrug.unit = this.unitOptions[e.detail.value]
		},
		
		// 语音输入提示（使用输入法语音功能）
		startVoiceInput(field) {
			// 根据字段显示不同提示
			const fieldNames = {
				'name': '药材名称',
				'spec': '规格'
			}
			
			uni.showModal({
				title: '💡 语音输入提示',
				content: `请使用输入法的语音功能：\n\n1. 点击${fieldNames[field]}输入框\n2. 点击键盘上的🎤图标\n3. 说出${fieldNames[field]}\n4. 系统自动识别并填入\n\n微信、搜狗等输入法都支持语音输入`,
				showCancel: false,
				confirmText: '知道了'
			})
		},
		
		// ========== 表单操作 ==========
		onDateChange(index, field, value) {
			this.drugList[index][field] = value
			
			// 计算距有效期天数
			if (this.drugList[index].expireDate) {
				const expDate = new Date(this.drugList[index].expireDate)
				const today = new Date()
				const days = Math.floor((expDate - today) / (1000 * 60 * 60 * 24))
				this.drugList[index].daysToExpiry = days
			}
			
			this.validateRow(index)
		},
		
		calculateAmount(index) {
			const item = this.drugList[index]
			const qty = Number(item.quantity) || 0
			const price = Number(item.price) || 0
			item.amount = qty * price
		},
		
		validateRow(index) {
			const item = this.drugList[index]
			let hasError = false
			
			if (!item.batch || !item.productionDate || !item.expireDate || !item.quantity || item.quantity <= 0) {
				hasError = true
			}
			
			item.hasError = hasError
		},
		
		formatAmount(amount) {
			if (!amount) return '0.00'
			return Number(amount).toFixed(2)
		},
		
		deleteDrug(index) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这个药材吗？',
				success: (res) => {
					if (res.confirm) {
						this.drugList.splice(index, 1)
					}
				}
			})
		},
		
		// ========== 提交 ==========
		validateForm() {
			if (this.drugList.length === 0) {
				uni.showToast({ title: '请至少添加一个药材', icon: 'none' })
				return false
			}
			
			for (let i = 0; i < this.drugList.length; i++) {
				const item = this.drugList[i]
				const rowNum = i + 1
				
				if (!item.batch) {
					uni.showToast({ title: `第${rowNum}行：批号不能为空`, icon: 'none' })
					return false
				}
				if (!item.productionDate) {
					uni.showToast({ title: `第${rowNum}行：生产日期不能为空`, icon: 'none' })
					return false
				}
				if (!item.expireDate) {
					uni.showToast({ title: `第${rowNum}行：有效期不能为空`, icon: 'none' })
					return false
				}
				if (item.daysToExpiry !== null && item.daysToExpiry < 0) {
					uni.showToast({ title: `第${rowNum}行：药材已过期，不能入库`, icon: 'none' })
					return false
				}
				if (!item.quantity || item.quantity <= 0) {
					uni.showToast({ title: `第${rowNum}行：数量必须大于0`, icon: 'none' })
					return false
				}
			}
			
			if (!this.operatorSign) {
				uni.showToast({ title: '请先签名', icon: 'none' })
				return false
			}
			
			return true
		},
		
		async submit() {
			if (!this.validateForm()) {
				return
			}
			
			uni.showLoading({ title: '提交中...', mask: true })
			
			try {
				const userInfo = uni.getStorageSync('userInfo')
				
			const result = await wx.cloud.callFunction({
				name: 'inRecords',
				data: {
					action: 'create',
					data: {
						recordNo: this.recordNo,
						remark: this.remark,
						items: this.drugList.map(item => ({
								drugId: item.drugId,
								drugName: item.drugName,
								specification: item.specification,
								spec: item.specification,
								unit: item.unit,
								manufacturer: item.manufacturer,
								batch: item.batch,
								productionDate: item.productionDate,
								expireDate: item.expireDate,
								quantity: Number(item.quantity),
								price: Number(item.price) || 0
							})),
						operator: this.operator,
						operatorId: userInfo?._id || '',
						operatorSign: this.operatorSign,
						operatorSignTime: new Date().toISOString(),
						status: 'pending_review'
						}
					}
				})
				
				uni.hideLoading()
				
				if (result.result && result.result.success) {
					uni.showToast({
						title: '提交成功，等待复核',
						icon: 'success',
						duration: 2000
					})
					
					setTimeout(() => {
						uni.navigateBack()
					}, 2000)
				} else {
					throw new Error(result.result?.message || '提交失败')
				}
				
			} catch (err) {
				uni.hideLoading()
				console.error('提交失败:', err)
				uni.showToast({
					title: err.message || '提交失败',
					icon: 'none'
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	/* 使用与首页/门诊/药材工作台一致的蓝色渐变背景 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding: 24rpx 24rpx 40rpx;
}

// 页面头部
.page-header {
	/* 顶部标题区域：象牙白圆角卡片，宽度与其它工作台 header-card 对齐 */
	max-width: 702rpx;
	margin: 10rpx auto 8rpx;
	padding: 30rpx 26rpx 26rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow:
		0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
		0 -1rpx 0 rgba(15, 23, 42, 0.06) inset,
		0 18rpx 40rpx rgba(15, 23, 42, 0.14);
	
	.header-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 8rpx;
		
		.header-title {
			font-size: 40rpx;
			font-weight: bold;
			color: #111827;
		}
		
		.header-subtitle {
			font-size: 24rpx;
			color: #4b5563;
		}
	}
}

// 信息卡片
.info-card {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 26rpx 26rpx 24rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	
	.info-row {
		display: flex;
		gap: 20rpx;
		margin-bottom: 20rpx;
		
		&:last-child {
			margin-bottom: 0;
		}
		
		.info-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 12rpx;
			
			&.full {
				flex: 1 1 100%;
			}
			
			.label {
				font-size: 24rpx;
				color: #646566;
			}
			
			.value {
				font-size: 28rpx;
				color: #323233;
				font-weight: 500;
			}
			
			.input-value {
				font-size: 28rpx;
				color: #323233;
				border-bottom: 1rpx solid #ebedf0;
				padding: 8rpx 0;
			}
		}
	}
}

// 智能搜索框
.search-card {
	max-width: 702rpx;
	margin: 0 auto 4rpx;
	position: relative;
	padding-bottom: 8rpx;
}

.search-wrapper {
	display: flex;
	align-items: center;
	background: #ffffff;
	border-radius: 50rpx;
	padding: 0 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(15, 23, 42, 0.06);
	transition: all 0.3s;
	
	&.focused {
		box-shadow: 0 4rpx 20rpx rgba(7, 193, 96, 0.15);
		border: 2rpx solid #07C160;
	}
	
	.search-icon-wrapper {
		margin-right: 16rpx;
		
		.search-icon {
			font-size: 32rpx;
		}
	}
	
	.search-input {
		flex: 1;
		height: 88rpx;
		font-size: 28rpx;
		color: #323233;
	}
	
	.clear-icon {
		width: 40rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 16rpx;
		
		text {
			font-size: 28rpx;
			color: #969799;
		}
	}
	
	.scan-btn {
		width: 56rpx;
		height: 56rpx;
		background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
		
		&:active {
			transform: scale(0.95);
			box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.2);
		}
		
		.scan-icon-frame {
			width: 24rpx;
			height: 24rpx;
			position: relative;
			background: 
				linear-gradient(#fff, #fff) 0 0 / 3rpx 10rpx,
				linear-gradient(#fff, #fff) 0 0 / 10rpx 3rpx,
				linear-gradient(#fff, #fff) 100% 0 / 3rpx 10rpx,
				linear-gradient(#fff, #fff) 100% 0 / 10rpx 3rpx,
				linear-gradient(#fff, #fff) 0 100% / 3rpx 10rpx,
				linear-gradient(#fff, #fff) 0 100% / 10rpx 3rpx,
				linear-gradient(#fff, #fff) 100% 100% / 3rpx 10rpx,
				linear-gradient(#fff, #fff) 100% 100% / 10rpx 3rpx;
			background-repeat: no-repeat;
		}
	}
}

// 搜索结果
.search-results {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: white;
	border-radius: 16rpx;
	margin-top: 12rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	max-height: 0;
	overflow: hidden;
	z-index: 100;
	opacity: 0;
	transition: max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
	            opacity 0.2s ease-out,
	            transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	transform: translateY(-10rpx);
	
	&.show {
		max-height: 600rpx;
		opacity: 1;
		overflow-y: auto;
		transform: translateY(0);
	}
	
	.result-item {
		display: flex;
		align-items: center;
		padding: 24rpx 30rpx;
		border-bottom: 1rpx solid #ebedf0;
		
		&:last-child {
			border-bottom: none;
		}
		
		&:active {
			background: #f7f8fa;
		}
		
		.drug-info {
			flex: 1;
			
			.drug-name {
				display: block;
				font-size: 28rpx;
				color: #323233;
				font-weight: 500;
				margin-bottom: 8rpx;
			}
			
			.drug-spec {
				display: block;
				font-size: 24rpx;
				color: #969799;
			}
		}
		
		.select-icon {
			font-size: 40rpx;
			color: #c8c9cc;
		}
	}
}

// API搜索中
.api-searching {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: white;
	border-radius: 16rpx;
	margin-top: 12rpx;
	padding: 40rpx 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	text-align: center;
	z-index: 100;
	
	.loading-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16rpx;
		
		.loading-icon {
			font-size: 48rpx;
			animation: rotate 2s linear infinite;
		}
		
		.loading-text {
			font-size: 26rpx;
			color: #969799;
		}
	}
}

@keyframes rotate {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

// 内联创建表单
.create-form-inline {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: white;
	border-radius: 16rpx;
	margin-top: 12rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	z-index: 100;
	animation: slideDown 0.3s ease;
	
	.create-tip {
		display: flex;
		align-items: flex-start;
		gap: 16rpx;
		padding: 30rpx;
		border-radius: 16rpx 16rpx 0 0;
		
		&.tip-success {
			background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
		}
		
		&.tip-warning {
			background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
		}
		
		.tip-icon {
			font-size: 40rpx;
		}
		
		.tip-content {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 8rpx;
			
			.tip-title {
				font-size: 28rpx;
				font-weight: 500;
				color: #323233;
			}
			
			.tip-subtitle {
				font-size: 24rpx;
				color: #969799;
			}
		}
	}
	
	.inline-form {
		padding: 30rpx;
		
		.inline-form-title {
			font-size: 30rpx;
			font-weight: bold;
			color: #323233;
			margin-bottom: 24rpx;
		}
		
		.inline-form-item {
			margin-bottom: 24rpx;
			
			.inline-label {
				display: block;
				font-size: 26rpx;
				color: #646566;
				margin-bottom: 12rpx;
				
				.required {
					color: #ee0a24;
					margin-left: 4rpx;
				}
			}
			
			.inline-input {
				width: 100%;
				height: 80rpx;
				padding: 0 20rpx;
				background: #f7f8fa;
				border-radius: 12rpx;
				font-size: 28rpx;
				color: #323233;
				border: 2rpx solid transparent;
				transition: all 0.3s;
				
				&:focus {
					background: white;
					border-color: #07C160;
				}
			}
			
			// 语音输入容器
			.input-with-voice {
				display: flex;
				align-items: center;
				gap: 16rpx;
				
				.voice-input {
					flex: 1;
					width: auto;
				}
				
				.voice-btn {
					flex-shrink: 0;
					width: 80rpx;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					border-radius: 12rpx;
					box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
					transition: all 0.3s;
					
					&:active {
						transform: scale(0.95);
						box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.4);
					}
					
					.voice-icon {
						font-size: 36rpx;
						filter: brightness(0) invert(1);
					}
				}
			}
			
			.inline-picker {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 80rpx;
				padding: 0 20rpx;
				background: #f7f8fa;
				border-radius: 12rpx;
				
				.picker-text {
					font-size: 28rpx;
					color: #323233;
					
					&.picker-placeholder {
						color: #c8c9cc;
					}
				}
				
				.picker-arrow {
					font-size: 20rpx;
					color: #969799;
				}
			}
		}
		
		.inline-form-actions {
			display: flex;
			gap: 20rpx;
			margin-top: 32rpx;
			
			.inline-btn {
				flex: 1;
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 44rpx;
				font-size: 28rpx;
				font-weight: 500;
				
				&.btn-cancel {
					background: #f7f8fa;
					color: #646566;
				}
				
				&.btn-confirm {
					background: linear-gradient(135deg, #07C160 0%, #05a550 100%);
					color: white;
					box-shadow: 0 4rpx 12rpx rgba(7, 193, 96, 0.3);
				}
			}
		}
	}
}

@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

// 药材列表
.drug-list-section {
	max-width: 702rpx;
	margin: 0 auto;
	transition: all 0.3s ease;
}

.section-header {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 18rpx 22rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	display: flex;
	justify-content: space-between;
	align-items: center;
	
	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #111827;
	}
	
	.section-count {
		font-size: 24rpx;
		color: #4b5563;
		padding: 6rpx 16rpx;
		background: #ffffff;
		border-radius: 999rpx;
	}
}

.drug-cards {
	display: flex;
	flex-direction: column;
	gap: 0;
}

.drug-card {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 24rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	
	// 添加平滑的入场动画
	animation: slideInFromTop 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	
	&.has-error {
		border-left: 4rpx solid #ee0a24;
	}
}

// 从顶部滑入的动画
@keyframes slideInFromTop {
	0% {
		opacity: 0;
		transform: translateY(-20rpx);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #ebedf0;
	
	.drug-name-wrapper {
		flex: 1;
		
		.drug-name {
			display: block;
			font-size: 30rpx;
			font-weight: bold;
			color: #323233;
			margin-bottom: 8rpx;
		}
		
		.drug-spec {
			display: block;
			font-size: 24rpx;
			color: #646566;
		}
	}
	
	.delete-btn {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f7f8fa;
		border-radius: 50%;
		
		.delete-icon {
			font-size: 32rpx;
			color: #ee0a24;
		}
	}
}

.card-form {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.form-item {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	
	&.half {
		flex: 1;
	}
	
	&.third {
		flex: 1;
		min-width: 0; // 防止内容溢出
	}
	
	.form-label {
		font-size: 24rpx;
		color: #646566;
		
		.required {
			color: #ee0a24;
		}
	}
	
	.form-input {
		height: 72rpx;
		padding: 0 24rpx;
		background: #f7f8fa;
		border-radius: 12rpx;
		font-size: 28rpx;
		color: #323233;
		border: 2rpx solid transparent;
		
		&:focus {
			background: white;
			border-color: #07C160;
		}
	}
	
	.picker-input {
		height: 72rpx;
		padding: 0 24rpx;
		background: #f7f8fa;
		border-radius: 12rpx;
		font-size: 28rpx;
		color: #c8c9cc;
		display: flex;
		align-items: center;
		
		&.has-value {
			color: #323233;
		}
	}
	
	.input-with-unit {
		position: relative;
		
		.form-input {
			padding-right: 80rpx;
		}
		
		.unit-text {
			position: absolute;
			right: 24rpx;
			top: 50%;
			transform: translateY(-50%);
			font-size: 24rpx;
			color: #969799;
		}
	}
}

.form-row {
	display: flex;
	gap: 20rpx;
	align-items: flex-end; // 让距有效期标签底部对齐
	flex-wrap: wrap; // 小屏幕时允许换行
}

.expiry-badge {
	display: inline-flex;
	align-items: center;
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
	font-size: 22rpx;
	font-weight: 500;
	
	&.safe {
		background: #d1fae5;
		color: #065f46;
	}
	
	&.warning {
		background: #fef3c7;
		color: #92400e;
	}
	
	&.danger {
		background: #fee2e2;
		color: #991b1b;
	}
	
	&.expired {
		background: #fee2e2;
		color: #991b1b;
	}
}

// 行内显示的距有效期标签
.expiry-badge-inline {
	display: inline-flex;
	align-items: center;
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
	font-size: 22rpx;
	font-weight: 500;
	margin-bottom: 12rpx; // 与输入框底部对齐
	white-space: nowrap; // 不换行
	
	&.safe {
		background: #d1fae5;
		color: #065f46;
	}
	
	&.warning {
		background: #fef3c7;
		color: #92400e;
	}
	
	&.danger {
		background: #fee2e2;
		color: #991b1b;
	}
	
	&.expired {
		background: #fee2e2;
		color: #991b1b;
	}
}

.amount-display {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 16rpx 24rpx;
	background: #f7f8fa;
	border-radius: 12rpx;
	
	.amount-label {
		font-size: 24rpx;
		color: #646566;
	}
	
	.amount-value {
		font-size: 28rpx;
		color: #ee0a24;
		font-weight: bold;
	}
}

// 空状态
.empty-state {
	text-align: center;
	padding: 100rpx 0;
	
	.empty-icon {
		font-size: 100rpx;
		display: block;
		margin-bottom: 20rpx;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #969799;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.empty-hint {
		font-size: 24rpx;
		color: #c8c9cc;
		display: block;
	}
}

// 签名区域（包含合计和签名）
.signature-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding-bottom: 0;
}

// 合计卡片
.summary-card {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 24rpx 26rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	display: flex;
	justify-content: space-around;
	
	.summary-item {
		text-align: center;
		
		.summary-label {
			display: block;
			font-size: 24rpx;
			color: #6b7280;
			margin-bottom: 12rpx;
		}
		
		.summary-value {
			display: block;
			font-size: 32rpx;
			font-weight: bold;
			color: #111827;
		}
		
		&.highlight .summary-value {
			font-size: 36rpx;
		}
	}
}

// 签名卡片
.signature-card {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 30rpx;
	background: white;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	border: 2rpx solid #ebedf0;
	
	.signature-header {
		display: flex;
		align-items: center;
		gap: 8rpx;
		margin-bottom: 20rpx;
		
		.signature-title {
			font-size: 28rpx;
			font-weight: bold;
			color: #323233;
		}
		
		.required {
			color: #ee0a24;
		}
		}
	}
	
// 提交按钮容器
.submit-btn-container {
		display: flex;
		justify-content: center;
	padding: 0 30rpx 20rpx;
		
	.submit-btn {
			width: 100%;
		height: 88rpx;
		background: linear-gradient(135deg, #07C160 0%, #05a550 100%);
		border-radius: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		gap: 12rpx;
		box-shadow: 0 4rpx 16rpx rgba(7, 193, 96, 0.25);
		position: relative;
		overflow: hidden;
		
		// 微信风格的光泽效果
		&::before {
			content: '';
			position: absolute;
			top: 0;
	left: 0;
	right: 0;
			height: 50%;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
			border-radius: 50rpx 50rpx 0 0;
}

		.submit-icon {
			width: 48rpx;
			height: 48rpx;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
			font-size: 32rpx;
			color: white;
			font-weight: bold;
			z-index: 1;
		}
		
		.submit-text {
			color: white;
			font-size: 32rpx;
			font-weight: 500;
			z-index: 1;
	}
	
	&:active {
		transform: scale(0.98);
			box-shadow: 0 2rpx 8rpx rgba(7, 193, 96, 0.3);
		}
	}
}

// 占位符样式
.placeholder {
	color: #c8c9cc;
}
</style>
