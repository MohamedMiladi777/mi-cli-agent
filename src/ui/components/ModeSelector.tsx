import { Box, Text, render } from "ink";
import type { AgentMode } from "../../types.ts";


// Create an interface to pass props to ModeSelector

interface ModeSelectorProps{

  mode: AgentMode;

}
export function ModeSelector({mode}: ModeSelectorProps) {

  return( 
  <Box alignSelf="flex-start" paddingTop={1}>
    <Text dimColor color={"grey"}> Current Mode : {mode}</Text>
  </Box>
  );

}
