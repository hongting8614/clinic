# 🚀 drugSearch 云函数快速部署指南

## 📌 功能介绍

新增 **药材名称搜索** 云函数，实现智能查询策略：
- ✅ **先查本地档案** → 快速响应
- ✅ **本地没有查NMPA** → 国家药监局官方数据
- ✅ **自动保存到缓存** → 下次更快

---

## 🎯 部署步骤（5分钟）

### 步骤1：安装依赖（2分钟）

打开终端，执行：

```bash
cd d:\AK-PMS\cloudfunctions\drugSearch
npm install
```

**需要安装的包：**
- wx-server-sdk (微信云开发)
- axios (HTTP请求)
- cheerio (HTML解析)

---

### 步骤2：上传云函数（1分钟）

**方法A：微信开发者工具（推荐）**

1. 打开微信开发者工具
2. 在左侧找到 `cloudfunctions/drugSearch` 文件夹
3. 右键点击 → **云函数** → **上传并部署：云端安装依赖**
4. 等待部署完成（约30秒）

**方法B：命令行**

```bash
# 在项目根目录
npx tcb fn deploy drugSearch
```

---

### 步骤3：创建数据库集合（2分钟）

1. 打开 **云开发控制台**
2. 进入 **数据库** → **集合管理**
3. 点击 **添加集合**
4. 集合名称：`drug_search_cache`
5. 点击 **确定**

**创建索引（可选，提升性能）：**

在 `drug_search_cache` 集合中：
- 添加索引：`drugName` (升序，唯一)
- 添加索引：`lastQueryTime` (降序)

---

## ✅ 部署验证

### 测试方法1：小程序测试

1. 运行小程序
2. 进入 **入库单添加** 页面
3. 在搜索框输入药材名称，如 "阿莫西林"
4. 观察结果：
   - 第一次：显示 "找到 X 条 (国家药监局)" 🎉
   - 再次搜索：显示 "找到 X 条 (本地档案)" ⚡

### 测试方法2：云函数测试

在开发者工具控制台执行：

```javascript
wx.cloud.callFunction({
  name: 'drugSearch',
  data: { drugName: '阿莫西林' }
}).then(res => {
  console.log('✅ 部署成功！', res.result)
})
```

**期望输出：**
```javascript
{
  success: true,
  source: 'nmpa',
  message: '从国家药监局获取',
  data: [
    {
      name: '阿莫西林胶囊',
      approvalNumber: '国药准字H...',
      manufacturer: 'XX制药',
      approvalDate: '2020-01-15',
      source: 'nmpa'
    }
  ]
}
```

---

## 📊 查看运行日志

1. 云开发控制台 → **云函数**
2. 找到 `drugSearch` → 点击 **日志**
3. 查看详细执行过程：

```
========================================
🔍 药材名称搜索云函数
药材名称: 阿莫西林
时间: 2025-11-23T14:21:00.000Z
========================================
🔍 [第1步] 查询本地药材档案...
❌ [第1步] 本地档案未找到
🔍 [第2步] 调用国家药监局API...
📡 开始查询NMPA...
✅ [第2步] NMPA查询成功，找到 5 条记录
💾 [第3步] 保存到本地缓存...
✅ 新增缓存成功
========================================
✅ 查询完成
耗时: 12345ms
数据来源: 国家药监局
========================================
```

---

## 🎨 前端代码已更新

**文件**: `pages-sub/in/add.vue`

**更新内容：**
```javascript
// 原来：只查本地
async searchDrugs() {
  const localResults = await this.searchLocalDrugs(keyword)
  // ...
}

// 现在：本地 → NMPA → 手动创建
async searchDrugs() {
  const result = await wx.cloud.callFunction({
    name: 'drugSearch',  // 🆕 调用新云函数
    data: { drugName: keyword }
  })
  
  if (result.result.success) {
    // 显示结果，并提示数据来源
    const sourceText = {
      'local': '本地档案',
      'nmpa': '国家药监局'  // 🆕 新增来源
    }[result.result.source]
    
    uni.showToast({
      title: `找到 ${drugs.length} 条 (${sourceText})`,
      icon: 'none'
    })
  }
}
```

---

## 💡 使用场景

### 场景1：首次搜索新药材
```
用户输入: "布洛芬"
  ↓
查询本地档案 ❌ 未找到
  ↓
调用NMPA API ✅ 找到 3 条
  ↓
自动保存缓存 💾
  ↓
显示结果: "找到 3 条 (国家药监局)"
```

### 场景2：再次搜索同一药材
```
用户输入: "布洛芬"
  ↓
查询本地档案 ✅ 找到 1 条（之前添加的）
  ↓
显示结果: "找到 1 条 (本地档案)"
响应时间: < 500ms ⚡
```

### 场景3：搜索不存在的药材
```
用户输入: "不存在的药"
  ↓
查询本地档案 ❌
  ↓
调用NMPA API ❌
  ↓
提示: "未找到药材信息，是否手动创建？"
```

---

## 🔧 故障排除

### 问题1：云函数部署失败

**症状**：上传时报错 "部署失败"

**解决方案：**
```bash
# 检查依赖是否安装
cd cloudfunctions/drugSearch
ls node_modules

# 重新安装
rm -rf node_modules package-lock.json
npm install
```

---

### 问题2：NMPA查询超时

**症状**：日志显示 "NMPA查询失败: timeout"

**原因**：
- 网络不稳定
- NMPA服务器响应慢

**解决方案：**
- 本地有数据时不影响使用
- 等待网络恢复后自动正常

---

### 问题3：搜索结果为空

**症状**：输入药材名称，显示"未找到"

**排查步骤：**

1. **检查药材名称是否正确**
   - ✅ 阿莫西林
   - ❌ amoxicillin（NMPA不支持英文）

2. **检查云函数日志**
   - 是否调用成功？
   - NMPA返回了什么？

3. **手动测试NMPA**
   ```javascript
   // 控制台测试
   wx.cloud.callFunction({
     name: 'drugSearch',
     data: { drugName: '阿莫西林' }
   }).then(console.log)
   ```

---

## 📈 性能数据

| 场景 | 响应时间 | 数据来源 |
|------|---------|---------|
| **本地档案** | < 500ms | drugs表 ⚡ |
| **首次NMPA** | 10-15秒 | 国家药监局 🌐 |
| **缓存命中** | < 1秒 | drug_search_cache ⚡ |

---

## 🎯 下一步优化（可选）

### 1. 定时同步热门药材
```javascript
// 定时任务：将缓存中高频药材同步到 drugs 表
// 设置：云开发控制台 → 定时触发器
// 频率：每天凌晨 2:00
```

### 2. 添加数据验证
- 检查批准文号格式
- 过滤失效药材
- 补充规格信息

### 3. 多来源融合
- NMPA（官方）
- 极速数据API（商业）
- 本地档案（已有）

---

## 📞 技术支持

遇到问题？
1. 查看云函数日志
2. 检查数据库集合
3. 参考 `cloudfunctions/drugSearch/README.md`

---

## ✅ 部署检查清单

- [ ] 安装依赖 (`npm install`)
- [ ] 上传云函数 (微信开发者工具)
- [ ] 创建数据库集合 (`drug_search_cache`)
- [ ] 测试搜索功能
- [ ] 查看运行日志
- [ ] 验证缓存保存

**全部完成？恭喜！🎉 你的药材搜索功能已升级！**

---

**创建时间**: 2025-11-23  
**作者**: Cascade AI  
**版本**: v1.0
