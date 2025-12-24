/**
 * 单位转换工具类 v3.14 Ultimate
 * @file utils/unitConverter.js
 * @description 药材规格解析与单位转换工具
 * @version 3.14.0
 * @date 2025-11-06
 * 
 * 核心功能：
 * 1. 规格解析（支持4种模式）
 * 2. 包装单位 ↔ 最小单位转换
 * 3. 智能库存显示格式化
 * 4. 批量解析与验证
 */

export default class UnitConverter {
  /**
   * 规格解析正则表达式（4种模式）
   */
  static SPEC_PATTERNS = {
    // 模式1: 标准格式 - 剂量×数量单位/包装单位
    // 示例: 0.25g×24粒/盒, 5ml×10支/盒
    standard: /^(\d+\.?\d*)(mg|g|ml|μg|mcg|ug)?\s*[×xX*]\s*(\d+)\s*(片|粒|支|瓶|袋|丸|滴|ml|毫升|ML)\s*[/／]\s*(盒|瓶|袋|桶|箱|包|板)$/i,
    
    // 模式2: 简化格式 - 数量单位/包装单位
    // 示例: 24粒/盒, 0.1×12粒/盒, 10粒/板
    simple: /^(\d+\.?\d*)?\s*[×xX*]?\s*(\d+)\s*(片|粒|支|瓶|袋|丸|滴|ml|毫升|ML)\s*[/／]\s*(盒|瓶|袋|桶|箱|包|板)$/i,
    
    // 模式3: 单一包装 - 剂量/单位
    // 示例: 20g/支, 100ml/瓶, 500mg/片
    single: /^(\d+\.?\d*)(mg|g|ml|μg|mcg|ug)\s*[/／]\s*(支|瓶|袋|桶|片|粒|丸)$/i,
    
    // 模式4: 纯数量格式
    // 示例: 100片, 50粒（默认1片/片，1粒/粒）
    pure: /^(\d+)\s*(片|粒|支|瓶|袋|丸|滴|ml|毫升)$/i
  }
  
  /**
   * 解析药材规格
   * @param {String} specification - 规格字符串
   * @returns {Object|null} 解析结果
   * @example
   * parseSpecification('0.25g×24粒/盒')
   * // 返回：
   * // {
   * //   dosage: 0.25,
   * //   dosageUnit: 'g',
   * //   conversionRate: 24,
   * //   minUnit: '粒',
   * //   packUnit: '盒',
   * //   fullSpec: '0.25g×24粒/盒',
   * //   pattern: 'standard'
   * // }
   */
  static parseSpecification(specification) {
    if (!specification || typeof specification !== 'string') {
      return null
    }
    
    // 清理字符串（统一全角/半角字符）
    const spec = specification.trim()
      .replace(/×/g, '×')      // 统一乘号
      .replace(/／/g, '/')     // 统一斜杠
      .replace(/\s+/g, ' ')    // 统一空格
    
    // 尝试模式1: 标准格式
    let match = spec.match(this.SPEC_PATTERNS.standard)
    if (match) {
      return {
        dosage: match[1] ? parseFloat(match[1]) : null,           // 0.25
        dosageUnit: match[2] ? match[2].toLowerCase() : null,     // g
        conversionRate: parseInt(match[3]),                       // 24
        minUnit: this.normalizeUnit(match[4]),                    // 粒
        packUnit: this.normalizeUnit(match[5]),                   // 盒
        fullSpec: specification,
        pattern: 'standard'
      }
    }
    
    // 尝试模式2: 简化格式
    match = spec.match(this.SPEC_PATTERNS.simple)
    if (match) {
      return {
        dosage: match[1] ? parseFloat(match[1]) : null,           // 0.1 (如果有)
        dosageUnit: null,
        conversionRate: parseInt(match[2]),                       // 12
        minUnit: this.normalizeUnit(match[3]),                    // 粒
        packUnit: this.normalizeUnit(match[4]),                   // 盒
        fullSpec: specification,
        pattern: 'simple'
      }
    }
    
    // 尝试模式3: 单一包装
    match = spec.match(this.SPEC_PATTERNS.single)
    if (match) {
      const unit = this.normalizeUnit(match[3])
      return {
        dosage: parseFloat(match[1]),                             // 20
        dosageUnit: match[2].toLowerCase(),                       // g
        conversionRate: 1,                                        // 1 (单一包装)
        minUnit: unit,                                            // 支
        packUnit: unit,                                           // 支
        fullSpec: specification,
        pattern: 'single'
      }
    }
    
    // 尝试模式4: 纯数量格式
    match = spec.match(this.SPEC_PATTERNS.pure)
    if (match) {
      const unit = this.normalizeUnit(match[2])
      return {
        dosage: null,
        dosageUnit: null,
        conversionRate: parseInt(match[1]),                       // 100
        minUnit: unit,                                            // 片
        packUnit: '盒',                                           // 默认盒
        fullSpec: specification,
        pattern: 'pure'
      }
    }
    
    // 无法解析
    console.warn(`⚠️ 无法解析规格: ${specification}`)
    return null
  }
  
