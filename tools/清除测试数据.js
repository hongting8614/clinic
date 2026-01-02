/**
 * 清除测试数据脚本
 * 
 * 功能：清除库存、出库记录、诊断记录等测试数据
 * 使用方法：在微信开发者工具控制台中执行
 * 
 * ⚠️ 警告：此操作不可逆，请谨慎使用！
 * 建议：在清除前先备份数据
 */

(async function clearTestData() {
  const db = wx.cloud.database()
  const _ = db.command
  
  console.log('🚀 开始清除测试数据...')
  console.log('⚠️ 警告：此操作不可逆！')
  
  try {
    // 1. 清除库存数据（stock 集合）
    console.log('\n📦 1. 清除库存数据...')
    const stockRes = await db.collection('stock').where({
      _id: _.exists(true)  // 匹配所有记录
    }).remove()
    console.log(`✅ 已清除 ${stockRes.stats.removed} 条库存记录`)
    
    // 2. 清除出库记录（outRecords 集合）
    console.log('\n📤 2. 清除出库记录...')
    const outRes = await db.collection('outRecords').where({
      _id: _.exists(true)
    }).remove()
    console.log(`✅ 已清除 ${outRes.stats.removed} 条出库记录`)
    
    // 3. 清除入库记录（inRecords 集合）
    console.log('\n📥 3. 清除入库记录...')
    const inRes = await db.collection('inRecords').where({
      _id: _.exists(true)
    }).remove()
    console.log(`✅ 已清除 ${inRes.stats.removed} 条入库记录`)
    
    // 4. 清除诊断记录（clinicRecords 集合）
    console.log('\n🏥 4. 清除诊断记录...')
    const clinicRes = await db.collection('clinicRecords').where({
      _id: _.exists(true)
    }).remove()
    console.log(`✅ 已清除 ${clinicRes.stats.removed} 条诊断记录`)
    
    // 5. 清除处方记录（prescriptions 集合）
    console.log('\n💊 5. 清除处方记录...')
    const prescriptionRes = await db.collection('prescriptions').where({
      _id: _.exists(true)
    }).remove()
    console.log(`✅ 已清除 ${prescriptionRes.stats.removed} 条处方记录`)
    
    // 6. 可选：清除药品数据（如果需要）
    // 注意：通常不建议清除药品基础数据，只清除库存和记录
    // 如果需要清除药品，请取消下面的注释
    /*
    console.log('\n💊 6. 清除药品数据...')
    const drugRes = await db.collection('drugs').where({
      _id: _.exists(true)
    }).remove()
    console.log(`✅ 已清除 ${drugRes.stats.removed} 条药品记录`)
    */
    
    console.log('\n✅ 测试数据清除完成！')
    console.log('\n📊 清除统计：')
    console.log(`  - 库存记录：${stockRes.stats.removed} 条`)
    console.log(`  - 出库记录：${outRes.stats.removed} 条`)
    console.log(`  - 入库记录：${inRes.stats.removed} 条`)
    console.log(`  - 诊断记录：${clinicRes.stats.removed} 条`)
    console.log(`  - 处方记录：${prescriptionRes.stats.removed} 条`)
    console.log('\n🎉 数据库已清理干净！')
    
  } catch (err) {
    console.error('❌ 清除数据失败:', err)
    console.error('错误详情:', err.message)
  }
})()
