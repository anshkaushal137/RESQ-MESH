@echo off
echo Stopping all ResQ-Mesh services...
taskkill /f /im node.exe 2>nul
taskkill /f /im python.exe 2>nul
echo All ResQ-Mesh processes stopped.
pause
