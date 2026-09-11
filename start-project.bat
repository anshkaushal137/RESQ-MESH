@echo off
title ResQ-Mesh Master Controller
echo ===================================================
echo       STARTING RESQ-MESH ECOSYSTEM (AI + RELAY + UI)
echo ===================================================

echo [1/3] Launching AI Dispatch Engine (Port 8000)...
start "ResQ-Mesh AI Engine" cmd /k "cd /d C:\Users\ASUS\RESQ MESH\RESQ-MESH\ai-service && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/3] Launching Node.js Relay Server (Port 5000)...
start "ResQ-Mesh Backend Relay" cmd /k "cd /d C:\Users\ASUS\RESQ MESH\RESQ-MESH\backend && node server.js"

timeout /t 3 /nobreak >nul

echo [3/3] Launching Vite Frontend (Port 5174)...
start "ResQ-Mesh Dashboard" cmd /k "cd /d C:\Users\ASUS\RESQ MESH\RESQ-MESH\frontend && npm run dev -- --port 5174"

timeout /t 4 /nobreak >nul
echo Launching Tactical Dashboard in default browser...
start http://localhost:5174

echo ===================================================
echo ResQ-Mesh is fully running! Press any key to exit this console.
pause
