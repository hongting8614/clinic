<template>
	<view class="page-container">
		<!-- 标题栏 -->
		<view class="page-header">
			<view class="clinic-name">🏥 爱康医务室管理系统</view>
			<view class="doc-type">北京欢乐谷医务室 · 药材档案{{ isEdit ? '编辑' : '添加' }}</view>
		</view>

		<!-- 扫码区域 - 仅药材档案页面保留扫码功能 -->
		<view class="scan-section">
			<view class="scan-title">📷 扫码录入</view>
			<view class="scan-desc">扫描药材条形码快速录入药材信息</view>
			<scanner 
				button-text="📷 扫码添加药材"
				button-type="primary"
				@success="onScanSuccess"
				@notFound="onBarcodeNotFound"
			></scanner>
		</view>

		<!-- 基本信息 -->
		<view class="form-section">
			<view class="section-title">📋 基本信息</view>

			<!-- 药材名称 -->
			<view class="form-item">
				<view class="label required">药材名称</view>
				<input 
					v-model="form.drugName" 
					class="input" 
					placeholder="请输入药材名称"
					placeholder-class="placeholder"
				/>
			</view>

			<!-- 药材代码 -->
			<view class="form-item">
				<view class="label">药材代码</view>
				<input 
					v-model="form.drugCode" 
					class="input" 
					placeholder="如：AMOX500-TAB（可选，系统可自动生成）"
					placeholder-class="placeholder"
				/>
			</view>

			<!-- 条形码 -->
			<view class="form-item">
				<view class="label">条形码</view>
				<input 
					v-model="form.barcode" 
					class="input" 
					placeholder="请输入或扫描条形码"
					placeholder-class="placeholder"
				/>
			</view>

			<!-- 规格 -->
			<view class="form-item">
				<view class="label required">规格</view>
				<input 
					v-model="form.specification" 
					class="input" 
					placeholder="如：0.25g*24粒"
					placeholder-class="placeholder"
				/>
			</view>

			<!-- 生产厂家 -->
			<view class="form-item">
				<view class="label required">生产厂家</view>
				<input 
					v-model="form.manufacturer" 
					class="input" 
					placeholder="请输入生产厂家"
					placeholder-class="placeholder"
				/>
			</view>

			<!-- 药材分类 -->
			<view class="form-item">
				<view class="label">药材分类</view>
				<picker 
					mode="selector" 
					:range="categoryOptions" 
					@change="onCategoryChange"
					:value="categoryIndex"
				>
					<view class="picker-display">
						{{ form.category || '请选择药材分类' }}
					</view>
				</picker>
			</view>
		</view>

		<!-- 单位信息 -->
		<view class="form-section">
			<view class="section-title">📦 单位转换</view>
			<view class="section-desc">设置包装单位和最小单位的转换关系</view>

			<!-- 包装单位 -->
			<view class="form-item">
				<view class="label required">包装单位</view>
				<view class="input-row">
					<input 
						v-model="form.packUnit" 
						class="input flex-input" 
						placeholder="如：盒、瓶"
						placeholder-class="placeholder"
					/>
					<text class="hint">（主库存单位）</text>
				</view>
			</view>

			<!-- 最小单位 -->
			<view class="form-item">
				<view class="label required">最小单位</view>
				<view class="input-row">
					<input 
						v-model="form.minUnit" 
						class="input flex-input" 
						placeholder="如：片、粒、ml"
						placeholder-class="placeholder"
					/>
					<text class="hint">（园区使用单位）</text>
				</view>
			</view>

			<!-- 转换率 -->
			<view class="form-item">
				<view class="label required">转换率</view>
				<view class="conversion-row">
					<text class="conversion-text">1 {{ form.packUnit || '盒' }} = </text>
					<input 
						v-model.number="form.conversionRate" 
						class="input conversion-input" 
						type="number"
						placeholder="24"
						placeholder-class="placeholder"
					/>
					<text class="conversion-text">{{ form.minUnit || '片' }}</text>
				</view>
			</view>

			<!-- 转换示例 -->
			<view v-if="form.conversionRate" class="conversion-example">
				<text class="example-icon">💡</text>
				<text class="example-text">
					示例：入库 1{{ form.packUnit || '盒' }}，出库到园区后可用 {{ form.conversionRate }}{{ form.minUnit || '片' }}
				</text>
			</view>
		</view>

		<!-- 库存管理 -->
		<view class="form-section">
			<view class="section-title">📊 库存管理</view>

			<!-- 安全库存 -->
			<view class="form-item">
				<view class="label">安全库存</view>
				<view class="input-row">
					<input 
						v-model.number="form.safeStock" 
						class="input flex-input" 
						type="number"
						placeholder="请输入安全库存数量"
						placeholder-class="placeholder"
					/>
					<text class="hint">{{ form.packUnit || '单位' }}</text>
				</view>
			</view>

			<!-- 最低库存 -->
			<view class="form-item">
				<view class="label">最低库存</view>
				<view class="input-row">
					<input 
						v-model.number="form.minStock" 
						class="input flex-input" 
						type="number"
						placeholder="请输入最低库存数量"
						placeholder-class="placeholder"
					/>
					<text class="hint">{{ form.packUnit || '单位' }}</text>
				</view>
			</view>
		</view>

		<!-- 特殊标记 -->
		<view class="form-section">
			<view class="section-title">🏷️ 特殊标记</view>

			<view class="switch-item">
				<view class="switch-label">
					<text class="label-text">高值药材</text>
					<text class="label-desc">标记为高值药材，需特殊管理</text>
				</view>
				<switch 
					:checked="form.isHighValue" 
					@change="form.isHighValue = $event.detail.value"
					color="#FF9800"
				/>
			</view>

			<view class="switch-item">
				<view class="switch-label">
					<text class="label-text">急救药材</text>
					<text class="label-desc">标记为急救药材，优先管理</text>
				</view>
				<switch 
					:checked="form.isEmergency" 
					@change="form.isEmergency = $event.detail.value"
					color="#F44336"
				/>
			</view>
		</view>

		<!-- 备注 -->
		<view class="form-section">
			<view class="section-title">📝 备注信息</view>
			<view class="form-item">
				<textarea 
					v-model="form.remark" 
					class="textarea" 
					placeholder="请输入备注信息（选填）"
					placeholder-class="placeholder"
					maxlength="200"
				></textarea>
				<view class="char-count">{{ form.remark.length }}/200</view>
			</view>
		</view>

		<!-- 底部操作按钮 -->
		<view class="bottom-actions">
			<button class="btn-cancel" @tap="handleCancel">取消</button>
			<button class="btn-submit" @tap="handleSubmit">{{ isEdit ? '保存修改' : '💾 保存药材' }}</button>
		</view>
	</view>
