/**
 * 规格解析测试套件
 * @file utils/unitConverter.test.js
 * @description 单元测试 - UnitConverter 工具类
 */

import UnitConverter from './unitConverter.js'

/**
 * 测试用例集合
 */
const testCases = [
  // ==================== 标准格式测试 ====================
  {
    name: '标准格式 - 阿莫西林胶囊',
    spec: '0.25g×24粒/盒',
    expected: {
      rate: 24,
      minUnit: '粒',
      packUnit: '盒',
      dosage: 0.25,
      dosageUnit: 'g',
      pattern: 'standard'
    }
  },
  {
    name: '标准格式 - 布洛芬片',
    spec: '0.2g×20片/盒',
    expected: {
      rate: 20,
      minUnit: '片',
      packUnit: '盒',
      dosage: 0.2,
      dosageUnit: 'g',
      pattern: 'standard'
    }
  },
  {
    name: '标准格式 - 注射液',
    spec: '5ml×10支/盒',
    expected: {
      rate: 10,
      minUnit: '支',
      packUnit: '盒',
      dosage: 5,
      dosageUnit: 'ml',
      pattern: 'standard'
    }
  },
  {
    name: '标准格式 - 口服液',
    spec: '10ml×6瓶/盒',
    expected: {
      rate: 6,
      minUnit: '瓶',
      packUnit: '盒',
      dosage: 10,
      dosageUnit: 'ml',
      pattern: 'standard'
    }
  },
  
  // ==================== 简化格式测试（关键）====================
  {
    name: '简化格式 - 带剂量',
    spec: '0.1×12粒/盒',
    expected: {
      rate: 12,
      minUnit: '粒',
      packUnit: '盒',
      dosage: 0.1,
      dosageUnit: null,
      pattern: 'simple'
    }
  },
  {
    name: '简化格式 - 无剂量',
    spec: '24粒/盒',
    expected: {
      rate: 24,
      minUnit: '粒',
      packUnit: '盒',
      dosage: null,
      dosageUnit: null,
      pattern: 'simple'
    }
  },
  {
    name: '简化格式 - 大包装',
    spec: '100片/瓶',
    expected: {
      rate: 100,
      minUnit: '片',
      packUnit: '瓶',
      dosage: null,
      dosageUnit: null,
      pattern: 'simple'
    }
  },
  
  // ==================== 单一包装测试 ====================
  {
    name: '单一包装 - 软膏',
    spec: '20g/支',
    expected: {
      rate: 1,
      minUnit: '支',
      packUnit: '支',
      dosage: 20,
      dosageUnit: 'g',
      pattern: 'single'
    }
  },
  {
    name: '单一包装 - 口服液瓶装',
    spec: '100ml/瓶',
    expected: {
      rate: 1,
      minUnit: '瓶',
      packUnit: '瓶',
      dosage: 100,
      dosageUnit: 'ml',
      pattern: 'single'
    }
  },
  {
    name: '单一包装 - 大剂量片剂',
    spec: '500mg/片',
    expected: {
      rate: 1,
      minUnit: '片',
      packUnit: '片',
      dosage: 500,
      dosageUnit: 'mg',
      pattern: 'single'
    }
  },
  
  // ==================== 纯数量格式测试 ====================
  {
    name: '纯数量格式 - 片剂',
    spec: '100片',
    expected: {
      rate: 100,
      minUnit: '片',
      packUnit: '盒',
      dosage: null,
      dosageUnit: null,
      pattern: 'pure'
    }
  },
  {
    name: '纯数量格式 - 胶囊',
    spec: '50粒',
    expected: {
      rate: 50,
      minUnit: '粒',
      packUnit: '盒',
      dosage: null,
      dosageUnit: null,
      pattern: 'pure'
    }
  }
]

/**
 * 运行所有测试
 */
