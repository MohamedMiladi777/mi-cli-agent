import React, { useState, useCallback, useMemo } from "react";
import { Box, Text, useApp } from "ink";
import type { ModelMessage } from "ai";
import { runAgent } from "../agent/run.ts";
import { MessageList, type Message } from "./components/MessageList.tsx";
import { ToolCall, type ToolCallProps } from "./components/ToolCall.tsx";
import { Spinner } from "./components/Spinner.tsx";
import { Input } from "./components/Input.tsx";
import { ModeSelector } from "./components/ModeSelector.tsx";
import { ToolApproval } from "./components/ToolApproval.tsx";
import { TokenUsage } from "./components/TokenUsage.tsx";
import type { ToolApprovalRequest, TokenUsageInfo } from "../types.ts";
import type { AgentMode } from "../types.ts";
import {useWindowSize} from "ink"

interface ActiveToolCall extends ToolCallProps {
  id: string;
}

export function App() {
  const { exit } = useApp();
  const {rows, columns} = useWindowSize();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<
    ModelMessage[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [activeToolCalls, setActiveToolCalls] = useState<ActiveToolCall[]>([]);
  const [pendingApproval, setPendingApproval] =
    useState<ToolApprovalRequest | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsageInfo | null>(null);
  const [mode, setMode] = useState<AgentMode>("default");

  // Mode switch

  //const [mode , setMode] = useState<AgentMode>("default");

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
        const newHistory = await runAgent(userInput, conversationHistory, {
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
        });

        setConversationHistory(newHistory);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${errorMessage}` },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationHistory, exit],
  );

  return (
    //this is the etire shell
    <Box flexDirection="column" padding={1} height = {rows} width={columns}>
      {/* // This is the content above the footer */}
      <Box
        flexDirection="column"
        flexGrow={1}
        // justifyContent="center"
        // alignItems="center"
      >
        {/* This is a spacer */}
        <Box flexGrow={1} />

        {/* This is the home content */}
        <Box
          alignItems="center"
          flexDirection="column"
          width="100%"
        >
          {/* //changed code */}

           <Box flexDirection="column" marginBottom={1}>
            <MessageList messages={messages} />
             
            

                        {activeToolCalls.length > 0 && !pendingApproval && (
              <Box flexDirection="column" marginTop={1}>
                {activeToolCalls.map((tc) => (
                  <ToolCall
                    key={tc.id}
                    name={tc.name}
                    args={tc.args}
                    status={tc.status}
                    result={tc.result}
                  />
                ))}
              </Box>
            )}

            {isLoading &&
              !streamingText &&
              activeToolCalls.length === 0 &&
              !pendingApproval && (
                <Box marginTop={1}>
                  <Spinner />
                </Box>
              )}

            {pendingApproval && (
              <ToolApproval
                toolName={pendingApproval.toolName}
                args={pendingApproval.args}
                onResolve={(approved) => {
                  pendingApproval.resolve(approved);
                  setPendingApproval(null);
                }}
              />
            )}
          </Box> 

          {/* Ducky wrapper */}

          <Box alignItems="center" flexDirection="column" width="100%">
            <Box flexDirection="column" alignItems="center">
              <Text bold color="White">
                DUCKY
              </Text>
            </Box>

            {/* Creates a gap between Ducky and panel */}

            <Box height={1} />

            {!pendingApproval && (
              // Prompt panel

              <Box width={100} paddingX={4} paddingY={2} backgroundColor="grey">
                <Box flexDirection="column" alignItems="center">
                  <Box
                    width={90}
                    paddingX={2}
                    paddingY={1}
                    alignItems="center"
                    flexDirection="column"
                    backgroundColor={"black"}
                  >
                   
		
		 
		  <Input onSubmit={handleSubmit} disabled={isLoading} />
                    <ModeSelector mode={mode} />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
           {streamingText && (
              <Box flexDirection="column" marginTop={1}>
                <Text color="green" bold>
                  › assistant
                </Text>
                <Box marginLeft={2}>
                  <Text>{streamingText}</Text>
                  <Text color="gray">▌</Text>
                </Box>
              </Box>
            )}
        </Box>
        <Box flexGrow={1} />
      </Box>
      <TokenUsage usage={tokenUsage} />
  
 


      </Box>
      
  );
}
