# 极速数据药材查询API说明

## 🎯 接口信息

### **接口地址：**
```
https://api.jisuapi.com/medicine/query
```

### **AppKey：**
```
8ff9121b8ab14e3f
```

### **免费额度：**
- 100次查询
- 系统限制99次（保护机制）

---

## 📊 接口特点

### **专业药材接口优势：** ⭐⭐⭐

✅ **针对药材设计**
- 返回药材ID、图片
- 明确的处方药标识
- 生产厂商信息

✅ **多种查询方式**
- 条形码查询
- 药材名称查询
- 生产厂家查询
- 批准文号查询

✅ **准确的处方药信息**
- 1 = 处方药
- 2 = OTC（非处方药）

---

## 🔍 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| appkey | string | 是 | API密钥 |
| name | string | 否 | 药材名称 |
| manufacturer | string | 否 | 生产厂家 |
| approval_num | string | 否 | 批准文号 |
| barcode | string | 否 | 药材条码 |
| prescription | int | 否 | 是否处方药（1：处方药；2：OTC） |

**我们使用：** 条形码查询（barcode参数）

---

## 📋 返回数据

### **成功返回：**

```json
{
  "status": 0,
  "msg": "ok",
  "result": {
    "list": [
      {
        "medicine_id": 59,
        "name": "阿司匹林肠溶片 (金太子)",
        "image": "2023/A0/b9a0896c55175d72.jpg",
        "manufacturer": "陕西白鹿制药股份有限公司",
        "prescription": 1
      }
    ]
  }
}
```

### **字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| medicine_id | string | 药材ID |
| name | string | 药材名 |
| image | string | 药材图片路径 |
| manufacturer | string | 生产厂商 |
| prescription | int | 1=处方药；2=OTC |

---

## 🔧 我们的实现

### **查询流程：**

```javascript
1. 扫码获取条形码
   ↓
2. 调用药材API（用条形码查询）
   ↓
3. 解析返回数据：
   - medicine_id → 药材ID
   - name → 药材名称
   - image → 药材图片
   - manufacturer → 生产厂商
   - prescription → 处方药标识
   ↓
4. 转换处方药字段：
   - 1 → isPrescription: true, prescriptionType: '处方药'
   - 2 → isPrescription: false, prescriptionType: '非处方药(OTC)'
   ↓
5. 保存到缓存和映射表
```

---

## 📊 系统返回格式

### **统一返回结构：**

```javascript
{
  success: true,
  data: {
    medicineId: '59',              // 药材ID
    name: '阿司匹林肠溶片 (金太子)',
    image: '2023/A0/b9a0896c55175d72.jpg',
    specification: '金太子',       // 从名称提取
    unit: '盒',                    // 智能推测
    manufacturer: '陕西白鹿制药股份有限公司',
    barcode: '6936435555607',
    isPrescription: true,          // 布尔值（方便判断）
    prescriptionType: '处方药',    // 文字（方便显示）
    prescriptionCode: 1,           // 原始代码
    apiSource: 'jisu_medicine'
  },
  source: 'jisu_api',
  message: '从极速数据API获取',
  apiUsage: {
    used: 5,
    limit: 99
  }
}
```

---

## 🧪 测试脚本

### **测试条形码查询：**

```javascript
// 在小程序控制台运行
wx.cloud.callFunction({
  name: 'drugBarcodeQuery',
  data: {
    action: 'queryByBarcode',
    barcode: '6936435555607'  // 替换为真实条形码
  }
}).then(res => {
  console.log('========================================')
  console.log('📊 药材查询结果')
  console.log('========================================')
  console.log('成功:', res.result.success)
  console.log('来源:', res.result.source)
  
  if (res.result.data) {
    const drug = res.result.data
    console.log('')
    console.log('药材信息:')
    console.log('  ID:', drug.medicineId)
    console.log('  名称:', drug.name)
    console.log('  厂商:', drug.manufacturer)
    console.log('  处方药?:', drug.isPrescription)
    console.log('  类型:', drug.prescriptionType)
    console.log('  图片:', drug.image)
  }
  
  if (res.result.apiUsage) {
    console.log('')
    console.log('API使用情况:')
    console.log('  已用:', res.result.apiUsage.used)
    console.log('  限制:', res.result.apiUsage.limit)
    console.log('  剩余:', res.result.apiUsage.limit - res.result.apiUsage.used)
  }
  console.log('========================================')
})
```

---

## 🎯 处方药判断规则

### **API返回值：**
- `prescription: 1` → **处方药**
- `prescription: 2` → **非处方药(OTC)**

### **系统转换：**

```javascript
if (prescription === 1) {
  isPrescription = true
  prescriptionType = '处方药'
} else if (prescription === 2) {
  isPrescription = false
  prescriptionType = '非处方药(OTC)'
}
```

---

## 💡 智能特性

### **1. 规格提取**
```javascript
药材名称: "阿司匹林肠溶片 (金太子)"
提取规格: "金太子"
```

### **2. 单位推测**
```javascript
名称包含"注射"/"针剂" → 单位: 支
名称包含"口服液"/"糖浆" → 单位: 瓶
名称包含"颗粒"/"散剂" → 单位: 袋
其他 → 单位: 盒
```

### **3. 自动缓存**
```
查询成功 → 保存到缓存 → 下次免费使用
```

---

## 📊 与通用条码接口对比

| 对比项 | 通用条码接口 | 药材专用接口 ⭐ |
|--------|-------------|----------------|
| 接口地址 | /barcode/query | /medicine/query |
| 覆盖范围 | 所有商品 | 专注药材 |
| 药材准确性 | 低 | **高** |
| 处方药信息 | 无 | **有(1/2)** |
| 药材图片 | 无 | **有** |
| 药材ID | 无 | **有** |
| 数据质量 | 一般 | **专业** |

---

## 🔒 成本控制

### **保护措施：**
✅ 最多调用99次  
✅ 达到上限自动停用  
✅ 查到的数据会缓存  
✅ 不会重复扣费  

### **查看使用情况：**

```javascript
// 运行管理脚本
checkAPIUsage()
```

---

## 📝 日志示例

### **成功查询：**

```
🔍 [第4级] 极速数据API查询...
   API剩余次数: 95 次
   
📡 调用极速数据药材查询API...
AppKey: 8ff9121b...
条形码: 6936435555607

📡 极速数据API响应状态: 0
📡 响应消息: ok

✅ 极速数据药材API查询成功!
药材ID: 59
药材名称: 阿司匹林肠溶片 (金太子)
生产厂商: 陕西白鹿制药股份有限公司
处方药标识: 1
处方药类型: 处方药

   已调用: 6/99 次
   
💾 保存到缓存数据库...
💾 创建条形码映射...
```

---

## ✅ 总结

### **优势：**
✅ 专业药材数据  
✅ 准确的处方药标识  
✅ 药材图片支持  
✅ 多种查询方式  
✅ 完善的成本控制  

### **适用场景：**
✅ 药房管理系统  
✅ 医院药材管理  
✅ 药材信息查询  

---

**这是目前最适合药材管理的API接口！** 🎉
