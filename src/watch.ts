import { isProcessRunning, PID_FILE, WATCHDOG_PID_FILE, readPidFromFile } from "../scripts.ts";
import { remove } from "@std/fs/unstable-remove";
import { start } from "./start.ts";
import { sleep } from "./utils.ts";

const WATCH_INTERVAL_MS = 60 * 60 * 1000;

export async function watch() {
  await Deno.writeTextFile(WATCHDOG_PID_FILE, Deno.pid.toString());

  // Ensure cleanup on exit
  const cleanup = async () => {
    console.log("\nCleaning up watchdog PID file...");
    await remove(WATCHDOG_PID_FILE).catch(() => {});
    Deno.exit();
  };

  Deno.addSignalListener("SIGINT", cleanup);
  Deno.addSignalListener("SIGTERM", cleanup);

  while (true) {
    const pid = await readPidFromFile(PID_FILE);
    if (!pid || !(await isProcessRunning(pid))) {
      if (pid) {
        console.warn(
          `[${new Date().toISOString()}] ⚠️ Process with PID ${pid} is not running. Restarting...`,
        );
        // Display macOS notification
        new Deno.Command("osascript", {
          args: [
            "-e",
            'display notification "Obsidian Sync process has stopped. Restarting now." with title "Obsidian Sync Watchdog"',
          ],
        }).spawn();
      } else {
        console.log(
          `[${new Date().toISOString()}] ❗ Process not running. Starting...`,
        );
      }

      await start();
    }

    await sleep(WATCH_INTERVAL_MS);
  }
}
