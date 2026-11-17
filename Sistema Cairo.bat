@echo off
setlocal
cd /d "%~dp0"
set "CAIRO_DIR=%~dp0"
set "CAIRO_DATA_DIR="
if exist "%CAIRO_DIR%installed.marker" set "CAIRO_DATA_DIR=%LOCALAPPDATA%\Sistema Cairo"
if defined CAIRO_DATA_DIR (
    call :preparar_datos
    if errorlevel 1 exit /b 1
) else (
    set "CAIRO_DB=%CAIRO_DIR%backend\cairo.db"
)
set "CAIRO_HOST=0.0.0.0"
set "CAIRO_PORT=5000"
set "HOST=%CAIRO_HOST%"
set "PORT=%CAIRO_PORT%"
set "CAIRO_URL=http://127.0.0.1:%CAIRO_PORT%"
set "CAIRO_LAN_IP="
set "CAIRO_ICON=%~dp0cairo.ico"
if not exist "%CAIRO_ICON%" set "CAIRO_ICON=%~dp0frontend\img\logo-cairo.ico"
if not exist "%CAIRO_ICON%" set "CAIRO_ICON=%~dp0frontend\img\logo-cairo.png"
for /f "usebackq delims=" %%I in (`powershell.exe -NoProfile -Command "$configs = @(Get-NetIPConfiguration | Where-Object { $_.NetAdapter.Status -eq 'Up' -and $_.IPv4DefaultGateway -and $_.IPv4Address }); $wifi = Get-NetAdapter -Physical | Where-Object { $_.Status -eq 'Up' -and $_.NdisPhysicalMedium -eq 9 } | Select-Object -First 1; $config = $null; if ($wifi) { $config = $configs | Where-Object { $_.InterfaceIndex -eq $wifi.ifIndex } | Select-Object -First 1 }; if (-not $config) { $config = $configs | Select-Object -First 1 }; if ($config) { $config.IPv4Address | Where-Object { $_.IPAddress -notlike '169.254.*' } | Select-Object -First 1 -ExpandProperty IPAddress }"`) do set "CAIRO_LAN_IP=%%I"
set "CAIRO_CHECK_URL=%CAIRO_URL%"
set "CAIRO_NODE=node"
set "CAIRO_RUNTIME=%~dp0.cairo-runtime\node.exe"
set "CAIRO_BAT=%~f0"

echo Comprobando el acceso de Cairo en el firewall (solo red local)...
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $marker=':__CAIRO_FIREWALL_EMBEDDED__'; $text=[IO.File]::ReadAllText($env:CAIRO_BAT); $index=$text.LastIndexOf($marker); if($index -lt 0){throw 'No se encuentra el modulo de firewall dentro del BAT.'}; $scriptPath=Join-Path $env:TEMP ('CairoFirewall-'+[guid]::NewGuid().ToString('N')+'.ps1'); $scriptText=$text.Substring($index+$marker.Length).TrimStart([char[]]@([char]13,[char]10)); [IO.File]::WriteAllText($scriptPath,$scriptText,[Text.UTF8Encoding]::new($true)); try { $result=& $scriptPath; if($result -isnot [int]){throw 'El modulo de firewall no devolvio un resultado valido.'} } catch { Write-Host $_ -ForegroundColor Red; $result=1 } finally { Remove-Item -LiteralPath $scriptPath -Force -ErrorAction SilentlyContinue }; exit $result"
if errorlevel 1 (
    echo No se pudo habilitar el acceso de Cairo en el firewall.
    echo Acepta el aviso de administrador de Windows si aparece y vuelve a iniciar.
    echo Cairo no se iniciara sin habilitar el acceso seguro desde la red local.
    pause
    exit /b 1
)

where node >nul 2>nul
if errorlevel 1 goto buscar_runtime
node -e "require('node:sqlite').DatabaseSync" >nul 2>nul
if not errorlevel 1 goto comprobar_servidor

:buscar_runtime
set "CAIRO_NODE=%CAIRO_RUNTIME%"
if exist "%CAIRO_RUNTIME%" goto probar_runtime

