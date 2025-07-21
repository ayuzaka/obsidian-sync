import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { exists } from "https://deno.land/std@0.224.0/fs/exists.ts";

type Config = {
  OBSIDIAN_VAULT_PATH: string;
  LOG_FILE_PATH?: string;
};

export async function loadConfig(): Promise<Config> {
  const configHomeDir = Deno.env.get("XDG_CONFIG_HOME");

  if (!configHomeDir) {
    console.error("XDG_CONFIG_HOME environment variable not set.");
    Deno.exit(1);
  }

  const configDir = join(configHomeDir, "obsidian-sync");
  const configFile = join(configDir, "config.json");

  try {
    const configContent = await Deno.readTextFile(configFile);
    const parseResult = JSON.parse(configContent);

    if (typeof parseResult !== "object" || parseResult === null) {
      throw new Error("Configuration file must be a valid JSON object.");
    }

    if (
      !(await exists(parseResult.OBSIDIAN_VAULT_PATH, { isDirectory: true }))
    ) {
      throw new Error(
        `OBSIDIAN_VAULT_PATH "${parseResult.OBSIDIAN_VAULT_PATH}" does not exist or is not a directory.`,
      );
    }

    if (
      !parseResult.OBSIDIAN_VAULT_PATH ||
      typeof parseResult.OBSIDIAN_VAULT_PATH !== "string"
    ) {
      throw new Error(
        "Configuration file must contain OBSIDIAN_VAULT_PATH.",
      );
    }

    if (
      parseResult.LOG_FILE_PATH && typeof parseResult.LOG_FILE_PATH !== "string"
    ) {
      throw new Error("LOG_FILE_PATH must be a string if provided.");
    }

    return {
      OBSIDIAN_VAULT_PATH: parseResult.OBSIDIAN_VAULT_PATH,
      LOG_FILE_PATH: parseResult.LOG_FILE_PATH,
    };
  } catch (e) {
    console.error(e);

    Deno.exit(1);
  }
}
