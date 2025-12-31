# .ai directory

This directory contains Agent Skills and AI-specific instructions for Claude, Copilot, and Cursor.

## Structure
# AI Assistant Documentation - Karaoke Tracker

This directory contains all documentation specifically designed for AI coding assistants (Claude Code, GitHub Copilot, Cursor, etc.).

## 📖 Documentation Index

### 🚪 Entry Points (Start Here)

Choose the entry point based on your AI assistant:

- **[CLAUDE.md](./CLAUDE.md)** - Instructions for Anthropic Claude Code
- **[COPILOT.md](./COPILOT.md)** - Instructions for GitHub Copilot
- **[CURSOR.md](./CURSOR.md)** - Instructions for Cursor AI

### 📋 Core Documentation

#### 1. Rules (Mandatory)
Binding rules that MUST be followed by all code:

- **[CORE_RULES.md](./rules/CORE_RULES.md)** - Package manager, module system, multi-tenancy, naming conventions, security, testing

#### 2. Architecture
Understanding the system structure and flows:

- **[PROJECT_OVERVIEW.md](./architecture/PROJECT_OVERVIEW.md)** - Complete architecture documentation including:
	- layout and tech stack
	- Application overview
	- Database schema
	- Deployment and CI/CD
	- Performance optimization
	- Security best practices

#### 3. Coding Style Guides
Technology-specific conventions:

- **[javascript.md](./coding-style/javascript.md)** - JavaScript language conventions
- **[css.md](./coding-style/css.md)** - Tailwind CSS and styling patterns
- **[html.md](./coding-style/html.md)** - Semantic HTML and markup guidelines
- **[accessibility.md](./coding-style/accessibility.md)** - Accessibility (a11y) checklist and tooling

### Project Structure

```
.ai/
├── CLAUDE.md                # Claude Code entry point
├── COPILOT.md               # GitHub Copilot entry point
├── CURSOR.md                # Cursor AI entry point
├── rules/                   # Binding rules
├── architecture/            # System architecture
├── coding-style/            # Style guides
└── workflows/               # Task guides
```
## 📚 Reading Order for New AI Assistants

If you're an AI assistant encountering this codebase for the first time:

1. **Start with your entry point**: [CLAUDE.md](./CLAUDE.md), [COPILOT.md](./COPILOT.md), or [CURSOR.md](./CURSOR.md)
2. **Read Core Rules**: [rules/CORE_RULES.md](./rules/CORE_RULES.md) - Mandatory
3. **Understand Architecture**: [architecture/PROJECT_OVERVIEW.md](./architecture/PROJECT_OVERVIEW.md)
4. **Learn Coding Styles**: Browse [coding-style/](./coding-style/) for relevant technologies
5. **Check Current Work**: [TODO_CURRENT.md](./TODO_CURRENT.md) for active tasks
6. **Use Workflows**: Consult [workflows/](./workflows/) when performing specific tasks

## 🔄 Maintenance

This documentation should be updated when:
- New architectural patterns are introduced
- Coding conventions change
- New technologies are added to the stack
- Major refactoring occurs
- New workflows are established

**Last Updated**: 2025-11-21

---

**Note**: For human-readable documentation, see the `/docs` directory in the repository root.

