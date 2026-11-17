(() => {
  const tbody = document.getElementById("tbodyEstado");
  const busqueda = document.getElementById("busquedaEstado");
  const filtroEspecie = document.getElementById("filtroEspecieEstado");
  let pacientes = [];
  let temporizador;

  function pacientesVisibles() {
    return filtroEspecie.value
      ? pacientes.filter((paciente) => paciente.especie === filtroEspecie.value)
      : pacientes;
  }

  function estado(value, label) {
    const registrado = Boolean(value);
    const texto = registrado ? "Sí" : "Sin registro";
    return `<span class="estado-paciente-indicador ${registrado ? "registrado" : "sin-registro"}" aria-label="${label}: ${texto}">${texto}</span>`;
  }

  function actualizarResumen(visibles) {
    document.getElementById("totalPacientes").textContent = visibles.length;
    for (const [key, countId] of [
      ["atendido", "totalAtendidos"],
      ["esterilizado", "totalEsterilizados"],
      ["vacunado", "totalVacunados"],
      ["desparasitado", "totalDesparasitados"],
    ]) {
      document.getElementById(countId).textContent = visibles.filter((paciente) => Boolean(paciente[key])).length;
    }
    document.getElementById("totalNoAtendidos").textContent =
      visibles.filter((paciente) => !paciente.atendido).length;
    document.getElementById("totalPendientesVacuna").textContent =
      visibles.filter((paciente) => Boolean(paciente.requiere_vacunacion)).length;
    document.getElementById("totalPendientesDesparasitacion").textContent =
      visibles.filter((paciente) => Boolean(paciente.requiere_desparasitacion)).length;
    document.getElementById("totalPendientesEsterilizacion").textContent =
      visibles.filter((paciente) => Boolean(paciente.requiere_esterilizacion)).length;
  }

  function pintar() {
    const visibles = pacientesVisibles();
    actualizarResumen(visibles);
    if (!visibles.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="vacio">No se encontraron pacientes.</td></tr>';
      return;
    }
    tbody.innerHTML = visibles.map((paciente) => {
      const propietario = [paciente.propietario, paciente.propietario_apellido].filter(Boolean).join(" ") || "Sin propietario";
      const descripcion = [paciente.especie, paciente.raza].filter(Boolean).join(" · ");
      const estadoProcedimiento = (realizado, requerido, label, pendiente) => realizado
        ? estado(true, label)
        : requerido
          ? `<span class="estado-paciente-indicador pendiente" aria-label="${pendiente}">${pendiente}</span>`
          : estado(false, label);
      const estadoAtencion = paciente.atendido
        ? estado(true, "Atendido")
        : '<span class="estado-paciente-indicador sin-registro" aria-label="No ha sido atendido aún">No atendido aún</span>';
      const foto = paciente.foto_url
        ? `<img data-paciente-foto="${Number(paciente.id)}" src="${Cairo.esc(paciente.foto_url)}" alt="Foto de ${Cairo.esc(paciente.nombre)}">`
        : paciente.avatar_data
          ? CairoAvatar.svg(paciente.avatar_data, paciente.especie || "Gato")
          : `<span class="fw-bold text-muted">${Cairo.esc((paciente.nombre || "?")[0].toUpperCase())}</span>`;
      return `<tr>
        <td><div class="modulo-paciente-cell">
          <a class="thumb modulo-paciente-thumb" href="historia_medica.html?id=${Number(paciente.id)}" title="Ver historia médica de ${Cairo.esc(paciente.nombre)}">${foto}</a>
          <div><a class="fw-bold text-decoration-none" href="historia_medica.html?id=${Number(paciente.id)}">${Cairo.esc(paciente.nombre)}</a>
            <small class="d-block text-muted">${Cairo.esc(paciente.codigo)}${descripcion ? ` · ${Cairo.esc(descripcion)}` : ""}</small></div>
        </div></td>
        <td>${Cairo.esc(propietario)}</td>
        <td>${estadoAtencion}</td>
        <td>${estadoProcedimiento(paciente.esterilizado, paciente.requiere_esterilizacion, "Esterilizado", "Necesita esterilizarse")}</td>
        <td>${estadoProcedimiento(paciente.vacunado, paciente.requiere_vacunacion, "Vacunado", "Necesita vacunarse")}</td>
        <td>${estadoProcedimiento(paciente.desparasitado, paciente.requiere_desparasitacion, "Desparasitado", "Necesita desparasitarse")}</td>
        <td>${Cairo.fmt.fecha(paciente.ultima_atencion)}</td>
      </tr>`;
    }).join("");
    tbody.querySelectorAll("[data-paciente-foto]").forEach((image) => {
      image.addEventListener("error", () => {
        const patient = pacientes.find((item) => String(item.id) === image.dataset.pacienteFoto);
        image.parentElement.innerHTML = patient?.avatar_data
          ? CairoAvatar.svg(patient.avatar_data, patient.especie || "Gato")
          : Cairo.esc((patient?.nombre || "?")[0].toUpperCase());
      }, { once: true });
    });
  }

  async function cargar() {
    const query = encodeURIComponent(busqueda.value.trim());
    try {
      pacientes = await Cairo.api(`/estado-pacientes?q=${query}`);
      pintar();
    } catch (error) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">No se pudo cargar: ${Cairo.esc(error.message)}</td></tr>`;
      throw error;
    }
  }

  async function cargarConAviso() {
    try {
      await cargar();
    } catch (error) {
      Cairo.toast(`Error al cargar el estado de pacientes: ${error.message}`, "error");
    }
  }

  Cairo.ready.then(async () => {
    document.getElementById("btnRecargar").addEventListener("click", cargarConAviso);
    document.getElementById("btnExportar").addEventListener("click", () => {
      Cairo.exportExcel("estado_pacientes_cairo.xls",
        ["Paciente", "Código", "Especie", "Raza", "Propietario", "Atención", "Esterilización", "Vacunación", "Desparasitación", "Última atención"],
        pacientesVisibles().map((paciente) => [
          paciente.nombre, paciente.codigo, paciente.especie, paciente.raza,
          [paciente.propietario, paciente.propietario_apellido].filter(Boolean).join(" "),
          paciente.atendido ? "Atendido" : "No atendido aún",
          paciente.esterilizado ? "Sí" : paciente.requiere_esterilizacion ? "Necesita esterilizarse" : "Sin registro",
          paciente.vacunado ? "Sí" : paciente.requiere_vacunacion ? "Necesita vacunarse" : "Sin registro",
          paciente.desparasitado ? "Sí" : paciente.requiere_desparasitacion ? "Necesita desparasitarse" : "Sin registro",
          Cairo.fmt.fecha(paciente.ultima_atencion),
        ]),
      );
    });
    busqueda.addEventListener("input", () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(cargarConAviso, 250);
    });
    filtroEspecie.addEventListener("change", pintar);
    await cargarConAviso();
  }).catch((error) => Cairo.toast(error.message, "error"));
})();
