/**
 * 扫码问题诊断工具
 * 
 * 功能：
 * 1. 检查数据库中的条形码字段
 * 2. 统计字段使用情况
 * 3. 查找问题数据
 * 4. 提供修复建议
 * 
 * 使用方法：
 * 1. 在微信开发者工具中打开"云开发控制台"
 * 2. 进入"数据库" → 选择环境
 * 3. 点击右上角"终端"
 * 4. 复制本脚本内容并执行
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
async function diagnose() {
  console.log('========================================')
  console.log('🔍 扫码问题诊断工具')
  console.log('开始时间:', new Date().toLocaleString())
  console.log('========================================\n')
  
  try {
    // 1. 统计字段使用情况
    await checkFieldUsage()
    
    // 2. 检查条形码格式
    await checkBarcodeFormat()
    
    // 3. 查找重复条形码
    await checkDuplicateBarcodes()
    
    // 4. 检查索引
    await checkIndexes()
    
    // 5. 提供修复建议
    provideSuggestions()
    
  } catch (err) {
    console.error('❌ 诊断失败:', err)
  }
  
  console.log('\n========================================')
  console.log('✅ 诊断完成')
  console.log('结束时间:', new Date().toLocaleString())
  console.log('========================================')
}

/**
 * 1. 统计字段使用情况
 */
async function checkFieldUsage() {
  console.log('📊 1. 统计字段使用情况')
  console.log('----------------------------------------')
  
  try {
    // 总药品数
    const totalRes = await db.collection('drugs').count()
    const total = totalRes.total
    
    // 有 barcode 字段的药品
    const barcodeRes = await db.collection('drugs')
      .where({
        barcode: _.exists(true),
        barcode: _.neq('')
      })
      .count()
    const barcodeCount = barcodeRes.total
    
    // 有 barCode 字段的药品
    const barCodeRes = await db.collection('drugs')
      .where({
        barCode: _.exists(true),
        barCode: _.neq('')
      })
      .count()
    const barCodeCount = barCodeRes.total
    
    // 两个字段都有的药品
    const bothRes = await db.collection('drugs')
      .where({
        barcode: _.exists(true),
        barCode: _.exists(true),
        barcode: _.neq(''),
        barCode: _.neq('')
      })
      .count()
    const bothCount = bothRes.total
    
    // 没有条形码的药品
    const noBarcode = total - Math.max(barcodeCount, barCodeCount)
    
    console.log(`总药品数: ${total}`)
    console.log(`有 barcode 字段: ${barcodeCount} (${(barcodeCount/total*100).toFixed(1)}%)`)
    console.log(`有 barCode 字段: ${barCodeCount} (${(barCodeCount/total*100).toFixed(1)}%)`)
    console.log(`两个字段都有: ${bothCount} (${(bothCount/total*100).toFixed(1)}%)`)
    console.log(`没有条形码: ${noBarcode} (${(noBarcode/total*100).toFixed(1)}%)`)
    
    // 判断问题
    if (barCodeCount > 0 && barcodeCount === 0) {
      console.log('\n⚠️ 问题：所有条形码都在 barCode 字段（驼峰）')
      console.log('💡 建议：运行字段迁移脚本')
    } else if (bothCount > 0 && bothCount < total) {
      console.log('\n⚠️ 问题：字段名不统一，部分用 barcode，部分用 barCode')
      console.log('💡 建议：运行字段统一脚本')
    } else if (barcodeCount > 0 && barCodeCount === 0) {
      console.log('\n✅ 正常：所有条形码都在 barcode 字段（小写）')
    }
    
    console.log('')
    
  } catch (err) {
    console.error('❌ 统计失败:', err.message)
  }
}

/**
 * 2. 检查条形码格式
 */
