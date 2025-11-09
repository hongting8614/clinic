<template>
  <view class="test-page">
    <view class="page-header">
      <view class="title">🧪 签名组件测试</view>
      <view class="subtitle">Signature Component Test</view>
    </view>

    <!-- 测试说明 -->
    <view class="test-info">
      <view class="info-title">📋 测试项目</view>
      <view class="info-list">
        <view class="info-item">✅ 基础签名功能</view>
        <view class="info-item">✅ 笔粗调节</view>
        <view class="info-item">✅ 清空重写</view>
        <view class="info-item">✅ 云存储上传</view>
        <view class="info-item">✅ 二次确认</view>
        <view class="info-item">✅ 动画效果</view>
      </view>
    </view>

    <!-- 测试按钮区 -->
    <view class="test-section">
      <view class="section-title">🎯 测试操作</view>
      
      <button class="test-btn primary" @click="testBasicSignature">
        ✍️ 测试基础签名
      </button>
      
      <button class="test-btn success" @click="testInboundSign">
        📦 测试入库签名
      </button>
      
      <button class="test-btn info" @click="testClinicSign">
        🏥 测试门诊签名
      </button>
      
      <button class="test-btn warning" @click="clearAllTests">
        🗑️ 清空所有测试
      </button>
    </view>

    <!-- 测试结果展示 -->
    <view class="result-section">
      <view class="section-title">📊 测试结果</view>
      
      <!-- 基础签名结果 -->
      <view v-if="basicSign" class="result-card">
        <view class="card-header">
          <text class="card-title">基础签名</text>
          <text class="card-status success">✅ 成功</text>
        </view>
        <view class="card-body">
          <image :src="basicSign" mode="aspectFit" class="sign-image" />
          <view class="sign-info">
            <text class="info-label">文件路径:</text>
            <text class="info-value">{{ basicSign }}</text>
          </view>
          <view class="sign-info">
            <text class="info-label">签名时间:</text>
            <text class="info-value">{{ basicSignTime }}</text>
          </view>
        </view>
      </view>

      <!-- 入库签名结果 -->
      <view v-if="inboundSign || reviewSign" class="result-card">
        <view class="card-header">
          <text class="card-title">入库双签名</text>
          <text class="card-status success">✅ 成功</text>
        </view>
        <view class="card-body">
          <view v-if="inboundSign" class="sign-group">
            <text class="sign-label">入库人签名:</text>
            <image :src="inboundSign" mode="aspectFit" class="sign-image-small" />
          </view>
          <view v-if="reviewSign" class="sign-group">
            <text class="sign-label">复核人签名:</text>
            <image :src="reviewSign" mode="aspectFit" class="sign-image-small" />
          </view>
        </view>
      </view>

      <!-- 门诊签名结果 -->
      <view v-if="doctorSign" class="result-card">
        <view class="card-header">
          <text class="card-title">门诊医生签名</text>
          <text class="card-status success">✅ 成功</text>
        </view>
        <view class="card-body">
          <image :src="doctorSign" mode="aspectFit" class="sign-image" />
          <view class="sign-info">
            <text class="info-label">医生:</text>
            <text class="info-value">李医生</text>
          </view>
          <view class="sign-info">
            <text class="info-label">签名时间:</text>
            <text class="info-value">{{ doctorSignTime }}</text>
          </view>
        </view>
      </view>

      <!-- 无结果提示 -->
      <view v-if="!hasAnySign" class="empty-result">
        <text class="empty-icon">📝</text>
        <text class="empty-text">暂无测试结果</text>
        <text class="empty-hint">点击上方按钮开始测试</text>
      </view>
    </view>

    <!-- 测试统计 -->
    <view class="stats-section">
      <view class="section-title">📈 测试统计</view>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ testCount }}</text>
          <text class="stat-label">测试次数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ successCount }}</text>
          <text class="stat-label">成功次数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ signCount }}</text>
          <text class="stat-label">签名数量</text>
        </view>
      </view>
    </view>

    <!-- 签名组件 -->
    <signature-v2
      v-if="showSignature"
      :title="currentTitle"
      @confirm="handleSignConfirm"
      @close="showSignature = false"
    />
  </view>
</template>

<script>
import SignatureV2 from '@/components/signature/signature-v2.vue';

