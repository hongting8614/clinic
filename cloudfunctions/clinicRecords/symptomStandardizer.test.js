// cloudfunctions/clinicRecords/symptomStandardizer.test.js
// 症状标准化算法测试文件

const {
  standardizeComplaint,
  suggestHvDiseases,
  assessTriage
} = require('./symptomStandardizer.js');

// 测试用例集
const testCases = [
  {
    name: '测试1: 关节扭伤 - 完整描述',
    complaint: '走路时扭伤踝关节，局部肿胀疼痛，活动受限',
    expectedDisease: 'TR-02',
    expectedSymptoms: ['TR201', 'TR301', 'TR302', 'MS201']
  },
  {
    name: '测试2: 关节扭伤 - 简短描述',
    complaint: '崴脚了，脚踝肿了很痛',
    expectedDisease: 'TR-02',
    expectedSymptoms: ['TR201', 'TR301']
  },
  {
    name: '测试3: 旋转项目后眩晕',
    complaint: '坐旋转项目后头晕恶心想吐',
    expectedDisease: 'VR-01',
    expectedSymptoms: ['VRA102']
  },
  {
    name: '测试4: 轻度中暑',
    complaint: '太阳下排队后头晕口渴乏力',
    expectedDisease: 'EN-01',
    expectedSymptoms: ['EN101']
  },
  {
    name: '测试5: 急性胃肠炎',
    complaint: '吃坏肚子后呕吐腹泻腹痛',
    expectedDisease: 'GI-01',
    expectedSymptoms: ['GI202']
  },
  {
    name: '测试6: 低血糖',
    complaint: '游玩久了心慌出汗饿',
    expectedDisease: 'MT-01',
    expectedSymptoms: ['MT101']
  },
  {
    name: '测试7: 皮肤擦伤',
    complaint: '摔倒后膝盖擦伤，皮肤破损疼痛',
    expectedDisease: 'TR-01',
    expectedSymptoms: ['SK104']
  },
  {
    name: '测试8: 过度换气综合征',
    complaint: '紧张后呼吸急促手脚发麻',
    expectedDisease: 'PS-02',
    expectedSymptoms: ['PS202']
  },
  {
    name: '测试9: 轻度痛经',
    complaint: '来月经肚子隐痛、腰酸',
    expectedDisease: 'GY-01',
    expectedSymptoms: ['GY101']
  },
  {
    name: '测试10: 晒伤',
    complaint: '晒伤后皮肤发红疼痛灼热',
    expectedDisease: 'EN-03',
    expectedSymptoms: ['EN103']
  },
  {
    name: '测试11: 短词误匹配测试 - "痛"',
    complaint: '痛',
    expectedDisease: null, // 应该匹配度很低或无法确定
    expectedSymptoms: []
  },
  {
    name: '测试12: 复杂症状组合',
    complaint: '玩过山车后头晕站不稳，心慌出冷汗，想吐',
    expectedDisease: 'VR-01',
    expectedSymptoms: ['VRA101', 'CV101', 'GI101']
  }
];

