<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="page-header">
      <view class="page-header-inner">
        <text class="page-title">北京欢乐谷医务室处方查询</text>
      </view>
    </view>

    <!-- 筛选区域 -->
    <view class="filter-card">
      <view class="filter-row">
        <view class="filter-item">
          <text class="label">开始日期</text>
          <picker mode="date" :value="filters.startDate" @change="onStartDateChange">
            <view class="picker-text">{{ filters.startDate || '请选择' }}</view>
          </picker>
        </view>
        <view class="filter-item">
          <text class="label">结束日期</text>
          <picker mode="date" :value="filters.endDate" @change="onEndDateChange">
            <view class="picker-text">{{ filters.endDate || '请选择' }}</view>
          </picker>
        </view>
      </view>

      <view class="filter-row">
        <view class="filter-item">
          <text class="label">姓名</text>
          <input
            class="input"
            v-model.trim="filters.patient"
            placeholder="输入姓名，支持模糊查询"
            @confirm="fetchPrescriptions"
          />
        </view>
        <view class="filter-item">
          <text class="label">药名</text>
          <input
            class="input"
            v-model.trim="filters.drugName"
            placeholder="输入药名或关键字"
            @confirm="fetchPrescriptions"
          />
        </view>
      </view>

      <view class="filter-row">
        <view class="filter-item">
          <text class="label">园区</text>
          <picker mode="selector" :range="locationOptions" :value="locationIndex" @change="onLocationChange">
            <view class="picker-text">{{ currentLocationLabel }}</view>
          </picker>
        </view>
      </view>

      <view class="filter-actions">
        <button class="btn ghost" @tap="resetFilters">重置</button>
        <button class="btn primary" @tap="fetchPrescriptions">查询</button>
      </view>
    </view>

    <!-- 处方结果列表 -->
    <view class="list-section">
      <view v-if="records.length" class="record-list">
        <view
          class="record-card"
          v-for="(item, index) in records"
          :key="item._id || index"
        >
          <!-- 顶部：时间 + 园区 + 签名状态 -->
          <view class="record-header">
            <text class="record-time">{{ formatDateTime(item.visitDateTime || item.createTime) }}</text>
            <view class="record-location-wrap" v-if="item.location">
              <text class="record-location">{{ renderLocation(item.location) }}</text>
            </view>
            <view class="sign-status" v-if="item.signatureStatus">
              <text
                :class="(item._signVerify && item._signVerify.valid) ? 'sign-badge sign-ok' : (item.signatureStatus === 'unsigned' ? 'sign-badge sign-none' : 'sign-badge sign-warn')"
              >
                {{ renderSignStatus(item) }}
              </text>
            </view>
          </view>

          <!-- 基本信息 -->
          <view class="record-main-row">
            <view class="record-main-left">
              <text class="record-name">{{ item.name || '-' }}</text>
              <text class="record-sub" v-if="item.gender || item.age">
                {{ item.gender || '' }}<text v-if="item.gender && item.age"> · </text>{{ item.age ? item.age + '岁' : '' }}
              </text>
            </view>
            <view class="record-main-right">
              <text class="record-tag" v-if="item.identity">{{ item.identity }}</text>
              <text class="record-tag type" v-if="item.isOutcall || item.visitType">
                {{ (item.isOutcall || item.visitType === 'outcall') ? '出诊' : '门诊' }}
              </text>
            </view>
          </view>

          <!-- 诊断信息 -->
          <view class="record-field" v-if="item.diseaseName">
            <text class="field-label">疾病名称</text>
            <text class="field-value">{{ item.diseaseName }}</text>
          </view>
          <view class="record-field" v-if="item.diagnosis">
            <text class="field-label">初步诊断</text>
            <text class="field-value">{{ item.diagnosis }}</text>
          </view>

          <!-- 用药 / 处方摘要 -->
          <view class="record-field" v-if="renderDrugInfo(item)">
            <text class="field-label">用药摘要</text>
            <text class="field-value">{{ renderDrugInfo(item) }}</text>
          </view>
          <view class="record-field" v-if="item.treatment">
            <text class="field-label">处置</text>
            <text class="field-value">{{ item.treatment }}</text>
          </view>

          <!-- 医生 + 签名时间 -->
          <view class="record-footer">
            <text class="field-label">医生</text>
            <text class="field-value">
              {{ item.signedByName || item.doctorName || '-' }}
              <text v-if="item.signedAt || item.signTime" class="sign-time">
                （签名时间：{{ formatDateTime(item.signedAt || item.signTime) }}）
              </text>
            </text>
            <button class="btn-mini" @tap="verifyRecordSignature(item)">校验签名</button>
          </view>
        </view>
      </view>

      <view v-else class="empty-state">
        <text class="empty-icon">💊</text>
        <text class="empty-text">暂无处方记录</text>
        <text class="empty-hint">请选择姓名 / 药名 / 园区 / 时间段后点击查询</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PrescriptionReport',
  data() {
    return {
      loading: false,
      records: [],
      filters: {
        startDate: '',
        endDate: '',
        patient: '',
        drugName: '',
        location: 'all'
      },
      locationOptions: ['全部园区', '陆园', '水园'],
      locationIndex: 0
    }
  },
  computed: {
    currentLocationLabel() {
      return this.locationOptions[this.locationIndex] || '全部园区'
    }
  },
  onLoad() {
    this.initDefaultDate()
    this.fetchPrescriptions()
  },
  methods: {
    initDefaultDate() {
      const today = new Date()
      const y = today.getFullYear()
      const m = String(today.getMonth() + 1).padStart(2, '0')
      const d = String(today.getDate()).padStart(2, '0')
      const dateStr = `${y}-${m}-${d}`
      this.filters.startDate = dateStr
      this.filters.endDate = dateStr
    },
    onStartDateChange(e) {
      this.filters.startDate = e.detail.value
    },
    onEndDateChange(e) {
      this.filters.endDate = e.detail.value
    },
    onLocationChange(e) {
      const idx = Number(e.detail.value) || 0
      this.locationIndex = idx
      if (idx === 0) this.filters.location = 'all'
      else if (idx === 1) this.filters.location = 'land_park'
      else this.filters.location = 'water_park'
    },
    resetFilters() {
      this.initDefaultDate()
      this.filters.patient = ''
      this.filters.drugName = ''
      this.filters.location = 'all'
      this.locationIndex = 0
      this.fetchPrescriptions()
    },
    async fetchPrescriptions() {
      this.loading = true
      try {
        const payload = {
          location: this.filters.location === 'all' ? '' : this.filters.location,
          startDate: this.filters.startDate,
          endDate: this.filters.endDate,
          patient: this.filters.patient || '',
          drugName: this.filters.drugName || '',
          page: 1,
          pageSize: 200
        }
        const res = await wx.cloud.callFunction({
          name: 'clinicRecords',
          data: {
            action: 'listPrescriptions',
            data: payload
          }
        })
        const list = res?.result?.data?.list || []
        this.records = list
      } catch (err) {
        console.error('加载处方记录失败:', err)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    async verifyRecordSignature(item) {
      if (!item || !item._id) {
        uni.showToast({ title: '记录ID缺失', icon: 'none' })
        return
      }
      try {
        uni.showLoading({ title: '校验中...', mask: true })
        const res = await wx.cloud.callFunction({
          name: 'clinicRecords',
          data: {
            action: 'verifySignature',
            data: { _id: item._id }
          }
        })
        uni.hideLoading()
        const info = res?.result?.data
        if (!res?.result?.success || !info) {
          uni.showToast({ title: res?.result?.error || '校验失败', icon: 'none' })
          return
        }
        // 将校验结果暂存到记录上，便于显示状态
        item._signVerify = info
        const msgMap = {
          signed: '电子签名有效，内容未被篡改',
          unsigned: '记录未进行电子签名或缺少签名哈希',
          invalid: '电子签名已失效，内容可能被修改'
        }
        uni.showToast({
          title: msgMap[info.status] || '校验完成',
          icon: info.valid ? 'success' : 'none',
          duration: 2500
        })
      } catch (err) {
        uni.hideLoading()
        console.error('签名校验失败:', err)
        uni.showToast({ title: '校验失败', icon: 'none' })
      }
    },
    renderLocation(loc) {
      if (loc === 'land_park') return '陆园'
      if (loc === 'water_park') return '水园'
      return '不限园区'
    },
    formatDateTime(date) {
      if (!date) return ''
      let d
      if (typeof date === 'string') {
        let str = date.trim()
        if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(str)) {
          str = str.replace(/-/g, '/') + ':00'
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
          str = str.replace(/-/g, '/')
        }
        d = new Date(str)
      } else {
        d = new Date(date)
      }
      if (Number.isNaN(d.getTime())) return ''
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      return `${y}-${m}-${day} ${hh}:${mm}`
    },
    renderDrugInfo(item) {
      if (!item) return ''
      // 优先使用 drugInfo 文本，其次用 drugName + 数量
      if (item.drugInfo) return item.drugInfo
      if (!item.drugName) return ''
      const quantity = item.quantityMin || item.quantity || ''
      const unit = item.minUnit || item.unit || ''
      return `${item.drugName}${quantity ? ' ' + quantity : ''}${unit}`
    },
    renderSignStatus(item) {
      if (!item || !item.signatureStatus) return '未签名'
      if (item._signVerify && item._signVerify.valid && item._signVerify.status === 'signed') {
        return '签名有效'
      }
      if (item.signatureStatus === 'unsigned') return '未签名'
      if (item._signVerify && item._signVerify.status === 'invalid') return '签名失效'
      return '已签名'
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
  padding: 24rpx 24rpx 150rpx;
}

.page-header {
  max-width: 702rpx;
  margin: 0 auto 8rpx;
  padding: 40rpx 30rpx;
  background: #fffff0;
  border-radius: 22rpx;
  text-align: center;
  box-shadow:
    0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
    0 -1rpx 0 rgba(15, 23, 42, 0.06) inset,
    0 18rpx 40rpx rgba(15, 23, 42, 0.14);

  .page-title {
    font-size: 40rpx;
    font-weight: 600;
    color: #111827;
  }
}

.filter-card {
  max-width: 702rpx;
  margin: 0 auto 8rpx;
  padding: 18rpx 18rpx 12rpx;
  background: #fffff0;
  border-radius: 22rpx;
  box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.filter-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.filter-item {
  flex: 1;
  min-width: 0;
  &:not(:last-child) {
    margin-right: 12rpx;
  }
}

.label {
  display: block;
  font-size: 24rpx;
  color: #4b5563;
  margin-bottom: 6rpx;
}

.input,
.picker-text {
  height: 64rpx;
  padding: 0 20rpx;
  border-radius: 999rpx;
  background-color: #f9fafb;
  border: 1rpx solid rgba(148, 163, 184, 0.6);
  font-size: 26rpx;
  color: #111827;
  display: flex;
  align-items: center;
}

.filter-actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 12rpx;
}

.btn {
  min-width: 140rpx;
  height: 64rpx;
  padding: 0 32rpx;
  margin-left: 12rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn.ghost {
  background-color: rgba(255, 255, 255, 0.9);
  color: #0f172a;
}

.btn.primary {
  background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
  color: #ffffff;
}

.list-section {
  max-width: 702rpx;
  margin: 0 auto;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.record-card {
  background: #fffff0;
  border-radius: 22rpx;
  padding: 18rpx 20rpx 16rpx;
  box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.record-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.record-time {
  font-size: 24rpx;
  color: #4b5563;
}

.record-location-wrap {
  padding: 4rpx 12rpx;
  border-radius: 999rpx;
  background-color: rgba(59, 130, 246, 0.08);
}

.record-location {
  font-size: 22rpx;
  color: #1d4ed8;
}

.sign-status {
  margin-left: 8rpx;
}

.sign-badge {
  font-size: 22rpx;
  padding: 4rpx 10rpx;
  border-radius: 999rpx;
}

.sign-ok {
  background-color: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.sign-none {
  background-color: rgba(148, 163, 184, 0.12);
  color: #4b5563;
}

.sign-warn {
  background-color: rgba(248, 113, 113, 0.12);
  color: #b91c1c;
}

.record-main-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.record-main-left {
  display: flex;
  flex-direction: column;
}

.record-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #111827;
}

.record-sub {
  font-size: 24rpx;
  color: #6b7280;
  margin-top: 2rpx;
}

.record-main-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
}

.record-tag {
  padding: 4rpx 12rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  background-color: rgba(15, 23, 42, 0.06);
  color: #111827;
}

.record-tag.type {
  background-color: rgba(59, 130, 246, 0.08);
  color: #1d4ed8;
}

.record-field {
  margin-top: 6rpx;
}

.field-label {
  font-size: 22rpx;
  color: #6b7280;
}

.field-value {
  font-size: 26rpx;
  color: #111827;
  margin-left: 8rpx;
}

.record-footer {
  margin-top: 10rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.sign-time {
  font-size: 22rpx;
  color: #6b7280;
}

.btn-mini {
  padding: 0 18rpx;
  height: 56rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  background-color: #eff6ff;
  color: #1d4ed8;
}

.empty-state {
  margin-top: 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6b7280;
}

.empty-icon {
  font-size: 64rpx;
  margin-bottom: 12rpx;
}

.empty-text {
  font-size: 30rpx;
  margin-bottom: 4rpx;
}

.empty-hint {
  font-size: 24rpx;
}
</style>
