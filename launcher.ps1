$ErrorActionPreference = 'SilentlyContinue'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$pidFile = Join-Path $root '.pypath-server.pid'
$portFile = Join-Path $root '.pypath-port'
$outLog = Join-Path $root '.pypath-server.out.log'
$errLog = Join-Path $root '.pypath-server.err.log'
$updater = Join-Path $root 'updater.ps1'

if (Test-Path $updater) {
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File $updater -Root $root | Out-Null

    $updateStatusFile = Join-Path $root 'update-status.json'
    if (Test-Path $updateStatusFile) {
        try {
            $updateStatus = Get-Content $updateStatusFile -Raw | ConvertFrom-Json
            if ($updateStatus.state -eq 'updated' -and (Test-Path $pidFile)) {
                $oldPid = [int](Get-Content $pidFile -Raw).Trim()
                $oldProc = Get-Process -Id $oldPid -ErrorAction SilentlyContinue
                if ($oldProc) {
                    Stop-Process -Id $oldPid -Force -ErrorAction SilentlyContinue
                    Start-Sleep -Milliseconds 700
                }
            }
        } catch {}
    }
}

function Test-TcpPort([int]$Port) {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $iar = $client.BeginConnect('127.0.0.1', $Port, $null, $null)
        if (-not $iar.AsyncWaitHandle.WaitOne(250, $false)) { return $false }
        $client.EndConnect($iar)
        return $true
    } catch {
        return $false
    } finally {
        try { $client.Close() } catch {}
    }
}

function Test-PyPathServer([int]$Port) {
    try {
        $stamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
        $resp = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/version.json?probe=$stamp" -UseBasicParsing -TimeoutSec 1
        if ($resp.StatusCode -lt 200 -or $resp.StatusCode -ge 300) { return $false }
        $meta = $resp.Content | ConvertFrom-Json
        return ($meta.name -eq 'PyPath')
    } catch {
        return $false
    }
}

function Find-FreePort {
    $preferred = 8000
    if (Test-Path $portFile) {
        try {
            $saved = [int](Get-Content $portFile -Raw).Trim()
            if ($saved -ge 1024 -and $saved -le 65535) { $preferred = $saved }
        } catch {}
    }

    $candidates = New-Object System.Collections.Generic.List[int]
    $candidates.Add($preferred)
    if ($preferred -ne 8000) { $candidates.Add(8000) }
    foreach ($p in 8001..8020) {
        if (-not $candidates.Contains($p)) { $candidates.Add($p) }
    }

    foreach ($p in $candidates) {
        if (Test-PyPathServer $p) {
            return @{ Port = $p; Existing = $true }
        }
        if (-not (Test-TcpPort $p)) {
            return @{ Port = $p; Existing = $false }
        }
    }
    return $null
}

$choice = Find-FreePort
if (-not $choice) {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show(
        "PyPath could not find a free local port between 8000 and 8020.",
        "PyPath cannot start",
        'OK',
        'Warning'
    ) | Out-Null
    exit 1
}

$port = [int]$choice.Port
$url = "http://127.0.0.1:$port"
Set-Content -Path $portFile -Value $port -Encoding ASCII

if (-not $choice.Existing) {
    $pythonCmd = $null
    $pythonArgs = @()

    $python = Get-Command python -ErrorAction SilentlyContinue
    if ($python) {
        $pythonCmd = $python.Source
    } else {
        $py = Get-Command py -ErrorAction SilentlyContinue
        if ($py) {
            $pythonCmd = $py.Source
            $pythonArgs = @('-3')
        }
    }

    if (-not $pythonCmd) {
        Add-Type -AssemblyName PresentationFramework
        [System.Windows.MessageBox]::Show(
            "Python 3 was not found. Install Python 3 and enable Add Python to PATH.",
            "PyPath cannot start",
            'OK',
            'Warning'
        ) | Out-Null
        exit 1
    }

    Remove-Item $outLog, $errLog -Force -ErrorAction SilentlyContinue
    $args = $pythonArgs + @((Join-Path $root 'server.py'), '--port', "$port")

    try {
        $proc = Start-Process -FilePath $pythonCmd -ArgumentList $args -WorkingDirectory $root -WindowStyle Hidden -PassThru -RedirectStandardOutput $outLog -RedirectStandardError $errLog
    } catch {
        $proc = $null
    }

    if ($proc) {
        Set-Content -Path $pidFile -Value $proc.Id -Encoding ASCII
    }

    $ready = $false
    for ($i = 0; $i -lt 40; $i++) {
        Start-Sleep -Milliseconds 250
        if (Test-PyPathServer $port) { $ready = $true; break }
        if ($proc -and $proc.HasExited) { break }
    }

    if (-not $ready) {
        $detail = ""
        if (Test-Path $errLog) {
            try {
                $detail = (Get-Content $errLog -Raw).Trim()
                if ($detail.Length -gt 700) { $detail = $detail.Substring(0,700) + '...' }
            } catch {}
        }
        if ([string]::IsNullOrWhiteSpace($detail)) {
            $detail = "No detailed Python error was captured."
        }

        Add-Type -AssemblyName PresentationFramework
        [System.Windows.MessageBox]::Show(
            "PyPath local server could not start on port $port.`n`n$detail`n`nA log was saved in the PyPath folder.",
            "PyPath startup failed",
            'OK',
            'Warning'
        ) | Out-Null
        exit 1
    }
}

$stamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
Start-Process "$url/?v=$stamp"
