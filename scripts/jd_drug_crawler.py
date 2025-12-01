#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
京东医药数据爬虫
爬取药材信息：条形码、药名、规格、单位、厂家等
"""

import time
import json
import re
import csv
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup

class JDDrugCrawler:
    def __init__(self):
        # 配置Chrome选项
        chrome_options = Options()
        # chrome_options.add_argument('--headless')  # 无头模式（可选）
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        
        # 初始化浏览器
        print("🚀 启动浏览器...")
        from selenium.webdriver.chrome.service import Service
        
        # 使用系统PATH中的ChromeDriver
        try:
            self.driver = webdriver.Chrome(
                service=Service(),
                options=chrome_options
            )
        except Exception as e:
            print(f"⚠️ 启动失败，尝试备用方式...")
            # 备用方式：不指定service
            chrome_options.add_argument('--disable-gpu')
            self.driver = webdriver.Chrome(options=chrome_options)
        self.wait = WebDriverWait(self.driver, 10)
        
        # 数据存储
        self.drugs = []
        
    def search_drugs(self, keyword="感冒药", max_pages=3):
        """
        搜索药材
        """
        print(f"\n🔍 搜索关键词: {keyword}")
        
        # 京东搜索URL
        url = f"https://search.jd.com/Search?keyword={keyword}&enc=utf-8"
        print(f"📡 访问: {url}")
        
        self.driver.get(url)
        print("⏳ 等待页面加载...")
        time.sleep(5)  # 增加等待时间
        
        # 调试：保存页面截图
        try:
            self.driver.save_screenshot('debug_page.png')
            print("📸 页面截图已保存: debug_page.png")
        except:
            pass
        
        for page in range(1, max_pages + 1):
            print(f"\n📄 第 {page} 页")
            
            # 尝试多种选择器查找商品列表
            print("🔍 查找商品列表...")
            items = []
            
            # 方法1：标准商品列表
            try:
                items = self.driver.find_elements(By.CSS_SELECTOR, '#J_goodsList .gl-item')
                if items:
                    print(f"✅ 方法1成功，找到 {len(items)} 个商品")
            except:
                pass
            
            # 方法2：备用选择器
            if not items:
                try:
                    items = self.driver.find_elements(By.CLASS_NAME, 'gl-item')
                    if items:
                        print(f"✅ 方法2成功，找到 {len(items)} 个商品")
                except:
                    pass
            
            # 方法3：通用商品卡片
            if not items:
                try:
                    items = self.driver.find_elements(By.CSS_SELECTOR, '.goods-item')
                    if items:
                        print(f"✅ 方法3成功，找到 {len(items)} 个商品")
                except:
                    pass
            
            if not items:
                print("❌ 未找到商品列表")
                print("💡 可能原因：")
                print("   1. 京东页面结构变化")
                print("   2. 需要登录或验证")
                print("   3. 反爬虫机制")
                print(f"   4. 当前URL: {self.driver.current_url}")
                break
            
            # 提取商品信息
            for i, item in enumerate(items):
                try:
                    # 提取商品信息
                    drug_info = self.extract_item_info(item)
                    if drug_info:
                        print(f"  [{i+1}] ✅ {drug_info['name']}")
                        self.drugs.append(drug_info)
                    
                    time.sleep(0.5)  # 延迟
                    
                except Exception as e:
                    print(f"  [{i+1}] ❌ 提取失败: {str(e)}")
            
            # 翻页
            if page < max_pages:
                try:
                    next_btn = self.driver.find_element(By.CLASS_NAME, 'pn-next')
                    next_btn.click()
                    time.sleep(2)
                except:
                    print("❌ 无法翻页")
                    break
        
        print(f"\n✅ 搜索完成，共采集 {len(self.drugs)} 条数据")
    
    def extract_item_info(self, item):
        """
        从商品项提取信息
        """
        try:
            # 商品名称
            name_elem = item.find_element(By.CSS_SELECTOR, '.p-name em')
            name = name_elem.text.strip()
            
            # 商品链接
            link_elem = item.find_element(By.CSS_SELECTOR, '.p-name a')
            link = link_elem.get_attribute('href')
            
            # 商品ID
            sku_id = item.get_attribute('data-sku')
            
            # 价格
            try:
                price_elem = item.find_element(By.CSS_SELECTOR, '.p-price i')
                price = price_elem.text.strip()
            except:
                price = ''
            
            # 店铺
            try:
                shop_elem = item.find_element(By.CSS_SELECTOR, '.p-shop a')
                shop = shop_elem.text.strip()
            except:
                shop = ''
            
            return {
                'skuId': sku_id,
                'name': name,
                'link': link,
                'price': price,
                'shop': shop,
                'barcode': '',  # 需要进入详情页获取
                'specification': '',
                'manufacturer': '',
                'approvalNumber': ''
            }
            
        except Exception as e:
            print(f"提取失败: {str(e)}")
            return None
    
    def get_drug_detail(self, drug_info):
        """
        获取药材详情（包括条形码）
        """
        print(f"\n📋 获取详情: {drug_info['name']}")
        
        try:
            # 访问商品详情页
            self.driver.get(drug_info['link'])
            time.sleep(3)
            
            # 等待页面加载
            self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'product-intro')))
            
            # 获取页面HTML
            html = self.driver.page_source
            soup = BeautifulSoup(html, 'html.parser')
            
            # 提取商品规格
            spec_div = soup.find('div', {'id': 'parameter-brand'})
            if spec_div:
                params = spec_div.find_all('li')
                for param in params:
                    text = param.get_text()
                    
                    # 条形码
                    if '条形码' in text or '商品编码' in text:
                        barcode = text.split('：')[-1].strip()
                        drug_info['barcode'] = barcode
                    
                    # 规格
                    if '规格' in text:
                        spec = text.split('：')[-1].strip()
                        drug_info['specification'] = spec
                    
                    # 生产企业
                    if '生产企业' in text or '厂家' in text:
                        manufacturer = text.split('：')[-1].strip()
                        drug_info['manufacturer'] = manufacturer
                    
                    # 批准文号
                    if '批准文号' in text:
                        approval = text.split('：')[-1].strip()
                        drug_info['approvalNumber'] = approval
            
            # 提取单位（从规格中推断）
            unit = self.parse_unit(drug_info.get('specification', ''))
            drug_info['unit'] = unit
            
            print(f"  ✅ 条形码: {drug_info.get('barcode', '未找到')}")
            print(f"  ✅ 规格: {drug_info.get('specification', '未找到')}")
            print(f"  ✅ 厂家: {drug_info.get('manufacturer', '未找到')}")
            
            return True
            
        except Exception as e:
            print(f"  ❌ 获取详情失败: {str(e)}")
            return False
    
    def parse_unit(self, specification):
        """
        从规格中解析单位
        """
        if '盒' in specification:
            return '盒'
        elif '瓶' in specification:
            return '瓶'
        elif '支' in specification:
            return '支'
        elif '袋' in specification:
            return '袋'
        else:
            return '盒'
    
    def batch_get_details(self):
        """
        批量获取详情
        """
        print(f"\n📋 批量获取详情，共 {len(self.drugs)} 条")
        
        for i, drug in enumerate(self.drugs):
            print(f"\n[{i+1}/{len(self.drugs)}]")
            
            self.get_drug_detail(drug)
            
            # 延迟，避免请求过快
            time.sleep(2)
    
    def save_to_csv(self, filename='京东药材数据.csv'):
        """
        保存为CSV
        """
        if not self.drugs:
            print("❌ 没有数据可保存")
            return
        
        print(f"\n💾 保存到: {filename}")
        
        df = pd.DataFrame(self.drugs)
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        
        print(f"✅ 保存成功，共 {len(self.drugs)} 条记录")
    
    def save_to_excel(self, filename='京东药材数据.xlsx'):
        """
        保存为Excel
        """
        if not self.drugs:
            print("❌ 没有数据可保存")
            return
        
        print(f"\n💾 保存到: {filename}")
        
        df = pd.DataFrame(self.drugs)
        df.to_excel(filename, index=False, engine='openpyxl')
        
        print(f"✅ 保存成功，共 {len(self.drugs)} 条记录")
    
    def generate_import_script(self, filename='导入京东数据.js'):
        """
        生成云数据库导入脚本
        """
        if not self.drugs:
            print("❌ 没有数据")
            return
        
        print(f"\n📝 生成导入脚本: {filename}")
        
        # 只保留有条形码的数据
        valid_drugs = [d for d in self.drugs if d.get('barcode')]
        
        if not valid_drugs:
            print("❌ 没有包含条形码的数据")
            return
        
        script = """// 批量导入京东药材数据到云数据库
