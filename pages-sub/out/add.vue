<template>
	<view class="container">
		<!-- 表头 -->
		<view class="page-header">
			<view class="page-title">爱康医务室管理系统</view>
			<view class="page-subtitle">北京欢乐谷医务室 · 药品出库单</view>
		</view>
		
		<!-- 基本信息 -->
		<view class="form-section">
			<view class="section-title">基本信息</view>
			<view class="form-item">
				<text class="form-label">出库单号</text>
				<text class="form-value">{{ recordNo || '自动生成' }}</text>
			</view>
			<view class="form-item">
				<text class="form-label">出库时间</text>
				<text class="form-value">{{ currentTime }}</text>
			</view>
			<view class="form-item">
				<text class="form-label">发放人</text>
				<text class="form-value">{{ dispenser }}</text>
			</view>
			
			<!-- 园区选择 -->
			<view class="form-item">
				<text class="form-label">出库园区 *</text>
				<picker 
					:range="locations" 
					range-key="label"
					:value="locationIndex"
					@change="onLocationChange"
				>
					<view class="picker-input">
						{{ currentLocation.label }}
						<text class="picker-arrow">›</text>
					</view>
				</picker>
			</view>
			
			<view class="form-item">
				<text class="form-label">备注（选填）</text>
				<input 
					class="form-input" 
					v-model="remark" 
					placeholder="请输入备注"
				/>
			</view>
		</view>
		
		<!-- 药品明细 -->
		<view class="form-section">
			<view class="section-title">
				药品明细
				<text class="section-count">({{ drugList.length }}种)</text>
			</view>
			
		<!-- 添加药品按钮 -->
		<view class="action-buttons">
			<u-button
				text="➕ 添加药品"
				type="primary"
				@click="goSelectDrug"
			></u-button>
		</view>
			
			<!-- 药品列表 -->
			<view class="drug-list">
				<view 
					v-for="(item, index) in drugList" 
					:key="index" 
					class="drug-item"
				>
					<!-- 高值药品标记 -->
					<view v-if="item.isHighValue" class="high-value-badge">
						<text>高值药品</text>
					</view>
					
					<view class="drug-header">
						<view class="drug-name">{{ item.drugName }}</view>
						<view class="drug-delete" @click="deleteDrug(index)">删除</view>
					</view>
					
					<view class="drug-info">
						<view v-if="item.drugCode" class="info-row">
							<text class="info-label">代码：</text>
							<text class="code-badge">{{ item.drugCode }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">规格：</text>
							<text>{{ item.specification || item.spec }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">单位：</text>
							<text>{{ item.unit }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">厂家：</text>
							<text>{{ item.manufacturer }}</text>
						</view>
					</view>
					
					<view class="drug-input-section">
						<!-- 批次选择 -->
						<view class="input-row">
							<text class="input-label">选择批次 *</text>
							<batch-selector
								:button-text="item.batch ? `批号: ${item.batch}` : '点击选择'"
								button-type="info"
								button-size="small"
								:drug-id="item.drugId"
								:drug-info="{ name: item.drugName, specification: item.specification || item.spec, unit: item.unit }"
								:show-location-filter="false"
								:default-location="currentLocation.value"
								:enable-f-i-f-o="true"
								@select="(batch) => onBatchSelect(index, batch)"
							></batch-selector>
						</view>
						
						<!-- 显示选中批次信息 -->
						<view v-if="item.batch" class="batch-info-display">
							<view class="batch-detail-row">
								<text class="batch-label">有效期：</text>
								<text :class="['batch-value', { 'text-warning': item.isNearExpiry }]">
									{{ item.expireDate }}
								</text>
							</view>
							<view class="batch-detail-row">
								<text class="batch-label">库存：</text>
								<text class="batch-value">{{ item.stockQuantity }} {{ item.unit }}</text>
							</view>
							<view v-if="item.price" class="batch-detail-row">
								<text class="batch-label">单价：</text>
								<text class="batch-value">¥{{ item.price }}</text>
							</view>
						</view>
						
						<!-- 出库数量 -->
						<view class="input-row">
							<text class="input-label">出库数量 *</text>
							<input 
								class="input-field" 
								v-model.number="item.quantity" 
								type="number"
								:placeholder="`最多${item.stockQuantity || 0}`"
								@blur="validateQuantity(index)"
							/>
							<text class="input-unit">{{ item.unit }}</text>
						</view>
					
					<!-- 单位转换提示 -->
					<view v-if="item.quantity && item.conversionRate && item.conversionRate > 1" class="convert-hint">
						<text class="hint-icon">🔄</text>
						<text class="hint-text">
							将转换为 {{ (item.quantity * item.conversionRate).toFixed(2) }} {{ item.minUnit }} 存入{{ currentLocation.label }}
						</text>
					</view>
						
						<!-- 高值药品金额提示 -->
						<view v-if="item.isHighValue && item.quantity && item.price" class="amount-hint">
							<text class="amount-label">金额：</text>
							<text class="amount-value">¥{{ (item.quantity * item.price).toFixed(2) }}</text>
						</view>
					</view>
				</view>
				
				<!-- 空状态 -->
				<view v-if="drugList.length === 0" class="empty-hint">
			<text>💊 暂无药品，请点击上方按钮添加</text>
				</view>
			</view>
		</view>
		
		<!-- 签名区域 -->
		<view class="form-section">
			<view class="section-title">发放人签名 *</view>
			<signature 
				v-model="dispenserSign"
				title="发放人签名"
			></signature>
		</view>
		
		<!-- 底部按钮 -->
		<view class="bottom-actions">
			<u-button 
				type="info" 
				text="保存草稿"
				plain
				@click="saveDraft"
			></u-button>
			<u-button 
				type="primary" 
				text="提交复核"
				@click="submitReview"
			></u-button>
		</view>
	</view>
</template>

<script>
import Signature from '@/components/signature/index.vue'
import BatchSelector from '@/components/batch-selector/index.vue'
import Common from '@/utils/common.js'

export default {
	components: {
		Signature,
		BatchSelector
	},
	
	data() {
		return {
			recordNo: '',
			currentTime: '',
			dispenser: '',
			remark: '',
		locationIndex: 0,
		locations: [
			{ label: '陆园', value: 'land_park' },
			{ label: '水园', value: 'water_park' }
		],
		currentLocation: { label: '陆园', value: 'land_park' },
			drugList: [],
			dispenserSign: ''
		}
	},
	
	onLoad() {
		this.initPage()
		// 监听药品选择事件
		uni.$on('drugSelected', this.onDrugSelect)
	},
	
	onUnload() {
		// 移除事件监听
		uni.$off('drugSelected', this.onDrugSelect)
	},
	
	methods: {
		initPage() {
			// 生成出库单号
			this.recordNo = Common.generateRecordNo('CK')
			
			// 当前时间
			this.currentTime = Common.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
			
			// 获取当前用户
			const userInfo = uni.getStorageSync('userInfo')
			this.dispenser = userInfo?.name || '未登录'
		},
		
	onLocationChange(e) {
		this.locationIndex = e.detail.value
		this.currentLocation = this.locations[this.locationIndex]
	},
	
	goSelectDrug() {
		uni.navigateTo({
			url: '/pages-sub/drug/list?mode=select'
		})
	},
	
	onDrugSelect(drug) {
		console.log('选择药品:', drug)
		this.addDrug(drug)
	},
		
		addDrug(drugInfo) {
			// 检查是否已添加
			const exists = this.drugList.some(item => item.drugId === drugInfo._id)
			if (exists) {
				uni.showToast({
					title: '该药品已添加',
					icon: 'none'
				})
				return
			}
			
			// 添加到列表
			this.drugList.push({
				drugId: drugInfo._id,
				drugCode: drugInfo.drugCode || drugInfo.code || '',  // 药品代码
				drugName: drugInfo.name,
				specification: drugInfo.specification || drugInfo.spec || '',  // 统一使用 specification
				unit: drugInfo.unit,
				manufacturer: drugInfo.manufacturer,
				isHighValue: drugInfo.isHighValue || false,
				isEmergency: drugInfo.isEmergency || false,
				batch: '',
				batchId: '',
				expireDate: '',
				quantity: '',
				stockQuantity: 0,
				price: '',
				isNearExpiry: false
			})
			
			uni.showToast({
				title: '添加成功',
				icon: 'success'
			})
		},
		
		onBatchSelect(index, batch) {
			console.log('选择批次:', batch)
			
			// 更新药品批次信息
			this.drugList[index] = {
				...this.drugList[index],
				batchId: batch._id,
				batch: batch.batch,
				expireDate: batch.expireDate,
				stockQuantity: batch.quantity,
				price: batch.price || '',
				isNearExpiry: batch.isNearExpiry || false
			}
		},
		
		validateQuantity(index) {
			const item = this.drugList[index]
			
			if (!item.quantity) return
			
			// 检查是否超过库存
			if (item.quantity > item.stockQuantity) {
				uni.showModal({
					title: '数量超限',
					content: `出库数量不能超过库存数量（${item.stockQuantity}${item.unit}）`,
					showCancel: false
				})
				item.quantity = item.stockQuantity
			}
			
			// 高值药品二次确认
			if (item.isHighValue && item.price) {
				const totalAmount = (item.quantity * item.price).toFixed(2)
				uni.showModal({
					title: '高值药品确认',
					content: `${item.drugName}\n数量：${item.quantity}${item.unit}\n金额：¥${totalAmount}`,
					confirmText: '确认',
					cancelText: '取消',
					success: (res) => {
						if (!res.confirm) {
							item.quantity = ''
						}
					}
				})
			}
		},
		
		deleteDrug(index) {
			uni.showModal({
				title: '确认删除',
				content: `确定要删除 ${this.drugList[index].drugName} 吗？`,
				success: (res) => {
					if (res.confirm) {
						this.drugList.splice(index, 1)
					}
				}
			})
		},
		
		validateForm() {
			// 验证药品列表
			if (this.drugList.length === 0) {
				uni.showToast({
					title: '请添加药品',
					icon: 'none'
				})
				return false
			}
			
			// 验证每个药品的必填字段
			for (let i = 0; i < this.drugList.length; i++) {
				const item = this.drugList[i]
				
				if (!item.batch) {
					uni.showToast({
						title: `${item.drugName} 未选择批次`,
						icon: 'none'
					})
					return false
				}
				
				if (!item.quantity || item.quantity <= 0) {
					uni.showToast({
						title: `${item.drugName} 数量未填写或无效`,
						icon: 'none'
					})
					return false
				}
				
				if (item.quantity > item.stockQuantity) {
					uni.showToast({
						title: `${item.drugName} 数量超过库存`,
						icon: 'none'
					})
					return false
				}
			}
			
			// 验证签名
			if (!this.dispenserSign) {
				uni.showToast({
					title: '请先签名',
					icon: 'none'
				})
				return false
			}
			
			return true
		},
		
	async saveDraft() {
		if (this.drugList.length === 0) {
			uni.showToast({
				title: '请先添加药品',
				icon: 'none'
			})
			return
		}
		
		uni.showLoading({
			title: '保存中...'
		})
		
		try {
			const userInfo = uni.getStorageSync('userInfo')
			const result = await this.$api.callFunction('outRecords', {
				action: 'create',
				data: {
					recordNo: this.recordNo,
					location: this.currentLocation.value,
					locationName: this.currentLocation.label,
					dispenser: this.dispenser,
					dispenserId: userInfo?._id || '',
					dispenserSign: '',
					dispenserSignTime: '',
					remark: this.remark,
					items: this.drugList.map(drug => ({
						drugId: drug.drugId,
						drugCode: drug.drugCode || '',  // 药品代码
						drugName: drug.drugName,
						specification: drug.specification || drug.spec || '',  // 统一使用 specification
						unit: drug.unit,
						manufacturer: drug.manufacturer,
						batch: drug.batch,
						batchId: drug.batchId,
						expireDate: drug.expireDate,
						quantity: drug.quantity,
						price: drug.price || 0,
						isHighValue: drug.isHighValue || false,
						isEmergency: drug.isEmergency || false
					})),
					status: 'draft'
				}
			})
			
			uni.hideLoading()
			
			if (result.success) {
				uni.showToast({
					title: '草稿已保存',
					icon: 'success'
				})
			} else {
				throw new Error(result.message || '保存失败')
			}
		} catch (err) {
			console.error('保存失败:', err)
			uni.hideLoading()
			uni.showToast({
				title: err.message || '保存失败',
				icon: 'none'
			})
		}
	},
		
	async submitReview() {
		// 验证表单
		if (!this.validateForm()) {
			return
		}
		
		uni.showLoading({
			title: '提交中...'
		})
		
		try {
			const userInfo = uni.getStorageSync('userInfo')
			// 提交出库单到云数据库
			const result = await this.$api.callFunction('outRecords', {
				action: 'create',
				data: {
					recordNo: this.recordNo,
					location: this.currentLocation.value,
					locationName: this.currentLocation.label,
					dispenser: this.dispenser,
					dispenserId: userInfo?._id || '',
					dispenserSign: this.dispenserSign,
					dispenserSignTime: new Date(),
					remark: this.remark,
					items: this.drugList.map(drug => ({
						drugId: drug.drugId,
						drugCode: drug.drugCode || '',  // 药品代码
						drugName: drug.drugName,
						specification: drug.specification || drug.spec || '',  // 统一使用 specification
						unit: drug.unit,
						manufacturer: drug.manufacturer,
						batch: drug.batch,
						batchId: drug.batchId,
						expireDate: drug.expireDate,
						quantity: drug.quantity,
						price: drug.price || 0,
						isHighValue: drug.isHighValue || false,
						isEmergency: drug.isEmergency || false
					})),
					status: 'pending_review'  // 待复核状态
				}
			})
			
			uni.hideLoading()
			
			if (result.success) {
				uni.showToast({
					title: '提交成功',
					icon: 'success'
				})
				
				// 返回列表页
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			} else {
				throw new Error(result.message || '提交失败')
			}
			
		} catch (err) {
			console.error('提交失败:', err)
			uni.hideLoading()
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
.container {
	padding: 20rpx;
	padding-bottom: 150rpx;
	background-color: #F8F8F8;
	min-height: 100vh;
}

.page-header {
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
	padding: 40rpx;
	border-radius: 20rpx;
	text-align: center;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(255, 107, 107, 0.3);
}

.page-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #FFFFFF;
	margin-bottom: 10rpx;
}

.page-subtitle {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.9);
}

.form-section {
	background-color: #FFFFFF;
	padding: 30rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 25rpx;
	display: flex;
	align-items: center;
}

.section-count {
	font-size: 26rpx;
	color: #999999;
	margin-left: 10rpx;
	font-weight: normal;
}

.form-item {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1px solid #F8F8F8;
}

.form-item:last-child {
	border-bottom: none;
}

.form-label {
	font-size: 28rpx;
	color: #666666;
	min-width: 180rpx;
}

.form-value {
	font-size: 28rpx;
	color: #333333;
	flex: 1;
}

.form-input {
	flex: 1;
	font-size: 28rpx;
	color: #333333;
}

.picker-input {
	flex: 1;
	font-size: 28rpx;
	color: #333333;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.picker-arrow {
	font-size: 32rpx;
	color: #999999;
}

.action-buttons {
	display: flex;
	gap: 15rpx;
	margin-bottom: 25rpx;
}

.drug-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.drug-item {
	background-color: #F8F8F8;
	padding: 25rpx;
	border-radius: 15rpx;
	position: relative;
}

.high-value-badge {
	position: absolute;
	top: -8rpx;
	right: 20rpx;
	background-color: #FF9800;
	color: #FFFFFF;
	font-size: 20rpx;
	padding: 4rpx 15rpx;
	border-radius: 15rpx;
	z-index: 10;
}

.drug-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
}

.drug-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

.drug-delete {
	font-size: 26rpx;
	color: #FF6B6B;
}

.drug-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1px solid #E0E0E0;
}

.info-row {
	font-size: 26rpx;
	color: #666666;
}

.info-label {
	color: #999999;
}

.drug-input-section {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.input-row {
	display: flex;
	align-items: center;
}

.input-label {
	font-size: 26rpx;
	color: #666666;
	min-width: 160rpx;
}

.input-field {
	flex: 1;
	background-color: #FFFFFF;
	padding: 15rpx 20rpx;
	border-radius: 10rpx;
	font-size: 26rpx;
}

.input-unit {
	font-size: 24rpx;
	color: #999999;
	margin-left: 10rpx;
	min-width: 50rpx;
}

.batch-info-display {
	background-color: #E8F5E9;
	padding: 15rpx 20rpx;
	border-radius: 10rpx;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.batch-detail-row {
	display: flex;
	font-size: 24rpx;
}

.batch-label {
	color: #666666;
	min-width: 100rpx;
}

.batch-value {
	color: #333333;
	flex: 1;
}

.text-warning {
	color: #FF9800 !important;
	font-weight: bold;
}

// 单位转换提示
.convert-hint {
	background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
	padding: 16rpx 20rpx;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	margin-top: 12rpx;
	border-left: 4rpx solid #2196F3;
	
	.hint-icon {
		font-size: 24rpx;
		margin-right: 10rpx;
	}
	
	.hint-text {
		font-size: 24rpx;
		color: #1976D2;
		line-height: 1.6;
		flex: 1;
	}
}

.amount-hint {
	background-color: #FFF3E0;
	padding: 15rpx 20rpx;
	border-radius: 10rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 12rpx;
}

.amount-label {
	font-size: 26rpx;
	color: #666666;
}

.amount-value {
	font-size: 30rpx;
	font-weight: bold;
	color: #FF9800;
}

.empty-hint {
	text-align: center;
	padding: 60rpx 0;
	font-size: 26rpx;
	color: #999999;
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #FFFFFF;
	padding: 20rpx;
	display: flex;
	gap: 20rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}
</style>

