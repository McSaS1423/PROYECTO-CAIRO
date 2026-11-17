#define AppName "Sistema Cairo"
#define AppVersion "1.0.9"
#define AppPublisher "Sistema Cairo"

[Setup]
AppId={{0C6E193B-AF1E-4E6F-A0BC-2AD8BC0BB9B1}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher={#AppPublisher}
DefaultDirName={localappdata}\Programs\Sistema Cairo
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
OutputDir=..\dist
OutputBaseFilename=Sistema-Cairo-Setup-1.0.9
SetupIconFile=..\cairo.ico
WizardImageFile={#GetEnv("CAIRO_WIZARD_IMAGE")}
WizardSmallImageFile={#GetEnv("CAIRO_WIZARD_SMALL_IMAGE")}
UninstallDisplayIcon={app}\cairo.ico
Compression=lzma2
SolidCompression=yes
WizardStyle=modern

[Tasks]
Name: "desktopicon"; Description: "Crear un acceso directo en el escritorio"; GroupDescription: "Accesos directos:"

[Files]
Source: "..\Sistema Cairo.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\cairo.ico"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\.cairo-runtime\node.exe"; DestDir: "{app}\.cairo-runtime"; Flags: ignoreversion
Source: "..\backend\server.js"; DestDir: "{app}\backend"; Flags: ignoreversion
Source: "..\backend\backup.js"; DestDir: "{app}\backend"; Flags: ignoreversion
Source: "..\backend\schema.sql"; DestDir: "{app}\backend"; Flags: ignoreversion
Source: "..\backend\restablecer-admin.js"; DestDir: "{app}\backend"; Flags: ignoreversion
Source: "..\backend\node_modules\*"; DestDir: "{app}\backend\node_modules"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\frontend\*"; DestDir: "{app}\frontend"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\restablecer-clave-admin.ps1"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\Sistema Cairo"; Filename: "{app}\Sistema Cairo.bat"; WorkingDir: "{app}"; IconFilename: "{app}\cairo.ico"
Name: "{autodesktop}\Sistema Cairo"; Filename: "{app}\Sistema Cairo.bat"; WorkingDir: "{app}"; IconFilename: "{app}\cairo.ico"; Tasks: desktopicon
Name: "{autoprograms}\Restablecer clave de administrador"; Filename: "{sys}\WindowsPowerShell\v1.0\powershell.exe"; Parameters: "-NoProfile -ExecutionPolicy Bypass -File ""{app}\restablecer-clave-admin.ps1"""; WorkingDir: "{app}"; IconFilename: "{app}\cairo.ico"

[Code]
procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
    SaveStringToFile(ExpandConstant('{app}\installed.marker'), 'installed' + #13#10, False);
end;
