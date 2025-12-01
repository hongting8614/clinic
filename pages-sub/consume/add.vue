<template>
	<view class="page">
		<!-- 专业医疗表头 -->
		<view class="medical-header">
			<view class="header-bg"></view>
			<view class="header-content">
				<text class="clinic-name">爱康医务室管理系统</text>
				<text class="doc-type">北京欢乐谷医务室 · 门诊日消耗记录</text>
				<text class="doc-type-en">DAILY CONSUMPTION RECORD</text>
			</view>
		</view>

		<!-- 基本信息卡片 -->
		<view class="info-card">
			<view class="card-title">
				<text class="title-icon">📅</text>
				<text class="title-text">基本信息</text>
			</view>
			
			<view class="form-grid">
				<!-- 日期 -->
				<view class="form-item full">
					<text class="form-label">记录日期 *</text>
					<picker mode="date" :value="consumeDate" @change="onDateChange">
						<view class="picker-input">
							<text class="picker-value">{{ consumeDate || '请选择日期' }}</text>
							<text class="picker-icon">📅</text>
						</view>
					</picker>
				</view>
				
				<!-- 园区选择 -->
				<view class="form-item full">
					<text class="form-label">消耗园区 *</text>
					<view class="location-selector">
						<view 
							class="location-option" 
							:class="location === 'land_park' ? 'active land' : ''"
							@tap="selectLocation('land_park')"
						>
							<text class="loc-icon">🏞️</text>
							<text class="loc-name">陆园</text>
							<text v-if="location === 'land_park'" class="loc-check">✓</text>
						</view>
						<view 
							class="location-option"
							:class="location === 'water_park' ? 'active water' : ''"
							@tap="selectLocation('water_park')"
						>
							<text class="loc-icon">💧</text>
							<text class="loc-name">水园</text>
							<text v-if="location === 'water_park'" class="loc-check">✓</text>
						</view>
					</view>
				</view>
				
				<!-- 记录人（自动） -->
				<view class="form-item full">
					<text class="form-label">记录人</text>
					<view class="auto-value">
						<text class="auto-icon">👤</text>
						<text class="auto-text">{{ operator }}</text>
						<text class="auto-badge">自动</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 药材明细 -->
		<view class="drugs-card">
			<view class="card-title">
				<text class="title-icon">💊</text>
				<text class="title-text">消耗明细</text>
				<text class="title-count">{{ drugList.length }}种</text>
			</view>
			
			<!-- 添加按钮 -->
			<view class="add-actions">
			<view class="add-btn primary" @tap="manualAdd">
					<text class="btn-icon">➕</text>
				<text class="btn-text">添加药材</text>
				</view>
			</view>
			
			<!-- 药材列表 -->
			<view v-if="drugList.length > 0" class="drug-list">
				<view 
					v-for="(item, index) in drugList"
					:key="index"
					class="drug-item"
				>
					<view class="drug-header">
						<text class="drug-name">{{ item.drugName }}</text>
						<text class="drug-delete" @tap="deleteDrug(index)">✕</text>
					</view>
					
					<view class="drug-info-grid">
						<view class="info-cell">
							<text class="cell-label">规格</text>
							<text class="cell-value">{{ item.spec }}</text>
						</view>
						<view class="info-cell">
							<text class="cell-label">批号</text>
							<text class="cell-value mono">{{ item.batch }}</text>
						</view>
					</view>
					
					<view class="quantity-input">
						<text class="quantity-label">消耗数量 *</text>
						<view class="quantity-control">
							<view class="control-btn" @tap="decreaseQuantity(index)">−</view>
							<input 
								class="quantity-value"
								type="digit"
								v-model="item.quantity"
								@input="onQuantityInput(index)"
							/>
							<text class="quantity-unit">{{ item.unit }}</text>
							<view class="control-btn" @tap="increaseQuantity(index)">+</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view v-else class="empty-drugs">
				<text class="empty-icon">💊</text>
				<text class="empty-text">请添加消耗药材</text>
			</view>
		</view>

		<!-- 备注 -->
		<view class="remark-card">
			<view class="card-title">
				<text class="title-icon">📝</text>
				<text class="title-text">备注说明</text>
			</view>
			<textarea 
				class="remark-textarea"
				v-model="remark"
				placeholder="请输入备注信息（选填）"
				maxlength="200"
			></textarea>
		</view>

		<!-- 底部操作栏 -->
		<view class="action-bar">
			<view class="action-btn btn-cancel" @tap="handleCancel">
				<text class="btn-text">取消</text>
			</view>
			<view class="action-btn btn-submit" @tap="handleSubmit">
				<text class="btn-icon">✓</text>
				<text class="btn-text">提交记录</text>
			</view>
		</view>
	</view>
