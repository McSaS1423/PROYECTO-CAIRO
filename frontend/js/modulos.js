const CONFIG = {
  administradores: {
    title: "Administradores",
    endpoint: "/modulos/administradores",
    columns: [["nombres", "Nombres"], ["apellidos", "Apellidos"], ["cedula", "Cédula"], ["telefono", "Teléfono"], ["cargo", "Cargo"], ["usuario_id", "Usuario", "usuarios_administradores"]],
    fields: [
      { key: "usuario_id", label: "Cuenta de usuario", type: "select", reference: "usuarios_administradores", required: true },
      { key: "nombres", label: "Nombres", required: true },
      { key: "apellidos", label: "Apellidos" },
      { key: "cedula", label: "Cédula" },
      { key: "telefono", label: "Teléfono", type: "tel" },
      { key: "cargo", label: "Cargo" },
    ],
  },
  usuarios: {
    title: "Usuarios",
    endpoint: "/usuarios",
    userAccounts: true,
    columns: [["usuario", "Usuario"], ["nombre", "Nombres"], ["apellidos", "Apellidos"], ["correo", "Correo"], ["rol", "Rol"], ["creado_en", "Creado"]],
    fields: [
      { key: "usuario", label: "Usuario", required: true },
      { key: "nombre", label: "Nombres", required: true },
      { key: "apellidos", label: "Apellidos" },
      { key: "correo", label: "Correo", type: "email" },
      { key: "rol", label: "Rol", type: "select", required: true, options: [["Administrador", "Administrador"], ["Veterinario", "Veterinario"], ["Asistente", "Asistente"]] },
      { key: "clave", label: "Contraseña", type: "password", requiredOnCreate: true, help: "Al editar, déjala vacía para conservar la contraseña actual." },
    ],
  },
  veterinarios: {
    title: "Veterinarios",
    endpoint: "/modulos/veterinarios",
    columns: [["nombre", "Nombre"], ["apellido", "Apellido"], ["cedula", "Cédula"], ["telefono", "Teléfono"], ["correo", "Correo"], ["matricula", "Matrícula"], ["especialidad", "Especialidad"], ["usuario_id", "Usuario", "usuarios_veterinarios"]],
    fields: [
      { key: "usuario_id", label: "Cuenta de usuario", type: "select", reference: "usuarios_veterinarios" },
      { key: "nombre", label: "Nombre", required: true },
      { key: "apellido", label: "Apellido" },
      { key: "cedula", label: "Cédula" },
      { key: "telefono", label: "Teléfono", type: "tel" },
      { key: "correo", label: "Correo", type: "email" },
      { key: "matricula", label: "Matrícula profesional" },
      { key: "especialidad", label: "Especialidad" },
    ],
  },
  jornadas: {
    title: "Jornadas",
    endpoint: "/modulos/jornadas",
    columns: [["fecha", "Fecha"], ["descripcion", "Descripción"]],
    fields: [{ key: "fecha", label: "Fecha", type: "date", required: true }, { key: "descripcion", label: "Descripción", type: "textarea" }],
  },
  atenciones: {
    title: "Atenciones",
    endpoint: "/modulos/atenciones",
    columns: [["fecha_atencion", "Fecha"], ["paciente_id", "Paciente", "pacientes"], ["tipo_servicio", "Servicio"], ["estado_atencion", "Estado"], ["veterinario_id", "Veterinario", "veterinarios"], ["jornada_id", "Jornada", "jornadas"], ["diagnostico", "Diagnóstico"]],
    fields: [
      { key: "paciente_id", label: "Paciente", type: "select", reference: "pacientes", required: true },
      { key: "tipo_servicio", label: "Tipo de servicio", type: "select", required: true, options: [["Consulta", "Consulta"], ["Vacunación", "Vacunación"], ["Desparasitación", "Desparasitación"], ["Esterilización", "Esterilización"], ["Castración", "Castración"], ["Otro", "Otro"]] },
      { key: "fecha_atencion", label: "Fecha y hora", type: "datetime-local", required: true },
      { key: "estado_atencion", label: "Estado de atención", type: "select", required: true, default: "Atendido", options: [["Atendido", "Atendido"], ["Pendiente", "No atendido aún"]] },
      { key: "jornada_id", label: "Jornada", type: "select", reference: "jornadas" },
      { key: "cita_id", label: "Cita relacionada", type: "select", reference: "citas" },
      { key: "historia_medica_id", label: "Historia médica", type: "select", reference: "historias" },
      { key: "veterinario_id", label: "Veterinario", type: "select", reference: "veterinarios" },
      { key: "diagnostico", label: "Diagnóstico", type: "textarea" },
      { key: "tratamiento", label: "Tratamiento", type: "textarea" },
    ],
  },
  historias: {
    title: "Historias Médicas",
    endpoint: "/modulos/historias",
    readOnly: true,
    patientPicker: true,
    columns: [["paciente", "Paciente"], ["numero_folio", "Nº folio"], ["fecha_admision", "Admisión"], ["actualizado", "Actualizada"], ["diagnostico", "Diagnóstico"], ["tratamiento", "Tratamiento"]],
  },
  vacunaciones: {
    title: "Vacunaciones",
    endpoint: "/modulos/vacunaciones",
    columns: [["atencion_id", "Atención", "atenciones"], ["tipo_vacuna", "Vacuna"], ["proxima_dosis", "Próxima dosis"], ["observaciones", "Observaciones"]],
    fields: [
      { key: "atencion_id", label: "Atención relacionada", type: "select", reference: "atenciones", required: true },
      { key: "tipo_vacuna", label: "Tipo de vacuna", required: true },
      { key: "proxima_dosis", label: "Próxima dosis", type: "date" },
      { key: "observaciones", label: "Observaciones", type: "textarea" },
    ],
  },
  desparasitaciones: {
    title: "Desparasitaciones",
    endpoint: "/modulos/desparasitaciones",
    columns: [["atencion_id", "Atención", "atenciones"], ["tipo_interna_externa", "Tipo"], ["producto", "Producto"], ["peso", "Peso"], ["observaciones", "Observaciones"]],
    fields: [
      { key: "atencion_id", label: "Atención relacionada", type: "select", reference: "atenciones", required: true },
      { key: "tipo_interna_externa", label: "Tipo", type: "select", required: true, options: [["Interna", "Interna"], ["Externa", "Externa"], ["Mixta", "Mixta"]] },
      { key: "producto", label: "Producto" },
      { key: "peso", label: "Peso", type: "number", min: 0, step: "0.01" },
      { key: "observaciones", label: "Observaciones", type: "textarea" },
    ],
  },
  esterilizaciones: {
    title: "Esterilizaciones",
    endpoint: "/modulos/esterilizaciones",
    columns: [["atencion_id", "Atención", "atenciones"], ["tipo_cirugia", "Tipo de cirugía"], ["complicaciones", "Complicaciones"], ["observaciones", "Observaciones"]],
    fields: [
      { key: "atencion_id", label: "Atención relacionada", type: "select", reference: "atenciones", required: true },
      { key: "tipo_cirugia", label: "Tipo de cirugía", required: true },
      { key: "complicaciones", label: "Complicaciones", type: "textarea" },
      { key: "observaciones", label: "Observaciones", type: "textarea" },
    ],
  },
  inventario: {
    title: "Inventario",
    endpoint: "/modulos/inventario",
    columns: [["nombre", "Artículo"], ["tipo_inventario", "Tipo"], ["categoria", "Categoría"], ["cantidad", "Cantidad"], ["unidad", "Unidad"], ["area", "Área"], ["estado_operativo", "Estado"]],
    fields: [
      { key: "nombre", label: "Nombre del artículo", required: true },
      { key: "tipo_inventario", label: "Tipo de inventario", type: "select", required: true, options: [["Medicamento", "Medicamento"], ["Insumo médico", "Insumo médico"], ["Alimento", "Alimento"], ["Equipo", "Equipo"], ["Otro", "Otro"]] },
      { key: "categoria", label: "Categoría" },
      { key: "cantidad", label: "Cantidad", type: "number", min: 0, step: 1, required: true },
      { key: "unidad", label: "Unidad" },
      { key: "area", label: "Área" },
      { key: "estado_operativo", label: "Estado operativo" },
    ],
  },
  movimientos: {
    title: "Movimientos de Inventario",
    endpoint: "/modulos/movimientos",
    columns: [["fecha_registro", "Fecha"], ["inventario_id", "Artículo", "inventario"], ["tipo_movimiento", "Movimiento"], ["cantidad", "Cantidad"], ["motivo", "Motivo"], ["emisor", "Emisor"], ["receptor", "Receptor"]],
    fields: [
      { key: "inventario_id", label: "Artículo", type: "select", reference: "inventario", required: true },
      { key: "tipo_movimiento", label: "Tipo de movimiento", type: "select", required: true, options: [["Entrada", "Entrada"], ["Salida", "Salida"]] },
      { key: "cantidad", label: "Cantidad", type: "number", min: 1, step: 1, required: true },
      { key: "fecha_registro", label: "Fecha", type: "date" },
      { key: "motivo", label: "Motivo" },
      { key: "emisor", label: "Emisor" },
      { key: "receptor", label: "Receptor" },
      { key: "atencion_jornada_id", label: "Atención relacionada", type: "select", reference: "atenciones" },
      { key: "nota", label: "Nota", type: "textarea" },
    ],
  },
  medicamentos: {
    title: "Medicamentos",
    endpoint: "/modulos/medicamentos",
    columns: [["nombre_generico", "Nombre genérico"], ["nombre_comercial", "Nombre comercial"], ["presentacion", "Presentación"], ["concentracion", "Concentración"], ["categoria", "Categoría"], ["especie_dirigida", "Especie"], ["inventario_id", "Artículo", "inventario"]],
    fields: [
      { key: "nombre_generico", label: "Nombre genérico", required: true },
      { key: "nombre_comercial", label: "Nombre comercial" },
      { key: "presentacion", label: "Presentación" },
      { key: "concentracion", label: "Concentración" },
      { key: "categoria", label: "Categoría" },
      { key: "especie_dirigida", label: "Especie dirigida" },
      { key: "inventario_id", label: "Artículo de inventario", type: "select", reference: "inventario" },
    ],
  },
};