export default {
  components: {
    SignatureV2
  },
  data() {
    return {
      // 签名显示控制
      showSignature: false,
      currentTitle: '',
      currentType: '',
      
      // 测试结果
      basicSign: '',
      basicSignTime: '',
      inboundSign: '',
      reviewSign: '',
      doctorSign: '',
      doctorSignTime: '',
      
      // 统计数据
      testCount: 0,
      successCount: 0
    };
  },
  computed: {
    hasAnySign() {
      return this.basicSign || this.inboundSign || this.reviewSign || this.doctorSign;
    },
    signCount() {
      let count = 0;
      if (this.basicSign) count++;
      if (this.inboundSign) count++;
      if (this.reviewSign) count++;
      if (this.doctorSign) count++;
      return count;
    }
  },
  methods: {
    // 测试基础签名
    testBasicSignature() {
      this.currentTitle = '请签名测试';
      this.currentType = 'basic';
      this.showSignature = true;
      this.testCount++;
    },

    // 测试入库签名
    testInboundSign() {
      if (!this.inboundSign) {
        this.currentTitle = '入库人签名';
        this.currentType = 'inbound';
      } else if (!this.reviewSign) {
        this.currentTitle = '复核人签名';
        this.currentType = 'review';
      } else {
        uni.showToast({
          title: '✅ 入库双签名已完成',
          icon: 'none'
        });
        return;
      }
      this.showSignature = true;
      this.testCount++;
    },

    // 测试门诊签名
    testClinicSign() {
      this.currentTitle = '接诊医生签名';
      this.currentType = 'doctor';
      this.showSignature = true;
      this.testCount++;
    },

    // 处理签名确认
    handleSignConfirm(fileID) {
      console.log('签名成功:', fileID);
      
      const currentTime = this.getCurrentTime();
      
      switch (this.currentType) {
        case 'basic':
          this.basicSign = fileID;
          this.basicSignTime = currentTime;
          break;
        case 'inbound':
          this.inboundSign = fileID;
          break;
        case 'review':
          this.reviewSign = fileID;
          break;
        case 'doctor':
          this.doctorSign = fileID;
          this.doctorSignTime = currentTime;
          break;
      }
      
      this.showSignature = false;
      this.successCount++;
      
      uni.showToast({
        title: '✅ 签名成功',
        icon: 'success',
        duration: 2000
      });
    },

    // 清空所有测试
    clearAllTests() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空所有测试结果吗?',
        confirmText: '确定清空',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.basicSign = '';
            this.basicSignTime = '';
            this.inboundSign = '';
            this.reviewSign = '';
            this.doctorSign = '';
            this.doctorSignTime = '';
            this.testCount = 0;
            this.successCount = 0;
            
            uni.showToast({
              title: '✅ 已清空',
              icon: 'success'
            });
          }
        }
      });
    },

    // 获取当前时间
    getCurrentTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20rpx 20rpx 40rpx;
}

.page-header {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;
  text-align: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 44rpx;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 12rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #999;
}

.test-info {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.info-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.info-item {
  font-size: 26rpx;
  color: #666;
  padding: 12rpx 20rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
}

.test-section,
.result-section,
.stats-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 3rpx solid #e8e8e8;
}

.test-btn {
  width: 100%;
  padding: 28rpx;
  border-radius: 12rpx;
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
  border: none;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  &.success {
    background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
    color: white;
  }
  
  &.info {
    background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
    color: white;
  }
  
  &.warning {
    background: linear-gradient(135deg, #faad14 0%, #d46b08 100%);
    color: white;
  }
}

.result-card {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  border: 2rpx solid #e0e0e0;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid #e0e0e0;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.card-status {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  
  &.success {
    background: #f6ffed;
    color: #52c41a;
    border: 2rpx solid #b7eb8f;
  }
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.sign-image {
  width: 100%;
  height: 200rpx;
  background: white;
  border-radius: 12rpx;
  border: 2rpx solid #e0e0e0;
}

.sign-image-small {
  width: 100%;
  height: 150rpx;
  background: white;
  border-radius: 12rpx;
  border: 2rpx solid #e0e0e0;
}

.sign-info {
  display: flex;
  align-items: center;
  font-size: 24rpx;
}

.info-label {
  color: #999;
  margin-right: 12rpx;
  min-width: 120rpx;
}

.info-value {
  color: #333;
  flex: 1;
  word-break: break-all;
}

.sign-group {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.sign-label {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
}

.empty-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 12rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: #bbb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12rpx;
  border: 2rpx solid #bae6fd;
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #0369a1;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #0891b2;
}
</style>


