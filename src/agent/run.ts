/*import { streamText, type ModelMessage } from "ai";
import { getTracer } from "@lmnr-ai/lmnr";
import { tools } from "./tools/index.ts";
import { executeTool } from "./executeTool.ts";
import { SYSTEM_PROMPT } from "./system/prompt.ts";
import { Laminar } from "@lmnr-ai/lmnr";
import type { AgentCallbacks, ToolCallInfo } from "../core/types.ts";
import type { LanguageModel } from "ai";
import {
  estimateMessagesTokens,
  getModelLimits,
  isOverThreshold,
  calculateUsagePercentage,
  compactConversation,
  DEFAULT_THRESHOLD,
} from "./context/index.ts";
import { filterCompatibleMessages } from "./system/filterMessages.ts";
import { addMessage, getMessages } from "./memory/db.ts";
import { getModelConfig } from "./config/getModelConfig.ts";
import { debugLog } from "../utils/debugger.ts";

Laminar.initialize({
  projectApiKey: process.env.LMNR_API_KEY,
});

export async function runAgent(
  userMessage: string,
  conversationHistory: ModelMessage[],
  callbacks: AgentCallbacks,
  selectedModel: string = "gemma-4-26b-a4b",
): Promise<ModelMessage[]> {
  console.log("[runAgent] Received selectedModel:", selectedModel);

  const modelLimits = getModelLimits(selectedModel);

  // Add the user Message first into the DB.
  await addMessage([{ role: "user", content: userMessage, tool_call_id: "1" }]);
  // Filter and check if we need to compact the conversation history before starting
  let workingHistory = filterCompatibleMessages(conversationHistory);
  const preCheckTokens = estimateMessagesTokens([
    { role: "system", content: SYSTEM_PROMPT },
    ...workingHistory,
    { role: "user", content: userMessage },
  ]);

  if (isOverThreshold(preCheckTokens.total, modelLimits.contextWindow)) {
    // Compact the conversation
    workingHistory = await compactConversation(workingHistory, selectedModel);
  }

  const messages: ModelMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...workingHistory,
    { role: "user", content: userMessage },
  ];

  let fullResponse = "";

  // Report initial token usage
  const reportTokenUsage = () => {
    if (callbacks.onTokenUsage) {
      const usage = estimateMessagesTokens(messages);
      callbacks.onTokenUsage({
        inputTokens: usage.input,
        outputTokens: usage.output,
        totalTokens: usage.total,
        contextWindow: modelLimits.contextWindow,
        threshold: DEFAULT_THRESHOLD,
        percentage: calculateUsagePercentage(
          usage.total,
          modelLimits.contextWindow,
        ),
      });
    }
  };

  reportTokenUsage();

  while (true) {
    //Load the DB first
    //const history = await getMessages();
    //console.log("history :", history);
    //Fetch for previous data in lanceDB
    //let filtetedHistory = filterCompatibleMessages(history);

    // const response = await llm.chat(history)

    const config = await getModelConfig(selectedModel);
    debugLog(`Config created:, config.model`);

    const result = streamText({
      // model: openai(selectedModel),
      model: config.model as LanguageModel,
      messages,
      tools,
      experimental_telemetry: {
        isEnabled: true,
        tracer: getTracer(),
      },
    });

    debugLog("Stream text called");
    debugLog(`result object ${typeof result}`);

    // Add the AI response back to the DB.
    //const responseText = await result.text;
    // debugLog(`Got response text:, ${(responseText.length, "chars")})`);

    //await addMessage([{ role: "assistant", content: responseText }]);

    const toolCalls: ToolCallInfo[] = [];
    let currentText = "";
    let streamError: Error | null = null;

    try {
      for await (const chunk of result.fullStream) {
        if (chunk.type === "text-delta") {
          currentText += chunk.text;
          callbacks.onToken(chunk.text);
        }

        if (chunk.type === "tool-call") {
          const input = "input" in chunk ? chunk.input : {};
          toolCalls.push({
            toolCallId: chunk.toolCallId,
            toolName: chunk.toolName,
            args: input as Record<string, unknown>,
          });
          callbacks.onToolCallStart(chunk.toolName, input);
        }
      }
    } catch (error) {
      streamError = error as Error;
      // If we have some text, continue processing
      // Otherwise, rethrow if it's not a "no output" error
      if (
        !currentText &&
        !streamError.message.includes("No output generated")
      ) {
        throw streamError;
      }
    }

    fullResponse += currentText;

    // If stream errored with "no output" and we have no text, try to recover
    if (streamError && !currentText) {
      // Add a fallback response
      fullResponse =
        "I apologize, but I wasn't able to generate a response. Could you please try rephrasing your message?";
      callbacks.onToken(fullResponse);
      break;
    }

    const finishReason = await result.finishReason;

    // if (finishReason !== "tool-calls" || toolCalls.length === 0) {
    //   const responseMessages = await result.response;
    //   messages.push(...responseMessages.messages);
    //   reportTokenUsage();
    //   break;
    // }

    try {
      const responseMessages = await result.response;
      messages.push(...responseMessages.messages);
      
    } catch (error) {
      
    }

    // const responseMessages = await result.response;
    // messages.push(...responseMessages.messages);
    reportTokenUsage();

    for (const tc of toolCalls) {
      const result = await executeTool(tc.toolName, tc.args);
      callbacks.onToolCallEnd(tc.toolName, result);

      messages.push({
        role: "tool",
        content: [
          {
            type: "tool-result",
            toolCallId: tc.toolCallId,
            toolName: tc.toolName,
            output: { type: "text", value: result },
          },
        ],
      });
      reportTokenUsage();
    }
  }

  callbacks.onComplete(fullResponse);

  return messages;
}*/