const modulo = new URLSearchParams(location.search).get("modulo") || "";
if (modulo === "historias") {
  location.replace("historias_medicas.html");
}
const config = CONFIG[modulo];
if (!config) {
  location.replace("inicio.html");
} else {
  document.body.dataset.active = modulo;
  document.body.dataset.title = config.title;
  document.body.dataset.crumb = config.title;
  document.querySelector("title").textContent = `${config.title} · Proyecto CAIRO`;
  document.getElementById("moduloMarca").textContent = config.title;
  document.getElementById("moduloIcono").innerHTML = Cairo.svg(modulo);
  iniciarModulo();
}

function iniciarModulo() {
  const $ = (selector) => document.querySelector(selector);
  const tbody = $("#tbody");
  const filtroServicio = $("#filtroServicio");
  const filtroEspecie = $("#filtroEspecie");
  const editorEl = $("#editor");
  const editor = new bootstrap.Modal(editorEl);
  const vistaListado = $("#vistaListado");
  const modulosConEditorCompleto = {
    administradores: "administrador",
    atenciones: "atención",
    inventario: "artículo de inventario",
    medicamentos: "medicamento",
    vacunaciones: "vacunación",
    desparasitaciones: "desparasitación",
    esterilizaciones: "esterilización",
  };
  const nombreRegistro = modulosConEditorCompleto[modulo];
  const esRegistroCompleto = Boolean(nombreRegistro);
  const tituloModulo = document.body.dataset.title;
  const migaModulo = document.body.dataset.crumb;
  const form = $("#formEditor");
  const referencias = {};
  let registros = [];
  let editando = null;
  const usaFiltroServicio = modulo === "atenciones";
  const usaFiltroEspecie = modulo === "atenciones";
  if (usaFiltroServicio) {
    $("#colBuscar").classList.replace("col-md-9", "col-md-6");
    $("#filtroServicioWrap").classList.remove("d-none");
  }
  if (usaFiltroEspecie) $("#filtroEspecieWrap").classList.remove("d-none");

  const esc = Cairo.esc;
  function actualizarEncabezado(titulo, miga) {
    document.body.dataset.title = titulo;
    document.body.dataset.crumb = miga;
    const tituloTopbar = document.querySelector(".topbar h1");
    const migaTopbar = document.querySelector(".crumb b");
    if (tituloTopbar) tituloTopbar.textContent = titulo;
    if (migaTopbar) migaTopbar.textContent = miga;
  }

  function cerrarEditor() {
    if (!esRegistroCompleto) {
      editor.hide();
      return;
    }
    editorEl.hidden = true;
    editorEl.setAttribute("aria-hidden", "true");
    vistaListado.hidden = false;
    document.body.classList.remove("editor-registro-completo-abierto");
    actualizarEncabezado(tituloModulo, migaModulo);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    $("#btnNuevo").focus();
  }

  function valorCampo(row, key, reference) {
    if (reference) {
      const option = (referencias[reference] || []).find((item) => String(item.id) === String(row[key]));
      return option ? option.etiqueta : row[key];
    }
    return row[key];
  }

  function celdaPaciente(row, key, reference) {
    if (reference !== "pacientes" && reference !== "atenciones") return null;
    const option = (referencias[reference] || []).find((item) => String(item.id) === String(row[key]));
    if (!option) return null;

    const nombre = option.paciente || option.nombre || option.etiqueta || "?";
    let thumb;
    if (option.foto_url) {
      thumb = `<img src="${esc(option.foto_url)}" alt="Foto de ${esc(nombre)}" loading="lazy">`;
    } else if (option.avatar_data && typeof CairoAvatar !== "undefined") {
      thumb = CairoAvatar.svg(option.avatar_data, option.especie || "Gato");
    } else {
      thumb = `<span>${esc(nombre.trim().charAt(0).toUpperCase() || "?")}</span>`;
    }

    return `<td><div class="modulo-paciente-cell">
      <span class="thumb modulo-paciente-thumb">${thumb}</span>
      <span>${esc(option.etiqueta)}</span>
    </div></td>`;
  }

  function registrosVisibles() {
    const servicio = filtroServicio?.value.trim().toLocaleLowerCase() || "";
    const especie = filtroEspecie?.value || "";
    return registros.filter((row) => {
      if (servicio && String(row.tipo_servicio || "").trim().toLocaleLowerCase() !== servicio) return false;
      if (!especie) return true;
      const paciente = (referencias.pacientes || []).find((item) => String(item.id) === String(row.paciente_id));
      return paciente?.especie === especie;
    });
  }

  function pintar() {
    $("#thead").innerHTML = `<tr>${config.columns.map(([, label]) => `<th>${esc(label.toUpperCase())}</th>`).join("")}${config.readOnly ? "<th>ACCIONES</th>" : "<th class='text-end'>ACCIONES</th>"}</tr>`;
    const visibles = registrosVisibles();
    tbody.innerHTML = visibles.length ? visibles.map((row) => `<tr>
      ${config.columns.map(([key, , reference]) => {
        const pacienteCell = celdaPaciente(row, key, reference);
        if (pacienteCell) return pacienteCell;
        if (modulo === "historias" && key === "paciente") {
          let thumb = "";
          if (row.foto_url) {
            thumb = `<img src="${esc(row.foto_url)}" alt="Foto de ${esc(row.paciente)}">`;
          } else if (row.avatar_data && typeof CairoAvatar !== "undefined") {
            thumb = CairoAvatar.svg(row.avatar_data, row.especie || "Gato");
          } else {
            thumb = `<span class="fw-bold text-muted">${esc((row.paciente || "?")[0].toUpperCase())}</span>`;
          }
          const sub = [row.especie, row.raza].filter(Boolean).join(" · ");
          return `<td>
            <div class="d-flex align-items-center gap-2">
              <a href="historia_medica.html?id=${Number(row.paciente_id)}" class="thumb flex-shrink-0" title="Ver historia médica de ${esc(row.paciente)}">
                ${thumb}
              </a>
              <div>
                <a href="historia_medica.html?id=${Number(row.paciente_id)}" class="fw-bold text-dark text-decoration-none hover-underline">
                  ${esc(row.paciente)}
                </a>
                ${sub ? `<small class="d-block text-muted" style="font-size: 0.74rem;">${esc(sub)}</small>` : ""}
              </div>
            </div>
          </td>`;
        }
        return `<td>${esc(valorCampo(row, key, reference) ?? "—")}</td>`;
      }).join("")}
      <td class="text-end text-nowrap">${config.readOnly
        ? `<a class="btn btn-soft btn-sm" href="historia_medica.html?id=${Number(row.paciente_id)}">Ver historial</a>
           <a class="btn cairo-btn btn-sm" href="historia_medica.html?id=${Number(row.paciente_id)}&amp;pdf=1">Exportar PDF</a>
           <button class="btn-icon peligro" type="button" title="Eliminar historia médica" aria-label="Eliminar historia médica de ${esc(row.paciente)}" data-del="${Number(row.paciente_id)}">×</button>`
        : `<button class="btn-icon" title="Editar" data-edit="${Number(row.id)}">✎</button>
           <button class="btn-icon peligro" title="Eliminar" data-del="${Number(row.id)}">×</button>`}</td>
    </tr>`).join("") : `<tr><td colspan="${config.columns.length + 1}" class="vacio">No hay registros que coincidan con los filtros.</td></tr>`;
  }

  function construirCampos(row = {}) {
    $("#campos").innerHTML = config.fields.map((field) => {
      const value = row[field.key] ?? (field.default && !editando ? field.default : "");
      let control;
      if (field.type === "select") {
        const options = field.options || (referencias[field.reference] || []).map((item) => [item.id, item.etiqueta]);
        control = `<select class="form-select" id="f_${esc(field.key)}" name="${esc(field.key)}" ${field.required || (field.requiredOnCreate && !editando) ? "required" : ""}>
          <option value="">Selecciona…</option>${options.map(([key, label]) => `<option value="${esc(key)}" ${String(value) === String(key) ? "selected" : ""}>${esc(label)}</option>`).join("")}
        </select>`;
      } else if (field.type === "textarea") {
        control = `<textarea class="form-control" id="f_${esc(field.key)}" name="${esc(field.key)}" rows="2">${esc(value)}</textarea>`;
      } else {
        const required = field.required || (field.requiredOnCreate && !editando);
        const defaultValue = !value && field.key === "fecha_registro" ? new Date().toISOString().slice(0, 10)
          : !value && field.type === "datetime-local" ? new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : value;
        control = `<input class="form-control" id="f_${esc(field.key)}" name="${esc(field.key)}" type="${esc(field.type || "text")}" value="${esc(defaultValue)}"
          ${required ? "required" : ""} ${field.min !== undefined ? `min="${esc(field.min)}"` : ""} ${field.step ? `step="${esc(field.step)}"` : ""}
          ${field.type === "password" ? 'autocomplete="new-password"' : ""}>`;
      }
      return `<div class="col-md-6"><label class="form-label" for="f_${esc(field.key)}">${esc(field.label)}</label>${control}${field.help ? `<small class="text-muted">${esc(field.help)}</small>` : ""}</div>`;
    }).join("");
  }

  function abrirEditor(row = null) {
    editando = row ? row.id : null;
    const tituloEditor = row ? `Editar ${nombreRegistro}` : `Registrar ${nombreRegistro}`;
    $("#tituloEditor").textContent = esRegistroCompleto ? tituloEditor : row ? `Editar ${config.title.toLowerCase()}` : `Nuevo registro · ${config.title}`;
    $("#btnGuardar").disabled = false;
    construirCampos(row || {});
    if (esRegistroCompleto) {
      vistaListado.hidden = true;
      editorEl.classList.remove("fade");
      editorEl.classList.add("editor-modulo-activo");
      editorEl.hidden = false;
      editorEl.setAttribute("aria-hidden", "false");
      document.body.classList.add("editor-registro-completo-abierto");
      actualizarEncabezado(tituloEditor, `${config.title} › Registro`);
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    } else {
      editor.show();
    }
  }

  async function cargar() {
    const query = encodeURIComponent($("#q").value.trim());
    registros = await Cairo.api(`${config.endpoint}?q=${query}`);
    pintar();
  }

  tbody.addEventListener("click", async (event) => {
    const edit = event.target.closest("[data-edit]");
    const del = event.target.closest("[data-del]");
    if (edit) abrirEditor(registros.find((row) => Number(row.id) === Number(edit.dataset.edit)));
    if (del) {
      const row = registros.find((item) => Number(item.id ?? item.paciente_id) === Number(del.dataset.del));
      const mensaje = config.patientPicker
        ? `¿Eliminar la historia médica de ${row?.paciente || "este paciente"}? El paciente se conservará, pero esta acción no se puede deshacer.`
        : "¿Eliminar este registro? Esta acción no se puede deshacer.";
      if (!confirm(mensaje)) return;
      try {
        await Cairo.api(`${config.endpoint}/${del.dataset.del}`, { method: "DELETE" });
        Cairo.toast("Registro eliminado");
        await cargar();
      } catch (error) { Cairo.toast(error.message, "error"); }
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    for (const field of config.fields) {
      if (field.type === "number") data[field.key] = data[field.key] === "" ? null : Number(data[field.key]);
      else if (field.type === "select" && field.reference) data[field.key] = data[field.key] === "" ? null : Number(data[field.key]);
      else if (data[field.key] === "") data[field.key] = null;
    }
    const button = $("#btnGuardar");
    button.disabled = true;
    try {
      await Cairo.api(editando ? `${config.endpoint}/${editando}` : config.endpoint, {
        method: editando ? "PUT" : "POST",
        body: data,
      });
      cerrarEditor();
      Cairo.toast("Registro guardado");
      await cargar();
    } catch (error) {
      Cairo.toast(error.message, "error");
    } finally { button.disabled = false; }
  });

  let timer;
  $("#q").addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => cargar().catch((error) => Cairo.toast(error.message, "error")), 250);
  });
  filtroServicio?.addEventListener("change", pintar);
  filtroEspecie?.addEventListener("change", pintar);

  Cairo.ready.then(async () => {
    try {
      if (esRegistroCompleto) {
        $("#btnCerrarEditor").removeAttribute("data-bs-dismiss");
        $("#btnCancelarEditor").removeAttribute("data-bs-dismiss");
        $("#btnCerrarEditor").addEventListener("click", cerrarEditor);
        $("#btnCancelarEditor").addEventListener("click", cerrarEditor);
      }
      const historyModal = config.patientPicker ? new bootstrap.Modal($("#historiaPacienteModal")) : null;
      if (config.patientPicker) {
        $("#btnNuevo").textContent = "＋ Registrar historia";
        $("#btnNuevo").addEventListener("click", () => historyModal.show());
        $("#formHistoriaPaciente").addEventListener("submit", (event) => {
          event.preventDefault();
          const pacienteId = $("#pacienteHistoria").value;
          if (!pacienteId) return;
          location.href = `historia_medica.html?id=${encodeURIComponent(pacienteId)}`;
        });
      } else {
        $("#btnNuevo").addEventListener("click", () => abrirEditor());
      }
      $("#btnExcel").addEventListener("click", () => Cairo.exportExcel(
        `${modulo}_cairo.xls`,
        config.columns.map(([, label]) => label),
        registrosVisibles().map((row) => config.columns.map(([key, , reference]) => valorCampo(row, key, reference) ?? "")),
      ));
      if (config.readOnly && !config.patientPicker) $("#btnNuevo").hidden = true;
      if (config.patientPicker || (config.fields || []).some((field) => field.reference)) {
        Object.assign(referencias, await Cairo.api("/opciones"));
      }
      if (config.patientPicker) {
        const pacientes = referencias.pacientes || [];
        $("#pacienteHistoria").innerHTML = `<option value="">Selecciona un paciente…</option>${pacientes
          .map((paciente) => `<option value="${esc(paciente.id)}">${esc(paciente.etiqueta)}</option>`).join("")}`;
        $("#btnAbrirHistoria").disabled = pacientes.length === 0;
        $("#linkRegistrarPaciente").hidden = pacientes.length > 0;
        if (!pacientes.length) $("#pacienteHistoria").insertAdjacentHTML("beforeend", '<option value="" disabled>No hay pacientes registrados</option>');
      }
      await cargar();
    } catch (error) { Cairo.toast(error.message, "error"); }
  }).catch((error) => Cairo.toast(error.message, "error"));
}
