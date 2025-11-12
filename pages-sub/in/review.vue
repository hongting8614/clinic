<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<view class="header-content">
				<text class="header-title">入库单复核</text>
				<text class="header-subtitle">{{ currentDate }}</text>
			</view>
		</view>

		<!-- 基本信息卡片 -->
		<view class="info-card">
			<view class="info-row">
				<view class="info-item">
					<text class="label">单号</text>
					<text class="value">{{ record.recordNo }}</text>
				</view>
				<view class="info-item">
					<text class="label">状态</text>
					<view :class="['status-badge', record.status]">
						{{ getStatusText(record.status) }}
					</view>
				</view>
			</view>
			<view class="info-row">
				<view class="info-item">
					<text class="label">操作人</text>
					<text class="value">{{ record.operator }}</text>
				</view>
				<view class="info-item">
					<text class="label">创建时间</text>
					<text class="value">{{ record.createTime }}</text>
				</view>
			</view>
			<view class="info-row" v-if="record.supplier">
				<view class="info-item full">
					<text class="label">供应商</text>
					<text class="value">{{ record.supplier }}</text>
				</view>
			</view>
		</view>

		<!-- 药品明细 -->
		<view class="drug-section">
			<view class="section-title">
				<text class="title-text">📦 药品明细</text>
				<text class="title-count">共 {{ record.items ? record.items.length : 0 }} 种</text>
			</view>

			<view 
				v-for="(item, index) in record.items" 
				:key="index"
				class="drug-card"
			>
				<view class="drug-header">
					<view class="drug-name">{{ item.drugName }}</view>
					<view class="drug-index">{{ index + 1 }}</view>
				</view>
				
				<view class="drug-spec">{{ item.specification }}</view>
				
				<view class="drug-details">
					<view class="detail-row">
						<text class="detail-label">批号：</text>
						<text class="detail-value">{{ item.batch }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">生产日期：</text>
						<text class="detail-value">{{ item.productionDate }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">有效期：</text>
						<text :class="['detail-value', getExpiryClass(item.daysToExpiry)]">
							{{ item.expireDate }}
							<text v-if="item.daysToExpiry !== null">({{ item.daysToExpiry }}天)</text>
						</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">数量：</text>
						<text class="detail-value highlight">{{ item.quantity }} {{ item.unit }}</text>
					</view>
					<view class="detail-row" v-if="item.price">
						<text class="detail-label">单价：</text>
						<text class="detail-value">¥{{ item.price }}</text>
					</view>
					<view class="detail-row" v-if="item.price">
						<text class="detail-label">金额：</text>
						<text class="detail-value amount">¥{{ (item.quantity * item.price).toFixed(2) }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 统计汇总 -->
		<view class="summary-card">
			<view class="summary-item">
				<text class="summary-label">品种</text>
				<text class="summary-value">{{ totalDrugs }} 种</text>
			</view>
			<view class="summary-item">
				<text class="summary-label">总数量</text>
				<text class="summary-value">{{ totalQuantity }}</text>
			</view>
			<view v-if="totalAmount > 0" class="summary-item highlight">
				<text class="summary-label">总金额</text>
				<text class="summary-value">¥{{ totalAmount.toFixed(2) }}</text>
			</view>
		</view>

		<!-- 双签名区域（合并） -->
		<view class="dual-signature-section">
			<view class="section-title">
				<text class="title-text">✍️ 双签名确认</text>
			</view>
			
			<!-- 操作员签名（已签） -->
			<view class="signature-card operator-card">
				<view class="signature-header">
					<view class="header-left">
						<text class="signature-icon">✍️</text>
						<text class="signature-label">{{ getOperatorRoleText() }}签名</text>
					</view>
					<view class="signature-status completed">已签名</view>
				</view>
				<view class="signature-display-box">
					<image 
						v-if="record.operatorSign" 
						:src="record.operatorSign" 
						mode="aspectFit"
						class="signature-img"
					></image>
					<view v-else class="no-signature">
						<text class="no-sig-icon">✍️</text>
						<text class="no-sig-text">暂无签名</text>
					</view>
				</view>
			<view class="signature-footer">
				<view class="footer-item">
					<text class="footer-label">签名人</text>
					<text class="footer-value">{{ record.operator }}（{{ getOperatorRoleText() }}）</text>
				</view>
				<view class="footer-divider"></view>
				<view class="footer-item">
					<text class="footer-label">签名时间</text>
					<text class="footer-value">{{ formatTime(record.operatorSignTime || record.createTime) }}</text>
				</view>
			</view>
			</view>
			
			<!-- 复核人签名 -->
			<view class="signature-card reviewer-card">
				<view class="signature-header">
					<view class="header-left">
						<text class="signature-icon">✓</text>
						<text class="signature-label">复核人签名</text>
					</view>
					<view :class="['signature-status', reviewerSign ? 'completed' : 'pending']">
						{{ reviewerSign ? '已签名' : '待签名' }}
					</view>
				</view>
				<view class="signature-display-box">
					<signature 
						v-model="reviewerSign"
						title=""
						:showTitle="false"
					></signature>
				</view>
			<view v-if="reviewerSign" class="signature-footer">
				<view class="footer-item">
					<text class="footer-label">签名人</text>
					<text class="footer-value">{{ (userInfo && userInfo.name) || '未登录' }}（{{ getRoleText(userInfo && userInfo.role) }}）</text>
				</view>
				<view class="footer-divider"></view>
				<view class="footer-item">
					<text class="footer-label">签名时间</text>
					<text class="footer-value">{{ getCurrentTime() }}</text>
				</view>
			</view>
			</view>
			
		</view>

		<!-- 驳回原因（如果需要驳回） -->
		<view v-if="showRejectReason" class="reject-section">
			<view class="section-title">
				<text class="title-text">📝 驳回原因</text>
				<text class="required">*</text>
			</view>
			<textarea 
				class="reject-textarea"
				v-model="rejectReason"
				placeholder="请输入驳回原因"
				maxlength="200"
			></textarea>
			<view class="char-count">{{ rejectReason.length }}/200</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="action-bar">
			<view class="action-btn btn-reject" @tap="handleReject">
				<text class="btn-text">驳回</text>
			</view>
			<view class="action-btn btn-approve" @tap="handleApprove">
				<text class="btn-text">通过并入库</text>
			</view>
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
			recordId: '',
			currentDate: '',
			record: {
				recordNo: '',
				operator: '',
				operatorId: '',
				operatorSign: '',
				operatorSignTime: '',
				supplier: '',
				createTime: '',
				status: 'pending_review',
				items: []
			},
			reviewerSign: '',
			showRejectReason: false,
			rejectReason: '',
			userInfo: null
		}
	},
	
	computed: {
		totalDrugs() {
			return this.record.items ? this.record.items.length : 0
		},
		
		totalQuantity() {
			if (!this.record.items) return 0
			return this.record.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
		},
		
		totalAmount() {
			if (!this.record.items) return 0
			return this.record.items.reduce((sum, item) => {
				return sum + (Number(item.quantity || 0) * Number(item.price || 0))
			}, 0)
		}
	},
	
	onLoad(options) {
		if (options.id) {
			this.recordId = options.id
		}
		this.userInfo = uni.getStorageSync('userInfo') || null
		this.initPage()
	},
	
	methods: {
		initPage() {
			const now = new Date()
			this.currentDate = Common.formatDate(now)
			
			if (this.recordId) {
				this.loadRecord()
			}
		},
		
		async loadRecord() {
			uni.showLoading({ title: '加载中...', mask: true })
			
			try {
				const result = await this.$api.callFunction('inRecords', {
					action: 'getDetail',
					data: {
						_id: this.recordId
					}
				})
				
				uni.hideLoading()
				
				// 兼容不同的返回格式
				const data = result.data || result
				
				if (data && data._id) {
					this.record = data
					
					// 计算效期
					this.record.items.forEach(item => {
						if (item.expireDate) {
							const expireDate = new Date(item.expireDate)
							const today = new Date()
							const diffTime = expireDate - today
							item.daysToExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
						}
					})
				} else {
					throw new Error('加载失败')
				}
			} catch (err) {
				uni.hideLoading()
				console.error('加载失败:', err)
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			}
		},
		
		getStatusText(status) {
			const statusMap = {
				'draft': '草稿',
				'pending_review': '待复核',
				'completed': '已完成',
				'rejected': '已驳回'
			}
			return statusMap[status] || status
		},
		
		getExpiryClass(days) {
			if (days === null || days === undefined) return ''
			if (days < 0) return 'expired'
			if (days <= 30) return 'expiring-soon'
			if (days <= 90) return 'expiring'
			return 'normal'
		},
		
		handleReject() {
			this.showRejectReason = true
			
			uni.showModal({
				title: '确认驳回',
				content: '确定要驳回这个入库单吗？',
				success: (res) => {
					if (res.confirm) {
						// 显示驳回原因输入框
						this.showRejectReason = true
						// 滚动到底部
						setTimeout(() => {
							uni.pageScrollTo({
								scrollTop: 9999,
								duration: 300
							})
						}, 100)
					}
				}
			})
		},
		
		async handleApprove() {
			// 验证签名
			if (!this.reviewerSign) {
				uni.showToast({
					title: '请先签名',
					icon: 'none'
				})
				return
			}
			
			uni.showModal({
				title: '确认通过',
				content: '确认通过并入库吗？入库后将更新库存。',
				success: async (res) => {
					if (res.confirm) {
						await this.submitReview('approve')
					}
				}
			})
		},
		
		// 获取操作员角色文本（根据操作员姓名从用户列表中查找）
		getOperatorRoleText() {
			// 如果有operatorRole字段，直接使用
			if (this.record.operatorRole) {
				return this.getRoleText(this.record.operatorRole)
			}
			// 否则默认显示"操作员"
			return '操作员'
		},
		
		// 获取角色文本
		getRoleText(role) {
			const roleMap = {
				'admin': '管理员',
				'project_manager': '项目经理',
				'doctor': '医生',
				'pharmacy': '药师',
				'viewer': '查看者'
			}
			return roleMap[role] || '操作员'
		},
		
		// 格式化时间
		formatTime(timeStr) {
			if (!timeStr) return '--'
			const date = new Date(timeStr)
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			const hours = String(date.getHours()).padStart(2, '0')
			const minutes = String(date.getMinutes()).padStart(2, '0')
			return `${month}-${day} ${hours}:${minutes}`
		},
		
		// 获取当前时间
		getCurrentTime() {
			return this.formatTime(new Date().toISOString())
		},
		
		async submitReview(action) {
			// 如果是驳回，检查驳回原因
			if (action === 'reject' && !this.rejectReason.trim()) {
				uni.showToast({
					title: '请输入驳回原因',
					icon: 'none'
				})
				return
			}
			
			uni.showLoading({ title: '提交中...', mask: true })
			
			try {
				const cachedUser = this.userInfo || uni.getStorageSync('userInfo') || null
				if (cachedUser && !this.userInfo) {
					this.userInfo = cachedUser
				}
				const reviewerId = cachedUser && (cachedUser.userId || cachedUser._id || '')
				const reviewerName = cachedUser && cachedUser.name ? cachedUser.name : ''
				
				// 登录校验（避免云函数因 reviewerId 为空而提示“先登录”）
				if (!cachedUser || !reviewerName || !reviewerId) {
					uni.hideLoading()
					uni.showModal({
						title: '请先登录',
						content: '复核提交需要登录账号，请前往“我的”完成登录后再试。',
						confirmText: '前往登录',
						cancelText: '取消',
						success: (res) => {
							if (res.confirm) {
								uni.switchTab({ url: '/pages/mine/index' })
							}
						}
					})
					return
				}
				
				const result = await this.$api.callFunction('inRecords', {
					action: action === 'approve' ? 'approve' : 'reject',
					data: {
						_id: this.recordId,
						reviewer: reviewerName,
						reviewerId: reviewerId,
						reviewerSign: this.reviewerSign,
						reviewerSignTime: new Date().toISOString(),
						rejectReason: action === 'reject' ? this.rejectReason : ''
					}
				})
				
				uni.hideLoading()
				
				if (result && result.success) {
					uni.showToast({
						title: action === 'approve' ? '已通过并入库' : '已驳回',
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
	background: #f8f8f8;
	padding-bottom: 120rpx;
}

// 页面头部
.page-header {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 40rpx 30rpx;
	
	.header-content {
		.header-title {
			display: block;
			font-size: 40rpx;
			font-weight: bold;
			color: white;
			margin-bottom: 10rpx;
		}
		
		.header-subtitle {
			display: block;
			font-size: 26rpx;
			color: rgba(255, 255, 255, 0.9);
		}
	}
}

// 信息卡片
.info-card {
	background: white;
	margin: 20rpx 30rpx;
	padding: 30rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	
	.info-row {
		display: flex;
		margin-bottom: 20rpx;
		
		&:last-child {
			margin-bottom: 0;
		}
		
		.info-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 10rpx;
			
			&.full {
				flex: 1 1 100%;
			}
			
			.label {
				font-size: 24rpx;
				color: #969799;
			}
			
			.value {
				font-size: 28rpx;
				color: #323233;
				font-weight: 500;
			}
			
			.status-badge {
				display: inline-block;
				padding: 8rpx 20rpx;
				border-radius: 20rpx;
				font-size: 24rpx;
				font-weight: 500;
				
				&.pending_review {
					background: #fff3e0;
					color: #ff9800;
				}
				
				&.completed {
					background: #e8f5e9;
					color: #4caf50;
				}
				
				&.rejected {
					background: #ffebee;
					color: #f44336;
				}
			}
		}
	}
}

// 药品明细
.drug-section {
	padding: 0 30rpx;
	
	.section-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx;
		
		.title-text {
			font-size: 32rpx;
			font-weight: bold;
			color: #323233;
		}
		
		.title-count {
			font-size: 24rpx;
			color: #969799;
		}
	}
}

.drug-card {
	background: white;
	padding: 30rpx;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	
	.drug-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 15rpx;
		
		.drug-name {
			font-size: 32rpx;
			font-weight: bold;
			color: #323233;
		}
		
		.drug-index {
			width: 48rpx;
			height: 48rpx;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			font-weight: bold;
		}
	}
	
	.drug-spec {
		font-size: 26rpx;
		color: #969799;
		margin-bottom: 20rpx;
	}
	
	.drug-details {
		.detail-row {
			display: flex;
			align-items: center;
			margin-bottom: 12rpx;
			
			&:last-child {
				margin-bottom: 0;
			}
			
			.detail-label {
				font-size: 26rpx;
				color: #646566;
				width: 150rpx;
			}
			
			.detail-value {
				flex: 1;
				font-size: 26rpx;
				color: #323233;
				
				&.highlight {
					font-size: 30rpx;
					font-weight: bold;
					color: #667eea;
				}
				
				&.amount {
					font-weight: bold;
					color: #667eea;
				}
				
				&.normal {
					color: #323233;
				}
				
				&.expiring {
					color: #ff9800;
				}
				
				&.expiring-soon {
					color: #ff5722;
				}
				
				&.expired {
					color: #f44336;
					font-weight: bold;
				}
			}
		}
	}
}

// 双签名区域（重新设计）
.dual-signature-section {
	padding: 0 30rpx;
	margin-top: 30rpx;
	
	.section-title {
		display: flex;
		align-items: center;
		gap: 10rpx;
		margin-bottom: 25rpx;
		
		.title-text {
			font-size: 32rpx;
			font-weight: bold;
			color: #323233;
		}
	}
	
	.signature-card {
		background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 25rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
		border: 2rpx solid #f0f0f0;
		position: relative;
		overflow: hidden;
		
		// 装饰性背景
		&::before {
			content: '';
			position: absolute;
			top: -50rpx;
			right: -50rpx;
			width: 150rpx;
			height: 150rpx;
			background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
			border-radius: 50%;
		}
		
		// 操作员卡片主题色
		&.operator-card {
			border-left: 4rpx solid #667eea;
		}
		
		// 复核人卡片主题色
	&.reviewer-card {
		border-left: 4rpx solid #4caf50;
		
		// 覆盖 signature 组件的样式，让它在复核页面中更大
		::v-deep .signature-container {
			height: 160rpx !important;
		}
		
		::v-deep .placeholder-icon {
			font-size: 40rpx !important;
		}
		
		::v-deep .placeholder-text {
			font-size: 28rpx !important;
		}
		
		::v-deep .signature-preview {
			height: 160rpx !important;
		}
	}
		
		.signature-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 25rpx;
			position: relative;
			z-index: 1;
			
			.header-left {
				display: flex;
				align-items: center;
				gap: 12rpx;
				
			.signature-icon {
				width: 56rpx;
				height: 56rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 30rpx;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: white;
					border-radius: 50%;
					box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
				}
				
			.signature-label {
				font-size: 36rpx;
				font-weight: bold;
				color: #323233;
			}
			}
			
		.signature-status {
			padding: 10rpx 28rpx;
			border-radius: 32rpx;
			font-size: 30rpx;
			font-weight: 600;
				
				&.completed {
					background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
					color: #2e7d32;
					box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.2);
				}
				
				&.pending {
					background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
					color: #e65100;
					box-shadow: 0 2rpx 8rpx rgba(255, 152, 0, 0.2);
				}
			}
		}
		
	// 签名显示区域（统一高度和样式）
	.signature-display-box {
		height: 160rpx;
		background: #ffffff;
		border-radius: 16rpx;
		padding: 0;
		margin-bottom: 20rpx;
		border: 2rpx solid #e8e8e8;
		position: relative;
		z-index: 1;
		overflow: hidden;
		
		.signature-img {
			width: 100%;
			height: 100%;
			object-fit: contain;
			padding: 10rpx;
		}
		
		.no-signature {
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 15rpx;
			
			.no-sig-icon {
				font-size: 60rpx;
				opacity: 0.3;
			}
			
			.no-sig-text {
				font-size: 24rpx;
				color: #c8c9cc;
			}
		}
	}
		
		// 签名信息底部
		.signature-footer {
			display: flex;
			align-items: center;
			background: rgba(102, 126, 234, 0.04);
			border-radius: 12rpx;
			padding: 20rpx;
			position: relative;
			z-index: 1;
			
			.footer-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: 8rpx;
				
				.footer-label {
					font-size: 22rpx;
					color: #969799;
				}
				
				.footer-value {
					font-size: 26rpx;
					color: #323233;
					font-weight: 600;
				}
			}
			
			.footer-divider {
				width: 2rpx;
				height: 40rpx;
				background: #e0e0e0;
				margin: 0 20rpx;
			}
		}
	}
}

