<template>
	<view class="page-container">
		<!-- 页面头部 -->
		<view class="page-header">
			<view class="header-title">药品档案详情</view>
			<view class="header-actions">
				<view class="action-btn edit-btn" @tap="toggleEditMode" v-if="!isEditMode">
					<text class="btn-icon">✏️</text>
					<text class="btn-text">编辑</text>
				</view>
				<view class="action-btn save-btn" @tap="saveDrug" v-if="isEditMode">
					<text class="btn-icon">💾</text>
					<text class="btn-text">保存</text>
				</view>
				<view class="action-btn cancel-btn" @tap="cancelEdit" v-if="isEditMode">
					<text class="btn-text">取消</text>
				</view>
			</view>
		</view>

		<!-- 档案完整度卡片 -->
		<view class="completeness-card">
			<view class="completeness-header">
				<text class="card-title">档案完整度</text>
				<view 
					class="completeness-badge"
					:class="{
						'complete': completeness.percentage === 100,
						'good': completeness.percentage >= 75 && completeness.percentage < 100,
						'medium': completeness.percentage >= 50 && completeness.percentage < 75,
						'low': completeness.percentage < 50
					}"
				>
					<text>{{ completeness.percentage }}%</text>
				</view>
			</view>
			<view class="completeness-progress">
				<view class="progress-bar">
					<view 
						class="progress-fill"
						:class="{
							'complete': completeness.percentage === 100,
							'good': completeness.percentage >= 75 && completeness.percentage < 100,
							'medium': completeness.percentage >= 50 && completeness.percentage < 75,
							'low': completeness.percentage < 50
						}"
						:style="{ width: completeness.percentage + '%' }"
					></view>
				</view>
				<text class="progress-text">{{ completeness.filledCount }}/{{ completeness.totalCount }} 项已填写</text>
			</view>
			<view v-if="completeness.missingFields.length > 0" class="missing-fields">
				<text class="missing-label">缺少：</text>
				<text class="missing-text">{{ completeness.missingFields.join('、') }}</text>
			</view>
		</view>

		<!-- 基本信息 -->
		<view class="info-section">
			<view class="section-title">📋 基本信息</view>
			
			<view class="info-item">
				<text class="item-label">药品名称 <text class="required">*</text></text>
				<input 
					v-if="isEditMode"
					class="item-input"
					v-model="drugData.name"
					placeholder="请输入药品名称"
				/>
				<text v-else class="item-value">{{ drugData.name || '-' }}</text>
			</view>

			<view class="info-item">
				<text class="item-label">规格 <text class="required">*</text></text>
				<input 
					v-if="isEditMode"
					class="item-input"
					v-model="drugData.specification"
					placeholder="如：0.25g×24粒/盒"
				/>
				<text v-else class="item-value">{{ drugData.specification || '-' }}</text>
			</view>

			<view class="info-item">
				<text class="item-label">单位 <text class="required">*</text></text>
				<picker 
					v-if="isEditMode"
					mode="selector"
					:range="unitOptions"
					:value="unitIndex"
					@change="onUnitChange"
				>
					<view class="picker-input">
						<text>{{ drugData.unit || '请选择单位' }}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
				<text v-else class="item-value">{{ drugData.unit || '-' }}</text>
			</view>

			<view class="info-item">
				<text class="item-label">生产厂家 <text class="required">*</text></text>
				<input 
					v-if="isEditMode"
					class="item-input"
					v-model="drugData.manufacturer"
					placeholder="请输入生产厂家"
				/>
				<text v-else class="item-value">{{ drugData.manufacturer || '-' }}</text>
			</view>

			<view class="info-item">
				<text class="item-label">条形码</text>
				<input 
					v-if="isEditMode"
					class="item-input"
					v-model="drugData.barcode"
					placeholder="请输入条形码"
				/>
				<text v-else class="item-value">{{ drugData.barcode || '-' }}</text>
			</view>

			<view class="info-item">
				<text class="item-label">批准文号</text>
				<input 
					v-if="isEditMode"
					class="item-input"
					v-model="drugData.approvalNumber"
					placeholder="请输入批准文号"
				/>
				<text v-else class="item-value">{{ drugData.approvalNumber || '-' }}</text>
			</view>

			<view class="info-item">
				<text class="item-label">分类</text>
				<picker 
					v-if="isEditMode"
					mode="selector"
					:range="categoryOptions"
					:value="categoryIndex"
					@change="onCategoryChange"
				>
					<view class="picker-input">
						<text>{{ drugData.category || '请选择分类' }}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
				<text v-else class="item-value">{{ drugData.category || '-' }}</text>
			</view>
		</view>

		<!-- 库存管理 -->
		<view class="info-section">
			<view class="section-title">📊 库存管理</view>
			
			<view class="info-item">
				<text class="item-label">安全库存</text>
				<input 
					v-if="isEditMode"
					class="item-input"
					type="number"
					v-model="drugData.safeStock"
					placeholder="请输入安全库存"
				/>
				<text v-else class="item-value">{{ drugData.safeStock || '-' }}</text>
			</view>

			<view class="info-item">
				<text class="item-label">最低库存</text>
				<input 
					v-if="isEditMode"
					class="item-input"
					type="number"
					v-model="drugData.minStock"
					placeholder="请输入最低库存"
				/>
				<text v-else class="item-value">{{ drugData.minStock || '-' }}</text>
			</view>
		</view>

		<!-- 特殊标记 -->
		<view class="info-section">
			<view class="section-title">🏷️ 特殊标记</view>
			
			<view class="switch-item">
				<view class="switch-label">
					<text class="label-text">高值药品</text>
					<text class="label-desc">标记为高值药品，需特殊管理</text>
				</view>
				<switch 
					:checked="drugData.isHighValue" 
					:disabled="!isEditMode"
					@change="drugData.isHighValue = $event.detail.value"
					color="#FF9800"
				/>
			</view>

			<view class="switch-item">
				<view class="switch-label">
					<text class="label-text">急救药品</text>
					<text class="label-desc">标记为急救药品，优先管理</text>
				</view>
				<switch 
					:checked="drugData.isEmergency" 
					:disabled="!isEditMode"
					@change="drugData.isEmergency = $event.detail.value"
					color="#F44336"
				/>
			</view>
		</view>

		<!-- 其他信息 -->
		<view class="info-section">
			<view class="section-title">ℹ️ 其他信息</view>
			
			<view class="info-item">
				<text class="item-label">创建时间</text>
				<text class="item-value">{{ formatDate(drugData.createTime) }}</text>
			</view>

			<view class="info-item" v-if="drugData.updateTime">
				<text class="item-label">更新时间</text>
				<text class="item-value">{{ formatDate(drugData.updateTime) }}</text>
			</view>
		</view>

		<!-- 底部操作按钮（非编辑模式） -->
		<view v-if="!isEditMode" class="bottom-actions">
			<view class="action-btn-large delete-btn" @tap="deleteDrug">
				<text>删除档案</text>
			</view>
			<view class="action-btn-large primary-btn" @tap="toggleEditMode">
				<text>编辑档案</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			drugId: '',
			isEditMode: false,
			drugData: {
				name: '',
				specification: '',
				unit: '',
				manufacturer: '',
				barcode: '',
				approvalNumber: '',
				category: '',
				safeStock: 50,
				minStock: 20,
				isHighValue: false,
				isEmergency: false,
				createTime: null,
				updateTime: null
			},
			originalData: {}, // 保存原始数据，用于取消编辑
			unitOptions: ['盒', '瓶', '袋', '支', '板', '片', '粒', '丸', 'g', 'kg', 'ml', 'L'],
			unitIndex: 0,
			categoryOptions: [
				'抗生素类',
				'心血管类',
				'消化系统类',
				'呼吸系统类',
				'解热镇痛类',
				'维生素类',
				'外用药类',
				'急救药品',
				'其他'
			],
			categoryIndex: -1
		}
	},

	computed: {
		completeness() {
			const fields = [
				this.drugData.name,
				this.drugData.specification,
				this.drugData.unit,
				this.drugData.manufacturer,
				this.drugData.barcode,
				this.drugData.approvalNumber,
				this.drugData.category,
				this.drugData.image
			]
			
			const filledCount = fields.filter(field => field && String(field).trim()).length
			const percentage = Math.round((filledCount / fields.length) * 100)
			
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
			
			const missingFields = []
			for (const [key, label] of Object.entries(fieldMap)) {
				const value = this.drugData[key]
				if (!value || !String(value).trim()) {
					missingFields.push(label)
				}
			}
			
			return {
				percentage,
				filledCount,
				totalCount: fields.length,
				isComplete: percentage === 100,
				missingFields
			}
		}
	},

	onLoad(options) {
		if (options.id) {
			this.drugId = options.id
			this.loadDrugDetail()
		}
		
		// 如果从入库页面跳转过来，自动进入编辑模式
		if (options.from === 'inbound') {
			this.isEditMode = true
		}
	},

	methods: {
		async loadDrugDetail() {
			uni.showLoading({ title: '加载中...' })
			
			try {
				console.log('📖 加载药品详情，ID:', this.drugId)
				
				const db = wx.cloud.database()
				const result = await db.collection('drugs')
					.doc(this.drugId)
					.get()
				
				console.log('📖 数据库返回:', result.data)
				
				if (result.data) {
					// ⭐ 兼容 barcode 和 barCode 两种字段名
					const barcodeValue = result.data.barcode || result.data.barCode || ''
					
					this.drugData = {
						name: result.data.name || result.data.drugName || '',
						specification: result.data.specification || result.data.spec || '',
						unit: result.data.unit || result.data.packUnit || '',
						manufacturer: result.data.manufacturer || '',
						barcode: barcodeValue, // 统一使用小写字段
						approvalNumber: result.data.approvalNumber || '',
						category: result.data.category || '',
						safeStock: result.data.safeStock || 50,
						minStock: result.data.minStock || 20,
						isHighValue: result.data.isHighValue || false,
						isEmergency: result.data.isEmergency || false,
						createTime: result.data.createTime,
						updateTime: result.data.updateTime,
						image: result.data.image || ''
					}
					
					console.log('📖 解析后的数据:', this.drugData)
					
					// 设置单位索引
					const unitIdx = this.unitOptions.indexOf(this.drugData.unit)
					this.unitIndex = unitIdx >= 0 ? unitIdx : 0
					
					// 设置分类索引
					const catIdx = this.categoryOptions.indexOf(this.drugData.category)
					this.categoryIndex = catIdx >= 0 ? catIdx : -1
					
					// 保存原始数据
					this.originalData = JSON.parse(JSON.stringify(this.drugData))
				}
			} catch (err) {
				console.error('❌ 加载药品详情失败:', err)
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			} finally {
				uni.hideLoading()
			}
		},

		toggleEditMode() {
			this.isEditMode = !this.isEditMode
			if (this.isEditMode) {
				// 进入编辑模式，保存当前数据
				this.originalData = JSON.parse(JSON.stringify(this.drugData))
			}
		},

		cancelEdit() {
			uni.showModal({
				title: '确认取消',
				content: '取消后将丢失未保存的修改，确定要取消吗？',
				success: (res) => {
					if (res.confirm) {
						// 恢复原始数据
						this.drugData = JSON.parse(JSON.stringify(this.originalData))
						this.isEditMode = false
					}
				}
			})
		},

		async saveDrug() {
			// 验证必填项
			if (!this.drugData.name || !this.drugData.specification || !this.drugData.unit || !this.drugData.manufacturer) {
				uni.showToast({
					title: '请填写必填项',
					icon: 'none'
				})
				return
			}

			uni.showLoading({ title: '保存中...' })

			try {
				console.log('💾 开始保存药品档案...')
				console.log('药品ID:', this.drugId)
				console.log('保存数据:', this.drugData)
				
				const updateData = {
					name: this.drugData.name,
					drugName: this.drugData.name, // 兼容字段
					specification: this.drugData.specification,
					spec: this.drugData.specification, // 兼容字段
					unit: this.drugData.unit,
					packUnit: this.drugData.unit, // 兼容字段
					manufacturer: this.drugData.manufacturer,
					barcode: this.drugData.barcode, // 小写字段
					barCode: this.drugData.barcode, // 驼峰字段（兼容）
					approvalNumber: this.drugData.approvalNumber,
					category: this.drugData.category,
					safeStock: Number(this.drugData.safeStock) || 50,
					minStock: Number(this.drugData.minStock) || 20,
					isHighValue: this.drugData.isHighValue,
					isEmergency: this.drugData.isEmergency
				}
				
				console.log('更新数据:', updateData)
				
				// ⭐ 使用云函数保存（绕过权限限制）
				const result = await wx.cloud.callFunction({
					name: 'drugManage',
					data: {
						action: 'update',
						data: {
							_id: this.drugId,
							updateData: updateData
						}
					}
				})
				
				console.log('✅ 云函数返回结果:', result)
				
				if (result.result && result.result.success) {
					console.log('✅ 保存成功')
					
					uni.showToast({
						title: '保存成功',
						icon: 'success',
						duration: 2000
					})

					this.isEditMode = false
					
					// 重新加载数据以确认保存成功
					setTimeout(() => {
						this.loadDrugDetail()
					}, 1500)
				} else {
					throw new Error(result.result?.message || '保存失败')
				}

			} catch (err) {
				console.error('❌ 保存失败:', err)
				console.error('错误详情:', err.errMsg || err.message)
				
				let errorMsg = '保存失败'
				if (err.errMsg) {
					if (err.errMsg.includes('cloud function not found')) {
						errorMsg = '云函数未部署\n\n请先部署 drugManage 云函数：\n1. 右键点击云函数文件夹\n2. 选择"上传并部署"\n3. 等待部署完成'
					} else if (err.errMsg.includes('permission')) {
						errorMsg = '权限不足，无法保存'
					} else if (err.errMsg.includes('timeout')) {
						errorMsg = '网络超时，请重试'
					} else {
						errorMsg = err.errMsg
					}
				} else if (err.message) {
					errorMsg = err.message
				}
				
				uni.showModal({
					title: '保存失败',
					content: errorMsg,
					showCancel: false
				})
			} finally {
				uni.hideLoading()
			}
		},

		deleteDrug() {
			// 检查是否有drugId
			if (!this.drugId) {
				uni.showToast({
					title: '药品ID不存在，无法删除',
					icon: 'none'
				})
				return
			}
			
			uni.showModal({
				title: '确认删除',
				content: '删除后将无法恢复，确定要删除这个药品档案吗？',
				confirmText: '确认删除',
				confirmColor: '#ee0a24',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '删除中...' })
						
						try {
							// 使用云函数删除（绕过权限限制）
							const result = await wx.cloud.callFunction({
								name: 'drugManage',
								data: {
									action: 'delete',
									data: {
										_id: this.drugId
									}
								}
							})
							
							console.log('删除结果:', result)
							
							uni.hideLoading()
							
							if (result.result && result.result.success) {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								})
								
								setTimeout(() => {
									uni.navigateBack()
								}, 1500)
							} else {
								uni.showModal({
									title: '删除失败',
									content: result.result?.message || '删除失败，请重试',
									showCancel: false
								})
							}
						} catch (err) {
							console.error('删除失败:', err)
							uni.hideLoading()
							
							// 显示详细错误信息
							let errorMsg = '删除失败'
							if (err.errMsg) {
								errorMsg = err.errMsg
							} else if (err.message) {
								errorMsg = err.message
							}
							
							uni.showModal({
								title: '删除失败',
								content: errorMsg + '\n\n可能原因：\n1. 云函数未部署\n2. 该药品已被使用\n3. 网络连接问题',
								showCancel: false
							})
						}
					}
				}
			})
		},

		onUnitChange(e) {
			this.unitIndex = e.detail.value
			this.drugData.unit = this.unitOptions[e.detail.value]
		},

		onCategoryChange(e) {
			this.categoryIndex = e.detail.value
			this.drugData.category = this.categoryOptions[e.detail.value]
		},

		formatDate(date) {
			if (!date) return '-'
			
			const d = date instanceof Date ? date : new Date(date)
			const year = d.getFullYear()
			const month = String(d.getMonth() + 1).padStart(2, '0')
			const day = String(d.getDate()).padStart(2, '0')
			const hour = String(d.getHours()).padStart(2, '0')
			const minute = String(d.getMinutes()).padStart(2, '0')
			
			return `${year}-${month}-${day} ${hour}:${minute}`
		}
	}
}
</script>

