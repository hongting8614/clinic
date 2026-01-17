<!-- pages/clinic/index.vue -->
<template>
  <view class="clinic-page">
    <!-- 电子签名须知弹窗 -->
    <view v-if="showEsigNotice" class="esig-mask">
      <view class="esig-dialog">
        <view class="esig-title">电子签名使用须知</view>

        <scroll-view
          scroll-y
          class="esig-content"
          @scrolltolower="onEsigScrollToLower"
        >
          <view class="esig-text">
            <view class="esig-section-title">一、这是什么？</view>
            <view class="esig-section-text">
              电子签名等同于纸质病历上的签字/盖章，表示您已核对并认可本系统中的相关记录内容。
            </view>

            <view class="esig-section-title">二、谁可以用？</view>
            <view class="esig-section-text">
              仅限已在本系统实名登记、具备相应执业资格和权限的医务人员使用，账号不得外借或共用。
            </view>

            <view class="esig-section-title">三、签名前请确认</view>
            <view class="esig-section-text">
              请确认患者姓名、性别、年龄、诊断、用药及用法用量等信息准确无误后再进行签名。
            </view>

            <view class="esig-section-title">四、签名后的记录</view>
            <view class="esig-section-text">
              已签名记录视为正式医疗文书，如需更正应按规定补记或修改，系统会保留完整操作痕迹。
            </view>

            <view class="esig-section-title">五、账号安全</view>
            <view class="esig-section-text">
              如发现账号或密码可能泄露，请立即修改密码并报告相关负责人，配合进行安全检查。
            </view>

            <view class="esig-section-title">六、责任说明</view>
            <view class="esig-section-text">
              您在本系统中的电子签名具有法律效力，与手写签名承担同等责任，请妥善保管账号并规范使用。
            </view>
          </view>
        </scroll-view>

        <view class="esig-footer">
          <view class="esig-row" @tap="toggleEsigNoMore">
            <checkbox :checked="esigNoMore" />
            <text class="esig-tip">下次不再显示</text>
          </view>
          <button
            class="esig-btn"
            :disabled="!esigAgreeEnabled"
            @tap="confirmEsigNotice"
          >
            已阅读并同意
          </button>
          <view v-if="!esigAgreeEnabled" class="esig-hint">
            请先向下滑动阅读完整内容后再点击"已阅读并同意"。
          </view>
        </view>
      </view>
    </view>
    
    <!-- 顶部标题区域 -->
    <view class="header-card">
      <view class="header-content">
        <view class="clinic-title">门诊管理工作台</view>
        <view class="clinic-subtitle">北京欢乐谷医务室</view>
      </view>
    </view>

    <!-- 门诊功能入口 -->
    <view class="quick-actions">
      <view class="section-header">
        <text class="section-title">门诊功能</text>
      </view>

      <view class="grid">
        <!-- 门诊登记 -->
        <view class="grid-card" @tap="goToPage('/pages-sub/clinic/add')">
          <view class="card-icon register"></view>
          <view class="card-text">
            <text class="card-title">门诊登记</text>
          </view>
        </view>

        <!-- 门诊查询 -->
        <view class="grid-card" @tap="goToPage('/pages-sub/report/clinic')">
          <view class="card-icon report"></view>
          <view class="card-text">
            <text class="card-title">门诊查询</text>
          </view>
        </view>

        <!-- 门诊日报：统一使用快速生成逻辑 -->
        <view class="grid-card" @tap="generateTodayReport">
          <view class="card-icon daily"></view>
          <view class="card-text">
            <text class="card-title">门诊日报</text>
          </view>
        </view>
      </view>
    </view>

    <view class="export-actions">
      <view class="section-header">
        <text class="section-title">快速导出</text>
      </view>
      <view class="export-grid">
        <view class="export-btn" @tap="showExportDialog">
          <text class="export-icon">📄</text>
          <text class="export-text">门诊登记表</text>
        </view>
      </view>
    </view>

    <!-- 导出时间段选择弹窗 -->
    <view v-if="showDatePicker" class="date-picker-mask" @tap="closeDatePicker">
      <view class="date-picker-dialog" @tap.stop>
        <view class="dialog-title">选择导出时间段</view>
        
        <!-- 园区选择 -->
        <view class="date-range-section">
          <view class="date-item">
            <text class="date-label">园区</text>
            <picker mode="selector" :range="locationOptions" :value="exportLocationIndex" @change="onExportLocationChange">
              <view class="date-value">{{ locationOptions[exportLocationIndex] }}</view>
            </picker>
          </view>
        </view>
        
        <view class="date-range-section">
          <view class="date-item">
            <text class="date-label">开始日期</text>
            <picker mode="date" :value="exportStartDate" @change="onStartDateChange">
              <view class="date-value">{{ exportStartDate || '请选择' }}</view>
            </picker>
          </view>
          
          <view class="date-item">
            <text class="date-label">结束日期</text>
            <picker mode="date" :value="exportEndDate" @change="onEndDateChange">
              <view class="date-value">{{ exportEndDate || '请选择' }}</view>
            </picker>
          </view>
        </view>

        <view class="quick-date-btns">
          <view class="quick-btn" @tap="selectToday">今天</view>
          <view class="quick-btn" @tap="selectThisWeek">本周</view>
          <view class="quick-btn" @tap="selectThisMonth">本月</view>
        </view>

        <view class="dialog-actions">
          <button class="dialog-btn cancel" @tap="closeDatePicker">取消</button>
          <button class="dialog-btn confirm excel" @tap="confirmExport('excel')">导出Excel</button>
          <button class="dialog-btn confirm pdf" @tap="confirmExport('pdf')">导出PDF</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showEsigNotice: false,
      esigAgreeEnabled: false,
      esigNoMore: false,
      showDatePicker: false,
      exportStartDate: '',
      exportEndDate: '',
      exportLocation: 'land_park',
      exportLocationIndex: 0,
      locationOptions: ['陆园', '水园']
    };
  },
  onShow() {
    this.checkEsigNotice();
  },
  methods: {
    goToPage(url) {
      uni.navigateTo({
        url,
        fail: () => {
          uni.showToast({ title: '页面开发中', icon: 'none' })
        }
      })
    },
    
    // 生成今日门诊日报（与报表中心逻辑统一）
    async generateTodayReport() {
      try {
        const today = new Date()
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')
        const dateStr = `${year}-${month}-${day}`
        
        // 获取用户信息和园区
        let location = 'land_park'
        try {
          const userInfo = uni.getStorageSync('userInfo')
          if (userInfo && userInfo.location) {
            location = userInfo.location
          } else {
            // 如果用户信息中没有园区，尝试获取最近使用的园区
            const last = uni.getStorageSync('clinic_last_location')
            if (last === 'land_park' || last === 'water_park') {
              location = last
            }
          }
        } catch (e) {
          console.error('获取园区信息失败:', e)
        }
        
        console.log('生成日报参数:', { dateStr, location })
        
        // 直接跳转到门诊日报页面（无论是否有记录都生成日报）
        uni.navigateTo({
          url: `/pages-sub/report/daily?date=${dateStr}&location=${location}`
        })
      } catch (err) {
        console.error('生成日报失败:', err)
        uni.showToast({ title: '生成失败', icon: 'none' })
      }
    },
    
    checkEsigNotice() {
      try {
        const closed = uni.getStorageSync('esig_notice_closed');
        if (!closed) {
          this.showEsigNotice = true;
          this.esigAgreeEnabled = false;
          this.esigNoMore = false;
        }
      } catch (e) {
        this.showEsigNotice = true;
      }
    },
    onEsigScrollToLower() {
      this.esigAgreeEnabled = true;
    },
    toggleEsigNoMore() {
      this.esigNoMore = !this.esigNoMore;
    },
    confirmEsigNotice() {
      if (!this.esigAgreeEnabled) {
        uni.showToast({ title: '请先阅读完整内容', icon: 'none' });
        return;
      }
      if (this.esigNoMore) {
        try {
          uni.setStorageSync('esig_notice_closed', true);
        } catch (e) {
          console.error('保存电子签名须知状态失败', e);
        }
      }
      this.showEsigNotice = false;
    },
    
    // 显示导出对话框
    showExportDialog() {
      // 默认选择今天
      const today = this.formatDate(new Date())
      this.exportStartDate = today
      this.exportEndDate = today
      
      // 获取用户园区，设置默认选择
      try {
        const userInfo = uni.getStorageSync('userInfo')
        if (userInfo && userInfo.location) {
          this.exportLocation = userInfo.location
          this.exportLocationIndex = userInfo.location === 'land_park' ? 0 : 1
        } else {
          // 尝试从最近使用的园区获取
          const last = uni.getStorageSync('clinic_last_location')
          if (last === 'land_park' || last === 'water_park') {
            this.exportLocation = last
            this.exportLocationIndex = last === 'land_park' ? 0 : 1
          }
        }
      } catch (e) {
        console.error('获取园区信息失败:', e)
      }
      
      this.showDatePicker = true
    },
    
    // 园区选择变化
    onExportLocationChange(e) {
      this.exportLocationIndex = e.detail.value
      this.exportLocation = this.exportLocationIndex === 0 ? 'land_park' : 'water_park'
    },
    
    // 关闭日期选择器
    closeDatePicker() {
      this.showDatePicker = false
    },
    
    // 开始日期变化
    onStartDateChange(e) {
      this.exportStartDate = e.detail.value
    },
    
    // 结束日期变化
    onEndDateChange(e) {
      this.exportEndDate = e.detail.value
    },
    
    // 格式化日期
    formatDate(date) {
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    },
    
    // 选择今天
    selectToday() {
      const today = this.formatDate(new Date())
      this.exportStartDate = today
      this.exportEndDate = today
    },
    
    // 选择本周
    selectThisWeek() {
      const now = new Date()
      const day = now.getDay()
      const diff = day === 0 ? 6 : day - 1 // 周一为第一天
      
      const monday = new Date(now)
      monday.setDate(now.getDate() - diff)
      
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      
      this.exportStartDate = this.formatDate(monday)
      this.exportEndDate = this.formatDate(sunday)
    },
    
    // 选择本月
    selectThisMonth() {
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      this.exportStartDate = this.formatDate(firstDay)
      this.exportEndDate = this.formatDate(lastDay)
    },
    
    // 确认导出
    async confirmExport(format) {
      if (!this.exportStartDate || !this.exportEndDate) {
        uni.showToast({ title: '请选择时间段', icon: 'none' })
        return
      }
      
      // 验证日期范围
      if (this.exportStartDate > this.exportEndDate) {
        uni.showToast({ title: '开始日期不能晚于结束日期', icon: 'none' })
        return
      }
      
      this.closeDatePicker()
      
      if (format === 'pdf') {
        await this.exportClinicPDF()
      } else {
        await this.exportClinicExcel()
      }
    },
    
    // 导出门诊登记表 Excel
    async exportClinicExcel() {
      try {
        console.log('开始导出Excel，参数:', {
          startDate: this.exportStartDate,
          endDate: this.exportEndDate,
          location: this.exportLocation
        })
        
        uni.showLoading({ title: '生成Excel...', mask: true })
        const res = await this.$api.callFunction('reports', {
          action: 'exportClinicExcel',
          data: {
            startDate: this.exportStartDate,
            endDate: this.exportEndDate,
            location: this.exportLocation,
            printUser: (uni.getStorageSync('userInfo') || {}).name || ''
          }
        })
        
        console.log('云函数返回结果:', res)
        uni.hideLoading()
        
        if (res?.success && res.fileID && res.filename) {
          console.log('开始获取临时下载链接:', res.fileID)
          
          const urlRes = await wx.cloud.getTempFileURL({ fileList: [res.fileID] })
          console.log('临时链接结果:', urlRes)
          
          const fileUrl = urlRes?.fileList?.[0]?.tempFileURL
          if (fileUrl) {
            this.downloadAndSaveLocal(fileUrl, res.filename)
          } else {
            console.error('获取临时链接失败:', urlRes)
            uni.showToast({ 
              title: '获取下载链接失败', 
              icon: 'none',
              duration: 3000
            })
          }
        } else {
          console.error('生成Excel失败，返回结果:', res)
          uni.showToast({ 
            title: res?.message || '生成Excel失败', 
            icon: 'none',
            duration: 3000
          })
        }
      } catch (err) {
        uni.hideLoading()
        console.error('导出Excel异常:', err)
        uni.showToast({ 
          title: `导出失败: ${err.message || '未知错误'}`, 
          icon: 'none',
          duration: 3000
        })
      }
    },
    
    // 导出门诊登记表 PDF
    async exportClinicPDF() {
      try {
        console.log('开始导出PDF，参数:', {
          startDate: this.exportStartDate,
          endDate: this.exportEndDate,
          location: this.exportLocation
        })
        
        uni.showLoading({ title: '生成PDF...', mask: true })
        const res = await this.$api.callFunction('reports', {
          action: 'exportClinicPDF',
          data: {
            startDate: this.exportStartDate,
            endDate: this.exportEndDate,
            location: this.exportLocation,
            printUser: (uni.getStorageSync('userInfo') || {}).name || ''
          }
        })
        
        console.log('云函数返回结果:', res)
        uni.hideLoading()
        
        if (res?.success && res.fileID) {
          console.log('开始获取临时下载链接:', res.fileID)
          
          const urlRes = await wx.cloud.getTempFileURL({ fileList: [res.fileID] })
          console.log('临时链接结果:', urlRes)
          
          const fileUrl = urlRes?.fileList?.[0]?.tempFileURL
          let filename = ''
          if (res.fileID) {
            const parts = res.fileID.split('/')
            filename = parts[parts.length - 1] || `clinic_report_${Date.now()}.pdf`
          }
          if (fileUrl) {
            this.downloadAndSaveLocal(fileUrl, filename)
          } else {
            console.error('获取临时链接失败:', urlRes)
            uni.showToast({ 
              title: '获取下载链接失败', 
              icon: 'none',
              duration: 3000
            })
          }
        } else {
          console.error('生成PDF失败，返回结果:', res)
          uni.showToast({ 
            title: res?.message || '生成PDF失败', 
            icon: 'none',
            duration: 3000
          })
        }
      } catch (err) {
        uni.hideLoading()
        console.error('导出PDF异常:', err)
        uni.showToast({ 
          title: `导出失败: ${err.message || '未知错误'}`, 
          icon: 'none',
          duration: 3000
        })
      }
    },
    
    downloadAndSaveLocal(fileUrl, filename) {
      console.log('开始下载文件:', fileUrl, filename)
      
      if (!fileUrl) {
        console.error('文件URL为空')
        uni.showToast({ title: '文件地址无效', icon: 'none' })
        return
      }
      
      const fs = wx.getFileSystemManager()
      const folder = `${wx.env.USER_DATA_PATH}`
      const savePath = `${folder}/${filename}`
      
      try {
        fs.mkdirSync(folder, true)
      } catch (e) {
        console.log('创建目录:', e)
      }
      
      uni.showLoading({ title: '下载中...', mask: true })
      
      uni.downloadFile({
        url: fileUrl,
        success: (res) => {
          console.log('下载响应:', res)
          
          if (res.statusCode === 200) {
            console.log('下载成功，开始保存文件')
            
            fs.saveFile({
              tempFilePath: res.tempFilePath,
              filePath: savePath,
              success: () => {
                console.log('文件保存成功:', savePath)
                uni.hideLoading()
                
                const lower = (filename || '').toLowerCase()
                let fileTypeExt = 'xlsx'
                if (lower.endsWith('.pdf')) fileTypeExt = 'pdf'
                
                wx.openDocument({
                  filePath: savePath,
                  fileType: fileTypeExt,
                  showMenu: true,
                  success: () => {
                    console.log('文件打开成功')
                  },
                  fail: (err) => {
                    console.error('打开文件失败:', err)
                    uni.showModal({
                      title: '文件已保存',
                      content: `文件已保存到：微信-我-服务-小程序-我的文件/${filename}`,
                      showCancel: false,
                      confirmText: '知道了'
                    })
                  }
                })
              },
              fail: (err) => {
                console.error('保存文件失败:', err)
                uni.hideLoading()
                uni.showToast({ 
                  title: `保存失败: ${err.errMsg || '未知错误'}`, 
                  icon: 'none',
                  duration: 3000
                })
              }
            })
          } else {
            console.error('下载失败，状态码:', res.statusCode)
            uni.hideLoading()
            uni.showToast({ 
              title: `下载失败(${res.statusCode})`, 
              icon: 'none',
              duration: 3000
            })
          }
        },
        fail: (err) => {
          console.error('下载请求失败:', err)
          uni.hideLoading()
          uni.showToast({ 
            title: `文件下载失败: ${err.errMsg || '网络错误'}`, 
            icon: 'none',
            duration: 3000
          })
        }
      })
    }
  }
}
</script>

