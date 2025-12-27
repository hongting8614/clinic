// 临时云函数：创建门诊系统所需的所有集合
// 使用方法：部署后在云开发控制台执行一次，然后可以删除

const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  console.log('===== 开始创建门诊系统所需集合 =====');
  
  const results = {
    success: [],
    failed: [],
    existed: []
  };
  
  // 需要创建的集合列表
  const collections = [
    { name: 'clinic_records', desc: '门诊登记记录（完整信息）' },
    { name: 'clinic_usage', desc: '门诊用药记录（统计用）' },
    { name: 'operation_logs', desc: '操作日志' },
    { name: 'clinic_templates', desc: '门诊模板' }
  ];
  
  for (const col of collections) {
    try {
      console.log(`\n正在创建集合: ${col.name} (${col.desc})`);
      
      // 检查集合是否已存在
      try {
        const checkRes = await db.collection(col.name).limit(1).get();
        console.log(`✅ ${col.name} - 已存在，跳过创建`);
        results.existed.push(col.name);
        continue;
      } catch (checkErr) {
        // 集合不存在，继续创建
        console.log(`  集合不存在，开始创建...`);
      }
      
      // 创建集合（通过插入测试数据）
      const testId = `TEST_${col.name.toUpperCase()}_DELETE_ME`;
      await db.collection(col.name).add({
        data: {
          _id: testId,
          name: '测试记录-请删除',
          createTime: new Date(),
          isTest: true
        }
      });
      
      console.log(`✅ ${col.name} - 创建成功`);
      
      // 尝试删除测试记录
      try {
        await db.collection(col.name).doc(testId).remove();
        console.log(`  测试记录已自动删除`);
      } catch (delErr) {
        console.log(`  ⚠️ 请手动删除测试记录: ${testId}`);
      }
      
      results.success.push(col.name);
      
    } catch (err) {
      console.error(`❌ ${col.name} - 创建失败:`, err.message);
      results.failed.push({
        name: col.name,
        error: err.message,
        errCode: err.errCode
      });
    }
  }
  
  console.log('\n===== 创建完成 =====');
  console.log(`成功: ${results.success.length} 个`);
  console.log(`已存在: ${results.existed.length} 个`);
  console.log(`失败: ${results.failed.length} 个`);
  
  return {
    success: results.failed.length === 0,
    message: `成功创建 ${results.success.length} 个集合`,
    results: results
  };
};

