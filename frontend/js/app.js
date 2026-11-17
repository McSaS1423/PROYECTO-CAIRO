/* ═══════════ Proyecto CAIRO · núcleo del frontend ═══════════
   - Comprueba la sesión contra el backend (si no hay sesión → login.html)
   - Construye la barra lateral y la cabecera alrededor de <main id="contenido">
   - Utilidades: Cairo.api, Cairo.toast, Cairo.esc
*/
const Cairo = (() => {
  const ICON = {
    inicio: '<path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    agenda: '<path d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm-2 8h14v9H5v-9Zm3 2v2h3v-2H8Zm5 0v2h3v-2h-3Z"/>',
    clinica: '<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14ZM13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7Z"/>',
    farmacia: '<path d="M3 7 12 3l9 4v2H3V7Zm2 4h14v8H5v-8Zm-2 10h18v2H3v-2Zm4-8v4h2v-4H7Zm4 0v4h2v-4h-2Zm4 0v4h2v-4h-2Z"/>',
    pacientes: '<path d="M4.5 11.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm4-4c-1 0-1.8-1-1.8-2.2S7.5 3 8.5 3s1.8 1 1.8 2.300-.8 2.200-1.800 2.200Zm7 0c-1 0-1.800-1-1.800-2.200S14.500 3 15.500 3s1.800 1 1.800 2.300-.8 2.200-1.800 2.200Zm4 4c-1 0-1.800-.9-1.800-2s.8-2 1.800-2 1.800.9 1.800 2-.8 2-1.800 2ZM12 10c-2.800 0-6 3.600-6 6.500 0 1.700 1.300 2.500 3 2.500 1 0 1.900-.5 3-.5s2 .5 3 .5c1.700 0 3-.8 3-2.500 0-2.900-3.200-6.500-6-6.500Z"/>',
    propietarios: '<path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 .5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM9 13c-3.300 0-7 1.700-7 4.500V20h14v-2.500C16 14.700 12.300 13 9 13Zm7.500.2c.4 0 .8-.1 1.200-.1C20.300 13.100 23 14.400 23 17v3h-5v-2.500c0-1.600-.6-3-1.500-4.300Z"/>',
    citas: '<path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm-2 8h14v10H5V10Zm2 2v2h3v-2H7Zm5 0v2h3v-2h-3Zm-5 4v2h3v-2H7Z"/>',
    historia: '<path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.500V8h4.500L14 3.500ZM11 11v2.500H8.500v2H11V18h2v-2.500h2.500v-2H13V11h-2Z"/>',
    modulo: '<path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z"/>',
    ajustes: '<path d="M19.4 13a7.8 7.8 0 0 0 0-2l2-1.6-2-3.5-2.4 1a7 7 0 0 0-1.7-1L15 3h-4l-.4 2.9a7 7 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.6a7.8 7.8 0 0 0 0 2l-2 1.6 2 3.5 2.4-1a7 7 0 0 0 1.7 1L11 21h4l.4-2.9a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2.1-1.6ZM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/>',
    administradores: '<path d="M12 2 3 6v5c0 5.2 3.8 9.8 9 11 5.2-1.2 9-5.8 9-11V6l-9-4Zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm5 10H7v-1c0-2 3.3-3 5-3s5 1 5 3v1Z"/>',
    usuarios: '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9c0-4 4.5-6 8-6s8 2 8 6H4Zm13-9a3 3 0 1 0-1.5-5.6 5.8 5.8 0 0 1 0 5.2c.5.3 1 .4 1.5.4Z"/>',
    veterinarios: '<path d="M12 2 9.5 8.5 3 6l3 6.5L2 17l7 .2L12 23l3-5.8 7-.2-4-4.5L21 6l-6.5 2.5L12 2Zm0 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/>',
    jornadas: '<path d="M7 2v3H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2V2h-2v3H9V2H7Zm-2 8h14v10H5V10Zm2 2v2h3v-2H7Zm5 0v2h3v-2h-3Z"/>',
    atenciones: '<path d="M11 2h2v5h5v2h-5v5h-2V9H6V7h5V2Zm-7 9h2v2H4v-2Zm14 0h2v2h-2v-2ZM4 16h2v2H4v-2Zm14 0h2v2h-2v-2Z"/>',
    historias: '<path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5ZM7 11h10v2H7v-2Zm0 4h10v2H7v-2Z"/>',
    vacunaciones: '<path d="m19.8 4.2-1.4-1.4-3.1 3.1-1.4-1.4-1.4 1.4 1.4 1.4-8.8 8.8V21h4.9l8.8-8.8 1.4 1.4 1.4-1.4-1.4-1.4 3.1-3.1-1.4-1.4-3.1 3.1-2-2 3-3.2ZM8 19H6v-2l7.5-7.5 2 2L8 19Z"/>',
    desparasitaciones: '<path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>',
    esterilizaciones: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v4h4v2h-4v4h-2v-4H7v-2h4V7h2Z"/>',
    inventario: '<path d="M3 4h18v4H3V4Zm1 6h16v10H4V10Zm3 2v2h4v-2H7Zm0 4v2h8v-2H7Z"/>',
    movimientos: '<path d="M7 7h12l-3-3 1.4-1.4L23 8l-5.6 5.4L16 12l3-3H7V7Zm10 10H5l3 3-1.4 1.4L1 16l5.6-5.4L8 12l-3 3h12v2Z"/>',
    medicamentos: '<path d="M8 3a5 5 0 0 0-3.5 8.5l8 8a5 5 0 0 0 7.1-7.1l-8-8A5 5 0 0 0 8 3Zm-2.1 7.1a3 3 0 0 1 4.2-4.2l2.1 2.1-4.2 4.2-2.1-2.1Zm8.5 8-2.1-2.1 4.2-4.2 2.1 2.1a3 3 0 0 1-4.2 4.2Z"/>',
    salir: '<path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5v-2H5V5h5V3Zm6.500 4L15 8.500 17.500 11H9v2h8.500L15 15.500 16.500 17l5-5-5-5Z"/>',
    menu: '<path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z"/>',
  };
  const svg = (n) => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICON[n] || ICON.modulo}</svg>`;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const xmlEsc = (s) => String(s ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));

  function exportExcel(filename, headers, rows) {
    const xmlRows = [headers, ...rows].map((row) => `<Row>${row.map((value) =>
      `<Cell><Data ss:Type="String">${xmlEsc(value)}</Data></Cell>`).join("")}</Row>`).join("");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="CAIRO"><Table>${xmlRows}</Table></Worksheet>
</Workbook>`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\ufeff", xml], { type: "application/vnd.ms-excel;charset=utf-8" }));
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  async function api(path, { method = "GET", body, form } = {}) {
    const opt = { method, credentials: "same-origin", headers: {} };
    if (form) opt.body = form;
    else if (body !== undefined) { opt.headers["Content-Type"] = "application/json"; opt.body = JSON.stringify(body); }
    const r = await fetch("/api" + path, opt);
    let data = null;
    try { data = await r.json(); } catch (_) {}
    if (r.status === 401 && !path.startsWith("/login")) { location.href = "login.html"; throw new Error("Sesión expirada"); }
    if (!r.ok) throw new Error((data && data.error) || "Error del servidor");
    return data;
  }

  function toast(msg, tipo = "ok") {
    let w = document.querySelector(".toast-wrap");
    if (!w) { w = document.createElement("div"); w.className = "toast-wrap"; document.body.appendChild(w); }
    const t = document.createElement("div");
    t.className = "toast-c " + (tipo === "error" ? "error" : "");
    t.textContent = msg;
    w.appendChild(t);
    setTimeout(() => t.remove(), 3600);
  }

  const MENU_GROUPS = [
    {
      id: "gestion-medica",
      title: "Gestión Médica",
      icon: "usuarios",
      items: [
        ["pacientes", "Pacientes", "pacientes.html"],
        ["propietarios", "Propietarios", "propietarios.html"],
        ["historias", "Historias Médicas", "historias_medicas.html"],
        ["estado-pacientes", "Estado de pacientes", "estado_pacientes.html"],
      ],
    },
    {
      id: "agenda-actividades",
      title: "Agenda y Actividades",
      icon: "agenda",
      items: [
        ["citas", "Citas & Agenda", "citas.html"],
        ["jornadas", "Jornadas", "modulos.html?modulo=jornadas"],
      ],
    },
    {
      id: "clinica-servicios",
      title: "Clínica y Servicios",
      icon: "clinica",
      items: [
        ["atenciones", "Atenciones", "modulos.html?modulo=atenciones"],
        ["vacunaciones", "Vacunaciones", "modulos.html?modulo=vacunaciones"],
        ["desparasitaciones", "Desparasitaciones", "modulos.html?modulo=desparasitaciones"],
        ["esterilizaciones", "Esterilizaciones", "modulos.html?modulo=esterilizaciones"],
      ],
    },
    {
      id: "inventario-farmacia",
      title: "Inventario y Farmacia",
      icon: "farmacia",
      items: [
        ["inventario", "Inventario", "modulos.html?modulo=inventario"],
        ["movimientos", "Movimientos", "modulos.html?modulo=movimientos"],
        ["medicamentos", "Medicamentos", "modulos.html?modulo=medicamentos"],
      ],
    },
    {
      id: "administracion",
      title: "Administración",
      icon: "administradores",
      items: [
        ["administradores", "Administradores", "modulos.html?modulo=administradores"],
        ["veterinarios", "Veterinarios", "modulos.html?modulo=veterinarios"],
      ],
    },
  ];
  const MENU_LIMITADO = new Set(["inicio", "pacientes", "propietarios", "citas", "historias", "estado-pacientes"]);

  function buildShell(user) {
    const body = document.body;
    const main = document.getElementById("contenido");
    const activo = body.dataset.active || new URLSearchParams(location.search).get("modulo") || "";
    const acciones = document.getElementById("acciones");
    const inicial = (user.nombre || "A").trim()[0].toUpperCase();
    const tema = localStorage.getItem("cairo-tema") === "oscuro" ? "oscuro" : "claro";
    const sidebarOculta = localStorage.getItem("cairo-barra-oculta") === "true";
    document.documentElement.dataset.tema = tema;
    const puedeGestionarUsuarios = !["Veterinario", "Asistente"].includes(user.rol);
    const gruposMenu = MENU_GROUPS.map(({ id, title, icon, items }) => {
      const visibles = items.filter(([key]) => puedeGestionarUsuarios || MENU_LIMITADO.has(key));
      if (!visibles.length) return "";
      const abierto = visibles.some(([key]) => key === activo);
      return `
        <details class="nav-section" id="nav-${id}"${abierto ? " open" : ""}>
          <summary class="nav-section-title">
            <span class="nav-section-icon" aria-hidden="true">${svg(icon)}</span>
            <span>${title}</span>
            <span class="nav-chevron" aria-hidden="true"></span>
          </summary>
          <div class="nav-section-items">
            ${visibles.map(([key, label, href]) => `
              <a class="nav-item ${key === activo ? "active" : ""}" href="${href}">
                <span class="nav-item-icon" aria-hidden="true">${svg(key)}</span><span>${label}</span>
              </a>`).join("")}
          </div>
        </details>`;
    }).join("");
    const shell = document.createElement("div");
    shell.className = `shell${sidebarOculta ? " sidebar-oculta" : ""}`;
    shell.innerHTML = `
      <aside class="sidebar" id="sidebar">
        <div class="brand">
          <div class="brand-mark"><img src="img/logo-cairo-login.png" alt=""></div>
          <div><b>CAIRO</b><span>Clínica &amp; Refugio</span></div>
          <button class="btn-icon sidebar-close" id="btnCerrarMenu" type="button" aria-label="Cerrar barra lateral">×</button>
        </div>
        <nav class="nav-group">
          <div class="nav-title">MENÚ PRINCIPAL</div>
          <a class="nav-item nav-home ${activo === "inicio" ? "active" : ""}" href="inicio.html">
            ${svg("inicio")}<span>Inicio</span>
          </a>
          ${gruposMenu}
        </nav>
        <div class="side-user">
          <div class="avatar">${esc(inicial)}</div>
          <div><div class="nombre">${esc(user.nombre)}</div><small>${esc(user.rol)}</small></div>
          <button class="btn-icon" id="btnSalir" title="Cerrar sesión">${svg("salir")}</button>
        </div>
      </aside>
      <div class="contenido-wrap">
        <header class="topbar">
          <div class="d-flex align-items-center gap-3">
            <button class="btn-icon menu-toggle" id="btnMenu" aria-label="Ocultar barra lateral" aria-expanded="${!sidebarOculta}">${svg("menu")}</button>
            <div>
              <div class="crumb">CAIRO › <b>${esc(body.dataset.crumb || body.dataset.title || "")}</b></div>
              <h1>${esc(body.dataset.title || "")}</h1>
            </div>
          </div>
          <div class="acciones">
            <div class="controles-sistema">
              <a class="btn btn-soft topbar-ajustes" href="ajustes.html">${svg("ajustes")}<span>Ajustes</span></a>
            </div>
            <div class="acciones-pagina" id="slotAcciones"></div>
          </div>
        </header>
      </div>`;
    shell.querySelector(".contenido-wrap").appendChild(main);
    body.prepend(shell);
    if (acciones) { shell.querySelector("#slotAcciones").append(...acciones.content.cloneNode(true).childNodes); acciones.remove(); }

    const btnMenu = shell.querySelector("#btnMenu");
    const esMovil = window.matchMedia("(max-width: 991px)").matches;
    if (esMovil) {
      btnMenu.setAttribute("aria-expanded", "false");
      btnMenu.setAttribute("aria-label", "Abrir barra lateral");
    } else {
      btnMenu.setAttribute("aria-expanded", String(!sidebarOculta));
      btnMenu.setAttribute("aria-label", sidebarOculta ? "Mostrar barra lateral" : "Ocultar barra lateral");
    }
    btnMenu.onclick = () => {
      if (window.matchMedia("(max-width: 991px)").matches) {
        const abierto = shell.querySelector("#sidebar").classList.toggle("abierto");
        btnMenu.setAttribute("aria-expanded", String(abierto));
        btnMenu.setAttribute("aria-label", abierto ? "Cerrar barra lateral" : "Abrir barra lateral");
        return;
      }
      const oculta = shell.classList.toggle("sidebar-oculta");
      btnMenu.setAttribute("aria-expanded", String(!oculta));
      btnMenu.setAttribute("aria-label", oculta ? "Mostrar barra lateral" : "Ocultar barra lateral");
      localStorage.setItem("cairo-barra-oculta", String(oculta));
    };
    shell.querySelector("#btnCerrarMenu").onclick = () => {
      shell.querySelector("#sidebar").classList.remove("abierto");
      btnMenu.setAttribute("aria-expanded", "false");
      btnMenu.setAttribute("aria-label", "Abrir barra lateral");
    };
    shell.querySelector("#btnSalir").onclick = async () => { await api("/logout", { method: "POST" }); location.href = "login.html"; };
  }

  function aplicarAjustesResumen() {
    document.querySelectorAll("[data-resumen]").forEach((bloque) => {
      if (localStorage.getItem(`cairo-resumen-oculto-${bloque.dataset.resumen}`) === "true") {
        bloque.hidden = true;
      } else {
        bloque.hidden = false;
      }
    });
    document.querySelectorAll(".dashboard-row").forEach((fila) => {
      const bloquesVisibles = [...fila.querySelectorAll("[data-resumen]")].filter((bloque) => !bloque.hidden);
      fila.classList.toggle("dashboard-row-solo", bloquesVisibles.length === 1);
    });
  }

  function buildFAB() {
    // ── Evitar duplicados (p.ej. hot-reload) ──────────────────────────────
    if (document.getElementById("fabAyuda")) return;

    // ── 1. Botón flotante ─────────────────────────────────────────────────
    const fab = document.createElement("button");
    fab.id        = "fabAyuda";
    fab.type      = "button";
    fab.className = "fab-ayuda";
    fab.setAttribute("aria-label", "Abrir manual de usuario");
    fab.setAttribute("data-tooltip", "Manual de usuario");
    fab.setAttribute("data-bs-toggle", "modal");
    fab.setAttribute("data-bs-target", "#modalManualCAIRO");
    fab.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"/></svg>`;
    document.body.appendChild(fab);

    // ── 2. Modal con iframe ───────────────────────────────────────────────
    if (document.getElementById("modalManualCAIRO")) return;

    const PDF_URL = "docs/Manual_del_uso_de_sistema_CAIRO.pdf";

    const modal = document.createElement("div");
    modal.id          = "modalManualCAIRO";
    modal.className   = "modal fade";
    modal.tabIndex    = -1;
    modal.setAttribute("aria-labelledby", "modalManualTitulo");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("role", "dialog");
    modal.innerHTML = `
      <div class="modal-dialog modal-xl modal-dialog-centered modal-manual-cairo">
        <div class="modal-content modal-content-manual">

          <!-- Cabecera -->
          <div class="modal-header modal-header-manual">
            <div class="d-flex align-items-center gap-2">
              <svg class="modal-manual-icono" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5ZM7 11h10v2H7v-2Zm0 4h10v2H7v-2Z"/>
              </svg>
              <h5 class="modal-title mb-0" id="modalManualTitulo">Manual de Usuario — CAIRO</h5>
            </div>
            <div class="d-flex align-items-center gap-2 ms-auto">
              <!-- Botón pantalla completa -->
              <a href="${PDF_URL}"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="btn btn-soft btn-sm d-flex align-items-center gap-1"
                 title="Abrir en pantalla completa">
                <svg style="width:15px;height:15px" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 14H5v5h5v-2H7v-3Zm-2-4h2V7h3V5H5v5Zm12 7h-3v2h5v-5h-2v3ZM14 5v2h3v3h2V5h-5Z"/>
                </svg>
                <span class="d-none d-sm-inline">Pantalla completa</span>
              </a>
              <!-- Cerrar -->
              <button type="button"
                      class="btn-close btn-close-manual"
                      data-bs-dismiss="modal"
                      aria-label="Cerrar manual"></button>
            </div>
          </div>

          <!-- Cuerpo con embed PDF -->
          <div class="modal-body modal-body-manual p-0">
            <div class="manual-iframe-wrap">
              <embed id="embedManualCAIRO"
                     src=""
                     type="application/pdf"
                     class="manual-iframe"
                     aria-label="Manual de Usuario CAIRO">
              <!-- Fallback: se muestra si el navegador no tiene visor PDF -->
              <div class="manual-fallback d-none" id="manualFallback">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:48px;height:48px;color:var(--cairo-primary)">
                  <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5ZM7 11h10v2H7v-2Zm0 4h10v2H7v-2Z"/>
                </svg>
                <p class="mt-3 mb-3 fw-semibold">Tu navegador no puede mostrar el PDF aquí.</p>
                <a href="${PDF_URL}" target="_blank" rel="noopener noreferrer" class="cairo-btn">
                  Abrir manual en nueva pestaña
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>`;

    document.body.appendChild(modal);

    // Cargar el src del embed solo cuando el modal abre (lazy load)
    modal.addEventListener("show.bs.modal", () => {
      const embed = document.getElementById("embedManualCAIRO");
      if (!embed.src || embed.src === window.location.href) {
        embed.src = PDF_URL;
      }
      // Detectar fallo (navegador sin visor PDF nativo)
      embed.onerror = () => {
        embed.classList.add("d-none");
        document.getElementById("manualFallback").classList.remove("d-none");
      };
    });

    // Limpiar src al cerrar para liberar memoria
    modal.addEventListener("hidden.bs.modal", () => {
      const embed = document.getElementById("embedManualCAIRO");
      embed.src = "";
      embed.classList.remove("d-none");
      document.getElementById("manualFallback").classList.add("d-none");
    });
  }

  function buildBurbuja() {
    // ── Detectar el módulo/página activa ─────────────────────────────────
    const modulo =
      document.body.dataset.active ||
      new URLSearchParams(location.search).get("modulo") ||
      location.pathname.split("/").pop().replace(".html", "") ||
      "inicio";

    // Clave de sesión: una vez cerrada no vuelve a aparecer en esa visita
    const KEY = "cairo-burbuja-" + modulo;
    if (sessionStorage.getItem(KEY)) return;
    if (document.getElementById("fabBurbuja")) return;

    // ── Mensajes contextuales por módulo ─────────────────────────────────
    const MENSAJES = {
      inicio:            "¿Nuevo en CAIRO? Haz clic aquí y conoce el sistema desde cero.",
      pacientes:         "¿Cómo registrar o buscar pacientes? El manual tiene el paso a paso.",
      propietarios:      "¿Dudas con los propietarios? Consulta el manual para gestionarlos fácil.",
      citas:             "¿Cómo agendar o cancelar citas? El manual explica cada campo.",
      administradores:   "¿Cómo añadir o editar administradores? Revisa el manual aquí.",
      usuarios:          "¿Cómo crear o cambiar el rol de un usuario? El manual lo explica.",
      veterinarios:      "¿Cómo registrar un veterinario en el sistema? Consulta el manual.",
      jornadas:          "¿Cómo configurar las jornadas de trabajo? El manual te guía.",
      atenciones:        "¿Cómo registrar una atención médica correctamente? Abre el manual.",
      historias:         "¿Cómo consultar o crear historias clínicas? Ve el manual aquí.",
      vacunaciones:      "¿Cómo registrar vacunas correctamente? El manual lo muestra paso a paso.",
      desparasitaciones: "¿Cómo cargar desparasitaciones? Revisa el manual para no omitir datos.",
      esterilizaciones:  "¿Cómo registrar esterilizaciones? El manual tiene todos los detalles.",
      inventario:        "¿Cómo manejar el inventario? El manual explica entradas y salidas.",
      movimientos:       "¿Cómo registrar movimientos de stock? El manual te guía con ejemplos.",
      medicamentos:      "¿Cómo administrar el catálogo de medicamentos? Consulta el manual.",
    };

    const msg = MENSAJES[modulo] || "¿Necesitas ayuda? Haz clic para ver el manual de CAIRO.";

    // ── Construir la burbuja ──────────────────────────────────────────────
    const burbuja = document.createElement("div");
    burbuja.id        = "fabBurbuja";
    burbuja.className = "fab-burbuja";
    burbuja.setAttribute("role", "tooltip");
    burbuja.innerHTML = `
      <button class="fab-burbuja-cerrar" id="fabBurbujaClose" aria-label="Cerrar sugerencia" type="button">×</button>
      <p class="fab-burbuja-txt">${msg}</p>`;
    document.body.appendChild(burbuja);

    let timer;

    function cerrar() {
      clearTimeout(timer);
      burbuja.classList.remove("fab-burbuja-visible");
      burbuja.classList.add("fab-burbuja-salida");
      sessionStorage.setItem(KEY, "1");
      setTimeout(() => burbuja.remove(), 350);
    }

    // Aparece 2 s después de cargar la página
    setTimeout(() => burbuja.classList.add("fab-burbuja-visible"), 2000);
    // Se cierra solo a los 12 s (10 s visible)
    timer = setTimeout(cerrar, 12000);
    // Cierre manual con la X
    document.getElementById("fabBurbujaClose").onclick = cerrar;
    // Cierre también al hacer clic en el FAB (ya vio lo que necesitaba)
    document.getElementById("fabAyuda")?.addEventListener("click", cerrar, { once: true });
  }

  const ready = (async () => {
    const user = await api("/me");
    buildShell(user);
    buildFAB();
    buildBurbuja();
    document.documentElement.classList.remove("cargando");
    const contenido = document.getElementById("contenido");
    if (contenido) requestAnimationFrame(() => contenido.classList.add("modulo-entrando"));
    return user;
  })();

  const fmt = {
    fecha(iso) { if (!iso) return "—"; const [y, m, d] = iso.slice(0, 10).split("-"); return `${d}/${m}/${y}`; },
    hora(h) { const [H, M] = h.split(":").map(Number); return `${((H + 11) % 12) + 1}:${String(M).padStart(2, "0")} ${H < 12 ? "AM" : "PM"}`; },
    edad(iso) {
      if (!iso) return "—";
      const n = new Date(iso), h = new Date();
      let m = (h.getFullYear() - n.getFullYear()) * 12 + h.getMonth() - n.getMonth();
      if (m < 0) return "—";
      return m >= 12 ? `${Math.floor(m / 12)} año${m >= 24 ? "s" : ""}` : `${m} mes${m === 1 ? "" : "es"}`;
    },
  };

  return { api, toast, esc, ready, fmt, svg, exportExcel, aplicarAjustesResumen };
})();
