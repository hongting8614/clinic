#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""删除门诊登记页面重复的连续登记模式"""

import re

file_path = "D:/AK-PMS/pages-sub/clinic/add.vue"

# 读取文件
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"文件总行数: {len(lines)}")

# 查找包含"连续登记模式"的行
found_lines = []
for i, line in enumerate(lines, 1):
    if '连续登记模式' in line and '<view class="continue-title">' in line:
        found_lines.append(i)
        print(f"第 {i} 行: {line.strip()}")

print(f"\n找到 {len(found_lines)} 个'连续登记模式'")

if len(found_lines) >= 2:
    print(f"\n第一个在第 {found_lines[0]} 行")
    print(f"第二个在第 {found_lines[1]} 行（需要删除）")
    
    # 显示第二个出现位置的上下文
    start = found_lines[1] - 10
    end = found_lines[1] + 20
    
    print(f"\n第二个'连续登记模式'的上下文（第{start}-{end}行）：")
    print("=" * 60)
    for i in range(start-1, min(end, len(lines))):
        print(f"{i+1:4d}: {lines[i].rstrip()}")

