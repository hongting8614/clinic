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
						<view class="drug-name-row">
							<text class="drug-name">{{ drug.name }}</text>
							<!-- 完整度标签 -->
							<view 
								v-if="drug.completeness" 
								class="completeness-badge"
								:class="{
									'complete': drug.completeness.percentage === 100,
									'good': drug.completeness.percentage >= 75 && drug.completeness.percentage < 100,
									'medium': drug.completeness.percentage >= 50 && drug.completeness.percentage < 75,
									'low': drug.completeness.percentage < 50
								}"
							>
								<text class="badge-text">{{ drug.completeness.percentage }}%</text>
							</view>
						</view>
						<text class="drug-spec">{{ drug.spec }}</text>
						<!-- 缺失字段提示 -->
						<text 
							v-if="drug.completeness && drug.completeness.missingFields.length > 0" 
							class="missing-fields"
						>
							缺少：{{ drug.completeness.missingFields.join('、') }}
						</text>
					</view>
					
					<!-- 选择图标 -->
					<text class="select-icon">›</text>
				</view>
			</view>
			
			<!-- 搜索中 -->
			<view v-if="isSearchingAPI" class="api-searching">
				<view class="loading-wrapper">
					<text class="loading-icon">⏳</text>
					<text class="loading-text">正在查询药材档案...</text>
				</view>
			</view>
			
			<!-- 创建药材表单（内联） -->
			<view v-if="showCreateForm" class="create-form-inline">
				<!-- 提示信息 -->
				<view class="create-tip tip-warning">
					<text class="tip-icon">💡</text>
					<view class="tip-content">
						<text class="tip-title">未找到相关药材</text>
						<text class="tip-subtitle">请完善以下信息</text>
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
						
						<!-- 快速选择常用单位 -->
						<view class="quick-units">
							<view 
								v-for="(unit, idx) in ['盒', '瓶', '袋', '支', '板']" 
								:key="idx"
								class="quick-unit-btn"
								:class="{ 'active': newDrug.unit === unit }"
								@tap="selectQuickUnit(unit)"
							>
								<text>{{ unit }}</text>
							</view>
							<picker 
								mode="selector"
								:range="unitOptions"
								:value="unitIndex"
								@change="onUnitChange"
							>
								<view class="quick-unit-btn more-btn">
									<text>更多 ▼</text>
								</view>
							</picker>
						</view>
					</view>
					
					<!-- 生产厂家（可选，带智能提示） -->
					<view class="inline-form-item">
						<text class="inline-label">生产厂家</text>
						<view class="input-with-suggestions">
							<input 
								class="inline-input" 
								v-model="newDrug.manufacturer" 
								placeholder="选填，输入2个字可智能提示"
								placeholder-class="placeholder"
								@input="onManufacturerInput"
								@focus="onManufacturerFocus"
								@blur="onManufacturerBlur"
							/>
							<!-- 厂家建议列表 -->
							<view 
								v-if="showManufacturerSuggestions && manufacturerSuggestions.length > 0"
								class="suggestions-list"
							>
								<view 
									v-for="(mfr, idx) in manufacturerSuggestions"
									:key="idx"
									class="suggestion-item"
									@tap="selectManufacturer(mfr)"
								>
									<text>{{ mfr }}</text>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 批准文号（可选） -->
					<view class="inline-form-item">
						<text class="inline-label">批准文号</text>
						<input 
							class="inline-input" 
							v-model="newDrug.approvalNumber" 
							placeholder="选填"
							placeholder-class="placeholder"
						/>
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
			unitOptions: ['盒', '瓶', '袋', '支', '板', '片', '粒', '丸', 'g', 'kg', 'ml', 'L'],
			unitIndex: 0,
			
			// 厂家智能提示
			manufacturerSuggestions: [],
			showManufacturerSuggestions: false,
			
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
			
			// 延迟滚动，等待键盘弹出
			setTimeout(() => {
				// 滚动到搜索框位置，确保搜索结果可见
				uni.createSelectorQuery().select('.search-card').boundingClientRect((rect) => {
					if (rect) {
						uni.pageScrollTo({
							scrollTop: rect.top - 100,
							duration: 300
						})
					}
				}).exec()
			}, 300)
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
				// 收起键盘
				uni.hideKeyboard()
				this.searchDrugs()
			}
		},
		
		// ⭐ 计算档案完整度
		calculateCompleteness(drug) {
			const fields = [
				drug.name,           // 名称
				drug.specification,  // 规格
				drug.unit,          // 单位
				drug.manufacturer,  // 生产厂家
				drug.barcode,       // 条形码
				drug.approvalNumber,// 批准文号
				drug.category,      // 分类
				drug.image          // 图片
			]
			
			const filledCount = fields.filter(field => field && field.trim()).length
			const percentage = Math.round((filledCount / fields.length) * 100)
			
			return {
				percentage,
				filledCount,
				totalCount: fields.length,
				isComplete: percentage === 100,
				missingFields: this.getMissingFields(drug)
			}
		},
		
		// 获取缺失字段
		getMissingFields(drug) {
			const fieldMap = {
				name: '名称',
				specification: '规格',
				unit: '单位',
				manufacturer: '生产厂家',
				barcode: '条形码',
				approvalNumber: '批准文号',
				category: '分类',
				image: '图片'
			}
			
			const missing = []
			for (const [key, label] of Object.entries(fieldMap)) {
				if (!drug[key] || !drug[key].trim()) {
					missing.push(label)
				}
			}
			
			return missing
		},
		
		// ⭐ 智能搜索：仅查询本地药材档案
	async searchDrugs(inputKeyword) {
		const keyword = (inputKeyword || this.searchKeyword).trim()
		if (!keyword) return
		
		try {
			// 显示搜索中状态
			this.isSearchingAPI = true
			this.showSearchResult = false
			
			// 收起键盘
			uni.hideKeyboard()
			
			// 调用云函数查询本地药材档案
			const result = await wx.cloud.callFunction({
				name: 'drugSearch',
				data: { drugName: keyword }
			})
			
			this.isSearchingAPI = false
			
			if (result.result && result.result.success) {
				// 找到本地药材档案
				const drugs = result.result.data
				
				// 格式化为统一结构，并计算完整度
				this.searchResults = drugs.map(drug => {
					const drugData = {
						_id: drug._id || 'temp_' + Date.now(),
						name: drug.name,
						spec: drug.specification || '',
						specification: drug.specification || '',
						unit: drug.unit || '盒',
						packUnit: drug.unit || '盒',
						manufacturer: drug.manufacturer || '',
						barcode: drug.barcode || '',
						approvalNumber: drug.approvalNumber || '',
						category: drug.category || '',
						image: drug.image || ''
					}
					
					// 计算完整度
					const completeness = this.calculateCompleteness(drugData)
					drugData.completeness = completeness
					
					return drugData
				})
				
				// 显示搜索结果，隐藏创建表单
					this.showSearchResult = true
					this.showCreateForm = false
				
				uni.showToast({
					title: `找到 ${drugs.length} 条药材`,
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
					title: '请填写：名称、规格、单位',
					icon: 'none',
					duration: 2000
				})
				return
			}
			
			uni.showLoading({ title: '检查中...', mask: true })
			
			try {
				const db = wx.cloud.database()
				
				// ⭐ 1. 检查是否已存在相同药品（名称+规格）
				const existCheck = await db.collection('drugs')
					.where({
						name: this.newDrug.name,
						spec: this.newDrug.spec
					})
					.get()
				
				if (existCheck.data.length > 0) {
					uni.hideLoading()
					uni.showModal({
						title: '药品已存在',
						content: `系统中已存在"${this.newDrug.name}"（${this.newDrug.spec}）\n\n是否直接使用现有档案？`,
						confirmText: '使用现有',
						cancelText: '重新填写',
						success: (res) => {
							if (res.confirm) {
								// 使用现有药品
								const existingDrug = existCheck.data[0]
								this.addDrugToList(existingDrug)
								this.cancelCreate()
								this.searchKeyword = ''
								
								uni.showToast({
									title: '已使用现有档案',
									icon: 'success',
									duration: 1500
								})
							}
						}
					})
					return
				}
				
				// ⭐ 2. 检查条形码是否重复
				if (this.newDrug.barcode) {
					const barcodeCheck = await db.collection('drugs')
						.where({ barcode: this.newDrug.barcode })
						.get()
					
					if (barcodeCheck.data.length > 0) {
						uni.hideLoading()
						uni.showModal({
							title: '条形码已存在',
							content: `该条形码已被"${barcodeCheck.data[0].name}"使用\n\n请检查条形码是否正确`,
							showCancel: false,
							confirmText: '重新填写'
						})
						return
					}
				}
				
				// 3. 创建药材档案
				uni.showLoading({ title: '创建中...', mask: true })
				
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
						category: '',  // 分类可后续完善
						image: '',  // 图片可后续上传
						isHighValue: false,  // 默认非高值
						isEmergency: false,  // 默认非急救
						safeStock: 50,  // 默认安全库存
						minStock: 20,  // 默认最低库存
						createTime: new Date(),
						createSource: this.createFormSource  // 记录来源：api 或 manual
					}
				})
				
				// 2. 如果有条形码，创建条形码映射
				if (this.newDrug.barcode) {
					try {
						await db.collection('barcode_mapping').add({
							data: {
								barcode: this.newDrug.barcode,
								drugName: this.newDrug.name,
								specification: this.newDrug.spec,
								unit: this.newDrug.unit,
								manufacturer: this.newDrug.manufacturer || '',
								approvalNumber: this.newDrug.approvalNumber || '',
								source: 'manual',
								createTime: db.serverDate()
							}
						})
						console.log('✅ 条形码映射创建成功')
					} catch (err) {
						console.error('创建条形码映射失败:', err)
						// 不影响主流程，继续执行
					}
				}
				
				uni.hideLoading()
				
				if (result._id) {
					uni.showToast({
						title: '✅ 创建成功',
						icon: 'success',
						duration: 1500
					})
					
					// 3. 自动添加到入库列表 ⭐⭐⭐
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
					
					// 如果是扫码创建的，提示下次可直接识别
					if (this.newDrug.barcode) {
						setTimeout(() => {
							uni.showToast({
								title: '下次扫码可直接识别',
								icon: 'none',
								duration: 2000
							})
						}, 1500)
					}
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
		
		// ⭐ 添加药品到列表（统一方法）
		addDrugToList(drug) {
			// 检查是否已添加
			const exists = this.drugList.some(item => item.drugId === drug._id)
			if (exists) {
				uni.showToast({
					title: '该药材已添加',
					icon: 'none'
				})
				return
			}
			
			// 添加到列表最前面
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
			
			// 用户反馈
			uni.showToast({
				title: '已添加到列表',
				icon: 'success',
				duration: 1500
			})
			
			// 振动反馈
			wx.vibrateShort({ type: 'light' })
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
				
				// 清洗条形码：去除空格、特殊字符、换行符
				let cleanBarcode = scanRes.result
					.trim()                    // 去除首尾空格
					.replace(/\s/g, '')        // 去除所有空格
					.replace(/[\r\n]/g, '')    // 去除换行符
				
				console.log('📷 原始条形码:', scanRes.result)
				console.log('📷 清洗后条形码:', cleanBarcode)
				console.log('📷 条形码长度:', cleanBarcode.length)
				
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
						drugId: drugInfo._id || 'temp_' + Date.now(),
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
						hasError: false
					})
					
					// 显示数据来源
					const sourceText = {
						'local': '本地档案',
						'cache': '缓存数据',
						'mapping': '映射表'
					}[res.result.source] || '数据库'
					
					uni.showToast({
						title: `✅ 已添加 (${sourceText})`,
						icon: 'success',
						duration: 2000
					})
					
					// 振动反馈
					wx.vibrateShort({ type: 'light' })
					
				} else {
					// 未找到药材 - 提示用户手动创建
					console.log('❌ 未找到药材，云函数返回:', res.result)
					
					uni.showModal({
						title: '首次识别此条形码',
						content: '系统中暂无此药材信息\n\n请选择操作方式：',
						confirmText: '手动新建',
						cancelText: '取消',
						success: (modalRes) => {
							if (modalRes.confirm) {
								// 激活创建表单
								this.newDrug.barcode = barcode
								this.showCreateForm = true
								this.createFormSource = 'manual'
								this.searchKeyword = ''
							}
						}
					})
				}
				
			} catch (err) {
				uni.hideLoading()
				console.error('❌ 查询失败详情:', err)
				console.error('错误类型:', err.errCode)
				console.error('错误信息:', err.errMsg)
				
				// 详细的错误提示
				let errorTitle = '查询失败'
				let errorContent = '条形码查询失败'
				
				if (err.errMsg) {
					if (err.errMsg.includes('cloud function not found')) {
						errorTitle = '云函数未部署'
						errorContent = '请先部署 drugBarcodeQuery 云函数\n\n操作步骤：\n1. 右键点击云函数文件夹\n2. 选择"上传并部署"\n3. 等待部署完成'
					} else if (err.errMsg.includes('timeout')) {
						errorTitle = '查询超时'
						errorContent = '网络连接超时，请检查网络后重试'
					} else if (err.errMsg.includes('permission')) {
						errorTitle = '权限不足'
						errorContent = '数据库权限不足，请联系管理员'
					} else {
						errorContent = `错误信息：${err.errMsg}\n\n是否手动新建药材？`
					}
				}
				
				uni.showModal({
					title: errorTitle,
					content: errorContent,
					confirmText: '手动新建',
					cancelText: '取消',
					success: (modalRes) => {
						if (modalRes.confirm) {
							this.newDrug.barcode = barcode
							this.showCreateForm = true
							this.createFormSource = 'manual'
							this.searchKeyword = ''
						}
					}
				})
			}
		},
		
		// ========== 新建药材 ==========
		onUnitChange(e) {
			this.unitIndex = e.detail.value
			this.newDrug.unit = this.unitOptions[e.detail.value]
		},
		
		// ⭐ 快速选择常用单位
		selectQuickUnit(unit) {
			this.newDrug.unit = unit
			const index = this.unitOptions.indexOf(unit)
			if (index !== -1) {
				this.unitIndex = index
			}
		},
		
		// ⭐ 厂家输入时智能提示
		async onManufacturerInput(e) {
			const keyword = e.detail.value.trim()
			
			if (!keyword || keyword.length < 2) {
				this.manufacturerSuggestions = []
				this.showManufacturerSuggestions = false
				return
			}
			
			try {
				// 从现有药品中查询厂家
				const db = wx.cloud.database()
				const result = await db.collection('drugs')
					.where({
						manufacturer: db.RegExp({
							regexp: keyword,
							options: 'i'
						})
					})
					.field({ manufacturer: true })
					.limit(20)
					.get()
				
				if (result.data.length > 0) {
					// 去重
					const manufacturers = [...new Set(result.data.map(item => item.manufacturer).filter(m => m))]
					this.manufacturerSuggestions = manufacturers.slice(0, 5)
					this.showManufacturerSuggestions = true
				} else {
					this.manufacturerSuggestions = []
					this.showManufacturerSuggestions = false
				}
			} catch (err) {
				console.error('查询厂家失败:', err)
			}
		},
		
		// ⭐ 厂家输入框获得焦点
		onManufacturerFocus() {
			if (this.manufacturerSuggestions.length > 0) {
				this.showManufacturerSuggestions = true
			}
		},
		
		// ⭐ 厂家输入框失去焦点
		onManufacturerBlur() {
			// 延迟隐藏，以便点击建议项
			setTimeout(() => {
				this.showManufacturerSuggestions = false
			}, 200)
		},
		
		// ⭐ 选择厂家建议
		selectManufacturer(manufacturer) {
			this.newDrug.manufacturer = manufacturer
			this.showManufacturerSuggestions = false
			this.manufacturerSuggestions = []
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
		
		// 确保在键盘上方显示
		margin-bottom: env(safe-area-inset-bottom);
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
			
			.drug-name-row {
				display: flex;
				align-items: center;
				gap: 12rpx;
				margin-bottom: 8rpx;
			}
			
			.drug-name {
				font-size: 28rpx;
				color: #323233;
				font-weight: 500;
			}
			
			.completeness-badge {
				display: inline-flex;
				align-items: center;
				padding: 4rpx 12rpx;
				border-radius: 12rpx;
				font-size: 20rpx;
				font-weight: 600;
				flex-shrink: 0;
				
				&.complete {
					background: linear-gradient(135deg, #10b981 0%, #059669 100%);
					color: white;
				}
				
				&.good {
					background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
					color: white;
				}
				
				&.medium {
					background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
					color: white;
				}
				
				&.low {
					background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
					color: white;
				}
				
				.badge-text {
					font-size: 20rpx;
				}
			}
			
			.drug-spec {
				display: block;
				font-size: 24rpx;
				color: #969799;
				margin-bottom: 6rpx;
			}
			
			.missing-fields {
				display: block;
				font-size: 22rpx;
				color: #f59e0b;
				margin-top: 6rpx;
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
			
			// ⭐ 快速单位选择
			.quick-units {
				display: flex;
				gap: 12rpx;
				flex-wrap: wrap;
				
				.quick-unit-btn {
					padding: 16rpx 24rpx;
					background: #f7f8fa;
					border-radius: 12rpx;
					font-size: 26rpx;
					color: #646566;
					border: 2rpx solid transparent;
					transition: all 0.3s;
					
					&:active {
						transform: scale(0.95);
					}
					
					&.active {
						background: linear-gradient(135deg, #07C160 0%, #05a550 100%);
						color: white;
						font-weight: 500;
						box-shadow: 0 2rpx 8rpx rgba(7, 193, 96, 0.3);
					}
					
					&.more-btn {
						background: #e5e7eb;
						color: #6b7280;
					}
				}
			}
			
			// ⭐ 厂家智能提示
			.input-with-suggestions {
				position: relative;
				
				.suggestions-list {
					position: absolute;
					top: 100%;
					left: 0;
					right: 0;
					background: white;
					border-radius: 12rpx;
					margin-top: 8rpx;
					box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
					z-index: 100;
					max-height: 300rpx;
					overflow-y: auto;
					
					.suggestion-item {
						padding: 20rpx 24rpx;
						font-size: 26rpx;
						color: #323233;
						border-bottom: 1rpx solid #ebedf0;
						
						&:last-child {
							border-bottom: none;
						}
						
						&:active {
							background: #f7f8fa;
						}
					}
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
