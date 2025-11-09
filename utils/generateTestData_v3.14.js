/**
 * v3.14 测试数据自动生成脚本
 * 用于快速生成符合双轨制存储的测试数据
 */

const db = wx.cloud.database()
const _ = db.command

// ==================== 1. 配置区域 ====================

// 药库和园区配置
const LOCATIONS = [
  { code: 'drug_storage', name: '药库', icon: '🏥', type: 'storage' },
  { code: 'land_park', name: '陆地园区', icon: '🏢', type: 'park' },
  { code: 'water_park', name: '水上园区', icon: '🏊', type: 'park' }
]

// 供应商数据
const SUPPLIERS = [
  { name: '康美药业', code: 'SUP001', contact: '张经理', phone: '13800138000' },
  { name: '九州通医药', code: 'SUP002', contact: '李经理', phone: '13800138001' },
  { name: '华润医药', code: 'SUP003', contact: '王经理', phone: '13800138002' },
  { name: '国药集团', code: 'SUP004', contact: '赵经理', phone: '13800138003' }
]

// 药品数据（带规格）
const DRUGS = [
  // 片剂类
  { name: '阿莫西林胶囊', specification: '0.25g×24粒/盒', unit: '盒', price: 15.8, category: '抗生素' },
  { name: '头孢克肟片', specification: '0.1g×12片/盒', unit: '盒', price: 28.5, category: '抗生素' },
  { name: '布洛芬缓释胶囊', specification: '0.3g×20粒/盒', unit: '盒', price: 12.6, category: '解热镇痛' },
  { name: '对乙酰氨基酚片', specification: '0.5g×16片/盒', unit: '盒', price: 8.9, category: '解热镇痛' },
  { name: '氯雷他定片', specification: '10mg×10片/盒', unit: '盒', price: 18.5, category: '抗过敏' },
  
  // 液体类
  { name: '小儿感冒糖浆', specification: '100ml/瓶', unit: '瓶', price: 15.2, category: '儿科用药' },
  { name: '复方甘草口服液', specification: '10ml×6支/盒', unit: '盒', price: 22.5, category: '呼吸系统' },
  { name: '蒲地蓝消炎口服液', specification: '10ml×12支/盒', unit: '盒', price: 35.8, category: '清热解毒' },
  
  // 注射剂类
  { name: '青霉素钠注射液', specification: '80万单位×10支/盒', unit: '盒', price: 45.0, category: '抗生素' },
  { name: '维生素C注射液', specification: '2ml:0.5g×5支/盒', unit: '盒', price: 12.5, category: '维生素' },
  
  // 外用类
  { name: '红霉素软膏', specification: '10g/支', unit: '支', price: 5.5, category: '外用药' },
  { name: '碘伏消毒液', specification: '500ml/瓶', unit: '瓶', price: 18.0, category: '消毒用品' },
  
  // 中成药
  { name: '板蓝根颗粒', specification: '10g×20袋/盒', unit: '盒', price: 16.8, category: '中成药' },
  { name: '感冒清热颗粒', specification: '12g×9袋/盒', unit: '盒', price: 18.5, category: '中成药' }
]

// ==================== 2. 工具函数 ====================

// 简化版 UnitConverter（用于生成数据）
class SimpleUnitConverter {
  static parseSpecification(spec) {
    // 格式1: 0.25g×24粒/盒
    const pattern1 = /^([\d.]+)(\w+)×(\d+)(\w+)\/(\w+)$/
    const match1 = spec.match(pattern1)
    if (match1) {
      return {
        dosage: parseFloat(match1[1]),
        dosageUnit: match1[2],
        conversionRate: parseInt(match1[3]),
        minUnit: match1[4],
        packUnit: match1[5]
      }
    }
    
    // 格式2: 100ml/瓶
    const pattern2 = /^([\d.]+)(\w+)\/(\w+)$/
    const match2 = spec.match(pattern2)
    if (match2) {
      return {
        dosage: parseFloat(match2[1]),
        dosageUnit: match2[2],
        conversionRate: 1,
        minUnit: match2[2],
        packUnit: match2[3]
      }
    }
    
    // 格式3: 10ml×6支/盒
    const pattern3 = /^([\d.]+)(\w+)×(\d+)(\w+)\/(\w+)$/
    const match3 = spec.match(pattern3)
    if (match3) {
      return {
        dosage: parseFloat(match3[1]),
        dosageUnit: match3[2],
        conversionRate: parseInt(match3[3]),
        minUnit: match3[4],
        packUnit: match3[5]
      }
    }
    
    return null
  }
}

// 生成批号
function generateBatchNo() {
  const timestamp = Date.now().toString().slice(-8)
  return `LOT${timestamp}`
}

// 生成日期
function getRandomDate(daysAgo, daysLater) {
  const now = new Date()
  const randomDays = Math.floor(Math.random() * (daysLater - daysAgo + 1)) + daysAgo
  const date = new Date(now.getTime() + randomDays * 24 * 60 * 60 * 1000)
  return date
}

// ==================== 3. 数据生成函数 ====================

/**
 * 步骤1: 添加地点配置
 */
