const cloud = require('wx-server-sdk')
const PDFDocument = require('pdfkit')
const ExcelJS = require('exceljs')
const path = require('path')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event
  try {
    switch (action) {
      case 'inboundReport':
        return await inboundReport(data)
      case 'inboundDetailReport':
        return await inboundDetailReport(data)
      case 'outboundReport':
        return await outboundReport(data)
      case 'outboundDetailReport':
        return await outboundDetailReport(data)
      case 'stockReport':
        return await stockReport(data)
      case 'exportInboundPDF':
        return await exportInboundPDF(data)
      case 'exportOutboundPDF':
        return await exportOutboundPDF(data)
      case 'exportStockPDF':
        return await exportStockPDF(data)
      case 'exportInboundExcel':
        return await exportInboundExcel(data)
      case 'exportOutboundExcel':
        return await exportOutboundExcel(data)
      case 'exportStockExcel':
        return await exportStockExcel(data)
      case 'exportClinicExcel':
        return await exportClinicExcel(data)
      case 'exportClinicPDF':
        return await exportClinicPDF(data)
      case 'exportClinicUsageExcel':
        return await exportClinicUsageExcel(data)
      case 'exportClinicStatsExcel':
        return await exportClinicStatsExcel(data)
      case 'inventorySummaryReport':
        return await inventorySummaryReport(data)
      case 'transferReport':
        return await transferReport(data)
      case 'exportParkStockExcel':
        return await exportParkStockExcel(data)
      default:
        return { success: false, message: 'Unknown action' }
    }
  } catch (e) {
    console.error(e)
    return { success: false, message: e.message || 'failed' }
  }
}

async function inboundReport(params = {}) {
  const {
    startDate,
    endDate,
    operator,
    recordNo,
    drugName,
    status = '',
    includeDraft = false
  } = params

  const records = await fetchInboundRecords({
    startDate,
    endDate,
    operator,
    recordNo,
    status,
    includeDraft
  })

  let filteredRecords = records
  if (drugName) {
    const key = String(drugName).trim().toLowerCase()
    filteredRecords = records.filter(r =>
      (r.items || []).some(it => (it.drugName || '').toLowerCase().includes(key))
    )
  }

  const mapped = filteredRecords.map(r => {
    const totalQuantity = (r.items || []).reduce((s, it) => s + (it.quantity || 0), 0)
    const totalAmount = (r.items || []).reduce((s, it) => s + ((it.price || 0) * (it.quantity || 0)), 0)
    return {
      _id: r._id,
      recordNo: r.recordNo,
      createTime: r.createTime,
      operator: r.operator || '',
      status: r.status,
      remark: r.remark || '',
      operatorSign: r.operatorSign || '',
      operatorSignText: r.operatorSign && typeof r.operatorSign === 'string' ? r.operatorSign : (r.operator || ''),
      reviewer: r.reviewer || '',
      reviewerSignText: r.reviewerSign && typeof r.reviewerSign === 'string' ? r.reviewerSign : (r.reviewer || ''),
      drugCount: (r.items || []).length,
      totalQuantity,
      totalAmount: Number(totalAmount.toFixed(2))
    }
  })

  const totalRecords = mapped.length
  const totalDrugs = mapped.reduce((s, r) => s + r.drugCount, 0)
  const totalQuantity = mapped.reduce((s, r) => s + r.totalQuantity, 0)
  const totalAmount = Number(mapped.reduce((s, r) => s + r.totalAmount, 0).toFixed(2))

  const statistics = {
    totalRecords,
    totalDrugs,
    totalQuantity,
    totalAmount
  }

  const filters = normalizeFilters({
    startDate,
    endDate,
    operator,
    recordNo,
    drugName,
    status,
    includeDraft
  })

  return {
    success: true,
    data: {
      filters,
      statistics,
      records: mapped
    }
  }
}

async function inboundDetailReport(params = {}) {
  const {
    startDate,
    endDate,
    operator,
    recordNo,
    drugName,
    batchNo,
    status = '',
    includeDraft = false
  } = params

  const records = await fetchInboundRecords({
    startDate,
    endDate,
    operator,
    recordNo,
    status,
    includeDraft
  })

  let details = []
  records.forEach(record => {
    (record.items || []).forEach((item, index) => {
      const specInfo = parseSpecification(item.specification || item.spec || '') || null
      const conversionRate = specInfo?.conversionRate || 0
      const convertedQuantity = conversionRate > 1
        ? Number(((item.quantity || 0) * conversionRate).toFixed(2))
        : null
      details.push({
        recordId: record._id,
        recordNo: record.recordNo,
        date: record.createTime,
        drugName: item.drugName || '',
        specification: item.specification || item.spec || '',
        unit: item.unit || '',
        batchNo: item.batch || '',
        productionDate: item.productionDate || '',
        expireDate: item.expireDate || '',
        manufacturer: item.manufacturer || '',
        quantity: Number(item.quantity || 0),
        price: Number(item.price || 0),
        amount: Number(((item.price || 0) * (item.quantity || 0)).toFixed(2)),
        operator: record.operator || '',
        status: record.status,
        remark: record.remark || '',
        convertedQuantity,
        convertedUnit: specInfo?.minUnit || '',
        conversionRate: conversionRate || null
      })
    })
  })

  if (drugName) {
    const key = String(drugName).trim().toLowerCase()
    details = details.filter(d => d.drugName.toLowerCase().includes(key))
  }
  if (batchNo) {
    const batchKey = String(batchNo).trim().toLowerCase()
    details = details.filter(d => (d.batchNo || '').toLowerCase().includes(batchKey))
  }

  details.sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime()
    const dateB = new Date(b.date || 0).getTime()
    return dateB - dateA
  })

  const statistics = {
    totalRecords: details.length,
    totalDrugs: new Set(details.map(d => d.drugName)).size,
    totalQuantity: details.reduce((sum, d) => sum + (d.quantity || 0), 0),
    totalAmount: Number(details.reduce((sum, d) => sum + (d.amount || 0), 0).toFixed(2))
  }

  const filters = normalizeFilters({
    startDate,
    endDate,
    operator,
    recordNo,
    drugName,
    batchNo,
    status,
    includeDraft
  })

  return {
    success: true,
    data: {
      filters,
      statistics,
      details
    }
  }
}

async function stockReport(params = {}) {
  const {
    category = '',
    stockFilter = 'all',
    expiryFilter = 'all'
  } = params

  let query = db.collection('stock')
  if (category) {
    query = query.where({ category })
  }

  let items = []
  let skip = 0
  const limit = 100
  while (true) {
    const res = await query.skip(skip).limit(limit).get()
    items = items.concat(res.data || [])
    if (!res.data || res.data.length < limit) break
    skip += limit
  }

  const now = Date.now()
  items = items.map(i => {
    const expireTime = i.expireDate ? new Date(i.expireDate).getTime() : null
    const nearExpiry = expireTime ? (expireTime - now) <= 90 * 86400000 : false
    const totalValue = Number(((i.price || 0) * (i.quantity || 0)).toFixed(2))
    const specInfo = i.specInfo || parseSpecification(i.specification || '')
    const conversionRate = specInfo?.conversionRate || 0
    const convertedQuantity = conversionRate > 1
      ? Number(((i.quantity || 0) * conversionRate).toFixed(2))
      : null
    return {
      ...i,
      nearExpiry,
      totalValue,
      convertedQuantity,
      convertedUnit: specInfo?.minUnit || '',
      conversionRate,
      statusText: getStockStatusText(i, nearExpiry)
    }
  })

  items = items.filter(i => {
    if (stockFilter === 'inStock') return (i.quantity || 0) > 0
    if (stockFilter === 'sufficient') return (i.quantity || 0) > (i.minStock || 10)
    if (stockFilter === 'warning') return (i.quantity || 0) > 0 && (i.quantity || 0) <= (i.minStock || 10)
    if (stockFilter === 'low') return (i.quantity || 0) > 0 && (i.quantity || 0) <= 5
    if (stockFilter === 'empty') return (i.quantity || 0) <= 0
    return true
  })

  if (expiryFilter === 'expired') items = items.filter(i => i.expireDate && new Date(i.expireDate) < new Date())
  if (expiryFilter === 'expiring1') items = items.filter(i => i.expireDate && (new Date(i.expireDate) - new Date()) <= 30 * 86400000)
  if (expiryFilter === 'expiring3') items = items.filter(i => i.expireDate && (new Date(i.expireDate) - new Date()) <= 90 * 86400000)
  if (expiryFilter === 'expiring6') items = items.filter(i => i.expireDate && (new Date(i.expireDate) - new Date()) <= 180 * 86400000)

  const enhancedItems = items.map(i => ({
    ...i,
    amount: Number(((i.quantity || 0) * (i.price || 0)).toFixed(2)),
    inboundDate: i.lastInTime || i.createTime || null,
    operator: i.lastInOperator || '',
    remark: i.remark || ''
  }))

  const statistics = {
    totalBatches: enhancedItems.length,
    totalDrugs: enhancedItems.length,
    totalStock: enhancedItems.reduce((s, i) => s + (i.quantity || 0), 0),
    totalValue: Number(enhancedItems.reduce((s, i) => s + (i.amount || 0), 0).toFixed(2)),
    lowStockCount: enhancedItems.filter(i => (i.quantity || 0) > 0 && (i.quantity || 0) <= (i.minStock || 10)).length,
    expiringCount: enhancedItems.filter(i => i.nearExpiry).length
  }

  const filters = {
    category: category || '',
    stockFilter,
    expiryFilter,
    text: [
      category ? `分类：${category}` : '分类：全部',
      `库存状态：${getStockFilterText(stockFilter)}`,
      `效期状态：${getExpiryFilterText(expiryFilter)}`
    ].join(' ｜ ')
  }

  return {
    success: true,
    data: {
      filters,
      statistics,
      items: enhancedItems
    }
  }
}

// ==================== 盘点汇总报表 ====================

