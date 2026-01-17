#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""改进的 Markdown 转 Word 工具 - 正确处理格式"""

import os
import re
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn

def convert_md_to_docx(md_file, docx_file):
    """将 Markdown 转换为格式良好的 Word 文档"""
    
    doc = Document()
    
    # 设置默认字体
    style = doc.styles['Normal']
    style.font.name = '微软雅黑'
    style._element.rPr.rFonts.set(qn('w:eastAsia'), '微软雅黑')
    style.font.size = Pt(11)
    
    # 读取 Markdown 文件
    with open(md_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    i = 0
    in_code_block = False
    code_lines = []
    in_table = False
    table_lines = []
    
    while i < len(lines):
        line = lines[i].rstrip()
        
        # 处理代码块
        if line.startswith('```'):
            if not in_code_block:
                in_code_block = True
                code_lines = []
            else:
                in_code_block = False
                if code_lines:
                    # 添加代码块
                    p = doc.add_paragraph()
                    run = p.add_run('\n'.join(code_lines))
                    run.font.name = 'Consolas'
                    run.font.size = Pt(9)
                    p.paragraph_format.left_indent = Inches(0.3)
                code_lines = []
            i += 1
            continue
        
        if in_code_block:
            code_lines.append(line)
            i += 1
            continue
        
        # 处理表格
        if line.strip().startswith('|') and '|' in line:
            if not in_table:
                in_table = True
                table_lines = []
            table_lines.append(line)
            i += 1
            continue
        elif in_table:
            # 表格结束
            in_table = False
            add_table(doc, table_lines)
            table_lines = []
            continue
        
        # 处理标题
        if line.startswith('#'):
            level = 0
            for char in line:
                if char == '#':
                    level += 1
                else:
                    break
            
            text = line[level:].strip()
            
            if level <= 3:
                heading = doc.add_heading(level=level)
                run = heading.add_run(text)
                run.font.name = '微软雅黑'
                run.font.bold = True
                
                if level == 1:
                    run.font.size = Pt(18)
                    run.font.color.rgb = RGBColor(0, 51, 102)
                elif level == 2:
                    run.font.size = Pt(16)
                    run.font.color.rgb = RGBColor(0, 102, 204)
                else:
                    run.font.size = Pt(14)
            else:
                p = doc.add_paragraph()
                run = p.add_run(text)
                run.font.bold = True
                run.font.size = Pt(12)
        
        # 处理分隔线
        elif line.strip() in ['---', '***', '___']:
            doc.add_paragraph('─' * 60)
        
        # 处理无序列表
        elif re.match(r'^[\s]*[-*+]\s', line):
            text = re.sub(r'^[\s]*[-*+]\s', '', line)
            text = clean_markdown(text)
            p = doc.add_paragraph(text, style='List Bullet')
        
        # 处理有序列表
        elif re.match(r'^[\s]*\d+\.\s', line):
            text = re.sub(r'^[\s]*\d+\.\s', '', line)
            text = clean_markdown(text)
            p = doc.add_paragraph(text, style='List Number')
        
        # 处理引用
        elif line.strip().startswith('>'):
            text = line.strip().lstrip('>').strip()
            text = clean_markdown(text)
            p = doc.add_paragraph(text)
            p.paragraph_format.left_indent = Inches(0.5)
            for run in p.runs:
                run.font.italic = True
                run.font.color.rgb = RGBColor(102, 102, 102)
        
        # 处理普通段落
        elif line.strip():
            text = clean_markdown(line.strip())
            if text:
                doc.add_paragraph(text)
        
        i += 1
    
    # 保存文档
    doc.save(docx_file)
    print(f"OK: {os.path.basename(docx_file)}")

def add_table(doc, table_lines):
    """添加表格到文档"""
    if len(table_lines) < 2:
        return
    
    # 过滤分隔行
    rows = []
    for line in table_lines:
        # 跳过分隔行 (如 |---|---|)
        if re.match(r'^\|[\s\-:]+\|$', line.strip()):
            continue
        
        cells = [cell.strip() for cell in line.split('|')]
        # 移除首尾空元素
        cells = [c for c in cells if c]
        if cells:
            rows.append(cells)
    
    if not rows or len(rows) < 1:
        return
    
    # 确保所有行列数一致
    max_cols = max(len(row) for row in rows)
    for row in rows:
        while len(row) < max_cols:
            row.append('')
    
    # 创建表格
    table = doc.add_table(rows=len(rows), cols=max_cols)
    table.style = 'Light Grid Accent 1'
    
    # 填充数据
    for i, row_data in enumerate(rows):
        for j, cell_text in enumerate(row_data):
            cell = table.rows[i].cells[j]
            cell.text = clean_markdown(cell_text)
            
            # 设置字体
            for paragraph in cell.paragraphs:
                for run in paragraph.runs:
                    run.font.name = '微软雅黑'
                    run.font.size = Pt(10)
                    
                    # 表头加粗
                    if i == 0:
                        run.font.bold = True

def clean_markdown(text):
    """清理 Markdown 标记"""
    # 移除行内代码标记
    text = re.sub(r'`([^`]+)`', r'\1', text)
    
    # 移除粗体标记
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'__([^_]+)__', r'\1', text)
    
    # 移除斜体标记
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    text = re.sub(r'_([^_]+)_', r'\1', text)
    
    # 移除链接标记 [text](url)
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    
    return text

def main():
    """主函数"""
    print("开始转换 Markdown 到 Word...\n")
    
    # 文档列表
    docs = [
        ("📚 用户文档导航中心.md", "用户文档导航中心.docx"),
        ("⚡ 5分钟快速入门.md", "5分钟快速入门.docx"),
        ("📖 操作流程图解.md", "操作流程图解.docx"),
        ("📱 小程序功能及用法手册.md", "小程序功能及用法手册.docx"),
        ("❓ 常见问题速查手册.md", "常见问题速查手册.docx"),
        ("📋 角色权限完整对照表.md", "角色权限完整对照表.docx"),
        ("📱 微信小程序体验版使用指南.md", "微信小程序体验版使用指南.docx"),
        ("✅ 项目部署与验证检查清单.md", "项目部署与验证检查清单.docx"),
        ("👥 项目联系人信息表.md", "项目联系人信息表.docx"),
        ("📚 项目文档总览.md", "项目文档总览.docx"),
    ]
    
    # 创建输出目录
    output_dir = "Word文档"
    os.makedirs(output_dir, exist_ok=True)
    
    success = 0
    failed = 0
    
    for md_file, docx_name in docs:
        if os.path.exists(md_file):
            try:
                docx_path = os.path.join(output_dir, docx_name)
                convert_md_to_docx(md_file, docx_path)
                success += 1
            except Exception as e:
                print(f"ERROR: {md_file} - {e}")
                failed += 1
        else:
            print(f"NOT FOUND: {md_file}")
            failed += 1
    
    print(f"\n转换完成！成功: {success}, 失败: {failed}")
    print(f"输出目录: {os.path.abspath(output_dir)}")

if __name__ == "__main__":
    main()

