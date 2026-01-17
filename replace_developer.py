#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批量替换文档中的开发者信息为于建华"""

import os
import glob
import re

def replace_in_file(file_path):
    """在文件中替换开发者相关信息为于建华"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 替换规则列表
        replacements = [
            ('AI Assistant', '于建华'),
            ('AI 助手', '于建华'),
            ('AI助手', '于建华'),
            ('开发者：AI', '开发者：于建华'),
            ('开发者: AI', '开发者：于建华'),
            ('维护人员：AI Assistant', '维护人员：于建华'),
            ('维护人员: AI Assistant', '维护人员：于建华'),
            ('作者：AI', '作者：于建华'),
            ('作者: AI', '作者：于建华'),
            ('创建者：AI', '创建者：于建华'),
            ('创建者: AI', '创建者：于建华'),
        ]
        
        # 执行替换
        for old, new in replacements:
            content = content.replace(old, new)
        
        # 如果内容有变化，写回文件
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    except Exception as e:
        return False

def main():
    """主函数"""
    print("开始替换开发者信息为于建华...\n")
    
    # 搜索所有 .md 文件
    md_files = glob.glob("D:/AK-PMS/*.md")
    md_files.extend(glob.glob("D:/AK-PMS/docs/*.md"))
    md_files.extend(glob.glob("D:/AK-PMS/docs/**/*.md", recursive=True))
    
    count = 0
    for file_path in md_files:
        if replace_in_file(file_path):
            count += 1
    
    print(f"\n完成！共更新 {count} 个文件")
    print("所有开发者信息已替换为：于建华")

if __name__ == "__main__":
    main()

