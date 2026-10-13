// Organiza el panel de proyecto de AE con bins que reflejan la estructura del disco (desde 08/10/2026).
// - Crea los bins estándar (NN - NOMBRE) si no existen.
// - Orden fijo de los primeros bins: BRUTOS, FINALES, COMPOS; después el resto.
// - Comps exportables (FINALES) -> 01 - FINALES; resto de comps -> 02 - COMPOS
//   (las comps de un AI/PSD importado se quedan con él en 03 - AI & PSD).
// - Footage: va al bin de la carpeta del disco de la que viene (01 - BRUTOS -> 00 - BRUTOS, etc.).
//   Si viene de otra ruta, se decide por extensión (vídeo -> BRUTOS, ai/psd -> AI & PSD, imagen -> FOTOS Y TEXTURAS).
// - Carpetas "<x> Layers" (AI/PSD importado como composición) -> 03 - AI & PSD. Sólidos -> 09 - SOLIDOS & AJUSTES.
// - Content-Aware Fill: lo que viene de una carpeta "Fills" del disco no se toca; el bin "Fills" que crea AE va a 08 - RENDERS.
// - Estructura del 13/10/2026 (con VIDEOS): también reconoce las carpetas de disco y bins de la del 08/10.
// - Bins con nombre antiguo (RENAMES) se renombran conservando su contenido.
// - Borra bins antiguos (LEGACY_BINS) solo si quedan vacíos.
// Idempotente: se puede relanzar en cualquier momento.
// Simulación: con $.global.BINS_DRY = true antes de ejecutarlo, solo informa de lo que movería (no toca nada).

var BINS = ["00 - BRUTOS", "01 - FINALES", "02 - COMPOS", "03 - AI & PSD", "04 - IA",
            "05 - FOTOS Y TEXTURAS", "06 - VIDEOS", "07 - GRAFISMOS", "08 - RENDERS", "09 - SOLIDOS & AJUSTES"];
var FINALES = [];                           // comps que se exportan (rellenar por proyecto)
var LEGACY_BINS = ["00 FINALES", "01 COMPOS", "02 ILLUSTRATORS", "03 TEXTURAS",
                   "02 - AI", "03 - TEXTURAS", "04 - SOLIDOS & AJUSTES", "Solids"];
var RENAMES = { "00 - FINALES": "01 - FINALES", "01 - COMPOS": "02 - COMPOS", "02 - BRUTOS": "00 - BRUTOS",
                "06 - GRAFISMOS": "07 - GRAFISMOS", "07 - RENDERS": "08 - RENDERS", "08 - SOLIDOS & AJUSTES": "09 - SOLIDOS & AJUSTES" };

// Carpeta del disco -> bin
var DISK_TO_BIN = {
  "01 - BRUTOS": "00 - BRUTOS", "02 - AI & PSD": "03 - AI & PSD", "03 - IA": "04 - IA",
  "04 - FOTOS Y TEXTURAS": "05 - FOTOS Y TEXTURAS", "05 - VIDEOS": "06 - VIDEOS", "06 - GRAFISMOS": "07 - GRAFISMOS",
  "08 - RENDERS": "08 - RENDERS", "11 - EXPORTS": "08 - RENDERS",
  // estructura del 08/10 (sin VIDEOS)
  "05 - GRAFISMOS": "07 - GRAFISMOS", "07 - RENDERS": "08 - RENDERS", "10 - EXPORTS": "08 - RENDERS"
};
var VIDEO = ["mov", "mp4", "mxf", "r3d", "braw", "avi", "m4v", "mkv"];
var DESIGN = ["ai", "eps", "pdf", "psd"];
var IMAGE = ["jpg", "jpeg", "png", "tif", "tiff", "exr", "dpx", "webp", "heic"];

var DRY = ($.global.BINS_DRY === true);
var proj = app.project;

