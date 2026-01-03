/**
 * 条形码清洗脚本
 * 
 * 功能：清洗数据库中的条形码，去除空格、特殊字符
 * 
 * 清洗规则：
 * 1. 去除首尾空格
 * 2. 去除所有空格
 * 3. 去除换行符
 * 4. 去除制表符
 * 5. 只保留数字
 * 
 * 使用方法：
 * 1. 在微信开发者工具中打开"云开发控制台"
 * 2. 进入"数据库" → 选择环境
 * 3. 点击右上角"终端"
 * 4. 复制本脚本内容并执行
 * 
 * 注意事项：
 * - 本脚本会直接修改数据库
 * - 建议先备份数据库
 * - 清洗后的条形码必须是8-14位数字
 */

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

/**
 * 清洗条形码
 */
function cleanBarcode(barcode) {
  if (!barcode) return null
  
  // 1. 转为字符串
  let cleaned = String(barcode)
  
  // 2. 去除首尾空格
  cleaned = cleaned.trim()
  
  // 3. 去除所有空格
  cleaned = cleaned.replace(/\s/g, '')
  
  // 4. 去除换行符
  cleaned = cleaned.replace(/[\r\n]/g, '')
  
  // 5. 去除制表符
  cleaned = cleaned.replace(/\t/g, '')
  
  // 6. 只保留数字
  cleaned = cleaned.replace(/\D/g, '')
  
  // 7. 验证长度（8-14位）
  if (cleaned.length < 8 || cleaned.length > 14) {
    return null
  }
  
  return cleaned
}

/**
 * 主函数
 */
async function clean() {
  console.log('========================================')
  console.log('🧹 条形码清洗工具')
  console.log('开始时间:', new Date().toLocaleString())
  console.log('========================================\n')
  
  try {
    // 1. 统计需要清洗的数据
    console.log('📊 1. 统计需要清洗的数据...')
    
    const totalRes = await db.collection('drugs')
      .where(_.or([
        { barcode: _.exists(true) },
        { barCode: _.exists(true) }
      ]))
      .count()
    
    const totalCount = totalRes.total
    console.log(`找到 ${totalCount} 条有条形码的记录\n`)
    
    if (totalCount === 0) {
      console.log('✅ 没有需要清洗的数据')
      return
    }
    
    // 2. 分批查询并清洗
    console.log('🧹 2. 开始清洗...\n')
    
    let cleanedCount = 0
    let skippedCount = 0
    let invalidCount = 0
    let errorCount = 0
    const batchSize = 20
    let skip = 0
    
    const cleanedBarcodes = []
    const invalidBarcodes = []
    
    while (skip < totalCount) {
      // 分批查询
      const res = await db.collection('drugs')
        .where(_.or([
          { barcode: _.exists(true) },
          { barCode: _.exists(true) }
        ]))
        .skip(skip)
        .limit(batchSize)
        .get()
      
      // 处理每条记录
      for (const drug of res.data) {
        try {
          // 获取条形码（优先使用 barcode）
          const originalBarcode = drug.barcode || drug.barCode
          
          if (!originalBarcode) {
            skippedCount++
            continue
          }
          
          // 清洗条形码
          const cleanedBarcode = cleanBarcode(originalBarcode)
          
          // 检查清洗结果
          if (!cleanedBarcode) {
            console.log(`⚠️  无效: ${drug.name}`)
            console.log(`   原条形码: "${originalBarcode}"`)
            console.log(`   原因: 清洗后长度不符合要求（8-14位）`)
            invalidCount++
            invalidBarcodes.push({
              name: drug.name,
              original: originalBarcode,
              reason: '长度不符合要求'
            })
            continue
          }
          
          // 检查是否需要更新
          if (cleanedBarcode === originalBarcode) {
            // 不需要清洗
            skippedCount++
            continue
          }
          
          // 更新数据库
          const updateData = {}
          
          // 如果有 barcode 字段，更新它
          if (drug.barcode) {
            updateData.barcode = cleanedBarcode
          }
          
          // 如果有 barCode 字段，也更新它（保持一致）
          if (drug.barCode) {
            updateData.barCode = cleanedBarcode
          }
          
          await db.collection('drugs').doc(drug._id).update({
            data: updateData
          })
          
          console.log(`✅ 清洗: ${drug.name}`)
          console.log(`   原条形码: "${originalBarcode}"`)
          console.log(`   新条形码: "${cleanedBarcode}"`)
          cleanedCount++
          
          cleanedBarcodes.push({
            name: drug.name,
            original: originalBarcode,
            cleaned: cleanedBarcode
          })
          
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
    
    // 3. 显示结果
    console.log('\n========================================')
    console.log('✅ 清洗完成')
    console.log('========================================')
    console.log(`总记录数: ${totalCount}`)
    console.log(`成功清洗: ${cleanedCount}`)
    console.log(`跳过（无需清洗）: ${skippedCount}`)
    console.log(`无效（无法清洗）: ${invalidCount}`)
    console.log(`失败: ${errorCount}`)
    console.log('========================================')
    
    // 4. 显示清洗详情
    if (cleanedBarcodes.length > 0) {
      console.log('\n📋 清洗详情（前10条）:')
      cleanedBarcodes.slice(0, 10).forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.name}`)
        console.log(`   原: "${item.original}"`)
        console.log(`   新: "${item.cleaned}"`)
      })
    }
    
    // 5. 显示无效条形码
    if (invalidBarcodes.length > 0) {
      console.log('\n⚠️ 无效条形码（前10条）:')
      invalidBarcodes.slice(0, 10).forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.name}`)
        console.log(`   条形码: "${item.original}"`)
        console.log(`   原因: ${item.reason}`)
      })
      console.log('\n💡 建议：手动检查这些药品的条形码是否正确')
    }
    
  } catch (err) {
    console.error('\n❌ 清洗失败:', err)
    console.error('错误详情:', err.message)
  }
  
  console.log('\n========================================')
  console.log('结束时间:', new Date().toLocaleString())
  console.log('========================================')
}

// 执行清洗
clean()

// 导出函数供云函数调用
exports.main = clean
