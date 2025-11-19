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

    <!-- 结果列表 -->
    <view class="table-section">
      <view v-if="records.length" class="table-wrapper">
        <view class="table-header">
          <text class="col w-no">序号</text>
          <text class="col w-date">就诊时间</text>
          <text class="col w-name">姓名</text>
          <text class="col w-main">主诉</text>
          <text class="col w-diag">诊断</text>
          <text class="col w-drug">用药信息</text>
          <text class="col w-doctor">医生</text>
        </view>
        <scroll-view scroll-y class="table-body">
          <view
            class="table-row"
            v-for="(item, index) in records"
            :key="item._id || index"
          >
            <text class="col w-no">{{ index + 1 }}</text>
            <text class="col w-date">{{ formatDateTime(item.visitDateTime || item.createTime) }}</text>
            <text class="col w-name">{{ item.name || '-' }}</text>
            <text class="col w-main">{{ item.chiefComplaint || '-' }}</text>
            <text class="col w-diag">{{ item.diagnosis || '-' }}</text>
            <text class="col w-drug">{{ renderDrugInfo(item) }}</text>
            <text class="col w-doctor">{{ item.doctorName || '-' }}</text>
          </view>
        </scroll-view>
      </view>
      <view v-else class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无门诊记录</text>
        <text class="empty-hint">请选择日期和条件后点击查询</text>
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
      const locMap = {
        land_park: '陆园',
        water_park: '水园'
      }
      const locText = locMap[this.filters.location]
      if (locText) {
        return `北京欢乐谷医务室（${locText}）门诊登记表`
      }
      return '北京欢乐谷医务室门诊登记表'
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
  background: #f8f9fa;
  padding-bottom: 140rpx;
}

.page-header {
  padding: 40rpx 30rpx 20rpx;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
}

.page-header-inner {
  width: 100%;
  display: flex;
  justify-content: center;
}

.page-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #1e1b4b;
}

.filter-card {
  margin: 0 30rpx 20rpx;
  padding: 24rpx 24rpx 20rpx;
  background: #fff;
  border-radius: 18rpx;
  box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.06);
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
</style>
