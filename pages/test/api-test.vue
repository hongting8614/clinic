<template>
  <view class="test-page">
    <view class="page-header">
      <view class="title">🧪 API接口测试</view>
      <view class="subtitle">API Test Center</view>
    </view>

    <!-- 测试选项卡 -->
    <view class="test-tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.key"
        class="tab-item"
        :class="{ active: currentTab === tab.key }"
        @click="currentTab = tab.key"
      >
        <text class="tab-icon">{{ tab.icon }}</text>
        <text class="tab-text">{{ tab.label }}</text>
      </view>
    </view>

    <!-- 入库API测试 -->
    <view v-if="currentTab === 'inbound'" class="test-content">
      <view class="test-section">
        <view class="section-title">📦 入库记录 API</view>
        
        <button class="test-btn primary" @click="testInboundAdd">
          测试 action: 'add'
        </button>
        
        <button class="test-btn info" @click="testInboundCreate">
          测试 action: 'create'
        </button>
        
        <button class="test-btn success" @click="testInboundGetList">
          测试获取列表
        </button>
      </view>
    </view>

    <!-- 出库API测试 -->
    <view v-if="currentTab === 'outbound'" class="test-content">
      <view class="test-section">
        <view class="section-title">📤 出库记录 API</view>
        
        <button class="test-btn primary" @click="testOutboundAdd">
          测试 action: 'add'
        </button>
        
        <button class="test-btn info" @click="testOutboundCreate">
          测试 action: 'create'
        </button>
        
        <button class="test-btn success" @click="testOutboundGetList">
          测试获取列表
        </button>
      </view>
    </view>

    <!-- 药品API测试 -->
    <view v-if="currentTab === 'drug'" class="test-content">
      <view class="test-section">
        <view class="section-title">💊 药品管理 API</view>
        
        <button class="test-btn primary" @click="testDrugAdd">
          测试添加药品
        </button>
        
        <button class="test-btn success" @click="testDrugSearch">
          测试搜索药品
        </button>
        
        <button class="test-btn info" @click="testDrugGetList">
          测试获取列表
        </button>
      </view>
    </view>

    <!-- 测试结果 -->
    <view class="result-section">
      <view class="section-title">📊 测试结果</view>
      
      <scroll-view scroll-y class="result-scroll">
        <view 
          v-for="(result, index) in testResults" 
          :key="index"
          class="result-item"
          :class="{ success: result.success, error: !result.success }"
        >
          <view class="result-header">
            <text class="result-status">{{ result.success ? '✅' : '❌' }}</text>
            <text class="result-title">{{ result.title }}</text>
            <text class="result-time">{{ result.time }}</text>
          </view>
          <view class="result-body">
            <view class="result-label">请求:</view>
            <view class="result-code">{{ result.request }}</view>
            <view class="result-label">响应:</view>
            <view class="result-code">{{ result.response }}</view>
          </view>
        </view>
        
        <view v-if="testResults.length === 0" class="empty-result">
          <text class="empty-icon">📝</text>
          <text class="empty-text">暂无测试结果</text>
        </view>
      </scroll-view>
    </view>

    <!-- 测试统计 -->
    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-value">{{ totalTests }}</text>
        <text class="stat-label">总测试</text>
      </view>
      <view class="stat-item success">
        <text class="stat-value">{{ successTests }}</text>
        <text class="stat-label">成功</text>
      </view>
      <view class="stat-item error">
        <text class="stat-value">{{ failedTests }}</text>
        <text class="stat-label">失败</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'inbound',
      tabs: [
        { key: 'inbound', label: '入库', icon: '📦' },
        { key: 'outbound', label: '出库', icon: '📤' },
        { key: 'drug', label: '药品', icon: '💊' }
      ],
      testResults: []
    };
  },
  computed: {
    totalTests() {
      return this.testResults.length;
    },
    successTests() {
      return this.testResults.filter(r => r.success).length;
    },
    failedTests() {
      return this.testResults.filter(r => !r.success).length;
    }
  },
  methods: {
    // 测试入库 add
    async testInboundAdd() {
      const request = {
        action: 'add',
        data: {
          recordNo: 'TEST_ADD_' + Date.now(),
          supplier: '测试供应商',
          items: [{
            drugId: 'test_001',
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
          operator: '测试员',
          operatorId: 'test_user',
          operatorSign: 'test_sign.png',
          operatorSignTime: new Date(),
          status: 'draft'
        }
      };

      await this.callAPI('inRecords', request, '入库 API - action: add');
    },

    // 测试入库 create
    async testInboundCreate() {
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

      await this.callAPI('inRecords', request, '入库 API - action: create');
    },

    // 测试入库列表
    async testInboundGetList() {
      const request = {
        action: 'getList',
        data: {
          pageSize: 10,
          pageNum: 1
        }
      };

      await this.callAPI('inRecords', request, '入库 API - 获取列表');
    },

    // 测试出库 add
    async testOutboundAdd() {
      const request = {
        action: 'add',
        data: {
          recordNo: 'CK_ADD_' + Date.now(),
          fromLocation: 'drug_storage',
          toLocation: 'land_park',
          items: [],
          dispenser: '测试发放人',
          dispenserId: 'test_user',
          dispenserSign: 'test_sign.png',
          dispenserSignTime: new Date(),
          status: 'draft'
        }
      };

      await this.callAPI('outRecords', request, '出库 API - action: add');
    },

    // 测试出库 create
    async testOutboundCreate() {
      const request = {
        action: 'create',
        data: {
          recordNo: 'CK_CREATE_' + Date.now(),
          fromLocation: 'drug_storage',
          toLocation: 'water_park',
          items: [],
          dispenser: '测试发放人',
          dispenserId: 'test_user',
          dispenserSign: 'test_sign.png',
          dispenserSignTime: new Date(),
          status: 'draft'
        }
      };

      await this.callAPI('outRecords', request, '出库 API - action: create');
    },

    // 测试出库列表
    async testOutboundGetList() {
      const request = {
        action: 'getList',
        data: {
          pageSize: 10,
          pageNum: 1
        }
      };

      await this.callAPI('outRecords', request, '出库 API - 获取列表');
    },

    // 测试药品添加
    async testDrugAdd() {
      const request = {
        action: 'add',
        data: {
          barcode: 'TEST' + Date.now(),
          name: '测试药品_' + Date.now(),
          spec: '10mg*10片',
          unit: '盒',
          manufacturer: '测试厂家'
        }
      };

      await this.callAPI('drugManage', request, '药品 API - 添加药品');
    },

    // 测试药品搜索
    async testDrugSearch() {
      const request = {
        action: 'search',
        data: {
          keyword: '测试',
          limit: 10
        }
      };

      await this.callAPI('drugManage', request, '药品 API - 搜索药品');
    },

    // 测试药品列表
    async testDrugGetList() {
      const request = {
        action: 'getList',
        data: {
          pageSize: 10,
          pageNum: 1
        }
      };

      await this.callAPI('drugManage', request, '药品 API - 获取列表');
    },

    // 调用API
    async callAPI(name, request, title) {
      uni.showLoading({ title: '测试中...' });

      try {
        const res = await wx.cloud.callFunction({
          name: name,
          data: request
        });

        uni.hideLoading();

        const result = {
          title: title,
          success: res.result && res.result.success,
          request: JSON.stringify(request, null, 2),
          response: JSON.stringify(res.result, null, 2),
          time: this.getCurrentTime()
        };

        this.testResults.unshift(result);

        if (result.success) {
          uni.showToast({
            title: '✅ 测试成功',
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: '❌ 测试失败',
            icon: 'none'
          });
        }
      } catch (err) {
        uni.hideLoading();
        console.error('API调用失败:', err);

        const result = {
          title: title,
          success: false,
          request: JSON.stringify(request, null, 2),
          response: JSON.stringify({ error: err.message }, null, 2),
          time: this.getCurrentTime()
        };

        this.testResults.unshift(result);

        uni.showToast({
          title: '❌ 调用失败',
          icon: 'none'
        });
      }
    },

    // 获取当前时间
    getCurrentTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20rpx;
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

.test-tabs {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 16rpx;
  background: white;
  border-radius: 16rpx;
  transition: all 0.3s;
  
  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transform: translateY(-4rpx);
    box-shadow: 0 8rpx 16rpx rgba(102, 126, 234, 0.4);
    
    .tab-icon,
    .tab-text {
      color: white;
    }
  }
}

.tab-icon {
  font-size: 36rpx;
  margin-bottom: 8rpx;
}

.tab-text {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
}

.test-content,
.result-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
}

.test-btn {
  width: 100%;
  padding: 28rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
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
  
  &.info {
    background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
    color: white;
  }
  
  &.success {
    background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
    color: white;
  }
}

.result-scroll {
  max-height: 800rpx;
}

.result-item {
  padding: 24rpx;
  margin-bottom: 16rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e0e0e0;
  
  &.success {
    background: #f6ffed;
    border-color: #b7eb8f;
  }
  
  &.error {
    background: #fff2f0;
    border-color: #ffccc7;
  }
}

.result-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 2rpx solid #e0e0e0;
}

.result-status {
  font-size: 28rpx;
  margin-right: 12rpx;
}

.result-title {
  flex: 1;
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
}

.result-time {
  font-size: 22rpx;
  color: #999;
}

.result-body {
  font-size: 22rpx;
}

.result-label {
  color: #666;
  margin-bottom: 8rpx;
  font-weight: 500;
}

.result-code {
  background: #f5f5f5;
  padding: 12rpx;
  border-radius: 8rpx;
  font-family: 'Courier New', monospace;
  color: #333;
  margin-bottom: 12rpx;
  word-break: break-all;
  white-space: pre-wrap;
}

.empty-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 40rpx;
}

.empty-icon {
  font-size: 80rpx;
  opacity: 0.5;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.stats-section {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx;
  background: white;
  border-radius: 12rpx;
  border: 2rpx solid #e0e0e0;
  
  &.success {
    background: #f6ffed;
    border-color: #b7eb8f;
    
    .stat-value {
      color: #52c41a;
    }
  }
  
  &.error {
    background: #fff2f0;
    border-color: #ffccc7;
    
    .stat-value {
      color: #ff4d4f;
    }
  }
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}
</style>


