<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="page-header">
      <view class="page-header-inner">
        <text class="page-title">门诊统计分析</text>
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
          <text class="label">园区</text>
          <picker mode="selector" :range="locationOptions" :value="locationIndex" @change="onLocationChange">
            <view class="picker-text">{{ currentLocationLabel }}</view>
          </picker>
        </view>
        <view class="filter-item actions">
          <button class="btn ghost" @tap="resetFilters">重置</button>
          <button class="btn primary" @tap="fetchAll">分析</button>
        </view>
      </view>

      <view class="filter-row dev-row">
        <view class="filter-item dev-tip">
          <text class="dev-text">（开发用）可一键生成近几天的模拟门诊数据，用于测试统计结果。</text>
        </view>
        <view class="filter-item actions">
          <button class="btn ghost dev-btn" @tap="seedMock">生成测试数据</button>
        </view>
      </view>
    </view>

    <!-- 概览统计卡片 -->
    <view class="summary-section">
      <view class="summary-grid">
        <view class="summary-card">
          <text class="summary-label">总就诊人数</text>
          <text class="summary-value">{{ summary.total }}<text class="unit">人</text></text>
        </view>
        <view class="summary-card">
          <text class="summary-label">游客</text>
          <text class="summary-value">{{ summary.visitorCount }}<text class="unit">人</text></text>
        </view>
        <view class="summary-card">
          <text class="summary-label">员工</text>
          <text class="summary-value">{{ summary.employeeCount }}<text class="unit">人</text></text>
        </view>
        <view class="summary-card">
          <text class="summary-label">出诊次数</text>
          <text class="summary-value">{{ summary.outcallCount }}<text class="unit">次</text></text>
        </view>
      </view>
    </view>

    <!-- 高发疾病 Top 列表 -->
    <view class="list-section">
      <view class="list-header">
        <text class="list-title">高发疾病 Top</text>
      </view>
      <view v-if="topDiseases.length" class="list-card">
        <view class="list-row header">
          <text class="col name">疾病</text>
          <text class="col count">人数</text>
          <text class="col ratio">占比</text>
        </view>
        <view
          class="list-row"
          v-for="(item, index) in topDiseases"
          :key="index"
        >
          <text class="col name">{{ item.name }}</text>
          <text class="col count">{{ item.count }}人</text>
          <text class="col ratio">{{ item.ratio }}%</text>
        </view>
      </view>
      <view v-else class="empty-hint">暂无疾病统计数据</view>
    </view>

    <!-- 用药 Top 列表 -->
    <view class="list-section">
      <view class="list-header">
        <text class="list-title">用药 Top</text>
      </view>
      <view v-if="topDrugs.length" class="list-card">
        <view class="list-row header">
          <text class="col name">药品</text>
          <text class="col count">用量</text>
          <text class="col ratio">用药人数</text>
        </view>
        <view
          class="list-row"
          v-for="(item, index) in topDrugs"
          :key="index"
        >
          <text class="col name">{{ item.drugName }} {{ item.specification }}</text>
          <text class="col count">{{ item.totalQuantityMin }}{{ item.minUnit || '' }}</text>
          <text class="col ratio">{{ item.patientCount }}人</text>
        </view>
      </view>
      <view v-else class="empty-hint">暂无用药统计数据</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ClinicAnalysis',
  data() {
    return {
      loading: false,
      filters: {
        startDate: '',
        endDate: '',
        location: 'all'
      },
      locationOptions: ['全部园区', '陆园', '水园'],
      locationIndex: 0,
      summary: {
        total: 0,
        visitorCount: 0,
        employeeCount: 0,
        outcallCount: 0
      },
      topDiseases: [],
      topDrugs: []
    }
  },
  computed: {
    currentLocationLabel() {
      return this.locationOptions[this.locationIndex] || '全部园区'
    }
  },
  onLoad() {
    this.initDefaultDate()
    this.fetchAll()
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
      this.filters.location = 'all'
      this.locationIndex = 0
      this.fetchAll()
    },
    async seedMock() {
      try {
        uni.showLoading({ title: '生成测试数据...', mask: true })
        const res = await wx.cloud.callFunction({
          name: 'clinicRecords',
          data: { action: 'seedMockData', data: { days: 7, perDay: 10 } }
        })
        console.log('seedMockData result', res)
        uni.showToast({ title: '已生成测试数据', icon: 'success' })
        this.fetchAll()
      } catch (err) {
        console.error('生成测试数据失败:', err)
        uni.showToast({ title: '生成失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
    async fetchAll() {
      if (!this.filters.startDate || !this.filters.endDate) {
        uni.showToast({ title: '请选择日期', icon: 'none' })
        return
      }
      this.loading = true
      try {
        const basePayload = {
          startDate: this.filters.startDate,
          endDate: this.filters.endDate,
          location: this.filters.location === 'all' ? '' : this.filters.location
        }

        const [summaryRes, diseaseRes, drugRes] = await Promise.all([
          wx.cloud.callFunction({
            name: 'clinicRecords',
            data: { action: 'getSummary', data: basePayload }
          }),
          wx.cloud.callFunction({
            name: 'clinicRecords',
            data: { action: 'getTopDiseases', data: basePayload }
          }),
          wx.cloud.callFunction({
            name: 'clinicRecords',
            data: { action: 'getTopDrugs', data: { ...basePayload, limit: 10 } }
          })
        ])

        this.summary = summaryRes?.result?.data || {
          total: 0,
          visitorCount: 0,
          employeeCount: 0,
          outcallCount: 0
        }

        this.topDiseases = diseaseRes?.result?.data || []
        console.log('getTopDrugs result ===>', JSON.stringify(drugRes))
        this.topDrugs = drugRes?.result?.data || []
      } catch (err) {
        console.error('加载门诊统计分析失败:', err)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  // 使用统一的蓝色渐变背景
  background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
  padding-bottom: 40rpx;
}

.page-header {
  // 顶部标题卡片：象牙白圆角卡片
  max-width: 702rpx;
  margin: 24rpx auto 8rpx;
  padding: 32rpx 30rpx 24rpx;
  background: #FFFFF0;
  border-radius: 22rpx;
  box-shadow:
    0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
    0 -1rpx 0 rgba(15, 23, 42, 0.06) inset,
    0 18rpx 40rpx rgba(15, 23, 42, 0.14);
}

.page-header-inner {
  display: flex;
  justify-content: center;
}

.page-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #0f172a;
}

.filter-card {
  max-width: 702rpx;
  margin: 0 auto 8rpx;
  padding: 24rpx 24rpx 20rpx;
  background: #FFFFF0;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.filter-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.filter-row.dev-row {
  align-items: center;
}

.filter-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.dev-tip {
  flex: 2;
}

.dev-text {
  font-size: 22rpx;
  color: #9ca3af;
}

.filter-item.actions {
  justify-content: flex-end;
  flex-direction: row;
  align-items: flex-end;
}

.label {
  font-size: 24rpx;
  color: #6b7280;
}

.picker-text {
  padding: 18rpx 20rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e5e7eb;
  background: #f9fafb;
  font-size: 28rpx;
  color: #111827;
}

.btn {
  min-width: 140rpx;
  padding: 14rpx 20rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
}

.btn.ghost {
  background: #fff;
  color: #4f46e5;
  border: 1rpx solid #c7d2fe;
}

.btn.primary {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff;
  border: none;
}

.dev-btn {
  border-color: #d1d5db;
  color: #6b7280;
}

.summary-section {
  max-width: 702rpx;
  margin: 0 auto 8rpx;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.summary-card {
  background: #FFFFF0;
  border-radius: 22rpx;
  padding: 22rpx 20rpx;
  box-shadow: 0 18rpx 40rpx rgba(15, 23, 42, 0.14);
}

.summary-label {
  font-size: 24rpx;
  color: #6b7280;
}

.summary-value {
  margin-top: 6rpx;
  font-size: 34rpx;
  font-weight: 700;
  color: #111827;
}

.list-section {
  max-width: 702rpx;
  margin: 8rpx auto;
}

.list-header {
  margin-bottom: 8rpx;
}

.list-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
}

.list-card {
  background: #FFFFF0;
  border-radius: 22rpx;
  box-shadow: 0 18rpx 40rpx rgba(15, 23, 42, 0.14);
  overflow: hidden;
}

.list-row {
  display: flex;
  padding: 16rpx 18rpx;
  font-size: 26rpx;
  color: #0f172a;
  border-bottom: 1rpx solid #f1f5f9;
}

.list-row.header {
  background: #f8fafc;
  font-weight: 600;
  color: #475569;
}

.list-row:last-child {
  border-bottom: none;
}

.col {
  padding-right: 8rpx;
}

.col.name {
  flex: 1.6;
}

.col.count,
.col.ratio {
  width: 160rpx;
  text-align: right;
}

.empty-hint {
  padding: 20rpx 10rpx;
  font-size: 24rpx;
  color: #9ca3af;
}
</style>
