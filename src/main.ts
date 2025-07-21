#!/usr/bin/env -S deno run -A

import { sync } from "./sync.ts";

function main() {
  Deno.cron("obsidian-sync", "0 */60 * * * *", async () => {
    try {
      await sync();
    } catch {
      Deno.exit(1);
    }
  })
}

if (import.meta.main) {
  main();
}
