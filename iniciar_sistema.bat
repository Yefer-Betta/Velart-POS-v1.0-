@echo off
echo Iniciando Sistema Velart...
echo ==========================================
echo Para acceder desde el celular:
echo 1. Conecta tu celular al mismo Wifi que esta PC.
echo 2. Mira la direccion "Network" que aparecera abajo (ej: http://192.168.1.X:5173)
echo 3. Escribe esa direccion en el Chrome de tu celular.
echo ==========================================
echo.
npm run dev -- --host
pause
