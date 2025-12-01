<template>
  <view class="container">
    <!-- 顶部盘点单信息卡片 -->
    <view class="header-card">
      <view class="row-main">
        <text class="record-no">{{ inventory.recordNo }}</text>
        <text :class="['status-tag', 'status-' + inventory.status]">{{ renderStatus(inventory.status) }}</text>
      </view>
      <view class="row-sub">
        <text class="label">盘点范围：</text>
        <text class="value">{{ renderLocation(inventory.location) }}</text>
      </view>
      <view class="row-sub">
        <text class="label">盘点人：</text>
        <text class="value">{{ inventory.operator || '-' }}</text>
      </view>
      <view class="row-sub">
        <text class="label">盘点时间：</text>
        <text class="value">{{ formatDateTime(inventory.createTime) }}</text>
      </view>
    </view>

    <!-- 差异汇总 -->
    <view class="summary-card" v-if="inventory.details && inventory.details.length">
      <view class="summary-item">
        <text class="summary-label">盘点品种</text>
        <text class="summary-value">{{ inventory.details.length }}</text>
      </view>
      <view class="summary-item">
        <text class="summary-label">盘盈数量</text>
        <text class="summary-value positive">{{ totalOverQty }}</text>
      </view>
      <view class="summary-item">
        <text class="summary-label">盘亏数量</text>
        <text class="summary-value negative">{{ totalShortQty }}</text>
      </view>
    </view>

    <!-- 明细列表 -->
    <view class="detail-list" v-if="inventory.details && inventory.details.length">
      <view
        v-for="(row, index) in inventory.details"
        :key="row.stockId"
        class="detail-card"
      >
        <view class="detail-header">
          <text class="drug-name">{{ row.drugName }}</text>
          <text class="batch-no">批号：{{ row.batchNo || '-' }}</text>
        </view>
        <view class="detail-body">
          <view class="line">
            <text class="label">系统数量：</text>
            <text class="value">{{ row.systemQty }} {{ row.unit || '' }}</text>
          </view>
          <view class="line input-line">
            <text class="label">实盘数量：</text>
            <input
              class="input"
              type="number"
              v-model.number="row.actualQty"
              @blur="recalcDiff(index)"
              @confirm="recalcDiff(index)"
            />
            <text class="unit">{{ row.unit || '' }}</text>
          </view>
          <view class="line">
            <text class="label">差异：</text>
            <text :class="['diff', diffClass(row.diffQty)]">
              {{ formatDiff(row.diffQty) }}
            </text>
          </view>
          <view class="line remark-line">
            <text class="label">备注：</text>
            <input
              class="remark-input"
              v-model.trim="row.remark"
              placeholder="可填写破损、过期、丢失等原因"
            />
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无盘点明细</text>
      <text class="empty-hint">可从库存生成或稍后再试</text>
    </view>

    <!-- 底部操作条（仅示意，不改库存） -->
    <view class="footer-bar" v-if="inventory.details && inventory.details.length">
      <view class="footer-btn ghost" @tap="saveDraft">
        <text>保存草稿</text>
      </view>
      <view class="footer-btn primary" @tap="submitInventory">
        <text>提交盘点</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'InventoryDetail',
  data() {
    return {
      loading: false,
      notFound: false,
      inventory: {
        recordNo: 'PD202511230001',
        status: 'in_progress',
        location: 'all',
        operator: '开发者',
        createTime: '2025-11-23T12:34:56.000Z',
        details: [
          {
            stockId: 'stock_001',
            drugId: 'drug_001',
            drugName: '布洛芬缓释胶囊',
            batchNo: '20231101',
            unit: '盒',
            systemQty: 10,
            actualQty: 8,
            diffQty: -2,
            remark: '破损2盒'
          },
          {
            stockId: 'stock_002',
            drugId: 'drug_002',
            drugName: '感冒灵颗粒',
            batchNo: '20231015',
            unit: '盒',
            systemQty: 20,
            actualQty: 20,
            diffQty: 0,
            remark: ''
          }
        ]
      }
    }
  },
  computed: {
    totalOverQty() {
      return this.inventory.details.reduce((sum, row) => {
        return sum + (row.diffQty > 0 ? row.diffQty : 0)
      }, 0)
    },
    totalShortQty() {
      return this.inventory.details.reduce((sum, row) => {
        return sum + (row.diffQty < 0 ? Math.abs(row.diffQty) : 0)
      }, 0)
    }
  },
  onLoad(options) {
    if (options && options.id) {
      this.fetchInventory(options.id)
    }
  },
  methods: {
    async fetchInventory(id) {
      this.loading = true
      try {
        const db = wx.cloud.database()
        const res = await db.collection('inventory').doc(id).get()
        if (res && res.data) {
          // 确保 details 至少是一个数组
          const doc = res.data
          doc.details = Array.isArray(doc.details) ? doc.details : []
          // 为每条明细补齐必需字段，避免 undefined
          doc.details = doc.details.map((row, index) => ({
            stockId: row.stockId || String(index),
            drugId: row.drugId || '',
            drugName: row.drugName || '',
            batchNo: row.batchNo || '',
            unit: row.unit || '',
            systemQty: Number(row.systemQty) || 0,
            actualQty: typeof row.actualQty === 'number' ? row.actualQty : Number(row.systemQty) || 0,
            diffQty: typeof row.diffQty === 'number' ? row.diffQty : 0,
            remark: row.remark || ''
          }))
          this.inventory = doc
        } else {
          this.notFound = true
          uni.showToast({ title: '盘点单不存在', icon: 'none' })
        }
      } catch (e) {
        console.error('加载盘点单失败', e)
        this.notFound = true
        uni.showToast({ title: '加载盘点单失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    recalcDiff(index) {
      const row = this.inventory.details && this.inventory.details[index]
      if (!row) return
      const sys = Number(row.systemQty) || 0
      const act = Number(row.actualQty)
      if (Number.isNaN(act)) {
        row.actualQty = sys
        row.diffQty = 0
      } else {
        row.diffQty = act - sys
      }
    },
    diffClass(diff) {
      if (diff > 0) return 'positive'
      if (diff < 0) return 'negative'
      return 'neutral'
    },
    formatDiff(diff) {
      if (!diff) return '0'
      return diff > 0 ? `+${diff}` : `${diff}`
    },
    renderStatus(status) {
      const map = {
        draft: '草稿',
        in_progress: '进行中',
        completed: '已完成'
      }
      return map[status] || status
    },
    renderLocation(loc) {
      const map = {
        all: '库存',
        land_park: '陆园',
        water_park: '水园'
      }
      return map[loc] || '库存'
    },
    formatDateTime(dateStr) {
      if (!dateStr) return ''
      const d = new Date(dateStr)
      if (Number.isNaN(d.getTime())) return ''
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      return `${y}-${m}-${day} ${hh}:${mm}`
    },
    saveDraft() {
      uni.showToast({ title: '暂存草稿（示意）', icon: 'none' })
    },
    submitInventory() {
      uni.showToast({ title: '提交盘点（示意）', icon: 'none' })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  /* 使用与首页/门诊/药材工作台一致的蓝色渐变背景 */
  background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
  padding: 24rpx 24rpx 120rpx;
}

.header-card {
  /* 顶部盘点单信息：象牙白标题卡片，宽度与其它工作台 header-card 对齐 */
  max-width: 702rpx;
  margin: 10rpx auto 8rpx;
  padding: 22rpx 22rpx 18rpx;
  background: #FFFFF0;
  border-radius: 22rpx;
  box-shadow:
    0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
    0 -1rpx 0 rgba(15, 23, 42, 0.06) inset,
    0 18rpx 40rpx rgba(15, 23, 42, 0.14);
}

.row-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.record-no {
  font-size: 30rpx;
  font-weight: 650;
  color: #111827;
}

.status-tag {
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  color: #ffffff;

  &.status-draft {
    background: #9ca3af;
  }
  &.status-in_progress {
    background: #f59e0b;
  }
  &.status-completed {
    background: #22c55e;
  }
}

.row-sub {
  font-size: 26rpx;
  color: #4b5563;
  margin-top: 4rpx;
}

.label {
  color: #9ca3af;
}

.value {
  color: #111827;
}

.summary-card {
  max-width: 702rpx;
  margin: 0 auto 8rpx;
  padding: 20rpx 18rpx;
  background: #FFFFF0;
  border-radius: 20rpx;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.summary-item {
  flex: 1;
  text-align: center;
}

.summary-label {
  font-size: 24rpx;
  color: #9ca3af;
}

.summary-value {
  font-size: 30rpx;
  font-weight: 600;
  margin-top: 6rpx;
  color: #1d4ed8;

  &.positive {
    color: #16a34a;
  }

  &.negative {
    color: #f97316;
  }
}

.detail-list {
  max-width: 702rpx;
  margin: 0 auto 8rpx;
}

.detail-card {
  background: #FFFFF0;
  border-radius: 18rpx;
  padding: 18rpx 18rpx 14rpx;
  margin-bottom: 8rpx;
  box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.drug-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #111827;
}

.batch-no {
  font-size: 24rpx;
  color: #9ca3af;
}

.detail-body {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.line {
  font-size: 26rpx;
  color: #4b5563;
  display: flex;
  align-items: center;
}

.input-line .input {
  flex: 1;
  height: 52rpx;
  background: #f3f4f6;
  border-radius: 26rpx;
  padding: 0 18rpx;
  margin-left: 4rpx;
  margin-right: 4rpx;
  font-size: 24rpx;
}

.unit {
  font-size: 24rpx;
  color: #9ca3af;
}

.diff {
  font-weight: 600;

  &.positive {
    color: #16a34a;
  }

  &.negative {
    color: #f97316;
  }

  &.neutral {
    color: #6b7280;
  }
}

.remark-line {
  margin-top: 4rpx;
}

.remark-input {
  flex: 1;
  margin-left: 4rpx;
  height: 52rpx;
  border-radius: 26rpx;
  background: #f9fafb;
  padding: 0 18rpx;
  font-size: 24rpx;
}

.empty-state {
  padding: 140rpx 0 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #9ca3af;
}

.empty-icon {
  font-size: 90rpx;
  margin-bottom: 16rpx;
}

.empty-text {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

.empty-hint {
  font-size: 26rpx;
  color: #cbd5e1;
}

.footer-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10rpx 24rpx 28rpx;
  background: rgba(248, 250, 252, 0.96);
  display: flex;
  gap: 12rpx;
}

.footer-btn {
  flex: 1;
  height: 72rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;

  &.ghost {
    background: #ffffff;
    color: #4b5563;
    border: 1rpx solid #e5e7eb;
  }

  &.primary {
    background: linear-gradient(135deg, #00c9ff 0%, #00a0ff 100%);
    color: #ffffff;
    box-shadow: 0 8rpx 20rpx rgba(0, 160, 255, 0.3);
  }
}
</style>