async function inventorySummaryReport(params = {}) {
  const {
    startDate,
    endDate,
    status = 'all',      // draft / in_progress / completed / all
    location = 'all',    // all / land_park / water_park
    export: exportType = '', // '' | 'excel' | 'pdf'
    printUser = ''
  } = params

  // 1. 查询 inventory 集合
  const records = await fetchInventoryRecords({ startDate, endDate, status, location })

  // 2. 展开 details 生成行数据
  let rows = []
  records.forEach(rec => {
    const details = Array.isArray(rec.details) ? rec.details : []
    details.forEach(detail => {
      rows.push({
        recordId: rec._id,
        recordNo: rec.recordNo || '',
        date: rec.createTime,
        location: rec.location || 'all',
        operator: rec.operator || '',
        status: rec.status || '',
        drugName: detail.drugName || '',
        batchNo: detail.batchNo || '',
        unit: detail.unit || '',
        systemQty: Number(detail.systemQty || 0),
        actualQty: Number(typeof detail.actualQty === 'number' ? detail.actualQty : detail.systemQty || 0),
        diffQty: Number(typeof detail.diffQty === 'number' ? detail.diffQty : 0),
        remark: detail.remark || ''
      })
    })
  })

  // 按日期 + 单号排序（最新在前）
  rows.sort((a, b) => {
    const tA = new Date(a.date || 0).getTime()
    const tB = new Date(b.date || 0).getTime()
    if (tA !== tB) return tB - tA
    return (a.recordNo || '').localeCompare(b.recordNo || '')
  })

  // 3. 统计信息
  const statistics = {
    totalRows: rows.length,
    totalRecords: new Set(rows.map(r => r.recordNo)).size,
    totalDrugs: new Set(rows.map(r => `${r.drugName}|${r.batchNo}`)).size,
    totalSystemQty: rows.reduce((s, r) => s + (r.systemQty || 0), 0),
    totalActualQty: rows.reduce((s, r) => s + (r.actualQty || 0), 0),
    totalOverQty: rows.reduce((s, r) => s + (r.diffQty > 0 ? r.diffQty : 0), 0),
    totalShortQty: rows.reduce((s, r) => s + (r.diffQty < 0 ? Math.abs(r.diffQty) : 0), 0)
  }

  // 4. 过滤条件文本
  const filterParts = []
  if (startDate || endDate) {
    filterParts.push(`时间：${startDate || '——'} ~ ${endDate || '——'}`)
  } else {
    filterParts.push('时间：全部')
  }
  const statusTextMap = {
    all: '全部',
    draft: '草稿',
    in_progress: '进行中',
    completed: '已完成'
  }
  const locationTextMap = {
    all: '库存',
    land_park: '陆园',
    water_park: '水园'
  }
  filterParts.push(`状态：${statusTextMap[status] || '全部'}`)
  filterParts.push(`范围：${locationTextMap[location] || '全部'}`)

  const filters = {
    startDate: startDate || '',
    endDate: endDate || '',
    status,
    location,
    text: filterParts.join(' ｜ ')
  }

  // 5. 如果不导出文件，直接返回数据
  if (!exportType) {
    return {
      success: true,
      data: {
        filters,
        statistics,
        rows
      }
    }
  }

  // 6. 导出 Excel 或 PDF
  if (exportType === 'excel') {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('库存盘点汇总', {
      pageSetup: {
        paperSize: 9,
        orientation: 'landscape'
      }
    })

    worksheet.columns = [
      { key: 'index', width: 6 },
      { key: 'recordNo', width: 18 },
      { key: 'date', width: 14 },
      { key: 'location', width: 10 },
      { key: 'operator', width: 10 },
      { key: 'drugName', width: 16 },
      { key: 'batchNo', width: 14 },
      { key: 'unit', width: 8 },
      { key: 'systemQty', width: 10 },
      { key: 'actualQty', width: 10 },
      { key: 'diffQty', width: 10 },
      { key: 'remark', width: 20 }
    ]

    // 标题
    worksheet.mergeCells('A1', 'L1')
    const titleCell = worksheet.getCell('A1')
    titleCell.value = '库存盘点汇总表'
    titleCell.font = { name: '黑体', size: 20, bold: true }
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getRow(1).height = 36

    // 统计时间 + 制表人
    worksheet.mergeCells('A2', 'L2')
    const infoCell = worksheet.getCell('A2')
    infoCell.value = `统计时间：${startDate || '——'} ~ ${endDate || '——'}    制表人：${printUser || '——'}`
    infoCell.font = { name: '仿宋_GB2312', size: 12 }
    infoCell.alignment = { vertical: 'middle', horizontal: 'center' }

    // 表头
    const headerRow = worksheet.getRow(3)
    const headers = ['序号', '盘点单号', '盘点日期', '范围', '盘点人', '药材名称', '批号', '单位', '系统数量', '实盘数量', '差异数量', '备注']
    headers.forEach((h, idx) => {
      const cell = headerRow.getCell(idx + 1)
      cell.value = h
      cell.font = { name: '仿宋_GB2312', size: 11, bold: true }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    })

    // 数据行
    rows.forEach((row, index) => {
      const excelRow = worksheet.getRow(4 + index)
      excelRow.values = [
        index + 1,
        row.recordNo,
        formatDate(row.date),
        locationTextMap[row.location] || '库存',
        row.operator,
        row.drugName,
        row.batchNo,
        row.unit,
        row.systemQty,
        row.actualQty,
        row.diffQty,
        row.remark
      ]
      excelRow.font = { name: '仿宋_GB2312', size: 11 }
      excelRow.alignment = { vertical: 'middle', horizontal: 'center' }
      for (let c = 1; c <= 12; c++) {
        const cell = excelRow.getCell(c)
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      }
    })

    // 合计行
    const totalRow = worksheet.addRow([
      '合计',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      statistics.totalSystemQty,
      statistics.totalActualQty,
      statistics.totalOverQty - statistics.totalShortQty,
      ''
    ])
    totalRow.font = { name: '仿宋_GB2312', size: 11, bold: true }
    totalRow.alignment = { vertical: 'middle', horizontal: 'center' }

    const buffer = await workbook.xlsx.writeBuffer()
    const filename = `inventory_summary_${Date.now()}.xlsx`
    const upload = await cloud.uploadFile({
      cloudPath: `reports/${filename}`,
      fileContent: Buffer.from(buffer)
    })
    return { success: true, fileID: upload.fileID, filename }
  }

  if (exportType === 'pdf') {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 36 })
    const buffers = []
    doc.on('data', buffers.push.bind(buffers))
    const done = new Promise(resolve => doc.on('end', resolve))

    const fontDir = path.join(__dirname, 'fonts')
    const simheiFont = path.join(fontDir, 'SimHei.ttf')
    const fangsongFont = path.join(fontDir, 'FangSong_GB2312.ttf')
    doc.registerFont('HeiTi', simheiFont)
    doc.registerFont('FangSong', fangsongFont)

    drawPdfHeader(doc, '库存盘点汇总表', filters, statistics, printUser)

    const header = ['单号', '日期', '范围', '盘点人', '药材名称', '批号', '单位', '系统数量', '实盘数量', '差异数量', '备注']
    const widths = [80, 60, 45, 60, 80, 70, 40, 60, 60, 60, 120]

    // 水平居中表格
    const page = doc.page
    const usableWidth = page.width - page.margins.left - page.margins.right
    const tableWidth = widths.reduce((a, b) => a + b, 0)
    const offsetX = page.margins.left + Math.max(0, (usableWidth - tableWidth) / 2)
    doc.x = offsetX

    drawRow(doc, header, widths, true)
    rows.forEach(row => {
      drawRow(doc, [
        row.recordNo,
        formatDate(row.date),
        locationTextMap[row.location] || '库存',
        row.operator,
        row.drugName,
        row.batchNo,
        row.unit,
        row.systemQty,
        row.actualQty,
        row.diffQty,
        row.remark
      ], widths, false)
    })

    drawPdfFooter(doc, printUser)
    doc.end()
    await done

    const arrayBuffer = Buffer.concat(buffers)
    const upload = await cloud.uploadFile({
      cloudPath: `reports/inventory_summary_${Date.now()}.pdf`,
      fileContent: arrayBuffer
    })
    return { success: true, fileID: upload.fileID }
  }

  return { success: false, message: 'unsupported export type' }
}

// ==================== 调拨报表：北京欢乐谷医务室内药材调拔表 ====================

async function transferReport(params = {}) {
  const {
    startDate,
    endDate,
    status = 'all',          // all | draft | completed
    direction = 'all',       // all | land_to_water | water_to_land
    export: exportType = '', // '' | 'excel' | 'pdf'
    printUser = ''
  } = params

  // 1. 查询调拨记录
  const records = await fetchTransferRecords({ startDate, endDate, status, direction })

  // 2. 展开明细生成行数据
  const rows = []
  records.forEach(rec => {
    const items = Array.isArray(rec.items) ? rec.items : []
    items.forEach(item => {
      // 明细层的单位信息：优先使用记录中自带字段，其次尝试从规格解析
      let minUnit = item.minUnit || ''
      let packUnit = item.packUnit || item.unit || ''
      let conversionRate = item.conversionRate || 0
      if (!conversionRate || !minUnit) {
        const specInfo = parseSpecification(item.specification || item.spec || '')
        if (specInfo) {
          conversionRate = conversionRate || specInfo.conversionRate || 0
          minUnit = minUnit || specInfo.minUnit || ''
          packUnit = packUnit || specInfo.packUnit || ''
        }
      }

      const quantityMin = Number(item.quantityMin != null ? item.quantityMin : item.quantity || 0)
      let quantityPack = null
      if (conversionRate && conversionRate > 0) {
        quantityPack = Number((quantityMin / conversionRate).toFixed(2))
      }

      rows.push({
        recordId: rec._id,
        transferNo: rec.transferNo || rec.recordNo || '',
        date: rec.createTime,
        fromLocation: rec.fromLocation || '',
        toLocation: rec.toLocation || '',
        operator: rec.operator || '',
        status: rec.status || '',
        drugName: item.drugName || '',
        specification: item.specification || item.spec || '',
        unit: packUnit || item.unit || '',
        minUnit: minUnit || '',
        batchNo: item.batchNo || item.batch || '',
        quantityMin,
        quantityPack,
        remark: item.remark || rec.remark || ''
      })
    })
  })

  // 按日期 + 单号排序（最新在前）
  rows.sort((a, b) => {
    const tA = new Date(a.date || 0).getTime()
    const tB = new Date(b.date || 0).getTime()
    if (tA !== tB) return tB - tA
    return (a.transferNo || '').localeCompare(b.transferNo || '')
  })

  // 3. 统计信息
  const statistics = {
    totalRecords: new Set(rows.map(r => r.transferNo)).size,
    totalRows: rows.length,
    totalDrugs: new Set(rows.map(r => `${r.drugName}|${r.batchNo}`)).size,
    totalQuantityMin: rows.reduce((s, r) => s + (r.quantityMin || 0), 0)
  }

  // 4. 过滤条件文本
  const filterParts = []
  if (startDate || endDate) {
    filterParts.push(`时间：${startDate || '——'} ~ ${endDate || '——'}`)
  } else {
    filterParts.push('时间：全部')
  }
  const statusTextMap = {
    all: '全部',
    draft: '草稿',
    completed: '已完成'
  }
  const directionTextMap = {
    all: '全部方向',
    land_to_water: '陆园 → 水园',
    water_to_land: '水园 → 陆园'
  }
  filterParts.push(`状态：${statusTextMap[status] || '全部'}`)
  filterParts.push(`方向：${directionTextMap[direction] || '全部方向'}`)

  const filters = {
    startDate: startDate || '',
    endDate: endDate || '',
    status,
    direction,
    text: filterParts.join(' ｜ ')
  }

  // 5. 不导出文件时，直接返回数据（预留前端报表预览）
  if (!exportType) {
    return {
      success: true,
      data: {
        filters,
        statistics,
        rows
      }
    }
  }

  // 6. 导出 Excel：北京欢乐谷医务室内药材调拔表
  if (exportType === 'excel') {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('药材调拨表', {
      pageSetup: {
        paperSize: 9,
        orientation: 'landscape'
      }
    })

    worksheet.columns = [
      { key: 'index', width: 6 },
      { key: 'transferNo', width: 18 },
      { key: 'date', width: 14 },
      { key: 'fromLocation', width: 10 },
      { key: 'toLocation', width: 10 },
      { key: 'operator', width: 10 },
      { key: 'drugName', width: 16 },
      { key: 'specification', width: 18 },
      { key: 'batchNo', width: 14 },
      { key: 'unit', width: 8 },
      { key: 'minUnit', width: 8 },
      { key: 'quantityMin', width: 12 },
      { key: 'quantityPack', width: 12 },
      { key: 'remark', width: 22 }
    ]

    // 标题
    worksheet.mergeCells('A1', 'N1')
    const titleCell = worksheet.getCell('A1')
    titleCell.value = '北京欢乐谷医务室内药材调拔表'
    titleCell.font = { name: '黑体', size: 20, bold: true }
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getRow(1).height = 36

    // 统计时间 + 制表人
    worksheet.mergeCells('A2', 'N2')
    const infoCell = worksheet.getCell('A2')
    infoCell.value = `统计时间：${startDate || '——'} ~ ${endDate || '——'}    制表人：${printUser || '——'}`
    infoCell.font = { name: '仿宋_GB2312', size: 12 }
    infoCell.alignment = { vertical: 'middle', horizontal: 'center' }

    // 表头
    const headerRow = worksheet.getRow(3)
    const headers = [
      '序号',
      '调拨单号',
      '调拨日期',
      '调出园区',
      '调入园区',
      '调拨人',
      '药材名称',
      '规格',
      '批号',
      '包装单位',
      '最小单位',
      '调拨数量（最小单位）',
      '折合包装数',
      '备注'
    ]
    headers.forEach((h, idx) => {
      const cell = headerRow.getCell(idx + 1)
      cell.value = h
      cell.font = { name: '仿宋_GB2312', size: 11, bold: true }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    })

    const locationText = {
      land_park: '陆园',
      water_park: '水园'
    }

    // 数据行
    rows.forEach((row, index) => {
      const excelRow = worksheet.getRow(4 + index)
      excelRow.values = [
        index + 1,
        row.transferNo,
        formatDate(row.date),
        locationText[row.fromLocation] || row.fromLocation || '',
        locationText[row.toLocation] || row.toLocation || '',
        row.operator,
        row.drugName,
        row.specification,
        row.batchNo,
        row.unit,
        row.minUnit,
        row.quantityMin,
        row.quantityPack != null ? row.quantityPack : '',
        row.remark
      ]
      excelRow.font = { name: '仿宋_GB2312', size: 11 }
      excelRow.alignment = { vertical: 'middle', horizontal: 'center' }
      for (let c = 1; c <= 14; c++) {
        const cell = excelRow.getCell(c)
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      }
    })

    // 合计行
    const totalRow = worksheet.addRow([
      '合计',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      statistics.totalQuantityMin,
      '',
      ''
    ])
    totalRow.font = { name: '仿宋_GB2312', size: 11, bold: true }
    totalRow.alignment = { vertical: 'middle', horizontal: 'center' }

    const buffer = await workbook.xlsx.writeBuffer()
    const filename = `transfer_${Date.now()}.xlsx`
    const upload = await cloud.uploadFile({
      cloudPath: `reports/${filename}`,
      fileContent: Buffer.from(buffer)
    })
    return { success: true, fileID: upload.fileID, filename }
  }

  // 7. 导出 PDF：北京欢乐谷医务室内药材调拨表
  if (exportType === 'pdf') {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 36 })
    const buffers = []
    doc.on('data', buffers.push.bind(buffers))
    const done = new Promise(resolve => doc.on('end', resolve))

    const fontDir = path.join(__dirname, 'fonts')
    const simheiFont = path.join(fontDir, 'SimHei.ttf')
    const fangsongFont = path.join(fontDir, 'FangSong_GB2312.ttf')
    doc.registerFont('HeiTi', simheiFont)
    doc.registerFont('FangSong', fangsongFont)

    drawPdfHeader(doc, '北京欢乐谷医务室内药材调拔表', filters, statistics, printUser)

    const header = [
      '调拨单号',
      '日期',
      '调出园区',
      '调入园区',
      '调拨人',
      '药材名称',
      '规格',
      '批号',
      '包装单位',
      '最小单位',
      '调拨数量',
      '折合包装数',
      '备注'
    ]
    const widths = [80, 55, 55, 55, 55, 80, 80, 70, 45, 45, 60, 65, 110]

    const page = doc.page
    const usableWidth = page.width - page.margins.left - page.margins.right
    const tableWidth = widths.reduce((a, b) => a + b, 0)
    const offsetX = page.margins.left + Math.max(0, (usableWidth - tableWidth) / 2)
    doc.x = offsetX

    const locationText = {
      land_park: '陆园',
      water_park: '水园'
    }

    drawRow(doc, header, widths, true)
    rows.forEach(row => {
      drawRow(doc, [
        row.transferNo,
        formatDate(row.date),
        locationText[row.fromLocation] || row.fromLocation || '',
        locationText[row.toLocation] || row.toLocation || '',
        row.operator,
        row.drugName,
        row.specification,
        row.batchNo,
        row.unit,
        row.minUnit,
        String(row.quantityMin || 0),
        row.quantityPack != null ? String(row.quantityPack) : '',
        row.remark
      ], widths, false)
    })

    drawPdfFooter(doc, printUser)
    doc.end()
    await done

    const arrayBuffer = Buffer.concat(buffers)
    const upload = await cloud.uploadFile({
      cloudPath: `reports/transfer_${Date.now()}.pdf`,
      fileContent: arrayBuffer
    })
    return { success: true, fileID: upload.fileID }
  }

  return { success: false, message: 'unsupported export type' }
}

