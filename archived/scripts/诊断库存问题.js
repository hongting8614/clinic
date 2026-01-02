/**
 * 库存问题诊断脚本
 * 使用方法：
 * 1. 在微信开发者工具中打开【云开发控制台】
 * 2. 进入【数据库】
 * 3. 点击【集合】旁边的【...】按钮
 * 4. 选择【导入数据】或在控制台中执行查询
 */

// ============================================
// 方法1：在云开发控制台的数据库中执行以下查询
// ============================================

// 1. 查询所有包含"���洛芬"的药品档案
db.collection('drugs').where({
  name: db.RegExp({
    regexp: '布洛芬',
    options: 'i'
  })
}).get()

// 2. 查询所有包含"布洛芬"的库存记录
db.collection('stock').where({
  drugName: db.RegExp({
    regexp: '布洛芬',
    options: 'i'
  })
}).get()

// 3. 查询陆园的所有库存
db.collection('stock').where({
  location: 'land_park',
  quantity: db.command.gt(0)
}).get()

// 4. 查询水园的所有库存
db.collection('stock').where({
  location: 'water_park',
  quantity: db.command.gt(0)
}).get()

// ============================================
// 方法2：创建临时云函数来诊断
// ============================================

/**
 * 将以下代码保存为云函数 debugStock/index.js
 * 然后在小程序中调用
 */

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    console.log('===== 开始诊断库存问题 =====')
    
    // 1. 查询布洛芬药品档案
    const drugsRes = await db.collection('drugs')
      .where({
        name: db.RegExp({
          regexp: '布洛芬',
          options: 'i'
        })
      })
      .get()
    
    console.log('📦 药品档案查询结果:')
    console.log('  - 找到药品数量:', drugsRes.data.length)
    drugsRes.data.forEach((drug, i) => {
      console.log(`  - 药品${i + 1}:`, {
        _id: drug._id,
        name: drug.name,
        specification: drug.specification
      })
    })
    
    // 2. 查询布洛芬库存记录
    const stockRes = await db.collection('stock')
      .where({
        drugName: db.RegExp({
          regexp: '布洛芬',
          options: 'i'
        })
      })
      .get()
    
    console.log('\n📊 库存记录查询结果:')
    console.log('  - 找到库存记录数量:', stockRes.data.length)
    stockRes.data.forEach((stock, i) => {
      console.log(`  - 库存${i + 1}:`, {
        _id: stock._id,
        drugId: stock.drugId,
        drugName: stock.drugName,
        location: stock.location,
        quantity: stock.quantity,
        batch: stock.batch
      })
    })
    
    // 3. 检查每个药品在各园区的库存
    const results = []
    for (const drug of drugsRes.data) {
      // 陆园库存
      const landStock = await db.collection('stock')
        .where({
          drugId: drug._id,
          location: 'land_park',
          quantity: _.gt(0)
        })
        .get()
      
      // 水园库存
      const waterStock = await db.collection('stock')
        .where({
          drugId: drug._id,
          location: 'water_park',
          quantity: _.gt(0)
        })
        .get()
      
      results.push({
        drugId: drug._id,
        drugName: drug.name,
        landParkStock: landStock.data.length > 0 ? landStock.data.reduce((sum, s) => sum + s.quantity, 0) : 0,
        waterParkStock: waterStock.data.length > 0 ? waterStock.data.reduce((sum, s) => sum + s.quantity, 0) : 0,
        landParkBatches: landStock.data.length,
        waterParkBatches: waterStock.data.length
      })
    }
    
    console.log('\n📈 各园区库存汇总:')
    results.forEach(r => {
      console.log(`  - ${r.drugName}:`)
      console.log(`    陆园: ${r.landParkStock} (${r.landParkBatches}个批次)`)
      console.log(`    水园: ${r.waterParkStock} (${r.waterParkBatches}个批次)`)
    })
    
    return {
      success: true,
      data: {
        drugs: drugsRes.data,
        stocks: stockRes.data,
        summary: results
      }
    }
  } catch (err) {
    console.error('诊断失败:', err)
    return {
      success: false,
      message: err.message
    }
  }
}

// ============================================
// 方法3：在小程序页面中直接查询
// ============================================

/**
 * 在小程序的某个页面（如 pages/index/index.vue）的 methods 中添加：
 */

async debugStock() {
  try {
    uni.showLoading({ title: '诊断中...' })
    
    // 查询药品档案
    const db = wx.cloud.database()
    const drugsRes = await db.collection('drugs')
      .where({
        name: db.RegExp({
          regexp: '布洛芬',
          options: 'i'
        })
      })
      .get()
    
    console.log('📦 药品档案:', drugsRes.data)
    
    // 查询库存
    const stockRes = await db.collection('stock')
      .where({
        drugName: db.RegExp({
          regexp: '布洛芬',
          options: 'i'
        })
      })
      .get()
    
    console.log('📊 库存记录:', stockRes.data)
    
    uni.hideLoading()
    
    uni.showModal({
      title: '诊断结果',
      content: `找到${drugsRes.data.length}个药品，${stockRes.data.length}条库存记录`,
      showCancel: false
    })
  } catch (err) {
    console.error('诊断失败:', err)
    uni.hideLoading()
    uni.showToast({
      title: '诊断失败',
      icon: 'none'
    })
  }
}

// ============================================
// 常见问题和解决方案
// ============================================

/**
 * 问题1：找不到药品
 * 解决：检查 drugs 集合中是否有"布洛芬缓释胶囊(母必得)"这个药品
 * 
 * 问题2：找到药品但没有库存
 * 解决：需要先入库该药品到对应园区
 * 
 * 问题3：有库存但 drugId 不匹配
 * 解决：检查 stock 表中的 drugId 是否与 drugs 表中的 _id 一致
 * 
 * 问题4：location 字段不匹配
 * 解决：确保 stock 表中的 location 字段值为 'land_park' 或 'water_park'
 */










