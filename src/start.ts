import { isProcessRunning, PID_FILE, readPidFromFile } from "../scripts.ts";
import { remove } from "@std/fs/unstable-remove";
import { sleep } from "./utils.ts";

const LOG_FILE = "nohup.out";

export async function start(): Promise<void> {
  const pid = await readPidFromFile(PID_FILE);
  if (pid && await isProcessRunning(pid)) {
    console.log(`✅ Obsidian Sync is already running (PID: ${pid}).`);
    return;
  }

  if (pid) {
    console.log(`Stale ${PID_FILE} found. Removing it.`);
    await remove(PID_FILE);
  }

  console.log("🚀 Starting Obsidian Sync process...");

  // Delegate process backgrounding and I/O redirection to the shell.
  // This is more robust and mirrors the logic of the original start.sh.
  const shellCommand =
    `nohup deno run --unstable-cron --allow-env --allow-read --allow-write --allow-run src/main.ts > ${LOG_FILE} 2>&1 & echo $! > ${PID_FILE}`;

  const command = new Deno.Command("bash", {
    args: ["-c", shellCommand],
  });

  const { code, stderr } = await command.output();

  if (code !== 0) {
    console.error("❌ Failed to execute start command.");
    console.error(new TextDecoder().decode(stderr));
    Deno.exit(1);
  }

  // Wait a moment to allow the process to potentially crash
  await sleep(2000);

  const newPid = await readPidFromFile(PID_FILE);
  if (newPid && await isProcessRunning(newPid)) {
    console.log(
      `✅ Obsidian Sync started successfully (PID: ${newPid}). Log output is in ${LOG_FILE}`,
    );
    return;
  }

  console.error(
    `❌ Failed to start Obsidian Sync process. Check ${LOG_FILE} for error details.`,
  );

  // Clean up the stale pid file if the process crashed
  if (newPid) {
    await remove(PID_FILE);
  }
  Deno.exit(1);
}
