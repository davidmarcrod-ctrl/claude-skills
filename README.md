# Claude Code skills

Personal skills for Claude Code. Clone to `~/.claude/skills` on each machine.

```bash
git clone <repo-url> ~/.claude/skills
```

## Contents

- `ae-proyecto`: alta e incorporación de proyectos de After Effects (estructura en JARL RED, CLAUDE.md, bins).
- `motion-design`, `aftereffects-motion`, `blender-motion`, `motion-design-critique`: from [LobzyJay/motion-design-with-claude-and-codex](https://github.com/LobzyJay/motion-design-with-claude-and-codex) (MIT, see `LICENSE-motion-design`). `aftereffects-motion` and `motion-design-critique/references/ae-diagnostics.md` are adapted to drive After Effects through the local `ae-mcp` server instead of TheLlamainator/after-effects-mcp; `blender-motion` drives Blender through the local `blender-mcp` server instead of the official Blender Lab MCP.

## Configuración compartida (`_config/`)

`CLAUDE.md` global, `settings.json` (hooks de sincronización), `sync-claude`, `register-mcp.py` y `setup.sh`.
`sync-claude` mantiene al día skills, `ae-mcp` y `blender-mcp`, y si a un Mac le falta un MCP lo instala y registra solo.
En un Mac nuevo: `gh auth login`, clonar este repo en `~/.claude/skills` y ejecutar `~/.claude/skills/_config/setup.sh`.
