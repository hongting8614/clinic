/**
 * 数据迁移脚本 v3.14
 * @file utils/dataMigration_v3.14.js
 * @description 将旧数据迁移到双轨制存储格式
 * @date 2025-11-06
 * 
 * 迁移内容：
 * 1. 为所有库存添加 specInfo 字段
 * 2. 为所有库存添加 pricePerMin 字段
 * 3. 为所有药品档案添加 specInfo 字段
 * 4. 创建药库（drug_storage）园区配置
 * 5. 字段名统一：spec → specification
 */

import UnitConverter from './unitConverter.js'

class DataMigration {
  /**
   * 执行完整迁移
   */
  static async runFullMigration() {
    console.log('━'.repeat(80))
    console.log('🚀 数据迁移 v3.14 开始')
    console.log('━'.repeat(80))
    console.log('')
    
    const results = {
      locations: { success: 0, failed: 0 },
      drugs: { success: 0, failed: 0 },
      stock: { success: 0, failed: 0 },
      errors: []
    }
    
    try {
      // 步骤1: 添加药库园区配置
      console.log('📍 步骤1: 添加药库园区配置...')
      const locationResult = await this.addDrugStorageLocation()
      results.locations = locationResult
      console.log(`   ✅ 完成: 成功 ${locationResult.success}, 失败 ${locationResult.failed}`)
      console.log('')
      
      // 步骤2: 迁移药品档案
      console.log('💊 步骤2: 迁移药品档案...')
      const drugResult = await this.migrateDrugs()
      results.drugs = drugResult
      console.log(`   ✅ 完成: 成功 ${drugResult.success}, 失败 ${drugResult.failed}`)
      console.log('')
      
      // 步骤3: 迁移库存数据
      console.log('📦 步骤3: 迁移库存数据...')
      const stockResult = await this.migrateStock()
      results.stock = stockResult
      console.log(`   ✅ 完成: 成功 ${stockResult.success}, 失败 ${stockResult.failed}`)
      console.log('')
      
      // 总结
      console.log('━'.repeat(80))
      console.log('📊 迁移总结')
      console.log('━'.repeat(80))
      console.log(`园区配置: ${results.locations.success} 成功, ${results.locations.failed} 失败`)
      console.log(`药品档案: ${results.drugs.success} 成功, ${results.drugs.failed} 失败`)
      console.log(`库存数据: ${results.stock.success} 成功, ${results.stock.failed} 失败`)
      console.log('')
      
      const totalSuccess = results.locations.success + results.drugs.success + results.stock.success
      const totalFailed = results.locations.failed + results.drugs.failed + results.stock.failed
      
      if (totalFailed === 0) {
        console.log('🎉 所有数据迁移成功！')
      } else {
        console.log(`⚠️ 部分数据迁移失败，请检查错误日志`)
      }
      console.log('━'.repeat(80))
      
      return results
      
    } catch (error) {
      console.error('❌ 迁移失败:', error)
      throw error
    }
  }
  
  /**
   * 步骤1: 添加药库园区配置
   */
  static async addDrugStorageLocation() {
    const result = { success: 0, failed: 0, errors: [] }
    
    try {
      // 检查是否已存在
      const existing = await wx.cloud.database()
        .collection('locations')
        .where({ code: 'drug_storage' })
        .get()
      
      if (existing.data && existing.data.length > 0) {
        console.log('   ℹ️ 药库配置已存在，跳过')
        result.success = 1
        return result
      }
      
      // 添加药库配置
      await wx.cloud.database()
        .collection('locations')
        .add({
          data: {
            code: 'drug_storage',
            name: '药库',
            icon: '🏥',
            type: 'storage',
            status: 'active',
            sort: 0,
            createTime: new Date(),
            updateTime: new Date()
          }
        })
      
      result.success = 1
      console.log('   ✅ 药库配置添加成功')
      
    } catch (error) {
      result.failed = 1
      result.errors.push({ step: 'addLocation', error: error.message })
      console.error('   ❌ 添加药库配置失败:', error.message)
    }
    
    return result
  }
  
