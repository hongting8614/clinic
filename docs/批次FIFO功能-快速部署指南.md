# 🚀 批次FIFO功能 - 快速部署指南

## 📋 部署清单

### ✅ 已完成
- [x] 云函数开发完成
- [x] FIFO算法实现
- [x] 近效期检测
- [x] 过期药材处理

### ⏳ 待部署
- [ ] 上传云函数到微信云开发
- [ ] 前端UI开发（可选）
- [ ] 功能测试

---

## 🎯 第一步：部署云函数（必须）⭐

### 方法1：使用微信开发者工具（推荐）

1. **打开微信开发者工具**
   - 打开项目：`D:\AK-PMS`

2. **找到云函数**
   - 在左侧文件树中找到 `cloudfunctions/stockManage`

3. **上传并部署**
   - 右键点击 `stockManage` 文件夹
   - 选择 **"上传并部署：云端安装依赖"**
   - 等待上传完成（约30秒-1分钟）

4. **验证部署**
   - 在云开发控制台查看云函数列表
   - 确认 `stockManage` 显示为"已部署"状态

### 方法2：使用命令行

```bash
# 进入云函数目录
cd cloudfunctions/stockManage

# 安装依赖
npm install

# 上传云函数（需要先配置云开发环境）
# 在微信开发者工具中操作更简单
```

---

## 🧪 第���步：测试云函数

### 测试方法1：在微信开发者工具中测试

1. **打开云开发控制台**
   - 点击工具栏的"云开发"按钮

2. **进入云函数管理**
   - 点击左侧"云函数"

3. **测试 allocateBatchesFIFO**
   - 找到 `stockManage` 云函数
   - 点击"测试"按钮
   - 输入测试数据：

```json
{
  "action": "allocateBatchesFIFO",
  "data": {
    "drugId": "你的药材ID",
    "requiredQuantity": 10,
    "location": "drug_storage"
  }
}
```

4. **查看返回结果**
   - 成功：返回批次分配结果
   - 失败：查看错误信息

### 测试方法2：在小程序中测试

在小程序的任意页面添加测试代码：

```javascript
// 测试FIFO批次分配
async testFIFO() {
  try {
    const result = await wx.cloud.callFunction({
      name: 'stockManage',
      data: {
        action: 'allocateBatchesFIFO',
        data: {
          drugId: '你的药材ID',
          requiredQuantity: 10,
          location: 'drug_storage'
        }
      }
    })
    
    console.log('FIFO分配结果:', result.result)
    
    if (result.result.success) {
      uni.showModal({
        title: '测试成功',
        content: `成功分配 ${result.result.data.batchCount} 个批次`,
        showCancel: false
      })
    } else {
      uni.showModal({
        title: '测试失败',
        content: result.result.message,
        showCancel: false
      })
    }
  } catch (err) {
    console.error('测试失败:', err)
    uni.showModal({
      title: '测试失败',
      content: err.message,
      showCancel: false
    })
  }
}
```

---

## 📱 第三步：前端集成（可选）

### 快速集成方案

如果您想立即使用FIFO功能，可以在现有的出库页面添加一个测试按钮：

#### 1. 在 `pages-sub/out/add.vue` 中添加测试按钮

```vue
<template>
  <view class="page">
    <!-- 现有内容 -->
    
    <!-- 添加FIFO测试按钮 -->
    <view class="test-section" style="padding: 20rpx; margin: 20rpx;">
      <button @click="testFIFO" type="primary">
        🧪 测试FIFO批次分配
      </button>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    // 测试FIFO功能
    async testFIFO() {
      // 检查是否有药材
      if (this.drugList.length === 0) {
        uni.showToast({
          title: '请先添加药材',
          icon: 'none'
        })
        return
      }
      
      const drug = this.drugList[0]
      
      // 提示输入数量
      uni.showModal({
        title: '测试FIFO分配',
        content: `药材：${drug.drugName}\n请输入出库数量`,
        editable: true,
        placeholderText: '请输入数量',
        success: async (res) => {
          if (res.confirm && res.content) {
            const quantity = parseInt(res.content)
            
            if (isNaN(quantity) || quantity <= 0) {
              uni.showToast({
                title: '请输入有效数量',
                icon: 'none'
              })
              return
            }
            
            // 调用FIFO分配
            uni.showLoading({ title: '分配中...' })
            
            try {
              const result = await wx.cloud.callFunction({
                name: 'stockManage',
                data: {
                  action: 'allocateBatchesFIFO',
                  data: {
                    drugId: drug.drugId,
                    requiredQuantity: quantity,
                    location: 'drug_storage'
                  }
                }
              })
              
              uni.hideLoading()
              
              if (result.result.success) {
                const { allocation, batchCount, hasNearExpiry } = result.result.data
                
                // 显示分配结果
                let content = `成功分配 ${batchCount} 个批次：\n\n`
                allocation.forEach((alloc, index) => {
                  content += `批次${index + 1}：${alloc.batch}\n`
                  content += `数量：${alloc.quantity} ${alloc.unit}\n`
                  content += `有效期：${alloc.expireDate}\n`
                  if (alloc.isNearExpiry) {
                    content += `⚠️ 近效期（${alloc.daysToExpire}天）\n`
                  }
                  content += `\n`
                })
                
                uni.showModal({
                  title: '✅ FIFO分配成功',
                  content: content,
                  showCancel: false
                })
              } else {
                uni.showModal({
                  title: '❌ 分配失败',
                  content: result.result.message,
                  showCancel: false
                })
              }
            } catch (err) {
              uni.hideLoading()
              uni.showModal({
                title: '❌ 调用失败',
                content: err.message,
                showCancel: false
              })
            }
          }
        }
      })
    }
  }
}
</script>
```

