// cloudfunctions/reportService/index.js
// 报表服务云函数 - v3.3新增
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { reportType, params, action } = event;
  
  try {
    // Excel导出功能
    if (action === 'exportExcel') {
      return await exportToExcel(event.data);
    }
    
    // 报表查询
    switch(reportType) {
      case 'R1_inbound':
      case 'R1':
        return await getInboundReport(params);
      case 'R2_outbound':
      case 'R2':
        return await getOutboundReport(params);
      case 'R3_clinic':
      case 'R3':
        return await getClinicReport(params);
      case 'R4_stock':
      case 'R4':
        return await getStockReport(params);
      case 'R5_check':
      case 'R5':
        return await getCheckReport(params);
      default:
        return { success: false, error: '未知报表类型' };
    }
  } catch (err) {
    console.error('[reportService Error]', err);
    return {
      success: false,
      error: err.message || '服务器错误'
    };
  }
};

// Excel导出功能
async function exportToExcel(data) {
  const { reportType, reportName, tableData, columns } = data;
  
  try {
    // 生成CSV格式（简化版Excel）
    let csvContent = '';
    
    // 添加表头
    const headers = columns.map(col => col.label).join(',');
    csvContent += headers + '\n';
    
    // 添加数据行
    tableData.forEach(row => {
      const values = columns.map(col => {
        let value = row[col.key] || '';
        // 处理特殊字段
        if (col.key === 'createTime' || col.key === 'expiryDate' || col.key === 'checkTime') {
          value = formatDate(value);
        }
        // 处理逗号和换行符
        if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    });
    
    // 上传到云存储
    const fileName = `${reportName}_${Date.now()}.csv`;
    const fileID = await cloud.uploadFile({
      cloudPath: `exports/${fileName}`,
      fileContent: Buffer.from('\uFEFF' + csvContent, 'utf8') // 添加BOM以支持Excel打开中文
    });
    
    // 获取临时下载链接（有效期2小时）
    const tempURLRes = await cloud.getTempFileURL({
      fileList: [fileID.fileID],
      maxAge: 7200
    });
    
    return {
      success: true,
      data: {
        fileID: fileID.fileID,
        tempURL: tempURLRes.fileList[0].tempFileURL,
        fileName: fileName
      }
    };
  } catch (err) {
    console.error('[exportToExcel Error]', err);
    return {
      success: false,
      error: '导出失败：' + err.message
    };
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// R1: 入库明细报表
async function getInboundReport(params) {
  const {
    startDate,
    endDate,
    supplier,
    drugName,
    location,
    page = 1,
    pageSize = 50
  } = params;
  
  let whereCondition = {
    status: 'approved'  // 只统计已审核的
  };
  
  // 日期范围
  if (startDate && endDate) {
    whereCondition.createTime = _.gte(new Date(startDate))
      .and(_.lte(new Date(endDate + ' 23:59:59')));
  }
  
  // 供应商筛选
  if (supplier) {
    whereCondition.supplier = db.RegExp({
      regexp: supplier,
      options: 'i'
    });
  }
  
  // 园区筛选
  if (location && location !== 'all') {
    whereCondition.location = location;
  }
  
  // 查询入库记录
  const listRes = await db.collection('in_records')
    .where(whereCondition)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();
  
  // 计算距有效期天数 🔥
  const today = new Date();
  const reportData = listRes.data.map(record => {
    const daysToExpiry = Math.ceil(
      (new Date(record.expiryDate) - today) / (1000 * 60 * 60 * 24)
    );
    
    let expiryStatus = '正常';
    if (daysToExpiry <= 0) expiryStatus = '过期';
    else if (daysToExpiry <= 60) expiryStatus = '临期';
    
    return {
      ...record,
      daysToExpiry,
      expiryStatus
    };
  });
  
  // 汇总统计
  const summary = {
    totalRecords: reportData.length,
    totalQuantity: reportData.reduce((sum, r) => sum + r.quantity, 0),
    totalAmount: reportData.reduce((sum, r) => sum + (r.quantity * r.price), 0)
  };
  
  return {
    success: true,
    data: {
      list: reportData,
      summary,
      page,
      pageSize
    }
  };
}

// R2: 出库与请领汇总报表
async function getOutboundReport(params) {
  const {
    startDate,
    endDate,
    location,
    department,
    drugName,
    page = 1,
    pageSize = 50
  } = params;
  
  let whereCondition = {
    status: 'completed'  // 已完成的出库
  };
  
  // 日期范围
  if (startDate && endDate) {
    whereCondition.createTime = _.gte(new Date(startDate))
      .and(_.lte(new Date(endDate + ' 23:59:59')));
  }
  
  // 园区筛选
  if (location && location !== 'all') {
    whereCondition.location = location;
  }
  
  // 部门筛选
  if (department) {
    whereCondition.department = db.RegExp({
      regexp: department,
      options: 'i'
    });
  }
  
  const listRes = await db.collection('out_records')
    .where(whereCondition)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();
  
  // 计算距有效期天数 🔥
  const today = new Date();
  const reportData = listRes.data.map(record => {
    const daysToExpiry = Math.ceil(
      (new Date(record.expiryDate) - today) / (1000 * 60 * 60 * 24)
    );
    
    let expiryStatus = '正常';
    if (daysToExpiry <= 0) expiryStatus = '过期';
    else if (daysToExpiry <= 60) expiryStatus = '临期';
    
    return {
      ...record,
      daysToExpiry,
      expiryStatus
    };
  });
  
  // 按园区统计（用于饼图）
  const locationStats = {};
  reportData.forEach(record => {
    const loc = record.location || 'unknown';
    if (!locationStats[loc]) {
      locationStats[loc] = {
        location: loc,
        quantity: 0,
        count: 0
      };
    }
    locationStats[loc].quantity += record.quantity;
    locationStats[loc].count += 1;
  });
  
  return {
    success: true,
    data: {
      list: reportData,
      locationStats: Object.values(locationStats),
      page,
      pageSize
    }
  };
}

// R3: 门诊用药统计报表（分园区）🔥 v3.2核心
async function getClinicReport(params) {
  const {
    startDate,
    endDate,
    location,
    groupBy = 'day'  // day | drug | location
  } = params;
  
  let matchCondition = {};
  
  // 日期范围
  if (startDate && endDate) {
    matchCondition.createTime = _.gte(new Date(startDate))
      .and(_.lte(new Date(endDate + ' 23:59:59')));
  }
  
  // 园区筛选
  if (location && location !== 'all') {
    matchCondition.location = location;
  }
  
  // 聚合查询
  let groupField;
  switch(groupBy) {
    case 'day':
      groupField = {
        date: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createTime'
          }
        },
        location: '$location'
      };
      break;
    case 'drug':
      groupField = {
        drugId: '$drugId',
        drugName: '$drugName',
        specification: '$specification'
      };
      break;
    case 'location':
      groupField = '$location';
      break;
  }
  
  const aggregateRes = await db.collection('clinic_usage')
    .aggregate()
    .match(matchCondition)
    .group({
      _id: groupField,
      totalQuantity: _.sum('$quantityMin'),
      count: _.sum(1),
      patientCount: _.addToSet('$patient')
    })
    .sort({ '_id.date': 1 })
    .end();
  
  // 格式化数据供图表使用
  const chartData = {
    dates: [],
    series: {}
  };
  
  aggregateRes.list.forEach(item => {
    if (groupBy === 'day' && item._id.date) {
      const date = item._id.date;
      const location = item._id.location;
      
      if (!chartData.dates.includes(date)) {
        chartData.dates.push(date);
      }
      
      if (!chartData.series[location]) {
        chartData.series[location] = [];
      }
      chartData.series[location].push({
        date,
        value: item.totalQuantity
      });
    }
  });
  
  return {
    success: true,
    data: {
      list: aggregateRes.list,
      chartData
    }
  };
}

// R4: 库存结存与有效期预警报表 ⭐⭐⭐ 核心报表
async function getStockReport(params) {
  const {
    location,
    expiryWarning = false,  // 只显示临期/过期
    drugName,
    page = 1,
    pageSize = 50
  } = params;
  
  let whereCondition = {};
  
  // 园区筛选
  if (location && location !== 'all') {
    whereCondition.location = location;
  }
  
  // 药品名称筛选
  if (drugName) {
    whereCondition.drugName = db.RegExp({
      regexp: drugName,
      options: 'i'
    });
  }
  
  // 有效期预警筛选
  if (expiryWarning) {
    whereCondition.daysToExpiry = _.lte(60);  // ≤60天
  }
  
  const listRes = await db.collection('stock')
    .where(whereCondition)
    .orderBy('expiryDate', 'asc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();
  
  // 计算距有效期天数和状态 🔥
  const today = new Date();
  const reportData = listRes.data.map(stock => {
    const daysToExpiry = Math.ceil(
      (new Date(stock.expiryDate) - today) / (1000 * 60 * 60 * 24)
    );
    
    let expiryStatus = '正常';
    let statusColor = 'green';
    if (daysToExpiry <= 0) {
      expiryStatus = '过期';
      statusColor = 'red';
    } else if (daysToExpiry <= 60) {  // 🔥 60天临期标准
      expiryStatus = '临期';
      statusColor = 'orange';
    }
    
    return {
      ...stock,
      daysToExpiry,
      expiryStatus,
      statusColor
    };
  });
  
  // 汇总统计
  const summary = {
    total: reportData.length,
    expired: reportData.filter(s => s.expiryStatus === '过期').length,
    expiring: reportData.filter(s => s.expiryStatus === '临期').length,
    normal: reportData.filter(s => s.expiryStatus === '正常').length
  };
  
  return {
    success: true,
    data: {
      list: reportData,
      summary,
      page,
      pageSize
    }
  };
}

// R5: 盘点差异分析报表
async function getCheckReport(params) {
  const {
    month,  // YYYY-MM
    location,
    page = 1,
    pageSize = 50
  } = params;
  
  let whereCondition = {};
  
  // 月份筛选
  if (month) {
    const startDate = new Date(month + '-01');
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    
    whereCondition.checkTime = _.gte(startDate).and(_.lt(endDate));
  }
  
  // 园区筛选
  if (location && location !== 'all') {
    whereCondition.location = location;
  }
  
  const listRes = await db.collection('stock_check')
    .where(whereCondition)
    .orderBy('checkTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();
  
  // 计算距有效期天数 🔥
  const today = new Date();
  const reportData = listRes.data.map(record => {
    const daysToExpiry = Math.ceil(
      (new Date(record.expiryDate) - today) / (1000 * 60 * 60 * 24)
    );
    
    let expiryStatus = '正常';
    if (daysToExpiry <= 0) expiryStatus = '过期';
    else if (daysToExpiry <= 60) expiryStatus = '临期';
    
    // 计算差异率
    const diffRate = record.theoreticalStock !== 0
      ? ((record.actualStock - record.theoreticalStock) / record.theoreticalStock * 100).toFixed(2)
      : 0;
    
    return {
      ...record,
      daysToExpiry,
      expiryStatus,
      diffRate
    };
  });
  
  // 统计
  const summary = {
    total: reportData.length,
    profit: reportData.filter(r => r.diffQty > 0).length,  // 盘盈
    loss: reportData.filter(r => r.diffQty < 0).length,    // 盘亏
    match: reportData.filter(r => r.diffQty === 0).length  // 相符
  };
  
  return {
    success: true,
    data: {
      list: reportData,
      summary,
      page,
      pageSize
    }
  };
}

