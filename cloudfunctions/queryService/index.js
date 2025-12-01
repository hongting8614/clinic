// cloudfunctions/queryService/index.js
// 查询服务云函数 - v3.3新增
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { queryType, params } = event;
  
  try {
    switch(queryType) {
      case 'Q1_drug':
        return await queryDrug(params);
      case 'Q2_stock':
        return await queryStock(params);
      case 'Q3_clinic':
        return await queryClinic(params);
      case 'Q4_inbound':
        return await queryInbound(params);
      case 'Q5_outbound':
        return await queryOutbound(params);
      case 'Q6_check':
        return await queryCheck(params);
      default:
        return { success: false, error: '未知查询类型' };
    }
  } catch (err) {
    console.error('[queryService Error]', err);
    return {
      success: false,
      error: err.message || '服务器错误'
    };
  }
};

// Q1: 药材综合查询
async function queryDrug(params) {
  const {
    name,
    specification,
    batch,
    manufacturer,
    location,
    page = 1,
    pageSize = 20
  } = params;
  
  let whereCondition = {};
  
  // 药材名称模糊查询
  if (name) {
    whereCondition.name = db.RegExp({
      regexp: name,
      options: 'i'
    });
  }
  
  // 规格模糊查询
  if (specification) {
    whereCondition.specification = db.RegExp({
      regexp: specification,
      options: 'i'
    });
  }
  
  // 厂家模糊查询
  if (manufacturer) {
    whereCondition.manufacturer = db.RegExp({
      regexp: manufacturer,
      options: 'i'
    });
  }
  
  // 查询药材基本信息
  const drugRes = await db.collection('drugs')
    .where(whereCondition)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();
  
  // 查询每个药材的库存分布和有效期信息
  const drugsWithStock = await Promise.all(
    drugRes.data.map(async (drug) => {
      let stockCondition = { drugId: drug._id };
      
      // 批次筛选
      if (batch) {
        stockCondition.batch = batch;
      }
      
      // 园区筛选
      if (location && location !== 'all') {
        stockCondition.location = location;
      }
      
      const stockRes = await db.collection('stock')
        .where(stockCondition)
        .get();
      
      // 计算距有效期天数
      const today = new Date();
      const stockWithExpiry = stockRes.data.map(s => {
        const daysToExpiry = Math.ceil(
          (new Date(s.expiryDate) - today) / (1000 * 60 * 60 * 24)
        );
        return {
          ...s,
          daysToExpiry
        };
      });
      
      // 按园区汇总库存
      const stockByLocation = {};
      stockWithExpiry.forEach(s => {
        if (!stockByLocation[s.location]) {
          stockByLocation[s.location] = 0;
        }
        stockByLocation[s.location] += s.quantity;
      });
      
      return {
        ...drug,
        stockByLocation,
        batches: stockWithExpiry
      };
    })
  );
  
  return {
    success: true,
    data: {
      list: drugsWithStock,
      page,
      pageSize
    }
  };
}

