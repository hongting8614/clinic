# 🧪 入库模块API测试代码

## ⚠️ 注意
以下是**可以直接运行**的完整测试代码,不包含 `...` 占位符。

---

## 测试1: 测试 inRecords 的 'add' action

### 在小程序页面中测试

```javascript
// 在页面的 methods 中添加此方法
async testInRecordsAdd() {
  try {
    console.log('开始测试 inRecords add action...')
    
    const result = await this.$api.callFunction('inRecords', {
      action: 'add',
      data: {
        recordNo: 'TEST' + Date.now(),  // 生成唯一单号
        supplier: '测试供应商',
        items: [
          {
            drugId: 'test_drug_001',
            drugName: '测试药材',
            spec: '10mg*10片',
            unit: '盒',
            manufacturer: '测试厂家',
            batch: 'TEST001',
            productionDate: '2025-01-01',
            expireDate: '2027-01-01',
            quantity: 10,
            price: 15.5
          }
        ],
        operator: '测试员',
        operatorId: 'test_user_001',
        operatorSign: 'cloud://test_sign.png',
        operatorSignTime: new Date(),
        status: 'pending_review'
      }
    })
    
    console.log('测试结果:', result)
    
    if (result.success) {
      console.log('✅ 测试成功! action: add 可以正常使用')
      uni.showToast({
        title: '✅ 测试成功',
        icon: 'success'
      })
    } else {
      console.log('❌ 测试失败:', result.message)
      uni.showToast({
        title: '❌ ' + result.message,
        icon: 'none'
      })
    }
    
  } catch (err) {
    console.error('测试出错:', err)
    uni.showToast({
      title: '❌ 测试出错',
      icon: 'none'
    })
  }
}
```

### 调用方法
```vue
<template>
  <view>
    <button @click="testInRecordsAdd">测试入库API</button>
  </view>
</template>
```

---

## 测试2: 测试 outRecords 的 'add' action

```javascript
async testOutRecordsAdd() {
  try {
    console.log('开始测试 outRecords add action...')
    
    const result = await this.$api.callFunction('outRecords', {
      action: 'add',
      data: {
        recordNo: 'CK' + Date.now(),
        fromLocation: 'drug_storage',
        toLocation: 'land_park',
        items: [
          {
            drugId: 'test_drug_001',
            drugName: '测试药材',
            specification: '10mg*10片',
            batch: 'TEST001',
            productionDate: '2025-01-01',
            expireDate: '2027-01-01',
            packQuantity: 2,
            packUnit: '盒',
            minQuantity: 20,
            minUnit: '片',
            specInfo: {
              conversionRate: 10,
              minUnit: '片',
              packUnit: '盒'
            }
          }
        ],
        dispenser: '测试发放人',
        dispenserId: 'test_user_001',
        dispenserSign: 'cloud://test_sign.png',
        dispenserSignTime: new Date(),
        status: 'pending_review'
      }
    })
    
    console.log('测试结果:', result)
    
    if (result.success) {
      console.log('✅ 测试成功! action: add 可以正常使用')
      uni.showToast({
        title: '✅ 测试成功',
        icon: 'success'
      })
    } else {
      console.log('❌ 测试失败:', result.message)
      uni.showToast({
        title: '❌ ' + result.message,
        icon: 'none'
      })
    }
    
  } catch (err) {
    console.error('测试出错:', err)
    uni.showToast({
      title: '❌ 测试出错',
      icon: 'none'
    })
  }
}
```

---

## 测试3: 在浏览器控制台直接测试(简化版)

### 前提条件
- 已经登录小程序
- 在任意页面打开控制台

### 测试代码
```javascript
// 复制以下代码到控制台执行

// 测试入库 add action
wx.cloud.callFunction({
  name: 'inRecords',
  data: {
    action: 'add',
    data: {
      recordNo: 'TEST' + Date.now(),
      supplier: '测试',
      items: [{
        drugId: 'test',
        drugName: '测试药',
        spec: '10mg',
        unit: '盒',
        manufacturer: '测试厂',
        batch: 'T001',
        productionDate: '2025-01-01',
        expireDate: '2027-01-01',
        quantity: 10,
        price: 15
      }],
      operator: '测试员',
      operatorId: 'test001',
      operatorSign: 'test.png',
      operatorSignTime: new Date(),
      status: 'pending_review'
    }
  },
  success: res => {
    console.log('✅ 入库测试成功:', res)
  },
  fail: err => {
    console.log('❌ 入库测试失败:', err)
  }
})
```

---

## 测试4: 对比测试 'add' vs 'create'

```javascript
async compareAddVsCreate() {
  console.log('=== 开始对比测试 ===')
  
  // 测试1: 使用 'add'
  const result1 = await this.$api.callFunction('inRecords', {
    action: 'add',
    data: {
      recordNo: 'ADD' + Date.now(),
      supplier: '测试add',
      items: [],
      operator: '测试',
      operatorId: 'test',
      operatorSign: 'test.png',
      operatorSignTime: new Date(),
      status: 'draft'
    }
  })
  console.log('使用 add:', result1.success ? '✅ 成功' : '❌ 失败')
  
  // 等待1秒
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 测试2: 使用 'create'
  const result2 = await this.$api.callFunction('inRecords', {
    action: 'create',
    data: {
      recordNo: 'CREATE' + Date.now(),
      supplier: '测试create',
      items: [],
      operator: '测试',
      operatorId: 'test',
      operatorSign: 'test.png',
      operatorSignTime: new Date(),
      status: 'draft'
    }
  })
  console.log('使用 create:', result2.success ? '✅ 成功' : '❌ 失败')
  
  // 对比结果
  if (result1.success && result2.success) {
    console.log('🎉 两种方式都成功! API已统一!')
  }
}
```

---

## 测试5: 快速验证(最简单)

### 在任意页面的 onLoad 中添加:

```javascript
onLoad() {
  // 快速测试
  this.quickTest()
},

methods: {
  async quickTest() {
    const res = await this.$api.callFunction('inRecords', {
      action: 'add',
      data: {
        recordNo: 'Q' + Date.now(),
        items: [],
        operator: 'test',
        operatorId: 'test',
        operatorSign: 'test',
        operatorSignTime: new Date(),
        status: 'draft'
      }
    })
    console.log('快速测试:', res.success ? '✅' : '❌')
  }
}
```

---

## 预期结果

### 成功的响应:
```javascript
{
  success: true,
  message: '创建成功',
  data: {
    _id: 'xxx',
    recordNo: 'TEST...',
    // ... 其他字段
  }
}
```

### 失败的响应:
```javascript
{
  success: false,
  message: '错误信息'
}
```

---

## 常见错误处理

### 错误1: "未知操作"
```
原因: 云函数未部署或未更新
解决: 重新部署 inRecords 云函数
```

### 错误2: "入库单号和药材明细不能为空"
```
原因: 必填字段缺失
解决: 确保 recordNo 和 items 字段存在
```

### 错误3: 网络错误
```
原因: 云函数调用失败
解决: 检查网络连接和云函数状态
```

---

## 📋 测试检查清单

- [ ] 云函数 inRecords 已部署
- [ ] 云函数 outRecords 已部署
- [ ] 测试 `action: 'add'` 成功
- [ ] 测试 `action: 'create'` 成功(向后兼容)
- [ ] 对比测试两种方式都能工作
- [ ] 查看控制台无错误信息

---

**提示**: 测试完成后记得删除测试数据! 🗑️


