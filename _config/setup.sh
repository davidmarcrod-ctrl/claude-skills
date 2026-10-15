#!/bin/zsh
# Deja un Mac listo para trabajar con Claude Code + After Effects + Blender.
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

# MCPs (ae-mcp, blender-mcp): clonar, compilar y registrar en Claude Code y Claude Desktop
mkdir -p ~/code
for m in ae-mcp blender-mcp; do
  [ -d ~/code/$m ] || git clone https://github.com/davidmarcrod-ctrl/$m ~/code/$m
  (cd ~/code/$m && npm install --silent && npm run build --silent)
  python3 "$C/register-mcp.py" $m ~/code/$m/dist/index.js "$NODE"
done

# Add-on MCP Bridge de Blender (necesita Blender cerrado)
if [ -d /Applications/Blender.app ]; then
  if pgrep -x Blender >/dev/null; then echo "⚠️  Cierra Blender y ejecuta: cd ~/code/blender-mcp && npm run install-addon"
  else (cd ~/code/blender-mcp && npm run install-addon --silent); fi
fi
echo "✓ Listo. Reinicia Claude (Cmd+Q)."
