<template>
	<view class="container">
		<!-- 顶部基础信息卡片：调拨单号 + 日期 + 调拨方向 -->
		<view class="header-card">
			<view class="title-row">
				<text class="title">新建调拨单</text>
				<text class="title-tag">陆园 ↔ 水园 园区间调拨</text>
			</view>
			<view class="info-row">
				<text class="info-label">调拨单号</text>
				<text class="info-value">{{ form.transferNo }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">调拨日期</text>
				<text class="info-value">{{ form.displayDate }}</text>
			</view>
			<view class="direction-row">
				<text class="info-label">调拨方向</text>
				<view class="direction-chips">
					<view
						class="direction-chip"
						:class="{ active: form.fromLocation === 'land_park' }"
						@tap="setDirection('land_park', 'water_park')"
					>
						<text>陆园 → 水园</text>
					</view>
					<view
						class="direction-chip"
						:class="{ active: form.fromLocation === 'water_park' }"
						@tap="setDirection('water_park', 'land_park')"
					>
						<text>水园 → 陆园</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 调拨明细列表（手动录入一行，先不写入数据库） -->
		<view class="detail-section">
			<view class="detail-header">
				<text class="detail-title">调拨明细</text>
				<view class="add-btn" @tap="addItem">
					<text class="add-icon">＋</text>
					<text class="add-text">添加调拨药材</text>
				</view>
			</view>
			<view v-if="form.items.length === 0" class="detail-empty">
				<text class="detail-empty-text">暂未添加明细，可点击上方“添加一行”录入一条测试数据。</text>
			</view>
			<view
				v-for="(item, index) in form.items"
				:key="item._localId"
				class="detail-card"
			>
				<view class="detail-row">
					<text class="field-label">药材名称</text>
					<view class="field-input-wrapper">
						<input
							class="field-input"
							v-model.trim="item.drugName"
							placeholder="请输入药材名称"
							@input="onDrugNameInput($event, index)"
						/>
						<view
							v-if="item.showSuggestions && item.searchResults && item.searchResults.length"
							class="suggest-panel"
						>
							<scroll-view scroll-y class="suggest-scroll">
								<view
									v-for="drug in item.searchResults"
									:key="drug._id"
									class="suggest-item"
									@tap.stop="selectDrug(drug, index)"
								>
									<text class="suggest-name">{{ drug.drugName }}</text>
									<text class="suggest-spec">{{ drug.spec }}</text>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
				<view class="detail-row">
					<text class="field-label">规格</text>
					<input
						class="field-input"
						v-model.trim="item.spec"
						placeholder="如 0.25g*24粒/盒"
					/>
				</view>
				<view class="detail-row">
					<text class="field-label">批号</text>
					<input
						class="field-input"
						v-model.trim="item.batchNo"
						placeholder="请输入批号"
					/>
				</view>
				<view class="detail-row two-cols">
					<view class="col">
						<text class="field-label">包装单位</text>
						<input
							class="field-input readonly"
							v-model.trim="item.unit"
							disabled
						/>
					</view>
					<view class="col">
						<text class="field-label">调拨数量(最小单位)</text>
						<input
							class="field-input"
							type="number"
							v-model.number="item.quantityMin"
							placeholder="请输入调拨数量"
						/>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部操作按钮：保存草稿 / 执行调拨（仅写入 transfer 集合，不改库存） -->
		<view class="footer-actions">
			<view class="footer-btn ghost" @tap="saveDraft">
				<text class="footer-text">保存草稿</text>
			</view>
			<view class="footer-btn primary" @tap="submitTransfer">
				<text class="footer-text">执行调拨</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'TransferAdd',
	data() {
		return {
			form: {
				transferNo: '',
				fromLocation: 'land_park',
				toLocation: 'water_park',
				createTime: '', // 原始字符串
				displayDate: '', // 已格式化给 UI 用
				items: []
			}
		}
	},
	onLoad() {
		this.initForm()
	},
	methods: {
		initForm() {
			const now = new Date()
			this.form.transferNo = this.generateTransferNo(now)
			this.form.createTime = this.formatDateTime(now)
			this.form.displayDate = this.formatDate(now)
		},
		addItem() {
			this.form.items.push({
				_localId: `row_${Date.now()}_${Math.random().toString(16).slice(2)}`,
				drugId: '',
				drugName: '',
				spec: '',
				batchNo: '',
				unit: '',
				quantityMin: null,
				// 搜索联想相关字段
				searchResults: [],
				showSuggestions: false
			})
		},
		// 药材名称输入联想搜索
		onDrugNameInput(e, index) {
			const keyword = (e.detail.value || '').trim()
			const item = this.form.items[index]
			if (!item) return
			item.drugName = keyword
			if (!keyword) {
				item.searchResults = []
				item.showSuggestions = false
				return
			}
			this.searchDrugs(keyword, index)
		},
		async searchDrugs(keyword, index) {
			try {
				const db = wx.cloud.database()
				const res = await db.collection('stock')
					.where({
						location: this.form.fromLocation,
						drugName: db.RegExp({
							regexp: keyword,
							options: 'i'
						})
					})
					.limit(20)
					.get()
				const item = this.form.items[index]
				if (!item) return
				item.searchResults = (res.data || []).map(d => ({
					_id: d._id,
					drugId: d.drugId || d._id,
					drugName: d.drugName || d.name || '',
					spec: d.spec || d.specification || '',
					unit: d.unit || d.packUnit || '',
					batchNo: d.batchNo || d.batch || ''
				}))
				item.showSuggestions = item.searchResults.length > 0
			} catch (err) {
				console.error('搜索库存药材失败', err)
			}
		},
		selectDrug(drug, index) {
			const item = this.form.items[index]
			if (!item) return
			item.drugId = drug.drugId
			item.drugName = drug.drugName
			item.spec = drug.spec
			item.unit = drug.unit
			if (drug.batchNo) {
				item.batchNo = drug.batchNo
			}
			item.showSuggestions = false
		},
		setDirection(from, to) {
			this.form.fromLocation = from
			this.form.toLocation = to
		},
		generateTransferNo(now) {
			// 简单按日期 + 时间戳生成：DByyyymmddHHMMss
			const d = now || new Date()
			const y = d.getFullYear()
			const m = String(d.getMonth() + 1).padStart(2, '0')
			const day = String(d.getDate()).padStart(2, '0')
			const hh = String(d.getHours()).padStart(2, '0')
			const mm = String(d.getMinutes()).padStart(2, '0')
			const ss = String(d.getSeconds()).padStart(2, '0')
			return `DB${y}${m}${day}${hh}${mm}${ss}`
		},
		formatDate(date) {
			if (!date) return ''
			const d = typeof date === 'string' ? new Date(date) : date
			if (Number.isNaN(d.getTime())) return ''
			const y = d.getFullYear()
			const m = String(d.getMonth() + 1).padStart(2, '0')
			const day = String(d.getDate()).padStart(2, '0')
			return `${y}-${m}-${day}`
		},
		formatDateTime(date) {
			if (!date) return ''
			const d = typeof date === 'string' ? new Date(date) : date
			if (Number.isNaN(d.getTime())) return ''
			const y = d.getFullYear()
			const m = String(d.getMonth() + 1).padStart(2, '0')
			const day = String(d.getDate()).padStart(2, '0')
			const hh = String(d.getHours()).padStart(2, '0')
			const mm = String(d.getMinutes()).padStart(2, '0')
			return `${y}-${m}-${day} ${hh}:${mm}`
		},
		async saveDraft() {
			try {
				uni.showLoading({ title: '保存草稿...', mask: true })
				const db = wx.cloud.database()
				const payload = {
					transferNo: this.form.transferNo,
					fromLocation: this.form.fromLocation,
					toLocation: this.form.toLocation,
					status: 'draft',
					operator: (uni.getStorageSync('userInfo') || {}).name || '',
					createTime: new Date(),
					items: this.form.items.map(it => ({
						drugId: it.drugId || '',
						drugName: it.drugName || '',
						spec: it.spec || '',
						batchNo: it.batchNo || '',
						unit: it.unit || '',
						quantityMin: Number(it.quantityMin || 0) || 0
					}))
				}
				await db.collection('transfer').add({ data: payload })
				uni.hideLoading()
				uni.showToast({ title: '草稿已保存', icon: 'success' })
			} catch (e) {
				console.error('保存调拨草稿失败', e)
				uni.hideLoading()
				uni.showToast({ title: '保存失败', icon: 'none' })
			}
		},
		async submitTransfer() {
			if (!this.form.items.length) {
				uni.showToast({ title: '请先添加至少一条明细', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '执行调拨...', mask: true })
				const db = wx.cloud.database()
				const items = this.form.items.map(it => ({
					drugId: it.drugId || '',
					drugName: it.drugName || '',
					spec: it.spec || '',
					batch: it.batchNo || '',
					unit: it.unit || '',
					quantity: Number(it.quantityMin || 0) || 0
				}))
				const record = {
					transferNo: this.form.transferNo,
					fromLocation: this.form.fromLocation,
					toLocation: this.form.toLocation,
					status: 'completed',
					operator: (uni.getStorageSync('userInfo') || {}).name || '',
					createTime: new Date(),
					items
				}
				const res = await db.collection('transfer_records').add({ data: record })
				await wx.cloud.callFunction({
					name: 'updateStock',
					data: {
						type: 'transfer',
						recordId: res._id
					}
				})
				uni.hideLoading()
				uni.showToast({ title: '调拨成功，库存已更新', icon: 'success' })
				setTimeout(() => {
					uni.navigateBack()
				}, 800)
			} catch (e) {
				console.error('执行调拨失败', e)
				uni.hideLoading()
				uni.showToast({ title: '执行失败', icon: 'none' })
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background: #f5f6f8;
	padding: 20rpx 24rpx 40rpx;
}

.header-card {
	background: #ffffff;
	border-radius: 24rpx;
	padding: 24rpx 22rpx 18rpx;
	box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.08);
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.title-row {
	display: flex;
	flex-direction: row;
	align-items: baseline;
	justify-content: space-between;
	margin-bottom: 6rpx;
}

.title {
	font-size: 32rpx;
	font-weight: 650;
	color: #111827;
}

.title-tag {
	font-size: 22rpx;
	color: #6b7280;
}

.info-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-top: 4rpx;
}

.info-label {
	font-size: 24rpx;
	color: #9ca3af;
}

.info-value {
	font-size: 26rpx;
	color: #111827;
	font-weight: 500;
}

.direction-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 10rpx;
}

.direction-chips {
	display: flex;
	flex-direction: row;
	gap: 10rpx;
	margin-left: 12rpx;
}

.direction-chip {
	padding: 10rpx 22rpx;
	border-radius: 999rpx;
	background: #f3f4f6;
	font-size: 24rpx;
	color: #4b5563;

	&.active {
		background: linear-gradient(135deg, #fb923c, #f97316);
		color: #ffffff;
		box-shadow: 0 6rpx 14rpx rgba(248, 113, 113, 0.35);
	}
}

.body-placeholder {
	margin-top: 20rpx;
	padding: 28rpx 22rpx;
	background: #ffffff;
	border-radius: 24rpx;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.06);
}

.hint-main {
	font-size: 26rpx;
	color: #374151;
}

.hint-sub {
	margin-top: 8rpx;
	font-size: 24rpx;
	color: #9ca3af;
}

.detail-section {
	margin-top: 20rpx;
}

.detail-header {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8rpx;
}

.detail-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #111827;
}

