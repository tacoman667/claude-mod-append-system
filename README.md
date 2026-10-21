# append-system

A Claude Code mod that appends the contents of `APPEND_SYSTEM.md` files to Claude Code's system prompt at session start. Use it for standing instructions that belong in the system prompt itself rather than in `CLAUDE.md`, which Claude Code sends as context in the first user message.

## Files read

Read once at session start and merged in this order, separated by a blank line:

1. `~/.claude/APPEND_SYSTEM.md` (or `$CLAUDE_CONFIG_DIR/APPEND_SYSTEM.md`)
2. `<project>/.claude/APPEND_SYSTEM.md`
3. `~/.agents/APPEND_SYSTEM.md`
4. `<project>/.agents/APPEND_SYSTEM.md`

Missing or empty files are skipped. `<project>` is the directory the session started in. The `.agents/` files are harness-neutral, so one file can be shared with other tools that read it. The merged text is added as the last section of the system prompt. Edits take effect in the next session.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install append-system --marketplace tacoman667/claude-mod-append-system
```

Answer `y` to add the marketplace, then choose a scope.

From a shell:

```
claude plugin install append-system --marketplace tacoman667/claude-mod-append-system
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `tacoman667/claude-mod-append-system`, then Add plugin.

## Test

```
claude plugin test .
```
