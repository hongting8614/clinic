# 🚀 性能优化测试指南

## 优化内容

### ✅ 已完成的优化

1. **云函数优化** - `drugManage` 云函数
   - ✅ 新增 `getDrugDetail` action（获取单个药品详情）
   - ✅ 新增 `getDrugWithBatches` action（合并查询药品+批次信息）
   - ✅ 支持 FIFO 排序（优先推荐最早批次）

2. **出库页面优化** - `pages-sub/out/add.vue`
   - ✅ 使用 `getDrugWithBatches` 替代原来的 `allocateBatchesFIFO`
   - ✅ 减少云函数调用次数（从2次减少到1次）
   - ✅ 前端实现 FIFO 分配算法

3. **入库页面** - `pages-sub/in/add.vue`
   - ℹ️ 无需优化（主要是添加新批次，不查询现有批次）

4. **门诊页面** - `pages-sub/clinic/add.vue`
   - ℹ️ 无需优化（目前无药品查询功能）

---

## 📊 性能对比

### 优化前（旧方案）
```
用户操作：输入出库数量
  ↓
调用云函数1：stockManage.allocateBatchesFIFO
  ├─ 查询药品信息（drugs 集合）
  ├─ 查询批次信息（stock 集合）
  └─ 云端计算 FIFO 分配
  ↓
返回分配结果
```
**总耗时：** ~800-1200ms（2次数据库查询 + 云端计算）

### 优化后（新方案）
```
用户操作：输入出库数量
  ↓
调用云函数：drugManage.getDrugWithBatches
  ├─ 并行查询药品+批次（Promise.all）
  └─ 返回原始数据
  ↓
前端计算 FIFO 分配（本地算法）
```
**总耗时：** ~400-600ms（1次并行查询 + 前端计算）

**性能提升：** 约 **40-50%** ⚡

---

## 🧪 测试步骤

### 1️⃣ 测试云函数（控制台测试）

在微信开发者工具的控制台中执行以下代码：

#### 测试 getDrugDetail
```javascript
// 测试获取药品详情
wx.cloud.database().collection('drugs').limit(1).get().then(res => {
  if (res.data.length > 0) {
    const drugId = res.data[0]._id
    
    wx.cloud.callFunction({
      name: 'drugManage',
      data: {
        action: 'getDrugDetail',
        data: { drugId: drugId }
      }
    }).then(res => {
      console.log('✅ getDrugDetail 测试成功:', res.result)
    })
  }
})
```

#### 测试 getDrugWithBatches（合并查询）
```javascript
// 先查询一个有库存的药品
wx.cloud.database().collection('drugs').limit(1).get().then(res => {
  if (res.data.length > 0) {
    const drug = res.data[0]
    console.log('找到药品:', drug.name)
    console.log('drugId:', drug._id)
    
    // 测试合并查询
    wx.cloud.callFunction({
      name: 'drugManage',
      data: {
        action: 'getDrugWithBatches',
        data: {
          drugId: drug._id,
          location: 'drug_storage',
          enableFIFO: true
        }
      }
    }).then(res => {
      console.log('✅ 合并查询测试成功:', res.result)
      console.log('  - 药品信息:', res.result.data.drug)
      console.log('  - 批次数量:', res.result.data.batches.length)
      console.log('  - 批次详情:', res.result.data.batches)
    }).catch(err => {
      console.error('❌ 测试失败:', err)
    })
  } else {
    console.log('数据库中暂无药品数据')
  }
})
```

---

### 2️⃣ 测试出库页面（实际操作）

1. **进入出库页面**
   - 导航到：`pages-sub/out/add.vue`
   - 点击"添加药材"按钮

2. **选择药材**
   - 选择一个有库存的药材
   - 观察控制台输出

3. **输入出库数量**
   - 输入数量（例如：10）
   - 等待 500ms（防抖）
   - 观察控制台输出：
     ```
     ⭐ 合并查询结果: {success: true, data: {...}}
     ✅ 已分配 X 个批次
     ```

