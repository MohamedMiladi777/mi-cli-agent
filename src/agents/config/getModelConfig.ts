import { openai } from "@ai-sdk/openai";
import { checkGemmaHealth } from "./checkGemmaHealth.ts";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModel, LanguageModelMiddleware } from "ai";

/**
 * getModelConfig is an async function which gets a string (selectedModel)
 * and @returns model
 * @param selectedModel
 *
 */

export const getModelConfig = async (
  selectedModel: string,
): Promise<{ model: any }> => {
  if (selectedModel === "gpt-5-mini") {
    return {
      model: openai("gpt-5-mini"),
    
      // isLocal: false,
    };
  }

  console.error("Outside if");

  if (selectedModel === "gemma-4-26b-a4b") {
    // Local: Use LM Studio
    // const response = await checkGemmaHealth();
    // console.error("Gemma health Response:", response);

    try {
      const lmstudio = createOpenAICompatible({
        name: "lmstudio",
        baseURL: "http://localhost:8081/v1",
      });
      return {
        // defaults to installed model when we use "".
        model: lmstudio(""),
        
        // isLocal: true
      };
    } catch (error) {
      throw new Error("Couldn't start Gemma, check if the server is running");
    }

  }

  throw new Error(`Unknown model: ${selectedModel}`);
};
