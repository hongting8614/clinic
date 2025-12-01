// cloudfunctions/dailySummary/index.js
// 每日统计定时任务 - v3.3新增
// 触发器配置: 每日 23:59 执行 (cron: 59 23 * * *)
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const today = formatDate(new Date());
  const locations = ['land_park', 'water_park', 'clinic_storage'];
  
  console.log(`[dailySummary] Starting for date: ${today}`);
  
  try {
    for (const location of locations) {
      await generateDailySummary(today, location);
    }
    
    console.log(`[dailySummary] Completed successfully`);
    return {
      success: true,
      message: 'Daily summary completed',
      date: today
    };
  } catch (err) {
    console.error('[dailySummary Error]', err);
    return {
      success: false,
      error: err.message
    };
  }
};

async function generateDailySummary(date, location) {
  const startOfDay = new Date(date + ' 00:00:00');
  const endOfDay = new Date(date + ' 23:59:59');
  
  console.log(`[dailySummary] Processing ${location} on ${date}`);
  
  // 1. 入库统计
  const inboundStats = await db.collection('in_records')
    .aggregate()
    .match({
      location,
      createTime: _.gte(startOfDay).and(_.lte(endOfDay)),
      status: 'approved'
    })
    .group({
      _id: null,
      count: _.sum(1),
      totalQuantity: _.sum('$quantity'),
      totalAmount: _.sum(_.multiply(['$quantity', '$price']))
    })
    .end();
  
  // 2. 出库统计
  const outboundStats = await db.collection('out_records')
    .aggregate()
    .match({
      location,
      createTime: _.gte(startOfDay).and(_.lte(endOfDay)),
      status: 'completed'
    })
    .group({
      _id: null,
      count: _.sum(1),
      totalQuantity: _.sum('$quantity')
    })
    .end();
  
  // 3. 门诊统计 🔥 v3.2新增
  const clinicStats = await db.collection('clinic_usage')
    .aggregate()
    .match({
      location,
      createTime: _.gte(startOfDay).and(_.lte(endOfDay))
    })
    .group({
      _id: null,
      count: _.sum(1),
      totalQuantity: _.sum('$quantityMin'),
      patients: _.addToSet('$patient')
    })
    .end();
  
  // 3.1 门诊按药材日消耗统计（基于 clinic_usage）
  const clinicByDrugAgg = await db.collection('clinic_usage')
    .aggregate()
    .match({
      location,
      createTime: _.gte(startOfDay).and(_.lte(endOfDay))
    })
    .group({
      _id: '$drugId',
      drugName: _.first('$drugName'),
      specification: _.first('$specification'),
      totalQuantityMin: _.sum('$quantityMin'),
      totalQuantityPack: _.sum('$quantityPack'),
      patients: _.addToSet('$patient')
    })
    .end();
  
  // 4. 消耗统计
  const consumeStats = await db.collection('consume_records')
    .aggregate()
    .match({
      location,
      createTime: _.gte(startOfDay).and(_.lte(endOfDay))
    })
    .group({
      _id: null,
      count: _.sum(1),
      totalQuantity: _.sum('$quantity')
    })
    .end();
  
  // 5. 库存统计（当前库存状态）
  const stockStats = await db.collection('stock')
    .aggregate()
    .match({ location })
    .group({
      _id: null,
      totalValue: _.sum(_.multiply(['$quantity', '$price'])),
      drugCount: _.sum(1),
      lowStockCount: _.sum(
        _.cond([
          _.lte(['$quantity', 10]), 1, 0  // 低于10件算低库存
        ])
      ),
      expiryWarningCount: _.sum(
        _.cond([
          _.lte(['$daysToExpiry', 60]), 1, 0  // 🔥 60天临期标准
        ])
      )
    })
    .end();
  
  // 6. 写入统计表
  const statisticsId = `STAT${date.replace(/-/g, '')}_${location}`;
  
  try {
    // 先尝试删除已存在的记录（如果重新统计）
    await db.collection('statistics').doc(statisticsId).remove();
  } catch (err) {
    // 记录不存在，忽略错误
  }
  
  await db.collection('statistics').add({
    data: {
      _id: statisticsId,
      date,
      location,
      type: 'daily',
      inbound: inboundStats.list[0] || { count: 0, totalQuantity: 0, totalAmount: 0 },
      outbound: outboundStats.list[0] || { count: 0, totalQuantity: 0 },
      clinic: {
        count: clinicStats.list[0]?.count || 0,
        totalQuantity: clinicStats.list[0]?.totalQuantity || 0,
        patientCount: clinicStats.list[0]?.patients?.length || 0
      },
      // 门诊按药材日消耗明细（仅当日，用于报表/分析）
      clinicByDrug: (clinicByDrugAgg.list || []).map(item => ({
        drugId: item._id,
        drugName: item.drugName || '',
        specification: item.specification || '',
        totalQuantityMin: item.totalQuantityMin || 0,
        totalQuantityPack: item.totalQuantityPack || 0,
        patientCount: (item.patients || []).length
      })),
      consume: consumeStats.list[0] || { count: 0, totalQuantity: 0 },
      stock: stockStats.list[0] || {
        totalValue: 0,
        drugCount: 0,
        lowStockCount: 0,
        expiryWarningCount: 0
      },
      createTime: new Date()
    }
  });
  
  console.log(`[dailySummary] Completed for ${location} on ${date}`);
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}



