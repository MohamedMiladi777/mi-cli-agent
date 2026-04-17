import { useCallback } from "react";
import { commandParser } from "../../utils/parseSlashCommands.ts";
import type { ParserResult } from "../../utils/parseSlashCommands.ts";
import type { CommandName } from "../../core/types.ts";
export interface SlashCommandActions {
  openModelDialog: () => void;
  openModeDialog: () => void;
}

export const useSlashCommand = (actions: SlashCommandActions) => {
  const handleSlashCommand = useCallback(
    (parsedCommand: ParserResult<CommandName>) => {
      switch (parsedCommand.result) {
        case "model":
          actions.openModelDialog();
          break;

        case "mode":
          actions.openModeDialog();
          break;
      }
    },
    [actions],
  );
  return { handleSlashCommand };
};
