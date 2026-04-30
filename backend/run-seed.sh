#!/bin/bash
cd /workspaces/default/code/backend
export NODE_PATH="/pnpm-store/v10"
/pnpm-store/v10/**/tsx/*/node_modules/.bin/tsx src/utils/seed.ts
