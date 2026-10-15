#!/usr/bin/env python3
"""Registra un MCP local (node <repo>/dist/index.js) en Claude Code y Claude Desktop.

Uso: register-mcp.py <nombre> <ruta-a-dist/index.js> <ruta-a-node>
Solo escribe si falta la entrada o apunta a otro sitio, con copia de seguridad la primera vez.
"""
import json
import os
import shutil
import sys

name, entry, node = sys.argv[1], os.path.expanduser(sys.argv[2]), sys.argv[3]
targets = [
    # Claude Code (pestaña Code y CLI): ~/.claude.json, clave mcpServers de usuario
    (os.path.expanduser("~/.claude.json"), {"type": "stdio", "command": node, "args": [entry], "env": {}}),
    # Claude Desktop (chat)
    (os.path.expanduser("~/Library/Application Support/Claude/claude_desktop_config.json"), {"command": node, "args": [entry]}),
]
for path, spec in targets:
    cfg = json.load(open(path)) if os.path.exists(path) else {}
    servers = cfg.setdefault("mcpServers", {})
    if servers.get(name, {}).get("args") == [entry]:
        continue
    if os.path.exists(path) and not os.path.exists(path + ".bak-mcp"):
        shutil.copy(path, path + ".bak-mcp")
    servers[name] = spec
    os.makedirs(os.path.dirname(path), exist_ok=True)
    json.dump(cfg, open(path, "w"), indent=2)
    print(f"✓ {name} registrado en {os.path.basename(path)}")
