#!/usr/bin/env -S deno run -A

import { loadConfig } from "./config.ts";
import { sync } from "./sync.ts";

const config = await loadConfig();
Deno.cron(
  "obsidian-sync",
  `*/${config.SYNC_INTERVAL_MINUTES} * * * *`,
  async () => {
    try {
      await sync(config);
    } catch {
      Deno.exit(1);
    }
  },
);
