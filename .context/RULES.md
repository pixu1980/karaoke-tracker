# Development Rules and Guidelines

## ⚠️ Documentation as Source of Truth

**This `/docs` folder is the ONLY source of truth for all project rules and conventions.**

### Related documents (ALWAYS consult):
- **`docs/coding-styleguides/javascript.md`** - Detailed JavaScript standards
- **`docs/coding-styleguides/css.md`** - CSS standards and conventions
- **`docs/coding-styleguides/html.md`** - HTML standards and semantics
- **`docs/coding-styleguides/a11y.md`** - Accessibility standards

### Documentation hierarchy:
1. This file (`RULES.md`) contains general project rules
2. Coding styleguides contain detailed language-specific conventions
3. In case of conflict, styleguides take precedence for their specific scope

---

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

### 3. Package Manager
- Use **pnpm** for all dependency installation and script execution
- Do not mix npm or yarn commands within this project

### 4. Vanilla Everything
- **JavaScript**: Pure vanilla JS, no frameworks
- **CSS**: Pure CSS, no preprocessors
- **HTML**: Semantic HTML5, with custom template engine (pixEngine)
- **Storage**: Native Web APIs (IndexedDB, localStorage)

---

## Custom Elements Architecture

### Component Pattern (MANDATORY)
All components MUST follow this exact pattern with **static initialization block**:

```javascript
import styles from 'bundle-text:./ComponentName.css';
import template from 'bundle-text:./ComponentName.template.html';
import { i18n, pixEngine, registerStylesheet } from '../../services/index.js';

/**
 * ComponentName - Brief description
 * @element component-name
 */
class ComponentName extends HTMLElement {
    // Static initialization block: runs once when class is loaded
    static {
        // 1. Register styles globally (uses adoptedStyleSheets)
        registerStylesheet(styles);
        
        // 2. Register custom element
        customElements.define('component-name', ComponentName);
    }
    
    constructor() {
        super();
        // Initialize instance state
        this._data = null;
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
        
        // Listen for global events
        window.addEventListener('language-changed', this._boundRender = () => this.render());
    }
    
    disconnectedCallback() {
        // Cleanup event listeners
        window.removeEventListener('language-changed', this._boundRender);
    }
    
    render() {
        this.innerHTML = pixEngine(template, {
            title: i18n.t('componentTitle'),
            items: this._data || []
        });
    }
    
    setupEventListeners() {
        // Use event delegation
        this.addEventListener('click', (e) => {
            if (e.target.matches('.action-button')) {
                this.handleAction(e);
            }
        });
    }
}
```

### Template Engine (pixEngine)

The `pixEngine` function is our custom template engine. It processes HTML templates with:

#### Variable Interpolation
```html
<!-- Simple variable -->
<h1>{{ title }}</h1>

<!-- Nested property -->
<p>{{ user.name }}</p>

<!-- With escaping (automatic for security) -->
<span>{{ userInput }}</span>
```

#### Conditionals
```html
<!-- If block -->
<if condition="isVisible">
    <div>This content is visible</div>
</if>

<!-- If/Else block -->
<if condition="hasItems">
    <ul>...</ul>
</if>
<else>
    <p>No items found</p>
</else>

<!-- Comparison operators: ==, ===, !=, !==, <, >, <=, >= -->
<if condition="count > 0">
    <span>{{ count }} items</span>
</if>

<!-- Negation -->
<if condition="!isEmpty">
    <div>Content here</div>
</if>
```

#### Loops
```html
<!-- Simple loop -->
<for each="item in items">
    <li>{{ item.name }}</li>
</for>

<!-- Loop with index -->
<for each="index, item in items">
    <li data-index="{{ index }}">{{ item.name }}</li>
</for>
```

### Component File Structure
Each component MUST have its own folder with:
```
ComponentName/
├── ComponentName.js           # Component class with static block
├── ComponentName.css          # Component styles
└── ComponentName.template.html # HTML template for pixEngine
```

### Rules for Custom Elements

```javascript
// ✅ DO: Use static initialization block
class MyElement extends HTMLElement {
    static {
        registerStylesheet(styles);
        customElements.define('my-element', MyElement);
    }
}

// ✅ DO: Use pixEngine for templates
render() {
    this.innerHTML = pixEngine(template, { data: this._data });
}

// ✅ DO: Use registerStylesheet for CSS
static {
    registerStylesheet(styles);  // Uses adoptedStyleSheets API
}

// ❌ DON'T: Use Shadow DOM
this.attachShadow({mode: 'open'});  // ❌ NO

// ❌ DON'T: Use <template> tag
const template = document.createElement('template');  // ❌ NO

// ❌ DON'T: Define custom elements without static block
customElements.define('my-element', MyElement);  // ❌ Must be in static block
```

