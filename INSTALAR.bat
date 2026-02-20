@echo off
chcp 65001 >nul
title Velart POS - Instalador
color 0A
echo.
echo  ██╗   ██╗███████╗██╗      █████╗ ██████╗ ████████╗
echo  ██║   ██║██╔════╝██║     ██╔══██╗██╔══██╗╚══██╔══╝
echo  ██║   ██║█████╗  ██║     ███████║██████╔╝   ██║
echo  ╚██╗ ██╔╝██╔══╝  ██║     ██╔══██║██╔══██╗   ██║
echo   ╚████╔╝ ███████╗███████╗██║  ██║██║  ██║   ██║
echo    ╚═══╝  ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝
echo.
echo  Sistema POS v1.0
echo  ─────────────────────────────────────────────────
echo.

:: Verificar Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado.
    echo         Descárgalo en: https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js detectado.

:: Instalar dependencias
echo.
echo [1/2] Instalando dependencias (puede tardar 1-2 minutos)...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Falló la instalación de dependencias.
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas.

echo.
echo [2/2] Iniciando Velart POS...
echo.
echo  ┌─────────────────────────────────────────────┐
echo  │  La aplicación abrirá en:                   │
echo  │  http://localhost:5173                       │
echo  │                                             │
echo  │  Usuario: admin                             │
echo  │  Contraseña: 1234                           │
echo  │                                             │
echo  │  Para detener: Ctrl + C                     │
echo  └─────────────────────────────────────────────┘
echo.

:: Abrir el navegador después de 3 segundos
start /b "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5173"

call npm run dev