// 运行测试
function runTests() {
  console.log('========================================');
  console.log('症状标准化算法优化测试');
  console.log('========================================\n');

  let passCount = 0;
  let failCount = 0;

  testCases.forEach((testCase, index) => {
    console.log(`\n【${testCase.name}】`);
    console.log(`主诉: "${testCase.complaint}"`);
    console.log('---');

    // 步骤1: 症状标准化
    const symptomResult = standardizeComplaint(testCase.complaint);
    console.log(`识别到的症状编码: ${symptomResult.symptomCodes.join(', ') || '无'}`);
    console.log(`症状详情:`);
    symptomResult.details.forEach(d => {
      console.log(`  - ${d.code}: ${d.standardName} (置信度: ${d.confidence}, 匹配类型: ${d.matchType})`);
    });
    console.log(`整体置信度: ${symptomResult.overallConfidence}`);
    console.log(`最高严重度: ${symptomResult.severityMax}`);

    // 步骤2: 疾病匹配
    const diseaseResult = suggestHvDiseases(
      symptomResult.symptomCodes,
      symptomResult.overallConfidence
    );
    
    console.log(`\n匹配到的疾病:`);
    if (diseaseResult.best) {
      console.log(`  最佳匹配: ${diseaseResult.best.id} - ${diseaseResult.best.name}`);
      console.log(`  匹配分数: ${diseaseResult.best.matchScore}`);
      console.log(`  置信度: ${diseaseResult.best.confidence}`);
      console.log(`  匹配类型: ${diseaseResult.best.matchType}`);
      console.log(`  必需症状命中: ${diseaseResult.best.requiredHits}/${diseaseResult.best.requiredTotal}`);
      console.log(`  常见症状命中: ${diseaseResult.best.commonHits}/${diseaseResult.best.commonTotal}`);
      console.log(`  典型场景: ${diseaseResult.best.typicalScene}`);
      console.log(`  处理方案: ${diseaseResult.best.treatment}`);
    } else {
      console.log(`  无匹配结果`);
    }

    if (diseaseResult.candidates.length > 1) {
      console.log(`\n  其他候选 (前3个):`);
      diseaseResult.candidates.slice(1, 4).forEach(c => {
        console.log(`    - ${c.id}: ${c.name} (置信度: ${c.confidence})`);
      });
    }

    // 步骤3: 分诊评估
    const triage = assessTriage(symptomResult.symptomCodes, symptomResult.severityMax);
    console.log(`\n分诊等级: ${triage.level} - ${triage.name}`);
    console.log(`处理建议: ${triage.action}`);

    // 验证结果
    console.log(`\n验证结果:`);
    let testPassed = true;

    // 验证疾病匹配
    if (testCase.expectedDisease) {
      const diseaseMatch = diseaseResult.best && diseaseResult.best.id === testCase.expectedDisease;
      console.log(`  期望疾病: ${testCase.expectedDisease} - ${diseaseMatch ? '✓ 通过' : '✗ 失败'}`);
      if (!diseaseMatch) {
        testPassed = false;
        console.log(`    实际匹配: ${diseaseResult.best ? diseaseResult.best.id : '无'}`);
      }
    }

    // 验证症状匹配（至少匹配一个期望症状）
    if (testCase.expectedSymptoms.length > 0) {
      const symptomMatch = testCase.expectedSymptoms.some(s => 
        symptomResult.symptomCodes.includes(s)
      );
      console.log(`  期望症状: ${testCase.expectedSymptoms.join(', ')} - ${symptomMatch ? '✓ 通过' : '✗ 失败'}`);
      if (!symptomMatch) {
        testPassed = false;
      }
    }

    // 验证置信度（应该大于0.3）
    const confidenceOk = symptomResult.overallConfidence >= 0.3 || testCase.expectedSymptoms.length === 0;
    console.log(`  置信度检查: ${confidenceOk ? '✓ 通过' : '✗ 失败'} (${symptomResult.overallConfidence})`);
    if (!confidenceOk) {
      testPassed = false;
    }

    if (testPassed) {
      passCount++;
      console.log(`\n✓ 测试通过`);
    } else {
      failCount++;
      console.log(`\n✗ 测试失败`);
    }

    console.log('\n========================================');
  });

  // 测试总结
  console.log(`\n\n测试总结:`);
  console.log(`总测试数: ${testCases.length}`);
  console.log(`通过: ${passCount}`);
  console.log(`失败: ${failCount}`);
  console.log(`通过率: ${Math.round(passCount / testCases.length * 100)}%`);

  return { passCount, failCount, total: testCases.length };
}

// 性能测试
function performanceTest() {
  console.log('\n\n========================================');
  console.log('性能测试');
  console.log('========================================\n');

  const iterations = 1000;
  const testComplaint = '走路时扭伤踝关节，局部肿胀疼痛，活动受限';

  console.log(`测试主诉: "${testComplaint}"`);
  console.log(`迭代次数: ${iterations}`);

  const startTime = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    const symptomResult = standardizeComplaint(testComplaint);
    suggestHvDiseases(symptomResult.symptomCodes, symptomResult.overallConfidence);
  }

  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / iterations;

  console.log(`\n总耗时: ${totalTime}ms`);
  console.log(`平均耗时: ${avgTime.toFixed(2)}ms/次`);
  console.log(`处理速度: ${Math.round(1000 / avgTime)} 次/秒`);

  if (avgTime < 10) {
    console.log(`✓ 性能优秀 (< 10ms)`);
  } else if (avgTime < 50) {
    console.log(`✓ 性能良好 (< 50ms)`);
  } else {
    console.log(`⚠ 性能需要优化 (>= 50ms)`);
  }
}

// 执行测试
if (require.main === module) {
  const result = runTests();
  performanceTest();
  
  // 返回退出码
  process.exit(result.failCount > 0 ? 1 : 0);
}

module.exports = { runTests, performanceTest };



