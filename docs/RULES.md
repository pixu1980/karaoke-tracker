# Development Rules and Guidelines

## Core Principles

### 1. Simplicity First
- Keep the codebase simple and maintainable
- Avoid over-engineering solutions
- Write code that's easy to understand and modify
- Prefer vanilla solutions over adding dependencies

### 2. No Build Complexity
- Parcel.js is the only build tool required
- No additional preprocessors (Sass, PostCSS, etc.)
- No transpilation beyond what Parcel provides by default
- Keep the build process fast and simple

### 3. Vanilla Everything
- **JavaScript**: Pure vanilla JS, no frameworks
- **CSS**: Pure CSS, no preprocessors
- **HTML**: Semantic HTML5, no templating engines
- **Storage**: Native Web APIs (IndexedDB, localStorage)

## JavaScript Rules

### Custom Elements
```javascript
// ✅ DO: Use Custom Elements v1
class MyElement extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div>Content</div>`;
    }
}
customElements.define('my-element', MyElement);

// ❌ DON'T: Use Shadow DOM
class MyElement extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: 'open'});  // ❌ NO
    }
}

// ❌ DON'T: Use <template> tags
const template = document.createElement('template');  // ❌ NO
```

### Code Style
- Use ES6+ features (arrow functions, destructuring, etc.)
- Use `const` by default, `let` when needed, never `var`
- Prefer `async/await` over `.then()` chains
- Use template literals for HTML strings
- Add JSDoc comments for complex functions

### Error Handling
```javascript
// ✅ DO: Always handle errors in async functions
async function loadData() {
    try {
        const data = await fetchData();
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load data. Please try again.');
    }
}

// ❌ DON'T: Leave async functions without error handling
async function loadData() {
    const data = await fetchData();  // ❌ Could throw
    return data;
}
```

## CSS Rules

### Design System
- **ALL** colors must use CSS variables from `:root`
- **ALL** spacing must use design system tokens
- **ALL** typography must use design system scales
- Add new variables to `:root` when needed, don't hardcode values

```css
/* ✅ DO: Use CSS variables */
.my-element {
    color: var(--color-primary);
    padding: var(--spacing-md);
    font-size: var(--font-size-lg);
}

/* ❌ DON'T: Hardcode values */
.my-element {
    color: #6366f1;        /* ❌ NO */
    padding: 1rem;         /* ❌ NO */
    font-size: 1.125rem;   /* ❌ NO */
}
```

### Naming Conventions
- Use descriptive, kebab-case class names
- Group related elements with prefixes (e.g., `singer-card`, `singer-info`, `singer-name`)
- Avoid generic names like `.box`, `.item`, `.text`

### Responsive Design
- Mobile-first approach
- Use media queries for larger screens
- Test on mobile (320px+), tablet (768px+), and desktop (1024px+)

## HTML Rules

### Semantic Elements
```html
<!-- ✅ DO: Use semantic HTML -->
<header class="app-header">
    <h1>Title</h1>
</header>
<main class="app-main">
    <section aria-label="Description">
        <h2>Section Title</h2>
    </section>
</main>

<!-- ❌ DON'T: Use div soup -->
<div class="header">
    <div class="title">Title</div>
</div>
<div class="main">
    <div class="section">
        <div class="section-title">Section Title</div>
    </div>
</div>
```

### Accessibility
- Always include `alt` attributes on images
- Use `aria-label` for icon buttons
- Include `aria-required` on required form fields
- Maintain proper heading hierarchy (h1 → h2 → h3)
- Test keyboard navigation

## Storage Rules

### IndexedDB Usage
- Use IndexedDB as the primary storage mechanism
- Wrap all IndexedDB operations in promises
- Handle errors gracefully with user-friendly messages
- Keep data structure simple and flat when possible

### Data Schema
```javascript
// Singer object structure
{
    id: Number,           // Auto-generated
    name: String,         // Required
    song: String,         // Required
    imageUrl: String,     // Optional
    notes: String,        // Optional
    timestamp: Number     // Auto-generated
}
```

## Performance Rules

### Optimization Guidelines
- Minimize DOM manipulations
- Use event delegation where appropriate
- Lazy load images if needed
- Keep bundle size small (avoid large dependencies)
- Use browser caching effectively

### Bundle Size
- Keep total bundle size under 100KB (uncompressed)
- Avoid importing large libraries
- Use native Web APIs instead of polyfills when possible

## Git Rules

### Commit Messages
- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Keep first line under 72 characters
- Add body for complex changes

### Branches
- Use descriptive branch names
- Format: `feature/description` or `fix/description`
- Keep branches short-lived
- Delete merged branches

## Testing Rules

### Manual Testing
- Test all features after changes
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test on mobile devices or emulators
- Test with keyboard navigation
- Test with screen readers when possible

### Browser Support
- Target modern browsers (last 2 versions)
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Documentation Rules

### Code Comments
- Comment "why", not "what"
- Use JSDoc for public APIs
- Keep comments up to date
- Remove commented-out code

### README and Docs
- Keep README.md up to date
- Document all features
- Include screenshots
- Provide clear setup instructions

## Deployment Rules

### GitHub Actions
- Build must pass before deployment
- Deploy only from main branch
- Use `--public-url ./` for relative paths
- Test deployed version after each release

### Production Build
- Run `npm run build` before committing
- Check dist/ folder is correctly generated
- Verify all assets are included
- Test the built version locally

## Security Rules

### Best Practices
- Never commit secrets or API keys
- Sanitize user input before display
- Use HTTPS for external resources
- Validate URLs before using in images
- Escape HTML in user-generated content

### Data Privacy
- Store only necessary data
- Don't track users without consent
- Handle errors without exposing sensitive info
- Clear data when user requests it

## When in Doubt

1. **Keep it simple** - Choose the simplest solution
2. **Follow existing patterns** - Look at existing code
3. **Test thoroughly** - Verify changes work
4. **Ask for review** - Get feedback on complex changes
5. **Document decisions** - Update docs when needed

## Prohibited Practices

❌ **Never:**
- Add framework dependencies (React, Vue, Angular, etc.)
- Use Shadow DOM
- Use `<template>` elements
- Add CSS preprocessors
- Add complex build tools
- Hardcode values instead of using design tokens
- Ignore accessibility
- Skip error handling
- Commit without testing

## Resources

### Web APIs Documentation
- [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [HTML5 Semantics](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

### Tools
- [Parcel.js Docs](https://parceljs.org/)
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [WAVE](https://wave.webaim.org/) - Accessibility testing

---

**Remember**: These rules exist to keep the project simple, maintainable, and accessible. When proposing changes, ensure they align with these principles.
