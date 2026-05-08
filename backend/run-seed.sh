#!/bin/bash
cd "$(dirname "$0")"

if [ ! -f "package.json" ]; then
  echo "❌ No se encontró backend/package.json"
  exit 1
fi

echo "✅ Seed backend"
pnpm install
node src/utils/seed.js
