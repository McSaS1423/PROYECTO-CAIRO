(() => {
  const root = document.getElementById("catalogoRazasPaciente");
  if (!root) return;

  const sections = {
    Perro: { rows: "listaPerros", search: "buscarPerro" },
    Gato: { rows: "listaGatos", search: "buscarGato" },
  };
  const catalogos = { Perro: [], Gato: [] };
  let cargado = false;
  const editor = document.createElement("div");
  editor.innerHTML = `
    <div class="modal fade" id="editorRazaPaciente" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content cairo-card">
          <form id="formRazaPaciente">
            <div class="modal-header border-0">
              <h2 class="modal-title fs-5 fuente-titulo" id="tituloRazaPaciente">Agregar raza</h2>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <input type="hidden" id="razaIdPaciente">
              <label class="form-label" for="especieRazaPaciente">Especie</label>
              <select class="form-select mb-3" id="especieRazaPaciente" required>
                <option value="Perro">Perros</option><option value="Gato">Gatos</option>
              </select>
              <label class="form-label" for="nombreRazaPaciente">Nombre de la raza</label>
              <input class="form-control" id="nombreRazaPaciente" maxlength="100" required>
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-soft" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn cairo-btn" id="guardarRazaPaciente">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>`;
  document.body.append(editor);
  const modal = new bootstrap.Modal(editor.querySelector(".modal"));
  const form = editor.querySelector("form");

  root.innerHTML = Object.entries(sections).map(([especie, section]) => `
    <section class="mb-4" aria-labelledby="${section.rows}Titulo">
      <div class="d-flex justify-content-between align-items-center gap-2 mb-2">
        <h3 class="h6 mb-0" id="${section.rows}Titulo">${especie === "Perro" ? "Perros" : "Gatos"}</h3>
        <button class="btn cairo-btn btn-sm" type="button" data-add="${especie}">＋ Agregar raza</button>
      </div>
      <input class="form-control mb-2" type="search" id="${section.search}" placeholder="Buscar raza de ${especie.toLowerCase()}…" aria-label="Buscar raza de ${especie.toLowerCase()}">
      <div class="table-responsive">
        <table class="table tabla mb-0">
          <thead><tr><th>RAZA</th><th class="text-end">ACCIONES</th></tr></thead>
          <tbody id="${section.rows}"><tr><td colspan="2" class="vacio">Cargando…</td></tr></tbody>
        </table>
      </div>
    </section>`).join("");

  function pintar(especie) {
    const section = sections[especie];
    const termino = document.getElementById(section.search).value.trim().toLocaleLowerCase("es");
    const razas = catalogos[especie].filter((raza) => raza.nombre.toLocaleLowerCase("es").includes(termino));
    document.getElementById(section.rows).innerHTML = razas.length
      ? razas.map((raza) => `<tr>
          <td>${Cairo.esc(raza.nombre)}</td>
          <td class="text-end text-nowrap">
            <button class="btn-icon" type="button" title="Editar raza" aria-label="Editar ${Cairo.esc(raza.nombre)}" data-edit="${raza.id}">✎</button>
            <button class="btn-icon peligro" type="button" title="Eliminar raza" aria-label="Eliminar ${Cairo.esc(raza.nombre)}" data-del="${raza.id}">×</button>
          </td>
        </tr>`).join("")
      : '<tr><td colspan="2" class="vacio">No hay razas que coincidan.</td></tr>';
  }

  async function cargar(especie) {
    catalogos[especie] = await Cairo.api(`/razas?especie=${encodeURIComponent(especie)}`);
    pintar(especie);
  }

  function abrirEditor(especie, raza = null) {
    document.getElementById("tituloRazaPaciente").textContent = raza ? "Editar raza" : "Agregar raza";
    document.getElementById("razaIdPaciente").value = raza?.id || "";
    document.getElementById("especieRazaPaciente").value = raza?.especie || especie;
    document.getElementById("nombreRazaPaciente").value = raza?.nombre || "";
    modal.show();
    document.getElementById("nombreRazaPaciente").focus();
  }

  root.addEventListener("input", (event) => {
    const especie = Object.keys(sections).find((key) => sections[key].search === event.target.id);
    if (especie) pintar(especie);
  });
  root.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-add], [data-edit], [data-del]");
    if (!button) return;
    if (button.dataset.add) {
      abrirEditor(button.dataset.add);
      return;
    }
    const especie = Object.keys(sections).find((key) =>
      catalogos[key].some((raza) => String(raza.id) === (button.dataset.edit || button.dataset.del)));
    const raza = especie && catalogos[especie].find((item) =>
      String(item.id) === (button.dataset.edit || button.dataset.del));
    if (!raza || !especie) return;
    if (button.dataset.edit) {
      abrirEditor(especie, raza);
      return;
    }
    if (!confirm(`¿Eliminar la raza ${raza.nombre}?`)) return;
    try {
      await Cairo.api(`/razas/${raza.id}`, { method: "DELETE" });
      Cairo.toast("Raza eliminada");
      await cargar(especie);
      window.dispatchEvent(new CustomEvent("cairo:razas-actualizadas", { detail: { especie } }));
    } catch (error) {
      Cairo.toast(error.message, "error");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("razaIdPaciente").value;
    const especie = document.getElementById("especieRazaPaciente").value;
    const boton = document.getElementById("guardarRazaPaciente");
    boton.disabled = true;
    try {
      await Cairo.api(id ? `/razas/${id}` : "/razas", {
        method: id ? "PUT" : "POST",
        body: { especie, nombre: document.getElementById("nombreRazaPaciente").value.trim() },
      });
      modal.hide();
      Cairo.toast("Raza guardada");
      await Promise.all(Object.keys(sections).map(cargar));
      window.dispatchEvent(new CustomEvent("cairo:razas-actualizadas", { detail: { especie } }));
    } catch (error) {
      Cairo.toast(error.message, "error");
    } finally {
      boton.disabled = false;
    }
  });

  document.getElementById("administrarRazas").addEventListener("toggle", async (event) => {
    if (!event.currentTarget.open || cargado) return;
    try {
      await Promise.all(Object.keys(sections).map(cargar));
      cargado = true;
    } catch (error) {
      Cairo.toast(error.message, "error");
    }
  });
})();
