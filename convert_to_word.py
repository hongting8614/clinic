#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Markdown 转 Word 文档工具
将项目中的用户文档转换为 Word 格式
"""

import os
import re
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn

def parse_markdown_to_word(md_file, docx_file):
    """将 Markdown 文件转换为 Word 文档"""
    
    # 创建 Word 文档
    doc = Document()
    
    # 设置中文字体
    doc.styles['Normal'].font.name = '微软雅黑'
    doc.styles['Normal']._element.rPr.rFonts.set(qn('w:eastAsia'), '微软雅黑')
    doc.styles['Normal'].font.size = Pt(11)
    
    # 读取 Markdown 文件
    with open(md_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    in_code_block = False
    code_lines = []
    in_table = False
    table_lines = []
    
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        
        # 处理代码块
        if line.startswith('```'):
            if not in_code_block:
                in_code_block = True
                code_lines = []
            else:
                # 代码块结束
                in_code_block = False
                if code_lines:
                    p = doc.add_paragraph()
                    p.style = 'Normal'
                    run = p.add_run('\n'.join(code_lines))
                    run.font.name = 'Consolas'
                    run.font.size = Pt(9)
                    run.font.color.rgb = RGBColor(51, 51, 51)
                    # 添加背景色效果（通过边框模拟）
                    p.paragraph_format.left_indent = Inches(0.25)
                    p.paragraph_format.right_indent = Inches(0.25)
                code_lines = []
            i += 1
            continue
        
        if in_code_block:
            code_lines.append(line)
            i += 1
            continue
        
        # 处理表格
        if '|' in line and line.strip().startswith('|'):
            if not in_table:
                in_table = True
                table_lines = []
            table_lines.append(line)
            i += 1
            # 检查下一行是否还是表格
            if i < len(lines) and '|' in lines[i] and lines[i].strip().startswith('|'):
                continue
            else:
                # 表格结束，处理表格
                in_table = False
                process_table(doc, table_lines)
                table_lines = []
            continue
        
        # 处理标题
        if line.startswith('#'):
            level = len(line) - len(line.lstrip('#'))
            text = line.lstrip('#').strip()
            
            # 移除 emoji 和特殊字符
            text = remove_emoji(text)
            
            heading = doc.add_heading(text, level=level)
            heading.style.font.name = '微软雅黑'
            heading.style.font.bold = True
            
            if level == 1:
                heading.style.font.size = Pt(18)
                heading.style.font.color.rgb = RGBColor(0, 51, 102)
            elif level == 2:
                heading.style.font.size = Pt(16)
                heading.style.font.color.rgb = RGBColor(0, 102, 204)
            elif level == 3:
                heading.style.font.size = Pt(14)
                heading.style.font.color.rgb = RGBColor(51, 102, 153)
            else:
                heading.style.font.size = Pt(12)
        
        # 处理分隔线
        elif line.strip() == '---' or line.strip() == '***':
            doc.add_paragraph('_' * 50)
        
        # 处理列表
        elif line.strip().startswith(('- ', '* ', '+ ')):
            text = line.strip()[2:]
            text = process_inline_formatting(text)
            p = doc.add_paragraph(text, style='List Bullet')
            p.style.font.name = '微软雅黑'
        
        elif re.match(r'^\d+\.\s', line.strip()):
            text = re.sub(r'^\d+\.\s', '', line.strip())
            text = process_inline_formatting(text)
            p = doc.add_paragraph(text, style='List Number')
            p.style.font.name = '微软雅黑'
        
        # 处理引用
        elif line.strip().startswith('>'):
            text = line.strip().lstrip('>').strip()
            text = process_inline_formatting(text)
            p = doc.add_paragraph(text)
            p.style.font.italic = True
            p.style.font.color.rgb = RGBColor(102, 102, 102)
            p.paragraph_format.left_indent = Inches(0.5)
        
        # 处理普通段落
        elif line.strip():
            text = process_inline_formatting(line.strip())
            if text:
                p = doc.add_paragraph(text)
                p.style.font.name = '微软雅黑'
        
        # 空行
        else:
            doc.add_paragraph()
        
        i += 1
    
    # 保存文档
    doc.save(docx_file)
    print(f"✅ 已转换: {os.path.basename(md_file)} -> {os.path.basename(docx_file)}")

def process_table(doc, table_lines):
    """处理 Markdown 表格"""
    if len(table_lines) < 2:
        return
    
    # 过滤掉分隔行（包含 :---: 或 --- 的行）
    data_lines = [line for line in table_lines if not re.match(r'^\|[\s\-:]+\|$', line.strip())]
    
    if len(data_lines) < 1:
        return
    
    # 解析表格数据
    rows = []
    for line in data_lines:
        cells = [cell.strip() for cell in line.strip().split('|')[1:-1]]
        rows.append(cells)
    
    if not rows:
        return
    
    # 创建表格
    table = doc.add_table(rows=len(rows), cols=len(rows[0]))
    table.style = 'Light Grid Accent 1'
    
    # 填充数据
    for i, row_data in enumerate(rows):
        for j, cell_data in enumerate(row_data):
            cell = table.rows[i].cells[j]
            cell.text = remove_emoji(cell_data)
            
            # 设置字体
            for paragraph in cell.paragraphs:
                for run in paragraph.runs:
                    run.font.name = '微软雅黑'
                    run.font.size = Pt(10)
                    
            # 表头加粗
            if i == 0:
                for paragraph in cell.paragraphs:
                    for run in paragraph.runs:
                        run.font.bold = True
                        run.font.color.rgb = RGBColor(255, 255, 255)
                cell._element.get_or_add_tcPr().append(
                    parse_xml(r'<w:shd {} w:fill="4472C4"/>'.format(nsdecls('w')))
                )

def process_inline_formatting(text):
    """处理行内格式（粗体、斜体、代码等）"""
    # 移除 emoji
    text = remove_emoji(text)
    
    # 处理行内代码（简化处理）
    text = re.sub(r'`([^`]+)`', r'[\1]', text)
    
    # 移除粗体和斜体标记（Word 中通过样式处理）
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    text = re.sub(r'__([^_]+)__', r'\1', text)
    text = re.sub(r'_([^_]+)_', r'\1', text)
    
    return text

def remove_emoji(text):
    """移除 emoji 表情"""
    # 简单的 emoji 移除（保留中文和常用字符）
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # 表情符号
        "\U0001F300-\U0001F5FF"  # 符号和象形文字
        "\U0001F680-\U0001F6FF"  # 交通和地图符号
        "\U0001F1E0-\U0001F1FF"  # 旗帜
        "\U00002702-\U000027B0"
        "\U000024C2-\U0001F251"
        "]+",
        flags=re.UNICODE
    )
    return emoji_pattern.sub(r'', text)

def parse_xml(xml_string):
    """解析 XML 字符串"""
    from docx.oxml import parse_xml as docx_parse_xml
    return docx_parse_xml(xml_string)

def nsdecls(*prefixes):
    """命名空间声明"""
    from docx.oxml.ns import nsdecls as docx_nsdecls
    return docx_nsdecls(*prefixes)

def main():
    """主函数"""
    print("=" * 60)
    print("📄 Markdown 转 Word 文档工具")
    print("=" * 60)
    print()
    
    # 定义要转换的用户文档
    user_docs = [
        "📚 用户文档导航中心.md",
        "⚡ 5分钟快速入门.md",
        "📖 操作流程图解.md",
        "📱 小程序功能及用法手册.md",
        "❓ 常见问题速查手册.md",
        "📋 角色权限完整对照表.md",
        "📱 微信小程序体验版使用指南.md",
        "✅ 项目部署与验证检查清单.md",
        "👥 项目联系人信息表.md",
        "📚 项目文档总览.md",
    ]
    
    base_dir = "D:/AK-PMS"
    output_dir = os.path.join(base_dir, "Word文档")
    
    # 创建输出目录
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"📁 创建输出目录: {output_dir}\n")
    
    # 转换文档
    success_count = 0
    fail_count = 0
    
    for doc_name in user_docs:
        md_file = os.path.join(base_dir, doc_name)
        
        if not os.path.exists(md_file):
            print(f"⚠️  文件不存在: {doc_name}")
            fail_count += 1
            continue
        
        # 生成 Word 文件名（移除 emoji）
        docx_name = remove_emoji(doc_name).strip().replace('.md', '.docx')
        if not docx_name or docx_name == '.docx':
            docx_name = doc_name.replace('.md', '.docx')
        
        docx_file = os.path.join(output_dir, docx_name)
        
        try:
            parse_markdown_to_word(md_file, docx_file)
            success_count += 1
        except Exception as e:
            print(f"❌ 转换失败: {doc_name}")
            print(f"   错误: {str(e)}")
            fail_count += 1
    
    print()
    print("=" * 60)
    print(f"✅ 转换完成！成功: {success_count} 个，失败: {fail_count} 个")
    print(f"📁 输出目录: {output_dir}")
    print("=" * 60)

if __name__ == "__main__":
    main()

