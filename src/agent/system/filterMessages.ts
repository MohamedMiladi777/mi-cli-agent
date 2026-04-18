import type { ModelMessage } from "ai";
/**
 * Filter conversation history to only include compatible message formats.
 * Provider tools (like webSearch) may return messages with formats that
 * cause issues when passed back to subsequent API calls.
 */

const hasTextPart = (part: unknown): boolean => {
  if (typeof part === "string") {
    return part.trim().length > 0;
  }

  if (typeof part === "object" && part !== null && "text" in part) {
    const textPart = part as { text?: unknown };
    return typeof textPart.text === "string" && textPart.text.trim().length > 0;
  }

  return false;
};

const hasToolPart = (part: unknown): boolean => {
  if (typeof part !== "object" || part === null) {
    return false;
  }

  const toolPart = part as Record<string, unknown>;

  if (typeof toolPart.type === "string" && toolPart.type.includes("tool")) {
    return true;
  }

  return (
    typeof toolPart.toolCallId === "string" ||
    typeof toolPart.toolName === "string"
  );
};

export const filterCompatibleMessages = (
  messages: ModelMessage[],
): ModelMessage[] => {
  return messages.filter((msg) => {
    // Keep user and system messages
    if (msg.role === "user" || msg.role === "system") {
      return true;
    }

    // Keep assistant messages that have text content
    if (msg.role === "assistant") {
      const content = msg.content;
      if (typeof content === "string" && content.trim()) {
        return true;
      }

      // Keep assistant messages that include either text or tool-call parts.
      if (Array.isArray(content)) {
        return content.some(
          (part: unknown) => hasTextPart(part) || hasToolPart(part),
        );
      }
    }

    // Keep tool messages
    if (msg.role === "tool") {
      return true;
    }

    return false;
  });
};
