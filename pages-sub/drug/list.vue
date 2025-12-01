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
			<u-button 
				size="small" 
				:type="filterCategory === 'all' ? 'primary' : 'default'"
				@click="setFilter('all')"
			>全部</u-button>
			<u-button 
				size="small" 
				:type="filterCategory === '抗生素' ? 'primary' : 'default'"
				@click="setFilter('抗生素')"
			>抗生素</u-button>
			<u-button 
				size="small" 
				:type="filterCategory === '心血管' ? 'primary' : 'default'"
				@click="setFilter('心血管')"
			>心血管</u-button>
			<u-button 
				size="small" 
				:type="filterCategory === '消化系统' ? 'primary' : 'default'"
				@click="setFilter('消化系统')"
			>消化系统</u-button>
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
					<view class="drug-name">
						{{ item.name }}
						<text v-if="item.isHighValue" class="drug-tag tag-high">高值</text>
						<text v-if="item.isEmergency" class="drug-tag tag-emergency">急救</text>
					</view>
					<view class="drug-actions">
						<u-button 
							size="mini" 
							type="primary" 
							text="编辑"
							@click.stop="editDrug(item)"
						></u-button>
					</view>
				</view>
				
				<view class="drug-info">
					<view class="info-row">
						<text class="info-label">规格：</text>
						<text class="info-value">{{ item.spec }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">单位：</text>
						<text class="info-value">{{ item.unit }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">厂家：</text>
						<text class="info-value">{{ item.manufacturer }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">分类：</text>
						<text class="info-value">{{ item.category || '未分类' }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">条形码：</text>
						<text class="info-value">{{ item.barcode }}</text>
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
				// TODO: 从云数据库加载药材列表
				// 模拟数据
				const mockData = [
					{
						_id: 'drug_001',
						name: '阿莫西林胶囊',
						pinyin: 'AMXLJN',
						spec: '0.25g*24粒',
						unit: '盒',
						manufacturer: 'XX制药有限公司',
						category: '抗生素',
						barcode: '6901234567890',
						isHighValue: false,
						isEmergency: false,
						safeStock: 100,
						minStock: 50
					},
					{
						_id: 'drug_002',
						name: '头孢克肟颗粒',
						pinyin: 'TBKMPJ',
						spec: '0.5g*12袋',
						unit: '盒',
						manufacturer: 'YY制药',
						category: '抗生素',
						barcode: '6901234567891',
						isHighValue: false,
						isEmergency: false,
						safeStock: 100,
						minStock: 50
					},
					{
						_id: 'drug_003',
						name: '肾上腺素注射液',
						pinyin: 'SSXSZSY',
						spec: '1ml:1mg',
						unit: '支',
						manufacturer: 'ZZ制药',
						category: '急救药材',
						barcode: '6901234567892',
						isHighValue: true,
						isEmergency: true,
						safeStock: 30,
						minStock: 10
					}
				]
				
				if (this.page === 1) {
					this.drugList = mockData
				} else {
					this.drugList = [...this.drugList, ...mockData]
				}
				
				this.hasMore = mockData.length >= this.pageSize
				
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
				url: `/pages-sub/drug/add?id=${item._id}`
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
	padding: 12rpx 16rpx 10rpx;
	background-color: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
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
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1px solid #F0F0F0;
}

.drug-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	display: flex;
	align-items: center;
	gap: 10rpx;
	flex: 1;
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






