// 统计汇总
.summary-card {
	background: white;
	margin: 30rpx 30rpx 0;
	padding: 30rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	display: flex;
	justify-content: space-around;
	
	.summary-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
		
		&.highlight {
			.summary-value {
				color: #667eea;
			}
		}
		
		.summary-label {
			font-size: 24rpx;
			color: #969799;
		}
		
		.summary-value {
			font-size: 32rpx;
			font-weight: bold;
			color: #323233;
		}
	}
}

// 驳回原因
.reject-section {
	padding: 0 30rpx;
	margin-top: 30rpx;
	
	.section-title {
		display: flex;
		align-items: center;
		gap: 10rpx;
		margin-bottom: 20rpx;
		
		.title-text {
			font-size: 32rpx;
			font-weight: bold;
			color: #323233;
		}
		
		.required {
			color: #ee0a24;
			font-size: 28rpx;
		}
	}
	
	.reject-textarea {
		width: 100%;
		background: white;
		border-radius: 16rpx;
		padding: 30rpx;
		min-height: 200rpx;
		font-size: 28rpx;
		color: #323233;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}
	
	.char-count {
		text-align: right;
		font-size: 24rpx;
		color: #969799;
		margin-top: 10rpx;
	}
}

// 底部操作栏
.action-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	gap: 20rpx;
	padding: 20rpx 30rpx;
	background: white;
	box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.08);
	z-index: 100;
	
	.action-btn {
		flex: 1;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 44rpx;
		font-size: 32rpx;
		font-weight: bold;
		transition: all 0.3s;
		
		&.btn-reject {
			background: #fff;
			border: 2rpx solid #f44336;
			color: #f44336;
			
			&:active {
				background: #ffebee;
			}
		}
		
		&.btn-approve {
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
			box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
			
			&:active {
				opacity: 0.9;
			}
		}
	}
}

// 签名弹窗
.signature-popup {
	background: white;
	border-radius: 24rpx;
	overflow: hidden;
	
	.popup-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		border-bottom: 1rpx solid #ebedf0;
		
		.popup-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #323233;
		}
		
		.popup-close {
			font-size: 40rpx;
			color: #969799;
			width: 60rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
</style>

