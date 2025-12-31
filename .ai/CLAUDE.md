# Claude Instructions (Generic)

Instructions and best practices for integrating Agent Skills with Claude API.

## System prompt integration

Include available skills in your Claude system prompt using XML:

```xml
You are a helpful AI assistant for [PROJECT_NAME].

<available_skills>
  <skill>
    <name>component-scaffold</name>
    <description>Scaffold and conventions to create a new UI component...</description>
    <location>/absolute/path/.ai/skills/component-scaffold/SKILL.md</location>
  </skill>
  <!-- more skills... -->
</available_skills>

When a user task matches a skill's description, activate that skill by:
1. Reading the full SKILL.md instructions
2. Following the detailed steps provided
3. Referencing `references/REFERENCE.md` for extended examples
```

## Project context

See [.context/CLAUDE.md](../.context/CLAUDE.md) for project-specific context, conventions, and architecture details.

## Skill activation workflow

1. **Discovery:** Parse `.ai/skills/*/SKILL.md` frontmatter to build skill list
2. **Matching:** Compare user request with skill `description` fields
3. **Loading:** Read full SKILL.md body when skill is relevant
4. **Execution:** Follow steps; load `references/REFERENCE.md` and `scripts/` as needed

## Recommendations for Claude

1. **Concise responses:** Reference skill names and steps; avoid redundant explanations
2. **Code first:** Show code examples before prose; use triple backticks with language tags
3. **File paths:** Use relative paths unless absolute path is needed
4. **Testing:** Suggest dev server testing after changes
5. **Documentation:** Update both code comments and docs if architecture changes

## Available skills

See `.ai/skills/README.md` for the complete list of available skills and their descriptions.

For project-specific skill usage examples and conventions, see [.context/CLAUDE.md](../.context/CLAUDE.md).