</template>

<script>
import { callFunction } from '@/utils/api.js'

export default {
	data() {
		return {
			consumeDate: '',
			location: 'land_park',
			operator: '记录员',
			drugList: [],
			remark: ''
		}
	},
	
	onLoad() {
		this.initPage()
	},
	
	methods: {
		initPage() {
			// 设置当前日期
			const now = new Date()
			const year = now.getFullYear()
			const month = String(now.getMonth() + 1).padStart(2, '0')
			const day = String(now.getDate()).padStart(2, '0')
			this.consumeDate = `${year}-${month}-${day}`
			
			// 获取用户信息
			const userInfo = uni.getStorageSync('userInfo')
			if (userInfo && userInfo.name) {
				this.operator = userInfo.name
			}
		},
		
		onDateChange(e) {
			this.consumeDate = e.detail.value
		},
		
		selectLocation(loc) {
			this.location = loc
		},
		
		
		async selectBatchForDrug(drug) {
			try {
				uni.showLoading({ title: '加载批次...' })
				
				// 查询该药材在当前园区的库存批次
				const result = await callFunction('stockManage', {
					action: 'getBatchesByDrugId',
					data: {
						drugId: drug._id,
						location: this.location
					}
				})
				
				uni.hideLoading()
				
				if (result.success && result.data && result.data.length > 0) {
					const batches = result.data
					
					// 如果只有一个批次，直接使用
					if (batches.length === 1) {
						this.addDrugToBatch(drug, batches[0])
					} else {
						// 多个批次，让用户选择
						this.showBatchSelector(drug, batches)
					}
				} else {
					uni.showToast({
						title: '该药材在当前园区无库存',
						icon: 'none'
					})
				}
			} catch (err) {
				uni.hideLoading()
				console.error('查询批次失败:', err)
				uni.showToast({
					title: '查询批次失败',
					icon: 'none'
				})
			}
		},
		
		showBatchSelector(drug, batches) {
			const items = batches.map(b => `批次${b.batch} (库存${b.quantity}${drug.unit})`)
			
			uni.showActionSheet({
				itemList: items,
				success: (res) => {
					const selectedBatch = batches[res.tapIndex]
					this.addDrugFromBatch(drug, selectedBatch)
				}
			})
		},
		
		addDrugFromBatch(drug, batch) {
			// 检查是否已添加
			const existIndex = this.drugList.findIndex(
				item => item.drugId === drug._id && item.batch === batch.batch
			)
			
			if (existIndex >= 0) {
				uni.showToast({
					title: '该药材已添加',
					icon: 'none'
				})
				return
			}
			
			// 添加到列表
			this.drugList.push({
				drugId: drug._id,
				drugName: drug.name,
				spec: drug.spec,
				unit: drug.unit,
				batch: batch.batchNo,
				quantity: 1,
				maxQuantity: batch.quantity
			})
			
			uni.showToast({
				title: '添加成功',
				icon: 'success'
			})
		},
		
		manualAdd() {
			// 手动选择药材
			uni.navigateTo({
				url: '/pages-sub/drug/list?mode=select&location=' + this.location
			})
		},
		
		deleteDrug(index) {
			this.drugList.splice(index, 1)
		},
		
		increaseQuantity(index) {
			const item = this.drugList[index]
			const current = parseInt(item.quantity) || 0
			const max = item.maxQuantity || 9999
			
			if (current < max) {
				this.drugList[index].quantity = current + 1
			} else {
				uni.showToast({
					title: `库存不足，最多${max}${item.unit}`,
					icon: 'none'
				})
			}
		},
		
		decreaseQuantity(index) {
			const current = parseInt(this.drugList[index].quantity) || 0
			if (current > 0) {
				this.drugList[index].quantity = current - 1
			}
		},
		
		onQuantityInput(index, e) {
			const value = parseInt(e.detail.value) || 0
			const item = this.drugList[index]
			const max = item.maxQuantity || 9999
			
			if (value > max) {
				this.drugList[index].quantity = max
				uni.showToast({
					title: `库存不足，最多${max}${item.unit}`,
					icon: 'none'
				})
			} else if (value < 0) {
				this.drugList[index].quantity = 0
			}
		},
		
		handleCancel() {
			uni.navigateBack()
		},
		
		async handleSubmit() {
			// 验证
			if (!this.consumeDate) {
				uni.showToast({ title: '请选择日期', icon: 'none' })
				return
			}
			
			if (!this.location) {
				uni.showToast({ title: '请选择园区', icon: 'none' })
				return
			}
			
			if (this.drugList.length === 0) {
				uni.showToast({ title: '请添加消耗药材', icon: 'none' })
				return
			}
			
			// 验证数量
			for (let item of this.drugList) {
				if (!item.quantity || item.quantity <= 0) {
					uni.showToast({ title: '请填写消耗数量', icon: 'none' })
					return
				}
			}
			
			uni.showModal({
				title: '确认提交',
				content: `确认提交${this.consumeDate}的消耗记录吗？`,
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '提交中...' })
						
						try {
							// 调用云函数保存
							const result = await this.$api.callFunction('consumeRecords', {
								action: 'add',
								date: this.consumeDate,
								location: this.location,
								locationName: this.location === 'land_park' ? '陆园' : '水园',
								items: this.drugList,
								operator: this.operator,
								remark: this.remark
							})
							
							uni.hideLoading()
							
							if (result.success) {
								uni.showToast({
									title: '提交成功',
									icon: 'success'
								})
								
								setTimeout(() => {
									uni.navigateBack()
								}, 1500)
							} else {
								throw new Error(result.message || '提交失败')
							}
						} catch (err) {
							uni.hideLoading()
							uni.showToast({
								title: err.message || '提交失败',
								icon: 'none'
							})
						}
					}
				}
			})
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
	padding-bottom: 150rpx;
}