import { NoOutputGeneratedError, stepCountIs, streamText, type ModelMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { getTracer } from "@lmnr-ai/lmnr";
import { tools } from "./tools/index.ts";
import { executeTool } from "./executeTool.ts";
import { SYSTEM_PROMPT } from "./system/prompt.ts";
import { Laminar } from "@lmnr-ai/lmnr";
import type { AgentCallbacks, ToolCallInfo } from "../core/types.ts";
import {
  estimateMessagesTokens,
  getModelLimits,
  isOverThreshold,
  calculateUsagePercentage,
  compactConversation,
  DEFAULT_THRESHOLD,
} from "./context/index.ts";
import { filterCompatibleMessages } from "./system/filterMessages.ts";
import { debugLog } from "../utils/debugger.ts";

Laminar.initialize({
  projectApiKey: process.env.LMNR_API_KEY,
});

//const MODEL_NAME = "gpt-5-mini";

export async function runAgent(
  userMessage: string,
  conversationHistory: ModelMessage[],
  callbacks: AgentCallbacks,
  selectedModel: string = "gemma-4-26b-a4b",
): Promise<ModelMessage[]> {
  const modelLimits = getModelLimits(selectedModel);
  const emitNoOutputFallback = () => {
    const fallback =
      "I apologize, but I wasn't able to generate a response. Could you please try rephrasing your message?";
    callbacks.onToken(fallback);
    return fallback;
  };

  // Filter and check if we need to compact the conversation history before starting
  let workingHistory = filterCompatibleMessages(conversationHistory);
  const preCheckTokens = estimateMessagesTokens([
    { role: "system", content: SYSTEM_PROMPT },
    ...workingHistory,
    { role: "user", content: userMessage },
  ]);

  if (isOverThreshold(preCheckTokens.total, modelLimits.contextWindow)) {
    // Compact the conversation
    workingHistory = await compactConversation(workingHistory, selectedModel);
  }

  const messages: ModelMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...workingHistory,
    { role: "user", content: userMessage },
  ];

  let fullResponse = "";

  // Report initial token usage
  const reportTokenUsage = () => {
    if (callbacks.onTokenUsage) {
      const usage = estimateMessagesTokens(messages);
      callbacks.onTokenUsage({
        inputTokens: usage.input,
        outputTokens: usage.output,
        totalTokens: usage.total,
        contextWindow: modelLimits.contextWindow,
        threshold: DEFAULT_THRESHOLD,
        percentage: calculateUsagePercentage(
          usage.total,
          modelLimits.contextWindow,
        ),
      });
    }
  };

  reportTokenUsage();

  while (true) {
    debugLog(
      `[runAgent] loop start: model=${selectedModel}, messages=${messages.length}, userMessageLength=${userMessage.length}`,
    );

    const result = streamText({
      model: openai(selectedModel),
      messages,
      tools,
      stopWhen:stepCountIs(3),
      experimental_telemetry: {
        isEnabled: true,
        tracer: getTracer(),
      },
    });

    const toolCalls: ToolCallInfo[] = [];
    let currentText = "";
    let streamError: Error | null = null;

    try {
      for await (const chunk of result.fullStream) {
        if (chunk.type === "text-delta") {
          currentText += chunk.text;
          callbacks.onToken(chunk.text);
        }

        if (chunk.type === "tool-call") {
          debugLog(
            `[runAgent] tool-call chunk: tool=${chunk.toolName}, toolCallId=${chunk.toolCallId}`,
          );
          const input = "input" in chunk ? chunk.input : {};
          toolCalls.push({
            toolCallId: chunk.toolCallId,
            toolName: chunk.toolName,
            args: input as Record<string, unknown>,
          });
          callbacks.onToolCallStart(chunk.toolName, input);
        }
      }
    } catch (error) {
      streamError = error as Error;
      debugLog(
        `[runAgent] stream error: name=${streamError.name}, message=${streamError.message}, isNoOutputGenerated=${NoOutputGeneratedError.isInstance(streamError)}`,
      );
      if (streamError.cause) {
        debugLog(`[runAgent] stream error cause: ${String(streamError.cause)}`);
      }
      // If we have some text, continue processing
      // Otherwise, rethrow if it's not a "no output" error
      if (!currentText && !NoOutputGeneratedError.isInstance(streamError)) {
        throw streamError;
      }
    }

    fullResponse += currentText;

    // If stream errored with "no output" and we have no text, try to recover
    if (streamError && !currentText) {
      fullResponse = emitNoOutputFallback();
      break;
    }
    debugLog("[runAgent] awaiting finishReason");
    let finishReason: Awaited<typeof result.finishReason>;
    try {
      finishReason = await result.finishReason;
    } catch (error) {
      const finishReasonError = error as Error;
      debugLog(
        `[runAgent] finishReason error: name=${finishReasonError.name}, message=${finishReasonError.message}, isNoOutputGenerated=${NoOutputGeneratedError.isInstance(finishReasonError)}`,
      );
      if (NoOutputGeneratedError.isInstance(finishReasonError)) {
        fullResponse = emitNoOutputFallback();
        break;
      }
      throw finishReasonError;
    }
    debugLog(
      `[runAgent] finishReason=${finishReason}, toolCalls=${toolCalls.length}, currentTextLength=${currentText.length}`,
    );

    if (finishReason !== "tool-calls" || toolCalls.length === 0) {
      debugLog("[runAgent] normal completion path, awaiting result.response");
      try {
        debugLog("[runAgent] awaiting responseMessages");

        const responseMessages = await result.response;
        debugLog(
          `[runAgent] result.response resolved with ${responseMessages.messages.length} messages`,
        );
        responseMessages.messages.forEach((message, index) => {
          debugLog(
            `[runAgent] responseMessages[${index}]: role=${message.role}, contentType=${Array.isArray(message.content) ? "array" : typeof message.content}`,
          );
        });
        messages.push(...responseMessages.messages);
        reportTokenUsage();
        break;
      } catch (error) {
        const responseError = error as Error;
        debugLog(
          `[runAgent] normal result.response error: name=${responseError.name}, message=${responseError.message}, isNoOutputGenerated=${NoOutputGeneratedError.isInstance(responseError)}`,
        );
        if (responseError.cause) {
          debugLog(
            `[runAgent] normal result.response error cause: ${String(responseError.cause)}`,
          );
        }
        if (NoOutputGeneratedError.isInstance(responseError) && !currentText) {
          fullResponse = emitNoOutputFallback();
          break;
        }
        throw responseError;
      }
    }

    debugLog("[runAgent] tool-call path, awaiting result.response");
    try {
      const responseMessages = await result.response;
      debugLog(
        `[runAgent] tool-call response resolved with ${responseMessages.messages.length} messages`,
      );
      responseMessages.messages.forEach((message, index) => {
        debugLog(
          `[runAgent] tool-call responseMessages[${index}]: role=${message.role}, contentType=${Array.isArray(message.content) ? "array" : typeof message.content}`,
        );
      });

      // Keep assistant tool-call messages, but avoid duplicating tool messages.
      const assistantMessages = responseMessages.messages.filter(
        (message) => message.role === "assistant",
      );
      messages.push(...assistantMessages);
      reportTokenUsage();
    } catch (error) {
      const responseError = error as Error;
      debugLog(
        `[runAgent] tool-call result.response error: name=${responseError.name}, message=${responseError.message}, isNoOutputGenerated=${NoOutputGeneratedError.isInstance(responseError)}`,
      );
      if (responseError.cause) {
        debugLog(
          `[runAgent] tool-call result.response error cause: ${String(responseError.cause)}`,
        );
      }
      if (NoOutputGeneratedError.isInstance(responseError) && !currentText) {
        fullResponse = emitNoOutputFallback();
        break;
      }
      throw responseError;
    }

    // Process tool calls sequentially with approval for each
    let rejected = false;
    for (const tc of toolCalls) {
      const approved = await callbacks.onToolApproval(tc.toolName, tc.args);

      if (!approved) {
        rejected = true;
        break;
      }

      const result = await executeTool(tc.toolName, tc.args);
      callbacks.onToolCallEnd(tc.toolName, result);

      messages.push({
        role: "tool",
        content: [
          {
            type: "tool-result",
            toolCallId: tc.toolCallId,
            toolName: tc.toolName,
            output: { type: "text", value: result },
          },
        ],
      });
      reportTokenUsage();
    }

    if (rejected) {
      break;
    }
  }

  callbacks.onComplete(fullResponse);

  return messages;
}