<style lang="scss" scoped>
.page-container {
	min-height: 100vh;
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding: 24rpx 24rpx 150rpx;
}

.page-header {
	max-width: 702rpx;
	margin: 10rpx auto 8rpx;
	padding: 26rpx 26rpx 20rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	display: flex;
	justify-content: space-between;
	align-items: center;
	
	.header-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #111827;
	}
	
	.header-actions {
		display: flex;
		gap: 12rpx;
	}
	
	.action-btn {
		display: flex;
		align-items: center;
		gap: 6rpx;
		padding: 12rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		transition: all 0.3s;
		
		&:active {
			transform: scale(0.95);
		}
		
		&.edit-btn {
			background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
			color: white;
		}
		
		&.save-btn {
			background: linear-gradient(135deg, #07C160 0%, #05a550 100%);
			color: white;
		}
		
		&.cancel-btn {
			background: #f7f8fa;
			color: #646566;
		}
		
		.btn-icon {
			font-size: 28rpx;
		}
	}
}

.completeness-card {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 26rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	
	.completeness-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		
		.card-title {
			font-size: 30rpx;
			font-weight: bold;
			color: #111827;
		}
		
		.completeness-badge {
			padding: 8rpx 20rpx;
			border-radius: 20rpx;
			font-size: 24rpx;
			font-weight: 600;
			
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
		}
	}
	
	.completeness-progress {
		margin-bottom: 16rpx;
		
		.progress-bar {
			height: 12rpx;
			background: #e5e7eb;
			border-radius: 6rpx;
			overflow: hidden;
			margin-bottom: 12rpx;
			
			.progress-fill {
				height: 100%;
				border-radius: 6rpx;
				transition: width 0.3s;
				
				&.complete {
					background: linear-gradient(90deg, #10b981 0%, #059669 100%);
				}
				
				&.good {
					background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
				}
				
				&.medium {
					background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
				}
				
				&.low {
					background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
				}
			}
		}
		
		.progress-text {
			font-size: 24rpx;
			color: #6b7280;
		}
	}
	
	.missing-fields {
		padding: 16rpx;
		background: #fff7ed;
		border-radius: 12rpx;
		border-left: 4rpx solid #f59e0b;
		
		.missing-label {
			font-size: 24rpx;
			color: #92400e;
			font-weight: 500;
		}
		
		.missing-text {
			font-size: 24rpx;
			color: #d97706;
		}
	}
}

