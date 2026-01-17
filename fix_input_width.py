#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复输入框宽度超出容器的问题"""

file_path = "D:/AK-PMS/pages-sub/in/add.vue"

# 读取文件
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 查找并替换
old_text = """\t\t\t.inline-input {
\t\t\t\twidth: 100%;
\t\t\t\theight: 80rpx;
\t\t\t\tpadding: 0 20rpx;
\t\t\t\tbackground: #f7f8fa;
\t\t\t\tborder-radius: 12rpx;
\t\t\t\tfont-size: 28rpx;
\t\t\t\tcolor: #323233;
\t\t\t\tborder: 2rpx solid transparent;
\t\t\t\ttransition: all 0.3s;
\t\t\t\t
\t\t\t\t&:focus {
\t\t\t\t\tbackground: white;
\t\t\t\t\tborder-color: #07C160;
\t\t\t\t}
\t\t\t}"""

new_text = """\t\t\t.inline-input {
\t\t\t\twidth: 100%;
\t\t\t\theight: 80rpx;
\t\t\t\tpadding: 0 20rpx;
\t\t\t\tbackground: #f7f8fa;
\t\t\t\tborder-radius: 12rpx;
\t\t\t\tfont-size: 28rpx;
\t\t\t\tcolor: #323233;
\t\t\t\tborder: 2rpx solid transparent;
\t\t\t\ttransition: all 0.3s;
\t\t\t\tbox-sizing: border-box;
\t\t\t\t
\t\t\t\t&:focus {
\t\t\t\t\tbackground: white;
\t\t\t\t\tborder-color: #07C160;
\t\t\t\t}
\t\t\t}"""

if old_text in content:
    content = content.replace(old_text, new_text)
    
    # 备份
    backup_path = file_path + ".backup2"
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # 写入
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ 已修复输入框宽度问题")
    print("✓ 添加了 box-sizing: border-box; 属性")
    print(f"✓ 已备份到: {backup_path}")
else:
    print("✗ 未找到匹配的代码")
    print("\n尝试查找 .inline-input 的位置...")
    
    lines = content.split('\n')
    for i, line in enumerate(lines, 1):
        if '.inline-input {' in line:
            print(f"找到 .inline-input 在第 {i} 行")
            # 显示上下文
            start = max(0, i-2)
            end = min(len(lines), i+15)
            for j in range(start, end):
                print(f"{j+1:4d}: {lines[j]}")