---

## Services Architecture

### Available Services

| Service | Import | Purpose |
|---------|--------|---------|
| `i18n` | `import { i18n } from '../services/index.js'` | Translations |
| `storage` | `import { storage } from '../services/index.js'` | IndexedDB |
| `pixEngine` | `import { pixEngine } from '../services/index.js'` | Template engine |
| `escapeHtml` | `import { escapeHtml } from '../services/index.js'` | XSS prevention |
| `registerStylesheet` | `import { registerStylesheet } from '../services/index.js'` | CSS injection |

### i18n Service
```javascript
// Get translation
const text = i18n.t('keyName');

// Set language
i18n.setLanguage('it');

// Check RTL
if (i18n.isRTL()) { /* ... */ }

// Get current language info
const { code, name, flag, isRTL } = i18n.getCurrentLanguage();
```

### Storage Service
```javascript
// Initialize (once at app start)
await storage.init();

// Singers CRUD
const singers = await storage.getAllSingers();
const id = await storage.addSinger({ name: 'John' });
await storage.updateSinger(id, { name: 'John Doe' });
await storage.deleteSinger(id);

// Songs CRUD
const songs = await storage.getAllSongs();
const songId = await storage.addSong({ 
    title: 'My Song',
    singerIds: [1, 2]  // Multi-singer support
});

// Performances
await storage.addPerformance({ songId, singerId, rating: 4.5 });
const performances = await storage.getAllPerformances();
```

---

## CSS Rules

### Design System
- **ALL** colors must use CSS variables with `light-dark()` function
- **ALL** spacing must use design system tokens
- **ALL** typography must use design system scales
- Use CSS `@layer` for cascade control

```css
/* ✅ DO: Use CSS variables with light-dark() */
.my-element {
    color: var(--color-text);
    background: var(--color-surface);
    padding: var(--spacing-md);
    font-size: var(--font-size-base);
}

/* ❌ DON'T: Hardcode values */
.my-element {
    color: #333;           /* ❌ NO */
    padding: 16px;         /* ❌ NO */
    font-size: 1rem;       /* ❌ NO */
}
```

### Theme Support
```css
/* Use color-scheme and light-dark() */
:root {
    color-scheme: light dark;
    --color-bg: light-dark(#ffffff, #0a0a0a);
    --color-text: light-dark(#1a1a1a, #f0f0f0);
}
```

### CSS Layers
```css
/* Layer order (cascade priority) */
@layer reset, foundations, layout, utilities;

@layer reset {
    /* CSS reset rules */
}

@layer foundations {
    /* Design tokens, variables */
}

@layer layout {
    /* Page structure, grid */
}

@layer utilities {
    /* Utility classes, buttons */
}
```

### Component CSS
Component CSS is injected via `registerStylesheet()` which uses `adoptedStyleSheets`:
```javascript
import styles from 'bundle-text:./Component.css';

static {
    registerStylesheet(styles);  // Added to document.adoptedStyleSheets
}
```

---

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
```

### Accessibility
- Always include `alt` attributes on images
- Use `aria-label` for icon buttons
- Include `aria-required` on required form fields
- Maintain proper heading hierarchy (h1 → h2 → h3)
- Test keyboard navigation
- Use native `<dialog>` for modals

---

## Storage Rules

### IndexedDB Structure
```javascript
// Three object stores
{
    singers: {
        id: Number,           // Auto-generated, primary key
        name: String,         // Required, unique
        createdAt: Number,    // Unix timestamp
        sortOrder: Number     // For rotation ordering
    },
    songs: {
        id: Number,           // Auto-generated, primary key
        title: String,        // Required
        author: String,       // Optional
        singerIds: Number[],  // Array of singer IDs (1+)
        key: String,          // Key adjustment (-6 to +6)
        youtubeUrl: String,   // Optional
        status: String,       // 'queued' | 'archived'
        createdAt: Number,
        completedAt: Number
    },
    performances: {
        id: Number,           // Auto-generated, primary key
        songId: Number,       // Reference to song
        singerId: Number,     // One record per singer
        songTitle: String,    // Denormalized
        singerName: String,   // Denormalized
        rating: Number,       // 1-5, optional
        performedAt: Number
    }
}
```

---

## Event System

### Custom Events
Use `CustomEvent` for component communication:

```javascript
// Dispatch event
window.dispatchEvent(new CustomEvent('song-added', {
    detail: { song }
}));

