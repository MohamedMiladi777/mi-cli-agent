import type React from "react";
import { Box, Text, useInput } from "ink";
import { useCallback, useMemo, useState } from "react";
import type { ModelName } from "../../core/types.ts";
import { debugLog } from "../../utils/debugger.ts";
//import { DescriptiveRadioButtonSelect } from "/home/miladi/repos/gemini-cli/packages/cli/src/ui/components/shared/DescriptiveRadioButtonSelect.tsx";

interface ModelDialogProps {
  onClose: () => void;
  onSelect: (model: ModelName) => void;
  currentModel: ModelName;
}

export const ModelDialog = ({
  onClose,
  onSelect,
  currentModel,
}: ModelDialogProps): React.JSX.Element => {
  const manualOptions = useMemo(() => {
    return [
      {
        value: "gpt-5-mini" as ModelName,
        title: "gpt mini 5",
        description: "Cloud Model",
        key: "gpt-5-mini",
      },
      {
        value: "gemma-4-26b-a4b" as ModelName,
        title: "gemma 4 26b a4b",
        description: "Local Model",
        key: "gemma-4-26b-a4b",
      },
    ];
  }, []);

  const handleSelect = useCallback(
    (model: ModelName) => {
      onSelect(model);
      onClose();
    },
    [onSelect, onClose],
  );

  const initialIndex = useMemo(() => {
    const idx = manualOptions.findIndex((o) => o.value === currentModel);
    return idx >= 0 ? idx : 0;
  }, [currentModel, manualOptions]);

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
      handleSelect(manualOptions[selectedIndex].value as ModelName);
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
  // Keyboard input handler
  /*useInput((input, key) => {
    // Arrow up
    if (key.upArrow) {
      debugLog(`[DIALOG] Up arrow pressed`);
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : manualOptions.length - 1));
      return;
    }

    // Arrow down
    if (key.downArrow) {
      debugLog(`[DIALOG] Down arrow pressed`);
      setSelectedIndex((prev) => (prev < manualOptions.length - 1 ? prev + 1 : 0));
      return;
    }

    // Enter to select
    if (key.return) {
      debugLog(`[DIALOG] Enter pressed, selecting: ${manualOptions[selectedIndex].value}`);
      handleSelect(manualOptions[selectedIndex].value as ModelName);
      return;
    }

    // Escape to close
    if (key.escape) {
      debugLog(`[DIALOG] Escape pressed, closing dialog`);
      onClose();
      return;
    }
  });*/

  return (
    <>
      {/* <Box flexDirection="column" borderColor="red">
        <Text bold color="yellow">
          🟡 MODEL DIALOG OPEN 🟡
        </Text>
      </Box> */}

      <Box
        borderStyle="round"
        //   borderColor={theme.border.default}
        borderColor={"grey"}
        flexDirection="column"
        padding={1}
        width="100%"
      >
        <Text bold>Select Model</Text>

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
            Remember model for future sessions:{' '}
          </Text> */}
            {/* <Text color={theme.status.success}>
            {persistMode ? 'true' : 'false'}
          </Text> */}
            {/* <Text color={theme.text.secondary}> (Press Tab to toggle)</Text> */}
          </Box>
        </Box>
        <Box flexDirection="column">
          {/* <Text color={theme.text.secondary}> */}
          <Text color={"red"}>{"> To use a specific model use ctrl + p"}</Text>
        </Box>
        {/* <ModelQuotaDisplay
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
