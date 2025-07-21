import { join } from "@std/path/join";
import * as z from "zod/mini";

const configSchema = z.object({
  OBSIDIAN_VAULT_PATH: z.string().check(z.minLength(1), z.trim()),
  LOG_FILE_PATH: z.optional(z.string().check(z.minLength(1), z.trim())),
});

type ConfigSchema = z.infer<typeof configSchema>;

export async function loadConfig(): Promise<ConfigSchema> {
  const configHomeDir = Deno.env.get("XDG_CONFIG_HOME");

  if (!configHomeDir) {
    console.error("XDG_CONFIG_HOME environment variable not set.");
    Deno.exit(1);
  }

  const configDir = join(configHomeDir, "obsidian-sync");
  const configFile = join(configDir, "config.json");

  try {
    const configContent = await Deno.readTextFile(configFile);
    const parseResult = configSchema.parse(JSON.parse(configContent));

    return {
      OBSIDIAN_VAULT_PATH: parseResult.OBSIDIAN_VAULT_PATH,
      LOG_FILE_PATH: parseResult.LOG_FILE_PATH,
    };
  } catch (e) {
    console.error(e);

    Deno.exit(1);
  }
}
