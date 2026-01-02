// 数据库初始化脚本 - AK-PMS v3.3
// 使用方法：在云开发控制台 → 云函数 → 创建临时云函数 → 粘贴并执行

const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  console.log('===== 数据库初始化开始 =====');
  
  const results = {
    collections: [],
    indexes: [],
    migrations: [],
    errors: []
  };

  try {
    // ========== 第一步：创建新集合 ==========
    console.log('\n[1/4] 创建新集合...');
    
    const newCollections = [
      { name: 'clinic_usage', desc: '门诊用药记录' },
      { name: 'statistics', desc: '统计数据' },
      { name: 'alerts', desc: '预警记录' }
    ];

    for (const col of newCollections) {
      try {
        // 检查集合是否存在
        await db.collection(col.name).limit(1).get();
        console.log(`  ✅ ${col.name} (${col.desc}) - 已存在`);
        results.collections.push({ name: col.name, status: 'exists' });
      } catch (err) {
        if (err.errCode === -1) {
          // 集合不存在，需要手动创建
          console.log(`  ⚠️ ${col.name} (${col.desc}) - 请手动在控制台创建`);
          results.collections.push({ name: col.name, status: 'need_manual_create' });
        }
      }
    }

    // ========== 第二步：创建索引 ==========
    console.log('\n[2/4] 创建索引...');
    
    const indexes = [
      // clinic_usage 索引
      {
        collection: 'clinic_usage',
        indexes: [
          { keys: { location: 1, createTime: -1 }, name: 'location_createTime' },
          { keys: { drugId: 1, createTime: -1 }, name: 'drugId_createTime' },
          { keys: { patient: 1 }, name: 'patient' }
        ]
      },
      // statistics 索引
      {
        collection: 'statistics',
        indexes: [
          { keys: { date: 1, location: 1 }, name: 'date_location' },
          { keys: { month: 1, location: 1 }, name: 'month_location' }
        ]
      },
      // alerts 索引
      {
        collection: 'alerts',
        indexes: [
          { keys: { type: 1, createTime: -1 }, name: 'type_createTime' },
          { keys: { drugId: 1, location: 1 }, name: 'drugId_location' },
          { keys: { isRead: 1 }, name: 'isRead' }
        ]
      },
      // stock 新增索引
      {
        collection: 'stock',
        indexes: [
          { keys: { drugId: 1, batch: 1, location: 1 }, name: 'drugId_batch_location', unique: true },
          { keys: { daysToExpiry: 1 }, name: 'daysToExpiry' }
        ]
      }
    ];

    for (const col of indexes) {
      console.log(`  处理 ${col.collection} 的索引...`);
      for (const index of col.indexes) {
        try {
          // 注意：云函数无法直接创建索引，需要手动在控制台创建
          console.log(`    ⚠️ ${index.name} - 请手动在控制台创建`);
          console.log(`       索引字段: ${JSON.stringify(index.keys)}`);
          if (index.unique) console.log(`       唯一索引: true`);
          results.indexes.push({ 
            collection: col.collection, 
            name: index.name, 
            status: 'need_manual_create' 
          });
        } catch (err) {
          console.error(`    ❌ ${index.name} 创建失败:`, err.message);
          results.errors.push({ type: 'index', name: index.name, error: err.message });
        }
      }
    }

    // ========== 第三步：数据迁移 ==========
    console.log('\n[3/4] 数据迁移...');
    
    // 3.1 为 stock 表添加新字段
    console.log('  迁移 stock 表...');
    try {
      const stocks = await db.collection('stock').get();
      console.log(`    共 ${stocks.data.length} 条库存记录`);
      
      let migrated = 0;
      for (const stock of stocks.data) {
        try {
          // 获取药材信息
          const drugRes = await db.collection('drugs').doc(stock.drugId).get();
          const drug = drugRes.data;
          
          // 计算距有效期天数
          const today = new Date();
          const expiryDate = new Date(stock.expiryDate);
          const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
          
          let expiryStatus = '正常';
          if (daysToExpiry <= 0) {
            expiryStatus = '过期';
          } else if (daysToExpiry <= 60) {
            expiryStatus = '临期';
          }
          
          // 更新记录
          await db.collection('stock').doc(stock._id).update({
            data: {
              specification: stock.specification || drug.specification || '未知规格',
              location: stock.location || 'land_park',  // 默认陆园
              daysToExpiry: daysToExpiry,
              expiryStatus: expiryStatus,
              updateTime: new Date()
            }
          });
          
          migrated++;
        } catch (err) {
          console.error(`    ❌ 迁移失败: ${stock._id}`, err.message);
          results.errors.push({ type: 'migration', id: stock._id, error: err.message });
        }
      }
      
      console.log(`    ✅ 成功迁移 ${migrated} 条记录`);
      results.migrations.push({ 
        collection: 'stock', 
        total: stocks.data.length, 
        migrated: migrated 
      });
    } catch (err) {
      console.error('    ❌ stock 表迁移失败:', err.message);
      results.errors.push({ type: 'migration', collection: 'stock', error: err.message });
    }

    // 3.2 为 in_records 表添加新字段
    console.log('  迁移 in_records 表...');
    try {
      const records = await db.collection('in_records').get();
      console.log(`    共 ${records.data.length} 条入库记录`);
      
      let migrated = 0;
      for (const record of records.data) {
        try {
          const drugRes = await db.collection('drugs').doc(record.drugId).get();
          const drug = drugRes.data;
          
          await db.collection('in_records').doc(record._id).update({
            data: {
              specification: record.specification || drug.specification || '未知规格',
              location: record.location || 'land_park',
              updateTime: new Date()
            }
          });
          
          migrated++;
        } catch (err) {
          console.error(`    ❌ 迁移失败: ${record._id}`, err.message);
        }
      }
      
      console.log(`    ✅ 成功迁移 ${migrated} 条记录`);
      results.migrations.push({ 
        collection: 'in_records', 
        total: records.data.length, 
        migrated: migrated 
      });
    } catch (err) {
      console.error('    ❌ in_records 表迁移失败:', err.message);
      results.errors.push({ type: 'migration', collection: 'in_records', error: err.message });
    }

    // 3.3 为 out_records 表添加新字段
    console.log('  迁移 out_records 表...');
    try {
      const records = await db.collection('out_records').get();
      console.log(`    共 ${records.data.length} 条出库记录`);
      
      let migrated = 0;
      for (const record of records.data) {
        try {
          const drugRes = await db.collection('drugs').doc(record.drugId).get();
          const drug = drugRes.data;
          
          await db.collection('out_records').doc(record._id).update({
            data: {
              specification: record.specification || drug.specification || '未知规格',
              location: record.location || 'land_park',
              updateTime: new Date()
            }
          });
          
          migrated++;
        } catch (err) {
          console.error(`    ❌ 迁移失败: ${record._id}`, err.message);
        }
      }
      
      console.log(`    ✅ 成功迁移 ${migrated} 条记录`);
      results.migrations.push({ 
        collection: 'out_records', 
        total: records.data.length, 
        migrated: migrated 
      });
    } catch (err) {
      console.error('    ❌ out_records 表迁移失败:', err.message);
      results.errors.push({ type: 'migration', collection: 'out_records', error: err.message });
    }

    // ========== 第四步：执行效期预警更新 ==========
    console.log('\n[4/4] 执行效期预警更新...');
    try {
      const monitorRes = await cloud.callFunction({
        name: 'expiryMonitor'
      });
      
      if (monitorRes.result.success) {
        console.log('  ✅ 效期预警更新成功');
        console.log(`    过期: ${monitorRes.result.data.expiredCount} 条`);
        console.log(`    临期: ${monitorRes.result.data.expiringCount} 条`);
        console.log(`    预警: ${monitorRes.result.data.alertsCreated} 条`);
      } else {
        console.log('  ⚠️ 效期预警更新失败:', monitorRes.result.error);
      }
    } catch (err) {
      console.error('  ❌ 无法调用 expiryMonitor:', err.message);
      console.log('  💡 请手动执行 expiryMonitor 云函数');
    }

    // ========== 总结 ==========
    console.log('\n===== 数据库初始化完成 =====');
    console.log('\n📊 执行结果汇总:');
    console.log(`  集合: ${results.collections.length} 个`);
    console.log(`  索引: ${results.indexes.length} 个`);
    console.log(`  迁移: ${results.migrations.length} 个表`);
    console.log(`  错误: ${results.errors.length} 个`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ 错误详情:');
      results.errors.forEach((err, i) => {
        console.log(`  ${i + 1}. [${err.type}] ${err.collection || err.name || err.id}: ${err.error}`);
      });
    }
    
    console.log('\n⚠️ 手动操作提醒:');
    console.log('  1. 在云开发控制台创建以下集合（如果不存在）:');
    console.log('     - clinic_usage');
    console.log('     - statistics');
    console.log('     - alerts');
    console.log('  2. 在各集合的"索引管理"中创建索引（参考上面的日志）');
    console.log('  3. 手动执行一次 expiryMonitor 云函数');
    console.log('  4. 配置定时触发器（dailySummary 和 expiryMonitor）');
    
    return {
      success: true,
      message: '数据库初始化完成',
      results: results
    };

  } catch (err) {
    console.error('\n===== 初始化失败 =====');
    console.error(err);
    return {
      success: false,
      error: err.message,
      results: results
    };
  }
};


