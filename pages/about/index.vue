<template>
  <view class="about-page">
    <view class="about-card">
      <view class="about-title">关于项目</view>
      <view class="about-text">
        <text>北京欢乐谷医务室管理系统</text>
        <text>用于园区医务室的门诊登记、用药管理、库存与报表统计。</text>
      </view>
    </view>

    <view class="about-card">
      <view class="about-subtitle">电子签名使用须知（简要）</view>
      <scroll-view scroll-y class="about-esig-scroll">
        <view class="about-esig-text">
          <text class="sec-title">一、这是什么？</text>
          <text class="sec-text">电子签名等同于纸质病历上的签字/盖章，表示您已核对并认可相关记录内容。</text>

          <text class="sec-title">二、谁可以用？</text>
          <text class="sec-text">仅限已在系统实名登记、具备相应执业资格和权限的医务人员使用，账号不得外借或共用。</text>

          <text class="sec-title">三、签名前请确认</text>
          <text class="sec-text">请确认患者姓名、性别、年龄、诊断、用药及用法用量等信息准确无误后再进行签名。</text>

          <text class="sec-title">四、签名后的记录</text>
          <text class="sec-text">已签名记录视为正式医疗文书，如需更正应按规定补记或修改，系统会保留完整操作痕迹。</text>

          <text class="sec-title">五、账号和责任</text>
          <text class="sec-text">请妥善保管账号和密码，如发现异常请及时修改并上报。您的电子签名具有法律效力，与手写签名承担同等责任。</text>
        </view>
      </scroll-view>
      <view class="about-esig-footer">
        <text class="status-text">当前登录弹窗状态：{{ esigStatusText }}</text>
        <button class="reset-btn" @tap="resetEsigNotice">重置登录弹窗</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      esigClosed: false,
      esigStatusText: ''
    };
  },
  onShow() {
    this.refreshEsigStatus();
  },
  methods: {
    refreshEsigStatus() {
      try {
        const closed = uni.getStorageSync('esig_notice_closed');
        this.esigClosed = !!closed;
        this.esigStatusText = closed
          ? '已选择“下次不再显示”，登录时不再弹出'
          : '登录进入门诊首页时仍会弹出电子签名须知';
      } catch (e) {
        this.esigClosed = false;
        this.esigStatusText = '状态未知，默认会在登录时弹出电子签名须知';
      }
    },
    resetEsigNotice() {
      try {
        uni.removeStorageSync('esig_notice_closed');
        this.refreshEsigStatus();
        uni.showToast({ title: '已重置，下次登录会重新显示须知', icon: 'none' });
      } catch (e) {
        uni.showToast({ title: '重置失败，请重试', icon: 'none' });
      }
    }
  }
};
</script>

<style>
.about-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0f2fe 0%, #e5e7eb 100%);
  padding: 24rpx 20rpx 40rpx;
}

.about-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx 22rpx;
  box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.12);
  margin-bottom: 20rpx;
}

.about-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12rpx;
}

.about-subtitle {
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
  margin-bottom: 10rpx;
}

.about-text text {
  display: block;
  font-size: 26rpx;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 6rpx;
}

.about-esig-scroll {
  max-height: 420rpx;
}

.about-esig-text {
  padding-right: 8rpx;
}

.sec-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  margin: 8rpx 0 4rpx;
  color: #111827;
}

.sec-text {
  display: block;
  font-size: 24rpx;
  color: #4b5563;
  line-height: 1.6;
}

.about-esig-footer {
  margin-top: 16rpx;
}

.status-text {
  display: block;
  font-size: 24rpx;
  color: #6b7280;
  margin-bottom: 10rpx;
}

.reset-btn {
  width: 100%;
  border-radius: 999rpx;
  background: #2563eb;
  color: #ffffff;
  font-size: 26rpx;
}
</style>
