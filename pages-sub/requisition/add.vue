<template>
	<view class="container">
		<!-- 表头 -->
		<view class="page-header">
			<view class="page-title">爱康医务室管理系统</view>
			<view class="page-subtitle">北京欢乐谷医务室 · 药材请领单</view>
		</view>
		
		<!-- 基本信息 -->
		<view class="form-section">
			<view class="section-title">基本信息</view>
			<view class="form-item">
				<text class="form-label">请领单号</text>
				<text class="form-value">{{ recordNo || '自动生成' }}</text>
			</view>
			<view class="form-item">
				<text class="form-label">请领时间</text>
				<text class="form-value">{{ currentTime }}</text>
			</view>
			<view class="form-item">
				<text class="form-label">请领人</text>
				<text class="form-value">{{ requisitioner }}</text>
			</view>
			
			<!-- 请领部门/园区 -->
			<view class="form-item">
				<text class="form-label">请领部门 *</text>
				<picker 
					:range="departments" 
					range-key="label"
					:value="departmentIndex"
					@change="onDepartmentChange"
				>
					<view class="picker-input">
						{{ currentDepartment.label }}
						<text class="picker-arrow">›</text>
					</view>
				</picker>
			</view>
			
			<!-- 用途说明 -->
			<view class="form-item column">
				<text class="form-label">用途说明 *</text>
				<textarea 
					class="form-textarea" 
					v-model="purpose" 
					placeholder="请输入药材用途说明（必填）"
					maxlength="200"
				></textarea>
				<text class="char-count">{{ purpose.length }}/200</text>
			</view>
		</view>
		
		<!-- 药材明细 -->
		<view class="form-section">
			<view class="section-title">
				药材明细
				<text class="section-count">({{ drugList.length }}种)</text>
			</view>
			
		<!-- 添加药材按钮 -->
			<view class="action-buttons">
			<u-button
				text="📋 选择药材"
				size="medium"
				type="primary"
				@click="goSelectDrug"
			></u-button>
			</view>
			
			<!-- 药材列表 -->
			<view class="drug-list">
				<view 
					v-for="(item, index) in drugList" 
					:key="index" 
					class="drug-item"
				>
					<!-- 高值/急救药材标记 -->
					<view class="drug-badges">
						<view v-if="item.isHighValue" class="badge high-value">高值</view>
						<view v-if="item.isEmergency" class="badge emergency">急救</view>
					</view>
					
					<view class="drug-header">
						<view class="drug-name">{{ item.drugName }}</view>
						<view class="drug-delete" @click="deleteDrug(index)">删除</view>
					</view>
					
					<view class="drug-info">
						<view class="info-row">
							<text class="info-label">规格：</text>
							<text>{{ item.spec }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">单位：</text>
							<text>{{ item.unit }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">厂家：</text>
							<text>{{ item.manufacturer || '未知' }}</text>
						</view>
					</view>
					
					<view class="drug-input-section">
						<!-- 请领数量 -->
						<view class="input-row">
							<text class="input-label">请领数量 *</text>
							<input 
								class="input-field" 
								v-model.number="item.quantity" 
								type="number"
								placeholder="请输入数量"
							/>
							<text class="input-unit">{{ item.unit }}</text>
						</view>
					</view>
				</view>
				
				<!-- 空状态 -->
				<view v-if="drugList.length === 0" class="empty-hint">
				<text>💊 暂无药材，请点击上方按钮添加</text>
				</view>
			</view>
		</view>
		
		<!-- 签名区域 -->
		<view class="form-section">
			<view class="section-title">请领人签名 *</view>
			<signature 
				v-model="requisitionerSign"
				title="请领人签名"
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
				text="提交审批"
				@click="submitReview"
			></u-button>
		</view>
		
	</view>
</template>

<script>
import Signature from '@/components/signature/index.vue'
import Common from '@/utils/common.js'

export default {
	components: {
		Signature
	},
	
	data() {
		return {
			recordNo: '',
			currentTime: '',
			requisitioner: '',
			purpose: '',
			departmentIndex: 0,
			departments: [
				{ label: '陆园', value: 'land_park' },
				{ label: '水园', value: 'water_park' },
				{ label: '办公区', value: 'office' },
				{ label: '其他', value: 'other' }
			],
			currentDepartment: { label: '陆园', value: 'land_park' },
			drugList: [],
		requisitionerSign: ''
		}
	},
	
	onLoad() {
		this.initPage()
		// 监听药材选择事件
		uni.$on('drugSelected', this.onDrugSelect)
	},
	
	onUnload() {
		// 移除事件监听
		uni.$off('drugSelected', this.onDrugSelect)
	},
	
	methods: {
		initPage() {
			// 生成请领单号
			this.recordNo = Common.generateRecordNo('QL')
			
			// 当前时间
			this.currentTime = Common.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
			
			// 获取当前用户
			const userInfo = uni.getStorageSync('userInfo')
			this.requisitioner = userInfo?.name || '未登录'
		},
		
		onDepartmentChange(e) {
			this.departmentIndex = e.detail.value
			this.currentDepartment = this.departments[this.departmentIndex]
		},
		
		goSelectDrug() {
			uni.navigateTo({
				url: '/pages-sub/drug/list?mode=select'
			})
		},
		
		onDrugSelect(drug) {
			this.addDrug(drug)
		},
		
		// 添加药材到列表
		addDrug(drugInfo) {
			// 检查是否已添加
			const exists = this.drugList.some(item => item.drugId === drugInfo._id)
			if (exists) {
				uni.showToast({
					title: '该药材已添加',
					icon: 'none'
				})
				return
			}
			
			// 添加到列表
			this.drugList.push({
				drugId: drugInfo._id,
				drugName: drugInfo.name || drugInfo.drugName,
				spec: drugInfo.spec || drugInfo.specification,
				unit: drugInfo.unit || drugInfo.packUnit,
				manufacturer: drugInfo.manufacturer,
				isHighValue: drugInfo.isHighValue || false,
				isEmergency: drugInfo.isEmergency || false,
				quantity: ''
			})
			
			uni.showToast({
				title: '添加成功',
				icon: 'success'
			})
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
			// 验证用途说明
			if (!this.purpose || this.purpose.trim() === '') {
				uni.showToast({
					title: '请填写用途说明',
					icon: 'none'
				})
				return false
			}
			
			// 验证药材列表
			if (this.drugList.length === 0) {
				uni.showToast({
					title: '请添加药材',
					icon: 'none'
				})
				return false
			}
			
			// 验证每个药材的数量
			for (let i = 0; i < this.drugList.length; i++) {
				const item = this.drugList[i]
				if (!item.quantity || item.quantity <= 0) {
					uni.showToast({
						title: `${item.drugName} 数量未填写或无效`,
						icon: 'none'
					})
					return false
				}
			}
			
			// 验证签名
			if (!this.requisitionerSign) {
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
					title: '请先添加药材',
					icon: 'none'
				})
				return
			}
			
			uni.showLoading({
				title: '保存中...'
			})
			
			try {
				const result = await this.$api.callFunction('requisitionRecords', {
					action: 'add',
					recordNo: this.recordNo,
					location: this.currentDepartment.value,
					requisitioner: this.requisitioner,
					department: this.currentDepartment.label,
					purpose: this.purpose,
					drugList: this.drugList,
					status: 'draft',
					createTime: new Date()
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
				const result = await this.$api.callFunction('requisitionRecords', {
					action: 'add',
					recordNo: this.recordNo,
					location: this.currentDepartment.value,
					requisitioner: this.requisitioner,
					department: this.currentDepartment.label,
					purpose: this.purpose,
					drugList: this.drugList,
					requisitionerSign: this.requisitionerSign,
					status: 'pending_review',  // 待审批状态
					createTime: new Date()
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
	background: linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%);
	padding: 40rpx;
	border-radius: 20rpx;
	text-align: center;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(156, 39, 176, 0.3);
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

.form-item.column {
	flex-direction: column;
	align-items: flex-start;
}

.form-item:last-child {
	border-bottom: none;
}

.form-label {
	font-size: 28rpx;
	color: #666666;
	min-width: 180rpx;
	margin-bottom: 10rpx;
}

.form-value {
	font-size: 28rpx;
	color: #333333;
	flex: 1;
}

.form-input {
	flex: 1;
	height: 60rpx;
	padding: 0 20rpx;
	background-color: #F5F5F5;
	border-radius: 10rpx;
	font-size: 28rpx;
}

.form-textarea {
	width: 100%;
	min-height: 150rpx;
	padding: 20rpx;
	background-color: #F5F5F5;
	border-radius: 10rpx;
	font-size: 28rpx;
	line-height: 40rpx;
}

.char-count {
	align-self: flex-end;
	margin-top: 10rpx;
	font-size: 24rpx;
	color: #999999;
}

.picker-input {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 28rpx;
	color: #333333;
}

.picker-arrow {
	font-size: 36rpx;
	color: #999999;
}

.action-buttons {
	display: flex;
	gap: 20rpx;
	margin-bottom: 25rpx;
}

.drug-list {
	margin-top: 20rpx;
}

.drug-item {
	position: relative;
	background-color: #F8F9FA;
	border: 2rpx solid #E8E8E8;
	border-radius: 15rpx;
	padding: 25rpx;
	margin-bottom: 20rpx;
}

.drug-badges {
	position: absolute;
	top: -10rpx;
	right: 20rpx;
	display: flex;
	gap: 10rpx;
	z-index: 1;
}

.badge {
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	font-size: 22rpx;
	color: #FFFFFF;
}

.badge.high-value {
	background-color: #FF9800;
}

.badge.emergency {
	background-color: #F44336;
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
	flex: 1;
}

.drug-delete {
	font-size: 26rpx;
	color: #FF5722;
	padding: 5rpx 15rpx;
}

.drug-info {
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1px dashed #E0E0E0;
}

.info-row {
	display: flex;
	font-size: 26rpx;
	line-height: 40rpx;
	color: #666666;
}

.info-label {
	color: #999999;
	min-width: 100rpx;
}

.drug-input-section {
	margin-top: 15rpx;
}

.input-row {
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
}

.input-label {
	font-size: 26rpx;
	color: #666666;
	min-width: 160rpx;
}

.input-field {
	flex: 1;
	height: 60rpx;
	padding: 0 20rpx;
	background-color: #FFFFFF;
	border: 1px solid #E0E0E0;
	border-radius: 10rpx;
	font-size: 28rpx;
}

.input-unit {
	font-size: 26rpx;
	color: #999999;
	margin-left: 15rpx;
	min-width: 60rpx;
}

.empty-hint {
	text-align: center;
	padding: 60rpx 0;
	color: #999999;
	font-size: 28rpx;
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	gap: 20rpx;
	padding: 20rpx 30rpx;
	background-color: #FFFFFF;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	z-index: 100;
}

.bottom-actions button {
	flex: 1;
}
</style>
