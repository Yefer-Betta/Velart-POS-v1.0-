@echo off
chcp 65001 >nul
title Velart POS - Iniciar
color 0B
echo.
echo [Velart POS] Iniciando servidor...
echo.

node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado. Ejecuta INSTALAR.bat primero.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [INFO] Primera vez: instalando dependencias...
    call npm install
)

echo  Abriendo en: http://localhost:5173
echo  Usuario: admin  /  Contraseña: 1234
echo  Para detener: Ctrl + C
echo.

start /b "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5173"
call npm run dev
