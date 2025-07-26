import { isProcessRunning, PID_FILE, WATCHDOG_PID_FILE, readPidFromFile } from "../scripts.ts";
import { remove } from "@std/fs/unstable-remove";

export async function stop() {
  // Stop watchdog first
  const watchdogPid = await readPidFromFile(WATCHDOG_PID_FILE);
  if (watchdogPid) {
    if (await isProcessRunning(watchdogPid)) {
      console.log(`Stopping watchdog process (PID: ${watchdogPid})...`);
      try {
        Deno.kill(watchdogPid, "SIGTERM");
      } catch { /* ignore */ }
      console.log("Watchdog process stopped.");
    }
    await remove(WATCHDOG_PID_FILE).catch(() => {});
  } else {
    console.log("Watchdog process not running (no PID file).");
  }

  // Stop main process
  const pid = await readPidFromFile(PID_FILE);
  if (pid) {
    if (await isProcessRunning(pid)) {
      console.log(`Stopping Obsidian Sync process (PID: ${pid})...`);
      try {
        Deno.kill(pid, "SIGTERM");
      } catch { /* ignore */ }
      console.log("Obsidian Sync process stopped.");
    } else {
      console.log(`Obsidian Sync process (PID: ${pid}) was not running.`);
    }
    await remove(PID_FILE).catch(() => {});
  } else {
    console.log("Obsidian Sync process not running (no PID file).");
  }

  console.log("✅ Stop script finished.");
}
