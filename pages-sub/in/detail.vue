<template>
	<view class="page">
		<!-- 专业医疗表头 -->
		<view class="medical-header">
			<view class="header-bg"></view>
			<view class="header-content">
				<text class="clinic-name">爱康医务室管理系统</text>
				<text class="doc-type">北京欢乐谷医务室 · 药品入库单</text>
				<text class="doc-type-en">DRUG RECEIPT FORM</text>
			</view>
		</view>
		
		<!-- 状态流程指示器 -->
		<view class="status-flow">
			<view class="flow-item" :class="record.status !== 'draft' ? 'completed' : 'current'">
				<view class="flow-dot"></view>
				<text class="flow-text">创建</text>
			</view>
			<view class="flow-line" :class="record.status !== 'draft' ? 'completed' : ''"></view>
			<view class="flow-item" :class="record.status === 'completed' ? 'completed' : (record.status === 'pending_review' ? 'current' : '')">
				<view class="flow-dot"></view>
				<text class="flow-text">复核</text>
			</view>
			<view class="flow-line" :class="record.status === 'completed' ? 'completed' : ''"></view>
			<view class="flow-item" :class="record.status === 'completed' ? 'completed' : ''">
				<view class="flow-dot"></view>
				<text class="flow-text">完成</text>
			</view>
		</view>
		
		<!-- 状态徽章 -->
		<view class="status-badge-large" :class="'badge-' + record.status">
			<text class="badge-icon">{{ getStatusIcon(record.status) }}</text>
			<text class="badge-text">{{ getStatusText(record.status) }}</text>
		</view>
		
		<!-- 基本信息卡片 -->
		<view class="info-card">
			<view class="card-title">
				<text class="title-icon">📋</text>
				<text class="title-text">基本信息</text>
			</view>
			<view class="info-grid">
				<view class="grid-item">
					<text class="item-label">单号</text>
					<text class="item-value mono">{{ record.recordNo }}</text>
				</view>
				<view class="grid-item">
					<text class="item-label">创建时间</text>
					<text class="item-value">{{ record.createTime }}</text>
				</view>
				<view class="grid-item">
					<text class="item-label">操作人</text>
					<text class="item-value">{{ record.operator }}</text>
				</view>
				<view class="grid-item" v-if="record.supplier">
					<text class="item-label">供应商</text>
					<text class="item-value">{{ record.supplier }}</text>
				</view>
			</view>
		</view>
		
		<!-- 药品明细卡片 -->
		<view class="info-card">
			<view class="card-title">
				<text class="title-icon">💊</text>
				<text class="title-text">药品明细</text>
				<text class="title-count">{{ record.items ? record.items.length : 0 }}种</text>
			</view>
			<view class="drug-list">
				<view 
					v-for="(item, index) in record.items" 
					:key="index"
					class="drug-item-card"
				>
					<view class="drug-header">
						<view class="drug-name-wrapper">
							<text class="drug-name">{{ item.drugName }}</text>
							<text class="drug-spec">{{ item.spec }}</text>
						</view>
						<view class="drug-quantity-badge">
							<text class="quantity-num">{{ item.quantity }}</text>
							<text class="quantity-unit">{{ item.unit }}</text>
						</view>
					</view>
					<view class="drug-details-grid">
						<view class="detail-item">
							<text class="detail-label">批号</text>
							<text class="detail-value mono">{{ item.batch }}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">有效期</text>
							<text class="detail-value">{{ item.expireDate }}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">生产日期</text>
							<text class="detail-value">{{ item.productionDate }}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">生产厂家</text>
							<text class="detail-value">{{ item.manufacturer }}</text>
						</view>
						<view class="detail-item" v-if="item.price">
							<text class="detail-label">单价</text>
							<text class="detail-value price">¥{{ item.price }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 签名区域 -->
		<view class="signature-section">
			<!-- 操作员签名 -->
			<view class="signature-card">
				<view class="signature-header">
					<text class="sig-icon">✍️</text>
					<text class="sig-title">操作员签名</text>
					<text class="sig-name">{{ record.operator }}</text>
				</view>
				<view class="signature-content">
					<image 
						v-if="record.operatorSign"
						:src="record.operatorSign"
						mode="aspectFit"
						class="signature-image"
					></image>
					<text class="signature-time">{{ record.operatorSignTime }}</text>
				</view>
			</view>
			
			<!-- 复核员签名 -->
			<view v-if="record.status === 'completed'" class="signature-card">
				<view class="signature-header">
					<text class="sig-icon">✅</text>
					<text class="sig-title">复核员签名</text>
					<text class="sig-name">{{ record.reviewer }}</text>
				</view>
				<view class="signature-content">
					<image 
						v-if="record.reviewerSign"
						:src="record.reviewerSign"
						mode="aspectFit"
						class="signature-image"
					></image>
					<text class="signature-time">{{ record.reviewerSignTime }}</text>
				</view>
			</view>
		</view>
		
		<!-- 驳回原因 -->
		<view v-if="record.status === 'rejected'" class="reject-card">
			<view class="reject-header">
				<text class="reject-icon">⚠️</text>
				<text class="reject-title">驳回原因</text>
			</view>
			<view class="reject-body">
				<text class="reject-reason">{{ record.rejectReason }}</text>
				<view class="reject-footer">
					<text class="reject-reviewer">复核人：{{ record.reviewer }}</text>
					<text class="reject-time">{{ record.reviewerSignTime }}</text>
				</view>
			</view>
		</view>
		
		<!-- 复核操作区 -->
		<view v-if="isReviewAction && record.status === 'pending_review'" class="review-section">
			<view class="review-card">
				<view class="card-title">
					<text class="title-icon">✍️</text>
					<text class="title-text">复核操作</text>
				</view>
				
				<view class="signature-input">
					<signature 
						v-model="reviewerSign"
						title="请签名确认"
					></signature>
				</view>
				
				<view class="reject-input">
					<text class="input-label">驳回原因（选填）</text>
					<textarea 
						v-model="rejectReason"
						placeholder="如需驳回，请填写原因"
						class="reject-textarea"
						maxlength="200"
					></textarea>
				</view>
			</view>
		</view>
		
		<!-- 底部操作按钮 -->
		<view v-if="showActions" class="action-bar">
			<!-- 待复核 -->
			<template v-if="isReviewAction && record.status === 'pending_review'">
				<view class="action-btn btn-reject" @tap="handleReject">
					<text class="btn-icon">✕</text>
					<text class="btn-text">驳回</text>
				</view>
				<view class="action-btn btn-approve" @tap="handleApprove">
					<text class="btn-icon">✓</text>
					<text class="btn-text">通过复核</text>
				</view>
			</template>
			
			
			<!-- 已完成 -->
			<template v-else-if="record.status === 'completed'">
				<view class="action-btn btn-export" @tap="handleExportPDF">
					<text class="btn-icon">📤</text>
					<text class="btn-text">导出PDF</text>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
import Signature from '@/components/signature/index.vue'
import { callFunction } from '@/utils/api.js'

export default {
	components: {
		Signature
	},
	
	data() {
		return {
			recordId: '',
			isReviewAction: false,
			record: {
				_id: '',
				recordNo: '',
				status: '',
				operator: '',
				operatorId: '',
				operatorSign: '',
				operatorSignTime: '',
				reviewer: '',
				reviewerId: '',
				reviewerSign: '',
				reviewerSignTime: '',
				supplier: '',
				items: [],
				createTime: '',
				completeTime: '',
				rejectReason: ''
			},
			reviewerSign: '',
			rejectReason: '',
			currentUserId: ''
		}
	},
	
	computed: {
		showActions() {
			return (this.isReviewAction && this.record.status === 'pending_review') || 
			       this.record.status === 'completed'
		}
	},
	
	onLoad(options) {
		this.recordId = options.id || ''
		this.isReviewAction = options.action === 'review'
		
		const userInfo = uni.getStorageSync('userInfo')
		this.currentUserId = userInfo && userInfo._id ? userInfo._id : ''
		
		this.loadDetail()
	},
	
	methods: {
		async loadDetail() {
			uni.showLoading({ title: '加载中...' })
			
			try {
				const data = await callFunction('inRecords', {
					action: 'getDetail',
					data: { _id: this.recordId }
				})
				
				this.record = data
				
				uni.hideLoading()
			} catch (err) {
				console.error('加载失败:', err)
				uni.hideLoading()
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			}
		},
		
		getStatusIcon(status) {
			const iconMap = {
				draft: '📝',
				pending_review: '⏳',
				completed: '✅',
				rejected: '❌'
			}
			return iconMap[status] || '❓'
		},
		
		getStatusText(status) {
			const statusMap = {
				draft: '草稿',
				pending_review: '待复核',
				completed: '已完成',
				rejected: '已驳回'
			}
			return statusMap[status] || status
		},
		
		async handleApprove() {
			if (!this.reviewerSign) {
				uni.showToast({
					title: '请先签名',
					icon: 'none'
				})
				return
			}
			
			uni.showModal({
				title: '确认通过',
				content: '确认通过此入库单吗？通过后库存将自动增加。',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '处理中...' })
						
						try {
							await callFunction('inRecords', {
								action: 'approve',
								data: {
									_id: this.recordId,
									reviewer: '复核员',
									reviewerId: this.currentUserId,
									reviewerSign: this.reviewerSign,
									reviewerSignTime: new Date().toISOString()
								}
							})
							
							uni.hideLoading()
							uni.showToast({
								title: '复核通过',
								icon: 'success'
							})
							
							setTimeout(() => {
								uni.navigateBack()
							}, 1500)
							
						} catch (err) {
							console.error('处理失败:', err)
							uni.hideLoading()
							uni.showToast({
								title: '处理失败',
								icon: 'none'
							})
						}
					}
				}
			})
		},
		
		async handleReject() {
			if (!this.rejectReason.trim()) {
				uni.showToast({
					title: '请填写驳回原因',
					icon: 'none'
				})
				return
			}
			
			uni.showModal({
				title: '确认驳回',
				content: '确认驳回此入库单吗？',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '处理中...' })
						
						try {
							await callFunction('inRecords', {
								action: 'reject',
								data: {
									_id: this.recordId,
									reviewer: '复核员',
									reviewerId: this.currentUserId,
									rejectReason: this.rejectReason.trim()
								}
							})
							
							uni.hideLoading()
							uni.showToast({
								title: '已驳回',
								icon: 'success'
							})
							
							setTimeout(() => {
								uni.navigateBack()
							}, 1500)
							
						} catch (err) {
							console.error('处理失败:', err)
							uni.hideLoading()
							uni.showToast({
								title: '处理失败',
								icon: 'none'
							})
						}
					}
				}
			})
		},
		
		
		handleExportPDF() {
			uni.showToast({
				title: 'PDF导出功能开发中',
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
	padding-bottom: 0;
}

/* 专业医疗表头 */
.medical-header {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

/* 状态流程指示器 */
.status-flow {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40rpx 60rpx;
	background: #ffffff;
	margin: -20rpx 30rpx 30rpx;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.08);
	position: relative;
	z-index: 2;
}

.flow-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10rpx;
}

.flow-dot {
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
	background: #e2e8f0;
	border: 4rpx solid #ffffff;
	box-shadow: 0 0 0 2rpx #e2e8f0;
	transition: all 0.3s;
}

.flow-item.current .flow-dot {
	background: #f59e0b;
	box-shadow: 0 0 0 4rpx rgba(245, 158, 11, 0.2);
}

.flow-item.completed .flow-dot {
	background: #10b981;
	box-shadow: 0 0 0 4rpx rgba(16, 185, 129, 0.2);
}

.flow-text {
	font-size: 22rpx;
	color: #94a3b8;
	font-weight: 500;
}

.flow-item.current .flow-text {
	color: #f59e0b;
	font-weight: 600;
}

.flow-item.completed .flow-text {
	color: #10b981;
	font-weight: 600;
}

.flow-line {
	flex: 1;
	height: 2rpx;
	background: #e2e8f0;
	margin: 0 15rpx;
	margin-bottom: 30rpx;
	transition: all 0.3s;
}

.flow-line.completed {
	background: #10b981;
}

/* 状态徽章 */
.status-badge-large {
	margin: 0 30rpx 30rpx;
	padding: 20rpx 30rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
}

.badge-draft {
	background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}

.badge-pending_review {
	background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.badge-completed {
	background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.badge-rejected {
	background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.badge-icon {
	font-size: 32rpx;
}

.badge-text {
	font-size: 28rpx;
	font-weight: 600;
}

.badge-draft .badge-text { color: #64748b; }
.badge-pending_review .badge-text { color: #92400e; }
.badge-completed .badge-text { color: #065f46; }
.badge-rejected .badge-text { color: #991b1b; }

/* 信息卡片 */
.info-card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin: 0 30rpx 25rpx;
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

/* 信息网格 */
.info-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 25rpx;
}

.grid-item {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.item-label {
	font-size: 22rpx;
	color: #94a3b8;
}

.item-value {
	font-size: 26rpx;
	color: #2c3e50;
	font-weight: 500;
}

.item-value.mono {
	font-family: 'DIN Alternate', 'Courier New', monospace;
	letter-spacing: 1rpx;
}

/* 药品明细列表 */
.drug-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.drug-item-card {
	background: #f8fafc;
	border-radius: 16rpx;
	padding: 25rpx;
	border-left: 4rpx solid #667eea;
}

.drug-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 20rpx;
}

.drug-name-wrapper {
	flex: 1;
	margin-right: 15rpx;
}

.drug-name {
	display: block;
	font-size: 30rpx;
	font-weight: bold;
	color: #2c3e50;
	margin-bottom: 8rpx;
}

.drug-spec {
	display: block;
	font-size: 24rpx;
	color: #64748b;
}

.drug-quantity-badge {
	display: flex;
	align-items: baseline;
	gap: 6rpx;
	padding: 8rpx 18rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 20rpx;
}

.quantity-num {
	font-size: 32rpx;
	font-weight: bold;
	color: #ffffff;
	font-family: 'DIN Alternate', 'Arial', sans-serif;
}

.quantity-unit {
	font-size: 20rpx;
	color: rgba(255,255,255,0.9);
}

/* 药品详细信息网格 */
.drug-details-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 15rpx;
}

.detail-item {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.detail-label {
	font-size: 20rpx;
	color: #94a3b8;
}

.detail-value {
	font-size: 24rpx;
	color: #2c3e50;
	font-weight: 500;
}

.detail-value.mono {
	font-family: 'DIN Alternate', 'Courier New', monospace;
}

.detail-value.price {
	color: #ef4444;
	font-weight: 600;
}

/* 签名区域 */
.signature-section {
	padding: 0 30rpx 20rpx;
}

.signature-card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 25rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
	border: 1rpx solid #f1f5f9;
}

.signature-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 20rpx;
}

.sig-icon {
	font-size: 28rpx;
}

.sig-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #2c3e50;
}

.sig-name {
	margin-left: auto;
	font-size: 26rpx;
	color: #667eea;
	font-weight: 600;
}

.signature-content {
	text-align: center;
}

.signature-image {
	width: 100%;
	height: 200rpx;
	border: 2rpx dashed #cbd5e1;
	border-radius: 12rpx;
	background: #f8fafc;
	margin-bottom: 15rpx;
}

.signature-time {
	font-size: 22rpx;
	color: #94a3b8;
}

/* 驳回卡片 */
.reject-card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin: 0 30rpx 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
	border-left: 4rpx solid #ef4444;
}

.reject-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 20rpx;
}

.reject-icon {
	font-size: 28rpx;
}

.reject-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #ef4444;
}

.reject-body {
	background: #fef3c7;
	padding: 20rpx;
	border-radius: 12rpx;
}

.reject-reason {
	display: block;
	font-size: 26rpx;
	color: #92400e;
	line-height: 1.6;
	margin-bottom: 15rpx;
}

.reject-footer {
	display: flex;
	justify-content: space-between;
	padding-top: 15rpx;
	border-top: 1rpx solid #fde68a;
}

.reject-reviewer,
.reject-time {
	font-size: 22rpx;
	color: #a16207;
}

/* 复核操作区 */
.review-section {
	padding: 0 30rpx 30rpx;
}

.review-card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
	border: 1rpx solid #f1f5f9;
}

.signature-input {
	margin-bottom: 25rpx;
}

.reject-input {
	background: #f8fafc;
	padding: 20rpx;
	border-radius: 12rpx;
}

.input-label {
	display: block;
	font-size: 24rpx;
	color: #64748b;
	margin-bottom: 12rpx;
}

.reject-textarea {
	width: 100%;
	min-height: 150rpx;
	padding: 15rpx;
	background: #ffffff;
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

.btn-approve {
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.3);
}

.btn-reject {
	background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
	box-shadow: 0 4rpx 12rpx rgba(239, 68, 68, 0.3);
}

.btn-edit {
	background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
	box-shadow: 0 4rpx 12rpx rgba(245, 158, 11, 0.3);
}

.btn-delete {
	background: #ffffff;
	border: 2rpx solid #ef4444;
}

.btn-export {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

.btn-icon {
	font-size: 28rpx;
	color: #ffffff;
}

.btn-delete .btn-icon {
	color: #ef4444;
}

.btn-text {
	font-size: 30rpx;
	color: #ffffff;
}

.btn-delete .btn-text {
	color: #ef4444;
}
</style>
