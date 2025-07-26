/**
 * Converts a sync interval in minutes to a cron string.
 *
 * @param minutes The sync interval in minutes. Must be between 1 and 1440.
 *   - If minutes < 60, the cron will be in minutes.
 *   - If minutes >= 60, it will be converted to hours.
 *     In this case, `minutes` must be a multiple of 60.
 * @returns The corresponding cron string.
 * @throws An error if the minutes are out of the valid range or invalid.
 */
export function convertToCron(minutes: number): string {
  if (minutes < 1 || minutes > 1440) {
    throw new Error("Sync interval must be between 1 and 1440 minutes.");
  }

  if (minutes < 60) {
    return `*/${minutes} * * * *`;
  }

  if (minutes % 60 !== 0) {
    throw new Error(
      "Intervals of 60 minutes or more must be a multiple of 60.",
    );
  }

  const hours = minutes / 60;
  if (hours === 24) {
    return "0 0 * * *";
  }
  return `0 */${hours} * * *`;
}