</template>

<script>
import Scanner from '@/components/scanner/index.vue'

export default {
	components: {
		Scanner
	},
	
	data() {
		return {
			isEdit: false,
			drugId: '',
			form: {
				drugCode: '',
				drugName: '',
				specification: '',
				manufacturer: '',
				barcode: '',
				category: '',
				packUnit: '盒',
				minUnit: '片',
				conversionRate: 1,
				safeStock: 100,
				minStock: 50,
				isHighValue: false,
				isEmergency: false,
				remark: ''
			},
			categoryOptions: [
				'抗生素类',
				'心血管类',
				'消化系统类',
				'呼吸系统类',
				'解热镇痛类',
				'维生素类',
				'外用药类',
				'急救药材',
				'其他'
			],
			categoryIndex: -1
		}
	},

	onLoad(options) {
		if (options.id) {
			this.isEdit = true
			this.drugId = options.id
			this.loadDrugDetail()
		}
	},

	methods: {
		// 扫码成功回调
		async onScanSuccess(drugInfo) {
			console.log('✅ 扫码成功，获取到药材信息:', drugInfo)
			
			const barcode = drugInfo.barcode
			
			// 检查数据库中是否已存在该条形码
			const exists = await this.checkBarcodeExists(barcode)
			
			if (exists) {
				uni.showModal({
					title: '💊 药材已存在',
					content: `该条形码药材已录入系统\n\n药材名称：${exists.drugName}\n规格：${exists.specification}\n\n是否查看详情？`,
					confirmText: '查看详情',
					cancelText: '重新录入',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: `/pages-sub/drug/detail?id=${exists._id}`
							})
						}
					}
				})
				return
			}
			
			// 自动填充表单
			this.fillFormFromScanData(drugInfo)
			
			// 显示成功提示
			const sourceText = {
				'local': '本地档案',
				'cache': '缓存数据',
				'gs1': 'API查询'
			}[drugInfo.source] || '扫码'
			
			uni.showToast({
				title: `✅ 信息已自动填充 (${sourceText})`,
				icon: 'success',
				duration: 2000
			})
		},
		
		// 从扫码数据填充表单
		fillFormFromScanData(drugInfo) {
			console.log('📝 自动填充表单:', drugInfo)
			
			// 填充基本信息
			if (drugInfo.name) {
				this.form.drugName = drugInfo.name
			}
			
			if (drugInfo.specification) {
				this.form.specification = drugInfo.specification
			}
			
			if (drugInfo.manufacturer) {
				this.form.manufacturer = drugInfo.manufacturer
			}
			
			if (drugInfo.barcode) {
				this.form.barcode = drugInfo.barcode
			}
			
			// 填充分类
			if (drugInfo.category) {
				this.form.category = drugInfo.category
				const index = this.categoryOptions.indexOf(drugInfo.category)
				if (index >= 0) {
					this.categoryIndex = index
				}
			}
			
			// 智能解析单位信息
			if (drugInfo.unit) {
				this.form.packUnit = drugInfo.unit
			}
			
			// 尝试从规格中解析转换率
			if (drugInfo.specification) {
				const conversionInfo = this.parseConversionFromSpec(drugInfo.specification)
				if (conversionInfo) {
					this.form.conversionRate = conversionInfo.rate
					if (conversionInfo.minUnit) {
						this.form.minUnit = conversionInfo.minUnit
					}
				}
			}
			
			console.log('✅ 表单填充完成:', this.form)
		},
		
		// 从规格字符串解析转换率
		parseConversionFromSpec(spec) {
			// 匹配常见格式：
			// "0.25g*24粒" -> 24粒
			// "10ml*10支" -> 10支
			// "100mg×20片" -> 20片
			
			const patterns = [
				/[*×](\d+)([片粒粒支袋包])/,  // 匹配 *24片 或 ×24片
				/(\d+)([片粒支袋包])\/[盒瓶]/  // 匹配 24片/盒
			]
			
			for (let pattern of patterns) {
				const match = spec.match(pattern)
				if (match) {
					return {
						rate: parseInt(match[1]),
						minUnit: match[2]
					}
				}
			}
			
			return null
		},

		// 条形码不存在回调
		onBarcodeNotFound(data) {
			console.log('⚠️ 未找到条形码:', data)
			
			const barcode = data.barcode || data
			
			uni.showModal({
				title: '💊 新药材录入',
				content: `条形码：${barcode}\n\n该药材未在系统中找到，请手动填写药材信息。\n\n提示：填写完成后，下次扫描此条形码将自动识别。`,
				showCancel: false,
				confirmText: '开始填写',
				success: () => {
					// 只填充条形码，其他信息需要手动填写
					this.form.barcode = barcode
					
					// 滚动到表单顶部
					uni.pageScrollTo({
						scrollTop: 200,
						duration: 300
					})
				}
			})
		},

		// 检查条形码是否存在
		async checkBarcodeExists(barcode) {
			try {
				const res = await wx.cloud.callFunction({
					name: 'drugManage',
					data: {
						action: 'checkBarcode',
						barcode: barcode
					}
				})
				
				if (res.result.success && res.result.data) {
					return res.result.data
				}
				return null
			} catch (err) {
				console.error('检查条形码失败:', err)
				return null
			}
		},

		// 加载药材详情（编辑模式）
		async loadDrugDetail() {
			uni.showLoading({ title: '加载中...' })
			
			try {
				const res = await wx.cloud.callFunction({
					name: 'drugManage',
					data: {
						action: 'getDetail',
						_id: this.drugId
					}
				})
				
				if (res.result.success) {
					const drug = res.result.data
					this.form = {
						drugCode: drug.drugCode || '',
						drugName: drug.drugName || '',
						specification: drug.specification || '',
						manufacturer: drug.manufacturer || '',
						barcode: drug.barcode || '',
						category: drug.category || '',
						packUnit: drug.packUnit || '盒',
						minUnit: drug.minUnit || '片',
						conversionRate: drug.conversionRate || 1,
						safeStock: drug.safeStock || 100,
						minStock: drug.minStock || 50,
						isHighValue: drug.isHighValue || false,
						isEmergency: drug.isEmergency || false,
						remark: drug.remark || ''
					}
					
					// 设置分类索引
					const index = this.categoryOptions.indexOf(this.form.category)
					this.categoryIndex = index >= 0 ? index : -1
				}
			} catch (err) {
				console.error('加载药材详情失败:', err)
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			} finally {
				uni.hideLoading()
			}
		},

		// 分类选择
		onCategoryChange(e) {
			this.categoryIndex = e.detail.value
			this.form.category = this.categoryOptions[e.detail.value]
		},

		// 表单验证
		validateForm() {
			if (!this.form.drugName) {
				uni.showToast({
					title: '请输入药材名称',
					icon: 'none'
				})
				return false
			}

			if (!this.form.specification) {
				uni.showToast({
					title: '请输入药材规格',
					icon: 'none'
				})
				return false
			}

			if (!this.form.manufacturer) {
				uni.showToast({
					title: '请输入生产厂家',
					icon: 'none'
				})
				return false
			}

			if (!this.form.packUnit) {
				uni.showToast({
					title: '请输入包装单位',
					icon: 'none'
				})
				return false
			}

			if (!this.form.minUnit) {
				uni.showToast({
					title: '请输入最小单位',
					icon: 'none'
				})
				return false
			}

			if (!this.form.conversionRate || this.form.conversionRate <= 0) {
				uni.showToast({
					title: '请输入正确的转换率',
					icon: 'none'
				})
				return false
			}

			return true
		},

		// 提交表单
		async handleSubmit() {
			if (!this.validateForm()) {
				return
			}

			uni.showLoading({ title: this.isEdit ? '保存中...' : '添加中...' })

			try {
				// 如果没有药材代码，自动生成
				if (!this.form.drugCode) {
					this.form.drugCode = this.generateDrugCode()
				}

				const submitData = {
					...this.form,
					updateTime: new Date().getTime()
				}

				if (this.isEdit) {
					// 更新药材
					submitData._id = this.drugId
					await wx.cloud.callFunction({
						name: 'drugManage',
						data: {
							action: 'update',
							...submitData
						}
					})
				} else {
					// 新增药材
					submitData.createTime = new Date().getTime()
					await wx.cloud.callFunction({
						name: 'drugManage',
						data: {
							action: 'add',
							...submitData
						}
					})
				}

				uni.showToast({
					title: this.isEdit ? '保存成功' : '添加成功',
					icon: 'success'
				})

				setTimeout(() => {
					uni.navigateBack()
				}, 1500)

			} catch (err) {
				console.error('提交失败:', err)
				uni.showToast({
					title: '提交失败',
					icon: 'none'
				})
			} finally {
				uni.hideLoading()
			}
		},

		// 生成药材代码
		generateDrugCode() {
			// 简单的代码生成逻辑：取药材名称拼音首字母 + 规格首字母 + 时间戳后4位
			const name = this.form.drugName
			const spec = this.form.specification
			const timestamp = Date.now().toString().slice(-4)
			
			// 这里简化处理，实际应该用拼音库
			const nameCode = name.substring(0, 3).toUpperCase()
			const specCode = spec ? spec.substring(0, 3).replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : ''
			
			return `${nameCode}${specCode}-${timestamp}`
		},

		// 取消
		handleCancel() {
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss" scoped>
.page-container {
	min-height: 100vh;
	/* 与出入库/库存页面统一的蓝色渐变背景 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding: 24rpx 24rpx 150rpx;
}

.page-header {
	max-width: 702rpx;
	margin: 10rpx auto 8rpx;
	background: #fffff0;
	padding: 26rpx 26rpx 20rpx;
	text-align: center;
	border-radius: 22rpx;
	box-shadow:
		0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
		0 -1rpx 0 rgba(15, 23, 42, 0.06) inset,
		0 18rpx 40rpx rgba(15, 23, 42, 0.14);
}

.clinic-name {
	font-size: 40rpx;
	font-weight: bold;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	margin-bottom: 12rpx;
	letter-spacing: 2rpx;
}

.doc-type {
	font-size: 26rpx;
	color: #666666;
	letter-spacing: 1rpx;
}

.scan-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	background: #fffff0;
	border-radius: 22rpx;
	padding: 30rpx 26rpx 26rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.scan-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #FFFFFF;
	margin-bottom: 10rpx;
	text-align: center;
}

.scan-desc {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	text-align: center;
	margin-bottom: 30rpx;
}

.form-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	background-color: #fffff0;
	border-radius: 22rpx;
	padding: 26rpx 26rpx 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 10rpx;
	padding-bottom: 20rpx;
	border-bottom: 2rpx solid #F0F0F0;
}

.section-desc {
	font-size: 24rpx;
	color: #999999;
	margin-bottom: 30rpx;
	line-height: 1.6;
}

.form-item {
	margin-bottom: 30rpx;
}

.label {
	font-size: 28rpx;
	color: #333333;
	margin-bottom: 15rpx;
	display: block;
	font-weight: 500;
}

.required::before {
	content: '*';
	color: #FF4444;
	margin-right: 5rpx;
}

.input {
	width: 100%;
	height: 80rpx;
	background-color: #F8F9FA;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	color: #333333;
	border: 2rpx solid transparent;
	transition: all 0.3s;
	box-sizing: border-box;
}

.input:focus {
	background-color: #FFFFFF;
	border-color: #667eea;
}

.placeholder {
	color: #CCCCCC;
}

.picker-display {
	height: 80rpx;
	background-color: #F8F9FA;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	color: #333333;
	display: flex;
	align-items: center;
	border: 2rpx solid transparent;
}

.input-row {
	display: flex;
	align-items: center;
	gap: 15rpx;
}

.flex-input {
	flex: 1;
}

.hint {
	font-size: 24rpx;
	color: #999999;
	white-space: nowrap;
}

.conversion-row {
	display: flex;
	align-items: center;
	gap: 15rpx;
	background-color: #F8F9FA;
	border-radius: 12rpx;
	padding: 20rpx;
}

.conversion-text {
	font-size: 28rpx;
	color: #666666;
	white-space: nowrap;
}

.conversion-input {
	width: 120rpx;
	height: 60rpx;
	background-color: #FFFFFF;
	text-align: center;
	font-weight: bold;
	color: #667eea;
}

.conversion-example {
	margin-top: 20rpx;
	padding: 20rpx;
	background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
	border-radius: 12rpx;
	display: flex;
	align-items: flex-start;
	gap: 10rpx;
}

.example-icon {
	font-size: 32rpx;
	line-height: 1;
}

.example-text {
	flex: 1;
	font-size: 24rpx;
	color: #F57C00;
	line-height: 1.6;
}

.switch-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 25rpx 0;
	border-bottom: 1rpx solid #F0F0F0;
}

.switch-item:last-child {
	border-bottom: none;
}

.switch-label {
	flex: 1;
}

.label-text {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
	display: block;
	margin-bottom: 8rpx;
}

.label-desc {
	font-size: 24rpx;
	color: #999999;
	display: block;
}

.textarea {
	width: 100%;
	min-height: 200rpx;
	background-color: #F8F9FA;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 28rpx;
	color: #333333;
	line-height: 1.6;
	box-sizing: border-box;
}

.char-count {
	text-align: right;
	font-size: 24rpx;
	color: #999999;
	margin-top: 10rpx;
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #FFFFFF;
	padding: 18rpx 24rpx 26rpx;
	display: flex;
	gap: 20rpx;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
	z-index: 100;
}

.btn-cancel,
.btn-submit {
	flex: 1;
	height: 90rpx;
	border-radius: 999rpx;
	font-size: 32rpx;
	font-weight: bold;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
}

.btn-cancel {
	background-color: #ffffff;
	color: #64748b;
	border: 1rpx solid #cbd5e1;
}

.btn-submit {
	background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
	color: #ffffff;
	box-shadow: 0 8rpx 20rpx rgba(0, 160, 255, 0.3);
}
</style>
