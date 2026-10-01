@echo off
cd /d "%~dp0"
echo ==============================
echo PyPath Debug Start V3.0.0
echo ==============================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0launcher.ps1"
echo.
echo ---- server error log ----
if exist ".pypath-server.err.log" type ".pypath-server.err.log"
echo.
echo ---- selected port ----
if exist ".pypath-port" type ".pypath-port"
echo.
pause
