#!/usr/bin/env -S deno run -A

import { convertToCron } from "./cron.ts";
import { loadConfig } from "./config.ts";
import { sync } from "./sync.ts";

const config = await loadConfig();
const cronSpec = convertToCron(config.SYNC_INTERVAL_MINUTES);

Deno.cron(
  "obsidian-sync",
  cronSpec,
  async () => {
    try {
      await sync(config);
    } catch {
      Deno.exit(1);
    }
  },
);
