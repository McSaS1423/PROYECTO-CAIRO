$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$compiler = Get-Command "ISCC.exe" -ErrorAction SilentlyContinue
if ($compiler) {
    $compilerPath = $compiler.Source
} else {
    $candidates = @(
        "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe",
        "$env:ProgramFiles\Inno Setup 6\ISCC.exe",
        "$env:LOCALAPPDATA\Programs\Inno Setup 6\ISCC.exe"
    )
    $compilerPath = $candidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
}

if (-not $compilerPath) {
    throw "No se encontro ISCC.exe. Instala Inno Setup 6 y vuelve a ejecutar este script."
}

$requiredFiles = @(
    ".cairo-runtime\node.exe",
    "backend\server.js",
    "backend\backup.js",
    "backend\restablecer-admin.js",
    "backend\schema.sql",
    "backend\node_modules\qrcode\package.json",
    "backend\node_modules\yazl\package.json",
    "backend\node_modules\yauzl\package.json",
    "frontend\login.html",
    "frontend\img\favicon.png",
    "cairo.ico",
    "installer\cairo-wizard.png",
    "Sistema Cairo.bat",
    "restablecer-clave-admin.ps1"
)
foreach ($file in $requiredFiles) {
    $path = Join-Path $projectRoot $file
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        throw "Falta un archivo necesario para el instalador: $file"
    }
}

$runtime = Join-Path $projectRoot ".cairo-runtime\node.exe"
$outputDirectory = Join-Path $projectRoot "dist"
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
$installerScript = Join-Path $PSScriptRoot "SistemaCairo.iss"
$wizardDirectory = Join-Path $env:TEMP ("SistemaCairo-Installer-" + [guid]::NewGuid().ToString("N"))
$wizardImage = Join-Path $wizardDirectory "wizard-image.bmp"
$wizardSmallImage = Join-Path $wizardDirectory "wizard-small-image.bmp"
$previousWizardImage = $env:CAIRO_WIZARD_IMAGE
$previousWizardSmallImage = $env:CAIRO_WIZARD_SMALL_IMAGE
Push-Location $projectRoot
try {
    & $runtime --no-warnings -e "require('node:sqlite').DatabaseSync; require('./backend/node_modules/qrcode'); require('./backend/backup')" 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "El Node portable no puede cargar SQLite, el modulo de respaldo o sus dependencias."
    }

    Add-Type -AssemblyName System.Drawing
    New-Item -ItemType Directory -Path $wizardDirectory | Out-Null
    $artwork = [System.Drawing.Image]::FromFile((Join-Path $projectRoot "installer\cairo-wizard.png"))
    $smallLogo = [System.Drawing.Image]::FromFile((Join-Path $projectRoot "frontend\img\favicon.png"))
    try {
        $wizardBitmap = New-Object System.Drawing.Bitmap(164, 314, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
        $wizardGraphics = [System.Drawing.Graphics]::FromImage($wizardBitmap)
        try {
            $wizardGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $wizardGraphics.DrawImage($artwork, 0, 0, 164, 314)
            $wizardBitmap.Save($wizardImage, [System.Drawing.Imaging.ImageFormat]::Bmp)
        } finally {
            $wizardGraphics.Dispose()
            $wizardBitmap.Dispose()
        }

        $smallBitmap = New-Object System.Drawing.Bitmap(55, 55, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
        $smallGraphics = [System.Drawing.Graphics]::FromImage($smallBitmap)
        try {
            $smallGraphics.Clear([System.Drawing.Color]::FromArgb(235, 246, 251))
            $smallGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $smallGraphics.DrawImage($smallLogo, 4, 4, 47, 47)
            $smallBitmap.Save($wizardSmallImage, [System.Drawing.Imaging.ImageFormat]::Bmp)
        } finally {
            $smallGraphics.Dispose()
            $smallBitmap.Dispose()
        }
    } finally {
        $smallLogo.Dispose()
        $artwork.Dispose()
    }

    $env:CAIRO_WIZARD_IMAGE = $wizardImage
    $env:CAIRO_WIZARD_SMALL_IMAGE = $wizardSmallImage
    & $compilerPath $installerScript
    if ($LASTEXITCODE -ne 0) {
        throw "Inno Setup no pudo crear el instalador (código $LASTEXITCODE)."
    }
} finally {
    if ($null -eq $previousWizardImage) {
        Remove-Item Env:\CAIRO_WIZARD_IMAGE -ErrorAction SilentlyContinue
    } else {
        $env:CAIRO_WIZARD_IMAGE = $previousWizardImage
    }
    if ($null -eq $previousWizardSmallImage) {
        Remove-Item Env:\CAIRO_WIZARD_SMALL_IMAGE -ErrorAction SilentlyContinue
    } else {
        $env:CAIRO_WIZARD_SMALL_IMAGE = $previousWizardSmallImage
    }
    Pop-Location
    if (Test-Path -LiteralPath $wizardDirectory) {
        Remove-Item -LiteralPath $wizardDirectory -Recurse -Force
    }
}

$installer = Join-Path $outputDirectory "Sistema-Cairo-Setup-1.0.9.exe"
if (-not (Test-Path -LiteralPath $installer -PathType Leaf)) {
    throw "Inno Setup termino, pero no se encontro el instalador esperado: $installer"
}

Write-Host "Instalador creado: $installer"
