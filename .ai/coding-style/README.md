# Coding Style Guides

This directory contains technology-specific coding style guides 
## 📚 Available Style Guides

### General
- **[javascript.md](./javascript.md)** - JavaScript language conventions
  - Variable naming, functions, async/await
  - ES6+ features, modules
  - Code organization

- **[css.md](./css.md)** - Styling with Tailwind CSS
  - Tailwind conventions
  - Responsive design
  - Design tokens
  - Custom styles

- **[html.md](./html.md)** - Semantic HTML guidelines
  - Semantic elements
  - Markup structure
  - Best practices

- **[accessibility.md](./accessibility.md)** - Accessibility (a11y)
  - WCAG guidelines
  - Accessibility checklist
  - Testing tools
  - ARIA attributes

## 🎯 How to Use These Guides

### For AI Assistants

1. **Read relevant guides** before generating code
2. **Follow conventions** when suggesting completions
3. **Reference patterns** when refactoring
4. **Check examples** in the guides

### For Developers

1. **Consult guides** when learning new technologies
2. **Follow patterns** when writing new code
3. **Review guides** during code reviews
4. **Update guides** when patterns evolve

## 🏗️ Guide Structure

Each guide typically includes:

1. **Overview** - Technology and purpose
2. **Core Conventions** - Essential rules
3. **Patterns** - Common code patterns
4. **Examples** - Code examples (✅ DO / ❌ DON'T)
5. **Anti-patterns** - What to avoid
6. **Tools** - Linting, formatting, testing tools

## 📖 Reading Order

1. [javascript.md](./javascript.md) - Base conventions
2. [css.md](./css.md) - Styling
3. [html.md](./html.md) - Markup
4. [accessibility.md](./accessibility.md) - A11y

## 🚨 Critical Rules Summary

### JavaScript
- Use `const` by default, `let` when reassignment needed
- Prefer arrow functions
- Use async/await over promises
- Destructure when beneficial

### Frontend
- TypeScript strict mode
- Server Components by default
- Use `next-intl` for translations
- Tailwind for styling
- Semantic HTML
- WCAG AA compliance

### Naming Conventions
- Files (routes/utils): `kebab-case.js`
- Files (components): `PascalCase.tsx`
- Variables/functions: `camelCase`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Database tables: `snake_case` (plural)
- Database fields: `snake_case`

## 🔧 Tools Configuration

### Linting
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting

### Testing
- **Vitest**: Backend testing
- **Jest/Testing Library**: Frontend testing (if configured)

## 🔄 Keeping Guides Updated

These guides should evolve with the codebase:

- **When adding new patterns**: Document them
- **When deprecating patterns**: Mark them as deprecated
- **When finding better approaches**: Update examples
- **When tools change**: Update tooling sections