function findBin(name) {
  for (var i = 1; i <= proj.numItems; i++) {
    var it = proj.item(i);
    if (it instanceof FolderItem && it.name === name && it.parentFolder === proj.rootFolder) return it;
  }
  return null;
}
function inArray(a, v) { for (var i = 0; i < a.length; i++) if (a[i] === v) return true; return false; }
function ext(f) { var m = f.name.match(/\.([^.]+)$/); return m ? m[1].toLowerCase() : ""; }
function binFromPath(f) {
  var parts = f.fsName.split("/");
  for (var i = parts.length - 2; i >= 0; i--) if (DISK_TO_BIN[parts[i]]) return DISK_TO_BIN[parts[i]];
  return null;
}

// Renombrado en dos pasos (vía nombre temporal) porque los nombres viejos y nuevos se cruzan
var renamed = [], tmp = [];
for (var from in RENAMES) {
  var bf = findBin(from);
  if (bf && !findBin(RENAMES[from]) && !DRY) { bf.name = "__tmp__" + RENAMES[from]; tmp.push(bf); renamed.push(from + " -> " + RENAMES[from]); }
}
for (var t = 0; t < tmp.length; t++) tmp[t].name = tmp[t].name.replace("__tmp__", "");

var bins = {};
for (var b = 0; b < BINS.length; b++) bins[BINS[b]] = findBin(BINS[b]) || (DRY ? null : proj.items.addFolder(BINS[b]));
function findLayersFolder(name) {
  for (var i = 1; i <= proj.numItems; i++) { var it = proj.item(i); if (it instanceof FolderItem && it.name === name) return it; }
  return null;
}
function isBin(it) { for (var k in bins) if (bins[k] === it) return true; return false; }

// Snapshot: proj.item() indices shift as items move.
var items = [];
for (var i = 1; i <= proj.numItems; i++) items.push(proj.item(i));

var moved = [];
function moveTo(it, binName) {
  if (it.parentFolder !== bins[binName]) { if (!DRY) it.parentFolder = bins[binName]; moved.push(it.name + " -> " + binName); }
}

for (var n = 0; n < items.length; n++) {
  var it = items[n];
  if (it instanceof CompItem) {
    // Las comps de un AI/PSD importado se quedan con él (dentro de su carpeta "Layers" o en AI & PSD)
    if (it.parentFolder === bins["03 - AI & PSD"] || / Layers$/.test(it.parentFolder.name)) continue;
    if (findLayersFolder(it.name + " Layers")) { moveTo(it, "03 - AI & PSD"); continue; }
    moveTo(it, inArray(FINALES, it.name) ? "01 - FINALES" : "02 - COMPOS");
  } else if (it instanceof FolderItem) {
    if (isBin(it)) continue;
    if (it.name === "Fills" && it.parentFolder === proj.rootFolder) { moveTo(it, "08 - RENDERS"); continue; }
    if (/ Layers$/.test(it.name)) moveTo(it, "03 - AI & PSD");
  } else if (it instanceof FootageItem) {
    var src = it.mainSource;
    if (src instanceof SolidSource) { moveTo(it, "09 - SOLIDOS & AJUSTES"); continue; }
    if (!src.file) continue;
    if (/\/Fills\//.test(src.file.fsName)) continue;   // Content-Aware Fill: se queda con su carpeta
    if (/ Layers$/.test(it.parentFolder.name)) continue;   // capas de AI/PSD: viajan en su carpeta
    var target = binFromPath(src.file), e = ext(src.file);
    if (!target) {
      if (inArray(VIDEO, e)) target = "00 - BRUTOS";
      else if (inArray(DESIGN, e)) target = "03 - AI & PSD";
      else if (inArray(IMAGE, e)) target = "05 - FOTOS Y TEXTURAS";
    }
    if (target) moveTo(it, target);
  }
}

var removed = [], kept = [];
for (var l = 0; l < LEGACY_BINS.length; l++) {
  var f = findBin(LEGACY_BINS[l]);
  if (!f) continue;
  if (f.numItems === 0) { if (!DRY) f.remove(); removed.push(LEGACY_BINS[l]); }
  else kept.push(LEGACY_BINS[l] + " (" + f.numItems + " items)");
}

return { dry: DRY, renamed: renamed, moved: moved, removedBins: removed, keptNotEmpty: kept };