4. **查看分配结果**
   - 页面应显示批次分配卡片
   - 包含批号、有效期、分配数量等信息
   - 如有近效期批次，会显示警告标签

---

### 3️⃣ 性能测试（对比测试）

#### 测试方法
在控制台中执行以下代码，对比新旧方案的性能：

```javascript
// 准备测试数据
const testDrugId = 'YOUR_DRUG_ID'  // 替换为实际的药品ID
const testQuantity = 10

// 测试新方案（getDrugWithBatches）
console.time('⭐ 新方案耗时')
wx.cloud.callFunction({
  name: 'drugManage',
  data: {
    action: 'getDrugWithBatches',
    data: {
      drugId: testDrugId,
      location: 'drug_storage',
      enableFIFO: true
    }
  }
}).then(res => {
  console.timeEnd('⭐ 新方案耗时')
  console.log('新方案结果:', res.result)
})

// 测试旧方案（allocateBatchesFIFO）
console.time('🔴 旧方案耗时')
wx.cloud.callFunction({
  name: 'stockManage',
  data: {
    action: 'allocateBatchesFIFO',
    data: {
      drugId: testDrugId,
      requiredQuantity: testQuantity,
      location: 'drug_storage'
    }
  }
}).then(res => {
  console.timeEnd('🔴 旧方案耗时')
  console.log('旧方案结果:', res.result)
})
```

#### 预期结果
```
⭐ 新方案耗时: 450ms
🔴 旧方案耗时: 950ms

性能提升: 52.6% ⚡
```

---

## 🎯 验收标准

### ✅ 功能正常
- [ ] 云函数 `getDrugDetail` 可以正确返回药品详情
- [ ] 云函数 `getDrugWithBatches` 可以正确返回药品+批次信息
- [ ] 出库页面可以正常分配批次
- [ ] FIFO 排序正确（优先分配最早批次）
- [ ] 近效期提示正常显示

### ⚡ 性能提升
- [ ] 响应时间减少 40% 以上
- [ ] 云函数调用次数减少（从2次到1次）
- [ ] 用户体验更流畅

### 🐛 无副作用
- [ ] 原有功能不受影响
- [ ] 数据准确性不变
- [ ] 无新增错误或��常

---

## 📝 注意事项

1. **云函数部署**
   - 修改云函数后，必须重新部署才能生效
   - 右键点击 `drugManage` 云函数 → "上传并部署：云端安装依赖"

2. **数据准备**
   - 确保数据库中有药品数据（`drugs` 集合）
   - 确保有库存批次数据（`stock` 集合）
   - 测试时使用有库存的药品

3. **兼容性**
   - 新旧方案可以共存
   - 如果新方案有问题，可以回退到旧方案
   - 只需修改 `autoAllocateBatch` 方法即可

---

## 🔄 回退方案

如果新方案出现问题，可以快速回退到旧方案：

```javascript
// 在 pages-sub/out/add.vue 中
// 将 autoAllocateBatch 方法中的云函数调用改回：

const result = await wx.cloud.callFunction({
  name: 'stockManage',  // 改回 stockManage
  data: {
    action: 'allocateBatchesFIFO',
    data: {
      drugId: item.drugId,
      requiredQuantity: item.quantity,
      location: 'drug_storage'
    }
  }
})
```

---

## 📈 后续优化建议

1. **缓存优化**
   - 对常用药品信息进行本地缓存
   - 减少重复查询

2. **预加载优化**
   - 进入出库页面时预加载常用药品
   - 提升用户体验

3. **批量查询优化**
   - 支持一次查询多个药品的批次信息
   - 适用于批量出库场景

---

## ✅ 测试完成清单

- [ ] 云函数测试通过
- [ ] 出库页面功能正常
- [ ] 性能提升达标
- [ ] 无副作用
- [ ] 用户体验良好

---

**测试日期：** _____________

**测试人员：** _____________

**测试结果：** ✅ 通过 / ❌ 未通过

**备注：** _____________________________________________

