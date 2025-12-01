#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
常用药材数据库初始化工具
手动准备常用药材列表，查询NMPA获取详细信息
"""

import json
import time

# 常用药材列表（可以根据实际情况修改和扩充）
COMMON_DRUGS = {
    "感冒类": [
        "999感冒灵颗粒",
        "连花清瘟胶囊",
        "小柴胡颗粒",
        "感冒清热颗粒",
        "板蓝根颗粒",
        "复方氨酚烷胺片",
        "氨咖黄敏胶囊",
        "感冒止咳颗粒",
        "抗病毒口服液",
        "双黄连口服液"
    ],
    "消炎类": [
        "阿莫西林胶囊",
        "头孢克肟分散片",
        "阿奇霉素片",
        "罗红霉素胶囊",
        "头孢拉定胶囊",
        "左氧氟沙星片",
        "克拉霉素片",
        "头孢氨苄胶囊"
    ],
    "止咳类": [
        "急支糖浆",
        "川贝枇杷膏",
        "止咳宝片",
        "肺宁颗粒",
        "复方甘草片",
        "氨溴索口服液",
        "复方鲜竹沥液"
    ],
    "止痛类": [
        "布洛芬缓释胶囊",
        "对乙酰氨基酚片",
        "阿司匹林肠溶片",
        "双氯芬酸钠缓释片",
        "吲哚美辛片",
        "芬必得"
    ],
    "降压类": [
        "硝苯地平缓释片",
        "氨氯地平片",
        "缬沙坦胶囊",
        "厄贝沙坦片",
        "卡托普利片",
        "美托洛尔片"
    ],
    "降糖类": [
        "二甲双胍片",
        "格列美脲片",
        "格列齐特缓释片",
        "阿卡波糖片",
        "瑞格列奈片"
    ],
    "胃药类": [
        "奥美拉唑肠溶胶囊",
        "雷贝拉唑钠肠溶片",
        "多潘立酮片",
        "枸橼酸莫沙必利片",
        "胃康灵胶囊",
        "铝碳酸镁片"
    ],
    "其他常用": [
        "维生素C片",
        "维生素B1片",
        "复合维生素B片",
        "钙片",
        "叶酸片",
        "蒙脱石散",
        "整肠生",
        "马应龙痔疮膏",
        "云南白药",
        "创可贴"
    ]
}

def generate_drug_list():
    """
    生成药材列表文件
    """
    print("=" * 60)
    print("📋 常用药材列表生成器")
    print("=" * 60)
    
    all_drugs = []
    for category, drugs in COMMON_DRUGS.items():
        for drug in drugs:
            all_drugs.append({
                "name": drug,
                "category": category,
                "barcode": "",  # 待填写
                "specification": "",  # 待填写
                "unit": "盒"
            })
    
    print(f"\n✅ 共整理 {len(all_drugs)} 种常用药材")
    print("\n分类统计：")
    for category, drugs in COMMON_DRUGS.items():
        print(f"  {category}: {len(drugs)} 种")
    
    # 保存为JSON
    with open('常用药材列表.json', 'w', encoding='utf-8') as f:
        json.dump(all_drugs, f, ensure_ascii=False, indent=2)
    print(f"\n💾 已保存: 常用药材列表.json")
    
    # 生成Excel模板
    try:
        import pandas as pd
        df = pd.DataFrame(all_drugs)
        df.to_excel('常用药材列表模板.xlsx', index=False)
        print(f"💾 已保存: 常用药材列表模板.xlsx")
        print("\n📝 你可以在Excel中编辑，添加条形码和规格信息")
    except:
        print("\n⚠️ 未安装pandas，跳过Excel生成")
    
    # 生成导入脚本
    generate_import_script(all_drugs)
    
    return all_drugs

def generate_import_script(drugs):
    """
    生成云数据库导入脚本
    """
    script = """// 常用药材列表导入脚本
// 适用于首次初始化药材档案

const db = wx.cloud.database()

const drugs = """ + json.dumps(drugs, ensure_ascii=False, indent=2) + """

