/**
 * 条形码字段迁移脚本
 * 
 * 功能：将 barCode（驼峰）字段迁移到 barcode（小写）字段
 * 
 * 使用场景：
 * - 数据库中存在 barCode 字段，但查询使用 barcode 字段
 * - 需要统一字段命名规范
 * 
 * 使用方法：
 * 1. 在微信开发者工具中打开"云开发控制台"
 * 2. 进入"数据库" → 选择环境
 * 3. 点击右上角"终端"
 * 4. 复制本脚本内容并执行
 * 
 * 注意事项：
 * - 本脚本会保留原 barCode 字段（不删除）
 * - 如果 barcode 字段已存在且不为空，不会覆盖
 * - 建议先备份数据库
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
async function migrate() {
  console.log('========================================')
  console.log('🔄 条形码字段迁移工具')
  console.log('开始时间:', new Date().toLocaleString())
  console.log('========================================\n')
  
  try {
    // 1. 统计需要迁移的数据
    console.log('📊 1. 统计需要迁移的数据...')
    const countRes = await db.collection('drugs')
      .where({
        barCode: _.exists(true),
        barCode: _.neq('')
      })
      .count()
    
    const totalCount = countRes.total
    console.log(`找到 ${totalCount} 条有 barCode 字段的记录\n`)
    
    if (totalCount === 0) {
      console.log('✅ 没有需要迁移的数据')
      return
    }
    
    // 2. 确认是否继续
    console.log('⚠️ 即将开始迁移，请确认：')
    console.log('   - 已备份数据库')
    console.log('   - 了解迁移规则（不覆盖已有 barcode 字段）')
    console.log('')
    
    // 3. 分批查询并迁移
    console.log('🔄 2. 开始迁移...\n')
    
    let migratedCount = 0
    let skippedCount = 0
    let errorCount = 0
    const batchSize = 20
    let skip = 0
    
    while (skip < totalCount) {
      // 分批查询
      const res = await db.collection('drugs')
        .where({
          barCode: _.exists(true),
          barCode: _.neq('')
        })
        .skip(skip)
        .limit(batchSize)
        .get()
      
      // 处理每条记录
      for (const drug of res.data) {
        try {
          // 检查是否已有 barcode 字段
          if (drug.barcode && drug.barcode.trim() !== '') {
            // 已有 barcode 字段，检查是否一致
            if (drug.barcode === drug.barCode) {
              console.log(`⏭️  跳过: ${drug.name} (barcode 字段已存在且一致)`)
              skippedCount++
            } else {
              console.log(`⚠️  冲突: ${drug.name}`)
              console.log(`   barcode: ${drug.barcode}`)
              console.log(`   barCode: ${drug.barCode}`)
              console.log(`   → 保留 barcode 字段，不覆盖`)
              skippedCount++
            }
            continue
          }
          
          // 迁移：将 barCode 复制到 barcode
          await db.collection('drugs').doc(drug._id).update({
            data: {
              barcode: drug.barCode
            }
          })
          
          console.log(`✅ 迁移: ${drug.name}`)
          console.log(`   barCode: ${drug.barCode} → barcode: ${drug.barCode}`)
          migratedCount++
          
        } catch (err) {
          console.error(`❌ 失败: ${drug.name}`)
          console.error(`   错误: ${err.message}`)
          errorCount++
        }
      }
      
      skip += batchSize
      
      // 显示进度
      const progress = Math.min(skip, totalCount)
      console.log(`\n进度: ${progress}/${totalCount} (${(progress/totalCount*100).toFixed(1)}%)\n`)
    }
    
    // 4. 显示结果
    console.log('\n========================================')
    console.log('✅ 迁移完成')
    console.log('========================================')
    console.log(`总记录数: ${totalCount}`)
    console.log(`成功迁移: ${migratedCount}`)
    console.log(`跳过: ${skippedCount}`)
    console.log(`失败: ${errorCount}`)
    console.log('========================================')
    
    // 5. 验证结果
    console.log('\n📊 3. 验证迁移结果...\n')
    
    const verifyRes = await db.collection('drugs')
      .where({
        barcode: _.exists(true),
        barcode: _.neq('')
      })
      .count()
    
    console.log(`迁移后有 barcode 字段的记录: ${verifyRes.total}`)
    
    if (verifyRes.total >= totalCount) {
      console.log('✅ 验证通过：所有记录已成功迁移')
    } else {
      console.log('⚠️ 验证失败：部分记录未成功迁移')
      console.log('   请检查错误日志')
    }
    
  } catch (err) {
    console.error('\n❌ 迁移失败:', err)
    console.error('错误详情:', err.message)
  }
  
  console.log('\n========================================')
  console.log('结束时间:', new Date().toLocaleString())
  console.log('========================================')
}

// 执行迁移
migrate()

// 导出函数供云函数调用
exports.main = migrate
