import $ from "@david/dax";
import { start } from "./src/start.ts";
import { watch } from "./src/watch.ts";
import { stop } from "./src/stop.ts";

// --- Configuration ---
export const PID_FILE = "deno.pid";
export const WATCHDOG_PID_FILE = "watchdog.pid";

/** Reads a PID from a file. Returns null if the file doesn't exist or is invalid. */
export async function readPidFromFile(file: string): Promise<number | null> {
  try {
    const content = await Deno.readTextFile(file);
    const pid = parseInt(content, 10);
    return isNaN(pid) ? null : pid;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null;
    }
    throw error;
  }
}

/** Checks if a process with the given PID is currently running. */
export async function isProcessRunning(pid: number): Promise<boolean> {
  // `ps -p ${pid}` returns exit code 0 if the process exists.
  const result = await $`ps -p ${pid}`.noThrow();
  return result.code === 0;
}

async function main() {
  const command = Deno.args[0];

  switch (command) {
    case "start":
      await start();
      break;

    case "watch":
      await watch();
      break;

    case "stop":
      await stop();
      break;
    default:
      console.error(
        `Unknown command: ${command}. Use "start", "watch", or "stop".`,
      );
      Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
