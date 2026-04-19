import { renderMermaidASCII } from "beautiful-mermaid";

// Define the diagram code first
const diagramCode = `graph TD
  A["Start"] --> B["Process"]
  B --> C["End"]`;

// Then use it
const ascii = renderMermaidASCII(diagramCode, {
  useAscii: true,        // Use ASCII chars (+,-,|) instead of Unicode
  paddingX: 5,           // Horizontal spacing
  paddingY: 5,           // Vertical spacing
  colorMode: "ansi256",  // Color output: 'none', 'ansi16', 'ansi256', 'truecolor', or 'auto'
});

console.log(ascii);