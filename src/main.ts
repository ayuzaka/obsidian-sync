#!/usr/bin/env -S deno run -A

import $ from "@david/dax";
import { exists } from "https://deno.land/std@0.224.0/fs/exists.ts";
import { loadConfig } from "./config.ts";
import { createLogger } from "./logger.ts";

async function main() {
  const config = await loadConfig();
  const { log } = await createLogger(config.LOG_FILE_PATH || "sync.log");

  try {
    log(`\n--- Starting sync at ${new Date().toISOString()} ---`);

    const { OBSIDIAN_VAULT_PATH } = config;
    if (!OBSIDIAN_VAULT_PATH) {
      log(`ERROR: OBSIDIAN_VAULT_PATH is not set in config.json.`);
      Deno.exit(1);
    }

    if (!(await exists(OBSIDIAN_VAULT_PATH, { isDirectory: true }))) {
      log(
        `ERROR: OBSIDIAN_VAULT_PATH '${OBSIDIAN_VAULT_PATH}' does not exist or is not a directory.`
      );
      Deno.exit(1);
    }

    Deno.chdir(OBSIDIAN_VAULT_PATH);
    log(`Entered vault directory: ${Deno.cwd()}`);

    const status = await $`git status --porcelain`.text();
    if (status.trim() === "") {
      log("No changes detected. Nothing to do.");
      return;
    }

    const commitMessage = `vault backup: ${new Date().toISOString()}`;

    await $`git add .`
    await $`git commit -m "${commitMessage}"`
    await $`git pull`;
    await $`git push`;

    log("Changes pushed to GitHub successfully.");
    log("--- Sync finished ---");
  } catch (error) {
    log(`An unexpected error occurred: ${error}`);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
