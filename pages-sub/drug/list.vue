<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-section">
			<u-search 
				v-model="keyword" 
				placeholder="搜索药材名称或拼音"
				:show-action="true"
				action-text="搜索"
				@search="onSearch"
				@custom="onSearch"
				@clear="onClear"
			></u-search>
		</view>
		
		<!-- 筛选条件 -->
		<view class="filter-section">
			<view class="filter-row">
				<text class="filter-label">分类：</text>
				<scroll-view class="filter-scroll" scroll-x>
					<view class="filter-buttons">
						<view 
							class="filter-btn"
							:class="{ 'active': filterCategory === 'all' }"
							@click="setFilter('all')"
						>全部</view>
						<view 
							class="filter-btn"
							:class="{ 'active': filterCategory === '抗生素' }"
							@click="setFilter('抗生素')"
						>抗生素</view>
						<view 
							class="filter-btn"
							:class="{ 'active': filterCategory === '心血管' }"
							@click="setFilter('心血管')"
						>心血管</view>
						<view 
							class="filter-btn"
							:class="{ 'active': filterCategory === '消化系统' }"
							@click="setFilter('消化系统')"
						>消化系统</view>
					</view>
				</scroll-view>
			</view>
			
			<view class="filter-row">
				<text class="filter-label">完整度：</text>
				<scroll-view class="filter-scroll" scroll-x>
					<view class="filter-buttons">
						<view 
							class="filter-btn"
							:class="{ 'active': filterCompleteness === 'all' }"
							@click="setCompletenessFilter('all')"
						>全部</view>
						<view 
							class="filter-btn incomplete"
							:class="{ 'active': filterCompleteness === 'incomplete' }"
							@click="setCompletenessFilter('incomplete')"
						>待完善</view>
						<view 
							class="filter-btn complete"
							:class="{ 'active': filterCompleteness === 'complete' }"
							@click="setCompletenessFilter('complete')"
						>已完善</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<!-- 药材列表 -->
		<view class="drug-list">
			<view 
				v-for="item in drugList" 
				:key="item._id" 
				class="drug-item"
				@click="handleItemClick(item)"
			>
				<view class="drug-header">
					<view class="drug-name-row">
						<view class="drug-name">
							{{ item.name }}
							<text v-if="item.isHighValue" class="drug-tag tag-high">高值</text>
							<text v-if="item.isEmergency" class="drug-tag tag-emergency">急救</text>
						</view>
						<!-- 完整度徽章 -->
						<view 
							v-if="item.completeness"
							class="completeness-badge"
							:class="{
								'complete': item.completeness.percentage === 100,
								'good': item.completeness.percentage >= 75 && item.completeness.percentage < 100,
								'medium': item.completeness.percentage >= 50 && item.completeness.percentage < 75,
								'low': item.completeness.percentage < 50
							}"
						>
							<text>{{ item.completeness.percentage }}%</text>
						</view>
					</view>
					<view class="drug-actions">
						<view class="action-btn edit-btn" @click.stop="editDrug(item)">
							<text>编辑</text>
						</view>
					</view>
				</view>
				
				<view class="drug-info">
					<view class="info-row">
						<text class="info-label">规格：</text>
						<text class="info-value">{{ item.spec || item.specification || '-' }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">单位：</text>
						<text class="info-value">{{ item.unit || item.packUnit || '-' }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">厂家：</text>
						<text class="info-value">{{ item.manufacturer || '-' }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">分类：</text>
						<text class="info-value">{{ item.category || '未分类' }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">条形码：</text>
						<text class="info-value">{{ item.barcode || '-' }}</text>
					</view>
				</view>
				
				<view class="drug-footer">
					<text class="stock-info">安全库存：{{ item.safeStock }}{{ item.unit }}</text>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view v-if="drugList.length === 0" class="empty-state">
				<u-empty text="暂无药材数据" mode="data"></u-empty>
			</view>
		</view>
		
		<!-- 加载更多 -->
		<view v-if="hasMore" class="load-more">
			<u-button 
				text="加载更多" 
				type="info" 
				plain 
				size="small"
				@click="loadMore"
				:loading="loading"
			></u-button>
		</view>
		
		<!-- 底部按钮 -->
		<view class="bottom-actions">
			<u-button 
				type="primary" 
				text="+ 添加药材"
				@click="addDrug"
			></u-button>
			<u-button 
				type="success" 
				text="批量导入"
				plain
				@click="batchImport"
			></u-button>
		</view>
	</view>
</template>

<script>
import Request from '@/utils/request.js'

export default {
	data() {
		return {
			keyword: '',
			filterCategory: 'all',
			filterCompleteness: 'all', // all: 全部, incomplete: 不完整, complete: 完整
			drugList: [],
			page: 1,
			pageSize: 20,
			hasMore: true,
			loading: false,
			mode: 'normal', // normal: 正常浏览, select: 选择模式
			returnPage: '' // 返回的页面路径
		}
	},
	
	onLoad(options) {
		this.mode = options.mode || 'normal'
		this.returnPage = options.returnPage || ''
		this.loadDrugList()
	},
	
	onPullDownRefresh() {
		this.refreshData()
	},
	
	methods: {
		// ⭐ 计算档案完整度
		calculateCompleteness(drug) {
			const fields = [
				drug.name,
				drug.spec || drug.specification,
				drug.unit || drug.packUnit,
				drug.manufacturer,
				drug.barcode,
				drug.approvalNumber,
				drug.category,
				drug.image
			]
			
			const filledCount = fields.filter(field => field && String(field).trim()).length
			const percentage = Math.round((filledCount / fields.length) * 100)
			
			return {
				percentage,
				filledCount,
				totalCount: fields.length,
				isComplete: percentage === 100
			}
		},
		
		async refreshData() {
			this.page = 1
			this.drugList = []
			this.hasMore = true
			await this.loadDrugList()
			uni.stopPullDownRefresh()
		},
		
		async loadDrugList() {
			if (this.loading) return
			
			this.loading = true
			
			try {
				// 从云数据库加载药材列表
				const db = wx.cloud.database()
				const _ = db.command
				
				// 构建查询条件
				let query = {}
				
				// 关键词搜索
				if (this.keyword) {
					query.name = db.RegExp({
						regexp: this.keyword,
						options: 'i'
					})
				}
				
				// 分类筛选
				if (this.filterCategory !== 'all') {
					query.category = this.filterCategory
				}
				
				// 查询数据
				const result = await db.collection('drugs')
					.where(query)
					.skip((this.page - 1) * this.pageSize)
					.limit(this.pageSize)
					.orderBy('createTime', 'desc')
					.get()
				
				// 计算每个药品的完整度
				const drugsWithCompleteness = result.data.map(drug => {
					const completeness = this.calculateCompleteness(drug)
					return {
						...drug,
						completeness
					}
				})
				
				// 完整度筛选
				let filteredDrugs = drugsWithCompleteness
				if (this.filterCompleteness === 'incomplete') {
					filteredDrugs = drugsWithCompleteness.filter(d => d.completeness.percentage < 100)
				} else if (this.filterCompleteness === 'complete') {
					filteredDrugs = drugsWithCompleteness.filter(d => d.completeness.percentage === 100)
				}
				
				if (this.page === 1) {
					this.drugList = filteredDrugs
				} else {
					this.drugList = [...this.drugList, ...filteredDrugs]
				}
				
				this.hasMore = result.data.length >= this.pageSize
				
			} catch (err) {
				console.error('加载药材列表失败:', err)
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		},
		
		loadMore() {
			if (!this.hasMore || this.loading) return
			this.page++
			this.loadDrugList()
		},
		
		onSearch() {
			this.page = 1
			this.drugList = []
			this.loadDrugList()
		},
		
		onClear() {
			this.keyword = ''
			this.onSearch()
		},
		
		setFilter(category) {
			this.filterCategory = category
			this.page = 1
			this.drugList = []
			this.loadDrugList()
		},
		
		setCompletenessFilter(type) {
			this.filterCompleteness = type
			this.page = 1
			this.drugList = []
			this.loadDrugList()
		},
		
		// 处理药材项点击
		handleItemClick(item) {
			if (this.mode === 'select') {
				// 选择模式：返回选中的药材信息
				this.selectDrug(item)
			} else {
				// 正常模式：进入详情页
				this.goToDetail(item)
			}
		},
		
		// 选择药材
		selectDrug(item) {
			// 使用全局事件总线传递选中的药材数据
			uni.$emit('drugSelected', {
				_id: item._id,
				drugCode: item.barcode || '',
				name: item.name,
				specification: item.spec,
				unit: item.unit,
				manufacturer: item.manufacturer,
				category: item.category,
				isHighValue: item.isHighValue,
				isEmergency: item.isEmergency,
				packUnit: item.unit
			})
			
			// 返回上一页
			uni.navigateBack()
		},
		
		goToDetail(item) {
			uni.navigateTo({
				url: `/pages-sub/drug/detail?id=${item._id}`
			})
		},
		
		addDrug() {
			uni.navigateTo({
				url: '/pages-sub/drug/add'
			})
		},
		
		editDrug(item) {
			uni.navigateTo({
				url: `/pages-sub/drug/detail?id=${item._id}`
			})
		},
		
		batchImport() {
			uni.showToast({
				title: '批量导入功能开发中',
				icon: 'none'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	/* 使用统一的蓝色渐变背景 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding: 24rpx 24rpx 140rpx;
}

.search-section {
	max-width: 702rpx;
	margin: 10rpx auto 8rpx;
	background-color: #FFFFF0;
	border-radius: 22rpx;
	padding: 18rpx 20rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.filter-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 20rpx 20rpx 16rpx;
	background-color: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.filter-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.filter-label {
	font-size: 26rpx;
	color: #666;
	white-space: nowrap;
	font-weight: 500;
}

.filter-scroll {
	flex: 1;
	white-space: nowrap;
}

.filter-buttons {
	display: inline-flex;
	gap: 10rpx;
}

.filter-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 10rpx 24rpx;
	background: #f7f8fa;
	border-radius: 20rpx;
	font-size: 24rpx;
	color: #646566;
	transition: all 0.3s;
	white-space: nowrap;
	
	&:active {
		transform: scale(0.95);
	}
	
	&.active {
		background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
		color: white;
		font-weight: 500;
	}
	
	&.incomplete.active {
		background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
	}
	
	&.complete.active {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	}
}

.drug-list {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.drug-item {
	background-color: #FFFFF0;
	border-radius: 18rpx;
	padding: 22rpx 24rpx 18rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.drug-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1px solid #F0F0F0;
	gap: 12rpx;
}

.drug-name-row {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.drug-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	display: flex;
	align-items: center;
	gap: 10rpx;
	flex-wrap: wrap;
}

.completeness-badge {
	display: inline-flex;
	align-items: center;
	padding: 6rpx 16rpx;
	border-radius: 16rpx;
	font-size: 22rpx;
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

.drug-tag {
	font-size: 20rpx;
	padding: 4rpx 10rpx;
	border-radius: 8rpx;
	font-weight: normal;
}

.tag-high {
	background-color: #FFF3E0;
	color: #FF9800;
}

.tag-emergency {
	background-color: #FFEBEE;
	color: #F44336;
}

.drug-actions {
	display: flex;
	gap: 10rpx;
	flex-shrink: 0;
}

.action-btn {
	padding: 10rpx 20rpx;
	border-radius: 16rpx;
	font-size: 24rpx;
	transition: all 0.3s;
	
	&:active {
		transform: scale(0.95);
	}
	
	&.edit-btn {
		background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
		color: white;
		font-weight: 500;
	}
}

.drug-info {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
	margin-bottom: 20rpx;
}

.info-row {
	display: flex;
	align-items: center;
	font-size: 26rpx;
}

.info-label {
	color: #999999;
	min-width: 140rpx;
}

.info-value {
	color: #333333;
	flex: 1;
}

.drug-footer {
	padding-top: 15rpx;
	border-top: 1px solid #F0F0F0;
}

.stock-info {
	font-size: 24rpx;
	color: #3cc51f;
}

.empty-state {
	padding: 100rpx 0;
}

.load-more {
	padding: 30rpx 0;
	text-align: center;
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






