  /**
   * 步骤2: 迁移药品档案
   */
  static async migrateDrugs() {
    const result = { success: 0, failed: 0, errors: [] }
    
    try {
      const db = wx.cloud.database()
      
      // 获取所有药品
      const drugs = await db.collection('drugs').get()
      
      console.log(`   📋 找到 ${drugs.data.length} 个药品`)
      
      for (const drug of drugs.data) {
        try {
          // 解析规格
          const spec = drug.spec || drug.specification
          const specInfo = UnitConverter.parseSpecification(spec)
          
          if (!specInfo) {
            console.warn(`   ⚠️ 无法解析药品规格: ${drug.name} - ${spec}`)
            result.failed++
            result.errors.push({
              type: 'drug',
              id: drug._id,
              name: drug.name,
              error: '无法解析规格'
            })
            continue
          }
          
          // 更新药品
          await db.collection('drugs').doc(drug._id).update({
            data: {
              specification: spec,  // 统一字段名
              specInfo: specInfo,   // 添加规格解析信息
              updateTime: new Date()
            }
          })
          
          result.success++
          
        } catch (error) {
          result.failed++
          result.errors.push({
            type: 'drug',
            id: drug._id,
            name: drug.name,
            error: error.message
          })
          console.error(`   ❌ 迁移药品失败: ${drug.name} - ${error.message}`)
        }
      }
      
    } catch (error) {
      console.error('   ❌ 获取药品列表失败:', error.message)
      throw error
    }
    
    return result
  }
  
  /**
   * 步骤3: 迁移库存数据
   */
  static async migrateStock() {
    const result = { success: 0, failed: 0, errors: [] }
    
    try {
      const db = wx.cloud.database()
      
      // 获取所有库存
      const stocks = await db.collection('stock').get()
      
      console.log(`   📦 找到 ${stocks.data.length} 条库存记录`)
      
      for (const stock of stocks.data) {
        try {
          // 解析规格
          const spec = stock.spec || stock.specification
          const specInfo = UnitConverter.parseSpecification(spec)
          
          if (!specInfo) {
            console.warn(`   ⚠️ 无法解析库存规格: ${stock.drugName} - ${spec}`)
            result.failed++
            result.errors.push({
              type: 'stock',
              id: stock._id,
              drugName: stock.drugName,
              error: '无法解析规格'
            })
            continue
          }
          
          // 计算最小单位单价
          const price = stock.price || 0
          const pricePerMin = UnitConverter.calcMinUnitPrice(price, specInfo.conversionRate)
          
          // 更新库存
          await db.collection('stock').doc(stock._id).update({
            data: {
              specification: spec,        // 统一字段名
              specInfo: specInfo,         // 添加规格解析信息
              pricePerMin: pricePerMin,   // 添加最小单位单价
              lockQuantity: stock.lockQuantity || 0,
              updateTime: new Date()
            }
          })
          
          result.success++
          
        } catch (error) {
          result.failed++
          result.errors.push({
            type: 'stock',
            id: stock._id,
            drugName: stock.drugName,
            error: error.message
          })
          console.error(`   ❌ 迁移库存失败: ${stock.drugName} - ${error.message}`)
        }
      }
      
    } catch (error) {
      console.error('   ❌ 获取库存列表失败:', error.message)
      throw error
    }
    
    return result
  }
  
