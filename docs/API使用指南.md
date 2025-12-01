# 📚 AK-PMS API 使用指南

**最后更新**：2025-10-28

---

## 📖 目录

1. [快速开始](#快速开始)
2. [API列表](#api列表)
3. [使用示例](#使用示例)
4. [错误处理](#错误处理)
5. [最佳实践](#最佳实践)

---

## 🚀 快速开始

### 1. 导入API
```javascript
// 导入单个API
import { getInRecordList } from '@/utils/api.js'

// 导入多个API
import { 
  getInRecordList,
  createInRecord,
  approveInRecord 
} from '@/utils/api.js'
```

### 2. 调用API
```javascript
export default {
  methods: {
    async loadData() {
      try {
        const list = await getInRecordList({ page: 1 })
        this.dataList = list
      } catch (err) {
        console.error('加载失败:', err)
      }
    }
  }
}
```

---

## 📋 API列表

### 入库单相关（inRecords）

| API | 说明 | 参数 | 返回值 |
|-----|------|------|--------|
| `createInRecord(data)` | 创建入库单 | 入库单数据对象 | { _id, ...record } |
| `getInRecordList(params)` | 获取列表 | { status, page, pageSize } | [ {...}, {...} ] |
| `getInRecordDetail(id)` | 获取详情 | 记录ID | { _id, ...record } |
| `updateInRecord(data)` | 更新记录 | { _id, ...updates } | 更新结果 |
| `deleteInRecord(id)` | 删除记录 | 记录ID | 删除结果 |
| `approveInRecord(data)` | 复核通过 | 复核数据 | 成功消息 |
| `rejectInRecord(data)` | 复核驳回 | 驳回数据 | 成功消息 |
| `getInRecordCounts()` | 获取数量统计 | 无 | { draft, pending_review, ... } |

### 出库单相关（outRecords）

| API | 说明 | 参数 | 返回值 |
|-----|------|------|--------|
| `createOutRecord(data)` | 创建出库单 | 出库单数据对象 | { _id, ...record } |
| `getOutRecordList(params)` | 获取列表 | { status, location, page } | [ {...}, {...} ] |
| `getOutRecordDetail(id)` | 获取详情 | 记录ID | { _id, ...record } |
| `updateOutRecord(data)` | 更新记录 | { _id, ...updates } | 更新结果 |
| `deleteOutRecord(id)` | 删除记录 | 记录ID | 删除结果 |
| `approveOutRecord(data)` | 接收确认 | 接收数据 | 成功消息 |
| `rejectOutRecord(data)` | 驳回 | 驳回数据 | 成功消息 |
| `getOutRecordCounts()` | 获取数量统计 | 无 | { draft, pending_review, ... } |

### 药材相关（drugs）

| API | 说明 | 参数 | 返回值 |
|-----|------|------|--------|
| `getDrugList(params)` | 获取药材列表 | { keyword, category, page } | [ {...}, {...} ] |
| `getDrugByBarcode(barcode)` | 条形码查询 | 条形码字符串 | [ {...} ] |

### 库存相关（stock）

| API | 说明 | 参数 | 返回值 |
|-----|------|------|--------|
| `getStockList(params)` | 获取库存列表 | { keyword, location, page } | [ {...}, {...} ] |
| `getBatchList(params)` | 获取批次列表 | { drugId, location, hideExpired } | [ {...}, {...} ] |
| `getStockDetail(id)` | 获取库存详情 | 库存ID | { _id, ...stock } |
| `checkExpiry(days)` | 检查效期预警 | 预警天数（默认90） | { nearExpiry: [], expired: [] } |

### 用户相关（users）

| API | 说明 | 参数 | 返回值 |
|-----|------|------|--------|
| `login()` | 用户登录 | 无 | { openid, userInfo } |
| `getUserList()` | 获取用户列表 | 无 | [ {...}, {...} ] |
| `getMyOpenId()` | 获取OpenID | 无 | { openid } |

### 统计相关

| API | 说明 | 参数 | 返回值 |
|-----|------|------|--------|
| `getTodayStats()` | 今日统计 | 无 | { in, out, consume, requisition } |
| `getAlertStats()` | 预警统计 | 无 | { nearExpire, lowStock, pendingReview } |

---

## 💡 使用示例

### 示例1：创建入库单

```javascript
import { createInRecord } from '@/utils/api.js'
import Common from '@/utils/common.js'

export default {
  data() {
    return {
      recordNo: '',
      supplier: '',
      drugList: [],
      operatorSign: ''
    }
  },
  
  methods: {
    async submitForm() {
      // 验证表单
      if (!this.validateForm()) {
        return
      }
      
      try {
        // 构建提交数据
        const userInfo = uni.getStorageSync('userInfo')
        const data = {
          recordNo: this.recordNo,
          supplier: this.supplier,
          items: this.drugList.map(item => ({
            drugId: item.drugId,
            drugName: item.drugName,
            spec: item.spec,
            unit: item.unit,
            manufacturer: item.manufacturer,
            batch: item.batch,
            productionDate: item.productionDate,
            expireDate: item.expireDate,
            quantity: item.quantity,
            price: item.price || 0
          })),
          operator: userInfo.name,
          operatorId: userInfo._id,
          operatorSign: this.operatorSign,
          operatorSignTime: Common.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          status: 'pending_review'
        }
        
        // 调用API创建
        const result = await createInRecord(data)
        
        uni.showToast({
          title: '提交成功',
          icon: 'success'
        })
        
        // 返回列表页
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        
      } catch (err) {
        console.error('提交失败:', err)
      }
    }
  }
}
```

### 示例2：获取入库单列表

```javascript
import { getInRecordList, getInRecordCounts } from '@/utils/api.js'

export default {
  data() {
    return {
      currentTab: 'all',
      recordList: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      counts: {}
    }
  },
  
  onLoad() {
    this.loadRecords()
    this.loadCounts()
  },
  
  methods: {
    async loadRecords() {
      try {
        const params = {
          status: this.currentTab === 'all' ? undefined : this.currentTab,
          page: this.page,
          pageSize: this.pageSize
        }
        
        const list = await getInRecordList(params)
        
        if (this.page === 1) {
          this.recordList = list
        } else {
          this.recordList = [...this.recordList, ...list]
        }
        
        this.hasMore = list.length >= this.pageSize
        
      } catch (err) {
        console.error('加载失败:', err)
      }
    },
    
    async loadCounts() {
      try {
        const counts = await getInRecordCounts()
        this.counts = counts
      } catch (err) {
        console.error('加载数量失败:', err)
      }
    },
    
    switchTab(tab) {
      this.currentTab = tab
      this.page = 1
      this.recordList = []
      this.loadRecords()
    },
    
    loadMore() {
      if (!this.hasMore) return
      this.page++
      this.loadRecords()
    }
  }
}
```

### 示例3：复核入库单

```javascript
import { getInRecordDetail, approveInRecord, rejectInRecord } from '@/utils/api.js'
import Common from '@/utils/common.js'

export default {
  data() {
    return {
      recordId: '',
      record: {},
      reviewerSign: '',
      rejectReason: ''
    }
  },
  
  onLoad(options) {
    this.recordId = options.id
    this.loadDetail()
  },
  
  methods: {
    async loadDetail() {
      try {
        const record = await getInRecordDetail(this.recordId)
        this.record = record
      } catch (err) {
        console.error('加载详情失败:', err)
      }
    },
    
    async handleApprove() {
      if (!this.reviewerSign) {
        uni.showToast({
          title: '请先签名',
          icon: 'none'
        })
        return
      }
      
      try {
        const userInfo = uni.getStorageSync('userInfo')
        const data = {
          _id: this.recordId,
          reviewer: userInfo.name,
          reviewerId: userInfo._id,
          reviewerSign: this.reviewerSign,
          reviewerSignTime: Common.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
        }
        
        await approveInRecord(data)
        
        uni.showToast({
          title: '复核通过，库存已更新',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        
      } catch (err) {
        console.error('复核失败:', err)
      }
    },
    
    async handleReject() {
      if (!this.rejectReason.trim()) {
        uni.showToast({
          title: '请填写驳回原因',
          icon: 'none'
        })
        return
      }
      
      try {
        const userInfo = uni.getStorageSync('userInfo')
        const data = {
          _id: this.recordId,
          reviewer: userInfo.name,
          reviewerId: userInfo._id,
          rejectReason: this.rejectReason
        }
        
        await rejectInRecord(data)
        
        uni.showToast({
          title: '已驳回',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        
      } catch (err) {
        console.error('驳回失败:', err)
      }
    }
  }
}
```

### 示例4：获取批次列表（FIFO）

```javascript
import { getBatchList } from '@/utils/api.js'

export default {
  data() {
    return {
      drugId: '',
      location: 'land_park',
      batchList: []
    }
  },
  
  methods: {
    async loadBatchList() {
      try {
        const params = {
          drugId: this.drugId,
          location: this.location,
          hideExpired: true  // 隐藏过期批次
        }
        
        const batches = await getBatchList(params)
        
        // 数据已按有效期升序排列（FIFO）
        // 第一个批次为推荐批次
        if (batches.length > 0) {
          batches[0].isRecommended = true
        }
        
        this.batchList = batches
        
      } catch (err) {
        console.error('加载批次失败:', err)
      }
    }
  }
}
```

### 示例5：并行请求多个API

```javascript
import { getInRecordCounts, getOutRecordCounts, checkExpiry } from '@/utils/api.js'

export default {
  data() {
    return {
      inCounts: {},
      outCounts: {},
      expiryData: {}
    }
  },
  
  methods: {
    async loadAllStats() {
      try {
        // 并行请求，提升速度
        const [inCounts, outCounts, expiryData] = await Promise.all([
          getInRecordCounts(),
          getOutRecordCounts(),
          checkExpiry(90)
        ])
        
        this.inCounts = inCounts
        this.outCounts = outCounts
        this.expiryData = expiryData
        
      } catch (err) {
        console.error('加载统计失败:', err)
      }
    }
  }
}
```

---

## ⚠️ 错误处理

### 1. 基本错误处理
```javascript
async loadData() {
  try {
    const data = await getInRecordList({ page: 1 })
    this.dataList = data
  } catch (err) {
    console.error('加载失败:', err)
    // 用户已经看到Toast提示
  }
}
```

### 2. 带降级的错误处理
```javascript
async loadData() {
  try {
    const data = await getInRecordList({ page: 1 })
    this.dataList = data
  } catch (err) {
    console.error('加载失败:', err)
    // 使用空数组作为降级方案
    this.dataList = []
  }
}
```

### 3. Promise.catch降级
```javascript
// 单个请求降级
const data = await getInRecordList({ page: 1 }).catch(() => [])

// 多个请求降级
const [list1, list2] = await Promise.all([
  getInRecordList({ page: 1 }).catch(() => []),
  getOutRecordList({ page: 1 }).catch(() => [])
])
```

### 4. 自定义错误处理
```javascript
async submitForm() {
  try {
    await createInRecord(data)
    // 成功处理
    uni.navigateBack()
  } catch (err) {
    // 特定错误处理
    if (err.message.includes('库存不足')) {
      uni.showModal({
        title: '库存不足',
        content: '请检查库存后重试',
        showCancel: false
      })
    } else {
      uni.showToast({
        title: err.message || '操作失败',
        icon: 'none'
      })
    }
  }
}
```

---

## ✨ 最佳实践

### 1. 统一导入
```javascript
// ✅ 推荐：在文件顶部统一导入
import { 
  getInRecordList,
  createInRecord,
  approveInRecord 
} from '@/utils/api.js'

// ❌ 不推荐：分散导入
methods: {
  async method1() {
    const { getInRecordList } = await import('@/utils/api.js')
  }
}
```

### 2. 参数校验
```javascript
// ✅ 推荐：先校验参数
async createRecord() {
  if (!this.validateForm()) {
    return
  }
  const result = await createInRecord(data)
}

// ❌ 不推荐：直接调用
async createRecord() {
  const result = await createInRecord(data)  // 可能参数不完整
}
```

### 3. Loading管理
```javascript
// ✅ 推荐：后台查询关闭Loading
const counts = await getInRecordCounts()  // 不显示Loading

// ✅ 推荐：用户操作显示Loading
const result = await createInRecord(data)  // 显示Loading

// 自定义Loading
uni.showLoading({ title: '处理中...' })
const result = await api()
uni.hideLoading()
```

### 4. 数据缓存
```javascript
data() {
  return {
    cacheData: null,
    cacheTime: 0,
    cacheExpire: 5 * 60 * 1000  // 5分钟
  }
},

methods: {
  async loadData() {
    const now = Date.now()
    
    // 如果缓存未过期，使用缓存
    if (this.cacheData && (now - this.cacheTime) < this.cacheExpire) {
      return this.cacheData
    }
    
    // 否则重新请求
    const data = await getInRecordList({ page: 1 })
    this.cacheData = data
    this.cacheTime = now
    
    return data
  }
}
```

### 5. 列表分页
```javascript
data() {
  return {
    list: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false
  }
},

methods: {
  async loadList(refresh = false) {
    if (this.loading) return
    this.loading = true
    
    if (refresh) {
      this.page = 1
      this.list = []
    }
    
    try {
      const newList = await getInRecordList({
        page: this.page,
        pageSize: this.pageSize
      })
      
      this.list = [...this.list, ...newList]
      this.hasMore = newList.length >= this.pageSize
      
    } finally {
      this.loading = false
    }
  },
  
  loadMore() {
    if (!this.hasMore || this.loading) return
    this.page++
    this.loadList()
  },
  
  refresh() {
    this.loadList(true)
  }
}
```

---

## 📖 常见问题

### Q1：API调用返回undefined？
**原因**：云函数可能未部署或返回格式错误

**解决**：
1. 检查云函数是否已上传
2. 查看云函数日志
3. 检查返回格式是否包含 `success` 和 `data`

### Q2：提示"网络请求失败"？
**原因**：网络问题或云函数执行失败

**解决**：
1. 检查网络连接
2. 查看云函数日志
3. 检查数据库权限

### Q3：数据不刷新？
**原因**：可能使用了缓存

**解决**：
1. 在 `onShow` 中重新加载数据
2. 清除缓存后重新请求

### Q4：Loading一直显示？
**原因**：请求出错但未隐藏Loading

**解决**：
```javascript
try {
  uni.showLoading({ title: '加载中...' })
  const data = await api()
} finally {
  uni.hideLoading()  // 确保一定会执行
}
```

---

## 📚 参考链接

- [云函数开发文档](./云函数开发指南.md)
- [数据库设计](./数据库设计.md)
- [需求文档](./需求文档_最终版.md)

---

**最后更新**：2025-10-28  
**维护者**：开发团队

