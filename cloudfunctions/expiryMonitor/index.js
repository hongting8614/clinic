// cloudfunctions/expiryMonitor/index.js
// 效期预警定时任务 - v3.3新增
// 触发器配置: 每日 00:10 执行 (cron: 10 0 * * *)
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  console.log('[expiryMonitor] Starting expiry check');
  
  try {
    const today = new Date();
    const stocks = await db.collection('stock').get();
    
    let expiredCount = 0;
    let expiringCount = 0;
    const alerts = [];
    const updatePromises = [];
    
    for (const stock of stocks.data) {
      // 计算距有效期天数
      const daysToExpiry = Math.ceil(
        (new Date(stock.expiryDate) - today) / (1000 * 60 * 60 * 24)
      );
      
      let status = '正常';
      if (daysToExpiry <= 0) {
        status = '过期';
        expiredCount++;
      } else if (daysToExpiry <= 60) {  // 🔥 60天临期标准
        status = '临期';
        expiringCount++;
      }
      
      // 更新库存表中的状态
      updatePromises.push(
        db.collection('stock').doc(stock._id).update({
          data: {
            daysToExpiry,
            expiryStatus: status,
            updateTime: today
          }
        })
      );
      
      // 生成预警记录
      if (status !== '正常') {
        const alert = {
          type: 'expiry',
          level: status === '过期' ? 'critical' : 'warning',
          drugId: stock.drugId,
          drugName: stock.drugName,
          specification: stock.specification,
          batch: stock.batch,
          location: stock.location,
          quantity: stock.quantity,
          unit: stock.unit,
          expiryDate: stock.expiryDate,
          daysToExpiry,
          status,
          message: `【${status}预警】${stock.drugName} (${stock.specification}) 批次${stock.batch}，距有效期 ${daysToExpiry} 天`,
          createTime: today,
          isRead: false
        };
        
        alerts.push(alert);
        
        // 推送微信订阅消息
        await sendSubscribeMessage(alert);
      }
    }
    
    // 批量更新库存状态
    await Promise.all(updatePromises);
    
    // 清空旧的预警记录（保留最近7天）
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    await db.collection('alerts')
      .where({
        createTime: _.lt(sevenDaysAgo)
      })
      .remove();
    
    // 批量写入新预警表
    if (alerts.length > 0) {
      // 分批写入（每次最多100条）
      for (let i = 0; i < alerts.length; i += 100) {
        const batch = alerts.slice(i, i + 100);
        await db.collection('alerts').add({ data: batch });
      }
    }
    
    console.log(`[expiryMonitor] Completed: ${expiredCount} expired, ${expiringCount} expiring`);
    
    return {
      success: true,
      data: {
        total: stocks.data.length,
        expiredCount,
        expiringCount,
        alertsCreated: alerts.length
      }
    };
  } catch (err) {
    console.error('[expiryMonitor Error]', err);
    return {
      success: false,
      error: err.message
    };
  }
};

// 发送订阅消息
async function sendSubscribeMessage(alert) {
  try {
    // 获取需要接收预警的用户
    const users = await db.collection('users')
      .where({
        role: _.in(['admin', 'pharmacist']),
        subscribeExpiry: true
      })
      .get();
    
    // 如果没有配置订阅，跳过推送
    if (!users.data.length) {
      console.log('[sendSubscribeMessage] No users subscribed');
      return;
    }
    
    for (const user of users.data) {
      try {
        await cloud.openapi.subscribeMessage.send({
          touser: user._openid,
          page: 'pages/stock/index',
          data: {
            thing1: { value: alert.drugName.substring(0, 20) },
            thing2: { value: alert.message.substring(0, 20) },
            date3: { value: formatDate(alert.expiryDate) }
          },
          templateId: 'TEMPLATE_ID_FOR_EXPIRY_WARNING'  // TODO: 替换为实际模板ID
        });
        console.log(`[sendSubscribeMessage] Sent to ${user.name}`);
      } catch (err) {
        console.error(`[sendSubscribeMessage] Failed to send to ${user.name}:`, err);
      }
    }
  } catch (err) {
    console.error('[sendSubscribeMessage Error]', err);
  }
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}



