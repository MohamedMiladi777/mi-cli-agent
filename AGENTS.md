<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Repository Guide for Agents

## Project Summary

- TypeScript CLI agent app using Ink/React for the terminal UI.
- Main source lives in `src/`.
- Evaluation harnesses live in `evals/` and use Laminar (`@lmnr-ai/lmnr`).
- The current system prompt intentionally positions the assistant as a strict pair programmer in `src/agent/system/prompt.ts`.

## Top-Level Layout

- `src/cli.ts` — bin entrypoint with shebang.
- `src/index.ts` — renders the Ink app.
- `src/ui/` — terminal UI components.
- `src/agent/run.ts` — main agent loop, model calls, tool execution, token reporting, memory loading.
- `src/agent/tools/` — local tool definitions:
  - `file.ts` for read/write/list/delete
  - `shell.ts` for shell execution via `shelljs`
  - `codeExecution.ts` for temp-file execution of JS/Python/TS
  - `webSearch.ts` for provider-native OpenAI web search
- `src/agent/context/` — token estimation, context limits, compaction.
- `src/agent/memory/db.ts` — LanceDB-backed conversation persistence.
- `src/agent/system/` — system prompt and message filtering.
- `evals/` — eval entrypoints, mock tools, datasets, evaluators, executors.

## Commands Observed

Commands are taken from `package.json` only.

- `npm run build` — build `src/` into `dist/` using `tsc -p tsconfig.build.json`
- `npm run dev` — watch mode with `tsx watch --env-file=.env src/index.ts`
- `npm run start` — run the app once with `tsx --env-file=.env src/index.ts`
- `npm run eval` — run all Laminar evals via `npx lmnr eval`
- `npm run eval:file-tools` — run `evals/file-tools.eval.ts`
- `npm run eval:shell-tools` — run `evals/shell-tools.eval.ts`
- `npm run eval:agent` — run `evals/agent-multiturn.eval.ts`

## Build / Tooling Notes

- TypeScript is in strict mode in `tsconfig.json` and `tsconfig.build.json`.
- Source imports consistently include explicit `.ts` / `.tsx` extensions.
- Build output goes to `dist/`; evals are excluded from the build config.
- Biome is configured in `biome.json`, but no lint/format script is defined in `package.json`.
- Biome formatting is configured for tabs and double quotes, but the repository currently contains mixed formatting styles. Match the surrounding file instead of mass-reformatting unrelated code.

## Runtime / Environment Gotchas

- `src/agent/run.ts` initializes Laminar with `process.env.LMNR_API_KEY`; evals also reference the same env var.
- `src/agent/tools/webSearch.ts` uses `openai.tools.webSearch({})`, so web search is provider-executed rather than implemented locally.
- `src/agent/memory/db.ts` uses a hardcoded LanceDB path: `/home/miladi/repos/agents-v2`. Treat this as a local-machine assumption already present in the repo.
- `README.md` says to run `mi` after building, but `package.json` exposes the CLI bin as `agi`. Verify desired CLI naming before changing docs or packaging.

## Code Patterns To Follow

### General

- Prefer ESM-style imports with explicit file extensions.
- Use `type` imports where appropriate; the codebase already does this in many files.
- Zod schemas are used to define tool inputs.
- Tool modules export both full tool objects and grouped subsets for eval usage.

### Agent Loop

- `src/agent/run.ts` orchestrates:
  1. saving user messages,
  2. filtering/compacting history,
  3. streaming model output,
  4. collecting tool calls,
  5. executing local tools,
  6. pushing tool results back into the message list.
- Context handling utilities are centralized under `src/agent/context/index.ts`.
- Message compatibility filtering is handled in `src/agent/system/filterMessages.ts` before reuse in model calls.

### Tools

- Local tools are defined with `tool({...})` from the `ai` SDK.
- Local executors return human-readable strings, including error strings, rather than throwing structured errors.
- `executeTool` in `src/agent/executeTool.ts` special-cases provider tools by checking for a missing `execute` function.

### UI

- The UI is an Ink React tree rooted at `src/ui/App.tsx`.
- User interaction is handled through callbacks passed into `runAgent`.
- Tool approval support exists in the UI state and components (`ToolApproval`, `ToolCall`, `TokenUsage`).

## Testing / Evaluation Approach

- This repo uses evals more prominently than unit tests.
- `evals/agent-multiturn.eval.ts` exercises multi-turn agent behavior with mocked tools.
- `evals/file-tools.eval.ts` and `evals/shell-tools.eval.ts` target tool selection/behavior for those tool groups.
- `evals/executors.ts` builds mocked-tool executions using the same system prompt as the app.
- No CI workflows were found under `.github/workflows/`.

## Existing Rule / Memory Context

- Preserve the OpenSpec managed block at the top of this file.
- `CLAUDE.md` contains course-development instructions that are very specific:
  - work backward from the finished app into lesson branches,
  - when preparing lessons, only add removed code to notes,
  - do not inspect unrelated repo code for that lesson workflow.
- If a task is about proposals, specs, or planning, open `openspec/AGENTS.md` first per the managed block above.

## Non-Obvious Observations

- The repository appears to be an in-progress learning project; some files contain debug logging, unused imports, and style inconsistencies. Make surgical changes and avoid unrelated cleanup unless asked.
- `src/index.ts` and `src/cli.ts` both render the same Ink app; `src/cli.ts` is the actual CLI entrypoint.
- `tsconfig.json` uses `moduleResolution: "bundler"` with `allowImportingTsExtensions`, while the build config switches to `NodeNext` plus `rewriteRelativeImportExtensions`.

## Safe Working Strategy For Future Agents

1. Read the target file and nearby modules before editing; patterns vary across files.
2. Prefer minimal, localized changes over broad refactors.
3. Validate with `npm run build` for code changes.
4. Run the most relevant eval script when changing tools, agent loop behavior, or prompt-driven orchestration.
5. Do not remove the OpenSpec block or overwrite course-specific instructions without confirming they are obsolete.
