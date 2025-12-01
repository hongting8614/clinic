<template>
	<view class="page">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input-wrapper">
				<text class="search-icon">🔍</text>
				<input 
					class="search-input" 
					v-model="searchKeyword"
					placeholder="搜索药材名称/代码"
					@input="onSearchInput"
					confirm-type="search"
				/>
				<text v-if="searchKeyword" class="clear-icon" @click="clearSearch">✕</text>
			</view>
		</view>

		<!-- 筛选条件 -->
		<view class="filter-bar">
			<view class="filter-item" @click="showCategoryPicker = true">
				<text>{{ selectedCategory || '全部分类' }}</text>
				<text class="arrow">›</text>
			</view>
		</view>

		<!-- 药材列表（点击直接显示批次） -->
		<view class="drug-list">
			<view 
				v-for="drug in filteredDrugList" 
				:key="drug._id" 
				class="drug-card"
				@tap="selectDrug(drug)"
			>
				<!-- 药材主要信息 -->
				<view class="drug-main">
					<view class="drug-header">
						<text class="drug-name">{{ drug.name }}</text>
						<view class="drug-badges">
							<text v-if="drug.isHighValue" class="badge high-value">高值</text>
							<text v-if="drug.isEmergency" class="badge emergency">急救</text>
						</view>
					</view>
					
					<view class="drug-details">
						<view class="detail-row">
							<text class="detail-label">规格：</text>
							<text class="detail-value">{{ drug.specification }}</text>
						</view>
						<view class="detail-row">
							<text class="detail-label">单位：</text>
							<text class="detail-value">{{ drug.unit }}</text>
						</view>
						<view v-if="drug.drugCode" class="detail-row">
							<text class="detail-label">代码：</text>
							<text class="detail-value">{{ drug.drugCode }}</text>
						</view>
						<view v-if="drug.manufacturer" class="detail-row">
							<text class="detail-label">厂家：</text>
							<text class="detail-value">{{ drug.manufacturer }}</text>
						</view>
					</view>
				</view>
				
				<!-- 右侧操作提示 -->
				<view class="drug-action">
					<view class="action-icon">📦</view>
					<text class="action-text">选择批次</text>
					<text class="action-arrow">›</text>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-if="filteredDrugList.length === 0" class="empty-state">
				<text class="empty-icon">📦</text>
				<text class="empty-text">{{ searchKeyword ? '未找到相关药材' : '暂无药材数据' }}</text>
			</view>

			<!-- 加载状态 -->
			<view v-if="loading" class="loading-state">
				<text>加载中...</text>
			</view>
		</view>

			<!-- 批次选择弹窗 -->
		<view v-if="showBatchSelector" class="batch-popup-mask" @tap="closeBatchSelector">
			<view class="batch-popup" @tap.stop>
				<view class="popup-header">
					<text class="popup-title">选择批次</text>
					<view class="close-btn" @tap="closeBatchSelector">✕</view>
				</view>
				<view v-if="selectedDrug" class="drug-info-bar">
					<text>药材：{{ selectedDrug.name }}</text>
					<text>规格：{{ selectedDrug.specification }}</text>
				</view>
				<view class="batch-list-container">
					<view v-if="loading" class="loading-hint">加载中...</view>
					<view v-else-if="batchList.length === 0" class="empty-hint">
						<text>📦</text>
						<text>该药材暂无库存</text>
					</view>
					<view v-else>
						<view 
							v-for="batch in batchList" 
							:key="batch._id"
							class="batch-item"
							@tap="selectBatch(batch)"
						>
							<view class="batch-header">
								<text class="batch-number">批号：{{ batch.batch }}</text>
								<text class="stock-quantity">库存：{{ batch.quantity }} {{ selectedDrug.unit }}</text>
							</view>
							<view class="batch-details">
								<text>生产日期：{{ batch.productionDate }}</text>
								<text>有效期至：{{ batch.expireDate }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 分类选择器 -->
		<picker 
			v-if="showCategoryPicker"
			:value="categoryIndex"
			:range="categories"
			@change="onCategoryChange"
			@cancel="showCategoryPicker = false"
		>
		</picker>
	</view>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			drugList: [],
			filteredDrugList: [],
			searchKeyword: '',
			categories: ['全部分类', '西药', '中成药', '中药饮片', '医疗器械'],
			categoryIndex: 0,
			selectedCategory: '',
			showCategoryPicker: false,
			// 改为单选模式，选中后立即显示批次
			selectedDrug: null,
			showBatchSelector: false,
			batchList: []
		}
	},
	
	onLoad() {
		this.loadDrugList()
	},
	
	methods: {
		async loadDrugList() {
			this.loading = true
			try {
				// 查询所有有库存的药材
				const db = wx.cloud.database()
				const stockResult = await db.collection('stock')
					.where({
						quantity: db.command.gt(0)  // 库存大于0
					})
					.get()
				
				if (!stockResult.data || stockResult.data.length === 0) {
					this.drugList = []
					this.filteredDrugList = []
					uni.showToast({
						title: '暂无库存药材',
						icon: 'none'
					})
					return
				}
				
				// 获取有库存的药材ID列表
				const drugIds = [...new Set(stockResult.data.map(item => item.drugId))]
				
				// 查询这些药材的详细信息
				const result = await this.$api.callFunction('getDrugList', {
					keyword: '',
					category: 'all',
					page: 1,
					pageSize: 1000
				})
				
				if (result.success) {
					// 只保留有库存的药材
					this.drugList = (result.data || []).filter(drug => 
						drugIds.includes(drug._id)
					)
					this.filteredDrugList = this.drugList
					
					console.log(`加载了 ${this.drugList.length} 种有库存的药材`)
				} else {
					throw new Error(result.message || '加载失败')
				}
			} catch (err) {
				console.error('加载药材列表失败:', err)
				uni.showToast({
					title: err.message || '加载失败',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		},
		
		onSearchInput() {
			this.filterDrugs()
		},
		
		clearSearch() {
			this.searchKeyword = ''
			this.filterDrugs()
		},
		
		filterDrugs() {
			let list = this.drugList
			
			// 按分类筛选
			if (this.selectedCategory && this.selectedCategory !== '全部分类') {
				list = list.filter(drug => drug.category === this.selectedCategory)
			}
			
			// 按关键词筛选
			if (this.searchKeyword) {
				const keyword = this.searchKeyword.toLowerCase()
				list = list.filter(drug => {
					return (
						(drug.name && drug.name.toLowerCase().includes(keyword)) ||
						(drug.drugCode && drug.drugCode.toLowerCase().includes(keyword)) ||
						(drug.pinyin && drug.pinyin.toLowerCase().includes(keyword))
					)
				})
			}
			
			this.filteredDrugList = list
		},
		
		onCategoryChange(e) {
			this.categoryIndex = e.detail.value
			this.selectedCategory = this.categories[this.categoryIndex]
			if (this.selectedCategory === '全部分类') {
				this.selectedCategory = ''
			}
			this.showCategoryPicker = false
			this.filterDrugs()
		},
		
		// 点击药材卡片，显示批次选择
		async selectDrug(drug) {
			this.selectedDrug = drug
			this.showBatchSelector = true
			this.loading = true
			
			try {
				const result = await wx.cloud.callFunction({
					name: 'stockManage',
					data: {
						action: 'getBatchList',
						data: {
							drugId: drug._id,
							location: 'drug_storage',
							enableFIFO: true
						}
					}
				})
				
				if (result.result.success) {
					this.batchList = result.result.data
				}
			} catch (err) {
				console.error('加载批次失败:', err)
				uni.showToast({ title: '加载批次失败', icon: 'none' })
			} finally {
				this.loading = false
			}
		},
		
		// 选择批次，带着药材和批次信息返回
		selectBatch(batch) {
			const drugWithBatch = {
				...this.selectedDrug,
				batch: batch.batch,
				batchId: batch._id,
				expireDate: batch.expireDate,
				productionDate: batch.productionDate,
				stockQuantity: batch.quantity,
				price: batch.price || 0,
				isNearExpiry: batch.isNearExpiry || false
			}
			
			// 保存到缓存（数组格式，保持兼容）
			uni.setStorageSync('selectedDrugsForOut', [drugWithBatch])
			
			uni.showToast({
				title: '已添加到出库单',
				icon: 'success',
				duration: 1000
			})
			
			setTimeout(() => {
				uni.navigateBack()
			}, 1000)
		},
		
		closeBatchSelector() {
			this.showBatchSelector = false
			this.selectedDrug = null
			this.batchList = []
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	/* 与出入库页面统一的蓝色渐变背景 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding: 24rpx 24rpx 120rpx;
}

.search-bar {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	background: #ffffff;
	padding: 18rpx 22rpx;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	
	.search-input-wrapper {
		display: flex;
		align-items: center;
		background: #f5f5f5;
		border-radius: 40rpx;
		padding: 0 30rpx;
		height: 70rpx;
		
		.search-icon {
			font-size: 32rpx;
			margin-right: 15rpx;
		}
		
		.search-input {
			flex: 1;
			font-size: 28rpx;
		}
		
		.clear-icon {
			font-size: 32rpx;
			color: #999;
			padding: 10rpx;
		}
	}
}

.filter-bar {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	background: #ffffff;
	padding: 18rpx 22rpx;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	display: flex;
	align-items: center;
	
	.filter-item {
		display: flex;
		align-items: center;
		padding: 10rpx 20rpx;
		background: #f5f5f5;
		border-radius: 8rpx;
		font-size: 28rpx;
		
		.arrow {
			margin-left: 10rpx;
			font-size: 32rpx;
			color: #999;
		}
	}
}

.drug-list {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 0;
}

// 新的药材卡片样式
.drug-card {
	background: #FFFFF0;
	border-radius: 18rpx;
	margin-bottom: 8rpx;
	padding: 25rpx 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
	transition: all 0.3s;
	position: relative;
	overflow: hidden;
	
	&:active {
		transform: scale(0.98);
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	}
	
	// 背景渐变提示
	&::after {
		content: '';
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		width: 120rpx;
		background: linear-gradient(90deg, rgba(33, 150, 243, 0) 0%, rgba(33, 150, 243, 0.05) 100%);
		pointer-events: none;
	}
}

.drug-main {
	flex: 1;
	margin-right: 20rpx;
}

.drug-header {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.drug-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-right: 15rpx;
}

.drug-badges {
	display: flex;
	gap: 8rpx;
	
	.badge {
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		font-size: 20rpx;
		
		&.high-value {
			background: #fff3e0;
			color: #ff9800;
		}
		
		&.emergency {
			background: #ffebee;
			color: #f44336;
		}
	}
}

.drug-details {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.detail-row {
	display: flex;
	align-items: center;
	font-size: 24rpx;
}

.detail-label {
	color: #999;
	min-width: 80rpx;
}

.detail-value {
	color: #666;
	flex: 1;
}

// 右侧操作提示区域
.drug-action {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 18rpx 26rpx;
	background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
	border-radius: 999rpx;
	min-width: 140rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 160, 255, 0.25);
	z-index: 1;
}

.action-icon {
	display: none;
}

.action-text {
	font-size: 22rpx;
	color: #fff;
	margin-bottom: 2rpx;
	font-weight: 500;
}

.action-arrow {
	font-size: 28rpx;
	color: #fff;
	font-weight: bold;
}

// 保留旧的drug-item样式以防止兼容性问题
.drug-item {
	background: #fff;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	transition: all 0.3s;
	
	&.selected {
		border: 2rpx solid #07c160;
	}
	
	.drug-item-label {
			display: flex;
			padding: 30rpx;
			
			.drug-checkbox {
				margin-right: 20rpx;
				transform: scale(1.2);
			}
			
			.drug-content {
				flex: 1;
				
				.drug-header {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 15rpx;
					
					.drug-name {
						font-size: 32rpx;
						font-weight: bold;
						color: #333;
					}
					
					.drug-badges {
						display: flex;
						gap: 10rpx;
						
						.badge {
							padding: 4rpx 12rpx;
							border-radius: 8rpx;
							font-size: 20rpx;
							
							&.high-value {
								background: #fff3e0;
								color: #ff9800;
							}
							
							&.emergency {
								background: #ffebee;
								color: #f44336;
							}
						}
					}
				}
				
				.drug-info {
					display: flex;
					flex-direction: column;
					gap: 8rpx;
					margin-bottom: 10rpx;
					
					.info-text {
						font-size: 24rpx;
						color: #666;
					}
				}
				
				.drug-manufacturer {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
	}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 0;
	
	.empty-icon {
		font-size: 120rpx;
		margin-bottom: 20rpx;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999;
	}
}

.loading-state {
	text-align: center;
	padding: 40rpx 0;
	font-size: 28rpx;
	color: #999;
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	padding: 20rpx 30rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 100;
	
	.selected-count {
		font-size: 28rpx;
		color: #666;
		
		.count-num {
			color: #07c160;
			font-weight: bold;
			font-size: 32rpx;
		}
	}
	
	.action-buttons {
		display: flex;
		gap: 20rpx;
		
		.btn {
			padding: 16rpx 40rpx;
			border-radius: 40rpx;
			font-size: 28rpx;
			border: none;
			
			&.btn-cancel {
				background: #f5f5f5;
				color: #666;
			}
			
			&.btn-confirm {
				background: #07c160;
				color: #fff;
			}
		}
	}
}

// 药材卡片右侧箭头
.drug-arrow {
	font-size: 40rpx;
	color: #999;
	margin-left: 10rpx;
}

// 批次选择弹窗
.batch-popup-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.batch-popup {
	width: 90%;
	max-height: 70%;
	background: #fff;
	border-radius: 20rpx;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1px solid #f0f0f0;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
}

.close-btn {
	font-size: 36rpx;
	color: #999;
	padding: 0 10rpx;
}

.drug-info-bar {
	padding: 20rpx 30rpx;
	background: #f7f8fa;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	font-size: 26rpx;
	color: #666;
}

.batch-list-container {
	flex: 1;
	overflow-y: auto;
	padding: 20rpx 30rpx;
}

.batch-item {
	background: #fff;
	border: 2rpx solid #e0e0e0;
	border-radius: 15rpx;
	padding: 25rpx;
	margin-bottom: 20rpx;
	
	&:active {
		background: #f7f8fa;
	}
}

.batch-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 15rpx;
}

.batch-number {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.stock-quantity {
	font-size: 28rpx;
	color: #FF6B6B;
	font-weight: bold;
}

.batch-details {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	font-size: 24rpx;
	color: #666;
}

.loading-hint, .empty-hint {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 0;
	color: #999;
	font-size: 26rpx;
	
	text:first-child {
		font-size: 60rpx;
		margin-bottom: 15rpx;
	}
}
</style>
