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
            请先向下滑动阅读完整内容后再点击“已阅读并同意”。
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

        <!-- 门诊日报：跳转到专用日报页面，自动按当天+园区生成 -->
        <view class="grid-card" @tap="goToPage('/pages-sub/report/daily')">
          <view class="card-icon daily"></view>
          <view class="card-text">
            <text class="card-title">门诊日报</text>
          </view>
        </view>

        <!-- 门诊统计分析 -->
        <view class="grid-card" @tap="goToPage('/pages-sub/report/clinic-analysis')">
          <view class="card-icon analysis"></view>
          <view class="card-text">
            <text class="card-title">门诊统计分析</text>
          </view>
        </view>
      </view>
    </view>

    <view class="export-actions">
      <view class="section-header">
        <text class="section-title">快速导出</text>
      </view>
      <view class="export-grid">
        <view class="export-btn" @tap="exportClinicExcel">
          <text class="export-icon">📄</text>
          <text class="export-text">就诊人报表</text>
        </view>
        <view class="export-btn" @tap="exportUsageExcel">
          <text class="export-icon">💊</text>
          <text class="export-text">用药统计报表</text>
        </view>
        <view class="export-btn" @tap="exportStatsExcel">
          <text class="export-icon">📑</text>
          <text class="export-text">就诊+用药(双表)</text>
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
      esigNoMore: false
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
    showDevTip() {
      uni.showToast({
        title: '门诊分析功能开发中',
        icon: 'none'
      })
    },
    getTodayRange() {
      const today = new Date()
      const y = today.getFullYear()
      const m = String(today.getMonth() + 1).padStart(2, '0')
      const d = String(today.getDate()).padStart(2, '0')
      const dateStr = `${y}-${m}-${d}`
      return { startDate: dateStr, endDate: dateStr }
    },
    async exportClinicExcel() {
      try {
        const { startDate, endDate } = this.getTodayRange()
        uni.showLoading({ title: '生成报表...', mask: true })
        const res = await this.$api.callFunction('reports', {
          action: 'exportClinicExcel',
          data: {
            startDate,
            endDate,
            location: 'all',
            printUser: (uni.getStorageSync('userInfo') || {}).name || ''
          }
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
          uni.showToast({ title: '生成报表失败', icon: 'none' })
        }
      } catch (err) {
        uni.hideLoading()
        uni.showToast({ title: '导出失败', icon: 'none' })
      }
    },
    async exportUsageExcel() {
      try {
        const { startDate, endDate } = this.getTodayRange()
        uni.showLoading({ title: '生成报表...', mask: true })
        const res = await this.$api.callFunction('reports', {
          action: 'exportClinicUsageExcel',
          data: {
            startDate,
            endDate,
            location: 'all',
            printUser: (uni.getStorageSync('userInfo') || {}).name || ''
          }
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
          uni.showToast({ title: '生成报表失败', icon: 'none' })
        }
      } catch (err) {
        uni.hideLoading()
        uni.showToast({ title: '导出失败', icon: 'none' })
      }
    },
    async exportStatsExcel() {
      try {
        const { startDate, endDate } = this.getTodayRange()
        uni.showLoading({ title: '生成报表...', mask: true })
        const res = await this.$api.callFunction('reports', {
          action: 'exportClinicStatsExcel',
          data: {
            startDate,
            endDate,
            location: 'all',
            printUser: (uni.getStorageSync('userInfo') || {}).name || ''
          }
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
          uni.showToast({ title: '生成报表失败', icon: 'none' })
        }
      } catch (err) {
        uni.hideLoading()
        uni.showToast({ title: '导出失败', icon: 'none' })
      }
    },
    downloadAndSaveLocal(fileUrl, filename) {
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
                      title: '文件已保存',
                      content: `文件已保存到：微信-我-服务-小程序-我的文件/${filename}`,
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
    }
  }
}
</script>

<style>
.clinic-page {
	min-height: 100vh;
	/* 使用与首页/“我的”页相同的蓝色渐变背景，统一整体风格 */
	background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
	padding-bottom: 40rpx;
}

.header-card {
	/* 统一三张大卡片的上下间距：上 22rpx，下 16rpx */
	margin: 22rpx auto 16rpx;
	padding: 32rpx 28rpx;
	max-width: 702rpx;
	/* 顶部门诊工作台卡片：象牙白圆角卡片，与首页 header-card 一致 */
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
	/* 与 header-card / export-actions 保持一致的下间距 */
	margin: 0 auto 16rpx;
	padding: 24rpx 20rpx 22rpx;
	max-width: 702rpx;
	border-radius: 24rpx;
	/* 门诊功能入口整体为一张象牙白大卡片，与首页快捷操作一致 */
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

.card-icon.analysis {
  background: linear-gradient(135deg, #f97316, #ea580c);
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
	/* 与前两张卡片保持统一的上下间距 */
	margin: 0 auto 24rpx;
	padding: 22rpx 20rpx 26rpx;
	max-width: 702rpx;
	border-radius: 24rpx;
	/* 快速导出区同样使用象牙白卡片容器，统一视觉层级 */
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