/**
 * 统一条形码字段名
 * 
 * 功能：
 * 1. 将 barCode（驼峰）字段迁移到 barcode（小写）字段
 * 2. 保留原 barCode 字段（兼容性）
 * 3. 统计迁移结果
 * 
 * 使用方法：
 * 1. 在微信开发者工具中打开"云开发控制台"
 * 2. 进入"数据库" → 选择环境
 * 3. 点击右上角"终端"
 * 4. 复制本脚本内容并执行
 * 
 * 注意：
 * - 本脚本会修改数据库，请先备份数据
 * - 建议先在测试环境运行
 */

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

/**
 * 主函数
 */
async function migrateBarcode() {
  console.log('========================================')
  console.log('🔄 统一条形码字段名')
  console.log('开始时间:', new Date().toLocaleString())
  console.log('========================================\n')
  
  try {
    // 1. 查询需要迁移的药品
    console.log('📋 1. 查询需要迁移的药品...')
    
    const res = await db.collection('drugs')
      .where({
        barCode: _.exists(true),
        barCode: _.neq('')
      })
      .get()
    
    console.log(`找到 ${res.data.length} 条记录需要检查\n`)
    
    if (res.data.length === 0) {
      console.log('✅ 没有需要迁移的数据')
      return
    }
    
    // 2. 分类统计
    let needMigrate = 0      // 需要迁移（barCode有值，barcode无值）
    let needSync = 0         // 需要同步（两个字段都有值但不一致）
    let alreadyMigrated = 0  // 已迁移（两个字段值相同）
    
    const toMigrate = []
    const toSync = []
    
    res.data.forEach(drug => {
      if (!drug.barcode || drug.barcode === '') {
        // barcode 字段为空，需要迁移
        needMigrate++
        toMigrate.push(drug)
      } else if (drug.barcode !== drug.barCode) {
        // 两个字段都有值但不一致，需要同步
        needSync++
        toSync.push(drug)
      } else {
        // 两个字段值相同，已迁移
        alreadyMigrated++
      }
    })
    
    console.log('📊 统计结果:')
    console.log(`  需要迁移: ${needMigrate}`)
    console.log(`  需要同步: ${needSync}`)
    console.log(`  已迁移: ${alreadyMigrated}\n`)
    
    // 3. 执行迁移
    if (needMigrate > 0) {
      console.log('🔄 2. 开始迁移...\n')
      
      let successCount = 0
      let errorCount = 0
      
      for (const drug of toMigrate) {
        try {
          await db.collection('drugs').doc(drug._id).update({
            data: {
              barcode: drug.barCode  // 复制到小写字段
            }
          })
          
          successCount++
          console.log(`✅ [${successCount}/${needMigrate}] ${drug.name || drug.drugName}`)
          console.log(`   barCode: "${drug.barCode}" → barcode: "${drug.barCode}"`)
          
        } catch (err) {
          errorCount++
          console.error(`❌ [${errorCount}] ${drug.name || drug.drugName}: ${err.message}`)
        }
      }
      
      console.log('\n迁移完成:')
      console.log(`  成功: ${successCount}`)
      console.log(`  失败: ${errorCount}\n`)
    }
    
    // 4. 处理不一致的数据
    if (needSync > 0) {
      console.log('⚠️ 3. 发现字段值不一致的数据:\n')
      
      toSync.slice(0, 5).forEach((drug, index) => {
        console.log(`  ${index + 1}. ${drug.name || drug.drugName}`)
        console.log(`     barcode: "${drug.barcode}"`)
        console.log(`     barCode: "${drug.barCode}"`)
        console.log('')
      })
      
      console.log('💡 建议：手动检查这些数据，确定正确的条形码\n')
    }
    
    // 5. 验证结果
    console.log('✅ 4. 验证结果...\n')
    
    const verifyRes = await db.collection('drugs')
      .where({
        barcode: _.exists(true),
        barcode: _.neq('')
      })
      .count()
    
    console.log(`现在有 ${verifyRes.total} 条药品有 barcode 字段（小写）`)
    
  } catch (err) {
    console.error('❌ 迁移失败:', err)
  }
  
  console.log('\n========================================')
  console.log('✅ 迁移完成')
  console.log('结束时间:', new Date().toLocaleString())
  console.log('========================================')
}

// 执行迁移
migrateBarcode()

// 导出函数供云函数调用
exports.main = migrateBarcode