async function addLocations() {
  console.log('📍 步骤1: 添加地点配置...')
  
  for (let location of LOCATIONS) {
    try {
      // 检查是否已存在
      const existing = await db.collection('locations')
        .where({ code: location.code })
        .count()
      
      if (existing.total === 0) {
        await db.collection('locations').add({
          data: {
            ...location,
            status: 'active',
            sort: LOCATIONS.indexOf(location),
            createTime: new Date(),
            updateTime: new Date()
          }
        })
        console.log(`✅ 添加地点: ${location.name}`)
      } else {
        console.log(`ℹ️ 地点已存在: ${location.name}`)
      }
    } catch (error) {
      console.error(`❌ 添加地点失败: ${location.name}`, error)
    }
  }
}

/**
 * 步骤2: 添加供应商
 */
async function addSuppliers() {
  console.log('🏢 步骤2: 添加供应商...')
  
  for (let supplier of SUPPLIERS) {
    try {
      const existing = await db.collection('suppliers')
        .where({ code: supplier.code })
        .count()
      
      if (existing.total === 0) {
        await db.collection('suppliers').add({
          data: {
            ...supplier,
            status: 'active',
            createTime: new Date(),
            updateTime: new Date()
          }
        })
        console.log(`✅ 添加供应商: ${supplier.name}`)
      } else {
        console.log(`ℹ️ 供应商已存在: ${supplier.name}`)
      }
    } catch (error) {
      console.error(`❌ 添加供应商失败: ${supplier.name}`, error)
    }
  }
}

/**
 * 步骤3: 添加药品档案
 */
async function addDrugs() {
  console.log('💊 步骤3: 添加药品档案...')
  
  const addedDrugs = []
  
  for (let drug of DRUGS) {
    try {
      const existing = await db.collection('drugs')
        .where({ 
          name: drug.name,
          specification: drug.specification 
        })
        .count()
      
      if (existing.total === 0) {
        const result = await db.collection('drugs').add({
          data: {
            name: drug.name,
            specification: drug.specification,
            unit: drug.unit,
            category: drug.category,
            status: 'active',
            createTime: new Date(),
            updateTime: new Date()
          }
        })
        addedDrugs.push({ _id: result._id, ...drug })
        console.log(`✅ 添加药品: ${drug.name}`)
      } else {
        // 获取已存在药品的ID
        const existingDrug = await db.collection('drugs')
          .where({ 
            name: drug.name,
            specification: drug.specification 
          })
          .get()
        addedDrugs.push({ _id: existingDrug.data[0]._id, ...drug })
        console.log(`ℹ️ 药品已存在: ${drug.name}`)
      }
    } catch (error) {
      console.error(`❌ 添加药品失败: ${drug.name}`, error)
    }
  }
  
  return addedDrugs
}

/**
 * 步骤4: 生成药库库存（包装单位）
 */
async function generateDrugStorageStock(drugs) {
  console.log('📦 步骤4: 生成药库库存（包装单位）...')
  
  for (let drug of drugs) {
    try {
      // 解析规格
      const specInfo = SimpleUnitConverter.parseSpecification(drug.specification)
      if (!specInfo) {
        console.warn(`⚠️ 无法解析规格: ${drug.name} - ${drug.specification}`)
        continue
      }
      
      // 生成2-3个批次
      const batchCount = Math.floor(Math.random() * 2) + 2
      
      for (let i = 0; i < batchCount; i++) {
        const batch = generateBatchNo()
        const productionDate = getRandomDate(-180, -30) // 30-180天前生产
        const expireDate = getRandomDate(180, 730) // 180-730天后过期
        const quantity = Math.floor(Math.random() * 50) + 10 // 10-60盒
        const pricePerPack = drug.price
        const pricePerMin = specInfo.conversionRate > 0 
          ? (pricePerPack / specInfo.conversionRate).toFixed(4)
          : pricePerPack
        
        await db.collection('stock').add({
          data: {
            drugId: drug._id,
            drugName: drug.name,
            specification: drug.specification,
            specInfo: specInfo,
            location: 'drug_storage',
            batch: batch,
            productionDate: productionDate,
            expireDate: expireDate,
            quantity: quantity,
            unit: specInfo.packUnit,
            lockQuantity: 0,
            price: pricePerPack,
            pricePerMin: parseFloat(pricePerMin),
            status: 'normal',
            createTime: new Date(),
            updateTime: new Date()
          }
        })
        
        console.log(`✅ 药库库存: ${drug.name} - 批次${batch} - ${quantity}${specInfo.packUnit}`)
      }
    } catch (error) {
      console.error(`❌ 生成药库库存失败: ${drug.name}`, error)
    }
  }
}

/**
 * 步骤5: 生成园区库存（最小单位）
 */
