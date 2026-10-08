# {{PROYECTO}} — {{CLIENTE}}

{{DESCRIPCION}}
Se trabaja desde el disco externo **JARL RED**, que viaja entre el sobremesa (oficina) y el portátil (casa).
After Effects se controla con el MCP local `ae-mcp` (skills: `aftereffects-motion`, `motion-design`).

> Este archivo es la memoria compartida del proyecto entre ordenadores. Mantenlo al día:
> estado, decisiones y pendientes. Lo que no esté aquí, la próxima sesión no lo sabrá.

## Brief y entrega

- Cliente: {{CLIENTE}}
- Objetivo: {{OBJETIVO}}
- Formato de entrega: {{FORMATO}}
- Duración: {{DURACION}}
- Fecha de entrega: {{FECHA}}

## Estructura de carpetas (disco)

Raíz: `{{RUTA}}`

| Carpeta | Contenido |
|---|---|
| `00 - AFTER` | Proyectos `.aep` versionados: `{{PREFIJO}}_NN.aep` (la más alta es la vigente; aquí solo la vigente y los hitos, el resto en `_OLD`) |
| `01 - BRUTOS` | Material en bruto: metraje de cámara, planos recibidos |
| `02 - AI & PSD` | Archivos de diseño importados en AE: `AI/` (Illustrator) y `PSD/` (Photoshop) |
| `03 - IA` | Material generado con IA (imágenes, vídeo, Higgsfield…) |
| `04 - FOTOS Y TEXTURAS` | Fotos, texturas e imágenes |
| `05 - GRAFISMOS` | Paquetes y material gráfico de origen (fuentes, logos, manuales) |
| `06 - SCRIPTS` | ExtendScript del proyecto (para `ae-mcp run_script`) |
| `07 - RENDERS` | Renders de trabajo e intermedios (previos, precomps renderizadas) |
| `08 - REFES & INSP` | Referencias visuales |
| `09 - STORYBOARD` | Storyboard / guion |
| `10 - EXPORTS` | Entregables finales que se envían al cliente |

## Organización del panel de proyecto en AE

Bins: `00 - FINALES` (comps que se exportan), `01 - COMPOS`, `02 - AI`, `03 - TEXTURAS`, `04 - SOLIDOS & AJUSTES`.
`06 - SCRIPTS/project_bins.jsx` lo ordena todo y se puede relanzar (rellenar `FINALES`).

## Scripts

- `project_bins.jsx`: organiza los bins del panel de proyecto. Idempotente.

## Estilo y look

(Decisiones de estilo, easing, timing, paleta y tipografías a medida que se tomen.)

## Estado actual

- `.aep` vigente: (ninguno todavía)

## Pendientes

- [ ] Completar el brief

## Registro de sesiones

- {{HOY}} ({{ORDENADOR}}): proyecto creado.
