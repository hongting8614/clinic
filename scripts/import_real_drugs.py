#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
导入实际药材清单
"""

import json
import pandas as pd

# 实际药材清单（去重）
REAL_DRUGS = [
    {"name": "棉签", "specification": "2000支/包", "unit": "包"},
    {"name": "碘伏", "specification": "100ml/瓶", "unit": "瓶"},
    {"name": "海诺创可贴", "specification": "120片/盒", "unit": "盒"},
    {"name": "云南白药创可贴", "specification": "100片/盒", "unit": "盒"},
    {"name": "一次性乳胶手套", "specification": "100只/盒", "unit": "盒"},
    {"name": "纱布块", "specification": "5片/包", "unit": "包"},
    {"name": "3%过氧化氢消毒液", "specification": "500ml/瓶", "unit": "瓶"},
    {"name": "余氯试纸", "specification": "50片/瓶", "unit": "瓶"},
    {"name": "葡萄糖粉剂", "specification": "20g/包*18包/袋", "unit": "袋"},
    {"name": "利多卡因气雾剂", "specification": "60g", "unit": "瓶"},
    {"name": "消旋山莨菪碱片", "specification": "5mg*100片", "unit": "瓶"},
    {"name": "甲氧氯普胺片", "specification": "5mg*100片", "unit": "瓶"},
    {"name": "诺氟沙星胶囊", "specification": "0.1g*20粒", "unit": "盒"},
    {"name": "维U颠茄铝胶囊", "specification": "10粒/盒", "unit": "盒"},
    {"name": "草珊瑚含片", "specification": "0.44g/片*12片*4板", "unit": "盒"},
    {"name": "氯芬黄敏片", "specification": "24片/板*25板", "unit": "盒"},
    {"name": "布洛芬缓释胶囊", "specification": "0.3g*32粒", "unit": "盒"},
    {"name": "多潘立酮片", "specification": "10mg/42片", "unit": "盒"},
    {"name": "速效救心丸", "specification": "60丸*3瓶", "unit": "盒"},
    {"name": "脱敏胶带", "specification": "30卷", "unit": "盒"},
    {"name": "盐水清洗液", "specification": "15ml*50支", "unit": "盒"},
    {"name": "一次性吸氧管", "specification": "1.5m", "unit": "支"},
    {"name": "氧气袋", "specification": "", "unit": "个"},
    {"name": "红霉素眼膏", "specification": "10g/支", "unit": "支"},
    {"name": "左氧氟沙星滴眼液", "specification": "5ml/支", "unit": "支"},
    {"name": "藿香正气水", "specification": "10支/盒", "unit": "盒"},
    {"name": "板蓝根颗粒", "specification": "3g*10袋", "unit": "盒"},
    {"name": "无菌敷贴", "specification": "10cm*10cm*20袋", "unit": "盒"},
    {"name": "外科口罩", "specification": "50只/盒", "unit": "盒"},
    {"name": "湿润烧伤膏", "specification": "20g/盒", "unit": "盒"},
    {"name": "氯雷他定片（开瑞坦）", "specification": "12片/盒", "unit": "盒"},
    {"name": "金士康盐水清洗液", "specification": "15ml*20支/盒", "unit": "盒"}
]

def generate_import_script():
    """
    生成导入脚本
    """
    print("=" * 60)
    print("📋 实际药材清单导入脚本生成器")
    print("=" * 60)
    
    print(f"\n✅ 共整理 {len(REAL_DRUGS)} 种药材")
    
    # 生成导入脚本
    script = """// 实际药材清单导入脚本
// 直接导入到 drugs 药材档案表

const db = wx.cloud.database()

const drugs = """ + json.dumps(REAL_DRUGS, ensure_ascii=False, indent=2) + """