.add-btn {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 8rpx 18rpx;
	border-radius: 999rpx;
	background: #eef2ff;
}

.add-icon {
	font-size: 24rpx;
	color: #4f46e5;
	margin-right: 4rpx;
}

.add-text {
	font-size: 24rpx;
	color: #4338ca;
}

.detail-empty {
	padding: 20rpx 18rpx;
	background: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0 6rpx 18rpx rgba(15, 23, 42, 0.04);
}

.detail-empty-text {
	font-size: 24rpx;
	color: #9ca3af;
}

.detail-card {
	margin-top: 10rpx;
	padding: 18rpx 18rpx 16rpx;
	background: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0 6rpx 18rpx rgba(15, 23, 42, 0.06);
}

.detail-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 10rpx;
}

.field-input-wrapper {
	flex: 1;
	position: relative;
}

.detail-row.two-cols {
	justify-content: space-between;
}

.detail-row .col {
	flex: 1;
	margin-right: 10rpx;
}

.detail-row .col:last-child {
	margin-right: 0;
}

.field-label {
	font-size: 24rpx;
	color: #9ca3af;
	min-width: 150rpx;
}

.field-input {
	flex: 1;
	padding: 10rpx 16rpx;
	border-radius: 999rpx;
	background: #f3f4f6;
	font-size: 24rpx;
	color: #111827;
}