/* 医疗表头 */
.medical-header {
	background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
	padding: 50rpx 40rpx;
	position: relative;
	overflow: hidden;
}

.header-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-image: 
		repeating-linear-gradient(45deg, transparent, transparent 35rpx, rgba(255,255,255,0.05) 35rpx, rgba(255,255,255,0.05) 70rpx);
}

.header-content {
	position: relative;
	z-index: 1;
	text-align: center;
}

.clinic-name {
	display: block;
	font-size: 36rpx;
	font-weight: bold;
	color: #ffffff;
	margin-bottom: 12rpx;
	text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.2);
}

.doc-type {
	display: block;
	font-size: 42rpx;
	font-weight: 800;
	color: #ffffff;
	margin-bottom: 8rpx;
	text-shadow: 0 2rpx 12rpx rgba(0,0,0,0.25);
	letter-spacing: 4rpx;
}

.doc-type-en {
	display: block;
	font-size: 20rpx;
	color: rgba(255,255,255,0.85);
	font-weight: 600;
	letter-spacing: 3rpx;
}

/* 信息卡片 */
.info-card,
.drugs-card,
.remark-card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin: 30rpx 30rpx 25rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
	border: 1rpx solid #f1f5f9;
}

.card-title {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 25rpx;
	padding-bottom: 20rpx;
	border-bottom: 2rpx solid #f1f5f9;
}

.title-icon {
	font-size: 32rpx;
}

.title-text {
	flex: 1;
	font-size: 32rpx;
	font-weight: bold;
	color: #2c3e50;
}

.title-count {
	font-size: 24rpx;
	color: #94a3b8;
	padding: 6rpx 16rpx;
	background: #f8fafc;
	border-radius: 12rpx;
}

/* 表单网格 */
.form-grid {
	display: flex;
	flex-direction: column;
	gap: 25rpx;
}

.form-item {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.form-item.full {
	grid-column: 1 / -1;
}

.form-label {
	font-size: 26rpx;
	color: #64748b;
	font-weight: 500;
}

/* 日期选择器 */
.picker-input {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 25rpx;
	background: #f8fafc;
	border: 2rpx solid #e2e8f0;
	border-radius: 50rpx;
	transition: all 0.3s;
}

.picker-value {
	font-size: 28rpx;
	color: #2c3e50;
	font-weight: 500;
}

.picker-icon {
	font-size: 28rpx;
}

/* 园区选择器 */
.location-selector {
	display: flex;
	gap: 15rpx;
}

.location-option {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	padding: 20rpx;
	background: #f8fafc;
	border: 2rpx solid #e2e8f0;
	border-radius: 16rpx;
	transition: all 0.3s;
}

.location-option.active.land {
	background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
	border-color: #10b981;
}

.location-option.active.water {
	background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
	border-color: #3b82f6;
}

.loc-icon {
	font-size: 28rpx;
}

.loc-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #64748b;
}