async function exportInboundPDF(params = {}) {
  const mode = params.mode === 'detail' ? 'detail' : 'summary'
  const report = mode === 'detail' ? await inboundDetailReport(params) : await inboundReport(params)
  if (!report.success) return report

  const { data } = report
  const doc = new PDFDocument({
    size: 'A4',
    margin: 36,
    // 汇总采用纵向，明细列多改用横向
    layout: mode === 'detail' ? 'landscape' : 'portrait'
  })
  const buffers = []
  doc.on('data', buffers.push.bind(buffers))
  const done = new Promise(resolve => doc.on('end', resolve))

  // 字体路径
  const fontDir = path.join(__dirname, 'fonts')
  const simheiFont = path.join(fontDir, 'SimHei.ttf')
  const fangsongFont = path.join(fontDir, 'FangSong_GB2312.ttf')

  doc.registerFont('HeiTi', simheiFont)
  doc.registerFont('FangSong', fangsongFont)

  const title = params.title || (mode === 'detail'
    ? '北京欢乐谷医务室入库明细表'
    : '北京欢乐谷医务室入库汇总表')

  drawPdfHeader(doc, title, data.filters, data.statistics, params.printUser)

  if (mode === 'detail') {
    const header = ['单号', '日期', '药材名', '规格', '单位', '批号', '生产日期', '有效期', '生产厂家', '数量', '单价', '金额', '医生']
    const widths = [70, 55, 80, 70, 40, 60, 60, 60, 80, 45, 45, 50, 55]
    drawRow(doc, header, widths, true)
    data.details.forEach(item => {
      drawRow(doc, [
        item.recordNo || '',
        formatDate(item.date),
        item.drugName || '',
        item.specification || '',
        item.unit || '',
        item.batchNo || '',
        item.productionDate || '',
        item.expireDate || '',
        item.manufacturer || '',
        String(item.quantity ?? ''),
        String(item.price ?? ''),
        String(item.amount ?? ''),
        item.operator || ''
      ], widths, false)
    })
  } else {
    const header = ['单号', '日期', '医生', '状态', '品种', '数量', '金额']
    const widths = [90, 60, 70, 45, 45, 50, 60]
    drawRow(doc, header, widths, true)
    data.records.forEach(item => {
    drawRow(doc, [
        item.recordNo || '',
        formatDate(item.createTime),
        item.operator || '',
        item.status || '',
        String(item.drugCount || 0),
        String(item.totalQuantity || 0),
        String(item.totalAmount || 0)
      ], widths, false)
    })
  }

  drawPdfFooter(doc, params.printUser)
  doc.end()
  await done

  const arrayBuffer = Buffer.concat(buffers)
  const upload = await cloud.uploadFile({
    cloudPath: `reports/inbound_${mode}_${Date.now()}.pdf`,
    fileContent: arrayBuffer
  })
  return { success: true, fileID: upload.fileID }
}

async function exportStockPDF(params = {}) {
  const report = await stockReport(params)
  if (!report.success) return report

  const { data } = report
  // 使用横向 A4，便于与 Excel 列布局一致
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 36 })
  const buffers = []
  doc.on('data', buffers.push.bind(buffers))
  const done = new Promise(resolve => doc.on('end', resolve))

  // 字体路径
  const fontDir = path.join(__dirname, 'fonts')
  const simheiFont = path.join(fontDir, 'SimHei.ttf')
  const fangsongFont = path.join(fontDir, 'FangSong_GB2312.ttf')

  doc.registerFont('HeiTi', simheiFont)
  doc.registerFont('FangSong', fangsongFont)

  // 为库存 PDF 构造适合的过滤信息：统计时间使用当天日期，文本复用 stockReport 的 filters.text
  const todayStr = formatDate(new Date())
  const pdfFilters = {
    startDate: todayStr,
    endDate: '',
    text: data.filters && data.filters.text ? data.filters.text : ''
  }

  drawPdfHeader(doc, '北京欢乐谷医务室库存明细表', pdfFilters, data.statistics, params.printUser)

  // 表头与 Excel 保持一致：序号, 药材名, 规格, 单位, 批号, 生产日期, 入库日期, 有效期, 医生, 库存, 折算数量, 单价, 金额
  const header = ['序号', '药材名', '规格', '单位', '批号', '生产日期', '入库日期', '有效期', '医生', '库存', '折算数量', '单价', '金额']
  // 宽度在 A4 横向下做适配，保证一行铺满且不拥挤
  const widths = [35, 80, 80, 35, 70, 65, 65, 65, 55, 45, 60, 45, 55]
  
  // ===== 让表格在页面内左右居中（紧跟在标题和统计信息下面） =====
  const page = doc.page
  const usableWidth = page.width - page.margins.left - page.margins.right
  const tableWidth = widths.reduce((a, b) => a + b, 0)
  const offsetX = page.margins.left + Math.max(0, (usableWidth - tableWidth) / 2)
  doc.x = offsetX

  // ===== 绘制表头和数据行 =====
  drawRow(doc, header, widths, true)
  data.items.forEach((item, index) => {
    drawRow(doc, [
      index + 1,
      item.drugName || '',
      item.specification || '',
      item.unit || '',
      item.batch || '',
      item.productionDate || '',
      formatDate(item.inboundDate),
      item.expireDate || '',
      item.operator || '',
      String(item.quantity || 0),
      item.convertedQuantity != null ? `${item.convertedQuantity}${item.convertedUnit || ''}` : '',
      String(item.price || 0),
      String(item.amount || 0)
    ], widths, false)
  })
  doc.end()
  await done

  const arrayBuffer = Buffer.concat(buffers)
  const upload = await cloud.uploadFile({
    cloudPath: `reports/stock_detail_${Date.now()}.pdf`,
    fileContent: arrayBuffer
  })
  return { success: true, fileID: upload.fileID }
}

async function fetchInboundRecords(params = {}) {
  const {
    startDate,
    endDate,
    operator,
    recordNo,
    status,
    includeDraft,
    batchNo
  } = params

  const condition = {}
  if (startDate || endDate) {
    const start = startDate
      ? buildDateBoundary(startDate, false) || new Date('1970-01-01')
      : new Date('1970-01-01')
    const end = endDate
      ? buildDateBoundary(endDate, true) || new Date()
      : new Date()
    condition.createTime = _.gte(start).and(_.lte(end))
  }
  if (operator) {
    condition.operator = operator
  }
  if (recordNo) {
    condition.recordNo = recordNo
  }
  if (status && status !== 'all') {
    condition.status = status
  } else if (!includeDraft) {
    condition.status = _.neq('draft')
  }

  let query = db.collection('in_records')
  if (Object.keys(condition).length) {
    query = query.where(condition)
  }

  const list = []
  let skip = 0
  const limit = 100
  while (true) {
    const res = await query.orderBy('createTime', 'desc').skip(skip).limit(limit).get()
    list.push(...(res.data || []))
    if (!res.data || res.data.length < limit) break
    skip += limit
  }
  if (batchNo) {
    const key = String(batchNo).trim().toLowerCase()
    return list.filter(record =>
      (record.items || []).some(item => (item.batch || '').toLowerCase().includes(key))
    )
  }
  return list
}

