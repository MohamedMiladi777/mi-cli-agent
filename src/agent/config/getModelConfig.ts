 import { createOpenAI, openai } from "@ai-sdk/openai";

 export const getModelConfig = (selectedModel: string) => {
      if (selectedModel === "gpt-5-mini") {
        return {
          model: openai("gpt-5-mini"),
          // isLocal: false,
        };
      }  if (selectedModel === "gemma-4-26b-a4b") {
    // Local: Use LM Studio
    const localOpenai = createOpenAI({
      baseURL: "http://localhost:1234/v1",
      apiKey: "lmstudio"
    })

    return {
      model:localOpenai("google/gemma-4-26b-a4b"),
      // isLocal: true
    }
  }

  throw new Error(`Unknown model: ${selectedModel}`);

}