async function importCommonDrugs() {
  console.log('========================================')
  console.log('📦 开始导入常用药材')
  console.log('总数:', drugs.length)
  console.log('========================================')
  
  let successCount = 0
  let skipCount = 0
  let failCount = 0
  
  for (let i = 0; i < drugs.length; i++) {
    const drug = drugs[i]
    
    try {
      // 检查是否已存在
      const existing = await db.collection('drugs')
        .where({ name: drug.name })
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
          category: drug.category,
          specification: drug.specification || '',
          unit: drug.unit || '盒',
          barcode: drug.barcode || '',
          manufacturer: '',
          approvalNumber: '',
          price: 0,
          stock: 0,
          minStock: 10,
          source: 'common_drugs_init',
          createTime: db.serverDate()
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
}

// 执行导入
importCommonDrugs()
"""
    
    with open('导入常用药材.js', 'w', encoding='utf-8') as f:
        f.write(script)
    
    print(f"💾 已生成: 导入常用药材.js")

def generate_readme():
    """
    生成使用说明
    """
    readme = """# 常用药材数据库初始化

## 📋 文件说明

1. **常用药材列表.json** - JSON格式药材列表
2. **常用药材列表模板.xlsx** - Excel模板（可编辑）
3. **导入常用药材.js** - 云数据库导入脚本

## 🚀 使用步骤

### 步骤1：编辑药材列表（可选）

打开 `常用药材列表模板.xlsx`，可以：
- ✅ 添加更多药材
- ✅ 填写条形码
- ✅ 填写规格信息
- ✅ 删除不需要的药材

### 步骤2：导入到小程序

1. 打开微信开发者工具
2. 打开控制台（Console）
3. 复制 `导入常用药材.js` 的全部内容
4. 粘贴到控制台
5. 按Enter运行

### 步骤3：使用扫码功能

导入后，就可以使用"智能首次录入"功能了：

```
扫码 → 输入药材名称 → 自动查NMPA → 保存映射
```

以后再扫同一药材，立即识别！

## 💡 优势

### ✅ 不需要爬虫
- 避免反爬虫问题
- 不需要ChromeDriver
- 简单可靠

### ✅ 数据准确
- 手动准备的列表
- 针对你的药房
- 常用药材都有

### ✅ 易于维护
- 随时添加新药材
- Excel编辑方便
- 重新导入即可

### ✅ 配合扫码
- 首次扫码输入药材名
- 系统查询NMPA
- 自动建立条形码映射
- 以后直接识别

## 📊 数据统计

""" + f"\n已整理 {sum(len(drugs) for drugs in COMMON_DRUGS.values())} 种常用药材\n\n" + \
    "\n".join([f"- {category}: {len(drugs)} 种" for category, drugs in COMMON_DRUGS.items()]) + """

## 🎯 后续工作

1. **完善条形码**
   - 每次扫码录入时自动保存
   - 逐渐积累条形码库

2. **补充NMPA信息**
   - 首次使用时查询NMPA
   - 自动补充批准文号、生产企业等

3. **持续更新**
   - 添加新进的药材
   - 删除不再使用的药材

---

**这是最实用的方案！** 🎉
"""
    
    with open('常用药材数据库说明.md', 'w', encoding='utf-8') as f:
        f.write(readme)
    
    print(f"💾 已生成: 常用药材数据库说明.md")

def main():
    print("\n")
    drugs = generate_drug_list()
    print("\n")
    generate_readme()
    
    print("\n" + "=" * 60)
    print("✅ 全部完成！")
    print("=" * 60)
    print("\n📁 生成的文件：")
    print("  1. 常用药材列表.json")
    print("  2. 常用药材列表模板.xlsx (如果安装了pandas)")
    print("  3. 导入常用药材.js")
    print("  4. 常用药材数据库说明.md")
    print("\n🎯 下一步：")
    print("  1. 打开微信开发者工具")
    print("  2. 在控制台运行 导入常用药材.js")
    print("  3. 开始使用扫码功能")
    print("\n💡 每次扫新药材时：")
    print("  扫码 → 输入药材名称 → 自动查NMPA → 保存映射")
    print("  下次扫同一药材 → 立即识别！")
    print("\n")

if __name__ == "__main__":
    main()
