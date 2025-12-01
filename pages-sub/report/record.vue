<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="page-header">
      <view class="page-header-inner">
        <text class="page-title">门诊病历查询</text>
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
            v-model.trim="filters.name"
            placeholder="输入姓名，支持模糊查询"
            @confirm="fetchRecords"
          />
        </view>
        <view class="filter-item">
          <text class="label">园区</text>
          <picker mode="selector" :range="locationOptions" :value="locationIndex" @change="onLocationChange">
            <view class="picker-text">{{ currentLocationLabel }}</view>
          </picker>
        </view>
      </view>

      <view class="filter-row">
        <view class="filter-item">
          <text class="label">诊断关键字</text>
          <input
            class="input"
            v-model.trim="filters.diagnosis"
            placeholder="输入疾病名称/诊断关键字"
            @confirm="fetchRecords"
          />
        </view>
      </view>

      <view class="filter-actions">
        <button class="btn ghost" @tap="resetFilters">重置</button>
        <button class="btn primary" @tap="fetchRecords">查询</button>
      </view>
    </view>

    <!-- 病历结果列表 -->
    <view class="list-section">
      <view v-if="records.length" class="record-list">
        <view
          class="record-card"
          v-for="(item, index) in records"
          :key="item._id || index"
        >
          <!-- 顶部：时间 + 园区 -->
          <view class="record-header">
            <text class="record-time">{{ formatDateTime(item.visitDateTime || item.createTime) }}</text>
            <view class="record-location-wrap" v-if="item.location">
              <text class="record-location">{{ renderLocation(item.location) }}</text>
            </view>
          </view>

          <!-- 姓名 + 身份 / 类型信息 -->
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

          <!-- 主诉 / 症状 / 诊断 / 处置 -->
          <view class="record-field" v-if="item.chiefComplaint">
            <text class="field-label">主诉</text>
            <text class="field-value">{{ item.chiefComplaint }}</text>
          </view>
          <view class="record-field" v-if="item.symptom">
            <text class="field-label">症状</text>
            <text class="field-value">{{ item.symptom }}</text>
          </view>
          <view class="record-field" v-if="item.diseaseName">
            <text class="field-label">疾病名称</text>
            <text class="field-value">{{ item.diseaseName }}</text>
          </view>
          <view class="record-field" v-if="item.diagnosis">
            <text class="field-label">初步诊断</text>
            <text class="field-value">{{ item.diagnosis }}</text>
          </view>
          <view class="record-field" v-if="item.treatment">
            <text class="field-label">处置</text>
            <text class="field-value">{{ item.treatment }}</text>
          </view>

          <!-- 用药摘要（如果有） -->
          <view class="record-field" v-if="renderDrugInfo(item)">
            <text class="field-label">用药摘要</text>
            <text class="field-value">{{ renderDrugInfo(item) }}</text>
          </view>

          <!-- 备注 -->
          <view class="record-field" v-if="item.remark">
            <text class="field-label">备注</text>
            <text class="field-value">{{ item.remark }}</text>
          </view>

          <!-- 医生 + 电子名戳提示 -->
          <view class="record-footer">
            <text class="field-label">医生</text>
            <text class="field-value">
              {{ item.signedByName || '-' }}
              <text v-if="item.signTime || item.signedAt" class="sign-time">
                （签名时间：{{ formatDateTime(item.signedAt || item.signTime) }}）
              </text>
            </text>
          </view>
        </view>
      </view>

      <view v-else class="empty-state">
        <text class="empty-icon">📄</text>
        <text class="empty-text">暂无病历记录</text>
        <text class="empty-hint">请选择时间段 / 姓名 / 园区后点击查询</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ClinicRecordQuery',
  data() {
    return {
      loading: false,
      records: [],
      filters: {
        startDate: '',
        endDate: '',
        name: '',
        diagnosis: '',
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
    this.fetchRecords()
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
      this.filters.name = ''
      this.filters.diagnosis = ''
      this.filters.location = 'all'
      this.locationIndex = 0
      this.fetchRecords()
    },
    async fetchRecords() {
      this.loading = true
      try {
        const payload = {
          location: this.filters.location === 'all' ? '' : this.filters.location,
          startDate: this.filters.startDate,
          endDate: this.filters.endDate,
          patient: this.filters.name || '',
          page: 1,
          pageSize: 200,
          useClinicRecords: true
        }
        const res = await wx.cloud.callFunction({
          name: 'clinicRecords',
          data: {
            action: 'list',
            data: payload
          }
        })
        let list = res?.result?.data?.list || []
        // 前端按诊断关键字过滤一遍
        if (this.filters.diagnosis) {
          const kw = this.filters.diagnosis.toLowerCase()
          list = list.filter(r => {
            const d1 = (r.diseaseName || '').toLowerCase()
            const d2 = (r.diagnosis || '').toLowerCase()
            return d1.includes(kw) || d2.includes(kw)
          })
        }
        this.records = list
      } catch (err) {
        console.error('加载门诊病历失败:', err)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
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
      if (item.drugInfo) return item.drugInfo
      if (!item.drugName) return ''
      const quantity = item.quantityMin || item.quantity || ''
      const unit = item.minUnit || item.unit || ''
      return `${item.drugName}${quantity ? ' ' + quantity : ''}${unit}`
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