echo No hay una version compatible de Node.js instalada.
echo Preparando Cairo con el runtime oficial portable...
set "CAIRO_ARCH=%PROCESSOR_ARCHITECTURE%"
if defined PROCESSOR_ARCHITEW6432 set "CAIRO_ARCH=%PROCESSOR_ARCHITEW6432%"
if /i "%CAIRO_ARCH%"=="AMD64" set "CAIRO_ARCH=win-x64"
if /i "%CAIRO_ARCH%"=="ARM64" set "CAIRO_ARCH=win-arm64"
if /i "%CAIRO_ARCH%"=="x86" set "CAIRO_ARCH=win-x86"
if not "%CAIRO_ARCH:~0,4%"=="win-" (
    echo No se reconoce la arquitectura de Windows: %CAIRO_ARCH%.
    pause
    exit /b 1
)

if not exist "%~dp0.cairo-runtime" mkdir "%~dp0.cairo-runtime"
if errorlevel 1 goto error_runtime
curl.exe --fail --location --silent --show-error --retry 2 --connect-timeout 15 --max-time 300 "https://nodejs.org/dist/latest-v22.x/%CAIRO_ARCH%/node.exe" --output "%CAIRO_RUNTIME%"
if errorlevel 1 goto error_runtime

:probar_runtime
"%CAIRO_RUNTIME%" -e "require('node:sqlite').DatabaseSync" >nul 2>nul
if errorlevel 1 (
    del /q "%CAIRO_RUNTIME%" >nul 2>nul
    echo El runtime descargado no es compatible con este equipo.
    pause
    exit /b 1
)

:comprobar_servidor
curl.exe --silent --fail --max-time 2 "%CAIRO_CHECK_URL%/api/system-status" 2>nul | findstr.exe /x /c:"cairo-api:aforo-v1" >nul
if not errorlevel 1 goto servidor_listo
curl.exe --silent --fail --max-time 2 "%CAIRO_CHECK_URL%/login.html" >nul 2>nul
if not errorlevel 1 goto servidor_desactualizado

echo Iniciando Sistema Cairo...
echo Direccion local: %CAIRO_URL%
echo Base de datos persistente: %CAIRO_DB%
echo Espera mientras se prepara la base de datos.
echo.
start "" /b /d "%CAIRO_DIR%backend" "%CAIRO_NODE%" "%CAIRO_DIR%backend\server.js"

for /L %%I in (1,1,45) do (
    curl.exe --silent --fail --max-time 2 "%CAIRO_CHECK_URL%/api/system-status" 2>nul | findstr.exe /x /c:"cairo-api:aforo-v1" >nul
    if not errorlevel 1 goto servidor_listo
    timeout /t 1 /nobreak >nul
)

echo.
echo No se pudo iniciar Cairo en %CAIRO_URL%.
echo Revisa los errores mostrados arriba y verifica que el puerto 5000 este disponible.
pause
exit /b 1

:servidor_desactualizado
echo.
echo Hay una version anterior de Cairo activa en %CAIRO_URL%.
echo Cierra la ventana o terminal que mantiene abierto el servidor anterior.
echo Luego vuelve a ejecutar "Sistema Cairo.bat" para cargar el control de aforo.
echo No se detuvo el proceso anterior automaticamente.
pause
exit /b 1

