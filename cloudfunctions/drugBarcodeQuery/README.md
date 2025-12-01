# 🔍 药材条形码查询云函数

## 📋 功能说明

完全免费的条形码查询方案，使用**NMPA官方爬虫**，无需任何付费API。

---

## 🎯 查询策略（三级）

```
扫描条形码
    ↓
1️⃣ 查询本地药材档案 (drugs 表)
    ↓ 未找到
2️⃣ 查询缓存数据库 (barcode_cache 表)
    ↓ 未找到
3️⃣ 条形码映射 + NMPA爬虫（免费）✅
    ├─ 查询映射表 (barcode_mapping)
    ├─ 获取药材名称
    └─ 调用NMPA官方API爬虫
```

---

## 🚀 快速开始

### **1. 创建条形码映射表**

在云开发控制台创建集合：`barcode_mapping`

索引：`barcode` (升序，唯一)

### **2. 添加映射数据**

```javascript
db.collection('barcode_mapping').add({
  data: {
    barcode: '6901028075862',
    drugName: '阿莫西林胶囊',
    specification: '0.25g*24粒',
    unit: '盒',
    source: 'manual',
    createTime: new Date()
  }
})
```

### **3. 部署云函数**

```
右键 drugBarcodeQuery → 上传并部署：所有文件
```

### **4. 测试**

```javascript
wx.cloud.callFunction({
  name: 'drugBarcodeQuery',
  data: {
    action: 'queryByBarcode',
    barcode: '6901028075862'
  }
})
```

---

## 📊 数据结构

### **barcode_mapping 集合**

```json
{
  "barcode": "6901028075862",       // 条形码
  "drugName": "阿莫西林胶囊",       // 药材名称
  "specification": "0.25g*24粒",   // 规格
  "unit": "盒",                     // 单位
  "source": "manual",               // 来源
  "createTime": "2025-11-23"
}
```

---

## 💡 工作原理

1. **扫码** → 获取条形码
2. **查映射表** → 得到药材名称
3. **调NMPA** → 爬取官方数据
4. **保存缓存** → 下次更快

---

## 📈 性能

| 场景 | 响应时间 | 成本 |
|------|---------|------|
| 本地档案 | < 100ms | 免费 |
| 缓存命中 | < 200ms | 免费 |
| NMPA爬虫 | 10-15秒 | 免费 |

**第一次慢，第二次快！**

---

## 📝 详细文档

参见：`免费扫码方案说明.md`

---

## ✅ 优势

- ✅ 完全免费
- ✅ 使用官方NMPA数据
- ✅ 自动缓存提速
- ✅ 无需维护API密钥

---

**创建时间**: 2025-11-23  
**版本**: v2.0 (纯免费版)
