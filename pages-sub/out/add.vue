<template>
	<view class="page">
		<!-- 页面头部：与入库单保持一致风格 -->
		<view class="page-header">
			<view class="header-content">
				<text class="header-title">药材出库</text>
				<text class="header-subtitle">出库日期：{{ currentDate }}</text>
			</view>
		</view>
		
		<!-- 基本信息卡片：对齐入库单布局 -->
		<view class="info-card">
			<view class="info-row">
				<view class="info-item">
					<text class="label">单号：</text>
					<text class="value">{{ recordNo || '自动生成' }}</text>
				</view>
				<view class="info-item">
					<text class="label">发放人：</text>
					<text class="value">{{ dispenser }}</text>
				</view>
			</view>
			<view class="info-row">
				<view class="info-item">
					<text class="label">出库到园区：<text class="required">*</text></text>
					<picker 
						:range="locations" 
						range-key="label"
						:value="locationIndex"
						@change="onLocationChange"
					>
						<view class="picker-input">
							<text class="value">{{ currentLocation.label }}</text>
							<text class="picker-arrow">›</text>
						</view>
					</picker>
				</view>
				<view class="info-item">
					<text class="label">园区请领：</text>
					<picker 
						:range="requestAreas" 
						range-key="label"
						:value="requestAreaIndex"
						@change="onRequestAreaChange"
					>
						<view class="picker-input">
							<text class="value">{{ currentRequestArea.label }}</text>
							<text class="picker-arrow">›</text>
						</view>
					</picker>
				</view>
			</view>
			<view class="info-row">
				<view class="info-item full">
					<text class="label">备注</text>
					<input 
						class="input-value" 
						v-model="remark" 
						placeholder="请输入备注信息（选填）"
						placeholder-class="placeholder"
					/>
				</view>
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
				<view class="add-drug-btn" @click="goSelectDrug">
					<text class="btn-icon">➕</text>
					<text class="btn-text">添加药材</text>
				</view>
			</view>
			
			<!-- 药材列表 -->
			<view class="drug-list">
				<view 
					v-for="(item, index) in drugList" 
					:key="index" 
					class="drug-item"
				>
					<!-- 药材头部 -->
					<view class="drug-header">
						<view class="drug-title-row">
							<view class="drug-badges">
								<text v-if="item.isHighValue" class="badge high-value">高值</text>
								<text v-if="item.isEmergency" class="badge emergency">急救</text>
							</view>
							<text class="drug-name">{{ item.drugName }}</text>
						</view>
						<view class="drug-delete" @click="deleteDrug(index)">删除</view>
					</view>
					
					<!-- 规格单位合并一行 -->
					<view class="drug-spec-row">
						<text class="spec-icon">📦</text>
						<text class="spec-text">{{ item.specification || item.spec }}</text>
						<text class="spec-divider">·</text>
						<text class="unit-text">单位: {{ item.unit }}</text>
					</view>
					
					<!-- 药材代码（如有） -->
					<view v-if="item.drugCode" class="drug-code-row">
						<text class="code-icon">🏷️</text>
						<text class="code-text">代码: {{ item.drugCode }}</text>
					</view>
					
					<!-- 调试信息：显示drugId -->
					<view class="drug-debug-row" style="font-size: 20rpx; color: #999; padding: 5rpx 0;">
						<text>🔍 drugId: {{ item.drugId || '❌ 无' }}</text>
					</view>
					
					<view class="drug-input-section">
					<!-- FIFO自动分配结果展示 -->
					<view v-if="item.batchAllocation && item.batchAllocation.length > 0" class="batch-allocation-result">
						<view class="allocation-header">
							<text class="allocation-title">✅ 已自动分配 {{ item.batchCount }} 个批次</text>
							<text v-if="item.hasNearExpiry" class="near-expiry-tag">⚠️ 含近效期</text>
						</view>
						
						<view class="allocation-list">
							<view 
								v-for="(batch, bIndex) in item.batchAllocation" 
								:key="bIndex"
								class="allocation-item"
								:class="{ 'near-expiry': batch.isNearExpiry }"
							>
								<view class="allocation-row">
									<text class="allocation-label">批号：</text>
									<text class="allocation-value">{{ batch.batch }}</text>
									<text class="allocation-quantity">{{ batch.quantity }} {{ item.unit }}</text>
								</view>
								<view class="allocation-row">
									<text class="allocation-label">有效期：</text>
									<text class="allocation-value" :class="{ 'text-warning': batch.isNearExpiry }">
										{{ batch.expireDate }}
										<text v-if="batch.isNearExpiry" class="days-hint">({{ batch.daysToExpire }}天后到期)</text>
									</text>
								</view>
							</view>
						</view>
						
						<view class="allocation-actions">
							<text class="action-btn" @tap="clearAllocation(index)">🔄 重新分配</text>
						</view>
					</view>
					
					<!-- 批次信息（手动选中单个批次） -->
					<view v-else-if="item.batch" class="batch-info-selected">
						<view class="batch-info-row">
							<text class="batch-label">批号：</text>
							<text class="batch-value">{{ item.batch }}</text>
						</view>
						<view class="batch-info-row">
							<text class="batch-label">⏰ 有效期：</text>
							<text class="batch-value">{{ item.expireDate }}</text>
						</view>
						<view class="batch-info-row">
							<text class="batch-label">📊 库存：</text>
							<text class="batch-value">{{ item.stockQuantity }} {{ item.unit }}</text>
						</view>
					</view>
					
					<!-- 批次选择按钮（未选中时显示） -->
					<view v-else class="batch-select-row">
						<batch-selector
							button-text="🔍 手动选择批次"
							button-type="info"
							button-size="small"
							:drug-id="item.drugId"
							:drug-info="{ name: item.drugName, specification: item.specification || item.spec, unit: item.unit }"
							:show-location-filter="false"
							:default-location="'drug_storage'"
							:enable-f-i-f-o="true"
							@select="(batch) => onBatchSelect(index, batch)"
						></batch-selector>
					</view>
						
						<!-- 出库数量 -->
						<view class="input-row">
							<text class="input-label">出库数量 *</text>
							<input 
								class="input-field" 
								v-model.number="item.quantity" 
								type="number"
								:placeholder="`最多${item.stockQuantity || 0}`"
								@blur="onQuantityBlur(index)"
								@input="onQuantityInput(index)"
							/>
							<text class="input-unit">{{ item.unit }}</text>
						</view>
						
						<!-- 自动分配按钮 -->
						<view v-if="item.quantity && item.quantity > 0 && !item.batchAllocation" class="auto-allocate-hint">
							<text class="hint-icon">💡</text>
							<text class="hint-text">输入数量后自动FIFO分配批次</text>
							<text class="action-link" @tap="autoAllocateBatch(index)">立即分配</text>
						</view>
					
					<!-- 单位转换提示 -->
					<view v-if="item.quantity && item.conversionRate && item.conversionRate > 1" class="convert-hint">
						<text class="hint-icon">🔄</text>
						<text class="hint-text">
							将转换为 {{ (item.quantity * item.conversionRate).toFixed(2) }} {{ item.minUnit }} 存入{{ currentLocation.label }}
						</text>
					</view>
						
						<!-- 高值药材金额提示 -->
						<view v-if="item.isHighValue && item.quantity && item.price" class="amount-hint">
							<text class="amount-label">金额：</text>
							<text class="amount-value">¥{{ (item.quantity * item.price).toFixed(2) }}</text>
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
			<view class="section-title">发放人签名 *</view>
			<signature 
				v-model="dispenserSign"
				title="发放人签名"
			></signature>
		</view>
		
		<!-- 底部按钮 -->
		<view class="bottom-actions">
			<view class="bottom-btn btn-secondary" @click="saveDraft">
				<text>保存草稿</text>
			</view>
			<view class="bottom-btn btn-primary" @click="submitReview">
				<text>提交复核</text>
			</view>
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
			currentDate: '',
			dispenser: '',
			remark: '',
			locationIndex: 0,
			locations: [
				{ label: '陆园', value: 'land_park' },
				{ label: '水园', value: 'water_park' }
			],
			// 当前选择的发往园区（目的地），总库固定为 drug_storage
			currentLocation: { label: '陆园', value: 'land_park' },
			requestAreaIndex: 0,
			requestAreas: [
				{ label: '不选择', value: '' },
				// 以下示例表示项目/部门等非医务单位，请根据实际需要调整
				{ label: '陆园项目组', value: 'land_project' },
				{ label: '水园项目组', value: 'water_project' }
			],
			currentRequestArea: { label: '不选择', value: '' },
			drugList: [],
			dispenserSign: ''
		}
	},
	
	onLoad(options) {
		// 清空上次的药材明细
		this.drugList = []
		// 清空可能残留的缓存
		uni.removeStorageSync('selectedDrugsForOut')
		// 初始化页面
		this.initPage()
	},
	
	onShow() {
		// 从选择药材页面返回时，接收选中的药材数据
		const selectedDrugs = uni.getStorageSync('selectedDrugsForOut')
		
		if (selectedDrugs && selectedDrugs.length > 0) {
			console.log('=== 出库页面 onShow ===')
			console.log('从缓存读取的药材数量:', selectedDrugs.length)
			
			// 合并新选择的药材，避免重复
			selectedDrugs.forEach((drug, index) => {
				console.log(`药材${index + 1}:`, drug.name || drug.drugName)
				console.log(`  - drug._id: ${drug._id}`)
				console.log(`  - drug.drugId: ${drug.drugId || '无'}`)
				console.log(`  - 完整数据:`, drug)
			
			const exists = this.drugList.find(item => item.drugId === drug.drugId)
			if (!exists) {
				// 初始化药材数据结构
				const finalDrugId = drug._id || drug.drugId
				console.log(`  - 最终使用的 drugId: ${finalDrugId}`)
				
				this.drugList.push({
					drugId: finalDrugId,
					drugCode: drug.drugCode || '',
					drugName: drug.name || drug.drugName,
					specification: drug.specification || drug.spec || '',
					spec: drug.specification || drug.spec || '',
					unit: drug.unit || '',
					manufacturer: drug.manufacturer || '',
					isHighValue: drug.isHighValue || false,
					isEmergency: drug.isEmergency || false,
					// 批次相关信息（使用从选择药材页面传来的数据）
					batch: drug.batch || '',
					batchId: drug.batchId || '',
					expireDate: drug.expireDate || '',
					productionDate: drug.productionDate || '',
					stockQuantity: drug.stockQuantity || 0,
					price: drug.price || 0,
					quantity: '',
					// 单位转换信息
					conversionRate: drug.conversionRate || 1,
					minUnit: drug.minUnit || drug.unit || '',
					isNearExpiry: drug.isNearExpiry || false
				})
			}
		})
		
		console.log('当前药材列表:', this.drugList)
		
		// 清除缓存
		uni.removeStorageSync('selectedDrugsForOut')
	}
},
	
	methods: {
		initPage() {
			// 生成出库单号
			this.recordNo = Common.generateRecordNo('CK')
			// 当前时间与日期
			const now = new Date()
			this.currentTime = Common.formatDate(now, 'YYYY-MM-DD HH:mm')
			this.currentDate = Common.formatDate(now, 'YYYY-MM-DD')
			// 获取当前用户
			const userInfo = uni.getStorageSync('userInfo')
			this.dispenser = userInfo?.name || '未登录'
		},
		
		onLocationChange(e) {
			this.locationIndex = e.detail.value
			this.currentLocation = this.locations[this.locationIndex]
		},
		
		onRequestAreaChange(e) {
			this.requestAreaIndex = e.detail.value
			this.currentRequestArea = this.requestAreas[this.requestAreaIndex]
		},
		
		// 选择药材（保持原有逻辑占位）
		goSelectDrug() {
			// 这里复用原来跳转选择药材页面的逻辑
			uni.navigateTo({ url: '/pages-sub/out/select-drug' })
		},
		// 构建带包装单位的完整规格，供云函数解析。如：10ml×9支/盒
		buildSpecification(drug) {
			const base = drug.specification || drug.spec || ''
			if (!base) return ''
			if (base.includes('/') || base.includes('／')) return base
			if (drug.unit) return `${base}/${drug.unit}`
			return base
		},
		
		// 删除一行药材
		deleteDrug(index) {
			this.drugList.splice(index, 1)
		},
		
		// 批次选择回调
		onBatchSelect(index, batch) {
			const item = this.drugList[index]
			if (!item) return
			item.batch = batch.batch
			item.batchId = batch._id
			item.expireDate = batch.expireDate
			item.stockQuantity = batch.quantity
			item.price = batch.price || item.price || 0
			item.isNearExpiry = batch.isNearExpiry || false
		},
		
		// 校验数量不能超过库存
		validateQuantity(index) {
			const item = this.drugList[index]
			if (!item) return
			const max = Number(item.stockQuantity || 0)
			const val = Number(item.quantity || 0)
			if (val <= 0 || !Number.isFinite(val)) {
				item.quantity = ''
				return
			}
			if (val > max) {
				item.quantity = max
				uni.showToast({
					title: '数量不能超过库存',
					icon: 'none'
				})
			}
		},
		
		// 数量输入事件（实时触发）
		onQuantityInput(index) {
			const item = this.drugList[index]
			if (!item) return
			
			// 清除之前的定时器
			if (this.quantityInputTimer) {
				clearTimeout(this.quantityInputTimer)
			}
			
			// 防抖处理，500ms后自动触发分配
			this.quantityInputTimer = setTimeout(() => {
				if (item.quantity && item.quantity > 0 && !item.batchAllocation) {
					// 自动触发FIFO分配
					this.autoAllocateBatch(index)
				}
			}, 500)
		},
		
		// 数量失焦事件
		onQuantityBlur(index) {
			this.validateQuantity(index)
			
			// 如果还没有分配批次，提示用户
			const item = this.drugList[index]
			if (item && item.quantity > 0 && !item.batchAllocation && !item.batch) {
				uni.showToast({
					title: '请点击"立即分配"按钮分配批次',
					icon: 'none',
					duration: 2000
				})
			}
		},
		
		// 清除分配结果
		clearAllocation(index) {
			const item = this.drugList[index]
			if (!item) return
			
			this.$set(item, 'batchAllocation', [])
			this.$set(item, 'batchCount', 0)
			this.$set(item, 'hasNearExpiry', false)
			
			uni.showToast({
				title: '已清除分配结果',
				icon: 'success',
				duration: 1000
			})
		},
		
		// FIFO自动分配批次 ⭐ 使用旧方案（性能更优）
		async autoAllocateBatch(index) {
			const item = this.drugList[index]
			
			if (!item) return
			
			// 如果数量为空或无效，清空分配结果
			if (!item.quantity || item.quantity <= 0) {
				this.$set(item, 'batchAllocation', [])
				this.$set(item, 'batchCount', 0)
				this.$set(item, 'hasNearExpiry', false)
				return
			}
			
			// 检查drugId
			if (!item.drugId) {
				console.error('❌ 药材ID缺失:', item)
				uni.showToast({
					title: '药材ID缺失，无法分配批次',
					icon: 'none'
				})
				return
			}
			
			console.log('📦 开始分配批次:', {
				drugId: item.drugId,
				drugName: item.drugName,
				quantity: item.quantity,
				location: 'drug_storage'
			})
			
			uni.showLoading({ title: '分配批次中...' })
			
			try {
				// ⭐ 使用旧方案：allocateBatchesFIFO（性能测试结果：536ms vs 829ms）
				const result = await wx.cloud.callFunction({
					name: 'stockManage',
					data: {
						action: 'allocateBatchesFIFO',
						data: {
							drugId: item.drugId,
							requiredQuantity: item.quantity,
							location: 'drug_storage'
						}
					}
				})
				
				console.log('📦 云函数返回结果:', result.result)
				console.log('📦 result.result.data:', result.result.data)
				console.log('📦 result.result.data 的类型:', typeof result.result.data)
				console.log('📦 result.result.data 的所有键:', result.result.data ? Object.keys(result.result.data) : 'null')
				
				if (result.result && result.result.success) {
					// ⭐ 注意：云函数返回的是 allocation（单数），不是 allocations（复数）
					const allocations = result.result.data?.allocation || []
					
					console.log('📦 分配的批次数量:', allocations.length)
					console.log('📦 分配详情:', allocations)
					
					if (allocations.length === 0) {
						// 更详细的错误提示
						const totalStock = result.result.data?.totalStock || 0
						const errorMsg = totalStock > 0 
							? `当前库存 ${totalStock} ${item.unit}，需求 ${item.quantity} ${item.unit}，库存不足`
							: `该药材在总库暂无库存`
						
						console.error('❌ 库存不足:', {
							drugName: item.drugName,
							required: item.quantity,
							available: totalStock
						})
						
						throw new Error(errorMsg)
					}
					
					// 转换为前端显示格式
					const allocation = allocations.map(alloc => ({
						batchId: alloc.batchId,
						batch: alloc.batch,
						expireDate: alloc.expireDate,
						quantity: alloc.quantity,
						stockQuantity: alloc.stockQuantity,
						isNearExpiry: alloc.isNearExpiry || false,
						daysToExpire: alloc.daysToExpiry || alloc.daysToExpire
					}))
					
					console.log('✅ 批次分配成功:', allocation)
					
					// 保存分配结果
					this.$set(item, 'batchAllocation', allocation)
					this.$set(item, 'batchCount', allocation.length)
					this.$set(item, 'hasNearExpiry', allocation.some(b => b.isNearExpiry))
					
					// 近效期提示
					if (item.hasNearExpiry) {
						uni.hideLoading()
						uni.showModal({
							title: '近效期提示',
							content: `${item.drugName} 包含近效期批次，是否继续？`,
							success: (res) => {
								if (!res.confirm) {
									item.quantity = ''
									this.$set(item, 'batchAllocation', [])
									this.$set(item, 'batchCount', 0)
									this.$set(item, 'hasNearExpiry', false)
								}
							}
						})
					} else {
						uni.hideLoading()
						uni.showToast({
							title: `✅ 已分配 ${allocation.length} 个批次`,
							icon: 'success',
							duration: 1500
						})
					}
				} else {
					const errorMsg = result.result?.message || '分配失败'
					console.error('❌ 云函数返回失败:', errorMsg)
					throw new Error(errorMsg)
				}
			} catch (err) {
				console.error('❌ 批次分配失败:', err)
				uni.hideLoading()
				
				// 显示更友好的错误提示
				uni.showModal({
					title: '批次分配失败',
					content: err.message || '未知错误',
					showCancel: false,
					confirmText: '知道了'
				})
				
				// 清空分配结果
				this.$set(item, 'batchAllocation', [])
				this.$set(item, 'batchCount', 0)
				this.$set(item, 'hasNearExpiry', false)
			}
		},
		
		// 保存草稿
		async saveDraft() {
			if (this.drugList.length === 0) {
				uni.showToast({
					title: '请先添加药材',
					icon: 'none'
				})
				return
			}
			
			uni.showLoading({ title: '保存中...' })
			try {
				const userInfo = uni.getStorageSync('userInfo')
				const result = await this.$api.callFunction('outRecords', {
					action: 'create',
					data: {
						recordNo: this.recordNo,
						// 总库位置固定为 drug_storage
						location: 'drug_storage',
						locationName: '总库',
						fromLocation: 'drug_storage',
						fromLocationName: '总库',
						// 出库到的园区/库位
						toLocation: this.currentLocation.value,
						toLocationName: this.currentLocation.label,
						requestLocation: this.currentRequestArea.value,
						requestLocationName: this.currentRequestArea.label,
						dispenser: this.dispenser,
						dispenserId: userInfo?._id || '',
						dispenserSign: '',
						dispenserSignTime: '',
						remark: this.remark,
						items: this.drugList.map(drug => ({
							drugId: drug.drugId,
							drugCode: drug.drugCode || '',
							drugName: drug.drugName,
							specification: this.buildSpecification(drug),
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
					uni.showToast({ title: '保存成功', icon: 'success' })
					setTimeout(() => { uni.navigateBack() }, 1500)
				} else {
					throw new Error(result.message || '保存失败')
				}
			} catch (err) {
				console.error('保存失败:', err)
				uni.hideLoading()
				uni.showToast({ title: err.message || '保存失败', icon: 'none' })
			}
		},
		
		// 提交复核
		async submitReview() {
			if (!this.dispenserSign) {
				uni.showToast({ title: '请先完成发放人签名', icon: 'none' })
				return
			}
			if (this.drugList.length === 0) {
				uni.showToast({ title: '请先添加药材', icon: 'none' })
				return
			}
			
			uni.showLoading({ title: '提交中...' })
			try {
				const userInfo = uni.getStorageSync('userInfo')
				const result = await this.$api.callFunction('outRecords', {
					action: 'create',
					data: {
						recordNo: this.recordNo,
						// 总库位置固定为 drug_storage
						location: 'drug_storage',
						locationName: '总库',
						fromLocation: 'drug_storage',
						fromLocationName: '总库',
						// 出库到的园区/库位
						toLocation: this.currentLocation.value,
						toLocationName: this.currentLocation.label,
						requestLocation: this.currentRequestArea.value,
						requestLocationName: this.currentRequestArea.label,
						dispenser: this.dispenser,
						dispenserId: userInfo?._id || '',
						dispenserSign: this.dispenserSign,
						dispenserSignTime: new Date(),
						remark: this.remark,
						items: this.drugList.map(drug => ({
							drugId: drug.drugId,
							drugCode: drug.drugCode || '',
							drugName: drug.drugName,
							specification: this.buildSpecification(drug),
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
						status: 'pending_review'
					}
				})
				uni.hideLoading()
				if (result.success) {
					uni.showToast({ title: '提交成功', icon: 'success' })
					setTimeout(() => { uni.navigateBack() }, 1500)
				} else {
					throw new Error(result.message || '提交失败')
				}
			} catch (err) {
				console.error('提交失败:', err)
				uni.hideLoading()
				uni.showToast({ title: err.message || '提交失败', icon: 'none' })
			}
 		}
	}
}

</script>

<style lang="scss" scoped>
	.page {
	min-height: 100vh;
	/* 与入库新建页一致的蓝色渐变背景 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding: 24rpx 24rpx 180rpx; // 为底部固定按钮留出空间
}

// 页面头部：702rpx 象牙白卡片
.page-header {
	max-width: 702rpx;
	margin: 10rpx auto 8rpx;
	padding: 30rpx 26rpx 26rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow:
		0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
		0 -1rpx 0 rgba(15, 23, 42, 0.06) inset,
		0 18rpx 40rpx rgba(15, 23, 42, 0.14);
	
	.header-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 8rpx;
		
		.header-title {
			font-size: 40rpx;
			font-weight: bold;
			color: #111827;
		}
		
		.header-subtitle {
			font-size: 24rpx;
			color: #4b5563;
		}
	}
}

// 基本信息卡片：象牙白卡片，702rpx 轨道
.info-card {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 26rpx 26rpx 24rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

// 药材明细与签名等表单板块
.form-section {
	max-width: 702rpx;
	margin: 0 auto 8rpx;
	padding: 26rpx 26rpx 24rpx;
	background-color: #FFFFF0;
	border-radius: 22rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #111827;
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
	color: #333333;
	flex: 1;
}

.form-value {
	font-size: 28rpx;
	color: #333333;
	flex: 1;
}

.picker-input {
	font-size: 28rpx;
	color: #333333;
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	border-radius: 999rpx;
	padding: 6rpx 20rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.04);
	max-width: 100%;
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

.add-drug-btn {
	background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
	color: #ffffff;
	padding: 22rpx 40rpx;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 160, 255, 0.25);
	
	.btn-icon {
		font-size: 32rpx;
	}
	
	.btn-text {
		font-size: 28rpx;
		font-weight: 500;
	}
}

.drug-list {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.drug-item {
	background-color: #FFFFF0;
	padding: 25rpx;
	border-radius: 18rpx;
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
	align-items: flex-start;
	margin-bottom: 12rpx;
}

.drug-title-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
	flex: 1;
}

.drug-badges {
	display: flex;
	gap: 8rpx;
	flex-shrink: 0;
	
	.badge {
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		font-weight: 500;
		
		&.high-value {
			background: #FFF3E0;
			color: #FF9800;
		}
		
		&.emergency {
			background: #FFEBEE;
			color: #F44336;
		}
	}
}

.drug-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
	flex: 1;
}

.drug-delete {
	font-size: 26rpx;
	color: #FF6B6B;
	padding: 8rpx 15rpx;
}

// 规格单位合并行
.drug-spec-row {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 10rpx;
	padding: 10rpx 15rpx;
	background: #FFFFFF;
	border-radius: 10rpx;
	
	.spec-icon {
		font-size: 28rpx;
	}
	
	.spec-text {
		font-size: 26rpx;
		color: #333333;
		font-weight: 500;
	}
	
	.spec-divider {
		font-size: 24rpx;
		color: #CCCCCC;
		margin: 0 4rpx;
	}
	
	.unit-text {
		font-size: 24rpx;
		color: #666666;
	}
}

// 药材代码行
.drug-code-row {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 15rpx;
	padding: 8rpx 15rpx;
	background: #F5F7FA;
	border-radius: 8rpx;
	
	.code-icon {
		font-size: 24rpx;
	}
	
	.code-text {
		font-size: 24rpx;
		color: #666666;
	}
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
	display: flex;
	gap: 20rpx;
	margin-bottom: 20rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
	
	.info-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 12rpx;
		
		&.full {
			flex: 1 1 100%;
		}
		
		.label {
			font-size: 22rpx;
			color: #9ca3af;
			font-weight: 400;
		}
		
		.value {
			font-size: 28rpx;
			color: #111827;
			font-weight: 500;
		}
		
		.input-value {
			flex: 1;
			font-size: 28rpx;
			color: #323233;
			border-radius: 999rpx;
			padding: 10rpx 20rpx;
			background-color: #ffffff;
			box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.04);
			border: none;
		}
	}
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

// 批次选择行
.batch-select-row {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	margin-bottom: 15rpx;
}

.batch-quick-info {
	font-size: 22rpx;
	color: #666;
	padding-left: 10rpx;
}

// 批次信息紧凑显示（旧样式，保留）
.batch-info-compact {
	background: linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%);
	padding: 15rpx 20rpx;
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
	margin-bottom: 15rpx;
	
	.batch-icon {
		font-size: 24rpx;
		flex-shrink: 0;
	}
	
	.batch-text {
		font-size: 24rpx;
		color: #333333;
		flex: 1;
	}
}

// 已选批次信息显示（新样式）
.batch-info-selected {
	background: linear-gradient(135deg, #E3F2FD 0%, #F1F8FF 100%);
	padding: 20rpx;
	border-radius: 12rpx;
	margin-bottom: 15rpx;
	border-left: 4rpx solid #2196F3;
}

.batch-info-row {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
}

.batch-label {
	font-size: 24rpx;
	color: #666;
	min-width: 140rpx;
}

.batch-value {
	font-size: 26rpx;
	color: #333;
	font-weight: 500;
}

.text-warning {
	color: #FF9800 !important;
	font-weight: bold;
}

// 保留旧样式以兼容
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
	padding: 20rpx 30rpx 26rpx;
	display: flex;
	gap: 20rpx;
	box-shadow: 0 -2rpx 14rpx rgba(15, 23, 42, 0.12);
	z-index: 100;
}

.bottom-btn {
	flex: 1;
	padding: 24rpx;
	border-radius: 999rpx;
	text-align: center;
	font-size: 28rpx;
	font-weight: 500;
	
	&.btn-primary {
		background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
		color: #ffffff;
		box-shadow: 0 6rpx 16rpx rgba(0, 160, 255, 0.25);
	}
	
	&.btn-secondary {
		background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
		color: #ffffff;
		border: none;
		box-shadow: 0 6rpx 16rpx rgba(0, 160, 255, 0.25);
	}
}

// FIFO批次分配结果样式 ⭐ 新增
.batch-allocation-result {
	background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
	border-radius: 12rpx;
	padding: 20rpx;
	margin-bottom: 15rpx;
	border-left: 4rpx solid #0EA5E9;
}

.allocation-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
	padding-bottom: 12rpx;
	border-bottom: 1rpx solid #BAE6FD;
}

.allocation-title {
	font-size: 26rpx;
	font-weight: bold;
	color: #0369A1;
	flex: 1;
}

.near-expiry-tag {
	font-size: 22rpx;
	color: #EA580C;
	background-color: #FFF7ED;
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
	border: 1rpx solid #FDBA74;
}

.allocation-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	margin-bottom: 15rpx;
}

.allocation-item {
	background-color: #FFFFFF;
	border-radius: 10rpx;
	padding: 15rpx;
	border: 1rpx solid #E0F2FE;
	
	&.near-expiry {
		background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
		border-color: #FED7AA;
	}
}

.allocation-row {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
	font-size: 24rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
}

.allocation-label {
	color: #6B7280;
	min-width: 100rpx;
}

.allocation-value {
	color: #111827;
	font-weight: 500;
	flex: 1;
	
	&.text-warning {
		color: #EA580C;
	}
}

.allocation-quantity {
	font-size: 26rpx;
	font-weight: bold;
	color: #0369A1;
	background-color: #E0F2FE;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	margin-left: 10rpx;
}

.days-hint {
	font-size: 20rpx;
	color: #DC2626;
	background-color: #FEE2E2;
	padding: 2rpx 8rpx;
	border-radius: 10rpx;
	margin-left: 8rpx;
}

.allocation-actions {
	display: flex;
	justify-content: flex-end;
	padding-top: 12rpx;
	border-top: 1rpx solid #E0F2FE;
}

.action-btn {
	font-size: 24rpx;
	color: #0369A1;
	background-color: #FFFFFF;
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	border: 1rpx solid #BAE6FD;
}

// 自动分配提示
.auto-allocate-hint {
	display: flex;
	align-items: center;
	background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
	padding: 12rpx 16rpx;
	border-radius: 8rpx;
	margin-top: 12rpx;
	border-left: 3rpx solid #F59E0B;
	
	.hint-icon {
		font-size: 24rpx;
		margin-right: 8rpx;
	}
	
	.hint-text {
		font-size: 22rpx;
		color: #92400E;
		flex: 1;
	}
	
	.action-link {
		font-size: 24rpx;
		color: #0369A1;
		font-weight: bold;
		padding: 4rpx 12rpx;
		background-color: #FFFFFF;
		border-radius: 12rpx;
		margin-left: 10rpx;
	}
}

.batch-allocation {
	margin-top: 20rpx;
	background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
	border-radius: 12rpx;
	padding: 20rpx;
	border-left: 4rpx solid #0EA5E9;
}

.allocation-title {
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
	padding-bottom: 12rpx;
	border-bottom: 1rpx solid #BAE6FD;
	
	.title-icon {
		font-size: 28rpx;
		margin-right: 8rpx;
	}
	
	.title-text {
		font-size: 26rpx;
		font-weight: bold;
		color: #0369A1;
		flex: 1;
	}
	
	.batch-count {
		font-size: 22rpx;
		color: #0284C7;
		background-color: #FFFFFF;
		padding: 4rpx 12rpx;
		border-radius: 20rpx;
	}
}

.allocation-item {
	background-color: #FFFFFF;
	border-radius: 10rpx;
	padding: 15rpx;
	margin-bottom: 12rpx;
	border: 1rpx solid #E0F2FE;
	
	&:last-child {
		margin-bottom: 0;
	}
	
	&.near-expiry {
		background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
		border-color: #FED7AA;
	}
}

.alloc-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
	padding-bottom: 8rpx;
	border-bottom: 1rpx dashed #E5E7EB;
}

.alloc-batch-label {
	font-size: 24rpx;
	font-weight: bold;
	color: #0369A1;
}

.expiry-badge {
	font-size: 20rpx;
	color: #EA580C;
	background-color: #FFF7ED;
	padding: 4rpx 10rpx;
	border-radius: 12rpx;
	border: 1rpx solid #FDBA74;
}

.alloc-row {
	display: flex;
	align-items: center;
	margin-bottom: 6rpx;
	font-size: 24rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
}

.alloc-label {
	color: #6B7280;
	min-width: 100rpx;
}

.alloc-value {
	color: #111827;
	font-weight: 500;
	flex: 1;
	
	&.text-warning {
		color: #EA580C;
		font-weight: bold;
	}
}

.alloc-stock {
	font-size: 22rpx;
	color: #9CA3AF;
	margin-left: 8rpx;
}

.days-badge {
	font-size: 20rpx;
	color: #DC2626;
	background-color: #FEE2E2;
	padding: 2rpx 8rpx;
	border-radius: 10rpx;
	margin-left: 8rpx;
}

.near-expiry-tip {
	display: flex;
	align-items: center;
	background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
	padding: 12rpx 16rpx;
	border-radius: 8rpx;
	margin-top: 12rpx;
	border-left: 3rpx solid #F59E0B;
	
	.tip-icon {
		font-size: 24rpx;
		margin-right: 8rpx;
	}
	
	.tip-text {
		font-size: 22rpx;
		color: #92400E;
		flex: 1;
	}
}
</style>