async function checkBarcodeFormat() {
  console.log('📋 2. 检查条形码格式')
  console.log('----------------------------------------')
  
  try {
    // 查询所有有条形码的药品（限制100条）
    const res = await db.collection('drugs')
      .where(_.or([
        { barcode: _.exists(true) },
        { barCode: _.exists(true) }
      ]))
      .field({
        name: true,
        barcode: true,
        barCode: true
      })
      .limit(100)
      .get()
    
    let validCount = 0
    let invalidCount = 0
    let hasSpaceCount = 0
    let tooShortCount = 0
    let tooLongCount = 0
    
    const invalidBarcodes = []
    
    res.data.forEach(drug => {
      const barcode = drug.barcode || drug.barCode
      
      if (!barcode) return
      
      // 检查是否包含空格
      if (/\s/.test(barcode)) {
        hasSpaceCount++
        invalidBarcodes.push({
          name: drug.name,
          barcode: barcode,
          issue: '包含空格'
        })
        return
      }
      
      // 检查长度
      if (barcode.length < 8) {
        tooShortCount++
        invalidBarcodes.push({
          name: drug.name,
          barcode: barcode,
          issue: '长度不足8位'
        })
        return
      }
      
      if (barcode.length > 14) {
        tooLongCount++
        invalidBarcodes.push({
          name: drug.name,
          barcode: barcode,
          issue: '长度超过14位'
        })
        return
      }
      
      // 检查是否全是数字
      if (!/^\d+$/.test(barcode)) {
        invalidCount++
        invalidBarcodes.push({
          name: drug.name,
          barcode: barcode,
          issue: '包含非数字字符'
        })
        return
      }
      
      validCount++
    })
    
    console.log(`检查样本数: ${res.data.length}`)
    console.log(`格式正确: ${validCount}`)
    console.log(`格式错误: ${invalidCount + hasSpaceCount + tooShortCount + tooLongCount}`)
    
    if (hasSpaceCount > 0) {
      console.log(`  - 包含空格: ${hasSpaceCount}`)
    }
    if (tooShortCount > 0) {
      console.log(`  - 长度不足: ${tooShortCount}`)
    }
    if (tooLongCount > 0) {
      console.log(`  - 长度过长: ${tooLongCount}`)
    }
    if (invalidCount > 0) {
      console.log(`  - 包含非数字: ${invalidCount}`)
    }
    
    // 显示前5个问题条形码
    if (invalidBarcodes.length > 0) {
      console.log('\n⚠️ 问题条形码示例（前5个）:')
      invalidBarcodes.slice(0, 5).forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.name}`)
        console.log(`     条形码: "${item.barcode}"`)
        console.log(`     问题: ${item.issue}`)
      })
      console.log('\n💡 建议：运行条形码清洗脚本')
    } else {
      console.log('\n✅ 所有条形码格式正确')
    }
    
    console.log('')
    
  } catch (err) {
    console.error('❌ 检查失败:', err.message)
  }
}

/**
 * 3. 查找重复条形码
 */
async function checkDuplicateBarcodes() {
  console.log('🔄 3. 查找重复条形码')
  console.log('----------------------------------------')
  
  try {
    // 查询所有条形码
    const res = await db.collection('drugs')
      .field({
        name: true,
        barcode: true,
        barCode: true
      })
      .get()
    
    // 统计条形码出现次数
    const barcodeMap = new Map()
    
    res.data.forEach(drug => {
      const barcode = drug.barcode || drug.barCode
      if (!barcode) return
      
      if (!barcodeMap.has(barcode)) {
        barcodeMap.set(barcode, [])
      }
      barcodeMap.get(barcode).push(drug.name)
    })
    
    // 找出重复的条形码
    const duplicates = []
    barcodeMap.forEach((names, barcode) => {
      if (names.length > 1) {
        duplicates.push({ barcode, names })
      }
    })
    
    if (duplicates.length > 0) {
      console.log(`⚠️ 发现 ${duplicates.length} 个重复的条形码:\n`)
      duplicates.slice(0, 5).forEach((item, index) => {
        console.log(`  ${index + 1}. 条形码: ${item.barcode}`)
        console.log(`     使用该条形码的药品:`)
        item.names.forEach(name => {
          console.log(`       - ${name}`)
        })
        console.log('')
      })
      console.log('💡 建议：检查这些药品是否为同一药品，或修改条形码')
    } else {
      console.log('✅ 没有重复的条形码')
    }
    
    console.log('')
    
  } catch (err) {
    console.error('❌ 检查失败:', err.message)
  }
}

/**
 * 4. 检查索引
 */
async function checkIndexes() {
  console.log('📑 4. 检查数据库索引')
  console.log('----------------------------------------')
  
  console.log('⚠️ 注意：索引检查需要在云开发控制台手动查看')
  console.log('')
  console.log('操作步骤：')
  console.log('1. 打开云开发控制台')
  console.log('2. 进入"数据库" → "drugs" 集合')
  console.log('3. 点击"索引管理"')
  console.log('4. 检查是否有以下索引：')
  console.log('   - barcode (升序)')
  console.log('   - barCode (升序，如果还在使用)')
  console.log('')
  console.log('💡 如果没有索引，请添加以提高查询速度')
  console.log('')
}

/**
 * 5. 提供修复建议
 */
function provideSuggestions() {
  console.log('💡 5. 修复建议')
  console.log('----------------------------------------')
  console.log('')
  console.log('根据诊断结果，建议按以下顺序执行：')
  console.log('')
  console.log('1️⃣ 如果字段名不统一（barcode vs barCode）：')
  console.log('   → 运行脚本：迁移条形码字段.js')
  console.log('')
  console.log('2️⃣ 如果条形码格式有问题（空格、长度等）：')
  console.log('   → 运行脚本：清洗条形码.js')
  console.log('')
  console.log('3️⃣ 如果有重复条形码：')
  console.log('   → 手动检查并修正')
  console.log('')
  console.log('4️⃣ 创建数据库索引：')
  console.log('   → 在云开发控制台手动创建')
  console.log('')
  console.log('5️⃣ 测试扫码功能：')
  console.log('   → 扫描已知条形码，查看控制台日志')
  console.log('')
}

// 执行诊断
diagnose()

// 导出函数供云函数调用
exports.main = diagnose
