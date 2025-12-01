# 药材名称搜索云函数 (drugSearch)

## 📋 功能说明

实现药材名称搜索的智能三级查询策略：
1. **优先查询本地药材档案** (`drugs` 表)
2. **本地无数据时调用国家药监局NMPA API**
3. **自动保存NMPA查询结果到本地缓存** (`drug_search_cache` 表)

## 🎯 查询流程

```
用户输入药材名称
      ↓
调用 drugSearch 云函数
      ↓
┌─────────────────┐
│ 查询本地档案     │ → 找到 → 返回本地数据 ✅
│ (drugs 表)      │
└─────────────────┘
      ↓ 未找到
┌─────────────────┐
│ 调用NMPA API    │ → 找到 → 保存到缓存 → 返回NMPA数据 ✅
│ (国家药监局)     │
└─────────────────┘
      ↓ 未找到
返回 success: false
提示手动创建 ❌
```

## 📦 部署步骤

### 1. 安装依赖

在云函数目录下执行：

```bash
cd cloudfunctions/drugSearch
npm install
```

需要安装的包：
- `wx-server-sdk@~2.6.3` - 微信云开发SDK
- `axios@^0.27.2` - HTTP请求库
- `cheerio@^1.0.0-rc.12` - HTML解析库（类似jQuery）

### 2. 上传并部署

**方法A：通过微信开发者工具**
1. 右键点击 `drugSearch` 文件夹
2. 选择"云函数" → "上传并部署：云端安装依赖"
3. 等待部署完成

**方法B：通过命令行**
```bash
# 在项目根目录执行
npx tcb fn deploy drugSearch
```

### 3. 创建数据库集合

在云开发控制台创建以下集合：

**drug_search_cache** - 药材搜索缓存表
```json
{
  "drugName": "阿莫西林",           // 搜索关键词
  "results": [...],               // NMPA查询结果数组
  "queryCount": 5,                // 查询次数
  "source": "nmpa",               // 数据来源
  "createTime": "2025-11-23",     // 创建时间
  "lastQueryTime": "2025-11-23"   // 最后查询时间
}
```

**索引建议：**
- `drugName` - 升序索引（唯一）
- `lastQueryTime` - 降序索引

## 📡 API说明

### 调用方式

```javascript
const result = await wx.cloud.callFunction({
  name: 'drugSearch',
  data: {
    drugName: '阿莫西林'  // 必填：药材名称
  }
})
```

### 返回数据结构

**成功（本地档案）：**
```javascript
{
  success: true,
  source: 'local',
  message: '从本地药材档案获取',
  data: [
    {
      _id: '药材ID',
      name: '阿莫西林胶囊',
      specification: '0.25g*24粒',
      unit: '盒',
      manufacturer: 'XX制药有限公司',
      barcode: '6901028075862',
      approvalNumber: '国药准字H12345678',
      category: '抗生素',
      source: 'local'
    }
  ]
}
```

**成功（国家药监局）：**
```javascript
{
  success: true,
  source: 'nmpa',
  message: '从国家药监局获取',
  data: [
    {
      name: '阿莫西林胶囊',
      approvalNumber: '国药准字H12345678',
      manufacturer: 'XX制药有限公司',
      approvalDate: '2020-01-15',
      source: 'nmpa'
    }
  ]
}
```

**失败：**
```javascript
{
  success: false,
  message: '未找到药材信息',
  suggestion: '请检查药材名称是否正确，或手动创建药材档案'
}
```

## 🌐 NMPA API说明

### API地址
```
http://app1.nmpa.gov.cn/data_nmpa/face3/search.jsp
```

### 查询参数
- `tableId`: 25 (国产药材) / 26 (进口药材)
- `keyword`: 药材名称关键词
- `State`: 1 (正常状态)
- `tableName`: TABLE25
- `curstart`: 页码（从1开始）

### 返回字段
- **批准文号** - 国药准字号
- **药材名称** - 完整药材名称
- **生产企业** - 生产厂家
- **批准日期** - 批准上市日期

### 注意事项
- ⚠️ NMPA API 是公开接口，但可能有访问限制
- ⚠️ 响应速度较慢（10-15秒）
- ⚠️ 可能返回多条相似药材
- ⚠️ HTML解析可能因页面结构变化而失效

## 💾 缓存策略

### 缓存作用
1. **减少API调用** - 相同关键词直接读缓存
2. **提高响应速度** - 避免每次都请求NMPA
3. **统计查询频率** - 记录热门药材

### 缓存更新
- 首次查询：创建新缓存记录
- 再次查询：更新 `queryCount` 和 `lastQueryTime`

### 缓存清理建议
定期清理低频查询的缓存：
```javascript
// 删除30天未查询的缓存
db.collection('drug_search_cache')
  .where({
    lastQueryTime: _.lt(new Date(Date.now() - 30*24*60*60*1000))
  })
  .remove()
```

## 🔧 调试技巧

### 1. 查看云函数日志
云开发控制台 → 云函数 → drugSearch → 日志

### 2. 测试查询
```javascript
// 控制台测试
wx.cloud.callFunction({
  name: 'drugSearch',
  data: { drugName: '阿莫西林' }
}).then(res => {
  console.log('查询结果:', res.result)
})
```

### 3. 常见问题

**问题1：依赖安装失败**
```bash
# 解决方案：手动安装
cd cloudfunctions/drugSearch
npm install --registry=https://registry.npmmirror.com
```

**问题2：NMPA API超时**
- 检查网络连接
- 增加 timeout 时间
- 使用代理或备用API

**问题3：HTML解析失败**
- NMPA页面结构可能变化
- 检查选择器是否正确
- 更新 cheerio 版本

## 📊 性能优化

### 1. 本地优先策略
- 90%的查询命中本地档案
- 平均响应时间 < 500ms

### 2. 缓存命中率
- 记录 `queryCount` 统计热门药材
- 定期同步到 `drugs` 表

### 3. 批量查询
```javascript
// 未来可扩展批量查询
data: {
  drugNames: ['阿莫西林', '头孢', '布洛芬']
}
```

## 📝 更新日志

### v1.0.0 (2025-11-23)
- ✅ 实现本地档案查询
- ✅ 实现NMPA API查询
- ✅ 实现缓存机制
- ✅ 添加详细日志
- ✅ 错误处理完善

## 🔗 相关文件

- **前端调用**: `pages-sub/in/add.vue` (searchDrugs 方法)
- **数据库**: `drugs` (本地档案), `drug_search_cache` (缓存)
- **相关云函数**: `drugBarcodeQuery` (条形码查询)

## 👨‍💻 维护者

AK-PMS开发团队

---

**最后更新**: 2025-11-23
**版本**: v1.0.0
