import { readFile, writeFile, listFiles, deleteFile } from "./file.ts";
import { runCommand } from "./shell.ts";
import { executeCode } from "./codeExecution.ts";
import { webSearch } from "./webSearch.ts";
import { mermaidDiagramTool } from "./mermaidDiagramTool.ts";
import { memoryTool } from "./memoryTool.ts";

// All tools combined for the agent
export const tools = {
  readFile,
  writeFile,
  listFiles,
  deleteFile,
  runCommand,
  executeCode,
  webSearch,
  mermaidDiagramTool,
  memoryTool,
};

// Export individual tools for selective use in evals
export { readFile, writeFile, listFiles, deleteFile } from "./file.ts";
export { runCommand } from "./shell.ts";
export { executeCode } from "./codeExecution.ts";
export { webSearch } from "./webSearch.ts";
export { mermaidDiagramTool } from "./mermaidDiagramTool.ts";
export { memoryTool } from "./memoryTool.ts";

// Tool sets for evals
export const fileTools = {
  readFile,
  writeFile,
  listFiles,
  deleteFile,
};

export const shellTools = {
  runCommand,
};

export const diagramTools = {
  mermaidDiagramTool,
};

export const agentTools = {
  memoryTool,
};