async function generateParkStock(drugs) {
  console.log('🏢 步骤5: 生成园区库存（最小单位）...')
  
  // 为每个园区生成部分药品的库存
  const parks = ['land_park', 'water_park']
  
  for (let park of parks) {
    // 随机选择一部分药品
    const selectedDrugs = drugs
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(drugs.length * 0.6)) // 选60%的药品
    
    for (let drug of selectedDrugs) {
      try {
        const specInfo = SimpleUnitConverter.parseSpecification(drug.specification)
        if (!specInfo) continue
        
        // 生成1-2个批次
        const batchCount = Math.floor(Math.random() * 2) + 1
        
        for (let i = 0; i < batchCount; i++) {
          const batch = generateBatchNo()
          const productionDate = getRandomDate(-150, -20)
          const expireDate = getRandomDate(200, 700)
          
          // 园区库存用最小单位
          const minQuantity = Math.floor(Math.random() * 100) + 20 // 20-120个最小单位
          const pricePerPack = drug.price
          const pricePerMin = specInfo.conversionRate > 0 
            ? (pricePerPack / specInfo.conversionRate).toFixed(4)
            : pricePerPack
          
          await db.collection('stock').add({
            data: {
              drugId: drug._id,
              drugName: drug.name,
              specification: drug.specification,
              specInfo: specInfo,
              location: park,
              batch: batch,
              productionDate: productionDate,
              expireDate: expireDate,
              quantity: minQuantity,
              unit: specInfo.minUnit,
              lockQuantity: 0,
              price: pricePerPack,
              pricePerMin: parseFloat(pricePerMin),
              status: 'normal',
              createTime: new Date(),
              updateTime: new Date()
            }
          })
          
          const parkName = park === 'land_park' ? '陆地园区' : '水上园区'
          console.log(`✅ ${parkName}库存: ${drug.name} - ${minQuantity}${specInfo.minUnit}`)
        }
      } catch (error) {
        console.error(`❌ 生成园区库存失败: ${drug.name}`, error)
      }
    }
  }
}

/**
 * 步骤6: 数据统计
 */
async function showStatistics() {
  console.log('\n📊 步骤6: 数据统计...')
  console.log('═'.repeat(50))
  
  try {
    const locationCount = await db.collection('locations').count()
    console.log(`📍 地点数量: ${locationCount.total}`)
    
    const supplierCount = await db.collection('suppliers').count()
    console.log(`🏢 供应商数量: ${supplierCount.total}`)
    
    const drugCount = await db.collection('drugs').count()
    console.log(`💊 药品数量: ${drugCount.total}`)
    
    const stockCount = await db.collection('stock').count()
    console.log(`📦 库存记录: ${stockCount.total}`)
    
    // 按地点统计
    const drugStorageStock = await db.collection('stock')
      .where({ location: 'drug_storage' })
      .count()
    console.log(`  └─ 药库: ${drugStorageStock.total} 条`)
    
    const landParkStock = await db.collection('stock')
      .where({ location: 'land_park' })
      .count()
    console.log(`  └─ 陆地园区: ${landParkStock.total} 条`)
    
    const waterParkStock = await db.collection('stock')
      .where({ location: 'water_park' })
      .count()
    console.log(`  └─ 水上园区: ${waterParkStock.total} 条`)
    
    console.log('═'.repeat(50))
  } catch (error) {
    console.error('❌ 统计失败:', error)
  }
}

// ==================== 4. 主执行函数 ====================

/**
 * 主函数 - 执行所有步骤
 */
async function generateAllTestData() {
  console.log('🚀 开始生成 v3.14 测试数据...')
  console.log('═'.repeat(50))
  
  try {
    // 步骤1: 添加地点
    await addLocations()
    console.log('')
    
    // 步骤2: 添加供应商
    await addSuppliers()
    console.log('')
    
    // 步骤3: 添加药品
    const drugs = await addDrugs()
    console.log('')
    
    // 步骤4: 生成药库库存
    await generateDrugStorageStock(drugs)
    console.log('')
    
    // 步骤5: 生成园区库存
    await generateParkStock(drugs)
    console.log('')
    
    // 步骤6: 显示统计
    await showStatistics()
    
    console.log('\n🎉 测试数据生成完成！')
    
  } catch (error) {
    console.error('❌ 生成测试数据失败:', error)
  }
}

// ==================== 5. 清空数据函数（可选）====================

/**
 * 清空所有测试数据
 */
async function clearAllTestData() {
  console.log('⚠️ 开始清空测试数据...')
  
  const confirm = await new Promise((resolve) => {
    wx.showModal({
      title: '确认清空',
      content: '此操作将删除所有测试数据，是否继续？',
      success: (res) => resolve(res.confirm)
    })
  })
  
  if (!confirm) {
    console.log('❌ 用户取消操作')
    return
  }
  
  try {
    // 删除库存
    const stockRes = await db.collection('stock').where({}).remove()
    console.log(`✅ 删除库存: ${stockRes.removed} 条`)
    
    // 不删除 drugs、suppliers、locations，因为可能有其他数据引用
    
    console.log('🎉 测试数据清空完成！')
  } catch (error) {
    console.error('❌ 清空失败:', error)
  }
}

// ==================== 6. 导出函数 ====================

module.exports = {
  generateAllTestData,
  clearAllTestData,
  addLocations,
  addSuppliers,
  addDrugs,
  generateDrugStorageStock,
  generateParkStock
}