  /**
   * 统一单位名称（处理同义词）
   * @param {String} unit - 原始单位
   * @returns {String} 标准化单位
   */
  static normalizeUnit(unit) {
    const unitMap = {
      'ML': 'ml',
      '毫升': 'ml',
      '包': '盒'
    }
    return unitMap[unit] || unit
  }
  
  /**
   * 包装单位 → 最小单位
   * @param {Number} packQuantity - 包装数量（如2盒）
   * @param {Number} conversionRate - 转换率（如24）
   * @returns {Number} 最小单位数量（如48粒）
   * @example
   * packToMin(2, 24) // 返回 48
   */
  static packToMin(packQuantity, conversionRate) {
    if (typeof packQuantity !== 'number' || typeof conversionRate !== 'number') {
      throw new Error('参数必须是数字')
    }
    if (conversionRate <= 0) {
      throw new Error('转换率必须大于0')
    }
    return packQuantity * conversionRate
  }
  
  /**
   * 最小单位 → 包装单位
   * @param {Number} minQuantity - 最小单位数量（如48粒）
   * @param {Number} conversionRate - 转换率（如24）
   * @returns {Number} 包装数量（如2盒）
   * @example
   * minToPack(48, 24) // 返回 2
   */
  static minToPack(minQuantity, conversionRate) {
    if (typeof minQuantity !== 'number' || typeof conversionRate !== 'number') {
      throw new Error('参数必须是数字')
    }
    if (conversionRate <= 0) {
      throw new Error('转换率必须大于0')
    }
    return minQuantity / conversionRate
  }
  
  /**
   * 格式化显示（智能判断）
   * @param {Number} quantity - 数量
   * @param {String} unit - 单位
   * @param {Number} precision - 小数精度（默认2位）
   * @returns {String} 格式化字符串
   * @example
   * formatQuantity(10, '盒') // 返回 "10盒"
   * formatQuantity(2.5, '盒') // 返回 "2.50盒"
   */
  static formatQuantity(quantity, unit, precision = 2) {
    if (typeof quantity !== 'number') {
      return `0${unit}`
    }
    
    // 整数显示
    if (Number.isInteger(quantity)) {
      return `${quantity}${unit}`
    }
    
    // 小数显示
    return `${quantity.toFixed(precision)}${unit}`
  }
  
  /**
   * 格式化库存显示（带换算）
   * @param {Number} minQuantity - 最小单位数量（如54粒）
   * @param {Object} specInfo - 规格信息
   * @returns {String} 格式化字符串（如 "54粒 (2盒零6粒)"）
   * @example
   * formatStockWithConversion(54, { minUnit: '粒', packUnit: '盒', conversionRate: 24 })
   * // 返回: "54粒 (2盒零6粒)"
   */
  static formatStockWithConversion(minQuantity, specInfo) {
    const { minUnit, packUnit, conversionRate } = specInfo
    
    // 主显示：最小单位
    const mainDisplay = this.formatQuantity(minQuantity, minUnit)
    
    // 副显示：换算为包装单位
    const packQuantity = this.minToPack(minQuantity, conversionRate)
    
    // 智能显示：整盒显示为整数，零散显示为小数
    if (Number.isInteger(packQuantity)) {
      return `${mainDisplay} (${packQuantity}${packUnit})`
    } else {
      // 混合显示：8盒零6粒
      const fullPacks = Math.floor(packQuantity)
      const remainMin = minQuantity % conversionRate
      
      if (fullPacks === 0) {
        // 不足1盒
        return `${mainDisplay} (${packQuantity.toFixed(2)}${packUnit})`
      } else {
        // 混合
        return `${mainDisplay} (${fullPacks}${packUnit}零${remainMin}${minUnit})`
      }
    }
  }
  
