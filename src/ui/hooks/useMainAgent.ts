import { mainAgent } from "../../agents/run.ts";
import { useCallback, useState } from "react";
import { useApp } from "ink";
import type { Message } from "../components/MessageList.tsx";
import type { ModelMessage } from "ai";
import type {
  ToolApprovalRequest,
  TokenUsageInfo,
  ModelName,
} from "../../core/types.ts";
import { debugLog } from "../../utils/debugger.ts";
import { type ToolCallProps } from "../components/ToolCall.tsx";

interface ActiveToolCall extends ToolCallProps {
  id: string;
}

export const useMainAgent = () => {
  const [activeToolCalls, setActiveToolCalls] = useState<ActiveToolCall[]>([]);
  const { exit } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [conversationHistory, setConversationHistory] = useState<
    ModelMessage[]
  >([]);

  const [pendingApproval, setPendingApproval] =
    useState<ToolApprovalRequest | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsageInfo | null>(null);
  const [model, setModel] = useState<ModelName>("gpt-5-mini");

  // const handleSubmit = useCallback(

  const resolveToolApproval = useCallback(
    (approved: boolean) => {
      if (!pendingApproval) return;
      pendingApproval.resolve(approved);
      setPendingApproval(null);
    },
    [pendingApproval],
  );

  const handleSubmit = useCallback(
    async (userInput: string) => {
      if (
        userInput.toLowerCase() === "exit" ||
        userInput.toLowerCase() === "quit"
      ) {
        exit();
        return;
      }

      setMessages((prev) => [...prev, { role: "user", content: userInput }]);
      setIsLoading(true);
      setStreamingText("");
      setActiveToolCalls([]);

      try {
        const newHistory = await mainAgent(
          userInput,
          conversationHistory,
          {
            onToken: (token) => {
              setStreamingText((prev) => prev + token);
            },
            onToolCallStart: (name, args) => {
              setActiveToolCalls((prev) => [
                ...prev,
                {
                  id: `${name}-${Date.now()}`,
                  name,
                  args,
                  status: "pending",
                },
              ]);
            },
            onToolCallEnd: (name, result) => {
              setActiveToolCalls((prev) =>
                prev.map((tc) =>
                  tc.name === name && tc.status === "pending"
                    ? { ...tc, status: "complete", result }
                    : tc,
                ),
              );
            },
            onComplete: (response) => {
              if (response) {
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", content: response },
                ]);
              }
              setStreamingText("");
              setActiveToolCalls([]);
            },
            onToolApproval: (name, args) => {
              return new Promise<boolean>((resolve) => {
                setPendingApproval({ toolName: name, args, resolve });
              });
            },
            onTokenUsage: (usage) => {
              setTokenUsage(usage);
            },
          },
          model,
        );

        setConversationHistory(newHistory);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        const err = error as Error & { cause?: unknown };
        debugLog(
          `[App] runAgent failed: name=${err.name}, message=${err.message}`,
        );
        if (err.cause) {
          debugLog(`[App] runAgent failed cause: ${String(err.cause)}`);
        }
        debugLog(`[App] runAgent failed stack: ${err.stack ?? "no stack"}`);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${errorMessage}` },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationHistory, exit, model],
  );

  return {
    handleSubmit,
    messages,
    isLoading,
    streamingText,
    activeToolCalls,
    pendingApproval,
    resolveToolApproval,
    tokenUsage,
    model,
    setModel,
  };
};
