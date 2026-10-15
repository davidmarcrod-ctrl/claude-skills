# Instrucciones globales

## Sobre mí

- Mi fuerte es After Effects y el motion 2D. **Mis conocimientos de Blender y 3D son limitados**: en cualquier
  trabajo 3D, explícame lo que haces y por qué, en lenguaje claro (qué es un shadow catcher, un pase, una
  normal, por qué una escala o una luz…). Relaciónalo con su equivalente en AE cuando exista, y dime dónde
  verlo o tocarlo en Blender si me hace falta.

## Contexto de proyecto compartido entre ordenadores

Trabajo en dos Mac (sobremesa en la oficina, portátil en casa). Los proyectos viven en el disco externo
**JARL RED** (`/Volumes/JARL RED/...`), que viaja entre los dos. El historial y la memoria de Claude Code
NO viajan: la única memoria compartida es el `CLAUDE.md` de la carpeta de cada proyecto.

Por tanto, cuando trabajes en una carpeta de proyecto que tenga `CLAUDE.md`:
- Actualízalo **durante** la sesión, no solo al final: cada vez que se tome una decisión (estilo, timing,
  estructura, entregas), se termine algo o cambie el estado. Una sesión puede cerrarse sin aviso.
- Mantén al día las secciones «Estado actual» y «Pendientes», y añade una línea al «Registro de sesiones»
  (fecha, ordenador, qué se hizo).
- Sé conciso: es un documento de referencia, no una transcripción.
- Si la carpeta de un proyecto no tiene `CLAUDE.md`, ofrece crearlo con la skill `ae-proyecto`.
- Para proyectos nuevos de After Effects, usa la skill `ae-proyecto`.

## Sesiones de Claude Code (app de escritorio)

- La barra lateral de Code está agrupada **por proyecto**: cada carpeta es la carpeta de trabajo del chat.
  Por eso, cada proyecto nuevo debe tener su propio chat **en la carpeta del proyecto**. Si un chat
  arranca en otra carpeta, muévelo con `ccd_directory` → `change_directory` a la raíz del proyecto.
- **No** uses grupos personalizados (`ccd_sidebar` create_group / move_sessions): cambian la vista a «custom»
  y ocultan las carpetas por proyecto. Si alguna vez cambia la vista, restáurala con `set_view` group_by `project`.

## Versionado de los `.aep` (todos los proyectos)

- Guardar versión nueva `_NN` **solo antes de un parche por script** (`run_script` que toca varias capas):
  si falla a mitad, deja cambios a medias. Los cambios pequeños con herramientas sueltas no necesitan versión.
- En `00 - AFTER` quedan solo la **vigente** y los **hitos aprobados**. Las intermedias se mueven a
  `00 - AFTER/_OLD` (no se borran). Hacer la limpieza al cerrar cada tanda de cambios y anotar en el
  `CLAUDE.md` del proyecto qué versión es cada hito.

## Configuración de After Effects por ordenador

Las preferencias de AE son de cada Mac (están en `~/Library/Preferences/Adobe/After Effects/<versión>/`).
Si en un ordenador no consta como revisada, ofrece el chequeo: hardware (`sysctl`, `system_profiler`),
preferencias (caché de disco, Multi-Frame Rendering, auto-save), GPU del proyecto (`app.project.gpuAccelType`:
Metal = 1814) y velocidad de los discos con `dd`. No edites las preferencias con AE abierto: se sobrescriben.

- **MacBook Pro M1 Max, 32 GB** (revisado el 03/10/2026, AE 26.5). GPU Metal, MFR, aceleración por
  hardware y caché en reposo, bien. **Problema:** la caché de disco estaba en `PHILIPS Cache AE` (USB, ~39 MB/s).
  Hecho (03/10): caché en `/Library/Caches/AE Disk Cache` (SSD interno, ~4 GB/s), 80 GB.
  RAM reservada para otras apps: 6 GB (correcto). Este Mac queda optimizado.
- **El otro Mac:** sin revisar.

## Herramientas

- MCP de After Effects: `~/code/ae-mcp` (repo `davidmarcrod-ctrl/ae-mcp`).
- MCP de Blender: `~/code/blender-mcp` (repo `davidmarcrod-ctrl/blender-mcp`), con puente cámara/nulls/renders
  con AE. Necesita el add-on «MCP Bridge» en Blender (arranca solo; panel N › MCP).
- Skills: `~/.claude/skills` (repo `davidmarcrod-ctrl/claude-skills`).
- `sync-claude` (en `~/.local/bin`) baja/sube los tres repos (skills, ae-mcp, blender-mcp); los hooks lo ejecutan
  solos al abrir y cerrar sesión. Si a un Mac le falta un MCP, lo clona, compila, registra e instala el add-on.
