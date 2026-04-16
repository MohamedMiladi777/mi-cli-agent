import { useCallback } from "react";
import { commandParser } from "../../utils/parseSlashCommands.ts";
import type { ParserResult } from "../../utils/parseSlashCommands.ts";
import type { CommandName } from "../../core/types.ts";
import { debugLog } from "../../utils/debugger.ts";

export interface SlashCommandActions {
  openModelDialog: () => void;
  openModeDialog: () => void;
}

export const useSlashCommand = (actions: SlashCommandActions) => {
  const handleSlashCommand = useCallback(
    (parsedCommand: ParserResult<CommandName>) => {
      debugLog(`[COMMAND HANDLER] Received command: ${parsedCommand.result}`);
      switch (parsedCommand.result) {
        case "model":
          debugLog(`[COMMAND HANDLER] Calling openModelDialog`);
          actions.openModelDialog();
          break;

        case "mode":
          debugLog(`[COMMAND HANDLER] Calling openModeDialog`);
          actions.openModeDialog();
          break;

        default:
          debugLog(`[COMMAND HANDLER] Unknown command: ${parsedCommand.result}`);
      }
    },
    [actions],
  );
  return { handleSlashCommand };
};
