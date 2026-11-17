(() => {
  /* ═══════════ Proyecto CAIRO · Avatar Tomodachi Life ═══════════ */

  /*
   * Formato almacenado en BD (compatible con validación del backend):
   * { species, bodyColor, eyeColor, pattern, patternColor, patternOpacity }
   *
   * Internamente mapeamos:
   *   bodyColor  → pelaje base
   *   eyeColor   → color de ojos
   *   patternColor → color secundario (manchas/detalles)
   *   pattern     → tipo de patrón de pelaje
   *   patternOpacity → "0.4"
   */

  const DEFAULT = {
    species: "Gato",
    bodyColor: "#D2B48C",
    eyeColor: "#3CB371",
    pattern: "spot",
    patternColor: "#FFF8DC",
    patternOpacity: "0.4",
    spots: [],
    innerEarColor: "#F0A0A8",
    muzzleColor: "#FFF8DC",
    noseColor: "#FF8C94",
    collarColor: "#FF4500",
    collarVisible: true,
  };

  const COLOR_PATTERN = /^#[\da-f]{6}$/i;
  const PATTERNS = ["none", "spot", "mask", "patches", "tabby"];
  const SPOT_POSITIONS = {
    frente: [50, 31, 5],
    mejillaIzquierda: [25, 59, 5],
    mejillaDerecha: [75, 59, 5],
    sobreOjoIzquierdo: [34, 34, 4],
    sobreOjoDerecho: [66, 34, 4],
    hocicoIzquierdo: [41, 70, 3],
    hocicoDerecho: [59, 70, 3],
  };

  /* ── Normalizar datos (acepta formato viejo y nuevo) ── */
  function normalize(value, species = DEFAULT.species) {
    let data = value;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch { data = null; }
    }
    const source = data && typeof data === "object" ? data : {};
    const resolvedSpecies = ["Gato", "Perro"].includes(source.species)
      ? source.species
      : (species === "Perro" ? "Perro" : "Gato");

    // Aceptar formato nuevo (pelaje/secundario/ojos) o formato viejo (bodyColor/eyeColor/patternColor)
    const bodyColor = COLOR_PATTERN.test(source.bodyColor || "")
      ? source.bodyColor
      : COLOR_PATTERN.test(source.pelaje || "")
        ? source.pelaje
        : DEFAULT.bodyColor;

    const eyeColor = COLOR_PATTERN.test(source.eyeColor || "")
      ? source.eyeColor
      : COLOR_PATTERN.test(source.ojos || "")
        ? source.ojos
        : resolvedSpecies === "Gato" ? "#3CB371" : "#8B4513";

    const patternColor = COLOR_PATTERN.test(source.patternColor || "")
      ? source.patternColor
      : COLOR_PATTERN.test(source.secundario || "")
        ? source.secundario
        : DEFAULT.patternColor;

    let pattern = PATTERNS.includes(source.pattern) ? source.pattern : "spot";
    if (resolvedSpecies !== "Gato" && pattern === "tabby") pattern = "spot";
    const color = (key, fallback) => COLOR_PATTERN.test(source[key] || "") ? source[key] : fallback;
    const spots = Array.isArray(source.spots)
      ? [...new Set(source.spots.filter((position) => Object.hasOwn(SPOT_POSITIONS, position)))]
      : [];

    return {
      species: resolvedSpecies,
      bodyColor,
      eyeColor,
      pattern,
      patternColor,
      patternOpacity: pattern === "none" ? "0" : "0.4",
      spots,
      innerEarColor: color("innerEarColor", DEFAULT.innerEarColor),
      muzzleColor: color("muzzleColor", DEFAULT.muzzleColor),
      noseColor: color("noseColor", resolvedSpecies === "Gato" ? DEFAULT.noseColor : "#222222"),
      collarColor: color("collarColor", DEFAULT.collarColor),
      collarVisible: source.collarVisible !== false,
    };
  }

  function svgPatrones(c) {
    const manchas = c.spots.map((position) => {
      const [x, y, radius] = SPOT_POSITIONS[position];
      return `<circle cx="${x}" cy="${y}" r="${radius}" fill="${c.patternColor}"/>`;
    }).join("");
    const patron = c.pattern === "spot"
      ? `<circle cx="50" cy="28" r="3" fill="${c.patternColor}"/><circle cx="44" cy="34" r="2" fill="${c.patternColor}"/><circle cx="56" cy="34" r="2" fill="${c.patternColor}"/>`
      : c.pattern === "mask"
        ? `<ellipse cx="50" cy="45" rx="27" ry="15" fill="${c.patternColor}"/>`
        : c.pattern === "patches"
          ? `<path d="M22 35 Q34 27 43 39 L39 54 Q27 57 22 48Z" fill="${c.patternColor}"/><path d="M78 35 Q66 27 57 39 L61 54 Q73 57 78 48Z" fill="${c.patternColor}"/>`
          : c.pattern === "tabby" && c.species === "Gato"
            ? `<path d="M43 27 Q47 34 44 39 M50 24 Q54 32 50 39 M57 27 Q61 34 56 39 M24 48 Q31 50 34 55 M76 48 Q69 50 66 55" fill="none" stroke="${c.patternColor}" stroke-width="3" stroke-linecap="round"/>`
            : "";
    return `<g>${patron}${manchas}</g>`;
  }

  /* ── SVG Tomodachi Life: Gato ── */
  function svgGato(c) {
    return `
      <polygon points="10,45 25,10 45,30" fill="${c.bodyColor}"/>
      <polygon points="90,45 75,10 55,30" fill="${c.bodyColor}"/>
      <polygon points="18,40 25,20 38,32" fill="${c.innerEarColor}"/>
      <polygon points="82,40 75,20 62,32" fill="${c.innerEarColor}"/>
      <circle cx="50" cy="55" r="35" fill="${c.bodyColor}"/>
      <ellipse cx="50" cy="72" rx="16" ry="12" fill="${c.muzzleColor}"/>
      ${svgPatrones(c)}
      <circle cx="33" cy="45" r="7" fill="${c.eyeColor}"/>
      <circle cx="67" cy="45" r="7" fill="${c.eyeColor}"/>
      <ellipse cx="33" cy="45" rx="1.5" ry="5" fill="#000"/>
      <ellipse cx="67" cy="45" rx="1.5" ry="5" fill="#000"/>
      <circle cx="35" cy="42" r="1.5" fill="#fff"/>
      <circle cx="69" cy="42" r="1.5" fill="#fff"/>
      <polygon points="46,62 54,62 50,67" fill="${c.noseColor}"/>
      <line x1="8" y1="55" x2="22" y2="58" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="6" y1="62" x2="22" y2="62" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="92" y1="55" x2="78" y2="58" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="94" y1="62" x2="78" y2="62" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
      ${c.collarVisible ? `<path d="M25 80 Q50 94 75 80 L72 85 Q50 98 28 85Z" fill="${c.collarColor}"/><circle cx="50" cy="88" r="4" fill="#FFD700"/>` : ""}
      <path d="M 43 70 Q 50 76 50 70 Q 50 76 57 70" fill="transparent" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>`;
  }

  /* ── SVG Tomodachi Life: Perro ── */
  function svgPerro(c) {
    return `
      <ellipse cx="18" cy="55" rx="12" ry="25" fill="${c.bodyColor}" transform="rotate(15 18 55)"/>
      <ellipse cx="82" cy="55" rx="12" ry="25" fill="${c.bodyColor}" transform="rotate(-15 82 55)"/>
      <ellipse cx="18" cy="55" rx="5" ry="15" fill="${c.innerEarColor}" transform="rotate(15 18 55)"/>
      <ellipse cx="82" cy="55" rx="5" ry="15" fill="${c.innerEarColor}" transform="rotate(-15 82 55)"/>
      <circle cx="50" cy="55" r="33" fill="${c.bodyColor}"/>
      <ellipse cx="50" cy="70" rx="20" ry="16" fill="${c.muzzleColor}"/>
      ${svgPatrones(c)}
      <circle cx="33" cy="45" r="6" fill="${c.eyeColor}"/>
      <circle cx="67" cy="45" r="6" fill="${c.eyeColor}"/>
      <circle cx="33" cy="45" r="3.5" fill="#000"/>
      <circle cx="67" cy="45" r="3.5" fill="#000"/>
      <circle cx="35" cy="43" r="1.5" fill="#fff"/>
      <circle cx="69" cy="43" r="1.5" fill="#fff"/>
      <ellipse cx="50" cy="63" rx="8" ry="5.5" fill="${c.noseColor}"/>
      ${c.collarVisible ? `<path d="M27 80 Q50 92 73 80 L70 85 Q50 96 30 85Z" fill="${c.collarColor}"/><circle cx="50" cy="88" r="5" fill="#FFD700"/>` : ""}
      <path d="M 40 73 Q 50 82 60 73" fill="transparent" stroke="#333" stroke-width="2" stroke-linecap="round"/>`;
  }

  /* ── Genera el SVG completo ── */
  function svg(value, species) {
    const c = normalize(value, species);
    const inner = c.species === "Gato" ? svgGato(c) : svgPerro(c);
    return `<svg viewBox="0 0 100 100" role="img" aria-label="Avatar de ${c.species}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  }

  function dataUrl(value, species) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg(value, species))}`;
  }

  /* ── Paletas de colores predefinidas ── */
  const PALETAS = {
    pelaje: [
      "#FFFFFF", "#E8E8E8", "#A9A9A9", "#4A4A4A", "#1A1A1A",
      "#FFF8DC", "#F5DEB3", "#D2B48C", "#CD853F", "#E68A00",
      "#A0522D", "#5C4033"
    ],
    secundario: [
      "#FFFFFF", "#E8E8E8", "#A9A9A9", "#4A4A4A", "#1A1A1A",
      "#FFF8DC", "#F5DEB3", "#D2B48C", "#CD853F", "#E68A00",
      "#A0522D", "#5C4033"
    ],
    ojos: [
      "#000000", "#5C4033", "#8B4513", "#DAA520", "#FFD700",
      "#90EE90", "#3CB371", "#87CEEB", "#4682B4"
    ],
  };

  /* ── Construye el HTML de una paleta de swatches ── */
  function buildPalette(parte) {
    return PALETAS[parte].map(color => {
      const borderStyle = color === "#FFFFFF" ? "border:3px solid #ccc" : "border:3px solid transparent";
      return `<button type="button" class="tomo-swatch" data-tomo-parte="${parte}" data-tomo-color="${color}" style="background:${color};${borderStyle}" aria-label="${parte} ${color}"></button>`;
    }).join("");
  }

  /*
   * Mapeo UI ↔ Backend:
   *   UI "pelaje"     → BD "bodyColor"
   *   UI "secundario" → BD "patternColor"
   *   UI "ojos"       → BD "eyeColor"
   */
  const UI_TO_BD = { pelaje: "bodyColor", secundario: "patternColor", ojos: "eyeColor" };
  const BD_TO_UI = { bodyColor: "pelaje", patternColor: "secundario", eyeColor: "ojos" };

  /* ── Inicializa el creador de avatar (Tomodachi Life) ── */
  function initMaker({ previewId, dataId, speciesId }) {
    const preview = document.getElementById(previewId);
    const dataInput = document.getElementById(dataId);
    const speciesInput = document.getElementById(speciesId);
    const modalElement = document.getElementById("avatarMakerModal");
    const stage = document.getElementById("avatar-stage-preview");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    let current = normalize(dataInput.value, speciesInput.value);

    /* SVG del stage de previsualización (grande, en el modal) */
    function renderStage() {
      if (stage) stage.innerHTML = svg(current);
      // Actualizar label de especie en el modal si existe
      const label = document.getElementById("labelEspecieModal");
      if (label) label.textContent = current.species;
      // Marcar swatch activo
      modalElement.querySelectorAll(".tomo-swatch").forEach(btn => {
        const uiParte = btn.dataset.tomoParte;  // "pelaje", "secundario", "ojos"
        const color = btn.dataset.tomoColor;
        const bdField = UI_TO_BD[uiParte];       // "bodyColor", "patternColor", "eyeColor"
        const isActive = bdField && current[bdField] && current[bdField].toUpperCase() === color.toUpperCase();
        btn.classList.toggle("tomo-swatch-active", isActive);
      });
    }

    /* Preview chico (en el formulario) */
    function previewSaved() {
      if (!dataInput.value) {
        preview.innerHTML = '<span class="text-muted small">Sin Avatar</span>';
        preview.style.border = "3px dashed #2C1E16";
        preview.style.backgroundColor = "#e2dcd0";
      } else {
        const c = normalize(dataInput.value, speciesInput.value);
        preview.innerHTML = svg(c);
        preview.style.border = "none";
        preview.style.backgroundColor = "transparent";
      }
    }

    /* ── Event: Abrir modal ── */
    document.getElementById("btnCrearAvatar").addEventListener("click", () => {
      current = normalize(dataInput.value, speciesInput.value);
      current.species = speciesInput.value;
      renderStage();
      modal.show();
    });

    /* ── Events: Swatches ── */
    modalElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".tomo-swatch");
      if (!btn) return;
      const uiParte = btn.dataset.tomoParte;  // "pelaje", "secundario", "ojos"
      const color = btn.dataset.tomoColor;
      const bdField = UI_TO_BD[uiParte];
      if (bdField && color) {
        current[bdField] = color;
        renderStage();
      }
    });

    /* ── Events: Color pickers personalizados ── */
    ["pelaje", "secundario", "ojos"].forEach(uiParte => {
      const picker = document.getElementById(`tomo-custom-${uiParte}`);
      if (picker) {
        picker.addEventListener("input", (e) => {
          const bdField = UI_TO_BD[uiParte];
          current[bdField] = e.target.value;
          renderStage();
        });
      }
    });

    /* ── Event: Especie cambia en el formulario ── */
    speciesInput.addEventListener("change", () => {
      current.species = speciesInput.value;
      if (current.species !== "Gato" && current.pattern === "tabby") current.pattern = "spot";
      if (dataInput.value) {
        dataInput.value = JSON.stringify(normalize(current));
        previewSaved();
      }
      renderStage();
    });

    /* ── Event: Guardar avatar ── */
    document.getElementById("btnGuardarAvatar").addEventListener("click", () => {
      current.species = speciesInput.value;
      dataInput.value = JSON.stringify(normalize(current));
      previewSaved();
      modal.hide();
    });

    /* ── Event: Quitar avatar ── */
    document.getElementById("btnQuitarAvatar").addEventListener("click", () => {
      dataInput.value = "";
      current = normalize(null, speciesInput.value);
      previewSaved();
    });

    previewSaved();
    renderStage();

    return {
      getConfig: () => dataInput.value || null,
      refresh: () => {
        current = normalize(dataInput.value, speciesInput.value);
        previewSaved();
        renderStage();
      },
    };
  }

  /* ── API Pública ── */
  window.CairoAvatar = {
    normalize,
    svg,
    dataUrl,
    initMaker,
    buildPalette,
    PALETAS,
    defaultConfig: { ...DEFAULT },
  };
})();
