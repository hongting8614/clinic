// cloudfunctions/clinicRecords/index.js
// 门诊用药登记云函数 - v3.2核心功能
const cloud = require('wx-server-sdk');
const crypto = require('crypto');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

exports.main = async (event, context) => {
  const { action, data } = event;
  const wxContext = cloud.getWXContext();
  
  try {
    switch(action) {
      case 'add':
        return await addRecord(data, wxContext);
      case 'list':
        return await getList(data);
      case 'listPrescriptions':
        return await listPrescriptions(data);
      case 'detail':
        return await getDetail(data);
      case 'delete':
        return await deleteRecord(data, wxContext);
      case 'getSummary':
        return await getSummary(data);
      case 'seedMockData':
        return await seedMockData(data, wxContext);
      case 'getStats':
        return await getStats(data);
      case 'getTodayCount':
        return await getTodayCount(data);
      case 'getTopDrugs':
        return await getTopDrugs(data);
      case 'getTopDiseases':
        return await getTopDiseases(data);
      case 'getDailyUsageStats':
        return await getDailyUsageStats(data);
      case 'saveTemplate':
        return await saveTemplate(data, wxContext);
      case 'getTemplates':
        return await getTemplates(data, wxContext);
      case 'seedTestRecords':
        return await seedTestRecords(data, wxContext);
      case 'verifySignature':
        return await verifySignature(data);
      default:
        return { success: false, error: '未知操作' };
    }
  } catch (err) {
    console.error('[clinicRecords Error]', err);
    return {
      success: false,
      error: err.message || '服务器错误'
    };
  }
};

// 根据 OPENID 获取业务用户ID
async function getUserByOpenId(openid) {
  const res = await db.collection('users')
    .where({ openid, status: 'active' })
    .limit(1)
    .get();

  if (!res.data.length) {
    throw new Error('用户不存在或未绑定 OPENID');
  }

  const user = res.data[0];
  return {
    userDbId: user._id,
    userId: user.userId || '',
    name: user.name || '',
    stampImage: user.stampImage || ''
  };
}

// —— 电子签名哈希相关工具 —— //
// 构建需要参与签名保护的字段载荷（保持固定字段顺序）
function buildSignaturePayload(record) {
  const payload = {
    visitDateTime: record.visitDateTime || '',
    name: record.name || '',
    gender: record.gender || '',
    age: record.age || '',
    identity: record.identity || '',
    location: record.location || '',
    visitType: record.visitType || '',
    isOutcall: !!record.isOutcall,
    injuryLocation: record.injuryLocation || '',
    chiefComplaint: record.chiefComplaint || '',
    symptom: record.symptom || '',
    diseaseName: record.diseaseName || '',
    diagnosis: record.diagnosis || '',
    treatment: record.treatment || '',
    remark: record.remark || '',
    drugInfo: record.drugInfo || null
  };
  return JSON.stringify(payload);
}

function calcSignatureHash(payloadStr) {
  return crypto
    .createHash('sha256')
    .update(payloadStr, 'utf8')
    .digest('hex');
}

