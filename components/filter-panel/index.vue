<template>
  <view class="filter-panel">
    <view class="filter-row">
      <view class="search-wrapper">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          :placeholder="keywordPlaceholder"
          :value="localKeyword"
          @input="onKeywordInput"
          @confirm="emitSearch"
        />
        <text v-if="localKeyword" class="clear-icon" @tap="clearKeyword">✕</text>
      </view>
      <view v-if="showSearchButton" class="search-btn" @tap="emitSearch">
        <text>查询</text>
      </view>
    </view>

    <view v-if="showDate" class="date-row">
      <view class="date-item">
        <text class="date-label">开始</text>
        <picker mode="date" :value="localStart" @change="onStartChange">
          <view class="date-value">{{ localStart || '不限' }}</view>
        </picker>
      </view>
      <view class="date-divider">~</view>
      <view class="date-item">
        <text class="date-label">结束</text>
        <picker mode="date" :value="localEnd" @change="onEndChange">
          <view class="date-value">{{ localEnd || '不限' }}</view>
        </picker>
      </view>
    </view>

    <view v-if="quickFilters && quickFilters.length" class="chips-row">
      <view
        v-for="item in quickFilters"
        :key="item.value"
        :class="['chip', { active: item.value === activeQuick }]"
        @tap="selectQuick(item.value)"
      >
        {{ item.label }}
      </view>
    </view>

    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'FilterPanel',
  props: {
    keyword: { type: String, default: '' },
    keywordPlaceholder: { type: String, default: '输入关键词' },
    showSearchButton: { type: Boolean, default: true },
    showDate: { type: Boolean, default: false },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    quickFilters: { type: Array, default: () => [] },
    activeQuickFilter: { type: String, default: '' }
  },
  data() {
    return {
      localKeyword: this.keyword,
      localStart: this.startDate,
      localEnd: this.endDate,
      activeQuick: this.activeQuickFilter
    }
  },
  watch: {
    keyword(val) {
      this.localKeyword = val
    },
    startDate(val) {
      this.localStart = val
    },
    endDate(val) {
      this.localEnd = val
    },
    activeQuickFilter(val) {
      this.activeQuick = val
    }
  },
  methods: {
    onKeywordInput(e) {
      const value = e.detail.value
      this.localKeyword = value
      this.$emit('update:keyword', value)
    },
    clearKeyword() {
      this.localKeyword = ''
      this.$emit('update:keyword', '')
      this.emitSearch()
    },
    emitSearch() {
      this.$emit('search')
    },
    onStartChange(e) {
      const value = e.detail.value
      this.localStart = value
      this.$emit('update:startDate', value)
      this.$emit('date-change', { start: value, end: this.localEnd })
    },
    onEndChange(e) {
      const value = e.detail.value
      this.localEnd = value
      this.$emit('update:endDate', value)
      this.$emit('date-change', { start: this.localStart, end: value })
    },
    selectQuick(value) {
      this.activeQuick = value
      this.$emit('quick-filter', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-panel {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.filter-row {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.search-wrapper {
  flex: 1;
  position: relative;
  background: #f5f5f5;
  border-radius: 999rpx;
  padding: 16rpx 50rpx 16rpx 50rpx;
  border: 2rpx solid transparent;
}

.search-wrapper:focus-within {
  background: #ffffff;
  border-color: #667eea;
  box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.15);
}

.search-icon {
  position: absolute;
  left: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28rpx;
  color: #94a3b8;
}

.search-input {
  font-size: 28rpx;
  color: #1f2933;
}

.clear-icon {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  background: #cbd5e1;
  color: #ffffff;
  font-size: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn {
  padding: 0 30rpx;
  height: 70rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 600;
}

.date-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.date-item {
  flex: 1;
  background: #f8fafc;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-label {
  font-size: 24rpx;
  color: #64748b;
}

.date-value {
  font-size: 26rpx;
  color: #1f2933;
}

.date-divider {
  font-size: 28rpx;
  color: #94a3b8;
}

.chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.chip {
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
  background: #f5f5f5;
  font-size: 24rpx;
  color: #475569;
}

.chip.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}
</style>



