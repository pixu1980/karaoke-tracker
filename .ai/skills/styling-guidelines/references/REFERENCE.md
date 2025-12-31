## Styling guidelines — reference

Detailed patterns and examples for component CSS.

### Key principles

1. **Component scoped** — CSS only applies to component elements, no global pollution
2. **Semantic selectors** — Use element/attribute selectors, not utility classes
3. **Design tokens** — Define spacing, colors, radius as reusable variables
4. **CSS layers** — Use `@layer` for organization and predictable cascading
5. **Responsive** — Mobile-first design with media queries for larger screens
6. **Accessible** — Support keyboard navigation, focus states, color contrast

### CSS organization with layers

```css
@layer reset, foundations, layout, utilities;

@layer reset {
  * { box-sizing: border-box; }
  button { cursor: pointer; }
}

@layer foundations {
  :root {
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --color-primary: #007bff;
    --color-text: #000;
    --radius-md: 0.5rem;
  }
}

@layer layout {
  .component {
    display: flex;
    padding: var(--spacing-md);
  }
}
```

### Component CSS pattern

```css
/* Scoped component selector */
.my-component {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}

/* Child elements */
.my-component > button {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: var(--color-primary);
  color: #fff;
}

.my-component > button:hover {
  opacity: 0.9;
}

.my-component > button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Flex scrolling pattern

For scrollable content inside flex containers:

```css
.container {
  display: flex;
  flex-direction: column;
  max-height: 500px;
}

.scrollable-list {
  flex: 1;          /* Take remaining space */
  min-height: 0;    /* Allow flex children to shrink below content size */
  overflow-y: auto; /* Enable scrolling */
}
```

### Responsive design pattern

```css
/* Mobile first */
.component {
  font-size: 1rem;
  padding: var(--spacing-sm);
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    font-size: 1.125rem;
    padding: var(--spacing-md);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Accessible focus styles

```css
button {
  /* Remove default outline */
  outline: none;
}

button:focus-visible {
  /* Visible focus ring for keyboard navigation */
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

button:hover {
  opacity: 0.8;
}

button:active {
  transform: scale(0.98);
}
```

### Design token patterns

Define tokens in global stylesheet:

```css
:root {
  /* Spacing scale */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */

  /* Colors */
  --color-primary: #007bff;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-text: #333;
  --color-bg: #fff;
  --color-border: #ddd;

  /* Sizing */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;

  /* Z-index scale */
  --z-dropdown: 100;
  --z-modal: 200;
  --z-tooltip: 300;
}
```

Use tokens throughout components:

```css
.component {
  padding: var(--spacing-md);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  color: var(--color-text);
}
```

### Quality checklist

- ✅ No hardcoded colors (use tokens or `light-dark()`)
- ✅ Spacing uses defined scale
- ✅ Semantic element selectors (no `.util-*` classes)
- ✅ Focus states properly styled for accessibility
- ✅ Responsive design tested on mobile, tablet, desktop
- ✅ Component CSS doesn't affect global styles
- ✅ CSS layers used for organization
- ✅ High contrast text (WCAG AA minimum)

### Project-specific conventions

For project-specific design tokens, color schemes, and styling conventions, refer to the project's `.context/` directory.