// 添加门诊用药记录
async function addRecord(data, wxContext) {
  const {
    // 用药相关字段
    drugId,
    drugName,
    specification,
    batchId,
    location,          // 园区字段
    quantityMin,       // 最小单位数量
    minUnit,
    packUnit,
    conversionRate,
    patient,
    symptom,
    // 完整门诊登记信息
    visitDateTime,
    name,
    gender,
    age,
    identity,
    visitType,
    isOutcall,
    injuryLocation,
    chiefComplaint,
    diseaseName,
    diagnosis,
    treatment,
    remark,
    doctorSign, // 前端传入的签名字段将被服务器端医生名戳覆盖
    signTime,
    drugInfo
  } = data;
  
  // 是否存在有效的用药登记（drugId + 数量）
  const hasDrugUsage = !!(drugId && quantityMin);

  // 参数验证（支持无用药的门诊登记）
  if (!location) {
    return {
      success: false,
      error: '缺少必填参数：园区'
    };
  }
  
  // 如果有用药信息（drugId + 数量），验证必填字段
  if (hasDrugUsage && (!patient && !name)) {
    return {
      success: false,
      error: '用药登记缺少必填参数'
    };
  }
  
  // 验证园区
  const validLocations = ['land_park', 'water_park', 'clinic_storage'];
  if (!validLocations.includes(location)) {
    return {
      success: false,
      error: '无效的园区标识'
    };
  }
  
  // 如果有用药信息，处理药材相关逻辑
  let drug = null;
  let batch = null;
  let quantityPack = 0;
  
  if (hasDrugUsage) {
    // 计算包装单位数量
    quantityPack = quantityMin / (conversionRate || 1);
    
    // 获取药材信息
    const drugRes = await db.collection('drugs').doc(drugId).get();
    if (!drugRes.data) {
      return {
        success: false,
        error: '药材不存在'
      };
    }
    drug = drugRes.data;
    
    // 选择批次（FIFO：按有效期最早）
    if (batchId) {
      // 指定批次
      const batchRes = await db.collection('stock')
        .where({
          drugId: drugId,
          _id: batchId,
          location: location,
          quantity: _.gt(0)
        })
        .get();
      
      if (!batchRes.data.length) {
        return {
          success: false,
          error: '指定批次不存在或库存不足'
        };
      }
      batch = batchRes.data[0];
    } else {
      // 自动选择批次（FIFO）
      const batchesRes = await db.collection('stock')
        .where({
          drugId: drugId,
          location: location,
          quantity: _.gt(0)
        })
        .orderBy('expiryDate', 'asc')  // FIFO：先进先出
        .limit(1)
        .get();
      
      if (!batchesRes.data.length) {
        return {
          success: false,
          error: '该园区该药材库存不足'
        };
      }
      batch = batchesRes.data[0];
    }
    
    // 验证园区库存是否充足（最小单位）
    if (batch.quantity < quantityMin) {
      return {
        success: false,
        error: `库存不足，当前库存：${batch.quantity}${minUnit}，需要：${quantityMin}${minUnit}`
      };
    }
  }
  
  // 生成ID
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const recordId = `CU${dateStr}${randomStr}`;

  // 1. 创建门诊登记记录（完整信息）
  const clinicRecordData = {
    _id: recordId,
    visitDateTime: visitDateTime || now,
    name: name || patient || '',
    gender: gender || '',
    age: age || null,
    identity: identity || '游客',
    location: location,          // 园区字段
    visitType: visitType || 'clinic',
    isOutcall: isOutcall || (visitType === 'outcall'),
    injuryLocation: injuryLocation || '',
    chiefComplaint: chiefComplaint || symptom || '',
    diseaseName: diseaseName || '',
    diagnosis: diagnosis || '',
    treatment: treatment || '',
    remark: remark || '',
    // doctorSign / signTime 将在后续基于当前登录医生自动生成电子名戳
    doctorSign: doctorSign || '',
    signTime: signTime || now,
    operatorId: wxContext.OPENID,
    createTime: now
  };

  // 如果有用药信息，添加到记录中
  if (hasDrugUsage) {
    clinicRecordData.drugId = drugId;
    clinicRecordData.drugName = drugName || drug.name;
    clinicRecordData.specification = specification || drug.specification;
    clinicRecordData.batchId = batch._id;
    clinicRecordData.batch = batch.batch;
    clinicRecordData.quantityMin = quantityMin;
    clinicRecordData.quantityPack = quantityPack;
    clinicRecordData.minUnit = minUnit || drug.minUnit;
    clinicRecordData.packUnit = packUnit || drug.packUnit;
    clinicRecordData.patient = patient || name || '';
    clinicRecordData.symptom = symptom || chiefComplaint || '';
    // 记录用药信息文本（优先使用前端传入的drugInfo，否则拼接药名+数量+单位）
    const composedDrugInfo = `${clinicRecordData.drugName || ''}${quantityMin ? ' ' + quantityMin : ''}${clinicRecordData.minUnit || ''}`;
    clinicRecordData.drugInfo = drugInfo || composedDrugInfo;
  }

  // 基于当前医生账号自动生成电子名戳，并计算签名哈希（防篡改）
  try {
    let signedBy = null;
    let signedByName = '';
    let doctorStamp = '';

    try {
      const userInfo = await getUserByOpenId(wxContext.OPENID);
      signedBy = userInfo.userId || userInfo.userDbId || null;
      signedByName = userInfo.name || '';
      doctorStamp = userInfo.stampImage || '';
    } catch (e) {
      console.error('[clinicRecords] 获取签名医生信息失败，将仅记录OPENID:', e);
      signedBy = wxContext.OPENID;
    }

    // 使用医生信息自动生成 doctorSign/signTime
    clinicRecordData.signedBy = signedBy;
    clinicRecordData.signedByName = signedByName;
    clinicRecordData.signedAt = now;
    // doctorSign 优先保存电子名章图片ID/URL，其次回退到医生姓名
    clinicRecordData.doctorSign = doctorStamp || signedByName || clinicRecordData.doctorSign || '';
    clinicRecordData.signTime = now;

    const payloadStr = buildSignaturePayload(clinicRecordData);
    const signatureHash = calcSignatureHash(payloadStr);

    clinicRecordData.signatureHash = signatureHash;
    clinicRecordData.signatureAlgo = 'SHA256';
    clinicRecordData.signatureStatus = 'signed';
    clinicRecordData.signatureVersion = 1;
  } catch (e) {
    console.error('[clinicRecords] 计算电子签名哈希失败，将以未签名状态保存记录:', e);
    clinicRecordData.signatureStatus = 'unsigned';
  }

  // 保存到 clinic_records 集合（完整门诊登记信息）
  await db.collection('clinic_records').add({
    data: clinicRecordData
  });

  // 2. 如果有用药信息，同时保存到 clinic_usage 集合（用于用药统计）
  if (hasDrugUsage) {
    await db.collection('clinic_usage').add({
      data: {
        _id: recordId,
        drugId: drugId,
        drugName: drugName || drug.name,
        specification: specification || drug.specification,
        batchId: batch._id,
        batch: batch.batch,
        location: location,          // 园区字段
        quantityMin: quantityMin,
        quantityPack: quantityPack,
        minUnit: minUnit || drug.minUnit,
        packUnit: packUnit || drug.packUnit,
        patient: patient || name || '',
        symptom: symptom || chiefComplaint || '',
        operatorId: wxContext.OPENID,
        createTime: now
      }
    });
  }

  // 3. 如果有用药信息，扣减园区库存（最小单位）
  if (hasDrugUsage) {
    // 园区库存已经是最小单位，直接扣减quantityMin
    await db.collection('stock').doc(batch._id).update({
      data: {
        quantity: _.inc(-quantityMin),  // 直接扣减最小单位数量
        updateTime: now
      }
    });
  }

  // 4. 记录操作日志
  await db.collection('operation_logs').add({
    data: {
      type: 'clinic_records',
      action: 'add',
      recordId: recordId,
      drugId: drugId || null,
      drugName: drugName || (drug ? drug.name : null) || null,
      location: location,
      quantity: quantityMin || null,
      unit: minUnit || (drug ? drug.minUnit : null) || null,
      operator: wxContext.OPENID,
      createTime: now
    }
  });

  return {
    success: true,
    data: {
      _id: recordId,
      message: '门诊用药登记成功'
    }
  };
}

