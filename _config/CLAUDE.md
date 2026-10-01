# Instrucciones globales

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
- Si la carpeta de un proyecto no tiene `CLAUDE.md`, ofrece crearlo.

## Herramientas

- MCP de After Effects: `~/code/ae-mcp` (repo `davidmarcrod-ctrl/ae-mcp`).
- Skills: `~/.claude/skills` (repo `davidmarcrod-ctrl/claude-skills`).
- `sync-claude` (en `~/.local/bin`) baja/sube ambos repos; los hooks lo ejecutan solos al abrir y cerrar sesión.
