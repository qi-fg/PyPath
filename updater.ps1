param(
    [string]$Root = (Split-Path -Parent $MyInvocation.MyCommand.Path),
    [switch]$ForceCheck
)

$ErrorActionPreference = 'Stop'
$configPath = Join-Path $Root 'update-config.json'
$versionPath = Join-Path $Root 'version.json'
$statusPath = Join-Path $Root 'update-status.json'

function Write-UpdateStatus([string]$state, [string]$message, [string]$version = '') {
    $obj = [ordered]@{
        state = $state
        message = $message
        version = $version
        checkedAt = (Get-Date).ToString('o')
    }
    $obj | ConvertTo-Json | Set-Content -Path $statusPath -Encoding UTF8
}

function Get-VersionText([string]$path) {
    if (-not (Test-Path $path)) { return '0.0.0' }
    try {
        return ((Get-Content $path -Raw | ConvertFrom-Json).version)
    } catch {
        return '0.0.0'
    }
}

try {
    if (-not (Test-Path $configPath)) {
        Write-UpdateStatus 'not_configured' 'Update configuration is missing.'
        exit 0
    }

    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    if (-not $ForceCheck -and $config.autoCheck -eq $false) {
        Write-UpdateStatus 'disabled' 'Automatic update check is disabled.'
        exit 0
    }

    $manifestUrl = [string]$config.manifestUrl
    if ([string]::IsNullOrWhiteSpace($manifestUrl)) {
        $manifestUrl = 'https://raw.githubusercontent.com/qi-fg/PyPath/main/update-manifest.json'
    }

    $currentVersion = Get-VersionText $versionPath
    $manifest = Invoke-RestMethod -Uri $manifestUrl -TimeoutSec 5 -UseBasicParsing
    $remoteVersion = [string]$manifest.version
    $downloadUrl = [string]$manifest.downloadUrl

    if ([string]::IsNullOrWhiteSpace($remoteVersion) -or [string]::IsNullOrWhiteSpace($downloadUrl)) {
        throw 'Invalid update manifest.'
    }

    if ([version]$remoteVersion -le [version]$currentVersion) {
        Write-UpdateStatus 'up_to_date' "Current version is up to date: $currentVersion" $currentVersion
        exit 0
    }

    $tempRoot = Join-Path $env:TEMP ('PyPath-update-' + [guid]::NewGuid().ToString('N'))
    $zipPath = Join-Path $tempRoot 'update.zip'
    $extractPath = Join-Path $tempRoot 'payload'
    New-Item -ItemType Directory -Path $extractPath -Force | Out-Null

    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath -UseBasicParsing -TimeoutSec 60

    $expectedHash = [string]$manifest.sha256
    if (-not [string]::IsNullOrWhiteSpace($expectedHash)) {
        $actualHash = (Get-FileHash -Path $zipPath -Algorithm SHA256).Hash.ToLowerInvariant()
        if ($actualHash -ne $expectedHash.ToLowerInvariant()) {
            throw 'SHA256 verification failed.'
        }
    }

    Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

    $candidate = $extractPath
    if (-not (Test-Path (Join-Path $candidate 'index.html'))) {
        $versionFile = Get-ChildItem -Path $extractPath -Filter 'version.json' -Recurse -File | Select-Object -First 1
        if ($versionFile) { $candidate = $versionFile.Directory.FullName }
    }

    if (-not (Test-Path (Join-Path $candidate 'index.html')) -or -not (Test-Path (Join-Path $candidate 'version.json'))) {
        throw 'Update package does not contain a valid PyPath application.'
    }

    $packageVersion = Get-VersionText (Join-Path $candidate 'version.json')
    if ([version]$packageVersion -ne [version]$remoteVersion) {
        throw 'Package version does not match manifest version.'
    }

    $backupRoot = Join-Path $Root '.update-backup'
    if (Test-Path $backupRoot) { Remove-Item $backupRoot -Recurse -Force }
    New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null

    $skipNames = @('update-config.json', 'user-data', '.pypath-server.pid', '.pypath-port', '.pypath-server.out.log', '.pypath-server.err.log', '.update-backup', 'update-status.json')
    $payloadItems = Get-ChildItem -Path $candidate -Force

    foreach ($item in $payloadItems) {
        if ($skipNames -contains $item.Name) { continue }
        $destination = Join-Path $Root $item.Name
        if (Test-Path $destination) {
            Copy-Item -Path $destination -Destination $backupRoot -Recurse -Force
        }
    }

    try {
        foreach ($item in $payloadItems) {
            if ($skipNames -contains $item.Name) { continue }
            $destination = Join-Path $Root $item.Name
            if (Test-Path $destination) { Remove-Item $destination -Recurse -Force }
            Copy-Item -Path $item.FullName -Destination $destination -Recurse -Force
        }
        Write-UpdateStatus 'updated' "Updated PyPath from $currentVersion to $remoteVersion." $remoteVersion
    } catch {
        Get-ChildItem -Path $backupRoot -Force | ForEach-Object {
            $destination = Join-Path $Root $_.Name
            if (Test-Path $destination) { Remove-Item $destination -Recurse -Force }
            Copy-Item -Path $_.FullName -Destination $destination -Recurse -Force
        }
        throw
    } finally {
        if (Test-Path $tempRoot) { Remove-Item $tempRoot -Recurse -Force -ErrorAction SilentlyContinue }
    }
} catch {
    Write-UpdateStatus 'error' $_.Exception.Message
    exit 0
}