// 获取门诊用药列表
async function getList(data) {
  const {
    location,
    drugName,
    patient,
    startDate,
    endDate,
    page = 1,
    pageSize = 20,
    useClinicRecords = false  // 是否查询完整的门诊登记记录
  } = data;
  
  let whereCondition = {};
  const collectionName = useClinicRecords ? 'clinic_records' : 'clinic_usage';
  
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
  
  // 日期范围
  if (startDate && endDate) {
    whereCondition.createTime = _.gte(new Date(startDate))
      .and(_.lte(new Date(endDate + ' 23:59:59')));
  }
  
  // 查询总数
  const countRes = await db.collection(collectionName)
    .where(whereCondition)
    .count();
  
  // 查询列表
  const listRes = await db.collection(collectionName)
    .where(whereCondition)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();
  
  return {
    success: true,
    data: {
      list: listRes.data,
      total: countRes.total,
      page: page,
      pageSize: pageSize
    }
  };
}

// 获取详情
async function getDetail(data) {
  const { _id } = data;
  
  if (!_id) {
    return {
      success: false,
      error: '缺少记录ID'
    };
  }
  
  const res = await db.collection('clinic_usage').doc(_id).get();
  
  if (!res.data) {
    return {
      success: false,
      error: '记录不存在'
    };
  }
  
  return {
    success: true,
    data: res.data
  };
}