function runAllTests() {
  console.log('━'.repeat(80))
  console.log('📋 规格解析测试开始')
  console.log('━'.repeat(80))
  console.log('')
  
  let passCount = 0
  let failCount = 0
  const failedTests = []
  
  testCases.forEach((test, index) => {
    const result = UnitConverter.parseSpecification(test.spec)
    
    if (result) {
      const pass = 
        result.conversionRate === test.expected.rate &&
        result.minUnit === test.expected.minUnit &&
        result.packUnit === test.expected.packUnit &&
        result.pattern === test.expected.pattern &&
        result.dosage === test.expected.dosage &&
        result.dosageUnit === test.expected.dosageUnit
      
      if (pass) {
        console.log(`✅ 测试 ${index + 1}: ${test.name}`)
        console.log(`   规格: ${test.spec}`)
        console.log(`   转换率: ${result.conversionRate} (1${result.packUnit} = ${result.conversionRate}${result.minUnit})`)
        if (result.dosage) {
          console.log(`   剂量: ${result.dosage}${result.dosageUnit || ''}`)
        }
        console.log(`   模式: ${result.pattern}`)
        passCount++
      } else {
        console.log(`❌ 测试 ${index + 1}: ${test.name} - 解析结果不符合预期`)
        console.log(`   规格: ${test.spec}`)
        console.log(`   预期: ${JSON.stringify(test.expected)}`)
        console.log(`   实际: rate=${result.conversionRate}, minUnit=${result.minUnit}, packUnit=${result.packUnit}, pattern=${result.pattern}`)
        failCount++
        failedTests.push({ test, result })
      }
    } else {
      console.log(`❌ 测试 ${index + 1}: ${test.name} - 解析失败`)
      console.log(`   规格: ${test.spec}`)
      failCount++
      failedTests.push({ test, result: null })
    }
    console.log('─'.repeat(80))
  })
  
  console.log('')
  console.log('━'.repeat(80))
  console.log(`📊 测试结果: 通过 ${passCount}/${testCases.length}, 失败 ${failCount}/${testCases.length}`)
  if (failCount > 0) {
    console.log(`❌ 失败率: ${(failCount / testCases.length * 100).toFixed(1)}%`)
  } else {
    console.log(`✅ 成功率: 100%`)
  }
  console.log('━'.repeat(80))
  
  return { passCount, failCount, total: testCases.length, failedTests }
}

/**
 * 测试单位转换功能
 */
function testUnitConversion() {
  console.log('')
  console.log('━'.repeat(80))
  console.log('🔄 单位转换测试')
  console.log('━'.repeat(80))
  console.log('')
  
  const conversionTests = [
    {
      name: '包装→最小 (2盒×24粒)',
      packQty: 2,
      rate: 24,
      expectedMin: 48
    },
    {
      name: '包装→最小 (3盒×20片)',
      packQty: 3,
      rate: 20,
      expectedMin: 60
    },
    {
      name: '最小→包装 (48粒÷24)',
      minQty: 48,
      rate: 24,
      expectedPack: 2
    },
    {
      name: '最小→包装 (42粒÷24)',
      minQty: 42,
      rate: 24,
      expectedPack: 1.75
    }
  ]
  
  let passCount = 0
  let failCount = 0
  
  conversionTests.forEach((test, index) => {
    if (test.packQty !== undefined) {
      // 包装→最小
      const result = UnitConverter.packToMin(test.packQty, test.rate)
      const pass = result === test.expectedMin
      
      if (pass) {
        console.log(`✅ 测试 ${index + 1}: ${test.name}`)
        console.log(`   结果: ${test.packQty}盒 × ${test.rate} = ${result}粒`)
        passCount++
      } else {
        console.log(`❌ 测试 ${index + 1}: ${test.name}`)
        console.log(`   预期: ${test.expectedMin}, 实际: ${result}`)
        failCount++
      }
    } else {
      // 最小→包装
      const result = UnitConverter.minToPack(test.minQty, test.rate)
      const pass = result === test.expectedPack
      
      if (pass) {
        console.log(`✅ 测试 ${index + 1}: ${test.name}`)
        console.log(`   结果: ${test.minQty}粒 ÷ ${test.rate} = ${result}盒`)
        passCount++
      } else {
        console.log(`❌ 测试 ${index + 1}: ${test.name}`)
        console.log(`   预期: ${test.expectedPack}, 实际: ${result}`)
        failCount++
      }
    }
    console.log('─'.repeat(80))
  })
  
  console.log('')
  console.log(`📊 转换测试结果: 通过 ${passCount}/${conversionTests.length}, 失败 ${failCount}/${conversionTests.length}`)
  console.log('━'.repeat(80))
  
  return { passCount, failCount, total: conversionTests.length }
}

/**
 * 测试格式化显示功能
 */
