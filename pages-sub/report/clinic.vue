<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="page-header">
      <view class="page-header-inner">
        <text class="page-title">{{ reportTitle }}</text>
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

      <view class="filter-actions">
        <button class="btn ghost" @tap="resetFilters">重置</button>
        <button class="btn primary" @tap="fetchRecords">查询</button>
        <button class="btn export" @tap="openExportOptions">导出 ▾</button>
      </view>
    </view>

    <!-- 结果列表：卡片式门诊记录 -->
    <view class="list-section">
      <view v-if="records.length" class="record-list">
        <view
          class="record-card"
          v-for="(item, index) in records"
          :key="index"
        >
          <!-- 顶部：时间 + 园区 -->
          <view class="record-header">
            <text class="record-time">{{ formatDateTime(item.visitDateTime || item.createTime) }}</text>
            <view class="record-location-wrap" v-if="item.location">
              <text class="record-location">{{ item.location === 'land_park' ? '陆园' : (item.location === 'water_park' ? '水园' : '不限园区') }}</text>
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

          <!-- 主诉 -->
          <view class="record-field" v-if="item.chiefComplaint">
            <text class="field-label">主诉</text>
            <text class="field-value">{{ item.chiefComplaint }}</text>
          </view>

          <!-- 诊断 -->
          <view class="record-field" v-if="item.diagnosis">
            <text class="field-label">诊断</text>
            <text class="field-value">{{ item.diagnosis }}</text>
          </view>

          <!-- 出诊地点（仅出诊记录显示） -->
          <view
            class="record-field"
            v-if="(item.isOutcall || item.visitType === 'outcall') && item.injuryLocation"
          >
            <text class="field-label">出诊地点</text>
            <text class="field-value">{{ item.injuryLocation }}</text>
          </view>

          <!-- 用药 / 处置信息 -->
          <view class="record-field" v-if="renderDrugInfo(item)">
            <text class="field-label">用药</text>
            <text class="field-value">{{ renderDrugInfo(item) }}</text>
          </view>

          <!-- 备注 -->
          <view class="record-field" v-if="item.remark">
            <text class="field-label">备注</text>
            <text class="field-value">{{ item.remark }}</text>
          </view>

          <!-- 医生 -->
          <view class="record-footer">
            <text class="field-label">医生</text>
            <text class="field-value">{{ item.doctorName || '-' }}</text>
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无门诊记录</text>
        <text class="empty-hint">请选择姓名 / 园区 / 时间段后点击查询</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ClinicReport',
  data() {
    return {
      loading: false,
      records: [],
      filters: {
        startDate: '',
        endDate: '',
        name: '',
        location: 'all'
      },
      locationOptions: ['全部园区', '陆园', '水园'],
      locationIndex: 0,
      userInfo: uni.getStorageSync('userInfo') || {}
    }
  },
  computed: {
    reportTitle() {
      return '门诊查询'
    },
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
          pageSize: 1000,
          useClinicRecords: true
        }
        const res = await wx.cloud.callFunction({
          name: 'clinicRecords',
          data: {
            action: 'list',
            data: payload
          }
        })
        const list = res?.result?.data?.list || []
        this.records = list.map(r => ({
          ...r,
          doctorName: this.userInfo?.name || ''
        }))
      } catch (err) {
        console.error('加载门诊报表失败:', err)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    openExportOptions() {
      if (!this.records.length) {
        uni.showToast({ title: '暂无数据可导出', icon: 'none' })
        return
      }
      uni.showActionSheet({
        itemList: ['导出为 Excel', '导出为 PDF'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.exportExcel()
          } else if (res.tapIndex === 1) {
            this.exportPDF()
          }
        }
      })
    },
    buildExportPayload() {
      return {
        startDate: this.filters.startDate,
        endDate: this.filters.endDate,
        name: this.filters.name || '',
        location: this.filters.location,
        printUser: this.userInfo?.name || ''
      }
    },
    async exportExcel() {
      try {
        uni.showLoading({ title: '生成Excel...', mask: true })
        const payload = this.buildExportPayload()
        const res = await this.$api.callFunction('reports', {
          action: 'exportClinicExcel',
          data: payload
        })
        uni.hideLoading()
        if (res?.success && res.fileID && res.filename) {
          const urlRes = await wx.cloud.getTempFileURL({ fileList: [res.fileID] })
          const fileUrl = urlRes?.fileList?.[0]?.tempFileURL
          if (fileUrl) {
            this.downloadAndSaveLocal(fileUrl, res.filename, 'Excel')
          } else {
            uni.showToast({ title: '获取下载链接失败', icon: 'none' })
          }
        } else {
          uni.showToast({ title: '生成Excel失败', icon: 'none' })
        }
      } catch (err) {
        uni.hideLoading()
        console.error('导出Excel失败:', err)
        uni.showToast({ title: '导出失败', icon: 'none' })
      }
    },
    async exportPDF() {
      try {
        uni.showLoading({ title: '生成PDF...', mask: true })
        const payload = this.buildExportPayload()
        const res = await this.$api.callFunction('reports', {
          action: 'exportClinicPDF',
          data: payload
        })
        uni.hideLoading()
        if (res?.success && res.fileID) {
          const urlRes = await wx.cloud.getTempFileURL({ fileList: [res.fileID] })
          const fileUrl = urlRes?.fileList?.[0]?.tempFileURL
          let filename = ''
          if (res.fileID) {
            const parts = res.fileID.split('/')
            filename = parts[parts.length - 1] || `clinic_report_${Date.now()}.pdf`
          }
          if (fileUrl) {
            this.downloadAndSaveLocal(fileUrl, filename, 'PDF')
          } else {
            uni.showToast({ title: '获取下载链接失败', icon: 'none' })
          }
        } else {
          uni.showToast({ title: '生成PDF失败', icon: 'none' })
        }
      } catch (err) {
        uni.hideLoading()
        console.error('导出PDF失败:', err)
        uni.showToast({ title: '导出失败', icon: 'none' })
      }
    },
    downloadAndSaveLocal(fileUrl, filename, fileType) {
      const fs = wx.getFileSystemManager()
      const folder = `${wx.env.USER_DATA_PATH}`
      const savePath = `${folder}/${filename}`
      try {
        fs.mkdirSync(folder, true)
      } catch (e) {}
      uni.downloadFile({
        url: fileUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            fs.saveFile({
              tempFilePath: res.tempFilePath,
              filePath: savePath,
              success: () => {
                const lower = (filename || '').toLowerCase()
                let fileTypeExt = 'xlsx'
                if (lower.endsWith('.pdf')) fileTypeExt = 'pdf'
                wx.openDocument({
                  filePath: savePath,
                  fileType: fileTypeExt,
                  showMenu: true,
                  fail: () => {
                    uni.showModal({
                      title: `${fileType}文件已保存`,
                      content: `文件已保存到：微信-我-服务-小程序-我的文件/${filename}\n\n请前往微信-我-服务-小程序-我的文件 查看、分享或导出。`,
                      showCancel: false,
                      confirmText: '知道了'
                    })
                  }
                })
              },
              fail: () => {
                uni.showToast({ title: '保存失败', icon: 'none' })
              }
            })
          } else {
            uni.showToast({ title: '下载失败', icon: 'none' })
          }
        },
        fail: () => {
          uni.showToast({ title: '文件下载失败', icon: 'none' })
        }
      })
    },
    formatDateTime(date) {
      if (!date) return ''

      let d
      if (typeof date === 'string') {
        let str = date.trim()
        // 兼容 "yyyy-MM-dd HH:mm" / "yyyy-MM-dd" 这类在 iOS 上无法直接解析的格式
        if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(str)) {
          // 转为 iOS 支持的 "yyyy/MM/dd HH:mm:ss"
          str = str.replace(/-/g, '/') + ':00'
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
          // 仅日期："yyyy/MM/dd"
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
      if (!item || !item.drugName) return ''
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
  // 使用与首页/门诊首页一致的蓝色渐变背景
  background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
  padding-bottom: 140rpx;
}

.page-header {
  // 顶部标题卡片：象牙白圆角卡片，宽度与首页 header-card 对齐
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
  width: 100%;
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

.filter-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
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

.input {
  padding: 18rpx 20rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e5e7eb;
  background: #f9fafb;
  font-size: 28rpx;
  color: #111827;
}

.filter-actions {
  margin-top: 8rpx;
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}

.btn {
  min-width: 150rpx;
  padding: 16rpx 24rpx;
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

.btn.export {
  background: #fff7ed;
  color: #ea580c;
  border: 1rpx solid #fed7aa;
}

.table-section {
  margin: 0 30rpx 20rpx;
}

.table-wrapper {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 12rpx 30rpx rgba(15, 23, 42, 0.06);
  overflow: hidden;
}

.table-header {
  display: flex;
  padding: 22rpx 12rpx;
  background: #f8fafc;
  font-size: 24rpx;
  font-weight: 600;
  color: #475569;
}

.table-body {
  max-height: 900rpx;
}

.table-row {
  display: flex;
  align-items: center;
  padding: 18rpx 12rpx;
  font-size: 24rpx;
  color: #0f172a;
  border-bottom: 1rpx solid #f1f5f9;
}

.table-row:last-child {
  border-bottom: none;
}

.col {
  padding: 0 4rpx;
}

.w-no {
  width: 80rpx;
  text-align: center;
}

.w-date {
  width: 220rpx;
}

.w-name {
  width: 120rpx;
}

.w-main {
  flex: 1;
}

.w-diag {
  flex: 1;
}

.w-drug {
  flex: 1.2;
}

.w-doctor {
  width: 140rpx;
}

.empty-state {
  background: #fff;
  padding: 120rpx 20rpx;
  border-radius: 20rpx;
  text-align: center;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.06);
}

.empty-icon {
  font-size: 90rpx;
}

.empty-text {
  font-size: 30rpx;
}

.empty-hint {
  font-size: 24rpx;
}

/* 门诊查询卡片列表样式 */
.list-section {
  max-width: 702rpx;
  margin: 0 auto 8rpx;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.record-card {
  background: #ffffff;
  border-radius: 22rpx;
  padding: 22rpx 24rpx 20rpx;
  box-shadow: 0 18rpx 40rpx rgba(15, 23, 42, 0.14);
  border: none;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.record-time {
  font-size: 24rpx;
  color: #4b5563;
}

.record-location-wrap {
  padding: 4rpx 10rpx;
  border-radius: 999rpx;
  background: rgba(59, 130, 246, 0.08);
}

.record-location {
  font-size: 22rpx;
  color: #6366f1;
}

.record-main-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 6rpx;
}

.record-main-left {
  flex: 1;
  min-width: 0;
}

.record-main-right {
  display: flex;
  gap: 8rpx;
}

.record-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
}

.record-sub {
  margin-top: 2rpx;
  font-size: 22rpx;
  color: #6b7280;
}

.record-tag {
  font-size: 22rpx;
  color: #6b7280;
  padding: 2rpx 10rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
}

.record-tag.type {
  color: #2563eb;
  background: #dbeafe;
}

.record-field {
  margin-top: 4rpx;
  display: flex;
  align-items: flex-start;
  gap: 8rpx;
}

.field-label {
  font-size: 22rpx;
  color: #9ca3af;
  min-width: 72rpx;
}

.field-value {
  font-size: 24rpx;
  color: #111827;
  flex: 1;
  word-break: break-all;
  white-space: pre-wrap;
}

.record-footer {
  margin-top: 8rpx;
  display: flex;
  justify-content: flex-end;
  gap: 6rpx;
}
</style>
