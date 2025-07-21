import { exists } from "@std/fs/exists";
import { dirname } from "@std/path/dirname";

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