.suggest-panel {
	position: absolute;
	top: 70rpx;
	left: 0;
	right: 0;
	background: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.15);
	z-index: 20;
	padding: 8rpx 0;
}

.suggest-scroll {
	max-height: 260rpx;
}

.suggest-item {
	padding: 12rpx 18rpx;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.suggest-item + .suggest-item {
	border-top: 1rpx solid #f3f4f6;
}

.suggest-name {
	font-size: 26rpx;
	color: #111827;
	font-weight: 500;
}

.suggest-spec {
	font-size: 22rpx;
	color: #6b7280;
}

.field-value {
	flex: 1;
	font-size: 24rpx;
	color: #111827;
	text-align: right;
}

.footer-actions {
	margin-top: 24rpx;
	display: flex;
	flex-direction: row;
	gap: 12rpx;
}

.footer-btn {
	flex: 1;
	padding: 14rpx 0;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	justify-content: center;

	&.primary {
		background: linear-gradient(135deg, #fb923c, #f97316);
		color: #ffffff;
		box-shadow: 0 6rpx 16rpx rgba(248, 113, 113, 0.25);
	}

	&.ghost {
		background: #ffffff;
		color: #4b5563;
		border-width: 1rpx;
		border-style: solid;
		border-color: rgba(148, 163, 184, 0.5);
	}
}

.footer-text {
	font-size: 26rpx;
	font-weight: 500;
}
</style>