  /**
   * 验证迁移结果
   */
  static async validateMigration() {
    console.log('')
    console.log('━'.repeat(80))
    console.log('🔍 验证迁移结果')
    console.log('━'.repeat(80))
    console.log('')
    
    const db = wx.cloud.database()
    const validation = {
      locations: { pass: false, message: '' },
      drugs: { pass: false, total: 0, withSpecInfo: 0 },
      stock: { pass: false, total: 0, withSpecInfo: 0 }
    }
    
    try {
      // 1. 验证药库配置
      const locations = await db.collection('locations').where({ code: 'drug_storage' }).get()
      validation.locations.pass = locations.data && locations.data.length > 0
      validation.locations.message = validation.locations.pass 
        ? '✅ 药库配置存在' 
        : '❌ 药库配置不存在'
      console.log(`1. ${validation.locations.message}`)
      
      // 2. 验证药品档案
      const drugs = await db.collection('drugs').get()
      validation.drugs.total = drugs.data.length
      validation.drugs.withSpecInfo = drugs.data.filter(d => d.specInfo).length
      validation.drugs.pass = validation.drugs.withSpecInfo === validation.drugs.total
      console.log(`2. 药品档案: ${validation.drugs.withSpecInfo}/${validation.drugs.total} 包含 specInfo ${validation.drugs.pass ? '✅' : '❌'}`)
      
      // 3. 验证库存数据
      const stocks = await db.collection('stock').get()
      validation.stock.total = stocks.data.length
      validation.stock.withSpecInfo = stocks.data.filter(s => s.specInfo).length
      validation.stock.pass = validation.stock.withSpecInfo === validation.stock.total
      console.log(`3. 库存数据: ${validation.stock.withSpecInfo}/${validation.stock.total} 包含 specInfo ${validation.stock.pass ? '✅' : '❌'}`)
      
      console.log('')
      console.log('━'.repeat(80))
      
      if (validation.locations.pass && validation.drugs.pass && validation.stock.pass) {
        console.log('🎉 验证通过！所有数据迁移成功')
      } else {
        console.log('⚠️ 验证未完全通过，请检查失败项')
      }
      
      console.log('━'.repeat(80))
      
      return validation
      
    } catch (error) {
      console.error('❌ 验证失败:', error.message)
      throw error
    }
  }
  
  /**
   * 回滚迁移（谨慎使用）
   */
  static async rollback() {
    console.log('')
    console.log('━'.repeat(80))
    console.log('⚠️ 回滚迁移（请谨慎操作）')
    console.log('━'.repeat(80))
    console.log('')
    
    try {
      const db = wx.cloud.database()
      const _ = db.command
      
      // 1. 删除药库配置
      console.log('1. 删除药库配置...')
      await db.collection('locations').where({ code: 'drug_storage' }).remove()
      console.log('   ✅ 完成')
      
      // 2. 移除药品的 specInfo
      console.log('2. 移除药品 specInfo...')
      const drugs = await db.collection('drugs').get()
      for (const drug of drugs.data) {
        await db.collection('drugs').doc(drug._id).update({
          data: {
            specInfo: _.remove()
          }
        })
      }
      console.log(`   ✅ 完成 (${drugs.data.length} 条)`)
      
      // 3. 移除库存的 specInfo 和 pricePerMin
      console.log('3. 移除库存 specInfo 和 pricePerMin...')
      const stocks = await db.collection('stock').get()
      for (const stock of stocks.data) {
        await db.collection('stock').doc(stock._id).update({
          data: {
            specInfo: _.remove(),
            pricePerMin: _.remove()
          }
        })
      }
      console.log(`   ✅ 完成 (${stocks.data.length} 条)`)
      
      console.log('')
      console.log('━'.repeat(80))
      console.log('✅ 回滚完成')
      console.log('━'.repeat(80))
      
    } catch (error) {
      console.error('❌ 回滚失败:', error.message)
      throw error
    }
  }
  
  /**
   * 导出迁移报告
   */
  static exportReport(results, validation) {
    const report = {
      migrationDate: new Date().toISOString(),
      version: 'v3.14',
      results: results,
      validation: validation,
      summary: {
        totalSuccess: results.locations.success + results.drugs.success + results.stock.success,
        totalFailed: results.locations.failed + results.drugs.failed + results.stock.failed,
        validationPassed: validation.locations.pass && validation.drugs.pass && validation.stock.pass
      }
    }
    
    console.log('')
    console.log('━'.repeat(80))
    console.log('📄 迁移报告')
    console.log('━'.repeat(80))
    console.log(JSON.stringify(report, null, 2))
    console.log('━'.repeat(80))
    
    return report
  }
}

export default DataMigration

/**
 * 使用示例（在微信小程序中）
 * 
 * // 1. 执行完整迁移
 * const results = await DataMigration.runFullMigration()
 * 
 * // 2. 验证迁移结果
 * const validation = await DataMigration.validateMigration()
 * 
 * // 3. 导出报告
 * const report = DataMigration.exportReport(results, validation)
 * 
 * // 4. 如需回滚（谨慎）
 * // await DataMigration.rollback()
 */