:servidor_listo
echo.
echo Sistema Cairo esta activo en %CAIRO_URL%
if defined CAIRO_LAN_IP (
    echo Enlace para telefono o tablet: http://%CAIRO_LAN_IP%:%CAIRO_PORT%
    echo Conecta el dispositivo a la misma red Wi-Fi que este equipo.
) else (
    echo No se detecto una direccion Wi-Fi o de red local. Revisa la conexion a la red.
)
echo Abriendo el navegador predeterminado (Chrome, Edge, Opera u otro instalado)...
start "" "%CAIRO_URL%"
if exist "%CAIRO_ICON%" (
    "%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $shell=New-Object -ComObject WScript.Shell; $desktop=[Environment]::GetFolderPath('Desktop'); $destinos=@((Join-Path $desktop 'Sistema Cairo.lnk'),(Join-Path $env:CAIRO_DIR 'Sistema Cairo.lnk')); foreach($destino in $destinos){ $shortcut=$shell.CreateShortcut($destino); $shortcut.TargetPath=$env:CAIRO_BAT; $shortcut.WorkingDirectory=$env:CAIRO_DIR; $shortcut.IconLocation=$env:CAIRO_ICON + ',0'; $shortcut.Description='Iniciar Sistema Cairo'; $shortcut.WindowStyle=1; $shortcut.Save() }"
) else (
    echo No se encontro un icono valido para crear el acceso directo; Cairo sigue funcionando.
)
if errorlevel 1 echo No se pudo crear el acceso directo; Cairo sigue funcionando.
echo Deja esta ventana abierta mientras uses Cairo.
pause
exit /b 0

:error_runtime
if exist "%CAIRO_RUNTIME%" del /q "%CAIRO_RUNTIME%" >nul 2>nul
echo No se pudo descargar Node.js desde el sitio oficial.
echo Conecta este equipo a Internet y vuelve a iniciar, o copia la carpeta .cairo-runtime desde otro equipo.
pause
exit /b 1

:preparar_datos
if not exist "%CAIRO_DATA_DIR%" mkdir "%CAIRO_DATA_DIR%"
if errorlevel 1 (
    echo No se pudo crear la carpeta de datos de Cairo: %CAIRO_DATA_DIR%
    pause
    exit /b 1
)
set "CAIRO_DB=%CAIRO_DATA_DIR%\cairo.db"
exit /b 0

:__CAIRO_FIREWALL_EMBEDDED__
param(
    [switch]$Elevated
)

$ErrorActionPreference = "Stop"
$ruleName = "CairoPrivateTcp5000"
$displayName = "Sistema Cairo - TCP 5000 (red local)"

function Test-CairoFirewallRule {
    $rules = @(Get-NetFirewallRule -Name $ruleName -ErrorAction SilentlyContinue)
    foreach ($rule in $rules) {
        $portFilter = $rule | Get-NetFirewallPortFilter
        $addressFilter = $rule | Get-NetFirewallAddressFilter
        if ($rule.Enabled -eq "True" -and
            $rule.Direction -eq "Inbound" -and
            $rule.Action -eq "Allow" -and
            $rule.Profile -eq "Any" -and
            $portFilter.Protocol -eq "TCP" -and
            $portFilter.LocalPort -contains "5000" -and
            $addressFilter.RemoteAddress -contains "LocalSubnet") {
            return $true
        }
    }

    return $false
}

try {
    if (-not $Elevated) {
        if (Test-CairoFirewallRule) {
            return 0
        }

        $arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + $PSCommandPath + '" -Elevated'
        $process = Start-Process -FilePath "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe" `
            -ArgumentList $arguments -Verb RunAs -Wait -PassThru
        if ($process.ExitCode -ne 0) {
            throw "Windows no pudo configurar la regla de firewall de Cairo (código $($process.ExitCode))."
        }
        return 0
    }

    Get-NetFirewallRule -Name $ruleName -ErrorAction SilentlyContinue |
        Remove-NetFirewallRule -ErrorAction Stop
    New-NetFirewallRule -Name $ruleName -DisplayName $displayName `
        -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow `
        -Profile Any -RemoteAddress LocalSubnet | Out-Null

    if (-not (Test-CairoFirewallRule)) {
        throw "Windows no confirmó la regla TCP 5000 limitada a la subred local."
    }
    if ($Elevated) {
        exit 0
    }
    return 0
}
catch {
    Write-Host "No se pudo habilitar el acceso local al puerto TCP 5000: $($_.Exception.Message)" -ForegroundColor Red
    if ($Elevated) {
        Read-Host "Presiona Enter para cerrar esta ventana" | Out-Null
        exit 1
    }
    return 1
}