// 处方/用药记录查询（基于 clinic_records，仅返回含用药信息的门诊记录）
async function listPrescriptions(data) {
  const {
    location,
    patient,      // 患者姓名
    drugName,     // 药名关键字（匹配 drugName 或 drugInfo）
    startDate,
    endDate,
    page = 1,
    pageSize = 20
  } = data || {};

  const whereCondition = {};

  // 只查包含处方/用药信息的记录
  whereCondition.drugInfo = _.neq(null);

  // 园区筛选
  if (location && location !== 'all') {
    whereCondition.location = location;
  }

  // 患者姓名模糊查询
  if (patient) {
    whereCondition.name = db.RegExp({
      regexp: patient,
      options: 'i'
    });
  }

  // 药名关键字：匹配 drugName 或 drugInfo 文本
  if (drugName) {
    const kw = db.RegExp({ regexp: drugName, options: 'i' });
    whereCondition[_.or ? _.or : '$or'] = [
      { drugName: kw },
      { drugInfo: kw }
    ];
  }

  // 日期范围：按 visitDateTime 过滤
  if (startDate && endDate) {
    whereCondition.visitDateTime = _.gte(new Date(startDate))
      .and(_.lte(new Date(endDate + ' 23:59:59')));
  }

  // 查询总数
  const countRes = await db.collection('clinic_records')
    .where(whereCondition)
    .count();

  // 查询列表
  const listRes = await db.collection('clinic_records')
    .where(whereCondition)
    .orderBy('visitDateTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();

  return {
    success: true,
    data: {
      list: listRes.data,
      total: countRes.total,
      page,
      pageSize
    }
  };
}

// 删除记录（需要权限控制）
async function deleteRecord(data, wxContext) {
  const { _id } = data;
  
  if (!_id) {
    return {
      success: false,
      error: '缺少记录ID'
    };
  }
  
  // 获取记录信息
  const record = await db.collection('clinic_usage').doc(_id).get();
  if (!record.data) {
    return {
      success: false,
      error: '记录不存在'
    };
  }
  
  // TODO: 添加权限验证
  // 只有管理员或记录创建者可以删除
  
  try {
    // 1. 删除记录
    await db.collection('clinic_usage').doc(_id).remove();
    
    // 2. 恢复库存（加回扣减的数量）
    // 园区库存使用最小单位，恢复时也使用最小单位 
    await db.collection('stock').doc(record.data.batchId).update({
      data: {
        quantity: _.inc(record.data.quantityMin),  // 修复：使用 quantityMin 而不是 quantityPack
        updateTime: new Date()
      }
    });
    
    // 3. 记录操作日志
    await db.collection('operation_logs').add({
      data: {
        type: 'clinic_usage',
        action: 'delete',
        recordId: _id,
        drugId: record.data.drugId,
        operator: wxContext.OPENID,
        createTime: new Date()
      }
    });
    
    return {
      success: true,
      message: '删除成功'
    };
  } catch (err) {
    console.error('[deleteRecord Error]', err);
    return {
      success: false,
      error: '删除失败：' + err.message
    };
  }
}

// 门诊总体概览统计（基于 clinic_records）
async function getSummary(data) {
  const { startDate, endDate, location } = data || {};

  const match = {};
  if (startDate && endDate) {
    match.visitDateTime = _.gte(new Date(startDate)).and(_.lte(new Date(endDate + ' 23:59:59')));
  }
  if (location && location !== 'all') {
    match.location = location;
  }

  const res = await db.collection('clinic_records')
    .where(match)
    .get();

  const list = res.data || [];

  let total = 0;
  let visitorCount = 0;
  let employeeCount = 0;
  let outcallCount = 0;

  list.forEach(r => {
    total += 1;
    const identity = r.identity || '游客';
    const isEmployee = identity === '员工';
    if (isEmployee) employeeCount += 1; else visitorCount += 1;

    const isOut = r.isOutcall || r.visitType === 'outcall';
    if (isOut) outcallCount += 1;
  });

  return {
    success: true,
    data: {
      total,
      visitorCount,
      employeeCount,
      outcallCount
    }
  };
}

// 门诊日消耗统计（基于 clinic_usage）
async function getDailyUsageStats(data) {
  const { date, location } = data || {};

  if (!date) {
    return {
      success: false,
      error: '缺少必填参数：date'
    };
  }

  const start = new Date(date + ' 00:00:00');
  const end = new Date(date + ' 23:59:59');

  let matchCondition = {
    createTime: _.gte(start).and(_.lte(end))
  };

  if (location && location !== 'all') {
    matchCondition.location = location;
  }

  // 直接统计：记录数、总用量（最小单位）、药材种类数
  const aggRes = await db.collection('clinic_usage')
    .aggregate()
    .match(matchCondition)
    .group({
      _id: null,
      totalRecords: $.sum(1),
      totalQuantityMin: $.sum('$quantityMin'),
      totalQuantityPack: $.sum('$quantityPack'),
      patients: $.addToSet('$patient'),
      // 为按药材相关的统计预留基础字段
      drugName: $.first('$drugName'),
      specification: $.first('$specification')
    })
    .end();

  if (!aggRes.list || aggRes.list.length === 0) {
    return {
      success: true,
      data: {
        totalRecords: 0,
        totalQuantityMin: 0,
        totalDrugs: 0
      }
    };
  }

  const row = aggRes.list[0];

  return {
    success: true,
    data: {
      totalRecords: row.totalRecords || 0,
      totalQuantityMin: row.totalQuantityMin || 0,
      totalDrugs: (row.drugs || []).length
    }
  };
}

// 获取统计数据
async function getStats(data) {
  const {
    location,
    startDate,
    endDate,
    groupBy = 'day'  // day | drug | location | day_drug
  } = data;
  
  let matchCondition = {};
  
  if (location && location !== 'all') {
    matchCondition.location = location;
  }
  
  if (startDate && endDate) {
    matchCondition.createTime = _.gte(new Date(startDate))
      .and(_.lte(new Date(endDate + ' 23:59:59')));
  }
  
  let groupField;
  switch(groupBy) {
    case 'day':
      groupField = {
        year: { $year: '$createTime' },
        month: { $month: '$createTime' },
        day: { $dayOfMonth: '$createTime' }
      };
      break;
    case 'day_drug':
      // 按日期 + 药材聚合日消耗
      groupField = {
        date: {
          year: { $year: '$createTime' },
          month: { $month: '$createTime' },
          day: { $dayOfMonth: '$createTime' }
        },
        drugId: '$drugId'
      };
      break;
    case 'drug':
      groupField = '$drugId';
      break;
    case 'location':
      groupField = '$location';
      break;
    default:
      groupField = '$location';
  }
  
  const res = await db.collection('clinic_usage')
    .aggregate()
    .match(matchCondition)
    .group({
      _id: groupField,
      count: $.sum(1),
      totalQuantityMin: $.sum('$quantityMin'),
      totalQuantityPack: $.sum('$quantityPack'),
      patients: $.addToSet('$patient'),
      // 为按药材相关的统计预留基础字段
      drugName: $.first('$drugName'),
      specification: $.first('$specification')
    })
    .end();
  
  // 格式化数据
  const formattedData = res.list.map(item => ({
    ...item,
    patientCount: item.patients ? item.patients.length : 0
  }));
  
  return {
    success: true,
    data: formattedData
  };
}

// 获取今日登记数量
async function getTodayCount(data) {
  const { location } = data;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  let whereCondition = {
    createTime: _.gte(today).and(_.lt(tomorrow))
  };
  
  if (location && location !== 'all') {
    whereCondition.location = location;
  }
  
  const countRes = await db.collection('clinic_usage')
    .where(whereCondition)
    .count();
  
  return {
    success: true,
    data: {
      count: countRes.total
    }
  };
}

// 高发疾病 TOP 统计（基于 clinic_records）
async function getTopDiseases(data) {
  const {
    location,
    startDate,
    endDate,
    limit = 10
  } = data || {};

  const match = {};

  if (location && location !== 'all') {
    match.location = location;
  }

  if (startDate && endDate) {
    match.visitDateTime = _.gte(new Date(startDate))
      .and(_.lte(new Date(endDate + ' 23:59:59')));
  }

  const res = await db.collection('clinic_records')
    .where(match)
    .get();

  const map = {};
  (res.data || []).forEach(r => {
    const key = (r.diseaseName || r.diagnosis || r.chiefComplaint || '未填').trim() || '未填';
    if (!map[key]) {
      map[key] = { name: key, count: 0 };
    }
    map[key].count += 1;
  });

  const list = Object.values(map)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  const total = list.reduce((sum, i) => sum + i.count, 0) || 1;

  const withRatio = list.map(i => ({
    name: i.name,
    count: i.count,
    ratio: +(i.count * 100 / total).toFixed(1)
  }));

  return {
    success: true,
    data: withRatio
  };
}

// 获取用药 TOP 列表
async function getTopDrugs(data) {
  const {
    location,
    startDate,
    endDate,
    limit = 10
  } = data || {};
  const buildMatch = (withDate) => {
    const cond = {};
    if (location && location !== 'all') {
      cond.location = location;
    }
    if (withDate && startDate && endDate) {
      // 使用 createTime 做时间筛选，兼容历史用药记录
      cond.createTime = _.gte(new Date(startDate))
        .and(_.lte(new Date(endDate + ' 23:59:59')));
    }
    return cond;
  };

  // 先按日期范围统计
  let matchCondition = buildMatch(true);

  const runAgg = async (match) => {
    return db.collection('clinic_usage')
      .aggregate()
      .match(match)
      .group({
        _id: '$drugId',
        drugName: $.first('$drugName'),
        specification: $.first('$specification'),
        totalQuantityMin: $.sum('$quantityMin'),
        totalQuantityPack: $.sum('$quantityPack'),
        patients: $.addToSet('$patient'),
        minUnit: $.first('$minUnit')
      })
      .sort({
        totalQuantityMin: -1
      })
      .limit(limit)
      .end();
  };

  let res = await runAgg(matchCondition);

  // 如果当前日期范围内没有用药记录，则自动忽略日期，只按园区统计
  if (!res.list || !res.list.length) {
    matchCondition = buildMatch(false);
    res = await runAgg(matchCondition);
  }

  const list = (res.list || []).map(item => ({
    drugId: item._id,
    drugName: item.drugName || '',
    specification: item.specification || '',
    totalQuantityMin: item.totalQuantityMin || 0,
    totalQuantityPack: item.totalQuantityPack || 0,
    minUnit: item.minUnit || '',
    patientCount: (item.patients || []).length
  }));

  return {
    success: true,
    data: list
  };
}

// 生成模拟门诊数据（仅用于开发测试）
async function seedMockData(data, wxContext) {
  const { days = 7, perDay = 10 } = data || {};

  const now = new Date();
  const clinicCol = db.collection('clinic_records');
  const usageCol = db.collection('clinic_usage');

  const diseases = ['上呼吸道感染', '发热', '头痛', '胃炎', '急性咽炎'];

  // 优先从 drugs 集合里取几种真实药品作为模拟用药
  let drugs = [];
  try {
    const drugRes = await db.collection('drugs')
      .limit(10)
      .get();
    if (drugRes.data && drugRes.data.length) {
      drugs = drugRes.data.map(d => ({
        drugId: d._id,
        drugName: d.name || d.drugName || '模拟药品',
        specification: d.specification || '',
        minUnit: d.minUnit || d.unit || ''
      }));
    }
  } catch (e) {
    console.error('seedMockData 加载真实药品失败，使用内置mock药品:', e);
  }

  // 如果没有取到真实药品，使用内置的几种常用药
  if (!drugs.length) {
    drugs = [
      { drugId: 'mock-ibuprofen', drugName: '布洛芬片', specification: '0.2g*24片/盒', minUnit: '片' },
      { drugId: 'mock-banlangen', drugName: '板蓝根颗粒', specification: '10g*20袋/盒', minUnit: '袋' },
      { drugId: 'mock-loratadine', drugName: '氯雷他定片', specification: '10mg*6片/板', minUnit: '片' }
    ];
  }

  const clinicDocs = [];
  const usageDocs = [];

  for (let d = 0; d < days; d++) {
    const dayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - d);
    const y = dayDate.getFullYear();
    const m = String(dayDate.getMonth() + 1).padStart(2, '0');
    const day = String(dayDate.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;

    for (let i = 0; i < perDay; i++) {
      const disease = diseases[Math.floor(Math.random() * diseases.length)];
      const isEmployee = Math.random() < 0.3;
      const isOutcall = Math.random() < 0.15;
      const location = Math.random() < 0.5 ? 'land_park' : 'water_park';

      const hour = 9 + Math.floor(Math.random() * 8);
      const visitTime = new Date(`${dateStr} ${String(hour).padStart(2, '0')}:00:00`);

      const name = `测试患者${d + 1}-${i + 1}`;

      const clinicRecord = {
        name,
        identity: isEmployee ? '员工' : '游客',
        diagnosis: disease,
        diseaseName: disease,
        chiefComplaint: disease,
        visitDate: dateStr,
        visitDateTime: visitTime,
        isOutcall,
        visitType: isOutcall ? 'outcall' : 'clinic',
        location,
        // 使用就诊时间作为 createTime，便于按日期范围统计
        createTime: visitTime,
        operatorId: wxContext?.OPENID || 'mock',
        _openid: wxContext?.OPENID || 'mock'
      };

      clinicDocs.push(clinicRecord);

      const usageCount = 1 + Math.floor(Math.random() * 2);
      for (let k = 0; k < usageCount; k++) {
        const drug = drugs[Math.floor(Math.random() * drugs.length)];
        const quantityMin = 2 + Math.floor(Math.random() * 6);

        usageDocs.push({
          patient: name,
          drugId: drug.drugId,
          drugName: drug.drugName,
          specification: drug.specification,
          quantityMin,
          quantityPack: null,
          minUnit: drug.minUnit,
          packUnit: null,
          location,
          visitDate: dateStr,
          visitDateTime: visitTime,
          // 与门诊记录保持一致，使用就诊时间作为 createTime
          createTime: visitTime,
          operatorId: wxContext?.OPENID || 'mock',
          _openid: wxContext?.OPENID || 'mock'
        });
      }
    }
  }

  const chunkSize = 20;
  const batchInsert = async (col, docs) => {
    for (let i = 0; i < docs.length; i += chunkSize) {
      const chunk = docs.slice(i, i + chunkSize);
      const tasks = chunk.map(doc => col.add({ data: doc }));
      await Promise.all(tasks);
    }
  };

  await batchInsert(clinicCol, clinicDocs);
  await batchInsert(usageCol, usageDocs);

  return {
    success: true,
    message: '模拟门诊数据已生成',
    data: {
      clinicCount: clinicDocs.length,
      usageCount: usageDocs.length,
      days,
      perDay
    }
  };
}

// 保存门诊自定义模板（按业务用户隔离）
async function saveTemplate(data, wxContext) {
  const { OPENID } = wxContext;
  const { disease, key, label, chiefComplaint, symptom, diagnosis, treatment } = data || {};

  if (!disease || !label || !chiefComplaint) {
    return { success: false, error: '缺少必要字段' };
  }

  const { userDbId, userId } = await getUserByOpenId(OPENID);

  const tplData = {
    userDbId,
    userId,
    openid: OPENID,
    disease,
    key: key || `custom_${Date.now()}`,
    label,
    chiefComplaint,
    symptom: symptom || '',
    diagnosis: diagnosis || '',
    treatment: treatment || '',
    createTime: new Date()
  };

  await db.collection('clinic_templates').add({ data: tplData });

  return {
    success: true,
    data: tplData
  };
}

// 获取当前业务用户的门诊模板
async function getTemplates(data, wxContext) {
  const { OPENID } = wxContext;
  const { disease } = data || {};

  const { userDbId } = await getUserByOpenId(OPENID);

  const where = { userDbId };
  if (disease) {
    where.disease = disease;
  }

  const res = await db.collection('clinic_templates')
    .where(where)
    .orderBy('createTime', 'desc')
    .get();

  return {
    success: true,
    list: res.data
  };
}

// 校验门诊记录电子签名是否有效（防篡改校验）
async function verifySignature(data) {
  const { _id } = data || {};

  if (!_id) {
    return { success: false, error: '缺少记录ID' };
  }

  const res = await db.collection('clinic_records').doc(_id).get();
  const record = res.data;

  if (!record) {
    return { success: false, error: '记录不存在' };
  }

  // 未签名或缺少哈希时，直接返回未签名状态
  if (!record.signatureHash || record.signatureStatus === 'unsigned') {
    return {
      success: true,
      data: {
        status: 'unsigned',
        valid: false,
        reason: '记录未进行电子签名或缺少签名哈希'
      }
    };
  }

  try {
    const payloadStr = buildSignaturePayload(record);
    const hashNow = calcSignatureHash(payloadStr);
    const match = hashNow === record.signatureHash;

    const status = match && record.signatureStatus === 'signed'
      ? 'signed'
      : 'invalid';

    return {
      success: true,
      data: {
        status,
        valid: match && record.signatureStatus === 'signed',
        hashStored: record.signatureHash,
        hashRecalc: hashNow,
        signatureAlgo: record.signatureAlgo || 'SHA256',
        signedBy: record.signedBy || null,
        signedByName: record.signedByName || '',
        signedAt: record.signedAt || record.signTime || null
      }
    };
  } catch (e) {
    console.error('[clinicRecords.verifySignature] 校验失败:', e);
    return {
      success: false,
      error: '签名校验失败：' + (e.message || '未知错误')
    };
  }
}
