# Proyecto CAIRO · Sistema clínico (Node.js + SQLite)

## Iniciar
- **Windows:** doble clic en `Sistema Cairo.bat`. Detecta la IPv4 activa de la Wi-Fi (o de otra conexión local) y muestra el enlace correcto para el teléfono; no fija ninguna IP en el programa, así que al cambiar de router o computadora detecta la dirección que esa red asignó. El login también muestra el enlace de la red en una casilla blanca, con botón para copiarlo, y lo actualiza periódicamente. La primera vez solicita aprobación de administrador para permitir TCP 5000 solo desde la subred local; después reutiliza la regla del firewall y el servidor Node se inicia sin privilegios de administrador. Toda la configuración de firewall va integrada en el `.bat`; no necesita un archivo `.ps1` separado. Usa un Node compatible ya instalado o descarga Node.js 22 LTS portable si hace falta. También abre el navegador predeterminado de Windows (por ejemplo, Chrome, Edge u Opera) y crea el acceso directo **Sistema Cairo**. Para acceder desde el móvil, ambos dispositivos deben estar conectados a la misma red Wi-Fi.
- **Terminal en PowerShell:** `cd backend` y `npm.cmd start` → http://localhost:5000
- **Terminal en CMD:** `cd backend` y `npm start` → http://localhost:5000
- **Linux / Mac:** `node backend/server.js` con Node.js 22.5 o superior → http://localhost:5000.
- El backend usa SQLite integrado en Node y la dependencia `qrcode`, instalada en `backend/node_modules` (para reinstalarla, ejecuta `npm install` desde `backend`). Conserva los datos de `backend/cairo.db` y escucha en la red local para permitir el acceso desde otros dispositivos.
- La dirección local puede cambiar al cambiar de red, router o computadora. El `.bat` la vuelve a detectar al iniciar; una reserva DHCP se configura en el router para esa computadora y no queda fijada en el programa.

## Instalador de Windows
- Para generar `dist\Sistema-Cairo-Setup-1.0.9.exe`, instala Inno Setup 6 y ejecuta `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\installer\build-installer.ps1` desde la carpeta del proyecto.
- El instalador incluye el programa, sus dependencias y Node.js portable; no requiere instalar Node.js en la computadora destino. El acceso directo del escritorio y el ejecutable usan `cairo.ico`; el asistente usa la ilustración `installer\cairo-wizard.png` y el icono turquesa `frontend\img\favicon.png`.
- La instalación crea una base de datos nueva en `%LOCALAPPDATA%\Sistema Cairo`. No empaqueta `backend\cairo.db`, las fotos de `backend\uploads` ni la clave privada, para no distribuir registros o secretos de esta computadora.
- Al actualizar una instalación, la base de datos y los archivos de `%LOCALAPPDATA%\Sistema Cairo` se conservan. Desde Ajustes puedes exportar un respaldo ZIP que incluye los registros y archivos subidos; las preferencias de apariencia y bloques se guardan por separado en el navegador.
- Tras instalar, inicia **Sistema Cairo** desde el acceso directo del escritorio o del menú Inicio. La primera ejecución solicita permiso para habilitar el acceso de la red local en el firewall.
- Si olvidaste la contraseña de `admin_cairo`, usa **Restablecer clave de administrador** en el menú Inicio. La herramienta pide una nueva contraseña y solo actualiza esa cuenta; no elimina pacientes, fotos ni otros usuarios.

Usuario inicial: **admin_cairo** · Contraseña: **cairo2026** (cámbiala con `POST /api/me/clave`). El inicio de sesión usa consultas SQL parametrizadas y valida el tipo y tamaño de los datos recibidos para evitar inyección SQL.
Datos de ejemplo (opcional): `node backend/seed.js` (solo se cargan si todavía no hay pacientes).

## Acceso por rol
Los usuarios con rol **Veterinario** o **Asistente** pueden entrar a Inicio, Pacientes, Propietarios, Citas e Historias Médicas. En el panel no se muestran las tarjetas de vacunaciones, desparasitaciones, castraciones, esterilizaciones ni consultas, y sus conteos y actividad reciente no se incluyen en la API del panel. Los demás módulos y sus API quedan restringidos; los roles administrativos conservan el acceso completo.