// Q2: 实时库存查询 ⭐
async function queryStock(params) {
  const {
    drugName,
    location,
    batch,
    expiryWarning = false,  // 是否只显示预警
    page = 1,
    pageSize = 50
  } = params;
  
  let whereCondition = {};
  
  // 药材名称模糊查询
  if (drugName) {
    whereCondition.drugName = db.RegExp({
      regexp: drugName,
      options: 'i'
    });
  }
  
  // 园区筛选
  if (location && location !== 'all') {
    whereCondition.location = location;
  }
  
  // 批次筛选
  if (batch) {
    whereCondition.batch = batch;
  }
  
  // 有效期预警筛选
  if (expiryWarning) {
    whereCondition.daysToExpiry = _.lte(60);
  }
  
  const listRes = await db.collection('stock')
    .where(whereCondition)
    .orderBy('expiryDate', 'asc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();
  
  // 计算距有效期天数和预警状态 🔥
  const today = new Date();
  const stockData = listRes.data.map(stock => {
    const daysToExpiry = Math.ceil(
      (new Date(stock.expiryDate) - today) / (1000 * 60 * 60 * 24)
    );
    
    let expiryStatus = '正常';
    let warningIcon = '🟢';
    if (daysToExpiry <= 0) {
      expiryStatus = '过期';
      warningIcon = '🔴';
    } else if (daysToExpiry <= 60) {
      expiryStatus = '临期';
      warningIcon = '🟠';
    }
    
    return {
      ...stock,
      daysToExpiry,
      expiryStatus,
      warningIcon
    };
  });
  
  return {
    success: true,
    data: {
      list: stockData,
      page,
      pageSize
    }
  };
}

// Q3: 门诊用药查询
async function queryClinic(params) {
  const {
    startDate,
    endDate,
    location,
    drugName,
    operator,
    patient,
    page = 1,
    pageSize = 50
  } = params;
  
  let whereCondition = {};
  
  // 日期范围
  if (startDate && endDate) {
    whereCondition.createTime = _.gte(new Date(startDate))
      .and(_.lte(new Date(endDate + ' 23:59:59')));
  }
  
  // 园区筛选
  if (location && location !== 'all') {
    whereCondition.location = location;
  }
  
  // 药材名称模糊查询
  if (drugName) {
    whereCondition.drugName = db.RegExp({
      regexp: drugName,
      options: 'i'
    });
  }
  
  // 患者名称模糊查询
  if (patient) {
    whereCondition.patient = db.RegExp({
      regexp: patient,
      options: 'i'
    });
  }
  
  // 操作医生筛选
  if (operator) {
    whereCondition.operatorId = operator;
  }
  
  const listRes = await db.collection('clinic_usage')
    .where(whereCondition)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();
  
  return {
    success: true,
    data: {
      list: listRes.data,
      page,
      pageSize
    }
  };
}

// Q4: 入库记录查询
async function queryInbound(params) {
  const {
    startDate,
    endDate,
    manufacturer,
    drugName,
    operator,
    page = 1,
    pageSize = 50
  } = params;
  
  let whereCondition = {};
  
  // 日期范围
  if (startDate && endDate) {
    whereCondition.createTime = _.gte(new Date(startDate))
      .and(_.lte(new Date(endDate + ' 23:59:59')));
  }
  
  // 厂家模糊查询
  if (manufacturer) {
    whereCondition.manufacturer = db.RegExp({
      regexp: manufacturer,
      options: 'i'
    });
  }
  
  // 药材名称模糊查询
  if (drugName) {
    whereCondition.drugName = db.RegExp({
      regexp: drugName,
      options: 'i'
    });
  }
  
  // 操作人筛选
  if (operator) {
    whereCondition.operatorId = operator;
  }
  
  const listRes = await db.collection('in_records')
    .where(whereCondition)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();
  
  // 计算距有效期天数 🔥
  const today = new Date();
  const recordsWithExpiry = listRes.data.map(record => {
    const daysToExpiry = Math.ceil(
      (new Date(record.expiryDate) - today) / (1000 * 60 * 60 * 24)
    );
    return {
      ...record,
      daysToExpiry
    };
  });
  
  return {
    success: true,
    data: {
      list: recordsWithExpiry,
      page,
      pageSize
    }
  };
}

// Q5: 出库记录查询
async function queryOutbound(params) {
  const {
    startDate,
    endDate,
    location,
    department,
    drugName,
    page = 1,
    pageSize = 50
  } = params;
  
  let whereCondition = {};
  
  // 日期范围
  if (startDate && endDate) {
    whereCondition.createTime = _.gte(new Date(startDate))
      .and(_.lte(new Date(endDate + ' 23:59:59')));
  }
  
  // 园区筛选
  if (location && location !== 'all') {
    whereCondition.location = location;
  }
  
  // 部门模糊查询
  if (department) {
    whereCondition.department = db.RegExp({
      regexp: department,
      options: 'i'
    });
  }
  
  // 药材名称模糊查询
  if (drugName) {
    whereCondition.drugName = db.RegExp({
      regexp: drugName,
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
  const recordsWithExpiry = listRes.data.map(record => {
    const daysToExpiry = Math.ceil(
      (new Date(record.expiryDate) - today) / (1000 * 60 * 60 * 24)
    );
    return {
      ...record,
      daysToExpiry
    };
  });
  
  return {
    success: true,
    data: {
      list: recordsWithExpiry,
      page,
      pageSize
    }
  };
}

// Q6: 盘点历史查询
async function queryCheck(params) {
  const {
    month,  // YYYY-MM
    location,
    drugName,
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
  
  // 药材名称模糊查询
  if (drugName) {
    whereCondition.drugName = db.RegExp({
      regexp: drugName,
      options: 'i'
    });
  }
  
  const listRes = await db.collection('stock_check')
    .where(whereCondition)
    .orderBy('checkTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();
  
  // 计算距有效期天数 🔥
  const today = new Date();
  const recordsWithExpiry = listRes.data.map(record => {
    const daysToExpiry = Math.ceil(
      (new Date(record.expiryDate) - today) / (1000 * 60 * 60 * 24)
    );
    return {
      ...record,
      daysToExpiry
    };
  });
  
  return {
    success: true,
    data: {
      list: recordsWithExpiry,
      page,
      pageSize
    }
  };
}



