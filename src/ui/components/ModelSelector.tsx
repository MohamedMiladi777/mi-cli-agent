import type { ModelName } from "../../core/types.ts";
import { Box, Text } from "ink";
interface ModelSelectorProps {
    model : ModelName
}


export const ModelSelector = ({model} : ModelSelectorProps) => {

     return( 
  <Box alignSelf="flex-start" paddingTop={1}>
    <Text dimColor color={"grey"}> Current Model : {model}</Text>
  </Box>
  );



}