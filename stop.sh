#!/bin/bash

echo "Stopping watchdog script..."
# Find and kill the watchdog.sh process
WATCHDOG_PID=$(ps aux | grep "[w]atchdog.sh" | awk '{print $2}')
if [ -n "$WATCHDOG_PID" ]; then
  kill $WATCHDOG_PID
  echo "Watchdog process (PID: $WATCHDOG_PID) stopped."
else
  echo "Watchdog process not found."
fi

# Stop the main deno process
if [ -f deno.pid ]; then
  PID=$(cat deno.pid)
  echo "Stopping Obsidian Sync process (PID: $PID)..."
  if ps -p "$PID" > /dev/null; then
    kill "$PID"
    echo "Process stopped."
  else
    echo "Process with PID $PID was not running."
  fi
  rm deno.pid
  echo "deno.pid removed."
else
  echo "PID file (deno.pid) not found. The main process may not be running or was already stopped."
fi

echo "Stop script finished."
