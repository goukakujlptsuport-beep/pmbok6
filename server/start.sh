#!/bin/bash
# Start PMP server with Node v22 (required for better-sqlite3)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 22.14.0 --silent 2>/dev/null || true
exec npm run dev
