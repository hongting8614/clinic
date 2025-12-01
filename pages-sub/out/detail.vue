<template>
	<view class="page">
		<!-- 专业医疗表头 -->
		<view class="medical-header">
			<view class="header-bg"></view>
			<view class="header-content">
				<text class="clinic-name">爱康医务室管理系统</text>
				<text class="doc-type">北京欢乐谷医务室 · 药材出库单</text>
			</view>
		</view>
		
		<!-- 园区标识（出库单暂不展示，避免 null 标签） -->
		<!-- <view class="location-banner" :class="'location-' + record.location">
			<text class="location-icon">{{ getLocationIcon(record.location) }}</text>
			<text class="location-name">{{ record.locationName }}</text>
		</view> -->
		
		<!-- 状态流程指示器 -->
		<view class="status-flow">
			<view class="flow-item" :class="record.status !== 'draft' ? 'completed' : 'current'">
				<view class="flow-dot"></view>
				<text class="flow-text">创建</text>
				</view>
			<view class="flow-line" :class="record.status !== 'draft' ? 'completed' : ''"></view>
			<view class="flow-item" :class="record.status === 'completed' ? 'completed' : (record.status === 'pending_review' ? 'current' : '')">
				<view class="flow-dot"></view>
				<text class="flow-text">接收</text>
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
					<text class="item-label">出库园区</text>
					<text class="item-value location">{{ record.locationName }}</text>
				</view>
				<view class="grid-item">
					<text class="item-label">创建时间</text>
					<text class="item-value">{{ record.createTime }}</text>
				</view>
				<view class="grid-item">
					<text class="item-label">发放人</text>
					<text class="item-value">{{ record.dispenser }}</text>
				</view>
				<view class="grid-item" v-if="record.remark">
					<text class="item-label">备注</text>
					<text class="item-value">{{ record.remark }}</text>
				</view>
			</view>
		</view>
		
		<!-- 药材明细卡片 -->
		<view class="info-card">
			<view class="card-title">
				<text class="title-icon">💊</text>
				<text class="title-text">药材明细</text>
				<text class="title-count">{{ record.items ? record.items.length : 0 }}种</text>
			</view>
			<view class="drug-list">
				<view 
					v-for="(item, index) in record.items" 
					:key="index"
					class="drug-item-card"
				>
					<!-- 高值药材标识 -->
					<view v-if="item.isHighValue" class="high-value-tag">
						<text class="tag-icon">💎</text>
						<text class="tag-text">高值药材</text>
					</view>
					
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
							<text class="detail-label">生产厂家</text>
							<text class="detail-value">{{ item.manufacturer }}</text>
						</view>
						<view class="detail-item" v-if="item.price">
							<text class="detail-label">单价</text>
							<text class="detail-value price">¥{{ item.price }}</text>
						</view>
						<view class="detail-item" v-if="item.price">
							<text class="detail-label">小计</text>
							<text class="detail-value price">¥{{ (item.quantity * item.price).toFixed(2) }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 合计金额 -->
			<view v-if="totalAmount > 0" class="total-amount">
				<text class="total-label">合计金额</text>
				<text class="total-value">¥{{ totalAmount.toFixed(2) }}</text>
			</view>
		</view>
		
		<!-- 签名区域 -->
		<view class="signature-section">
		<!-- 发放人签名 -->
			<view class="signature-card">
				<view class="signature-header">
					<text class="sig-icon">✍️</text>
					<text class="sig-title">发放人签名</text>
					<text class="sig-name">{{ record.dispenser }}</text>
				</view>
				<view class="signature-content">
				<image 
					v-if="record.dispenserSign" 
					:src="record.dispenserSign" 
					mode="aspectFit"
					class="signature-image"
				></image>
					<text class="signature-time">{{ record.dispenserSignTime }}</text>
			</view>
		</view>
		
			<!-- 接收人签名 -->
			<view v-if="record.status === 'completed'" class="signature-card">
				<view class="signature-header">
					<text class="sig-icon">✅</text>
					<text class="sig-title">接收人签名</text>
					<text class="sig-name">{{ record.receiver }}</text>
				</view>
				<view class="signature-content">
				<image 
					v-if="record.receiverSign" 
					:src="record.receiverSign" 
					mode="aspectFit"
					class="signature-image"
				></image>
					<text class="signature-time">{{ record.receiverSignTime }}</text>
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
					<text class="reject-reviewer">接收人：{{ record.receiver }}</text>
					<text class="reject-time">{{ record.receiverSignTime }}</text>
				</view>
			</view>
		</view>
		
		<!-- 接收操作区 -->
		<view v-if="isReviewAction && record.status === 'pending_review'" class="review-section">
			<view class="review-card">
				<view class="card-title">
					<text class="title-icon">✍️</text>
					<text class="title-text">接收确认</text>
				</view>
				
				<view class="signature-input">
				<signature 
					v-model="receiverSign"
						title="请签名确认接收"
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
			<!-- 待接收 -->
			<template v-if="isReviewAction && record.status === 'pending_review'">
				<view class="action-btn btn-reject" @tap="handleReject">
					<text class="btn-icon">✕</text>
					<text class="btn-text">驳回</text>
				</view>
				<view class="action-btn btn-approve" @tap="handleApprove">
					<text class="btn-icon">✓</text>
					<text class="btn-text">确认接收</text>
				</view>
			</template>
			
			<!-- 草稿/已驳回 -->
			<template v-else-if="canEdit">
				<view class="action-btn btn-delete" @tap="handleDelete">
					<text class="btn-icon">🗑️</text>
					<text class="btn-text">删除</text>
				</view>
				<view class="action-btn btn-edit" @tap="handleEdit">
					<text class="btn-icon">✏️</text>
					<text class="btn-text">编辑</text>
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
				location: '',
				locationName: '',
				dispenser: '',
				dispenserId: '',
				dispenserSign: '',
				dispenserSignTime: '',
				receiver: '',
				receiverId: '',
				receiverSign: '',
				receiverSignTime: '',
				remark: '',
				items: [],
				createTime: '',
				completeTime: '',
				rejectReason: ''
			},
			receiverSign: '',
			rejectReason: '',
			currentUserId: ''
		}
	},
	
	computed: {
		showActions() {
			return (this.isReviewAction && this.record.status === 'pending_review') || 
			       this.canEdit || 
			       this.record.status === 'completed'
		},
		
		canEdit() {
			return (this.record.status === 'draft' || this.record.status === 'rejected') && 
			       this.record.dispenserId === this.currentUserId
		},
		
		totalAmount() {
			if (!this.record.items) return 0
			return this.record.items.reduce((sum, item) => {
				if (item.price) {
					return sum + (item.quantity * item.price)
				}
				return sum
			}, 0)
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
				const res = await callFunction('outRecords', {
					action: 'getDetail',
					data: { _id: this.recordId }
				})
				
				if (!res || res.success === false) {
					throw new Error((res && res.message) || '获取详情失败')
				}
				// 云函数返回结构为 { success, data: record }
				this.record = res.data || {}
				// 确保出库园区名称可用（后端只存编码时前端补全）
				if (!this.record.locationName) {
					const loc = this.record.toLocation || this.record.location
					if (loc === 'land_park') this.record.locationName = '陆园'
					else if (loc === 'water_park') this.record.locationName = '水园'
				}
				
				// 转换签名图片URL（如果是云存储路径）
				await this.convertSignatureUrls()
				
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
		
		// 转换签名图片URL
		async convertSignatureUrls() {
			try {
				const fileIds = []
				
				// 收集需要转换的云存储路径
				if (this.record.dispenserSign && this.record.dispenserSign.startsWith('cloud://')) {
					fileIds.push(this.record.dispenserSign)
				}
				if (this.record.receiverSign && this.record.receiverSign.startsWith('cloud://')) {
					fileIds.push(this.record.receiverSign)
				}
				
				if (fileIds.length === 0) {
					return // 没有需要转换的图片
				}
				
				// 检查云开发是否可用
				const cloud = wx.cloud || uni.cloud
				if (!cloud || !cloud.getTempFileURL) {
					console.warn('云开发API不可用，无法转换签名图片URL')
					return
				}
				
				// 批量获取临时URL
				const res = await cloud.getTempFileURL({
					fileList: fileIds
				})
				
				// 更新签名图片URL
				if (res && res.fileList) {
					res.fileList.forEach((item) => {
						if (item.fileID === this.record.dispenserSign && item.tempFileURL) {
							this.record.dispenserSign = item.tempFileURL
							console.log('✅ 发放人签名URL转换成功')
						}
						if (item.fileID === this.record.receiverSign && item.tempFileURL) {
							this.record.receiverSign = item.tempFileURL
							console.log('✅ 接收人签名URL转换成功')
						}
					})
				}
			} catch (err) {
				console.error('❌ 转换签名图片URL失败:', err)
				// 转换失败不影响页面显示，只是图片可能无法加载
			}
		},
		
		getLocationIcon(location) {
			const iconMap = {
				'land_park': '🏞️',
				'water_park': '💧'
			}
			return iconMap[location] || '📍'
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
				pending_review: '待接收',
				completed: '已完成',
				rejected: '已驳回'
			}
			return statusMap[status] || status
		},
		
		async handleApprove() {
			if (!this.receiverSign) {
				uni.showToast({
					title: '请先签名',
					icon: 'none'
				})
				return
			}
			
			uni.showModal({
				title: '确认接收',
				content: '确认接收此出库单吗？接收后库存将自动扣减。',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '处理中...' })
						
						try {
							await callFunction('outRecords', {
								action: 'complete',
								data: {
									_id: this.recordId,
									receiver: '接收人',
									receiverId: this.currentUserId,
									receiverSign: this.receiverSign,
									receiverSignTime: new Date().toISOString()
								}
							})
							
							uni.hideLoading()
							uni.showToast({
								title: '接收成功',
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
				content: '确认驳回此出库单吗？',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '处理中...' })
						
						try {
							await callFunction('outRecords', {
								action: 'reject',
								data: {
									_id: this.recordId,
									receiver: '接收人',
									receiverId: this.currentUserId,
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
		
		handleEdit() {
			uni.navigateTo({
				url: `/pages-sub/out/add?id=${this.recordId}`
			})
		},
		
		handleDelete() {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这个出库单吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							await callFunction('outRecords', {
								action: 'delete',
								data: { _id: this.recordId }
							})
							
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
							
							setTimeout(() => {
								uni.navigateBack()
							}, 1500)
						} catch (err) {
							uni.showToast({
								title: '删除失败',
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
	/* 与入/出库表单统一的蓝色渐变背景 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding: 24rpx 24rpx 150rpx;
}

/* 专业医疗表头 - 与入库页相同 */
.medical-header {
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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

/* 园区标识横幅 */
.location-banner {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	padding: 18rpx 30rpx;
	margin: -10rpx 30rpx 20rpx;
	border-radius: 50rpx;
	position: relative;
	z-index: 2;
}

.location-land_park {
	background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.location-water_park {
	background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.location-icon {
	font-size: 28rpx;
}

.location-name {
	font-size: 28rpx;
	font-weight: 600;
}

.location-land_park .location-name { color: #065f46; }
.location-water_park .location-name { color: #1e40af; }

/* 状态流程 - 与入库相同 */
.status-flow {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 30rpx 40rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15,23,42,0.12);
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
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 18rpx 26rpx;
	border-radius: 20rpx;
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

/* 信息卡片 - 与入库相同 */
.info-card {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 26rpx 26rpx 24rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15,23,42,0.12);
	border: 1rpx solid #e5e7eb;
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

.item-value.location {
	color: #10b981;
	font-weight: 600;
}

/* 药材明细 - 与入库相同 */
.drug-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.drug-item-card {
	background: #f8fafc;
	border-radius: 16rpx;
	padding: 25rpx;
	border-left: 4rpx solid #10b981;
	position: relative;
}

/* 高值药材标签 */
.high-value-tag {
	position: absolute;
	top: 15rpx;
	right: 15rpx;
	display: flex;
	align-items: center;
	gap: 6rpx;
	padding: 6rpx 14rpx;
	background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
	border-radius: 16rpx;
}

.tag-icon {
	font-size: 18rpx;
}

.tag-text {
	font-size: 20rpx;
	color: #92400e;
	font-weight: 600;
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
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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

/* 合计金额 */
.total-amount {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 25rpx;
	padding-top: 25rpx;
	border-top: 2rpx dashed #e2e8f0;
}

.total-label {
	font-size: 28rpx;
	font-weight: 600;
	color: #2c3e50;
}

.total-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #ef4444;
}

.signature-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
}

.signature-card {
	background: #ffffff;
	border-radius: 22rpx;
	padding: 26rpx 26rpx 24rpx;
	margin-bottom: 8rpx;
	box-shadow: 0 8rpx 20rpx rgba(15,23,42,0.12);
	border: 1rpx solid #e5e7eb;
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
	color: #10b981;
	font-weight: 600;
}

.signature-content {
	text-align: center;
}

.signature-image {
	width: 100%;
	height: 110rpx;
	border: 2rpx dashed #cbd5e1;
	border-radius: 12rpx;
	background: #f8fafc;
	margin-bottom: 15rpx;
}

.signature-time {
	font-size: 22rpx;
	color: #94a3b8;
}

/* 驳回卡片 - 与入库相同 */
.reject-card {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	background: #ffffff;
	border-radius: 22rpx;
	padding: 26rpx 26rpx 24rpx;
	box-shadow: 0 8rpx 20rpx rgba(15,23,42,0.12);
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

/* 接收操作区 - 与入库相同 */
.review-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
}

.review-card {
	background: #ffffff;
	border-radius: 22rpx;
	padding: 26rpx 26rpx 24rpx;
	box-shadow: 0 8rpx 20rpx rgba(15,23,42,0.12);
	border: 1rpx solid #e5e7eb;
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

/* 底部操作栏 - 与入库相同 */
.action-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #ffffff;
	padding: 22rpx 30rpx 28rpx;
	box-shadow: 0 -4rpx 16rpx rgba(15,23,42,0.16);
	display: flex;
	gap: 20rpx;
	z-index: 100;
}

.action-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	padding: 22rpx 30rpx;
	border-radius: 999rpx;
	font-weight: 600;
	transition: all 0.3s;
}

.action-btn:active {
	transform: scale(0.97);
}

/* 统一青蓝胶囊按钮 */
.btn-approve,
.btn-reject,
.btn-edit,
.btn-export {
	background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
	box-shadow: 0 6rpx 16rpx rgba(0,160,255,0.25);
}

.btn-delete {
	background: #ffffff;
	border: 2rpx solid #ef4444;
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
