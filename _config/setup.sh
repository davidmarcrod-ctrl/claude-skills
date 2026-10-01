#!/bin/zsh
# Deja un Mac listo para trabajar con Claude Code + After Effects.
# Requisitos previos: repo de skills clonado en ~/.claude/skills y `gh auth login` hecho.
set -e
C="$HOME/.claude/skills/_config"
link() { [ -e "$2" ] && [ ! -L "$2" ] && mv "$2" "$2.bak-$(date +%F)"; ln -sfn "$1" "$2"; echo "✓ $2"; }

# Node (nvm) si falta
export NVM_DIR="$HOME/.nvm"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | PROFILE=~/.zshrc bash; fi
. "$NVM_DIR/nvm.sh"; nvm install --lts >/dev/null; NODE="$(nvm which default)"

# Configuración compartida
mkdir -p ~/.local/bin
link "$C/CLAUDE.md"     ~/.claude/CLAUDE.md
link "$C/settings.json" ~/.claude/settings.json
link "$C/sync-claude"   ~/.local/bin/sync-claude
grep -q '.local/bin' ~/.zshrc 2>/dev/null || echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc

# ae-mcp
[ -d ~/code/ae-mcp ] || git clone https://github.com/davidmarcrod-ctrl/ae-mcp ~/code/ae-mcp
(cd ~/code/ae-mcp && npm install --silent && npm run build --silent)

# Registrar ae-mcp en Claude Desktop
CFG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
[ -f "$CFG" ] && cp "$CFG" "$CFG.bak-$(date +%F)"
NODE="$NODE" python3 - "$CFG" <<'PY'
import json,sys,os
p=sys.argv[1]; c=json.load(open(p)) if os.path.exists(p) else {}
c.setdefault("mcpServers",{})["ae-mcp"]={"command":os.environ["NODE"],"args":[os.path.expanduser("~/code/ae-mcp/dist/index.js")]}
json.dump(c,open(p,"w"),indent=2)
PY
echo "✓ ae-mcp registrado. Reinicia Claude Desktop (Cmd+Q)."
