@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$desktop=[Environment]::GetFolderPath('Desktop'); $ws=New-Object -ComObject WScript.Shell; $sc=$ws.CreateShortcut((Join-Path $desktop 'PyPath.lnk')); $sc.TargetPath=(Join-Path '%~dp0' 'PyPath.vbs'); $sc.WorkingDirectory='%~dp0'; $sc.IconLocation='shell32.dll,14'; $sc.Save()"
echo PyPath shortcut created on Desktop.
timeout /t 2 /nobreak >nul
