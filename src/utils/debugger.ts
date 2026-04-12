import { appendFileSync } from "fs";
import { join } from "path";

const DEBUG_LOG = join(process.cwd(), "debug.log");

export function debugLog(message: string) {
  appendFileSync(DEBUG_LOG, `${new Date().toISOString()} - ${message}\n`);
}