Desde una historia médica se pueden registrar vacunaciones, desparasitaciones, castraciones, esterilizaciones y consultas. Las consultas aparecen en Atenciones; las desparasitaciones y esterilizaciones se vinculan además a sus módulos clínicos. El inicio del administrador muestra los conteos semanales y los nombres de los pacientes con actividad clínica reciente.

## Módulos del diagrama ER
El menú incluye administración de usuarios y administradores, veterinarios, jornadas, atenciones e historias médicas, vacunaciones, desparasitaciones, esterilizaciones, inventario, movimientos y medicamentos. Los nuevos registros se relacionan con pacientes, citas, jornadas, veterinarios y artículos según corresponda. Las entradas y salidas de inventario actualizan las existencias; no se permite registrar una salida superior al stock disponible.

Dentro de la ficha **Nuevo/Editar paciente**, el **Identificador visual** permite personalizar el avatar de perros y gatos: pelaje, patrón, color y ubicación de manchas, ojos, orejas, hocico, nariz y collar. El diseño se previsualiza y se guarda con el paciente. En la misma ficha puedes administrar el catálogo de razas por especie, elegir una raza o escribir otra, y guardar las señas particulares. Los listados y módulos de registros ofrecen eliminación con confirmación; al eliminar un propietario, sus pacientes y sus historias se conservan sin propietario asignado.

## Estructura
```
backend/
  package.json    dependencias y comando de inicio
  package-lock.json versiones bloqueadas de las dependencias
  node_modules/   módulos de Node.js instalados
  server.js       servidor + API REST (/api/...) y sirve el frontend
  seed.js         carga opcional de datos de ejemplo
  schema.sql      tablas del sistema clínico, atenciones e inventario
  cairo.db        base de datos (se crea sola al iniciar)
  uploads/        fotos de pacientes (se crea sola)
frontend/
  login.html      login con cross-dissolve entre fotos + animación de entrada
  inicio.html · pacientes.html · formulario_paciente.html
  historia_medica.html · propietarios.html · citas.html · modulos.html
  css/cairo.css   estilos compartidos      js/app.js   sesión, menú lateral, utilidades
  img/            logo-cairo.svg (logo mejorado), logo-cairo-mono.svg, slides/ (fotos del login)
```

## Personalizar el login
En `frontend/login.html`, arreglo `FOTOS` (ruta, título y frase) y las constantes
`DURACION` (tiempo por foto) y `CROSSFADE` (duración de la transición).

Los registros se guardan en `backend/cairo.db`. El formulario de pacientes envía los
cambios al servidor y admite crear, editar y cargar fotos; el servidor usa SQLite en
modo WAL con escritura sincronizada para conservar los cambios al reiniciarse.

## Preferencias de visualización
- Usa el botón de menú junto al título para ocultar o volver a mostrar la barra lateral en escritorio; en móvil abre/cierra el menú.
- El botón **Tema oscuro / Tema claro** cambia la apariencia de todos los módulos. El tema, la barra lateral y los bloques del resumen (incluidos eventos y stock) se conservan en este navegador.

## Exportaciones
- En la historia médica, el folio se asigna automáticamente con el código único del paciente
  (por ejemplo, `PAC-0001`). **Exportar PDF** guarda primero los cambios y abre el diálogo
  de impresión del navegador con formato Oficio (8.5 × 13 pulgadas); selecciona **Guardar como PDF**. El formato incluye los
  datos del propietario, del paciente, los campos clínicos y la foto o avatar del paciente.
- Al registrar un paciente puedes cargar una foto o crear un avatar de gato/perro. El inicio
  alterna entre las fotos y avatares de los pacientes registrados.
- Al entrar al panel de inicio se muestra un saludo personalizado según la hora del día.
- Los listados de pacientes, propietarios y citas permiten descargar los datos visibles
  (incluidos los filtros de búsqueda aplicados) como archivos `.xls` compatibles con Excel.
