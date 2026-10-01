// Organiza el panel de proyecto de AE.
// - Crea las carpetas estándar (NN - NOMBRE) si no existen.
// - Coloca cada item según su tipo: comps exportables -> FINALES, resto de comps -> COMPOS,
//   capas de AI -> AI, imágenes de textura -> TEXTURAS, sólidos -> SOLIDOS & AJUSTES.
// - Borra carpetas antiguas (LEGACY_BINS) solo si quedan vacías.
// Idempotente: se puede relanzar en cualquier momento.

var BINS = ["00 - FINALES", "01 - COMPOS", "02 - AI", "03 - TEXTURAS", "04 - SOLIDOS & AJUSTES"];
var FINALES = [];                           // comps que se exportan (rellenar por proyecto)
var LEGACY_BINS = ["00 FINALES", "01 COMPOS", "02 ILLUSTRATORS", "03 TEXTURAS"];

var proj = app.project;

function findBin(name) {
  for (var i = 1; i <= proj.numItems; i++) {
    var it = proj.item(i);
    if (it instanceof FolderItem && it.name === name) return it;
  }
  return null;
}
function inArray(a, v) { for (var i = 0; i < a.length; i++) if (a[i] === v) return true; return false; }
function ext(f) { var m = f.name.match(/\.([^.]+)$/); return m ? m[1].toLowerCase() : ""; }

var bins = {};
for (var b = 0; b < BINS.length; b++) bins[BINS[b]] = findBin(BINS[b]) || proj.items.addFolder(BINS[b]);

// Snapshot: proj.item() indices shift as items move.
var items = [];
for (var i = 1; i <= proj.numItems; i++) items.push(proj.item(i));

var moved = [];
function moveTo(it, binName) {
  if (it.parentFolder !== bins[binName]) { it.parentFolder = bins[binName]; moved.push(it.name + " -> " + binName); }
}

for (var n = 0; n < items.length; n++) {
  var it = items[n];
  if (it instanceof CompItem) {
    moveTo(it, inArray(FINALES, it.name) ? "00 - FINALES" : "01 - COMPOS");
  } else if (it instanceof FolderItem) {
    // Carpeta "<x> Layers" que crea la importación de un AI como composición
    if (/ Layers$/.test(it.name)) moveTo(it, "02 - AI");
  } else if (it instanceof FootageItem) {
    var src = it.mainSource;
    if (src instanceof SolidSource) { moveTo(it, "04 - SOLIDOS & AJUSTES"); continue; }
    if (!src.file) continue;
    var e = ext(src.file);
    // Las capas de AI ya viajan dentro de su carpeta "Layers"
    if ((e === "ai" || e === "eps" || e === "pdf") && !/ Layers$/.test(it.parentFolder.name)) moveTo(it, "02 - AI");
    else if (inArray(["jpg", "jpeg", "png", "tif", "tiff", "psd", "exr"], e)) moveTo(it, "03 - TEXTURAS");
  }
}

var removed = [], kept = [];
for (var l = 0; l < LEGACY_BINS.length; l++) {
  var f = findBin(LEGACY_BINS[l]);
  if (!f) continue;
  if (f.numItems === 0) { f.remove(); removed.push(LEGACY_BINS[l]); }
  else kept.push(LEGACY_BINS[l] + " (" + f.numItems + " items)");
}

return { moved: moved, removedBins: removed, keptNotEmpty: kept };
