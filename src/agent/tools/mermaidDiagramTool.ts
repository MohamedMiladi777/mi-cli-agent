import { tool } from "ai";
import { z } from "zod";
import { renderMermaidASCII, renderMermaidSVG } from "beautiful-mermaid";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/**
 * Generate filename with timestamp
 */
function generateFilename(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
  return `diagram-${timestamp}.svg`;
}
// const execAsync = promisify(exec);

//Hardcoded for now, todo : remove the hardcoded path
const obsidianPath =
  "/home/miladi/Dropbox/DropsyncFiles/Obsidian Vault/diagrams";

export const mermaidDiagramTool = tool({
  description:
    "Generate diagrams using Mermaid syntax. Supports flowcharts, sequence diagrams, state diagrams, Gantt charts, and more. Returns the path to the generated SVG file.",
  inputSchema: z.object({
    diagramCode: z
      .string()
      .describe(
        "Valid Mermaid diagram syntax (e.g., 'graph TD; A-->B; B-->C')",
      ),
    colorMode: z
      .enum(["none", "ansi16", "ansi256", "truecolor"])
      .optional()
      .default("ansi16")
      .describe("Color Output Mode"),
  }),

  execute: async ({ diagramCode, colorMode }) => {
    try {
      // Sanitize diagram code: remove trailing semicolons from first line
      const cleanCode = diagramCode
        .split("\n")
        .map((line, i) => (i === 0 ? line.replace(/;$/, "") : line))
        .join("\n");

      const ascii = renderMermaidASCII(cleanCode, {
        useAscii: false,
        colorMode,
        paddingX: 3,
        paddingY: 2,
      });

      const svg = renderMermaidSVG(cleanCode, {
        padding: 40, // Overall canvas padding
        nodeSpacing: 24, // Horizontal spacing between nodes
        layerSpacing: 40, // Vertical spacing between layers
        transparent: true,
      });

      await mkdir(obsidianPath, { recursive: true });
      const diagramName = generateFilename();
      const svgPath = join(obsidianPath, `${diagramName}.svg`);
      await writeFile(svgPath, svg, "utf-8");

      return `Diagram:\n\n${ascii}\n\n📁 SVG saved to: ${svgPath}`;
    } catch (error) {
      return `Error: ${(error as Error).message}`;
    }
  },
});

/**
 * Mermaid Diagram Generator Tool
 */
