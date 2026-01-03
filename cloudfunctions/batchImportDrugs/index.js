// 云函数 - 批量导入药材档案
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const drugs = [
    {
      name: "碘伏",
      pinyin: "DIANFU",
      spec: "500ml/瓶",
      unit: "瓶",
      manufacturer: "",
      category: "外用药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "外用消毒剂"
    },
    {
      name: "棉签",
      pinyin: "MIANQIAN",
      spec: "100支/盒",
      unit: "盒",
      manufacturer: "",
      category: "医疗耗材",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: ""
    },
    {
      name: "防水创口贴",
      pinyin: "FANGSHUICHUANGKOUTI",
      spec: "10片/盒",
      unit: "盒",
      manufacturer: "",
      category: "医疗耗材",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: ""
    },
    {
      name: "弹力创口贴",
      pinyin: "DANLICHUANGKOUTI",
      spec: "10片/盒",
      unit: "盒",
      manufacturer: "",
      category: "医疗耗材",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: ""
    },
    {
      name: "创口贴",
      pinyin: "CHUANGKOUTI",
      spec: "100片/盒",
      unit: "盒",
      manufacturer: "海氏海诺",
      category: "医疗耗材",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "海氏海诺品牌"
    },
    {
      name: "纱布",
      pinyin: "SHABU",
      spec: "10cm×10cm×8层",
      unit: "包",
      manufacturer: "",
      category: "医疗耗材",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: ""
    },
    {
      name: "医用胶带",
      pinyin: "YIYONGJIAODAI",
      spec: "1.25cm×5m",
      unit: "卷",
      manufacturer: "",
      category: "医疗耗材",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: ""
    },
    {
      name: "仁丹",
      pinyin: "RENDAN",
      spec: "0.9g×10粒/盒",
      unit: "盒",
      manufacturer: "",
      category: "中成药",
      barcode: "",
      isHighValue: false,
      isEmergency: false,
      remark: "清暑开窍"
    },
    {
      name: "藿香正气水",
      pinyin: "HUOXIANGZHENGQISHUI",
      spec: "10ml×10支/盒",
      unit: "盒",
      manufacturer: "",
      category: "中成药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "解表化湿，理气和中"
    },
    {
      name: "板蓝根颗粒",
      pinyin: "BANLANGENKELI",
      spec: "10g×10袋/盒",
      unit: "盒",
      manufacturer: "",
      category: "中成药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "清热解毒，凉血利咽"
    },
    {
      name: "氯芬黄敏片",
      pinyin: "LÜFENHUANGMINPIAN",
      spec: "12片/盒",
      unit: "盒",
      manufacturer: "",
      category: "西药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "感冒用药"
    },
    {
      name: "白加黑",
      pinyin: "BAIJIAHEI",
      spec: "12片/盒",
      unit: "盒",
      manufacturer: "",
      category: "西药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "感冒用药，日用白片，夜用黑片"
    },
    {
      name: "去痛片",
      pinyin: "QUTONGPIAN",
      spec: "100片/瓶",
      unit: "瓶",
      manufacturer: "",
      category: "西药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "解热镇痛"
    },
    {
      name: "布洛芬缓释胶囊",
      pinyin: "BULUOFENHUANSHIJIAONANG",
      spec: "0.3g×20粒/盒",
      unit: "盒",
      manufacturer: "",
      category: "西药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "解热镇痛抗炎药"
    },
    {
      name: "马来酸氯苯那敏片",
      pinyin: "MALAISUANLÜBENNAMINPIAN",
      spec: "4mg×100片/瓶",
      unit: "瓶",
      manufacturer: "",
      category: "西药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "抗过敏药，扑尔敏"
    },
    {
      name: "氯雷他定片",
      pinyin: "LÜLEITADINGPIAN",
      spec: "10mg×6片/盒",
      unit: "盒",
      manufacturer: "",
      category: "西药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "抗过敏药"
    },
    {
      name: "硝苯地平缓释片",
      pinyin: "XIAOBENDIPINGHUANSHIPIAN",
      spec: "20mg×30片/盒",
      unit: "盒",
      manufacturer: "",
      category: "西药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "降压药"
    },
    {
      name: "速效救心丸",
      pinyin: "SUXIAOJIUXINWAN",
      spec: "40mg×60粒/瓶",
      unit: "瓶",
      manufacturer: "",
      category: "中成药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "行气活血，祛瘀止痛"
    },
    {
      name: "盐酸地芬尼多片",
      pinyin: "YANSUANDIFENNIDUPIAN",
      spec: "25mg×100片/瓶",
      unit: "瓶",
      manufacturer: "",
      category: "西药",
      barcode: "",
      isHighValue: false,
      isEmergency: false,
      remark: "止晕药"
    },
    {
      name: "甲氧氯普胺片",
      pinyin: "JIAYANGLUOPUANPIAN",
      spec: "5mg×100片/瓶",
      unit: "瓶",
      manufacturer: "",
      category: "西药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "止吐药，胃复安"
    },
    {
      name: "多潘立酮片",
      pinyin: "DUOPANLIDONGPIAN",
      spec: "10mg×30片/盒",
      unit: "盒",
      manufacturer: "",
      category: "西药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "促胃动力药，吗丁啉"
    },
    {
      name: "维U颠茄铝胶囊",
      pinyin: "WEIUDIANQIELÜJIAONANG",
      spec: "18粒/盒",
      unit: "盒",
      manufacturer: "",
      category: "西药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "胃痛胃酸用药"
    },
    {
      name: "红霉素眼膏",
      pinyin: "HONGMEISUYANGAO",
      spec: "2g/支",
      unit: "支",
      manufacturer: "",
      category: "外用药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "眼部抗菌药"
    },
    {
      name: "湿润烫伤膏",
      pinyin: "SHIRUNSHANGSHANGAO",
      spec: "20g/支",
      unit: "支",
      manufacturer: "",
      category: "外用药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "烧烫伤用药"
    },
    {
      name: "扶他林",
      pinyin: "FUTALIN",
      spec: "20g/支",
      unit: "支",
      manufacturer: "",
      category: "外用药",
      barcode: "",
      isHighValue: false,
      isEmergency: false,
      remark: "双氯芬酸钠凝胶，消炎镇痛"
    },
    {
      name: "好得快喷雾剂",
      pinyin: "HAODEKUAIPENWUJI",
      spec: "60ml/瓶",
      unit: "瓶",
      manufacturer: "",
      category: "外用药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "跌打损伤用药"
    },
    {
      name: "诺氟沙星胶囊",
      pinyin: "NUOFUSHAXINGJIAONANG",
      spec: "0.1g×24粒/盒",
      unit: "盒",
      manufacturer: "",
      category: "西药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "抗菌药"
    },
    {
      name: "消旋山莨菪碱片",
      pinyin: "XIAOXUANSHANLANGDANGJIANPIAN",
      spec: "5mg×100片/瓶",
      unit: "瓶",
      manufacturer: "",
      category: "西药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "解痉药，654-2"
    },
    {
      name: "一次性敷料贴",
      pinyin: "YICIXINGFULIAOTI",
      spec: "6cm×7cm×10片/盒",
      unit: "盒",
      manufacturer: "",
      category: "医疗耗材",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: ""
    },
    {
      name: "葡萄糖粉剂",
      pinyin: "PUTAOTANGFENJI",
      spec: "15g×20袋/盒",
      unit: "盒",
      manufacturer: "",
      category: "其他",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "补充能量"
    },
    {
      name: "草珊瑚含片",
      pinyin: "CAOSHANHUHANPIAN",
      spec: "1.5g×16片/盒",
      unit: "盒",
      manufacturer: "",
      category: "中成药",
      barcode: "",
      isHighValue: false,
      isEmergency: false,
      remark: "清热解毒，利咽止痛"
    },
    {
      name: "金士康盐水清洗液",
      pinyin: "JINSHIKANGYANSHUIQINGXIYE",
      spec: "500ml/瓶",
      unit: "瓶",
      manufacturer: "金士康",
      category: "医疗耗材",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "生理盐水"
    },
    {
      name: "过氧化氢溶液",
      pinyin: "GUOYANGHUAQINGRONGYEI",
      spec: "500ml/瓶",
      unit: "瓶",
      manufacturer: "",
      category: "外用药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "双氧水，消毒剂"
    },
    {
      name: "硫酸沙丁胺醇吸入气雾剂",
      pinyin: "LIUSUANSHADINGCHUNXIRUQIWUJI",
      spec: "200揿/瓶",
      unit: "瓶",
      manufacturer: "",
      category: "西药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "平喘药"
    },
    {
      name: "盐酸左氧氟沙星滴眼液",
      pinyin: "YANSUANZUOYANGFUSHAXINDIYANYEI",
      spec: "8ml/支",
      unit: "支",
      manufacturer: "",
      category: "外用药",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: "眼部抗菌药"
    },
    {
      name: "弹性绷带",
      pinyin: "DANXINGBENGDAI",
      spec: "7.5cm×4.5m",
      unit: "卷",
      manufacturer: "",
      category: "医疗耗材",
      barcode: "",
      isHighValue: false,
      isEmergency: true,
      remark: ""
    }
  ]

  try {
    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      details: []
    }

    for (const drug of drugs) {
      try {
        // 检查是否已存在（根据名称和规格）
        const existResult = await db.collection('drugs')
          .where({
            name: drug.name,
            spec: drug.spec
          })
          .count()

        if (existResult.total > 0) {
          results.skipped++
          results.details.push({
            name: drug.name,
            status: 'skipped',
            message: '已存在'
          })
          continue
        }

        // 添加药材
        await db.collection('drugs').add({
          data: {
            ...drug,
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        })

        results.success++
        results.details.push({
          name: drug.name,
          status: 'success',
          message: '导入成功'
        })
      } catch (err) {
        results.failed++
        results.details.push({
          name: drug.name,
          status: 'failed',
          message: err.message
        })
      }
    }

    return {
      success: true,
      message: `导入完成：成功 ${results.success} 个，跳过 ${results.skipped} 个，失败 ${results.failed} 个`,
      data: results
    }
  } catch (err) {
    console.error('批量导入失败:', err)
    return {
      success: false,
      message: err.message || '导入失败'
    }
  }
}