async function importRealDrugs() {
  console.log('========================================')
  console.log('📦 开始导入实际药材清单')
  console.log('总数:', drugs.length)
  console.log('========================================')
  
  let successCount = 0
  let skipCount = 0
  let failCount = 0
  
  for (let i = 0; i < drugs.length; i++) {
    const drug = drugs[i]
    
    try {
      // 检查是否已存在（按名称和规格）
      const existing = await db.collection('drugs')
        .where({
          name: drug.name,
          specification: drug.specification
        })
        .count()
      
      if (existing.total > 0) {
        console.log(`[${i+1}/${drugs.length}] ⏭️ ${drug.name} (已存在)`)
        skipCount++
        continue
      }
      
      // 添加到药材档案
      await db.collection('drugs').add({
        data: {
          name: drug.name,
          specification: drug.specification,
          unit: drug.unit,
          barcode: '',  // 待扫码补充
          manufacturer: '',  // 待补充
          approvalNumber: '',  // 待补充
          price: 0,  // 待补充
          stock: 0,
          minStock: 10,
          category: '',  // 待补充
          source: 'real_inventory',
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })
      
      successCount++
      console.log(`[${i+1}/${drugs.length}] ✅ ${drug.name}`)
      
    } catch (err) {
      failCount++
      console.error(`[${i+1}/${drugs.length}] ❌ ${drug.name}:`, err.message)
    }
    
    // 每10条延迟一下
    if ((i + 1) % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
  
  console.log('========================================')
  console.log('✅ 导入完成')
  console.log('成功:', successCount)
  console.log('跳过:', skipCount)
  console.log('失败:', failCount)
  console.log('========================================')
  console.log('')
  console.log('🎯 下一步：')
  console.log('1. 扫码录入条形码')
  console.log('2. 补充价格信息')
  console.log('3. 补充库存数量')
}

// 执行导入
importRealDrugs()
"""
    
    with open('导入实际药材清单.js', 'w', encoding='utf-8') as f:
        f.write(script)
    
    print(f"💾 已生成: 导入实际药材清单.js")
    
    # 生成Excel
    try:
        df = pd.DataFrame(REAL_DRUGS)
        df['barcode'] = ''
        df['price'] = 0
        df['stock'] = 0
        df['manufacturer'] = ''
        df = df[['name', 'specification', 'unit', 'barcode', 'price', 'stock', 'manufacturer']]
        
        df.to_excel('实际药材清单.xlsx', index=False, sheet_name='药材清单')
        print(f"💾 已生成: 实际药材清单.xlsx")
        print("   可以在Excel中补充条形码、价格等信息")
    except Exception as e:
        print(f"⚠️ 生成Excel失败: {e}")
    
    # 生成使用说明
    readme = """# 实际药材清单导入说明

## 📋 清单统计

- **总数：** """ + str(len(REAL_DRUGS)) + """ 种
- **来源：** 实际库存清单
- **状态：** 已去重整理

## 🚀 导入步骤

### 方法1：直接导入（推荐）

1. 打开微信开发者工具
2. 打开控制台（Console）
3. 复制 `导入实际药材清单.js` 的全部内容
4. 粘贴到控制台并回车
5. 等待导入完成（约15-30秒）

### 方法2：Excel编辑后导入

1. 打开 `实际药材清单.xlsx`
2. 补充条形码、价格、库存等信息
3. 保存
4. 使用批量导入工具

## 📊 导入后的数据

```javascript
{
  name: "布洛芬缓释胶囊",
  specification: "0.3g*32粒",
  unit: "盒",
  barcode: "",  // ← 扫码时自动填充
  price: 0,     // ← 手动或导入时填写
  stock: 0,     // ← 入库时自动更新
  manufacturer: "",  // ← 首次扫码时从NMPA获取
  approvalNumber: "",  // ← 首次扫码时从NMPA获取
  source: "real_inventory"
}
```

## 🎯 后续工作

### 1. 扫码补充条形码 ⭐

**操作流程：**
```
进入入库页面 → 扫码 → 选择药材 → 自动关联条形码
```

每扫一次，系统会自动：
- ✅ 保存条形码到药材档案
- ✅ 创建条形码映射
- ✅ 查询NMPA补充信息

### 2. 补充价格

在药材管理页面，逐个编辑药材价格。

### 3. 盘点库存

导入后默认库存为0，需要：
- 进行一次全面盘点
- 更新实际库存数量
- 设置最低库存预警

## 💡 优势

✅ **真实数据** - 来自实际库存  
✅ **即刻可用** - 导入后立即使用  
✅ **逐步完善** - 扫码时自动补充  
✅ **持续更新** - 新药材随时添加  

## 🔄 维护建议

1. **定期更新**
   - 新进药材及时添加
   - 停用药材标记或删除

2. **数据备份**
   - 定期导出Excel
   - 云端自动备份

3. **质量检查**
   - 检查重复药材
   - 统一规格格式
   - 补充缺失信息

---

**开始导入吧！** 🚀
"""
    
    with open('实际药材清单使用说明.md', 'w', encoding='utf-8') as f:
        f.write(readme)
    
    print(f"💾 已生成: 实际药材清单使用说明.md")

def main():
    print("\n")
    generate_import_script()
    
    print("\n" + "=" * 60)
    print("✅ 全部完成！")
    print("=" * 60)
    print("\n📁 生成的文件：")
    print("  1. 导入实际药材清单.js - 导入脚本")
    print("  2. 实际药材清单.xlsx - Excel表格")
    print("  3. 实际药材清单使用说明.md - 使用说明")
    print("\n🎯 下一步：")
    print("  1. 打开微信开发者工具")
    print("  2. 在控制台运行 导入实际药材清单.js")
    print("  3. 开始使用入库功能")
    print("\n💡 扫码时会自动：")
    print("  ✅ 关联条形码")
    print("  ✅ 查询NMPA补充信息")
    print("  ✅ 创建条形码映射")
    print("\n")

if __name__ == "__main__":
    main()
