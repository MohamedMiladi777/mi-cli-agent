import { tool } from "ai";
import { Bash, ReadWriteFs } from "just-bash";
import { z } from "zod";

// process.cwd returns the currentworkingdirectory of node.js
// ReadWriteFs is a direct read and write access to filesystem
const fs = new ReadWriteFs({ root: process.cwd() });
const bash = new Bash({ fs, cwd: "/" });

export const memoryTool = tool({
  description: `Run bash commands only for memory-related tasks.

This tool is restricted to memory workflows. Do not use it for
general project work, code changes, dependency management, or
system administration.

Inside the tool, use paths under /home/miladi/repos/mi-cli-agent/src/agent/.memory:
- /.memory/core.md for key facts that should be reused later
- /.memory/notes.md for detailed notes
- /.memory/conversations.jsonl for full turn history

Rules:
- Only perform memory-related reads/writes and conversation recall
- Keep /.memory/core.md short and focused
- Prefer append-friendly notes in /.memory/notes.md for details
- If the user asks about prior conversations, search
  /.memory/conversations.jsonl for relevant keywords first
- Use >> to append, > to overwrite, and perl -pi -e for in-place edits

Examples:
- cat /.memory/core.md
- echo "- User prefers concise answers" >> /.memory/core.md
- perl -pi -e 's/concise answers/detailed answers/g' /.memory/core.md
- grep -n "project" /.memory/notes.md
- echo "2026-02-16: started a Rust CLI" >> /.memory/notes.md
- grep -niE "pricing|budget" /.memory/conversations.jsonl
- tail -n 40 /.memory/conversations.jsonl | jq -c '.role + ": " + .content'`,
  inputSchema: z.object({
    command: z.string().describe("The bash command to execute."),
  }),

  execute: async ({ command }) => {
    /**@todo implement fundUnapprovedCommand */
    /* const unapprovedCommand = findUnapprovedCommand(command)
    if (unapprovedCommand){
        return {
        stdout: '',
        stderr: `Blocked unapproved command: ${unapprovedCommand}\n`,
        exitCode: 1,
      };
    }*/

    const result = await bash.exec(command);
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
    };
  },
});
