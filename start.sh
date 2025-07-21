#!/bin/bash

if [ -f deno.pid ]; then
  PID=$(cat deno.pid)
  if ps -p "$PID" > /dev/null; then
    echo "Obsidian Sync is already running. (PID: $PID)"
    exit 0
  fi
fi

echo "🚀 Starting Obsidian Sync process..."

nohup deno run --unstable-cron --allow-env --allow-read --allow-write --allow-run src/main.ts 2>&1 &
echo $! > deno.pid

echo "✅ Obsidian Sync started (PID: $(cat deno.pid))"
