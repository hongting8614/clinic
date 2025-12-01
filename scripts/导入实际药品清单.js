// 实际药材清单导入脚本
// 直接导入到 drugs 药材档案表

const db = wx.cloud.database()

const drugs = [
  {
    "name": "棉签",
    "specification": "2000支/包",
    "unit": "包"
  },
  {
    "name": "碘伏",
    "specification": "100ml/瓶",
    "unit": "瓶"
  },
  {
    "name": "海诺创可贴",
    "specification": "120片/盒",
    "unit": "盒"
  },
  {
    "name": "云南白药创可贴",
    "specification": "100片/盒",
    "unit": "盒"
  },
  {
    "name": "一次性乳胶手套",
    "specification": "100只/盒",
    "unit": "盒"
  },
  {
    "name": "纱布块",
    "specification": "5片/包",
    "unit": "包"
  },
  {
    "name": "3%过氧化氢消毒液",
    "specification": "500ml/瓶",
    "unit": "瓶"
  },
  {
    "name": "余氯试纸",
    "specification": "50片/瓶",
    "unit": "瓶"
  },
  {
    "name": "葡萄糖粉剂",
    "specification": "20g/包*18包/袋",
    "unit": "袋"
  },
  {
    "name": "利多卡因气雾剂",
    "specification": "60g",
    "unit": "瓶"
  },
  {
    "name": "消旋山莨菪碱片",
    "specification": "5mg*100片",
    "unit": "瓶"
  },
  {
    "name": "甲氧氯普胺片",
    "specification": "5mg*100片",
    "unit": "瓶"
  },
  {
    "name": "诺氟沙星胶囊",
    "specification": "0.1g*20粒",
    "unit": "盒"
  },
  {
    "name": "维U颠茄铝胶囊",
    "specification": "10粒/盒",
    "unit": "盒"
  },
  {
    "name": "草珊瑚含片",
    "specification": "0.44g/片*12片*4板",
    "unit": "盒"
  },
  {
    "name": "氯芬黄敏片",
    "specification": "24片/板*25板",
    "unit": "盒"
  },
  {
    "name": "布洛芬缓释胶囊",
    "specification": "0.3g*32粒",
    "unit": "盒"
  },
  {
    "name": "多潘立酮片",
    "specification": "10mg/42片",
    "unit": "盒"
  },
  {
    "name": "速效救心丸",
    "specification": "60丸*3瓶",
    "unit": "盒"
  },
  {
    "name": "脱敏胶带",
    "specification": "30卷",
    "unit": "盒"
  },
  {
    "name": "盐水清洗液",
    "specification": "15ml*50支",
    "unit": "盒"
  },
  {
    "name": "一次性吸氧管",
    "specification": "1.5m",
    "unit": "支"
  },
  {
    "name": "氧气袋",
    "specification": "",
    "unit": "个"
  },
  {
    "name": "红霉素眼膏",
    "specification": "10g/支",
    "unit": "支"
  },
  {
    "name": "左氧氟沙星滴眼液",
    "specification": "5ml/支",
    "unit": "支"
  },
  {
    "name": "藿香正气水",
    "specification": "10支/盒",
    "unit": "盒"
  },
  {
    "name": "板蓝根颗粒",
    "specification": "3g*10袋",
    "unit": "盒"
  },
  {
    "name": "无菌敷贴",
    "specification": "10cm*10cm*20袋",
    "unit": "盒"
  },
  {
    "name": "外科口罩",
    "specification": "50只/盒",
    "unit": "盒"
  },
  {
    "name": "湿润烧伤膏",
    "specification": "20g/盒",
    "unit": "盒"
  },
  {
    "name": "氯雷他定片（开瑞坦）",
    "specification": "12片/盒",
    "unit": "盒"
  },
  {
    "name": "金士康盐水清洗液",
    "specification": "15ml*20支/盒",
    "unit": "盒"
  }
]

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
