# GitHub Copilot Instructions

Configuration and best practices for using Agent Skills with GitHub Copilot in VS Code.

## Copilot Instructions (`.github/copilot-instructions.md`)

The project includes a `.github/copilot-instructions.md` file that Copilot reads automatically. It references:

- **Skills location:** `.ai/skills/` for component patterns and architecture guidance
- **Project context:** `.context/` for project-specific conventions and tech stack

Update `.github/copilot-instructions.md` to point Copilot to `.ai/` for skill-based guidance.

## VS Code Copilot Chat setup

### Activate skills in Chat

In VS Code Copilot Chat, prefix prompts with skill context:

```
Using the component-scaffold skill, create a new component for [purpose].
```

Or reference multiple skills:

```
Apply the component-scaffold and styling-guidelines skills to build a new [ComponentName].
```

### File-specific skill hints

Add inline comments to prompt Copilot to use specific skills:

```javascript
// @copilot-skill: component-scaffold, event-system
class MyComponent {
  // Copilot will prioritize these skills for suggestions
}
```

## Skill-based Copilot prompts

### For new components

**Prompt template:**

```
Create a new component named <Name> that:
- [requirement 1]
- [requirement 2]

Use the component-scaffold and styling-guidelines skills.
Follow the project conventions.
```

### For styling updates

```
Update the CSS for <component> to:
- [styling goal]

Reference the styling-guidelines skill and ensure design system compliance.
```

### For template improvements

```
Refactor the template for <component> to:
- [improvement 1]
- [improvement 2]

Use the template-engine skill and follow project conventions.
```

## Project context

See [.context/COPILOT.md](../.context/COPILOT.md) for project-specific setup and conventions.

## Tips for better Copilot suggestions

1. **Be specific:** Name the component, describe the feature
2. **Reference skills:** Mention skill names explicitly in prompts
3. **Show examples:** Paste existing component code for style consistency
4. **Ask for rationale:** Request "why" for architectural decisions
5. **Iterate:** Follow up with refinements, don't accept first suggestion blindly

## Updating Copilot context

If skills or project structure change:
1. Update `.github/copilot-instructions.md`
2. Update `.ai/` instructions files
3. Commit and push to make Copilot aware of changes

See `.ai/skills/README.md` for available skills and validation commands.
