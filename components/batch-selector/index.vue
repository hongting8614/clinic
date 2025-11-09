<template>
	<view>
		<u-button 
			:type="buttonType" 
			:text="buttonText" 
			:size="buttonSize"
			@click="showDialog"
			:loading="loading"
		></u-button>
		
		<u-popup 
			:show="visible" 
			mode="center"
			:round="20"
			width="90%"
			height="65%"
			@close="handleClose"
		>
			<view class="batch-selector-popup">
				<!-- 头部 -->
				<view class="popup-header">
					<text class="popup-title">选择批次</text>
					<view class="close-btn" @tap="handleClose">
						<text class="close-icon">✕</text>
					</view>
				</view>
				
				<!-- 药品信息 -->
				<view class="drug-info-bar" v-if="drugInfo">
					<view class="info-row">
						<text class="info-label">药品：</text>
						<text class="info-value">{{ drugInfo.name }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">规格：</text>
						<text class="info-value">{{ drugInfo.spec }}</text>
					</view>
				</view>
				
				<!-- FIFO提示 -->
				<view v-if="enableFIFO" class="fifo-tip">
					<text class="tip-icon">💡</text>
					<text class="tip-text">已按先进先出(FIFO)排序，优先使用最早批次</text>
				</view>
				
				<!-- 批次列表 -->
				<scroll-view class="batch-list" scroll-y>
					<view 
						v-for="batch in batchList" 
						:key="batch._id" 
						class="batch-item"
						@tap="selectBatch(batch)"
					>
						<!-- 近效期标记 -->
						<view v-if="batch.isNearExpiry" class="expiry-badge">
							<text>⚠️ 近效期</text>
						</view>
						
						<view class="batch-main">
							<view class="batch-header">
								<text class="batch-number">批号：{{ batch.batch }}</text>
								<text class="stock-quantity" :class="{'low-stock': batch.quantity < 10}">
									库存：{{ batch.quantity }} {{ drugInfo.unit }}
								</text>
							</view>
							
							<view class="batch-details">
								<view class="detail-row">
									<text class="detail-label">生产日期：</text>
									<text class="detail-value">{{ batch.productionDate }}</text>
								</view>
								<view class="detail-row">
									<text class="detail-label">有效期至：</text>
									<text class="detail-value" :class="{'text-warning': batch.isNearExpiry}">
										{{ batch.expireDate }}
									</text>
								</view>
								<view class="detail-row" v-if="batch.price">
									<text class="detail-label">单价：</text>
									<text class="detail-value">¥{{ batch.price }}</text>
								</view>
								<view class="detail-row" v-if="showLocationFilter">
									<text class="detail-label">存放位置：</text>
									<text class="detail-value">{{ getLocationName(batch.location) }}</text>
								</view>
							</view>
						</view>
						
						<!-- 推荐标记 -->
						<view v-if="enableFIFO && batchList.indexOf(batch) === 0" class="recommend-badge">
							<text>推荐</text>
						</view>
					</view>
					
					<!-- 加载状态 -->
					<view v-if="loading" class="loading-hint">
						<text>加载中...</text>
					</view>
					
					<!-- 空状态 -->
					<view v-if="!loading && batchList.length === 0" class="empty-hint">
						<text>📦</text>
						<text>该药品暂无库存</text>
						<text class="empty-tip">请先进行入库操作</text>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	name: 'BatchSelector',
	props: {
		// 按钮文字
		buttonText: {
			type: String,
			default: '选择批次'
		},
		// 按钮类型
		buttonType: {
			type: String,
			default: 'info'
		},
		// 按钮尺寸
		buttonSize: {
			type: String,
			default: 'default'
		},
		// 药品ID
		drugId: {
			type: String,
			required: true
		},
		// 药品信息
		drugInfo: {
			type: Object,
			default: () => ({})
		},
		// 默认园区
		defaultLocation: {
			type: String,
			default: ''
		},
		// 是否显示园区过滤
		showLocationFilter: {
			type: Boolean,
			default: true
		},
		// 是否启用FIFO（先进先出）
		enableFIFO: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			visible: false,
			batchList: [],
			loading: false
		}
	},
	methods: {
		showDialog() {
			if (!this.drugId) {
				uni.showToast({
					title: '请先选择药品',
					icon: 'none'
				})
				return
			}
			
			this.visible = true
			this.batchList = []
			this.loadBatches()
		},
		
		handleClose() {
			this.visible = false
		},
		
		async loadBatches() {
			this.loading = true
			
			try {
				const result = await wx.cloud.callFunction({
					name: 'stockManage',
					data: {
						action: 'getBatchList',
						data: {
							drugId: this.drugId,
							location: this.defaultLocation || undefined,
							enableFIFO: this.enableFIFO
						}
					}
				})
				
				if (result.result.success) {
					this.batchList = result.result.data
				} else {
					throw new Error(result.result.message || '查询失败')
				}
			} catch (err) {
				console.error('加载批次失败:', err)
				uni.showToast({
					title: err.message || '加载失败',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		},
		
		selectBatch(batch) {
			// 检查库存
			if (batch.quantity <= 0) {
				uni.showToast({
					title: '该批次已无库存',
					icon: 'none'
				})
				return
			}
			
			// 近效期提示
			if (batch.isNearExpiry) {
				uni.showModal({
					title: '近效期提示',
					content: `该批次将于 ${batch.expireDate} 到期，是否继续使用？`,
					success: (res) => {
						if (res.confirm) {
							this.confirmSelect(batch)
						}
					}
				})
			} else {
				this.confirmSelect(batch)
			}
		},
		
		confirmSelect(batch) {
			this.$emit('select', batch)
			this.handleClose()
			
			uni.showToast({
				title: '已选择',
				icon: 'success',
				duration: 1000
			})
		},
		
		getLocationName(location) {
			const locationMap = {
				'land_park': '陆园',
				'water_park': '水园'
			}
			return locationMap[location] || location
		}
	}
}
</script>

<style lang="scss" scoped>
.batch-selector-popup {
	display: flex;
	flex-direction: column;
	height: 100%;
	background-color: #FFFFFF;
	border-radius: 20rpx;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1px solid #F0F0F0;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.close-btn {
	width: 50rpx;
	height: 50rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.close-icon {
	font-size: 40rpx;
	color: #999999;
}

.drug-info-bar {
	padding: 20rpx 30rpx;
	background-color: #F8F9FA;
	border-bottom: 1px solid #F0F0F0;
}

.info-row {
	display: flex;
	font-size: 26rpx;
	line-height: 40rpx;
}

.info-label {
	color: #999999;
	min-width: 100rpx;
}

.info-value {
	color: #333333;
	flex: 1;
}

.fifo-tip {
	display: flex;
	align-items: center;
	padding: 15rpx 30rpx;
	background-color: #E8F5E9;
	border-left: 4rpx solid #4CAF50;
	margin: 10rpx 30rpx;
	border-radius: 8rpx;
}

.tip-icon {
	font-size: 30rpx;
	margin-right: 10rpx;
}

.tip-text {
	font-size: 24rpx;
	color: #388E3C;
	flex: 1;
}

.batch-list {
	flex: 1;
	padding: 20rpx 30rpx;
}

.batch-item {
	position: relative;
	background-color: #FFFFFF;
	border: 2rpx solid #E0E0E0;
	border-radius: 15rpx;
	padding: 25rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.batch-item:active {
	background-color: #F5F5F5;
}

.expiry-badge {
	position: absolute;
	top: -10rpx;
	right: 20rpx;
	background-color: #FF9800;
	color: #FFFFFF;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	font-size: 22rpx;
	z-index: 1;
}

.recommend-badge {
	position: absolute;
	top: -10rpx;
	left: 20rpx;
	background: linear-gradient(135deg, #4CAF50, #66BB6A);
	color: #FFFFFF;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	font-size: 22rpx;
	z-index: 1;
}

.batch-main {
	position: relative;
}

.batch-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
}

.batch-number {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
	flex: 1;
}

.stock-quantity {
	font-size: 28rpx;
	font-weight: bold;
	color: #4CAF50;
	padding: 4rpx 12rpx;
	background-color: #E8F5E9;
	border-radius: 8rpx;
}

.stock-quantity.low-stock {
	color: #FF5722;
	background-color: #FFEBEE;
}

.batch-details {
	border-top: 1px solid #F0F0F0;
	padding-top: 15rpx;
}

.detail-row {
	display: flex;
	margin-bottom: 8rpx;
	font-size: 26rpx;
	line-height: 40rpx;
}

.detail-label {
	color: #999999;
	min-width: 160rpx;
}

.detail-value {
	color: #666666;
	flex: 1;
}

.detail-value.text-warning {
	color: #FF9800;
	font-weight: bold;
}

.loading-hint {
	text-align: center;
	padding: 50rpx;
	color: #999999;
	font-size: 26rpx;
}

.empty-hint {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 0;
	text-align: center;
}

.empty-hint text:first-child {
	font-size: 100rpx;
	margin-bottom: 20rpx;
}

.empty-hint text:nth-child(2) {
	font-size: 28rpx;
	color: #999999;
	margin-bottom: 10rpx;
}

.empty-tip {
	font-size: 24rpx;
	color: #CCCCCC;
}
</style>
