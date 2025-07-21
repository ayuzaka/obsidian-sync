#!/usr/bin/env -S deno run -A

import { sync } from "./sync.ts";

Deno.cron(
  "obsidian-sync",
  "0 * * * *", // Every hour
  async () => {
    try {
      await sync();
    } catch {
      Deno.exit(1);
    }
  },
);