.info-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 26rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	
	.section-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #111827;
		margin-bottom: 24rpx;
		padding-bottom: 16rpx;
		border-bottom: 2rpx solid #e5e7eb;
	}
	
	.info-item {
		margin-bottom: 24rpx;
		
		&:last-child {
			margin-bottom: 0;
		}
		
		.item-label {
			display: block;
			font-size: 26rpx;
			color: #6b7280;
			margin-bottom: 12rpx;
			
			.required {
				color: #ee0a24;
				margin-left: 4rpx;
			}
		}
		
		.item-value {
			display: block;
			font-size: 28rpx;
			color: #111827;
			padding: 16rpx 0;
		}
		
		.item-input {
			width: 100%;
			height: 80rpx;
			padding: 0 20rpx;
			background: #f7f8fa;
			border-radius: 12rpx;
			font-size: 28rpx;
			color: #111827;
			border: 2rpx solid transparent;
			transition: all 0.3s;
			
			&:focus {
				background: white;
				border-color: #00c9ff;
			}
		}
		
		.picker-input {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 80rpx;
			padding: 0 20rpx;
			background: #f7f8fa;
			border-radius: 12rpx;
			font-size: 28rpx;
			color: #111827;
			
			.picker-arrow {
				font-size: 20rpx;
				color: #9ca3af;
			}
		}
	}
	
	.switch-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 0;
		border-bottom: 1rpx solid #e5e7eb;
		
		&:last-child {
			border-bottom: none;
		}
		
		.switch-label {
			flex: 1;
			
			.label-text {
				display: block;
				font-size: 28rpx;
				color: #111827;
				font-weight: 500;
				margin-bottom: 8rpx;
			}
			
			.label-desc {
				display: block;
				font-size: 24rpx;
				color: #6b7280;
			}
		}
	}
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 24rpx 30rpx;
	background: white;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
	display: flex;
	gap: 20rpx;
	
	.action-btn-large {
		flex: 1;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 44rpx;
		font-size: 30rpx;
		font-weight: 500;
		transition: all 0.3s;
		
		&:active {
			transform: scale(0.98);
		}
		
		&.delete-btn {
			background: #f7f8fa;
			color: #ee0a24;
			border: 2rpx solid #fee2e2;
		}
		
		&.primary-btn {
			background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
			color: white;
			box-shadow: 0 4rpx 16rpx rgba(0, 160, 255, 0.3);
		}
	}
}
</style>
