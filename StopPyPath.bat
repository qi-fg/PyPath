@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$pidFile=Join-Path '%~dp0' '.pypath-server.pid'; if(Test-Path $pidFile){$id=Get-Content $pidFile -ErrorAction SilentlyContinue; if($id){Stop-Process -Id $id -Force -ErrorAction SilentlyContinue}; Remove-Item $pidFile -Force -ErrorAction SilentlyContinue}"
echo PyPath local server stopped.
timeout /t 2 /nobreak >nul