.location-option.active.land .loc-name {
	color: #065f46;
}

.location-option.active.water .loc-name {
	color: #1e40af;
}

.loc-check {
	font-size: 24rpx;
	color: #10b981;
	font-weight: bold;
}

/* 自动值显示 */
.auto-value {
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 20rpx 25rpx;
	background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
	border-radius: 16rpx;
}

.auto-icon {
	font-size: 28rpx;
}

.auto-text {
	flex: 1;
	font-size: 28rpx;
	color: #2c3e50;
	font-weight: 600;
}

.auto-badge {
	font-size: 20rpx;
	color: #667eea;
	padding: 4rpx 12rpx;
	background: rgba(102, 126, 234, 0.1);
	border-radius: 10rpx;
	font-weight: 600;
}

/* 添加按钮 */
.add-actions {
	display: flex;
	gap: 15rpx;
	margin-bottom: 25rpx;
}

.add-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	padding: 22rpx 30rpx;
	border-radius: 50rpx;
	transition: all 0.3s;
}

.add-btn:active {
	transform: scale(0.97);
}

.add-btn.primary {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

.add-btn.success {
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.3);
}

.btn-icon {
	font-size: 28rpx;
	color: #ffffff;
}

.btn-text {
	font-size: 28rpx;
	color: #ffffff;
	font-weight: 600;
}

/* 药材列表 */
.drug-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.drug-item {
	background: #f8fafc;
	border-radius: 16rpx;
	padding: 25rpx;
	border-left: 4rpx solid #14b8a6;
}

.drug-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.drug-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #2c3e50;
}

.drug-delete {
	width: 44rpx;
	height: 44rpx;
	background: #fee2e2;
	border-radius: 50%;
	color: #ef4444;
	font-size: 24rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
}

.drug-info-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 15rpx;
	margin-bottom: 20rpx;
}

.info-cell {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.cell-label {
	font-size: 22rpx;
	color: #94a3b8;
}

.cell-value {
	font-size: 24rpx;
	color: #2c3e50;
	font-weight: 500;
}

.cell-value.mono {
	font-family: 'DIN Alternate', 'Courier New', monospace;
}

/* 数量输入 */
.quantity-input {
	background: #ffffff;
	border-radius: 12rpx;
	padding: 20rpx;
}

.quantity-label {
	display: block;
	font-size: 24rpx;
	color: #64748b;
	margin-bottom: 15rpx;
}

.quantity-control {
	display: flex;
	align-items: center;
	gap: 15rpx;
}

.control-btn {
	width: 50rpx;
	height: 50rpx;
	background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
	border-radius: 50%;
	color: #ffffff;
	font-size: 32rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(20, 184, 166, 0.3);
}

.control-btn:active {
	transform: scale(0.9);
}

.quantity-value {
	flex: 1;
	text-align: center;
	font-size: 36rpx;
	font-weight: bold;
	color: #2c3e50;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
}

.quantity-unit {
	font-size: 24rpx;
	color: #94a3b8;
	min-width: 60rpx;
}

/* 空状态 */
.empty-drugs {
	padding: 80rpx 40rpx;
	text-align: center;
}

.empty-icon {
	display: block;
	font-size: 80rpx;
	margin-bottom: 20rpx;
	opacity: 0.3;
}

.empty-text {
	font-size: 26rpx;
	color: #94a3b8;
}

/* 备注 */
.remark-textarea {
	width: 100%;
	min-height: 150rpx;
	padding: 20rpx;
	background: #f8fafc;
	border: 2rpx solid #e2e8f0;
	border-radius: 12rpx;
	font-size: 26rpx;
	color: #2c3e50;
}

/* 底部操作栏 */
.action-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #ffffff;
	padding: 25rpx 30rpx;
	box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.08);
	display: flex;
	gap: 20rpx;
	z-index: 100;
}

.action-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	padding: 22rpx 30rpx;
	border-radius: 50rpx;
	font-weight: 600;
	transition: all 0.3s;
}

.action-btn:active {
	transform: scale(0.97);
}

.btn-cancel {
	background: #ffffff;
	border: 2rpx solid #cbd5e1;
}

.btn-cancel .btn-text {
	color: #64748b;
	font-size: 30rpx;
}

.btn-submit {
	background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
	box-shadow: 0 4rpx 12rpx rgba(20, 184, 166, 0.3);
}

.btn-submit .btn-icon,
.btn-submit .btn-text {
	color: #ffffff;
	font-size: 30rpx;
}
</style>
