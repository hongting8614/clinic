#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试Selenium和ChromeDriver是否正常工作
"""

print("=" * 50)
print("🧪 Selenium 环境测试")
print("=" * 50)

# 测试1：导入selenium
print("\n[测试1] 导入selenium...")
try:
    import selenium
    print("✅ selenium版本:", selenium.__version__)
except Exception as e:
    print("❌ 失败:", e)
    exit(1)

# 测试2：导入webdriver
print("\n[测试2] 导入webdriver...")
try:
    from selenium import webdriver
    print("✅ webdriver导入成功")
except Exception as e:
    print("❌ 失败:", e)
    exit(1)

# 测试3：导入其他依赖
print("\n[测试3] 导入其他依赖...")
try:
    from bs4 import BeautifulSoup
    print("✅ BeautifulSoup导入成功")
except:
    print("⚠️ BeautifulSoup未安装（可选）")

try:
    import pandas
    print("✅ pandas导入成功")
except:
    print("⚠️ pandas未安装（可选）")

# 测试4：启动Chrome
print("\n[测试4] 启动Chrome浏览器...")
try:
    from selenium.webdriver.chrome.options import Options
    
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # 无头模式
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    
    driver = webdriver.Chrome(options=chrome_options)
    print("✅ Chrome启动成功")
    
    # 测试访问网页
    print("\n[测试5] 访问测试网页...")
    driver.get('https://www.baidu.com')
    print("✅ 网页访问成功")
    print("   标题:", driver.title)
    
    driver.quit()
    print("✅ 浏览器关闭成功")
    
except Exception as e:
    print("❌ 失败:", e)
    print("\n可能的原因：")
    print("  1. ChromeDriver未正确安装")
    print("  2. ChromeDriver版本不匹配")
    print("  3. Chrome浏览器未安装")
    exit(1)

print("\n" + "=" * 50)
print("✅ 所有测试通过！")
print("=" * 50)
print("\n可以运行爬虫了：")
print("  python jd_drug_crawler.py")