<style>
.clinic-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding-bottom: 40rpx;
}

.header-card {
	margin: 22rpx auto 16rpx;
	padding: 32rpx 28rpx;
	max-width: 702rpx;
	background: #FFFFF0;
	border-radius: 22rpx;
	box-shadow:
		0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
		0 -1rpx 0 rgba(15, 23, 42, 0.06) inset,
		0 18rpx 40rpx rgba(15, 23, 42, 0.14);
}

.header-content {
  color: #0f172a;
}

.clinic-title {
  font-size: 40rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.clinic-subtitle {
  font-size: 26rpx;
  opacity: 0.85;
}

.quick-actions {
	margin: 0 auto 16rpx;
	padding: 24rpx 20rpx 22rpx;
	max-width: 702rpx;
	border-radius: 24rpx;
	background: #FFFFF0;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.section-header {
  margin-bottom: 18rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #0f172a;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx;
}

.grid-card {
  background: #ffffff;
  border-radius: 22rpx;
  padding: 24rpx 20rpx;
  box-shadow: 0 14rpx 30rpx rgba(15, 23, 42, 0.12);
  display: flex;
  align-items: center;
}

.grid-card.disabled {
  opacity: 0.5;
}

.card-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 999rpx;
  margin-right: 18rpx;
}

