<template>
  <view class="test-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <view class="title">📦 入库模块测试</view>
      <view class="subtitle">Inbound Module Test</view>
    </view>

    <!-- 测试进度 -->
    <view class="progress-section">
      <view class="progress-title">测试进度</view>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
      </view>
      <view class="progress-text">{{ completedTests }}/{{ totalTestItems }} 已完成</view>
    </view>

    <!-- 测试项目列表 -->
    <view class="test-list">
      <view 
        v-for="(test, index) in testItems" 
        :key="index"
        class="test-item"
        :class="{ 
          completed: test.status === 'completed',
          testing: test.status === 'testing',
          failed: test.status === 'failed'
        }"
      >
        <view class="test-header" @click="toggleTest(index)">
          <view class="test-info">
            <text class="test-icon">{{ getTestIcon(test.status) }}</text>
            <view class="test-content">
              <text class="test-name">{{ test.name }}</text>
              <text class="test-desc">{{ test.desc }}</text>
            </view>
          </view>
          <view class="test-action">
            <button 
              v-if="test.status === 'pending'"
              class="test-btn" 
              @click.stop="runTest(index)"
            >
              开始测试
            </button>
            <button 
              v-else-if="test.status === 'failed'"
              class="test-btn retry" 
              @click.stop="runTest(index)"
            >
              重新测试
            </button>
            <text v-else-if="test.status === 'completed'" class="status-text success">
              ✅ 通过
            </text>
            <text v-else-if="test.status === 'testing'" class="status-text testing">
              ⏳ 测试中
            </text>
          </view>
        </view>
        
        <!-- 测试详情 -->
        <view v-if="test.expanded && test.result" class="test-detail">
          <view class="detail-section">
            <text class="detail-label">测试时间:</text>
            <text class="detail-value">{{ test.result.time }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">请求参数:</text>
            <view class="detail-code">{{ test.result.request }}</view>
          </view>
          <view class="detail-section">
            <text class="detail-label">响应结果:</text>
            <view class="detail-code">{{ test.result.response }}</view>
          </view>
          <view v-if="test.result.error" class="detail-section error">
            <text class="detail-label">错误信息:</text>
            <view class="detail-code">{{ test.result.error }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 批量操作 -->
    <view class="batch-actions">
      <button class="action-btn primary" @click="runAllTests">
        🚀 运行所有测试
      </button>
      <button class="action-btn warning" @click="resetAllTests">
        🔄 重置所有测试
      </button>
    </view>

    <!-- 测试报告 -->
    <view class="report-section">
      <view class="report-title">📊 测试报告</view>
      <view class="report-grid">
        <view class="report-item">
          <text class="report-value">{{ totalTestItems }}</text>
          <text class="report-label">总测试项</text>
        </view>
        <view class="report-item success">
          <text class="report-value">{{ passedTests }}</text>
          <text class="report-label">通过</text>
        </view>
        <view class="report-item error">
          <text class="report-value">{{ failedTests }}</text>
          <text class="report-label">失败</text>
        </view>
        <view class="report-item">
          <text class="report-value">{{ passRate }}%</text>
          <text class="report-label">通过率</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      testItems: [
        {
          name: '1. API命名测试 - action: add',
          desc: '测试新的 add action 是否可用',
          status: 'pending',
          expanded: false,
          result: null,
          test: this.testAddAction
        },
        {
          name: '2. API命名测试 - action: create',
          desc: '测试旧的 create action 向后兼容',
          status: 'pending',
          expanded: false,
          result: null,
          test: this.testCreateAction
        },
        {
          name: '3. 创建入库单',
          desc: '测试创建完整的入库单',
          status: 'pending',
          expanded: false,
          result: null,
          test: this.testCreateInbound
        },
        {
          name: '4. 获取入库单列表',
          desc: '测试获取入库单列表',
          status: 'pending',
          expanded: false,
          result: null,
          test: this.testGetList
        },
        {
          name: '5. 获取入库单详情',
          desc: '测试获取单个入库单详情',
          status: 'pending',
          expanded: false,
          result: null,
          test: this.testGetDetail
        },
        {
          name: '6. 获取统计数据',
          desc: '测试获取入库统计',
          status: 'pending',
          expanded: false,
          result: null,
          test: this.testGetStats
        },
        {
          name: '7. 双签名测试',
          desc: '测试入库人和复核人签名',
          status: 'pending',
          expanded: false,
          result: null,
          test: this.testDoubleSign
        },
        {
          name: '8. 数据验证测试',
          desc: '测试必填字段验证',
          status: 'pending',
          expanded: false,
          result: null,
          test: this.testValidation
        }
      ],
      createdRecordId: null // 保存创建的记录ID
    };
  },
  computed: {
    totalTestItems() {
      return this.testItems.length;
    },
    completedTests() {
      return this.testItems.filter(t => t.status === 'completed' || t.status === 'failed').length;
    },
    passedTests() {
      return this.testItems.filter(t => t.status === 'completed').length;
    },
    failedTests() {
      return this.testItems.filter(t => t.status === 'failed').length;
    },
    progressPercent() {
      return Math.round((this.completedTests / this.totalTestItems) * 100);
    },
    passRate() {
      if (this.completedTests === 0) return 0;
      return Math.round((this.passedTests / this.completedTests) * 100);
    }
  },
  methods: {
    // 获取测试图标
    getTestIcon(status) {
      const icons = {
        pending: '⚪',
        testing: '🔵',
        completed: '✅',
        failed: '❌'
      };
      return icons[status] || '⚪';
    },

    // 切换测试详情
    toggleTest(index) {
      this.testItems[index].expanded = !this.testItems[index].expanded;
    },

    // 运行单个测试
    async runTest(index) {
      const test = this.testItems[index];
      test.status = 'testing';
      test.expanded = true;

      try {
        const result = await test.test.call(this);
        test.result = result;
        test.status = result.success ? 'completed' : 'failed';
      } catch (err) {
        test.result = {
          success: false,
          error: err.message,
          time: this.getCurrentTime()
        };
        test.status = 'failed';
      }
    },

    // 运行所有测试
    async runAllTests() {
      uni.showLoading({ title: '测试中...' });

      for (let i = 0; i < this.testItems.length; i++) {
        await this.runTest(i);
        // 延迟一下,避免请求过快
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      uni.hideLoading();
      uni.showToast({
        title: `✅ 完成 ${this.passedTests}/${this.totalTestItems}`,
        icon: 'none',
        duration: 2000
      });
    },

    // 重置所有测试
    resetAllTests() {
      uni.showModal({
        title: '确认重置',
        content: '确定要重置所有测试结果吗?',
        success: (res) => {
          if (res.confirm) {
            this.testItems.forEach(test => {
              test.status = 'pending';
              test.expanded = false;
              test.result = null;
            });
            this.createdRecordId = null;
            uni.showToast({
              title: '✅ 已重置',
              icon: 'success'
            });
          }
        }
      });
    },

    // 测试1: add action
    async testAddAction() {
      const request = {
        action: 'add',
        data: {
          recordNo: 'TEST_ADD_' + Date.now(),
          supplier: '测试供应商',
          items: [],
          operator: '测试员',
          operatorId: 'test_user',
          operatorSign: 'test_sign.png',
          operatorSignTime: new Date(),
          status: 'draft'
        }
      };

      const res = await wx.cloud.callFunction({
        name: 'inRecords',
        data: request
      });

      return {
        success: res.result && res.result.success,
        request: JSON.stringify(request, null, 2),
        response: JSON.stringify(res.result, null, 2),
        time: this.getCurrentTime()
      };
    },

    // 测试2: create action
    async testCreateAction() {
      const request = {
        action: 'create',
        data: {
          recordNo: 'TEST_CREATE_' + Date.now(),
          supplier: '测试供应商',
          items: [],
          operator: '测试员',
          operatorId: 'test_user',
          operatorSign: 'test_sign.png',
          operatorSignTime: new Date(),
          status: 'draft'
        }
      };

      const res = await wx.cloud.callFunction({
        name: 'inRecords',
        data: request
      });

      return {
        success: res.result && res.result.success,
        request: JSON.stringify(request, null, 2),
        response: JSON.stringify(res.result, null, 2),
        time: this.getCurrentTime()
      };
    },

    // 测试3: 创建完整入库单
    async testCreateInbound() {
      const request = {
        action: 'add',
        data: {
          recordNo: 'RK' + Date.now(),
          supplier: 'XX医药公司',
          items: [
            {
              drugId: 'test_drug_001',
              drugName: '阿莫西林胶囊',
              spec: '0.25g*24粒',
              unit: '盒',
              manufacturer: '华北制药',
              batch: 'TEST001',
              productionDate: '2025-01-01',
              expireDate: '2027-01-01',
              quantity: 100,
              price: 15.5
            },
            {
              drugId: 'test_drug_002',
              drugName: '头孢克肟颗粒',
              spec: '50mg*12袋',
              unit: '盒',
              manufacturer: '扬子江药业',
              batch: 'TEST002',
              productionDate: '2025-01-01',
              expireDate: '2027-01-01',
              quantity: 50,
              price: 28.0
            }
          ],
          operator: '张三',
          operatorId: 'user_001',
          operatorSign: 'cloud://sign_001.png',
          operatorSignTime: new Date(),
          status: 'pending_review'
        }
      };

      const res = await wx.cloud.callFunction({
        name: 'inRecords',
        data: request
      });

      // 保存创建的记录ID,供后续测试使用
      if (res.result && res.result.success && res.result.data) {
        this.createdRecordId = res.result.data._id;
      }

      return {
        success: res.result && res.result.success,
        request: JSON.stringify(request, null, 2),
        response: JSON.stringify(res.result, null, 2),
        time: this.getCurrentTime()
      };
    },

    // 测试4: 获取列表
    async testGetList() {
      const request = {
        action: 'getList',
        data: {
          pageSize: 10,
          pageNum: 1,
          status: ''
        }
      };

      const res = await wx.cloud.callFunction({
        name: 'inRecords',
        data: request
      });

      return {
        success: res.result && res.result.success,
        request: JSON.stringify(request, null, 2),
        response: JSON.stringify(res.result, null, 2),
        time: this.getCurrentTime()
      };
    },

    // 测试5: 获取详情
    async testGetDetail() {
      if (!this.createdRecordId) {
        return {
          success: false,
          error: '请先运行测试3创建入库单',
          time: this.getCurrentTime()
        };
      }

      const request = {
        action: 'getDetail',
        data: {
          _id: this.createdRecordId
        }
      };

      const res = await wx.cloud.callFunction({
        name: 'inRecords',
        data: request
      });

      return {
        success: res.result && res.result.success,
        request: JSON.stringify(request, null, 2),
        response: JSON.stringify(res.result, null, 2),
        time: this.getCurrentTime()
      };
    },

    // 测试6: 获取统计
    async testGetStats() {
      const request = {
        action: 'getStats',
        data: {}
      };

      const res = await wx.cloud.callFunction({
        name: 'inRecords',
        data: request
      });

      return {
        success: res.result && res.result.success,
        request: JSON.stringify(request, null, 2),
        response: JSON.stringify(res.result, null, 2),
        time: this.getCurrentTime()
      };
    },

    // 测试7: 双签名
    async testDoubleSign() {
      const request = {
        action: 'add',
        data: {
          recordNo: 'RK_SIGN_' + Date.now(),
          supplier: 'XX医药公司',
          items: [{
            drugId: 'test_drug',
            drugName: '测试药品',
            spec: '10mg*10片',
            unit: '盒',
            manufacturer: '测试厂家',
            batch: 'TEST001',
            productionDate: '2025-01-01',
            expireDate: '2027-01-01',
            quantity: 10,
            price: 15.5
          }],
          operator: '李医生',
          operatorId: 'user_001',
          operatorSign: 'cloud://sign_inbound.png',
          operatorSignTime: new Date(),
          reviewer: '王医生',
          reviewerId: 'user_002',
          reviewerSign: 'cloud://sign_review.png',
          reviewerSignTime: new Date(),
          status: 'completed'
        }
      };

      const res = await wx.cloud.callFunction({
        name: 'inRecords',
        data: request
      });

      return {
        success: res.result && res.result.success,
        request: JSON.stringify(request, null, 2),
        response: JSON.stringify(res.result, null, 2),
        time: this.getCurrentTime()
      };
    },

    // 测试8: 数据验证
    async testValidation() {
      const request = {
        action: 'add',
        data: {
          // 故意缺少必填字段
          recordNo: '',
          items: []
        }
      };

      const res = await wx.cloud.callFunction({
        name: 'inRecords',
        data: request
      });

      // 这个测试预期会失败(验证生效)
      const validationWorked = res.result && !res.result.success;

      return {
        success: validationWorked,
        request: JSON.stringify(request, null, 2),
        response: JSON.stringify(res.result, null, 2),
        time: this.getCurrentTime()
      };
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

.progress-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.progress-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
}

.progress-bar {
  height: 16rpx;
  background: #f0f0f0;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #52c41a 0%, #73d13d 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 24rpx;
  color: #999;
  text-align: right;
}

.test-list {
  margin-bottom: 20rpx;
}

.test-item {
  background: white;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  
  &.completed {
    border-left: 6rpx solid #52c41a;
  }
  
  &.testing {
    border-left: 6rpx solid #1890ff;
  }
  
  &.failed {
    border-left: 6rpx solid #ff4d4f;
  }
}

.test-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
}

.test-info {
  display: flex;
  align-items: flex-start;
  flex: 1;
  margin-right: 20rpx;
}

.test-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
  margin-top: 4rpx;
}

