import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import {
  useSlashCommand,
  type SlashCommandActions,
} from "../hooks/useSlashCommands.ts";
import { commandParser } from "../../utils/parseSlashCommands.ts";
import { debugLog } from "../../utils/debugger.ts";
interface InputProps {
  onSubmit: (value: string) => void;
  disabled?: boolean;
  actions: SlashCommandActions;
}

export function Input({ onSubmit, disabled = false, actions }: InputProps) {
  const [value, setValue] = useState("");
  const { handleSlashCommand } = useSlashCommand(actions);

  useInput((input, key) => {
    if (disabled) return;

    if (key.return) {
      if (value.trim()) {
        // If the typed text starts with a slash parse it to check if it is a command

        if (value.startsWith("/")) {
          try {
            debugLog(`[SLASH] Attempting to parse: "${value}"`);
            const parsed = commandParser.run(value);
            debugLog(`[SLASH] Parsed successfully: ${parsed.result}`);
            handleSlashCommand(parsed);
            debugLog(`[SLASH] Dialog should open now`);
            setValue("");
          } catch (error) {
            debugLog(
              `[SLASH] ERROR parsing: ${error instanceof Error ? error.message : String(error)}`,
            );
          }
        } else {
          onSubmit(value);
          setValue("");
        }
      }
      return;
    }

    if (key.backspace || key.delete) {
      setValue((prev) => prev.slice(0, -1));
      return;
    }

    if (input && !key.ctrl && !key.meta) {
      setValue((prev) => prev + input);
    }
  });

  return (
    <Box width="100%">
      <Text color="blue" bold>
        {"> "}
      </Text>
      <Text>{value}</Text>
      {!disabled && <Text color="gray">▌</Text>}
    </Box>
  );
}
