$ErrorActionPreference = "Stop"

function ConvertTo-PlainText {
    param([Security.SecureString]$SecureValue)

    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    } finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    }
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
if (Test-Path -LiteralPath (Join-Path $projectRoot "installed.marker")) {
    $dataDirectory = Join-Path $env:LOCALAPPDATA "Sistema Cairo"
    $databasePath = Join-Path $dataDirectory "cairo.db"
} else {
    $databasePath = Join-Path $projectRoot "backend\cairo.db"
}

if (-not (Test-Path -LiteralPath $databasePath -PathType Leaf)) {
    throw "No se encontro la base de datos de Cairo. No se modifico ningun dato."
}

$firstPassword = Read-Host "Escribe la nueva contraseña (minimo 6 caracteres)" -AsSecureString
$confirmedPassword = Read-Host "Confirma la nueva contraseña" -AsSecureString
$password = $null
$confirmation = $null
try {
    $password = ConvertTo-PlainText $firstPassword
    $confirmation = ConvertTo-PlainText $confirmedPassword
    if ($password.Length -lt 6) {
        throw "La contraseña debe tener al menos 6 caracteres."
    }
    if ($password -cne $confirmation) {
        throw "Las contraseñas no coinciden. No se modifico ningun dato."
    }

    $runtime = Join-Path $projectRoot ".cairo-runtime\node.exe"
    if (-not (Test-Path -LiteralPath $runtime -PathType Leaf)) {
        $nodeCommand = Get-Command "node.exe" -ErrorAction SilentlyContinue
        if (-not $nodeCommand) {
            throw "No se encontro Node.js. Usa la instalacion de Cairo que incluye su runtime."
        }
        $runtime = $nodeCommand.Source
    }

    $env:CAIRO_DB = $databasePath
    $env:CAIRO_NEW_PASSWORD = $password
    & $runtime --no-warnings (Join-Path $projectRoot "backend\restablecer-admin.js")
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo restablecer la contraseña."
    }
} finally {
    Remove-Item Env:CAIRO_DB,Env:CAIRO_NEW_PASSWORD -ErrorAction SilentlyContinue
    $password = $null
    $confirmation = $null
    if ($firstPassword) { $firstPassword.Dispose() }
    if ($confirmedPassword) { $confirmedPassword.Dispose() }
}
