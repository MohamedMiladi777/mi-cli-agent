// import { ToolLoopAgent } from "ai";
// import type { ModelName } from "../../core/types.ts";
// import { memoryTool } from "../tools/memoryTool.ts";

// const today = new Date().toISOString().slice(0, 10);

// /**
//  *
//  */
// const memoryAgent = new ToolLoopAgent({
//   model: "gpt-5-mini",
//   tools: { memory: memoryTool },
//   prepareCall: async (settings) => {
//     const coreMemory = await readCoreMemory();
//     return {
//       ...settings,
//       instructions: `Today's date is ${today}.

// Core memory:
// ${coreMemory}

// You can save and recall important information using the memory tool.`,
//     };
//   },
// });
