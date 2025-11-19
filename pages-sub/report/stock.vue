<template>
  <view class="page">
    <view class="header">
      <text class="title">库存报表</text>
      <text class="subtitle">展示当前库存概况与状态（占位页面，待完善）</text>
    </view>
    <view class="content">
      <text>库存报表功能暂未实现，请稍后再试。</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ReportStock',
  data() {
    return {
    }
  },
  onLoad() {
  }
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}
.header {
  margin-bottom: 24rpx;
}
.title {
  font-size: 34rpx;
  font-weight: 600;
}
.subtitle {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #6b7280;
}
.content {
  margin-top: 32rpx;
  font-size: 28rpx;
  color: #4b5563;
}
</style>
