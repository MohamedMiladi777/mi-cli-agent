import { Box, Text } from "ink";
import type { ModelName } from "../../types.ts";
import SelectInput from "ink-select-input";
import type { Mode } from "fs";

interface ModelSwitcherProps {
  model: ModelName;
  handleSelect: (model: ModelName) => void;
}

const models = [
  { label: "gpt-5-mini", value: "gpt-5-mini" },
  { label: "gemma-4-26b-a4b", value: "gemma-4-26b-a4b" },
];
export function ModelSwitcher({ model, handleSelect }: ModelSwitcherProps) {
  return (
    <Box alignSelf="flex-start" paddingTop={1}>
      {/* <Text dimColor color={"grey"}> */}
      <SelectInput
        items={models}
        onSelect={(item) => handleSelect(item.value as ModelName)}
      />
      {/* </Text> */}
    </Box>
  );
}
