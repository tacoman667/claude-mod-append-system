# append-system

A Claude Code mod that appends the contents of `APPEND_SYSTEM.md` files to Claude Code's system prompt at session start. Use it for standing instructions that belong in the system prompt itself rather than in `CLAUDE.md`, which Claude Code sends as context in the first user message.

## Files read

Read once at session start and merged in this order, separated by a blank line:

1. `~/.claude/APPEND_SYSTEM.md` (or `$CLAUDE_CONFIG_DIR/APPEND_SYSTEM.md`)
2. `<project>/.claude/APPEND_SYSTEM.md`
3. `~/.agents/APPEND_SYSTEM.md`
4. `<project>/.agents/APPEND_SYSTEM.md`

Missing or empty files are skipped, and so is a file whose text (ignoring leading and trailing whitespace) matches one already merged, such as `~/.agents/APPEND_SYSTEM.md` symlinked to `~/.claude/APPEND_SYSTEM.md`, so the same text is never sent twice. `<project>` is the directory the session started in. The `.agents/` files are harness-neutral, so one file can be shared with other tools that read it. The merged text is added as the last section of the system prompt. Edits take effect in the next session.

## Why the system prompt instead of `CLAUDE.md`?

`CLAUDE.md` and `APPEND_SYSTEM.md` reach the model through different channels:

| | `CLAUDE.md` | `APPEND_SYSTEM.md` (this mod) |
| --- | --- | --- |
| Where it goes | A context block in the first user message | A section of the system prompt |
| How the model reads it | Context supplied alongside the conversation | Part of the instructions that define how the assistant operates |
| Sent | With the conversation's first message, re-read after compaction or `/clear` | With every request, as part of the system prompt |
| Equivalent built-in | Automatic for any `CLAUDE.md` in the project tree | `claude --append-system-prompt "..."`, but from a file instead of a flag |

### Reasons to use the system prompt

- **Authority.** Models are trained to treat the system prompt as the operator's standing rules and to weigh it above what arrives in the conversation. Instructions that must hold for the whole session, such as tone, output format, safety rules, or "never do X", carry more weight there than as context in a user turn.
- **Consistency.** The system prompt is fixed for the session and sent on every request. Rules there are part of the assistant's footing, not one block among the files, reminders and tool results that pile up as the conversation grows.
- **No flag to remember.** `--append-system-prompt` does the same thing, but only for sessions started with it. A file is picked up by every session, including ones started by an IDE, the desktop app, or another tool.
- **Separation of concerns.** `CLAUDE.md` is usually committed project knowledge for the whole team: build commands, architecture, conventions. `APPEND_SYSTEM.md` can hold how *you* want the assistant to behave, kept apart from that shared document.
- **Shared across harnesses.** The `.agents/` files are not specific to Claude Code, so one `~/.agents/APPEND_SYSTEM.md` can serve every tool that reads it.

### When `CLAUDE.md` is the better fit

- Project facts: how to build, test and run the code, where things live, team conventions.
- Anything that varies by directory: Claude Code also reads nested `CLAUDE.md` files as it works in subfolders; this mod reads only the files listed above.
- Anything long. Every line of `APPEND_SYSTEM.md` is sent with every request, so keep it to short, firm rules.

A system prompt instruction is weighted more heavily but is not a guarantee: the model can still fail to follow it, and a badly worded rule there does more harm than one in `CLAUDE.md`. Write it the way you would write any other instruction to the model: specific, short, and without contradicting `CLAUDE.md`.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install append-system --marketplace tacoman667/claude-plugins
```

Answer `y` to add the marketplace, then choose a scope.

From a shell:

```
claude plugin install append-system --marketplace tacoman667/claude-plugins
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `tacoman667/claude-plugins`, then Add plugin.

## Test

```
claude plugin test .
```