function testFormatDisplay() {
  console.log('')
  console.log('━'.repeat(80))
  console.log('💡 格式化显示测试')
  console.log('━'.repeat(80))
  console.log('')
  
  const formatTests = [
    {
      name: '整数显示',
      quantity: 42,
      specInfo: { minUnit: '粒', packUnit: '盒', conversionRate: 24 },
      expected: '42粒 (1盒零18粒)'
    },
    {
      name: '整盒显示',
      quantity: 48,
      specInfo: { minUnit: '粒', packUnit: '盒', conversionRate: 24 },
      expected: '48粒 (2盒)'
    },
    {
      name: '不足1盒',
      quantity: 18,
      specInfo: { minUnit: '粒', packUnit: '盒', conversionRate: 24 },
      expected: '18粒 (0.75盒)'
    },
    {
      name: '大数量显示',
      quantity: 102,
      specInfo: { minUnit: '粒', packUnit: '盒', conversionRate: 24 },
      expected: '102粒 (4盒零6粒)'
    }
  ]
  
  let passCount = 0
  let failCount = 0
  
  formatTests.forEach((test, index) => {
    const result = UnitConverter.formatStockWithConversion(test.quantity, test.specInfo)
    const pass = result === test.expected
    
    if (pass) {
      console.log(`✅ 测试 ${index + 1}: ${test.name}`)
      console.log(`   输入: ${test.quantity}${test.specInfo.minUnit}`)
      console.log(`   输出: ${result}`)
      passCount++
    } else {
      console.log(`❌ 测试 ${index + 1}: ${test.name}`)
      console.log(`   预期: ${test.expected}`)
      console.log(`   实际: ${result}`)
      failCount++
    }
    console.log('─'.repeat(80))
  })
  
  console.log('')
  console.log(`📊 格式化测试结果: 通过 ${passCount}/${formatTests.length}, 失败 ${failCount}/${formatTests.length}`)
  console.log('━'.repeat(80))
  
  return { passCount, failCount, total: formatTests.length }
}

/**
 * 测试批量解析功能
 */
function testBatchParse() {
  console.log('')
  console.log('━'.repeat(80))
  console.log('📦 批量解析测试')
  console.log('━'.repeat(80))
  console.log('')
  
  const specs = [
    '0.25g×24粒/盒',
    '0.2g×20片/盒',
    '5ml×10支/盒',
    '0.1×12粒/盒',
    '24粒/盒',
    '20g/支',
    '100片',
    '无效规格XXX'
  ]
  
  const results = UnitConverter.batchParse(specs)
  
  console.log(`📊 批量解析统计:`)
  console.log(`   总计: ${results.stats.total}`)
  console.log(`   成功: ${results.stats.successCount} ✅`)
  console.log(`   失败: ${results.stats.failedCount} ❌`)
  console.log('')
  
  if (results.failed.length > 0) {
    console.log(`❌ 解析失败的规格:`)
    results.failed.forEach(spec => {
      console.log(`   - ${spec}`)
    })
  }
  
  console.log('━'.repeat(80))
  
  return results
}

/**
 * 主测试入口
 */
function main() {
  console.log('\n')
  console.log('╔═══════════════════════════════════════════════════════════════╗')
  console.log('║         UnitConverter 工具类完整测试套件 v3.14              ║')
  console.log('╚═══════════════════════════════════════════════════════════════╝')
  console.log('\n')
  
  // 1. 规格解析测试
  const parseResults = runAllTests()
  
  // 2. 单位转换测试
  const conversionResults = testUnitConversion()
  
  // 3. 格式化显示测试
  const formatResults = testFormatDisplay()
  
  // 4. 批量解析测试
  const batchResults = testBatchParse()
  
  // 总结
  console.log('')
  console.log('╔═══════════════════════════════════════════════════════════════╗')
  console.log('║                        测试总结                               ║')
  console.log('╚═══════════════════════════════════════════════════════════════╝')
  console.log('')
  console.log(`📋 规格解析: ${parseResults.passCount}/${parseResults.total} 通过`)
  console.log(`🔄 单位转换: ${conversionResults.passCount}/${conversionResults.total} 通过`)
  console.log(`💡 格式化显示: ${formatResults.passCount}/${formatResults.total} 通过`)
  console.log(`📦 批量解析: ${batchResults.stats.successCount}/${batchResults.stats.total} 成功`)
  console.log('')
  
  const totalPass = parseResults.passCount + conversionResults.passCount + formatResults.passCount
  const totalTests = parseResults.total + conversionResults.total + formatResults.total
  const successRate = (totalPass / totalTests * 100).toFixed(1)
  
  if (totalPass === totalTests) {
    console.log(`🎉 所有测试通过！成功率: ${successRate}%`)
  } else {
    console.log(`⚠️ 部分测试失败，成功率: ${successRate}%`)
  }
  console.log('')
  console.log('━'.repeat(80))
  
  return {
    parseResults,
    conversionResults,
    formatResults,
    batchResults,
    totalPass,
    totalTests,
    successRate
  }
}

// 导出测试函数
export default {
  runAllTests,
  testUnitConversion,
  testFormatDisplay,
  testBatchParse,
  main
}

// 如果直接运行此文件，执行测试
if (typeof process !== 'undefined' && process.argv && process.argv[1] === import.meta.url) {
  main()
}







