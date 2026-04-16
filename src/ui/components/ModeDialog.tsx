import type React from "react";
import { Box, Text, useInput } from "ink";
import { useCallback, useMemo, useState } from "react";
import type { AgentMode } from "../../core/types.ts";
import { debugLog } from "../../utils/debugger.ts";
//import { DescriptiveRadioButtonSelect } from "/home/miladi/repos/gemini-cli/packages/cli/src/ui/components/shared/DescriptiveRadioButtonSelect.tsx";

interface ModeDialogProps {
  onClose: () => void;
  onSelect: (Mode: AgentMode) => void;
  currentMode: AgentMode;
}

export const ModeDialog = ({
  onClose,
  onSelect,
  currentMode,
}: ModeDialogProps): React.JSX.Element => {
  const manualOptions = useMemo(() => {
    return [
      {
        value: "Default" as AgentMode,
        title: "Default",
        description: "the default agent mode",
        key: "Default",
      },
      {
        value: "Student Mode" as AgentMode,
        title: "Student Mode",
        description: "Student Mode which helps in solving problems",
        key: "Student Mode",
      },
      {
        value: "Dev Mode" as AgentMode,
        title: "Dev Mode",
        description: "Dev Mode which works iteratively with the web developer",
        key: "Dev Mode",
      },
    ];
  }, []);

  const handleSelect = useCallback(
    (Mode: AgentMode) => {
      onSelect(Mode);
      onClose();
    },
    [onSelect, onClose],
  );

  const initialIndex = useMemo(() => {
    const idx = manualOptions.findIndex((o) => o.value === currentMode);
    return idx >= 0 ? idx : 0;
  }, [currentMode, manualOptions]);

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useInput((input, key) => {
    if (key.upArrow) {
      debugLog(`[DIALOG] Up arrow pressed`);
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : manualOptions.length - 1,
      );
      return;
    }

    if (key.downArrow) {
      debugLog(`[DIALOG] Down arrow pressed`);
      setSelectedIndex((prev) =>
        prev < manualOptions.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (key.return) {
      debugLog(`[DIALOG] Return key pressed`);
      handleSelect(manualOptions[selectedIndex].value as AgentMode);
      return;
    }

    if (key.escape) {
      debugLog(
        `[DIALOG] Enter pressed, selecting: ${manualOptions[selectedIndex].value}`,
      );

      onClose();
      return;
    }
  });

  return (
    <>
      <Box
        borderStyle="round"
        //   borderColor={theme.border.default}
        borderColor={"grey"}
        flexDirection="column"
        padding={1}
        width="100%"
      >
        <Text bold>Select Mode</Text>

        <Box marginTop={1} flexDirection="column">
          {/* <DescriptiveRadioButtonSelect
          items={manualOptions}
          onSelect={handleSelect}
          initialIndex={initialIndex}
          showNumbers={true}
        /> */}

          {manualOptions.map((option, index) => (
            <Box key={option.value}>
              <Text
                color={index === selectedIndex ? "yellow" : "white"}
                bold={index === selectedIndex}
              >
                {index === selectedIndex ? "❯ " : "  "}
                {option.title}
              </Text>
            </Box>
          ))}
        </Box>
        <Box marginTop={1} flexDirection="column">
          <Box>
            {/* <Text bold color={theme.text.primary}>
            Remember Mode for future sessions:{' '}
          </Text> */}
            {/* <Text color={theme.status.success}>
            {persistMode ? 'true' : 'false'}
          </Text> */}
            {/* <Text color={theme.text.secondary}> (Press Tab to toggle)</Text> */}
          </Box>
        </Box>
        <Box flexDirection="column">
          {/* <Text color={theme.text.secondary}> */}
          <Text color={"red"}>{"> To use a specific Mode use ctrl + p"}</Text>
        </Box>
        {/* <ModeQuotaDisplay
        buckets={config?.getLastRetrievedQuota()?.buckets}
        availableWidth={terminalWidth - 2}
      /> */}
        <Box marginTop={1} flexDirection="column">
          {/* <Text color={theme.text.secondary}>(Press Esc to close)</Text> */}
          <Text color={"grey"}>(Press Esc to close)</Text>
        </Box>
      </Box>
    </>
  );
};