// 查询调拨记录
async function fetchTransferRecords(params = {}) {
  const {
    startDate,
    endDate,
    status,
    direction
  } = params

  const condition = {}
  if (startDate || endDate) {
    const start = startDate
      ? buildDateBoundary(startDate, false) || new Date('1970-01-01')
      : new Date('1970-01-01')
    const end = endDate
      ? buildDateBoundary(endDate, true) || new Date()
      : new Date()
    condition.createTime = _.gte(start).and(_.lte(end))
  }
  if (status && status !== 'all') {
    condition.status = status
  }
  if (direction && direction !== 'all') {
    if (direction === 'land_to_water') {
      condition.fromLocation = 'land_park'
      condition.toLocation = 'water_park'
    } else if (direction === 'water_to_land') {
      condition.fromLocation = 'water_park'
      condition.toLocation = 'land_park'
    }
  }

  let query = db.collection('transfer')
  if (Object.keys(condition).length) {
    query = query.where(condition)
  }

  const list = []
  let skip = 0
  const limit = 100
  while (true) {
    const res = await query.orderBy('createTime', 'desc').skip(skip).limit(limit).get()
    list.push(...(res.data || []))
    if (!res.data || res.data.length < limit) break
    skip += limit
  }
  return list
}

// 查询盘点单记录
async function fetchInventoryRecords(params = {}) {
  const {
    startDate,
    endDate,
    status,
    location
  } = params

  const condition = {}
  if (startDate || endDate) {
    const start = startDate
      ? buildDateBoundary(startDate, false) || new Date('1970-01-01')
      : new Date('1970-01-01')
    const end = endDate
      ? buildDateBoundary(endDate, true) || new Date()
      : new Date()
    condition.createTime = _.gte(start).and(_.lte(end))
  }
  if (status && status !== 'all') {
    condition.status = status
  }
  if (location && location !== 'all') {
    condition.location = location
  }

  let query = db.collection('inventory')
  if (Object.keys(condition).length) {
    query = query.where(condition)
  }

  const list = []
  let skip = 0
  const limit = 100
  while (true) {
    const res = await query.orderBy('createTime', 'desc').skip(skip).limit(limit).get()
    list.push(...(res.data || []))
    if (!res.data || res.data.length < limit) break
    skip += limit
  }
  return list
}

function normalizeFilters(filters = {}) {
  const normalized = {
    startDate: filters.startDate || '',
    endDate: filters.endDate || '',
    operator: filters.operator || '',
    recordNo: filters.recordNo || '',
    drugName: filters.drugName || '',
    batchNo: filters.batchNo || '',
    status: filters.status || '',
    includeDraft: !!filters.includeDraft
  }
  normalized.text = buildFilterText(normalized)
  return normalized
}

function buildFilterText(filters) {
  const parts = []
  if (filters.startDate || filters.endDate) {
    parts.push(`时间：${filters.startDate || '——'} ~ ${filters.endDate || '——'}`)
  } else {
    parts.push('时间：全部')
  }
  parts.push(`药材：${filters.drugName || '全部'}`)
  if (filters.operator) parts.push(`医生：${filters.operator}`)
  if (filters.recordNo) parts.push(`单号：${filters.recordNo}`)
  if (filters.batchNo) parts.push(`批号：${filters.batchNo}`)
  if (filters.status) parts.push(`状态：${filters.status}`)
  return parts.join(' ｜ ')
}

function buildDateBoundary(dateStr, isEnd = false) {
  if (!dateStr || typeof dateStr !== 'string') return null
  const parts = dateStr.split('-').map(p => Number(p))
  if (parts.length < 3 || parts.some(n => Number.isNaN(n))) {
    return null
  }
  const [year, month, day] = parts
  const hour = isEnd ? 23 : 0
  const minute = isEnd ? 59 : 0
  const second = isEnd ? 59 : 0
  return new Date(year, month - 1, day, hour, minute, second)
}

function parseSpecification(specification) {
  if (!specification || typeof specification !== 'string') return null
  const spec = specification.trim()
    .replace(/×/g, '×')
    .replace(/／/g, '/')
    .replace(/\s+/g, ' ')

  let match = spec.match(/^(\d+\.?\d*)(mg|g|ml|μg|mcg|ug)?\s*[×xX*]\s*(\d+)\s*(片|粒|支|瓶|袋|丸|滴|ml|毫升|ML)\s*[/／]\s*(盒|瓶|袋|桶|箱|包)$/i)
  if (match) {
    return {
      dosage: match[1] ? parseFloat(match[1]) : null,
      dosageUnit: match[2] ? match[2].toLowerCase() : null,
      conversionRate: parseInt(match[3]),
      minUnit: match[4],
      packUnit: match[5],
      fullSpec: specification,
      pattern: 'standard'
    }
  }

  match = spec.match(/^(\d+\.?\d*)?\s*[×xX*]?\s*(\d+)\s*(片|粒|支|瓶|袋|丸|滴|ml|毫升|ML)\s*[/／]\s*(盒|瓶|袋|桶|箱|包)$/i)
  if (match) {
    return {
      dosage: match[1] ? parseFloat(match[1]) : null,
      dosageUnit: null,
      conversionRate: parseInt(match[2]),
      minUnit: match[3],
      packUnit: match[4],
      fullSpec: specification,
      pattern: 'simple'
    }
  }

  match = spec.match(/^(\d+\.?\d*)(mg|g|ml|μg|mcg|ug)\s*[/／]\s*(支|瓶|袋|桶|片|粒|丸)$/i)
  if (match) {
    const unit = match[3]
    return {
      dosage: parseFloat(match[1]),
      dosageUnit: match[2].toLowerCase(),
      conversionRate: 1,
      minUnit: unit,
      packUnit: unit,
      fullSpec: specification,
      pattern: 'single'
    }
  }

  return null
}

function getStockStatusText(item, nearExpiry) {
  if ((item.quantity || 0) <= 0) return '无库存'
  if ((item.quantity || 0) <= (item.minStock || 10)) return '库存预警'
  if (nearExpiry) return '近效期'
  return '正常'
}

function getStockFilterText(filter) {
  const map = {
    all: '全部',
    inStock: '有库存',
    sufficient: '库存充足',
    warning: '库存预警',
    low: '库存不足',
    empty: '无库存'
  }
  return map[filter] || '全部'
}

function getExpiryFilterText(filter) {
  const map = {
    all: '全部',
    normal: '正常',
    expiring6: '6个月内到期',
    expiring3: '3个月内到期',
    expiring1: '1个月内到期',
    expired: '已过期'
  }
  return map[filter] || '全部'
}

function drawPdfHeader(doc, title, filters = {}, statistics = {}, printUser = '') {
  doc.font('HeiTi').fontSize(22).text(title, { align: 'center' })
  doc.moveDown(0.5)
  doc.font('FangSong').fontSize(10).text(`统计时间：${filters.startDate || filters.endDate}`)
  if (filters.text) {
    doc.font('FangSong').text(`筛选条件：${filters.text}`)
  }
  const statsText = [
    statistics.totalRecords != null ? `记录数：${statistics.totalRecords}` : '',
    statistics.totalDrugs != null ? `药材种类：${statistics.totalDrugs}` : '',
    statistics.totalQuantity != null ? `总数量：${statistics.totalQuantity}` : '',
    statistics.totalAmount != null ? `总金额：¥${statistics.totalAmount}` : ''
  ].filter(Boolean).join(' ｜ ')
  if (statsText) {
    doc.font('FangSong').text(statsText)
  }
  doc.font('FangSong').text(`制表人：${printUser || '——'}`)
  doc.moveDown(0.5)
}

function drawPdfFooter(doc, printUser = '') {
  doc.moveDown()
  doc.font('FangSong').fontSize(10)
  doc.text(`制表人：${printUser || '——'}`)
  doc.text(`制表日期：${formatDate(new Date())}`)
}

function drawRow(doc, cells, widths, header = false) {
  const startX = doc.x
  const startY = doc.y
  const rowHeight = 18
  const totalWidth = widths.reduce((a, b) => a + b, 0)

  for (let idx = 0; idx < cells.length; idx++) {
    const text = cells[idx] == null ? '' : String(cells[idx])
    const w = widths[idx] || 60
    if (header) {
      doc.font('FangSong').fontSize(14)
    } else {
      doc.font('FangSong').fontSize(12)
    }
    const offset = widths.slice(0, idx).reduce((a, b) => a + b, 0)
    const cellX = startX + offset

    // 画出单元格边框
    doc.rect(cellX, startY, w, rowHeight).stroke()

    // 文本居中显示在单元格内
    doc.text(text, cellX + 2, startY + 2, {
      width: w - 4,
      height: rowHeight - 4,
      align: 'center'
    })
  }

  // 移动到下一行起始位置
  doc.y = startY + rowHeight
  doc.x = startX
}

