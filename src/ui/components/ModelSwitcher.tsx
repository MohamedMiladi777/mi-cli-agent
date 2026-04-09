import { Box, Text } from "ink";
import type { ModelName } from "../../types.ts";

interface ModelSwitcherProps{
    model: ModelName
}

export function ModelSwitcher({model}: ModelSwitcherProps){

    return(
        <Box alignSelf="flex-start" paddingTop={1}>
            <Text dimColor color={"grey"}>
                {model}
            </Text>
        </Box>
    )

}