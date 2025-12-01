@echo off
cd /d "%~dp0"
python generate_doc.py
if errorlevel 1 (
    echo Failed to run script
    python -c "import sys; print('Python version:', sys.version)"
)
pause
