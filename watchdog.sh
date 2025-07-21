#!/bin/bash

while true; do
  if [ ! -f deno.pid ]; then
    echo "❗ PID file not found. Restarting Obsidian Sync..."]
    ./start.sh
  else
    PID=$(cat deno.pid)
    if ! ps -p "$PID" > /dev/null; then
      echo "⚠️ $(date) Obsidian Sync is not running. Restarting..."
      osascript -e 'display notification "Obsidian Sync process has stopped. Restarting now." with title "Obsidian Sync Watchdog"'
      ./start.sh
    fi
  fi
done
