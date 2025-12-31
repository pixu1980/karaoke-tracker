# Cursor IDE Instructions

Configuration and best practices for using Agent Skills with Cursor IDE.

## Cursor Rules (.cursor/rules file)

Cursor allows rules files (`.cursor/rules` or `.cursorignore`) to customize behavior. Add this to your Cursor workspace to reference Agent Skills:

**`.cursor/rules` (if supported by your Cursor version):**

```
# Agent Skills setup

## Documentation
- Agent Skills: .ai/skills/ (component patterns, accessibility, testing)
- Project context: .context/ (project-specific conventions)

## Code standards
- Use semantic HTML (button, input, h2, ul)
- Prefer element/attribute selectors
- Follow component-scaffold and styling-guidelines skills

## Recommended file paths
- Skills: .ai/skills/
- Project context: .context/
```

## Cursor Chat integration

### Activate skills in Cursor Chat

Use the same prompting pattern as Copilot:

```
Using the component-scaffold skill, create a new component for [feature].
```

Cursor supports skill-aware suggestions if you include skill names and `.ai/skills` paths.

### Inline prompts with Agent Skills

Add comments to activate Cursor's skill-aware mode:

```javascript
// @cursor-skill: component-scaffold, styling-guidelines
class NewComponent {
  // Cursor will suggest patterns from these skills
}
```

## Cursor-specific commands

### Generate component from skill

```
Generate a new component from the component-scaffold skill:
- Name: ComponentName
- Purpose: [describe purpose]
- Features: [list features]
```

Cursor will apply the scaffold and reference related skills.

### Refactor with skills

```
Refactor [file] using:
- styling-guidelines skill
- real-time-filtering skill
- accessibility-rules skill
```

## Cursor AI features + Agent Skills

### Code completion

Cursor's code completion learns from:
- `.ai/skills/*/references/REFERENCE.md` (examples)
- Existing component patterns
- Project conventions in `.context/`

Enable long-context completion in Cursor settings to include skill examples.

### Test generation

Ask Cursor to generate tests using the testing-components skill:

```
Generate tests for [component] covering:
- [test case 1]
- [test case 2]

Use the testing-components skill.
```

## Cursor workspace config

Add to `.vscode/settings.json` or Cursor workspace settings:

```json
{
  "cursor.advanced.lspSemanticTokens": true,
  "cursor.autocomplete.useLongContext": true,
  "cursor.indexing.includeGlobs": [
    ".ai/skills/**"
  ],
  "cursor.documentation.paths": [
    ".ai/",
    ".context/"
  ]
}
```

## Project context

See [.context/CURSOR.md](../.context/CURSOR.md) for project-specific setup and conventions.

## Quick skill reference in Cursor

Open `.ai/skills/README.md` to list all available skills, or reference individual skill:
- `.ai/skills/component-scaffold/SKILL.md`
- `.ai/skills/styling-guidelines/SKILL.md`
- `.ai/skills/real-time-filtering/SKILL.md`

Cursor can jump to these paths with `Ctrl+K Ctrl+O` (Open Files).

## Cursor Composer mode

Use Cursor Composer (multi-step editing) for complex refactors:

**Step 1:** List skills to apply

```
I want to refactor the SingerList component.
What Agent Skills from .ai/skills/ should I use?
```

**Step 2:** Generate changes per skill

```
Apply the component-scaffold skill:
- Ensure static block structure is correct
```

```
Apply the styling-guidelines skill:
- Update CSS to use --space-* tokens
- Ensure scrolling works with flex: 1; min-height: 0;
```

**Step 3:** Verify compliance

```
Apply the accessibility-rules skill:
- Add missing aria-labels
- Ensure focus-visible styles present
```

## Recommended Cursor extensions

For better Agent Skills integration:

- **YAML** (esbenp.prettier-vscode) — Parse SKILL.md frontmatter
- **Markdown** (yzhang.markdown-all-in-one) — Better skill documentation viewing
- **Python** (ms-python.python) — Run `.ai/skills/scripts/validate_local.py`

## Validation in Cursor

Run skill validation from Cursor's integrated terminal:

```bash
# Local validator
python3 .ai/skills/scripts/validate_local.py

# Formal validation (requires skills-ref installed)
skills-ref validate .ai/skills/component-scaffold
```

Set up a Cursor task to run validation on save.

## Tips for Cursor + Agent Skills

1. **Prefix prompts:** Always mention skill names (e.g., "Using component-scaffold...")
2. **Path references:** Use relative paths like `.ai/skills/<skill>/SKILL.md`
3. **Long context:** Enable long-context mode for richer examples from `references/REFERENCE.md`
4. **Composer:** Use for multi-step refactors applying multiple skills
5. **Verification:** Run validators after generation to ensure compliance

## Updating Cursor context

When skills or structure change:
1. Update `.cursor/rules` file
2. Update `.ai/` instructions
3. Cursor auto-reindexes; no restart needed

See `.ai/skills/README.md` for available skills and validation commands.