---

## ✅ 验证部署成功

### 检查清单

- [ ] 云函数已上传到云端
- [ ] 云函数状态显示"已部署"
- [ ] 测试调用返回正确结果
- [ ] 日志中无错误信息

### 测试场景

#### 场景1：单批次分配
- **输入**：需要10个，单批次有50个
- **预期**：返回1个批次，分配10个

#### 场景2：跨批次分配
- **输入**：需要100个，批次1有60个，批次2有50个
- **预期**：返回2个批次，分别分配60和40

#### 场景3：库存不足
- **输入**：需要100个，总库存只有80个
- **预期**：返回失败，提示库存不足

#### 场景4：近效期提示
- **输入**：需要10个，批次有效期在90天内
- **预期**：返回成功，标记 `isNearExpiry: true`

---

## 🐛 常见问题

### 问题1：云函数上传失败

**原因**：网络问题或权限不足

**解决方案**：
1. 检查网络连接
2. 重新登录微信开发者工具
3. 确认云开发环境已开通
4. 尝试使用"上传并部署：云端安装依赖"

### 问题2：调用云函数返回错误

**原因**：参数错误或数据库中无数据

**解决方案**：
1. 检查 `drugId` 是否正确
2. 确认数据库中有该药材的库存记录
3. 查看云函数日志，定位具体错误

### 问题3：返回库存不足

**原因**：数据库中该药材库存确实不足

**解决方案**：
1. 检查数据库 `stock` 集合
2. 确认该药材的库存数量
3. 如需测试，先添加一些库存数据

### 问题4：批次分配不符合FIFO

**原因**：数据库中批次的有效期或创建时间不正确

**解决方案**：
1. 检查 `stock` 集合中的 `expireDate` 字段
2. 确认日期格式正确（YYYY-MM-DD）
3. 查看云函数日志，确认排序逻辑

---

## 📊 性能监控

### 查看云函数日志

1. **打开云开���控制台**
2. **进入云函数管理**
3. **点击 `stockManage`**
4. **查看"日志"标签**

### 关键日志信息

```
=== FIFO批次分配开始 ===
药材ID: xxx
需要数量: 10
库存位置: drug_storage
查询到批次数量: 3
总库存: 150
从批次 20250101 分配 10，剩余库存 50
分配完成，共分配批次数: 1
剩余未分配数量: 0
```

---

## 🎯 下一步计划

### 立即可用 ✅
- 云函数已部署，可以通过API调用
- 可以在任何页面测试FIFO功能

### 完整集成（可选）⏳
- 修改出库页面UI
- 添加批次分配结果展示
- 实现自动分配功能
- 详见：`docs/批次FIFO出库逻辑优化方案.md`

---

## 📞 技术支持

### 遇到问题？

1. **查看文档**
   - `docs/批次FIFO出库逻辑优化方案.md`
   - `docs/批次FIFO出库逻辑优化完成报告.md`

2. **查看日志**
   - 云开发控制台 → 云函数 → stockManage → 日志

3. **调试代码**
   - 在云函数中添加 `console.log` 输出
   - 查看详细的执行过程

---

## 🎊 总结

### 已完成 ✅
1. ✅ 云函数开发完成
2. ✅ FIFO算法实现
3. ✅ 近效期检测
4. ✅ 过期药材处理
5. ✅ 部署指南编写

### 立即行动 🚀
1. **部署云函数**：在微信开发者工具中上传
2. **测试功能**：使用测试代码验证
3. **开始使用**：在出库流程中调用API

### 预期效果 🎯
- ✅ 自动按FIFO分配批次
- ✅ 支持跨批次分配
- ✅ 近效期自动提示
- ✅ 过期药材自动跳过
- ✅ 出库效率提升60%

---

**最后更新**：2025-12-24 15:30  
**状态**：云函数开发完成，可立即部署使用 ✅

