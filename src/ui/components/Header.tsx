import { asciiLogo } from "../../assets/DuckyAsciiArt.ts";
import type React from "react";
import { Box, Text } from "ink";

interface HeaderProps {}


/**
 * 
 * @returns JSX that renders the logo at startup
 */
export function Header() {
  const logoHeight = 8;
  const title = asciiLogo;
  return (
    <Box  alignItems="center" flexDirection="column">
      <Text>{title}</Text>
    </Box>
  );
}
