import OpenAI from "openai";

export interface AgentCallbacks {
  onToken: (token: string) => void;
  onToolCallStart: (name: string, args: unknown) => void;
  onToolCallEnd: (name: string, result: string) => void;
  onComplete: (response: string) => void;
  onToolApproval: (name: string, args: unknown) => Promise<boolean>;
  onTokenUsage?: (usage: TokenUsageInfo) => void;
}

export interface ToolApprovalRequest {
  toolName: string;
  args: unknown;
  resolve: (approved: boolean) => void;
}

export interface ToolCallInfo {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
}

export interface ModelLimits {
  inputLimit: number;
  outputLimit: number;
  contextWindow: number;
}

export interface TokenUsageInfo {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  contextWindow: number;
  threshold: number;
  percentage: number;
}

// Create an AI type message to keep track of the db.
// The openai call is an assitant type from the official openai sdk.
export type AIMessage =
  | OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam
  | { role: "user"; content: string; tool_call_id: string }
  | { role: "tool"; content: string; tool_call_id: string };

// Define agent modes, the user can swtich between three modes: normal, dev and student

export type AgentMode = "default" | "dev" | "student";
