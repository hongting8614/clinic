// cloudfunctions/clinicRecords/index.js
// 门诊用药登记云函数 - v3.2核心功能
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { action, data } = event;
  const wxContext = cloud.getWXContext();
  
  try {
    switch(action) {
      case 'add':
        return await addRecord(data, wxContext);
      case 'list':
        return await getList(data);
      case 'detail':
        return await getDetail(data);
      case 'delete':
        return await deleteRecord(data, wxContext);
      case 'getStats':
        return await getStats(data);
      case 'getTodayCount':
        return await getTodayCount(data);
      case 'saveTemplate':
        return await saveTemplate(data, wxContext);
      case 'getTemplates':
        return await getTemplates(data, wxContext);
      case 'seedTestRecords':
        return await seedTestRecords(data, wxContext);
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
    userId: user.userId || ''
  };
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
    doctorSign,
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
  
  // 如果有用药信息，处理药品相关逻辑
  let drug = null;
  let batch = null;
  let quantityPack = 0;
  
  if (hasDrugUsage) {
    // 计算包装单位数量
    quantityPack = quantityMin / (conversionRate || 1);
    
    // 获取药品信息
    const drugRes = await db.collection('drugs').doc(drugId).get();
    if (!drugRes.data) {
      return {
        success: false,
        error: '药品不存在'
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
          error: '该园区该药品库存不足'
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
    doctorSign: doctorSign || '',
    signTime: signTime || '',
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
  
  // 药品名称模糊查询
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

// 获取统计数据
async function getStats(data) {
  const {
    location,
    startDate,
    endDate,
    groupBy = 'day'  // day | drug | location
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
      count: _.sum(1),
      totalQuantityMin: _.sum('$quantityMin'),
      totalQuantityPack: _.sum('$quantityPack'),
      patients: _.addToSet('$patient')
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


