/**
 * 诊断处方库存问题脚本
 * 
 * 使用方法：
 * 1. 在微信开发者工具的"云开发"控制台中打开"数据库"
 * 2. 点击右上角的"终端"按钮
 * 3. 复制本脚本内容并粘贴执行
 * 4. 根据输出结果判断问题原因
 */

// ============ 配置区域 ============
const CONFIG = {
  // 药品名称（从错误提示中获取）
  drugName: '布洛芬缓释胶囊(芬必得)',
  
  // 园区（从门诊登记页面获取）
  location: 'land_park',  // 'land_park' 或 'water_park'
  
  // 如果知道drugId，可以直接填写
  drugId: null  // 例如: 'drug_xxx'
};

// ============ 诊断函数 ============

async function diagnosePrescriptionStockIssue() {
  console.log('='.repeat(60));
  console.log('🔍 开始诊断处方库存问题');
  console.log('='.repeat(60));
  console.log('');
  
  const db = cloud.database();
  const _ = db.command;
  
  // 步骤1: 查找药品档案
  console.log('📋 步骤1: 查找药品档案');
  console.log(`   药品名称: ${CONFIG.drugName}`);
  
  let drugId = CONFIG.drugId;
  let drugInfo = null;
  
  if (!drugId) {
    // 通过名称查找
    const drugRes = await db.collection('drugs')
      .where({
        name: db.RegExp({
          regexp: CONFIG.drugName,
          options: 'i'
        })
      })
      .get();
    
    if (drugRes.data.length === 0) {
      console.error('   ❌ 未找到该药品档案');
      console.log('   💡 建议: 请先在"药品管理"中添加该药品');
      return;
    }
    
    drugInfo = drugRes.data[0];
    drugId = drugInfo._id;
    console.log('   ✅ 找到药品档案');
    console.log(`   - ID: ${drugId}`);
    console.log(`   - 名称: ${drugInfo.name}`);
    console.log(`   - 规格: ${drugInfo.specification || drugInfo.spec || '未设置'}`);
    console.log(`   - 最小单位: ${drugInfo.minUnit || drugInfo.unit || '未设置'}`);
  } else {
    // 通过ID查找
    const drugRes = await db.collection('drugs')
      .doc(drugId)
      .get();
    
    if (!drugRes.data) {
      console.error('   ❌ 未找到该药品档案');
      return;
    }
    
    drugInfo = drugRes.data;
    console.log('   ✅ 找到药品档案');
    console.log(`   - ID: ${drugId}`);
    console.log(`   - 名称: ${drugInfo.name}`);
  }
  
  console.log('');
  
  // 步骤2: 查找库存记录
  console.log('📦 步骤2: 查找库存记录');
  console.log(`   园区: ${CONFIG.location === 'land_park' ? '陆园' : '水园'}`);
  
  const stockRes = await db.collection('stock')
    .where({
      drugId: drugId,
      location: CONFIG.location
    })
    .get();
  
  if (stockRes.data.length === 0) {
    console.error('   ❌ 该园区没有该药品的库存记录');
    console.log('');
    
    // 检查其他园区是否有库存
    const otherLocation = CONFIG.location === 'land_park' ? 'water_park' : 'land_park';
    const otherStockRes = await db.collection('stock')
      .where({
        drugId: drugId,
        location: otherLocation
      })
      .get();
    
    if (otherStockRes.data.length > 0) {
      console.log(`   💡 发现: ${otherLocation === 'land_park' ? '陆园' : '水园'}有该药品库存`);
      console.log(`   - 库存数量: ${otherStockRes.data.reduce((sum, item) => sum + item.quantity, 0)}`);
      console.log(`   - 批次数: ${otherStockRes.data.length}`);
      console.log('');
      console.log('   🔧 解决方案:');
      console.log('   1. 在门诊登记页面切换到有库存的园区');
      console.log('   2. 或者为当前园区入库该药品');
    } else {
      console.log('   💡 两个园区都没有该药品的库存记录');
      console.log('');
      console.log('   🔧 解决方案:');
      console.log('   1. 进入"入库管理"页面');
      console.log('   2. 选择对应园区');
      console.log('   3. 添加该药品的入库记录');
      console.log('   4. 提交并完成复核');
    }
    
    return;
  }
  
  console.log(`   ✅ 找到 ${stockRes.data.length} 条库存记录`);
  console.log('');
  
  // 步骤3: 检查库存数量
  console.log('📊 步骤3: 检查库存数量');
  
  let totalStock = 0;
  let validBatches = [];
  const now = new Date();
  
  stockRes.data.forEach((batch, index) => {
    const quantity = Number(batch.quantity) || 0;
    const expireDate = new Date(batch.expireDate);
    const isExpired = expireDate < now;
    const daysToExpire = Math.floor((expireDate - now) / (1000 * 60 * 60 * 24));
    
    console.log(`   批次 ${index + 1}:`);
    console.log(`   - 批号: ${batch.batch || '未设置'}`);
    console.log(`   - 数量: ${quantity} ${batch.unit || batch.minUnit || ''}`);
    console.log(`   - 有效期: ${batch.expireDate}`);
    console.log(`   - 状态: ${isExpired ? '❌ 已过期' : daysToExpire <= 90 ? '⚠️ 近效期' : '✅ 正常'}`);
    
    if (quantity > 0 && !isExpired) {
      totalStock += quantity;
      validBatches.push(batch);
    }
    
    console.log('');
  });
  
  console.log(`   总库存: ${totalStock} ${drugInfo.minUnit || drugInfo.unit || ''}`);
  console.log(`   有效批次: ${validBatches.length} 个`);
  console.log('');
  
  // 步骤4: 诊断结果
  console.log('🎯 步骤4: 诊断结果');
  
  if (totalStock === 0) {
    console.error('   ❌ 问题: 该园区该药品库存为0');
    console.log('');
    console.log('   🔧 解决方案:');
    console.log('   1. 检查是否有入库单待复核');
    console.log('   2. 为该园区添加入库记录');
    console.log('   3. 或切换到有库存的园区');
  } else if (validBatches.length === 0) {
    console.error('   ❌ 问题: 所有批次都已过期');
    console.log('');
    console.log('   🔧 解决方案:');
    console.log('   1. 清理过期库存');
    console.log('   2. 添加新的入库记录');
  } else {
    console.log('   ✅ 库存正常，可以正常开方');
    console.log('');
    console.log('   📝 如果仍然报错，请检查:');
    console.log('   1. 门诊登记页面选择的园区是否正确');
    console.log('   2. 云函数是否已部署最新版本');
    console.log('   3. 查看控制台是否有其他错误信息');
  }
  
  console.log('');
  console.log('='.repeat(60));
  console.log('✅ 诊断完成');
  console.log('='.repeat(60));
}

// ============ 执行诊断 ============
diagnosePrescriptionStockIssue().catch(err => {
  console.error('诊断过程出错:', err);
});



