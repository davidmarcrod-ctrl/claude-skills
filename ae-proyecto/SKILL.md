---
name: ae-proyecto
description: Crea o incorpora un proyecto de After Effects con el flujo de trabajo estándar de David (disco JARL RED, carpetas numeradas, CLAUDE.md como memoria compartida entre ordenadores, bins y scripts base). Úsala cuando el usuario diga "nuevo proyecto", "empezamos un proyecto", "monta/crea el proyecto", "prepara la carpeta", o cuando abra una sesión en una carpeta de proyecto de JARL RED que no tenga CLAUDE.md ("incorpora este proyecto", "contextualiza este proyecto").
---

# Proyecto de After Effects: alta e incorporación

Flujo estándar para que cualquier proyecto funcione igual en los dos Mac (sobremesa y portátil).
Todo vive en el disco externo **JARL RED**; la memoria del proyecto es su `CLAUDE.md`.

Raíz de proyectos: `/Volumes/JARL RED/1. DAVID RODRIGUEZ/1. PROYECTOS/<Cliente>/<Proyecto>/`

Si `/Volumes/JARL RED` no está montado, para y pide que se conecte el disco.

## A. Proyecto nuevo

1. **Pide lo mínimo** (en una sola pregunta y sin bloquearte si falta algo; lo que falte queda como pendiente):
   cliente, nombre del proyecto, descripción breve, formato de entrega (resolución, fps, aspecto), duración y fecha.
   Comprueba si el cliente ya tiene carpeta (`ls` de la raíz) y reutiliza su nombre exacto.
2. **Crea las carpetas**: `00 - AFTER`, `01 - BRUTOS`, `02 - AI & PSD` (con subcarpetas `AI` y `PSD`), `03 - IA`,
   `04 - FOTOS Y TEXTURAS`, `05 - VIDEOS`, `06 - GRAFISMOS`, `07 - SCRIPTS`, `08 - RENDERS`, `09 - REFES & INSP`,
   `10 - PDFS & DOCS`, `11 - EXPORTS`. Ojo: `02 - AI & PSD/AI` es Illustrator; `03 - IA` es inteligencia artificial.
   Coloca el material recibido donde toque (AI/PSD en `02`, fuentes y logos en `06 - GRAFISMOS`, metraje de cámara en `01 - BRUTOS`,
   otros vídeos —stock, material de apoyo, vídeos de campaña— en `05 - VIDEOS`).
   Esta estructura rige desde el 13/10/2026 (`05 - VIDEOS` añadida entre fotos y grafismos; antes, del 08/10, sin ella); los proyectos anteriores conservan la antigua (no migrarlos sin que se pida).
3. **CLAUDE.md**: copia `assets/CLAUDE.template.md` en la raíz del proyecto y rellena los `{{...}}`
   (`{{PREFIJO}}` = `Proyecto_Cliente` sin espacios; `{{ORDENADOR}}` sale de `scutil --get ComputerName`).
   Lo desconocido se deja como "pendiente" y se añade a Pendientes.
4. **Scripts base**: copia `assets/project_bins.jsx` en `07 - SCRIPTS/`.
5. **Proyecto de AE** (solo si After Effects está abierto y las herramientas `ae-mcp` están disponibles; si no, díselo y sáltalo):
   - Si el proyecto abierto tiene cambios sin guardar, **no lo toques**: pregunta antes.
   - Crea un proyecto nuevo con `run_script` (`app.newProject()`), crea la comp principal con el formato del brief
     (`create_composition`), ejecuta `project_bins.jsx` con `run_script` y guárdalo como
     `00 - AFTER/{{PREFIJO}}_01.aep` (`save_project`).
6. **Carpeta de la sesión en la app**: la barra lateral agrupa los chats por carpeta de trabajo. Si la sesión
   no está ya en la raíz del proyecto, muévela con `ccd_directory` → `change_directory`. No uses grupos personalizados
   (`ccd_sidebar`): cambian la vista y ocultan las carpetas por proyecto.
7. **Resumen final**: ruta creada, qué falta del brief y recordatorio de abrir las sesiones de Claude Code
   **en la carpeta del proyecto**.

## B. Incorporar un proyecto existente (carpeta sin CLAUDE.md)

1. Explora la carpeta: estructura, `.aep` (la versión más alta es la vigente), scripts (lee sus cabeceras),
   referencias, informes de empaquetado de Illustrator (fuentes, tamaños) y PDFs y documentos (storyboard, guion, dirección de arte).
2. Si AE está abierto con ese proyecto, usa `list_compositions` / `list_layers` para documentar las comps reales.
3. Crea el `CLAUDE.md` con la plantilla, rellenando lo que se deduzca y marcando lo dudoso para confirmar
   (p. ej. formatos que no cuadran). No renombres ni muevas archivos sin preguntar: los `.aep` tienen rutas enlazadas.
4. Si la estructura de carpetas difiere del estándar, propón la reorganización; no la hagas por tu cuenta.
   Tras reorganizar hace falta revincular el footage dentro de AE.
5. Si la sesión no está en la carpeta del proyecto, muévela ahí (igual que en A.6).

## Convenciones

- Versiona los `.aep` con sufijo `_NN`; no sobrescribas una versión a la que el usuario pueda querer volver.
  Guarda versión nueva **solo antes de un parche por script** (si falla a mitad, deja cambios a medias);
  los cambios pequeños con herramientas sueltas no la necesitan.
- En `00 - AFTER` quedan solo la vigente y los hitos aprobados; las intermedias van a `00 - AFTER/_OLD`
  (no se borran). Limpia al cerrar cada tanda de cambios y apunta los hitos en el `CLAUDE.md`.
- Los scripts del proyecto van en `07 - SCRIPTS`, con una cabecera que explique qué hacen y si son idempotentes
  o de un solo uso.
- Durante el trabajo, mantén el `CLAUDE.md` al día (estado, decisiones, pendientes, registro de sesiones).
