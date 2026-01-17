#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""删除门诊登记页面重复的连续登记模式"""

file_path = "D:/AK-PMS/pages-sub/clinic/add.vue"

# 读取文件
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"原文件总行数: {len(lines)}")

# 删除第692-703行（重复的连续登记选项）
# Python索引从0开始，所以是lines[691:703]
start_line = 692 - 1  # 第692行
end_line = 703        # 第703行（不包含）

print(f"\n准备删除第 {start_line+1} 到第 {end_line} 行")
print("删除的内容：")
print("=" * 60)
for i in range(start_line, end_line):
    print(f"{i+1:4d}: {lines[i].rstrip()}")

# 删除这些行
new_lines = lines[:start_line] + lines[end_line:]

print(f"\n新文件总行数: {len(new_lines)}")
print(f"删除了 {len(lines) - len(new_lines)} 行")

# 备份原文件
backup_path = file_path + ".backup"
with open(backup_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print(f"\n已备份原文件到: {backup_path}")

# 写入新文件
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"✅ 已删除重复的连续登记模式选项")
print(f"✅ 文件已更新: {file_path}")