.card-icon.register {
  background: linear-gradient(135deg, #34d399, #059669);
}

.card-icon.report {
  background: linear-gradient(135deg, #60a5fa, #2563eb);
}

.card-icon.daily {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
}

.card-text {
  flex: 1;
}

.card-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4rpx;
}

.card-desc {
  display: block;
  font-size: 24rpx;
  color: #6b7280;
}

.export-actions {
	margin: 0 auto 24rpx;
	padding: 22rpx 20rpx 26rpx;
	max-width: 702rpx;
	border-radius: 24rpx;
	background: #FFFFF0;
	box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.export-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.export-btn {
  flex: 1;
  min-width: 30%;
  padding: 18rpx 22rpx;
  border-radius: 999rpx;
  background: #ffffff;
  box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.12);
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.export-icon {
  font-size: 28rpx;
}

.export-text {
  font-size: 26rpx;
  color: #111827;
}

/* 日期选择弹窗样式 */
.date-picker-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.date-picker-dialog {
  width: 86%;
  max-width: 640rpx;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx 28rpx;
  box-shadow: 0 18rpx 40rpx rgba(15, 23, 42, 0.35);
}

.dialog-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24rpx;
  text-align: center;
}

.date-range-section {
  margin-bottom: 20rpx;
}

.date-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  background: #f9fafb;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
}

