# this-is-the-way

A Claude Code plugin marketplace. Each mod lives in its own folder under `plugins/` and installs on its own; adding the marketplace installs nothing by itself.

## Mods

| Mod | What it does |
| --- | --- |
| [append-system](plugins/append-system) | Appends `APPEND_SYSTEM.md` from `~/.claude`, `<project>/.claude`, `~/.agents` and `<project>/.agents` to the system prompt, in that order |

## Install a mod

At the prompt of a Claude Code terminal session:

```
/plugin install <mod> --marketplace tacoman667/claude-mods
```

Answer `y` to add the marketplace, then choose a scope. Once the marketplace is added, `/plugin` lists every mod in it to pick from, and `/plugin install <mod>@this-is-the-way` installs one by id.

From a shell:

```
claude plugin install <mod> --marketplace tacoman667/claude-mods
```
