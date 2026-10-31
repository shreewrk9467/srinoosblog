#!/bin/bash
# ==============================================================================
# Hostinger One-Click Production Deployment Script for sricospace.com
# Run this inside Hostinger SSH terminal: bash hostinger-deploy.sh
# ==============================================================================

set -e

echo "🚀 [1/4] Starting Hostinger deployment for sricospace.com..."
export NODE_ENV=production
export PORT=3000

# Install dependencies if node_modules is missing or package.json changed
if [ ! -d "node_modules" ]; then
  echo "📦 [2/4] Installing dependencies on Hostinger..."
  npm install --no-audit
fi

# Build Next.js production bundle
echo "🔨 [3/4] Building Next.js production bundle for sricospace.com..."
npm run build

# Start or restart PM2 process
echo "⚡ [4/4] Starting process on Hostinger using PM2..."
if command -v pm2 >/dev/null 2>&1; then
  pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
  pm2 save
  echo "✅ Hostinger deployment complete! Application running under PM2 on port 3000."
else
  echo "ℹ️ PM2 not found, starting server directly with node server.js..."
  node server.js
fi