function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function formatDateTimeFull(date) {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${dd} ${hh}:${mm}`
}

// ==================== Excel导出功能 ====================

/**
 * 导出入库Excel报表（符合中国公文标准）
 */
async function exportInboundExcel(params = {}) {
  const { mode = 'summary', startDate, endDate, drugName, operator, recordNo, batchNo, includeDraft = false, printUser = '' } = params
  
  // 获取数据
  let reportData
  if (mode === 'summary') {
    const res = await inboundReport({ startDate, endDate, operator, recordNo, drugName, includeDraft })
    reportData = res.data
  } else {
    const res = await inboundDetailReport({ startDate, endDate, drugName, operator, recordNo, batchNo, includeDraft })
    reportData = res.data
  }
  
  // 创建工作簿
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('入库报表', {
    pageSetup: {
      paperSize: 9, // A4
      // 汇总用纵向，明细列多改用横向，避免超出 A4 宽度
      orientation: mode === 'summary' ? 'portrait' : 'landscape',
      margins: {
        // 略微减小左右页边距，给列宽更多空间
        left: 0.5, right: 0.5, top: 0.8, bottom: 0.8,
        header: 0.5, footer: 0.5
      }
    }
  })
  
  // 设置列宽（针对打印友好的宽度进行调整）
  if (mode === 'summary') {
    worksheet.columns = [
      { key: 'index', width: 6 },        // 序号
      { key: 'recordNo', width: 22 },    // 单号
      { key: 'date', width: 14 },        // 日期
      { key: 'operator', width: 12 },    // 医生
      { key: 'status', width: 10 },      // 状态
      { key: 'drugCount', width: 12 },   // 入库品种数
      { key: 'totalQuantity', width: 16 }, // 入库数量
      { key: 'totalAmount', width: 16 }  // 入库金额
    ]
  } else {
    worksheet.columns = [
      // 横向 A4 下，总宽度控制在约 132：在不超页的前提下适当加宽主要文本列
      { key: 'index', width: 4 },            // 序号
      { key: 'recordNo', width: 13 },        // 单号
      { key: 'date', width: 8 },             // 日期
      { key: 'drugName', width: 13 },        // 药材名
      { key: 'specification', width: 13 },   // 规格
      { key: 'unit', width: 6 },             // 单位
      { key: 'batchNo', width: 11 },         // 批号
      { key: 'productionDate', width: 8 },   // 生产日期
      { key: 'expireDate', width: 8 },       // 有效期
      { key: 'manufacturer', width: 13 },    // 生产厂家/去向
      { key: 'quantity', width: 7 },         // 数量
      { key: 'price', width: 7 },            // 单价
      { key: 'amount', width: 8 },           // 金额
      { key: 'operator', width: 7 }          // 医生/发放人
    ]
  }
  
  // 标题行（第1行）
  const titleText = mode === 'summary' ? '北京欢乐谷医务室入库汇总表' : '北京欢乐谷医务室入库明细表'
  worksheet.mergeCells('A1', mode === 'summary' ? 'H1' : 'N1')
  const titleCell = worksheet.getCell('A1')
  titleCell.value = titleText
  titleCell.font = { name: '黑体', size: 22, bold: true }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }
  worksheet.getRow(1).height = 40
  
  // 统计时间 & 制表人行（第2行）
  const timeText = `统计时间：${startDate || '——'} ~ ${endDate || '——'}    制表人：${printUser || '——'}`
  worksheet.mergeCells('A2', mode === 'summary' ? 'G2' : 'N2')
  const timeCell = worksheet.getCell('A2')
  timeCell.value = timeText
  timeCell.font = { name: '仿宋_GB2312', size: 14 }
  timeCell.alignment = { vertical: 'middle', horizontal: 'center' }
  worksheet.getRow(2).height = 25
  
  // 表头行（第3行）
  let headers
  if (mode === 'summary') {
    // 将“品种数”“数量”“金额”改为含义更清晰的表头
    headers = ['序号', '单号', '日期', '医生', '状态', '入库品种数', '入库数量（最小单位）', '入库金额（元）']
  } else {
    headers = ['序号', '单号', '日期', '药材名', '规格', '单位', '批号', '生产日期', '有效期', '生产厂家', '数量（最小单位）', '单价（元）', '金额（元）', '医生']
  }
  
  const headerRow = worksheet.getRow(3)
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = header
    // 明细表适当减小字号，便于在一页 A4 内放下更多列
    const fontSize = mode === 'summary' ? 14 : 12
    cell.font = { name: '仿宋_GB2312', size: fontSize, bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' }
    }
  })
  headerRow.height = 30
  
  // 数据行（从第4行开始）
  const dataRows = mode === 'summary' ? reportData.records : reportData.details
  const colCount = mode === 'summary' ? 8 : 14
  
  dataRows.forEach((row, rowIndex) => {
    const excelRow = worksheet.getRow(4 + rowIndex)
    
    if (mode === 'summary') {
      // 与表头一一对应：序号-单号-日期-医生-状态-入库品种数-入库数量-入库金额
      excelRow.values = [
        rowIndex + 1,
        row.recordNo,
        formatDate(row.createTime),
        row.operator,
        renderStatus(row.status),
        row.drugCount,
        row.totalQuantity,
        row.totalAmount
      ]
      // 金额列设置为纯数值格式（保留两位小数，千分位），数量/金额右对齐
      excelRow.getCell(7).numFmt = '#,##0.00'
      excelRow.getCell(8).numFmt = '#,##0.00'
      excelRow.getCell(7).alignment = { vertical: 'middle', horizontal: 'right' }
      excelRow.getCell(8).alignment = { vertical: 'middle', horizontal: 'right' }
    } else {
      // 明细模式：序号-单号-日期-药材名-规格-单位-批号-生产日期-有效期-生产厂家-数量-单价-金额-医生
      excelRow.values = [
        rowIndex + 1,
        row.recordNo,
        formatDate(row.date),
        row.drugName,
        row.specification,
        row.unit,
        row.batchNo,
        row.productionDate || '',
        row.expireDate || '',
        row.manufacturer || '',
        row.quantity,
        row.price || '',
        row.amount || '',
        row.operator || ''
      ]
      // 数量、单价、金额右对齐，金额设置数值格式
      excelRow.getCell(11).alignment = { vertical: 'middle', horizontal: 'right' }
      excelRow.getCell(12).alignment = { vertical: 'middle', horizontal: 'right' }
      excelRow.getCell(13).alignment = { vertical: 'middle', horizontal: 'right' }
      excelRow.getCell(13).numFmt = '#,##0.00'
    }
    
    // 批量设置样式（更快）
    // 明细表数据行字号略小一些
    const rowFontSize = mode === 'summary' ? 12 : 11
    excelRow.font = { name: '仿宋_GB2312', size: rowFontSize }
    if (mode === 'summary') {
      excelRow.alignment = { vertical: 'middle', horizontal: 'center' }
    } else {
      // 明细默认居中，数值列在上面已经单独改为右对齐
      excelRow.alignment = { vertical: 'middle', horizontal: 'center' }
    }
    excelRow.height = 22
    
    // 只设置边框
    for (let i = 1; i <= colCount; i++) {
      const cell = excelRow.getCell(i)
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
  })
  
  // 合计行（最后一行）
  const stats = reportData.statistics
  const totalRow = worksheet.addRow([])
  totalRow.getCell(1).value = '合计'
  
  if (mode === 'summary') {
    totalRow.getCell(6).value = stats.totalDrugs || 0
    totalRow.getCell(7).value = stats.totalQuantity || 0
    totalRow.getCell(8).value = stats.totalAmount || 0
    totalRow.getCell(7).alignment = { vertical: 'middle', horizontal: 'right' }
    totalRow.getCell(8).alignment = { vertical: 'middle', horizontal: 'right' }
    totalRow.getCell(7).numFmt = '#,##0.00'
    totalRow.getCell(8).numFmt = '#,##0.00'
  } else {
    totalRow.getCell(11).value = stats.totalQuantity || 0
    totalRow.getCell(13).value = stats.totalAmount || 0
    totalRow.getCell(11).alignment = { vertical: 'middle', horizontal: 'right' }
    totalRow.getCell(13).alignment = { vertical: 'middle', horizontal: 'right' }
    totalRow.getCell(13).numFmt = '#,##0.00'
  }
  
  totalRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.font = { name: '仿宋_GB2312', size: 12, bold: true }
    const lastCol = mode === 'summary' ? 8 : 14
    // 合计行：除金额列外居中，金额列保持右对齐
    if (colNumber !== lastCol) {
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } }
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' }
    }
  })
  totalRow.height = 25
  
  // 生成Buffer
  const buffer = await workbook.xlsx.writeBuffer()
  
  // 上传到云存储
  const timestamp = Date.now()
  const filename = mode === 'summary' 
    ? `inbound_summary_${timestamp}.xlsx`
    : `inbound_detail_${timestamp}.xlsx`
  
  const uploadResult = await cloud.uploadFile({
    cloudPath: `reports/${filename}`,
    fileContent: buffer
  })
  
  return { success: true, fileID: uploadResult.fileID, filename }
}

/**
 * 导出库存Excel报表（符合中国公文标准）
 */
async function exportStockExcel(params = {}) {
  // 直接复用 stockReport，支持 stockFilter/expiryFilter 等全部筛选参数
  const res = await stockReport(params)
  const reportData = res.data
  
  // 创建工作簿
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('库存明细', {
    pageSetup: {
      paperSize: 9,
      orientation: 'landscape', // 横向
      margins: {
        left: 0.98, right: 0.98, top: 0.98, bottom: 0.98,
        header: 0.5, footer: 0.5
      }
    }
  })
  
  // 设置列宽：序号 + 12 列明细（不再导出备注列）
  worksheet.columns = [
    { key: 'index', width: 6 },
    { key: 'drugName', width: 18 },
    { key: 'specification', width: 18 },
    { key: 'unit', width: 8 },
    { key: 'batchNo', width: 16 },
    { key: 'productionDate', width: 12 },
    { key: 'inboundDate', width: 12 },
    { key: 'expireDate', width: 12 },
    { key: 'operator', width: 12 },
    { key: 'currentStock', width: 12 },
    { key: 'convertedQuantity', width: 12 },
    { key: 'price', width: 10 },
    { key: 'totalAmount', width: 12 }
  ]
  
  // 标题行
  worksheet.mergeCells('A1:M1')
  const titleCell = worksheet.getCell('A1')
  titleCell.value = '北京欢乐谷医务室库存明细表'
  titleCell.font = { name: '黑体', size: 22, bold: true }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  worksheet.getRow(1).height = 40
  
  // 统计时间行
  worksheet.mergeCells('A2:M2')
  const timeCell = worksheet.getCell('A2')
  timeCell.value = `统计时间：${formatDate(new Date())}`
  timeCell.font = { name: '仿宋_GB2312', size: 14 }
  timeCell.alignment = { vertical: 'middle', horizontal: 'center' }
  worksheet.getRow(2).height = 25
  
  // 表头行：序号 + 明细列（去掉备注）
  const headers = ['序号', '药材名', '规格', '单位', '批号', '生产日期', '入库日期', '有效期', '操作人', '当前库存', '折算数量', '单价', '总金额']
  const headerRow = worksheet.getRow(3)
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = header
    cell.font = { name: '仿宋_GB2312', size: 14, bold: true }
    // 表头全部水平居中，下面的数据由行样式单独控制
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' }
    }
  })
  headerRow.height = 30
  
  // 数据行
  reportData.items.forEach((item, rowIndex) => {
    const excelRow = worksheet.getRow(4 + rowIndex)
    excelRow.values = [
      rowIndex + 1,
      item.drugName || '',
      item.specification || '',
      item.unit || '',
      // stock 集合中是 batch 字段，这里与 PDF 导出保持一致
      item.batch || '',
      item.productionDate || '',
      item.inboundDate ? formatDate(item.inboundDate) : '',
      item.expireDate || '',
      item.operator || '',
      // 当前库存数量
      item.quantity || 0,
      // 折算数量（带单位）
      item.convertedQuantity != null && item.convertedQuantity !== ''
        ? `${item.convertedQuantity}${item.convertedUnit || ''}`
        : '',
      item.price || 0,
      // 总金额
      item.amount || 0
    ]
    
    // 批量设置样式：默认全部居中
    excelRow.font = { name: '仿宋_GB2312', size: 12 }
    excelRow.alignment = { vertical: 'middle', horizontal: 'center' }
    // 仅单价、总金额列右对齐（列 12、13）
    excelRow.getCell(12).alignment = { vertical: 'middle', horizontal: 'right' }
    excelRow.getCell(13).alignment = { vertical: 'middle', horizontal: 'right' }
    // 单价与金额统一保留两位小数
    excelRow.getCell(12).numFmt = '#,##0.00'
    excelRow.getCell(13).numFmt = '#,##0.00'
    excelRow.height = 22
    
    // 设置边框（当前共有 13 列：序号 + 12 列明细）
    for (let i = 1; i <= 13; i++) {
      const cell = excelRow.getCell(i)
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
  })
  
  // 合计行
  const stats = reportData.statistics
  const totalRow = worksheet.addRow([])
  totalRow.getCell(1).value = '合计'
  totalRow.getCell(10).value = stats.totalStock || 0
  totalRow.getCell(13).value = stats.totalValue || 0

  // 合计行对齐与数值格式：当前库存合计居中，总金额右对齐
  totalRow.getCell(10).alignment = { vertical: 'middle', horizontal: 'center' }
  totalRow.getCell(13).alignment = { vertical: 'middle', horizontal: 'right' }
  totalRow.getCell(13).numFmt = '#,##0.00'
  
  totalRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.font = { name: '仿宋_GB2312', size: 12, bold: true }
    // 除金额列外，其余列居中；金额列（13）保持右对齐
    if (colNumber !== 13) {
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } }
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' }
    }
  })
  totalRow.height = 25
  
  // 生成Buffer
  const buffer = await workbook.xlsx.writeBuffer()
  
  // 上传到云存储
  const uploadResult = await cloud.uploadFile({
    cloudPath: `reports/stock_detail_${Date.now()}.xlsx`,
    fileContent: buffer
  })
  
  return { success: true, fileID: uploadResult.fileID }
}

// ==================== 门诊登记导出 ====================

// 查询门诊登记记录
async function fetchClinicRecords(params = {}) {
  const { startDate, endDate, name, location } = params
  const condition = {}

  if (startDate || endDate) {
    const start = startDate
      ? buildDateBoundary(startDate, false) || new Date('1970-01-01')
      : new Date('1970-01-01')
    const end = endDate
      ? buildDateBoundary(endDate, true) || new Date()
      : new Date()
    // 与 clinicRecords.list 对齐：按 createTime 做日期范围过滤
    condition.createTime = _.gte(start).and(_.lte(end))
  }

  if (location && location !== 'all') {
    condition.location = location
  }

  if (name) {
    const key = String(name).trim()
    if (key) {
      condition.name = db.RegExp({
        regexp: key,
        options: 'i'
      })
    }
  }

  let query = db.collection('clinic_records')
  if (Object.keys(condition).length) {
    query = query.where(condition)
  }

  const list = []
  let skip = 0
  const limit = 100
  while (true) {
    const res = await query.orderBy('visitDateTime', 'asc').skip(skip).limit(limit).get()
    list.push(...(res.data || []))
    if (!res.data || res.data.length < limit) break
    skip += limit
  }
  return list
}

// 映射门诊记录为导出行
// 序号 | 就诊日期时间(yyyy-MM-dd HH:mm) | 姓名 | 性别 | 年龄 | 身份 | 主诉 | 诊断 | 处置措施 | 用药信息 | 医生
function mapClinicRecordsForExport(records = []) {
  return records.map((r, index) => {
    const dt = r.visitDateTime || r.createTime || null
    const dateStr = formatDateTimeFull(dt)
    const sex = r.gender || r.sex || ''
    const age = r.age != null ? String(r.age) : ''
    const identity = r.identity || ''
    const chief = r.chiefComplaint || ''
    const diag = r.diagnosis || ''
    const treatment = r.treatment || r.disposal || ''
    const drugName = r.drugName || ''
    const quantity = r.quantityMin || r.quantity || ''
    const unit = r.minUnit || r.unit || ''
    const composedDrugInfo = drugName
      ? `${drugName}${quantity ? ' ' + quantity : ''}${unit || ''}`
      : ''
    const drugInfo = r.drugInfo || composedDrugInfo
    const doctor = r.doctorName || r.operator || ''

    return {
      index: index + 1,
      dateTime: dateStr,
      name: r.name || '',
      gender: sex,
      age,
      identity,
      chiefComplaint: chief,
      diagnosis: diag,
      treatment,
      drugInfo,
      doctor
    }
  });
}
async function exportClinicExcel(params = {}) {
  const { startDate, endDate, name, location, printUser } = params
  const records = await fetchClinicRecords({ startDate, endDate, name, location })
  const rows = mapClinicRecordsForExport(records)

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('门诊登记表', {
    pageSetup: {
      paperSize: 9,
      orientation: 'landscape',
      margins: {
        left: 0.98, right: 0.98, top: 0.98, bottom: 0.98,
        header: 0.5, footer: 0.5
      }
    }
  })

  worksheet.columns = [
    { key: 'index', width: 6 },
    { key: 'dateTime', width: 20 },
    { key: 'name', width: 10 },
    { key: 'gender', width: 8 },
    { key: 'age', width: 8 },
    { key: 'identity', width: 10 },
    { key: 'chiefComplaint', width: 22 },
    { key: 'diagnosis', width: 22 },
    // 合并原“处置措施”和“用药信息”为一列，宽度适当加大
    { key: 'treatmentAndDrug', width: 40 },
    { key: 'doctor', width: 10 }
  ]

  const locMap = { land_park: '陆园', water_park: '水园' }
  const locText = locMap[location] ? `（${locMap[location]}）` : ''
  const title = `北京欢乐谷医务室${locText}门诊登记表`
  worksheet.mergeCells('A1', 'K1')
  const titleCell = worksheet.getCell('A1')
  titleCell.value = title
  titleCell.font = { name: '黑体', size: 22, bold: true }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  worksheet.getRow(1).height = 40

  const filterTextParts = []
  if (startDate || endDate) {
    filterTextParts.push(`时间：${startDate || '——'} ~ ${endDate || '——'}`)
  }
  const filterText = filterTextParts.join('') || '时间：全部'

  worksheet.mergeCells('A2', 'K2')
  const timeCell = worksheet.getCell('A2')
  timeCell.value = filterText
  timeCell.font = { name: '仿宋_GB2312', size: 12 }
  timeCell.alignment = { vertical: 'middle', horizontal: 'center' }
  worksheet.getRow(2).height = 22

  worksheet.mergeCells('A3', 'K3')
  const makerCell = worksheet.getCell('A3')
  makerCell.value = `制表人：${printUser || '——'}    制表日期：${formatDate(new Date())}`
  makerCell.font = { name: '仿宋_GB2312', size: 12 }
  makerCell.alignment = { vertical: 'middle', horizontal: 'right' }
  worksheet.getRow(3).height = 20

  // 表头：将“处置措施”和“用药信息”合并为一列
  const headers = ['序号', '就诊日期时间', '姓名', '性别', '年龄', '身份', '主诉', '诊断', '处置及用药情况', '医生']
  const headerRow = worksheet.getRow(4)
  headers.forEach((header, idx) => {
    const cell = headerRow.getCell(idx + 1)
    cell.value = header
    cell.font = { name: '仿宋_GB2312', size: 12, bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }
    cell.border = {
      top: { style: 'medium' },
    }
  })
  headerRow.height = 26

  rows.forEach((row, rowIdx) => {
    const excelRow = worksheet.getRow(5 + rowIdx)
    // 合并处置措施与用药信息的文案
    const mergedTreatment = [row.treatment, row.drugInfo].filter(Boolean).join('，')
    excelRow.values = [
      row.index,
      row.dateTime,
      row.name,
      row.gender,
      row.age,
      row.identity,
      row.chiefComplaint,
      row.diagnosis,
      mergedTreatment,
      row.doctor
    ]
    excelRow.font = { name: '仿宋_GB2312', size: 11 }
    excelRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    excelRow.height = 22
    for (let i = 1; i <= 10; i++) {
      const cell = excelRow.getCell(i)
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const timestamp = Date.now()
  const filename = `clinic_${timestamp}.xlsx`
  const uploadResult = await cloud.uploadFile({
    cloudPath: `reports/${filename}`,
    fileContent: buffer
  })
  return { success: true, fileID: uploadResult.fileID, filename }
}

// 导出门诊登记 PDF
async function exportClinicPDF(params = {}) {
  const { startDate, endDate, name, location, printUser } = params
  const records = await fetchClinicRecords({ startDate, endDate, name, location })
  const rows = mapClinicRecordsForExport(records)

  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 36 })
  const buffers = []
  doc.on('data', buffers.push.bind(buffers))
  const done = new Promise(resolve => doc.on('end', resolve))

  const fontDir = path.join(__dirname, 'fonts')
  const simheiFont = path.join(fontDir, 'SimHei.ttf')
  const fangsongFont = path.join(fontDir, 'FangSong_GB2312.ttf')
  doc.registerFont('HeiTi', simheiFont)
  doc.registerFont('FangSong', fangsongFont)

  const filters = {
    startDate: startDate || '',
    endDate: endDate || '',
    text: ''
  }
  const parts = []
  if (startDate || endDate) {
    parts.push(`时间：${startDate || '——'} ~ ${endDate || '——'}`)
  }
  if (name) parts.push(`姓名：${name}`)
  if (location && location !== 'all') {
    const locMap = { land_park: '陆园', water_park: '水园' }
    parts.push(`园区：${locMap[location] || location}`)
  }
  filters.text = parts.join(' ｜ ')

  const statistics = {
    totalRecords: rows.length
  }

  // 与 Excel 一致的标题：根据园区拼接
  const locMap = { land_park: '陆园', water_park: '水园' }
  const locText = location && location !== 'all' && locMap[location]
    ? `（${locMap[location]}）`
    : ''
  const clinicTitle = `北京欢乐谷医务室${locText}门诊登记表`

  drawPdfHeader(doc, clinicTitle, filters, statistics, printUser)

  // 表头与 Excel 对齐：合并“处置措施”和“用药信息”为一列
  const header = ['序号', '就诊日期时间', '姓名', '性别', '年龄', '身份', '主诉', '诊断', '处置及用药情况', '医生']
  // A4 横向下，总宽度控制在页面内容宽度内（约 630pt 左右）
  const widths = [30, 80, 50, 30, 30, 50, 110, 110, 160, 40]
  drawRow(doc, header, widths, true)

  rows.forEach(r => {
    // 为避免长文本在 PDF 中换行过多导致难以阅读，这里做适度截断
    const truncate = (text, len = 30) => {
      if (!text) return ''
      const str = String(text)
      return str.length > len ? str.slice(0, len) + '…' : str
    }

    const mergedTreatment = truncate([r.treatment, r.drugInfo].filter(Boolean).join('，'), 50)
    drawRow(doc, [
      r.index,
      r.dateTime,
      truncate(r.name, 10),
      truncate(r.gender, 2),
      truncate(r.age, 3),
      truncate(r.identity, 6),
      truncate(r.chiefComplaint, 40),
      truncate(r.diagnosis, 40),
      mergedTreatment,
      truncate(r.doctor, 10)
    ], widths, false)
  })

  drawPdfFooter(doc, printUser)
  doc.end()
  await done

  const arrayBuffer = Buffer.concat(buffers)
  const upload = await cloud.uploadFile({
    cloudPath: `reports/clinic_${Date.now()}.pdf`,
    fileContent: arrayBuffer
  })
  return { success: true, fileID: upload.fileID }
}

// 门诊用药明细聚合（按药材汇总）
async function fetchClinicUsageSummary(params = {}) {
  const { startDate, endDate, location } = params
  const condition = {}

  if (location && location !== 'all') {
    condition.location = location
  }

  if (startDate && endDate) {
    condition.createTime = _.gte(new Date(startDate)).and(_.lte(new Date(endDate + ' 23:59:59')))
  } else if (startDate) {
    condition.createTime = _.gte(new Date(startDate))
  } else if (endDate) {
    condition.createTime = _.lte(new Date(endDate + ' 23:59:59'))
  }

  let all = []
  let skip = 0
  const limit = 100
  while (true) {
    const res = await db.collection('clinic_usage').where(condition).skip(skip).limit(limit).get()
    const list = res.data || []
    all = all.concat(list)
    if (!list.length || list.length < limit) break
    skip += limit
  }

  const map = {}
  all.forEach(item => {
    const key = [item.drugId || '', item.drugName || '', item.specification || ''].join('|')
    if (!map[key]) {
      map[key] = {
        drugId: item.drugId || '',
        drugName: item.drugName || '',
        specification: item.specification || '',
        minUnit: item.minUnit || '',
        totalQuantityMin: 0,
        patients: new Set()
      }
    }
    const quantityMin = Number(item.quantityMin != null ? item.quantityMin : item.quantity || 0) || 0
    map[key].totalQuantityMin += quantityMin
    if (item.patient) {
      map[key].patients.add(String(item.patient))
    }
  })

  const rows = Object.values(map).map((row, index) => ({
    index: index + 1,
    drugId: row.drugId,
    drugName: row.drugName,
    specification: row.specification,
    minUnit: row.minUnit || '',
    totalQuantityMin: Number(row.totalQuantityMin.toFixed(2)),
    patientCount: row.patients.size
  }))

  rows.sort((a, b) => b.totalQuantityMin - a.totalQuantityMin)

  return rows
}

// 导出门诊用药统计 Excel（单sheet）
async function exportClinicUsageExcel(params = {}) {
  const { startDate, endDate, location, printUser } = params
  const rows = await fetchClinicUsageSummary({ startDate, endDate, location })

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('门诊用药统计表', {
    pageSetup: {
      paperSize: 9,
      orientation: 'landscape'
    }
  })

  worksheet.columns = [
    { key: 'index', width: 6 },
    { key: 'drugName', width: 22 },
    { key: 'specification', width: 22 },
    { key: 'totalQuantityMin', width: 16 },
    { key: 'minUnit', width: 10 },
    { key: 'patientCount', width: 12 }
  ]

  const locMap = { land_park: '陆园', water_park: '水园' }
  const locText = location && location !== 'all' && locMap[location]
    ? `（${locMap[location]}）`
    : ''

  worksheet.mergeCells('A1', 'F1')
  const titleCell = worksheet.getCell('A1')
  titleCell.value = `北京欢乐谷医务室${locText}门诊用药统计表`
  titleCell.font = { name: '黑体', size: 20, bold: true }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  worksheet.getRow(1).height = 34

  worksheet.mergeCells('A2', 'F2')
  const infoCell = worksheet.getCell('A2')
  const timeText = (startDate || endDate)
    ? `统计时间：${startDate || '——'} ~ ${endDate || '——'}`
    : '统计时间：全部'
  infoCell.value = `${timeText}    制表人：${printUser || '——'}`
  infoCell.font = { name: '仿宋_GB2312', size: 12 }
  infoCell.alignment = { vertical: 'middle', horizontal: 'center' }

  const headerRow = worksheet.getRow(3)
  const headers = ['序号', '药品名称', '规格', '总用量(最小单位)', '最小单位', '用药人数']
  headers.forEach((h, idx) => {
    const cell = headerRow.getCell(idx + 1)
    cell.value = h
    cell.font = { name: '仿宋_GB2312', size: 11, bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  })

  rows.forEach(row => {
    const excelRow = worksheet.addRow([
      row.index,
      row.drugName,
      row.specification,
      row.totalQuantityMin,
      row.minUnit,
      row.patientCount
    ])
    excelRow.font = { name: '仿宋_GB2312', size: 11 }
    excelRow.alignment = { vertical: 'middle', horizontal: 'center' }
    for (let c = 1; c <= 6; c++) {
      const cell = excelRow.getCell(c)
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const filename = `clinic_usage_${Date.now()}.xlsx`
  const upload = await cloud.uploadFile({
    cloudPath: `reports/${filename}`,
    fileContent: Buffer.from(buffer)
  })
  return { success: true, fileID: upload.fileID, filename }
}

// 导出门诊登记+用药统计 Excel（双sheet）
async function exportClinicStatsExcel(params = {}) {
  const { startDate, endDate, name, location, printUser } = params

  const records = await fetchClinicRecords({ startDate, endDate, name, location })
  const clinicRows = mapClinicRecordsForExport(records)
  const usageRows = await fetchClinicUsageSummary({ startDate, endDate, location })

  const workbook = new ExcelJS.Workbook()

  // Sheet1：门诊登记表
  const sheet1 = workbook.addWorksheet('门诊登记表', {
    pageSetup: {
      paperSize: 9,
      orientation: 'landscape'
    }
  })

  sheet1.columns = [
    { key: 'index', width: 6 },
    { key: 'dateTime', width: 20 },
    { key: 'name', width: 10 },
    { key: 'gender', width: 8 },
    { key: 'age', width: 8 },
    { key: 'identity', width: 10 },
    { key: 'chiefComplaint', width: 22 },
    { key: 'diagnosis', width: 22 },
    { key: 'treatmentAndDrug', width: 40 },
    { key: 'doctor', width: 10 }
  ]

  const locMap = { land_park: '陆园', water_park: '水园' }
  const locText = location && location !== 'all' && locMap[location]
    ? `（${locMap[location]}）`
    : ''

  sheet1.mergeCells('A1', 'J1')
  const s1TitleCell = sheet1.getCell('A1')
  s1TitleCell.value = `北京欢乐谷医务室${locText}门诊登记表`
  s1TitleCell.font = { name: '黑体', size: 22, bold: true }
  s1TitleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  sheet1.getRow(1).height = 40

  const filterTextParts = []
  if (startDate || endDate) {
    filterTextParts.push(`时间：${startDate || '——'} ~ ${endDate || '——'}`)
  }
  const filterText = filterTextParts.join('') || '时间：全部'

  sheet1.mergeCells('A2', 'J2')
  const s1TimeCell = sheet1.getCell('A2')
  s1TimeCell.value = filterText
  s1TimeCell.font = { name: '仿宋_GB2312', size: 12 }
  s1TimeCell.alignment = { vertical: 'middle', horizontal: 'center' }

  sheet1.mergeCells('A3', 'J3')
  const s1MakerCell = sheet1.getCell('A3')
  s1MakerCell.value = `制表人：${printUser || '——'}    制表日期：${formatDate(new Date())}`
  s1MakerCell.font = { name: '仿宋_GB2312', size: 12 }
  s1MakerCell.alignment = { vertical: 'middle', horizontal: 'right' }

  const s1HeaderRow = sheet1.getRow(4)
  const s1Headers = ['序号', '就诊日期时间', '姓名', '性别', '年龄', '身份', '主诉', '诊断', '处置及用药情况', '医生']
  s1Headers.forEach((header, idx) => {
    const cell = s1HeaderRow.getCell(idx + 1)
    cell.value = header
    cell.font = { name: '仿宋_GB2312', size: 12, bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }
    cell.border = {
      top: { style: 'medium' }
    }
  })

  clinicRows.forEach(row => {
    const excelRow = sheet1.addRow([
      row.index,
      row.dateTime,
      row.name,
      row.gender,
      row.age,
      row.identity,
      row.chiefComplaint,
      row.diagnosis,
      [row.treatment, row.drugInfo].filter(Boolean).join('，'),
      row.doctor
    ])
    excelRow.font = { name: '仿宋_GB2312', size: 11 }
    excelRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    excelRow.height = 22
    for (let i = 1; i <= 10; i++) {
      const cell = excelRow.getCell(i)
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
  })

  // Sheet2：用药统计表
  const sheet2 = workbook.addWorksheet('用药统计表', {
    pageSetup: {
      paperSize: 9,
      orientation: 'landscape'
    }
  })

  sheet2.columns = [
    { key: 'index', width: 6 },
    { key: 'drugName', width: 22 },
    { key: 'specification', width: 22 },
    { key: 'totalQuantityMin', width: 16 },
    { key: 'minUnit', width: 10 },
    { key: 'patientCount', width: 12 }
  ]

  sheet2.mergeCells('A1', 'F1')
  const s2TitleCell = sheet2.getCell('A1')
  s2TitleCell.value = `北京欢乐谷医务室${locText}门诊用药统计表`
  s2TitleCell.font = { name: '黑体', size: 20, bold: true }
  s2TitleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  sheet2.getRow(1).height = 34

  sheet2.mergeCells('A2', 'F2')
  const s2InfoCell = sheet2.getCell('A2')
  const timeText = (startDate || endDate)
    ? `统计时间：${startDate || '——'} ~ ${endDate || '——'}`
    : '统计时间：全部'
  s2InfoCell.value = `${timeText}    制表人：${printUser || '——'}`
  s2InfoCell.font = { name: '仿宋_GB2312', size: 12 }
  s2InfoCell.alignment = { vertical: 'middle', horizontal: 'center' }

  const s2HeaderRow = sheet2.getRow(3)
  const s2Headers = ['序号', '药品名称', '规格', '总用量(最小单位)', '最小单位', '用药人数']
  s2Headers.forEach((h, idx) => {
    const cell = s2HeaderRow.getCell(idx + 1)
    cell.value = h
    cell.font = { name: '仿宋_GB2312', size: 11, bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  })

  usageRows.forEach(row => {
    const excelRow = sheet2.addRow([
      row.index,
      row.drugName,
      row.specification,
      row.totalQuantityMin,
      row.minUnit,
      row.patientCount
    ])
    excelRow.font = { name: '仿宋_GB2312', size: 11 }
    excelRow.alignment = { vertical: 'middle', horizontal: 'center' }
    for (let c = 1; c <= 6; c++) {
      const cell = excelRow.getCell(c)
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const filename = `clinic_stats_${Date.now()}.xlsx`
  const upload = await cloud.uploadFile({
    cloudPath: `reports/${filename}`,
    fileContent: Buffer.from(buffer)
  })
  return { success: true, fileID: upload.fileID, filename }
}

function renderStatus(status) {
  const map = {
    draft: '草稿',
    pending_review: '待复核',
    rejected: '已驳回',
    completed: '已完成'
  }
  return map[status] || status || '-'
}

// ==================== 出库报表（结构参考入库报表） ====================

async function outboundReport(params = {}) {
  const {
    startDate,
    endDate,
    operator,
    recordNo,
    drugName,
    toLocation,
    status = '',
    includeDraft = false
  } = params

  const records = await fetchOutboundRecords({
    startDate,
    endDate,
    operator,
    recordNo,
    toLocation,
    status,
    includeDraft
  })

  let filteredRecords = records
  if (drugName) {
    const key = String(drugName).trim().toLowerCase()
    filteredRecords = records.filter(r =>
      (r.items || []).some(it => (it.drugName || '').toLowerCase().includes(key))
    )
  }

  const mapped = filteredRecords.map(r => {
    const totalQuantity = (r.items || []).reduce((s, it) => s + (it.quantity || 0), 0)
    const totalAmount = (r.items || []).reduce((s, it) => s + ((it.price || 0) * (it.quantity || 0)), 0)
    return {
      _id: r._id,
      recordNo: r.recordNo,
      createTime: r.createTime,
      operator: r.dispenser || '',
      status: r.status,
      remark: r.remark || '',
      operatorSign: r.operatorSign || '',
      operatorSignText: r.operatorSign && typeof r.operatorSign === 'string' ? r.operatorSign : (r.dispenser || ''),
      reviewer: r.reviewer || '',
      reviewerSignText: r.reviewerSign && typeof r.reviewerSign === 'string' ? r.reviewerSign : (r.reviewer || ''),
      drugCount: (r.items || []).length,
      totalQuantity,
      totalAmount: Number(totalAmount.toFixed(2))
    }
  })

  const totalRecords = mapped.length
  const totalDrugs = mapped.reduce((s, r) => s + r.drugCount, 0)
  const totalQuantity = mapped.reduce((s, r) => s + r.totalQuantity, 0)
  const totalAmount = Number(mapped.reduce((s, r) => s + r.totalAmount, 0).toFixed(2))

  const statistics = {
    totalRecords,
    totalDrugs,
    totalQuantity,
    totalAmount
  }

  const filters = normalizeFilters({
    startDate,
    endDate,
    operator,
    recordNo,
    drugName,
    status,
    includeDraft
  })

  return {
    success: true,
    data: {
      filters,
      statistics,
      records: mapped
    }
  }
}

async function outboundDetailReport(params = {}) {
  const {
    startDate,
    endDate,
    operator,
    recordNo,
    drugName,
    batchNo,
    toLocation,
    status = '',
    includeDraft = false
  } = params

  const records = await fetchOutboundRecords({
    startDate,
    endDate,
    operator,
    recordNo,
    toLocation,
    status,
    includeDraft
  })

  let details = []
  records.forEach(record => {
    ;(record.items || []).forEach(item => {
      const specInfo = parseSpecification(item.specification || item.spec || '') || null
      const conversionRate = specInfo?.conversionRate || 0
      const convertedQuantity = conversionRate > 1
        ? Number(((item.quantity || 0) * conversionRate).toFixed(2))
        : null
      details.push({
        recordId: record._id,
        recordNo: record.recordNo,
        date: record.createTime,
        drugName: item.drugName || '',
        specification: item.specification || item.spec || '',
        unit: item.unit || '',
        batchNo: item.batch || '',
        productionDate: item.productionDate || '',
        expireDate: item.expireDate || '',
        manufacturer: item.toLocationName || item.toLocation || '',
        quantity: Number(item.quantity || 0),
        price: Number(item.price || 0),
        amount: Number(((item.price || 0) * (item.quantity || 0)).toFixed(2)),
        operator: record.dispenser || '',
        status: record.status,
        remark: record.remark || '',
        convertedQuantity,
        convertedUnit: specInfo?.minUnit || '',
        conversionRate: conversionRate || null
      })
    })
  })

  if (drugName) {
    const key = String(drugName).trim().toLowerCase()
    details = details.filter(d => d.drugName.toLowerCase().includes(key))
  }
  if (batchNo) {
    const batchKey = String(batchNo).trim().toLowerCase()
    details = details.filter(d => (d.batchNo || '').toLowerCase().includes(batchKey))
  }

  details.sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime()
    const dateB = new Date(b.date || 0).getTime()
    return dateB - dateA
  })

  const statistics = {
    totalRecords: details.length,
    totalDrugs: new Set(details.map(d => d.drugName)).size,
    totalQuantity: details.reduce((sum, d) => sum + (d.quantity || 0), 0),
    totalAmount: Number(details.reduce((sum, d) => sum + (d.amount || 0), 0).toFixed(2))
  }

  const filters = normalizeFilters({
    startDate,
    endDate,
    operator,
    recordNo,
    drugName,
    batchNo,
    status,
    includeDraft
  })

  return {
    success: true,
    data: {
      filters,
      statistics,
      details
    }
  }
}

async function fetchOutboundRecords(params = {}) {
  const {
    startDate,
    endDate,
    operator,
    recordNo,
    toLocation,
    status,
    includeDraft,
    batchNo
  } = params

  const condition = {}
  if (startDate || endDate) {
    const start = startDate
      ? buildDateBoundary(startDate, false) || new Date('1970-01-01')
      : new Date('1970-01-01')
    const end = endDate
      ? buildDateBoundary(endDate, true) || new Date()
      : new Date()
    condition.createTime = _.gte(start).and(_.lte(end))
  }
  if (operator) {
    condition.dispenser = operator
  }
  if (recordNo) {
    condition.recordNo = recordNo
  }
  if (status && status !== 'all') {
    condition.status = status
  } else if (!includeDraft) {
    condition.status = _.neq('draft')
  }

  let query = db.collection('out_records')
  if (Object.keys(condition).length) {
    query = query.where(condition)
  }

  const list = []
  let skip = 0
  const limit = 100
  while (true) {
    const res = await query.orderBy('createTime', 'desc').skip(skip).limit(limit).get()
    list.push(...(res.data || []))
    if (!res.data || res.data.length < limit) break
    skip += limit
  }
  if (batchNo) {
    const key = String(batchNo).trim().toLowerCase()
    return list.filter(record =>
      (record.items || []).some(item => (item.batch || '').toLowerCase().includes(key))
    )
  }
  return list
}

async function exportOutboundPDF(params = {}) {
  const mode = params.mode === 'detail' ? 'detail' : 'summary'
  const report = mode === 'detail' ? await outboundDetailReport(params) : await outboundReport(params)
  if (!report.success) return report

  const { data } = report
  const doc = new PDFDocument({
    size: 'A4',
    margin: 36,
    layout: mode === 'detail' ? 'landscape' : 'portrait'
  })
  const buffers = []
  doc.on('data', buffers.push.bind(buffers))
  const done = new Promise(resolve => doc.on('end', resolve))

  const fontDir = path.join(__dirname, 'fonts')
  const simheiFont = path.join(fontDir, 'SimHei.ttf')
  const fangsongFont = path.join(fontDir, 'FangSong_GB2312.ttf')

  doc.registerFont('HeiTi', simheiFont)
  doc.registerFont('FangSong', fangsongFont)

  const title = params.title || (mode === 'detail'
    ? '北京欢乐谷医务室出库明细表'
    : '北京欢乐谷医务室出库汇总表')

  drawPdfHeader(doc, title, data.filters, data.statistics, params.printUser)

  if (mode === 'detail') {
    const header = ['单号', '日期', '药材名', '规格', '单位', '批号', '生产日期', '有效期', '发往园区', '数量', '单价', '金额', '发放人']
    const widths = [70, 55, 80, 70, 40, 60, 60, 60, 80, 45, 45, 50, 55]
    drawRow(doc, header, widths, true)
    data.details.forEach(item => {
      drawRow(doc, [
        item.recordNo || '',
        formatDate(item.date),
        item.drugName || '',
        item.specification || '',
        item.unit || '',
        item.batchNo || '',
        item.productionDate || '',
        item.expireDate || '',
        item.manufacturer || '',
        String(item.quantity ?? ''),
        String(item.price ?? ''),
        String(item.amount ?? ''),
        item.operator || ''
      ], widths, false)
    })
  } else {
    const header = ['单号', '日期', '发放人', '状态', '品种', '数量', '金额']
    const widths = [90, 60, 70, 45, 45, 50, 60]
    drawRow(doc, header, widths, true)
    data.records.forEach(item => {
      drawRow(doc, [
        item.recordNo || '',
        formatDate(item.createTime),
        item.operator || '',
        item.status || '',
        String(item.drugCount || 0),
        String(item.totalQuantity || 0),
        String(item.totalAmount || 0)
      ], widths, false)
    })
  }

  drawPdfFooter(doc, params.printUser)
  doc.end()
  await done

  const arrayBuffer = Buffer.concat(buffers)
  const upload = await cloud.uploadFile({
    cloudPath: `reports/outbound_${mode}_${Date.now()}.pdf`,
    fileContent: arrayBuffer
  })
  return { success: true, fileID: upload.fileID }
}

async function exportOutboundExcel(params = {}) {
  const { mode = 'summary', startDate, endDate, drugName, operator, recordNo, batchNo, includeDraft = false, printUser = '' } = params

  let reportData
  if (mode === 'summary') {
    const res = await outboundReport({ startDate, endDate, operator, recordNo, drugName, includeDraft })
    reportData = res.data
  } else {
    const res = await outboundDetailReport({ startDate, endDate, drugName, operator, recordNo, batchNo, includeDraft })
    reportData = res.data
  }

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('出库报表', {
    pageSetup: {
      paperSize: 9,
      // 汇总用纵向，明细列多改用横向，避免超出 A4 宽度
      orientation: mode === 'summary' ? 'portrait' : 'landscape',
      margins: {
        left: 0.5, right: 0.5, top: 0.8, bottom: 0.8,
        header: 0.5, footer: 0.5
      }
    }
  })

  if (mode === 'summary') {
    worksheet.columns = [
      { key: 'index', width: 6 },
      { key: 'recordNo', width: 22 },
      { key: 'date', width: 14 },
      { key: 'operator', width: 12 },
      { key: 'status', width: 10 },
      { key: 'drugCount', width: 12 },
      { key: 'totalQuantity', width: 16 },
      { key: 'totalAmount', width: 16 }
    ]
  } else {
    // 明细模式：与入库明细保持一致的列宽配置，总宽约 126，适配横向 A4
    worksheet.columns = [
      { key: 'index', width: 4 },           // 序号
      { key: 'recordNo', width: 13 },       // 单号
      { key: 'date', width: 8 },            // 日期
      { key: 'drugName', width: 13 },       // 药材名
      { key: 'specification', width: 13 },  // 规格
      { key: 'unit', width: 6 },            // 单位
      { key: 'batchNo', width: 11 },        // 批号
      { key: 'productionDate', width: 8 },  // 生产日期
      { key: 'expireDate', width: 8 },      // 有效期
      { key: 'manufacturer', width: 13 },   // 发往园区
      { key: 'quantity', width: 7 },        // 数量
      { key: 'price', width: 7 },           // 单价
      { key: 'amount', width: 8 },          // 金额
      { key: 'operator', width: 7 }         // 发放人
    ]
  }

  const titleText = mode === 'summary' ? '北京欢乐谷医务室出库汇总表' : '北京欢乐谷医务室出库明细表'
  worksheet.mergeCells('A1', mode === 'summary' ? 'H1' : 'N1')
  const titleCell = worksheet.getCell('A1')
  titleCell.value = titleText
  titleCell.font = { name: '黑体', size: 22, bold: true }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }
  worksheet.getRow(1).height = 40

  const timeText = `统计时间：${startDate || '——'} ~ ${endDate || '——'}    制表人：${printUser || '——'}`
  worksheet.mergeCells('A2', mode === 'summary' ? 'H2' : 'N2')
  const timeCell = worksheet.getCell('A2')
  timeCell.value = timeText
  timeCell.font = { name: '仿宋_GB2312', size: 14 }
  timeCell.alignment = { vertical: 'middle', horizontal: 'center' }
  worksheet.getRow(2).height = 25

  let headers
  if (mode === 'summary') {
    headers = ['序号', '单号', '日期', '发放人', '状态', '出库品种数', '出库数量（最小单位）', '出库金额（元）']
  } else {
    headers = ['序号', '单号', '日期', '药材名', '规格', '单位', '批号', '生产日期', '有效期', '发往园区', '数量（最小单位）', '单价（元）', '金额（元）', '发放人']
  }

  const headerRow = worksheet.getRow(3)
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = header
    cell.font = { name: '仿宋_GB2312', size: 14, bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' }
    }
  })
  headerRow.height = 30

  const dataRows = mode === 'summary' ? reportData.records : reportData.details
  // 注意：汇总有 8 列，明细有 14 列，colCount 必须与列数一致，边框才能画满
  const colCount = mode === 'summary' ? 8 : 14

  dataRows.forEach((row, rowIndex) => {
    const excelRow = worksheet.getRow(4 + rowIndex)

    if (mode === 'summary') {
      excelRow.values = [
        rowIndex + 1,
        row.recordNo,
        formatDate(row.createTime),
        row.operator,
        renderStatus(row.status),
        row.drugCount,
        row.totalQuantity,
        row.totalAmount
      ]
      excelRow.getCell(7).numFmt = '#,##0.00'
      excelRow.getCell(8).numFmt = '#,##0.00'
      excelRow.getCell(7).alignment = { vertical: 'middle', horizontal: 'right' }
      excelRow.getCell(8).alignment = { vertical: 'middle', horizontal: 'right' }
    } else {
      excelRow.values = [
        rowIndex + 1,
        row.recordNo,
        formatDate(row.date),
        row.drugName,
        row.specification,
        row.unit,
        row.batchNo,
        row.productionDate || '',
        row.expireDate || '',
        row.manufacturer || '',
        row.quantity,
        row.price || '',
        row.amount || '',
        row.operator || ''
      ]
      excelRow.getCell(11).alignment = { vertical: 'middle', horizontal: 'right' }
      excelRow.getCell(12).alignment = { vertical: 'middle', horizontal: 'right' }
      excelRow.getCell(13).alignment = { vertical: 'middle', horizontal: 'right' }
      excelRow.getCell(13).numFmt = '#,##0.00'
    }

    excelRow.font = { name: '仿宋_GB2312', size: 12 }
    excelRow.alignment = { vertical: 'middle', horizontal: 'center' }
    excelRow.height = 22

    for (let i = 1; i <= colCount; i++) {
      const cell = excelRow.getCell(i)
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
  })

  const stats = reportData.statistics
  const totalRow = worksheet.addRow([])
  totalRow.getCell(1).value = '合计'

  if (mode === 'summary') {
    totalRow.getCell(6).value = stats.totalDrugs || 0
    totalRow.getCell(7).value = stats.totalQuantity || 0
    totalRow.getCell(8).value = stats.totalAmount || 0
    totalRow.getCell(7).alignment = { vertical: 'middle', horizontal: 'right' }
    totalRow.getCell(8).alignment = { vertical: 'middle', horizontal: 'right' }
    totalRow.getCell(7).numFmt = '#,##0.00'
    totalRow.getCell(8).numFmt = '#,##0.00'
  } else {
    totalRow.getCell(11).value = stats.totalQuantity || 0
    totalRow.getCell(13).value = stats.totalAmount || 0
    totalRow.getCell(11).alignment = { vertical: 'middle', horizontal: 'right' }
    totalRow.getCell(13).alignment = { vertical: 'middle', horizontal: 'right' }
    totalRow.getCell(13).numFmt = '#,##0.00'
  }

  totalRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.font = { name: '仿宋_GB2312', size: 12, bold: true }
    const lastCol = mode === 'summary' ? 7 : 14
    if (colNumber !== lastCol) {
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } }
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' }
    }
  })
  totalRow.height = 25

  const buffer = await workbook.xlsx.writeBuffer()
  const timestamp = Date.now()
  const filename = mode === 'summary'
    ? `outbound_summary_${timestamp}.xlsx`
    : `outbound_detail_${timestamp}.xlsx`

  const uploadResult = await cloud.uploadFile({
    cloudPath: `reports/${filename}`,
    fileContent: buffer
  })

  return { success: true, fileID: uploadResult.fileID, filename }
}