  /**
   * 验证规格格式
   * @param {String} specification - 规格字符串
   * @returns {Boolean} 是否有效
   */
  static isValidSpec(specification) {
    return this.parseSpecification(specification) !== null
  }
  
  /**
   * 获取转换率
   * @param {String} specification - 规格字符串
   * @returns {Number|null} 转换率
   */
  static getConversionRate(specification) {
    const result = this.parseSpecification(specification)
    return result ? result.conversionRate : null
  }
  
  /**
   * 批量解析规格（用于数据迁移）
   * @param {Array} specifications - 规格数组
   * @returns {Object} 解析结果统计
   * @example
   * batchParse(['0.25g×24粒/盒', '0.1×12粒/盒'])
   * // 返回：
   * // {
   * //   success: [...],
   * //   failed: [],
   * //   stats: { total: 2, successCount: 2, failedCount: 0 }
   * // }
   */
  static batchParse(specifications) {
    const results = {
      success: [],
      failed: [],
      stats: {
        total: specifications.length,
        successCount: 0,
        failedCount: 0
      }
    }
    
    specifications.forEach(spec => {
      const parsed = this.parseSpecification(spec)
      if (parsed) {
        results.success.push({ spec, parsed })
        results.stats.successCount++
      } else {
        results.failed.push(spec)
        results.stats.failedCount++
      }
    })
    
    return results
  }
  
  /**
   * 格式化库存显示（根据园区类型智能判断）
   * @param {Object} stock - 库存数据
   * @returns {String} 格式化字符串
   * @example
   * // 药库：
   * formatStockDisplay({ quantity: 104, unit: '盒', location: 'drug_storage' })
   * // 返回: "104盒"
   * 
   * // 园区：
   * formatStockDisplay({ 
   *   quantity: 42, 
   *   unit: '粒', 
   *   location: 'land_park',
   *   specInfo: { conversionRate: 24, minUnit: '粒', packUnit: '盒' }
   * })
   * // 返回: "42粒 (1盒零18粒)"
   */
  static formatStockDisplay(stock) {
    const { quantity, unit, location, specInfo } = stock
    
    // 判断是否为药库
    if (location === 'drug_storage') {
      // 药库：只显示包装单位
      return `${quantity}${unit}`
    } else {
      // 园区：显示最小单位 + 换算
      if (specInfo && specInfo.conversionRate) {
        return this.formatStockWithConversion(quantity, specInfo)
      } else {
        // 无规格信息，只显示数量
        return `${quantity}${unit}`
      }
    }
  }
  
  /**
   * 计算最小单位单价（从包装单价计算）
   * @param {Number} packPrice - 包装单价
   * @param {Number} conversionRate - 转换率
   * @returns {Number} 最小单位单价
   * @example
   * calcMinUnitPrice(12.5, 24) // 返回 0.52
   */
  static calcMinUnitPrice(packPrice, conversionRate) {
    if (typeof packPrice !== 'number' || typeof conversionRate !== 'number') {
      throw new Error('参数必须是数字')
    }
    if (conversionRate <= 0) {
      throw new Error('转换率必须大于0')
    }
    return packPrice / conversionRate
  }
  
  /**
   * 计算包装单价（从最小单位单价计算）
   * @param {Number} minUnitPrice - 最小单位单价
   * @param {Number} conversionRate - 转换率
   * @returns {Number} 包装单价
   * @example
   * calcPackPrice(0.52, 24) // 返回 12.48
   */
  static calcPackPrice(minUnitPrice, conversionRate) {
    if (typeof minUnitPrice !== 'number' || typeof conversionRate !== 'number') {
      throw new Error('参数必须是数字')
    }
    if (conversionRate <= 0) {
      throw new Error('转换率必须大于0')
    }
    return minUnitPrice * conversionRate
  }
}







