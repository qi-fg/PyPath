@echo off
cd /d "%~dp0"
echo Upgrading the PyPath installation used by your Desktop shortcut...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
 "$ErrorActionPreference='Stop'; $src=(Resolve-Path '%~dp0').Path.TrimEnd('\'); $desktop=[Environment]::GetFolderPath('Desktop'); $link=Join-Path $desktop 'PyPath.lnk'; if(-not (Test-Path $link)){throw 'Desktop shortcut PyPath.lnk was not found.'}; $ws=New-Object -ComObject WScript.Shell; $target=$ws.CreateShortcut($link).TargetPath; if(-not $target){throw 'Could not read the PyPath shortcut target.'}; $dest=(Split-Path -Parent $target).TrimEnd('\'); if(-not (Test-Path $dest)){throw 'The existing PyPath folder no longer exists.'}; $pidFile=Join-Path $dest '.pypath-server.pid'; if(Test-Path $pidFile){$pid=Get-Content $pidFile; Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue; Remove-Item $pidFile -Force -ErrorAction SilentlyContinue}; if($src -ne $dest){Get-ChildItem $src -Force ^| Where-Object {$_.Name -notin @('.pypath-server.pid','.update-backup','update-status.json')} ^| ForEach-Object { if($_.Name -eq 'update-config.json' -and (Test-Path (Join-Path $dest 'update-config.json'))){return}; Copy-Item $_.FullName -Destination (Join-Path $dest $_.Name) -Recurse -Force }}; Start-Process $target; Write-Host 'Upgrade complete. Your existing Desktop shortcut is still valid.'"
if errorlevel 1 (
  echo.
  echo Upgrade failed. Make sure the Desktop shortcut named PyPath still exists.
  pause
  exit /b 1
)
timeout /t 3 /nobreak >nul
