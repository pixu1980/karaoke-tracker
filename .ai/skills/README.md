# Agent Skills

Agent Skills are lightweight, open-format structured knowledge and workflows for AI agents. This directory contains skills organized for discovery, activation, and execution by compatible agents.

## Directory structure

```
.ai/
├── skills/
│   ├── component-scaffold/
│   │   ├── SKILL.md                 # Required: instructions + metadata
│   │   ├── references/
│   │   │   └── REFERENCE.md         # Optional: detailed reference
│   │   └── assets/                  # Optional: templates, resources
│   ├── styling-guidelines/
│   │   └── ...
│   └── ...
├── agent-discovery.js               # Helper for skill discovery and activation
├── scripts/
│   └── validate_local.py            # Local validator
├── README.md                         # This file
├── claude-instructions.md            # Claude-specific rules and context
├── copilot-instructions.md           # GitHub Copilot instructions
└── cursor-instructions.md            # Cursor IDE instructions
```

## Discovering skills

### Programmatic discovery

Use `agent-discovery.js` to discover and load skills:

```javascript
import { discoverSkills, injectSkillsIntoPrompt } from './.ai/agent-discovery.js';

// Discover all skills
const skills = discoverSkills('.ai/skills');

// Inject into system prompt (for Claude, etc.)
const systemPrompt = "You are a helpful AI assistant...";
const enhancedPrompt = injectSkillsIntoPrompt(systemPrompt, skills);
```

### Manual discovery

Skills are directories containing a `SKILL.md` file with YAML frontmatter:

```yaml
---
name: component-scaffold
description: Scaffold and conventions to create a new UI component...
license: MIT
metadata:
  author: Karaoke Tracker
  version: "1.0"
---

## When to use this skill
...
```

## Development commands

### Validate skills locally

```bash
python3 .ai/skills/scripts/validate_local.py
```

Checks:
- SKILL.md frontmatter presence and format
- `name` field validity (lowercase, hyphens, no leading/trailing hyphens)
- `description` presence and length (max 1024 chars)
- SKILL.md body under 500 lines (recommended)
- `references/REFERENCE.md` presence if `references/` directory exists

### Validate with skills-ref (formal)

```bash
skills-ref validate .ai/skills/component-scaffold
```

Or validate all skills:

```bash
for d in .ai/skills/*/; do
  if [ -f "$d/SKILL.md" ]; then
    skills-ref validate "$d"
  fi
done
```

### Generate prompt XML

Generate `<available_skills>` XML for injection into agent prompts:

```bash
skills-ref to-prompt .ai/skills/*/ > available_skills.xml
```

Or use the JavaScript helper:

```bash
node -e "import('./.ai/agent-discovery.js').then(m => console.log(m.generateAvailableSkillsXML(m.discoverSkills())))"
```

## Security considerations

When integrating skills into an agent, implement:

1. **Sandboxing**: Run scripts in isolated environments (containers, VMs).
2. **Allowlisting**: Only execute scripts from trusted, vetted skills.
3. **Confirmation**: Ask users before running potentially dangerous operations.
4. **Logging**: Record all script executions for auditing and compliance.

## Agent-specific instructions

- [**Claude**](claude-instructions.md) — System prompt structure and integration patterns for Claude API
- [**GitHub Copilot**](copilot-instructions.md) — VS Code extension setup and Copilot instructions
- [**Cursor**](cursor-instructions.md) — Cursor IDE-specific rules and system instructions

## Files in this skill

- `SKILL.md` — Frontmatter with metadata and "when to use" instructions
- `references/REFERENCE.md` — Extended reference documentation (loaded on demand)
- `scripts/` — Optional executable scripts (Python, Bash, JavaScript)
- `assets/` — Optional templates, images, lookup tables

See [agentskills.io](https://agentskills.io) for the full specification.
