import { exists } from "@std/fs/exists";
import { dirname } from "@std/path/dirname";

type Logger = {
  log: (message: string) => Promise<void>;
};

async function createLogger(
  logFilePath: string,
): Promise<Logger> {
  const logDir = dirname(logFilePath);
  if (!(await exists(logDir))) {
    await Deno.mkdir(logDir, { recursive: true });
  }

  const log = async (message: string) => {
    await Deno.writeTextFile(logFilePath, message + "\n", { append: true });
  };

  return { log };
}

/**
 * Creates a logger that only logs when a log file path is provided
 * If logFilePath is undefined, returns a no-op logger
 */
export async function createOptionalLogger(
  logFilePath?: string,
): Promise<Logger> {
  if (!logFilePath) {
    // Return a no-op logger when no log file path is provided
    return {
      log: async (_message: string) => {
        // Do nothing
      },
    };
  }

  // Use the regular logger when path is provided
  return await createLogger(logFilePath);
}