// 共 """ + str(len(valid_drugs)) + """ 条有效数据（包含条形码）

const db = wx.cloud.database()

const data = """ + json.dumps(valid_drugs, ensure_ascii=False, indent=2) + """

async function batchImport() {
  console.log('========================================')
  console.log('📦 开始批量导入京东药材数据')
  console.log('总数:', data.length)
  console.log('========================================')
  
  let successCount = 0
  let failCount = 0
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    
    try {
      // 检查是否已存在
      const existing = await db.collection('barcode_mapping')
        .where({ barcode: item.barcode })
        .count()
      
      if (existing.total > 0) {
        console.log(`[${i+1}/${data.length}] ⏭️ 跳过（已存在）: ${item.name}`)
        continue
      }
      
      // 添加到数据库
      await db.collection('barcode_mapping').add({
        data: {
          barcode: item.barcode,
          drugName: item.name,
          specification: item.specification || '',
          unit: item.unit || '盒',
          manufacturer: item.manufacturer || '',
          approvalNumber: item.approvalNumber || '',
          price: item.price || '',
          shop: item.shop || '',
          source: 'jd',
          createTime: db.serverDate()
        }
      })
      
      successCount++
      console.log(`[${i+1}/${data.length}] ✅ ${item.name}`)
      
    } catch (err) {
      failCount++
      console.error(`[${i+1}/${data.length}] ❌ ${item.name}:`, err.message)
    }
    
    // 每10条延迟一下
    if ((i + 1) % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  console.log('========================================')
  console.log('✅ 导入完成')
  console.log('成功:', successCount)
  console.log('失败:', failCount)
  console.log('========================================')
}

// 执行导入
batchImport()
"""
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(script)
        
        print(f"✅ 脚本已生成")
        print(f"   包含 {len(valid_drugs)} 条有条形码的数据")
        print(f"   在小程序开发工具控制台运行此脚本即可导入")
    
    def close(self):
        """
        关闭浏览器
        """
        if self.driver:
            self.driver.quit()
            print("\n👋 浏览器已关闭")


def main():
    print("=" * 60)
    print("🕷️  京东医药数据爬虫")
    print("=" * 60)
    print()
    
    crawler = JDDrugCrawler()
    
    try:
        # 搜索关键词列表
        keywords = [
            "感冒药",
            "消炎药",
            "止咳药",
            "止痛药",
            "降压药",
            "降糖药"
        ]
        
        # 选择搜索关键词
        print("请选择搜索关键词：")
        for i, kw in enumerate(keywords):
            print(f"  {i+1}. {kw}")
        print(f"  {len(keywords)+1}. 自定义")
        
        choice = input("\n请输入选项 (1-7): ").strip()
        
        if choice.isdigit() and 1 <= int(choice) <= len(keywords):
            keyword = keywords[int(choice) - 1]
        elif choice == str(len(keywords) + 1):
            keyword = input("请输入关键词: ").strip()
        else:
            keyword = "感冒药"
        
        # 输入页数
        max_pages = input("爬取页数 (1-10，默认3): ").strip()
        max_pages = int(max_pages) if max_pages.isdigit() else 3
        max_pages = min(max_pages, 10)  # 最多10页
        
        # 开始爬取
        crawler.search_drugs(keyword=keyword, max_pages=max_pages)
        
        # 是否获取详情？
        if crawler.drugs:
            get_detail = input(f"\n是否获取详情（包括条形码）？(y/n): ").strip().lower()
            if get_detail == 'y':
                crawler.batch_get_details()
        
        # 保存数据
        if crawler.drugs:
            crawler.save_to_csv()
            crawler.save_to_excel()
            crawler.generate_import_script()
        
    except Exception as e:
        print(f"\n❌ 程序异常: {str(e)}")
    
    finally:
        crawler.close()
    
    print("\n✅ 完成！")


if __name__ == "__main__":
    main()