.date-label {
  font-size: 28rpx;
  color: #374151;
  font-weight: 500;
}

.date-value {
  font-size: 28rpx;
  color: #2563eb;
  padding: 8rpx 16rpx;
  background: #ffffff;
  border-radius: 8rpx;
  border: 1rpx solid #e5e7eb;
}

.quick-date-btns {
  display: flex;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.quick-btn {
  flex: 1;
  padding: 12rpx 0;
  text-align: center;
  font-size: 26rpx;
  color: #2563eb;
  background: #eff6ff;
  border-radius: 8rpx;
  border: 1rpx solid #bfdbfe;
}

.dialog-actions {
  display: flex;
  gap: 12rpx;
}

.dialog-btn {
  flex: 1;
  padding: 14rpx 0;
  border-radius: 999rpx;
  font-size: 26rpx;
  border: none;
}

.dialog-btn.cancel {
  background: #f3f4f6;
  color: #6b7280;
}

.dialog-btn.confirm {
  color: #ffffff;
}

.dialog-btn.excel {
  background: #10b981;
}

.dialog-btn.pdf {
  background: #ef4444;
}

.esig-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.esig-dialog {
  width: 86%;
  max-width: 680rpx;
  max-height: 80vh;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 28rpx 24rpx 22rpx;
  box-shadow: 0 18rpx 40rpx rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
}

.esig-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  margin-bottom: 18rpx;
  text-align: center;
}

.esig-content {
  flex: 1;
  max-height: 480rpx;
}

.esig-text {
  padding-right: 8rpx;
}

.esig-section-title {
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 6rpx;
  color: #111827;
}

.esig-section-text {
  font-size: 24rpx;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 14rpx;
}

.esig-footer {
  margin-top: 16rpx;
}

.esig-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.esig-tip {
  margin-left: 8rpx;
  font-size: 24rpx;
  color: #4b5563;
}

.esig-btn {
  width: 100%;
  border-radius: 999rpx;
  background: #2563eb;
  color: #ffffff;
  font-size: 28rpx;
}

.esig-btn[disabled] {
  background: #9ca3af;
}

.esig-hint {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #9ca3af;
  text-align: center;
}
</style>