.test-content {
  flex: 1;
}

.test-name {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.test-desc {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.test-action {
  display: flex;
  align-items: center;
}

.test-btn {
  padding: 16rpx 28rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8rpx;
  font-size: 24rpx;
  border: none;
  
  &.retry {
    background: linear-gradient(135deg, #faad14 0%, #d46b08 100%);
  }
}

.status-text {
  font-size: 24rpx;
  font-weight: bold;
  
  &.success {
    color: #52c41a;
  }
  
  &.testing {
    color: #1890ff;
  }
}

.test-detail {
  padding: 24rpx 30rpx;
  background: #f8f9fa;
  border-top: 2rpx solid #e0e0e0;
}

.detail-section {
  margin-bottom: 20rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &.error {
    .detail-code {
      background: #fff2f0;
      border-color: #ffccc7;
      color: #ff4d4f;
    }
  }
}

.detail-label {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
  font-weight: 500;
}

.detail-value {
  display: block;
  font-size: 24rpx;
  color: #333;
}

.detail-code {
  padding: 16rpx;
  background: white;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-family: 'Courier New', monospace;
  color: #333;
  word-break: break-all;
  white-space: pre-wrap;
  max-height: 400rpx;
  overflow-y: auto;
}

.batch-actions {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 28rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  &.warning {
    background: linear-gradient(135deg, #faad14 0%, #d46b08 100%);
    color: white;
  }
}

.report-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.report-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.report-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border: 2rpx solid #e0e0e0;
  
  &.success {
    background: #f6ffed;
    border-color: #b7eb8f;
    
    .report-value {
      color: #52c41a;
    }
  }
  
  &.error {
    background: #fff2f0;
    border-color: #ffccc7;
    
    .report-value {
      color: #ff4d4f;
    }
  }
}

.report-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8rpx;
}

.report-label {
  font-size: 24rpx;
  color: #666;
}
</style>