// Listen for event
window.addEventListener('song-added', (e) => {
    const { song } = e.detail;
    this.render();
});
```

### Standard Events

| Event | Payload | Description |
|-------|---------|-------------|
| `storage-ready` | `{}` | IndexedDB initialized |
| `singer-added` | `{ singer }` | New singer created |
| `singer-updated` | `{ singer }` | Singer modified |
| `singer-deleted` | `{ id }` | Singer removed |
| `song-added` | `{ song }` | New song in queue |
| `song-completed` | `{ song, performances }` | Song finished |
| `language-changed` | `{ lang }` | Language switched |
| `color-scheme-changed` | `{ scheme }` | Theme changed |

---

## Error Handling

```javascript
// ✅ DO: Always handle errors in async functions
async function loadData() {
    try {
        const data = await storage.getAllSingers();
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        // Show user-friendly message
    }
}
```

---

## Git Rules

### Commit Messages
- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove)
- Reference milestone: `[M1] Add storage service`

### Branches
- Format: `feature/m[number]-[feature-name]`
- Example: `feature/m2-singer-list`

---

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
- Define custom elements outside static blocks

---

## Resources

### Web APIs Documentation
- [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [adoptedStyleSheets](https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets)
- [color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)
- [light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark)

### Tools
- [Parcel.js Docs](https://parceljs.org/)
- [Biome](https://biomejs.dev/) - Linting & formatting

# Copilot Instructions for Karaoke Tracker

## ⚠️ IMPORTANT: Documentation Source of Truth

**The `/docs` folder is the ONLY source of truth for this project's documentation.**

### MANDATORY documents to consult on EVERY prompt:

1. **`docs/RULES.md`** - Development rules and general guidelines
2. **`docs/coding-styleguides/`** - Language-specific code conventions:
   - `javascript.md` - JavaScript standards
   - `css.md` - CSS standards and conventions
   - `html.md` - HTML standards and semantics
   - `a11y.md` - Accessibility standards

### Before every code change:
- ✅ ALWAYS consult `docs/RULES.md`
- ✅ Consult relevant coding styleguides in `docs/coding-styleguides/`
- ✅ Respect ALL documented conventions
- ✅ Do not make assumptions that contradict the documentation

---

## Project Overview
Simple Karaoke Singers list tracker built with modern web technologies. This application allows users to manage a queue of karaoke singers with customizable images and notes, with data persistence using IndexedDB.

## Technology Stack
- **Bundler**: Parcel.js (v2+)
- **Styling**: Vanilla CSS with a custom design system
- **JavaScript**: Vanilla JS using Custom Elements v1 API
- **Storage**: IndexedDB for persistent data storage
- **Deployment**: GitHub Actions to GitHub Pages

## Quick Reference (see docs/ for full details)

### Architecture Principles
- Custom Elements v1 API - **NO Shadow DOM**, **NO `<template>` tags**
- Components: `SingerForm`, `SingerList`, `SingerCard`
- Storage: IndexedDB via `StorageService` class

### Development Commands
- Use **pnpm** for all installs and scripts
- `pnpm start` - Start development server
- `pnpm run build` - Build for production
- `pnpm test` - Run tests

## Documentation Structure

```
/docs
  ├── RULES.md                    # Development rules (ALWAYS consult)
  ├── PROJECT_STRUCTURE.md        # Project structure
  ├── FUNCTIONAL_ANALYSIS.md      # Functional analysis
  ├── ROADMAP.md                  # Roadmap with milestones
  └── coding-styleguides/
      ├── javascript.md           # JavaScript standards
      ├── css.md                  # CSS standards
      ├── html.md                 # HTML standards
      └── a11y.md                 # Accessibility standards
```

## When Making Changes

1. **FIRST**: Read `docs/RULES.md` and relevant styleguides
2. Keep changes minimal and focused
3. Test in the browser after changes
4. Ensure accessibility is maintained
5. Follow the documented code style
6. Update docs if architecture changes
