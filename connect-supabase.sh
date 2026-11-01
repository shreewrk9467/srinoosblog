#!/bin/sh
export PATH="/tmp/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"
if [ ! -f /tmp/bin/node ]; then
  mkdir -p /tmp/bin
  cat << 'EON' > /tmp/bin/node
#!/bin/sh
export ELECTRON_RUN_AS_NODE=1
exec "/Applications/Antigravity IDE.app/Contents/MacOS/Electron" "$@"
EON
  chmod +x /tmp/bin/node
fi

/tmp/bin/node scripts/connect-supabase.mjs "$@"
