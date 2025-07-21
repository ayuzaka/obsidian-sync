import { exists } from "https://deno.land/std@0.224.0/fs/exists.ts";
import { dirname } from "https://deno.land/std@0.224.0/path/mod.ts";

export type Logger = {
  log: (message: string) => Promise<void>;
};

export async function createLogger(
  logFilePath: string
): Promise<Logger> {
    const logDir = dirname(logFilePath);
    if (!(await exists(logDir))) {
      await Deno.mkdir(logDir, { recursive: true });
    }

    const log = async (message: string) => {
      await Deno.writeTextFile(logFilePath, message + '\n', { append: true });
    };

    return { log };
}
