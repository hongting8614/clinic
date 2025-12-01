@echo off
chcp 65001 > nul
echo 正在生成文档...
python generate_doc.py
pause
