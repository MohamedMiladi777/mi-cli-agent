import React, { useState, useEffect } from "react";
import { Box, Text, useInput, useStdout } from "ink";
import { MessageList } from "./components/MessageList.tsx";
import { ToolCall } from "./components/ToolCall.tsx";
import { Spinner } from "./components/Spinner.tsx";
import { Input } from "./components/Input.tsx";
import { ModeSelector } from "./components/ModeSelector.tsx";
import { ModelSelector } from "./components/ModelSelector.tsx";
import { ToolApproval } from "./components/ToolApproval.tsx";
import { TokenUsage } from "./components/TokenUsage.tsx";
import type { AgentMode } from "../core/types.ts";
import { useWindowSize } from "ink";
import { useRef } from "react";
import { ScrollView, type ScrollViewRef } from "ink-scroll-view";
import { Header } from "./components/Header.tsx";
import { ModelDialog } from "./components/ModelDialog.tsx";
import { useModeCommand } from "./hooks/useModeCommand.ts";
import { useModelCommand } from "./hooks/useModelCommand.ts";
import { ModeDialog } from "./components/ModeDialog.tsx";
import { useMainAgent } from "./hooks/useMainAgent.ts";

export function App() {
  //const { exit } = useApp();
  const { rows, columns } = useWindowSize();
  const [mode, setMode] = useState<AgentMode>("default");

  //ref for the scorll view behaviour
  const scrollRef = useRef<ScrollViewRef>(null);
  const { stdout } = useStdout();
  const {
    handleSubmit,
    messages,
    isLoading,
    streamingText,
    activeToolCalls,
    pendingApproval,
    tokenUsage,
    model,
    resolveToolApproval,
    setModel,
  } = useMainAgent();

  // Create actions to use for commands
  const { isModelDialogOpen, openModelDialog, closeModelDialog } =
    useModelCommand();
  const { isModeDialogOpen, openModeDialog, closeModeDialog } =
    useModeCommand();

  const handleActions = {
    openModelDialog: openModelDialog,
    openModeDialog: openModeDialog,
  };

  // 1. Handle Terminal Resizing due to manual window change

  useEffect(() => {
    if (stdout.isTTY) console.log("This is a terminal");
    const handleResize = () => scrollRef.current?.remeasure();
    stdout?.on("resize", handleResize);
    return () => {
      stdout?.off("resize", handleResize);
    };
  }, [stdout]);

  // Auto scroll functionality

  useEffect(() => {
    scrollRef?.current?.remeasure();
    scrollRef?.current?.scrollToBottom();
  }, [messages, streamingText, activeToolCalls, pendingApproval]);

  useInput((input, key) => {
    if (key.upArrow) scrollRef?.current?.scrollBy(1);
    if (key.downArrow) scrollRef?.current?.scrollBy(-1);
  });

  return (
    //this is the etire shell
    <>
      <Box
        flexDirection="column"
        padding={1}
        flexGrow={1}
        minHeight={0}
        height={rows}
        width={columns}
      >
        {/* // This is the content above the footer */}

        {/* //changed code */}

        <Box flexDirection="column" flexGrow={1} minHeight={0}>
          {!streamingText && messages.length === 0 && <Header />}
          <ScrollView ref={scrollRef}>
            {streamingText && (
              <Box flexDirection="column" marginTop={1}>
                <Text color="green" bold>
                  › assistant
                </Text>
                <Box marginLeft={2} paddingBottom={6}>
                  <Text> {streamingText} </Text>
                  <Text color="gray">▌</Text>
                </Box>
              </Box>
            )}
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
                  //pendingApproval.resolve(approved);
                  // setPendingApproval(null);
                  resolveToolApproval(approved);
                }}
              />
            )}
          </ScrollView>
        </Box>

        {/* Ducky wrapper */}

        <Box flexDirection="column" flexShrink={0}>
          {/* Creates a gap between Ducky and panel */}

          <Box height={1} />

          {!pendingApproval && (
            // Prompt panel

            <Box flexDirection="column" alignItems="center" width="100%">
              <Box
                paddingX={2}
                paddingY={1}
                alignItems="center"
                flexDirection="column"
                backgroundColor="FFFFFF"
                width="100%"
              >
                <Input
                  onSubmit={handleSubmit}
                  disabled={isLoading}
                  actions={handleActions}
                />
                {<ModeSelector mode={mode} />}
                {<ModelSelector model={model} />}
                {isModeDialogOpen && (
                  <ModeDialog
                    onClose={closeModeDialog}
                    onSelect={setMode}
                    currentMode={mode}
                  />
                )}
                {/* { <ModelSwitcher model={model} handleSelect={setModel} /> } */}
                {isModelDialogOpen && (
                  <ModelDialog
                    onClose={closeModelDialog}
                    onSelect={setModel}
                    currentModel={model}
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>

        <TokenUsage usage={tokenUsage} />
      </Box>
    </>
  );
}
