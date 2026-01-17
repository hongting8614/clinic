#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批量替换文档中的 AI Assistant 为 于建华"""

import os
import glob

def replace_in_file(file_path):
    """在文件中替换 AI Assistant 为 于建华"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'AI Assistant' in content:
            new_content = content.replace('AI Assistant', '于建华')
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            return True
        return False
    except Exception as e:
        return False

def main():
    """主函数"""
    print("开始替换 AI Assistant -> 于建华\n")
    
    # 搜索所有 .md 文件
    md_files = glob.glob("D:/AK-PMS/*.md")
    
    count = 0
    for file_path in md_files:
        if replace_in_file(file_path):
            count += 1
    
    print(f"\n完成！共替换 {count} 个文件")

if __name__ == "__main__":
    main()

