# Project Structure

## Overview

Karaoke Tracker is a single-page web application for managing karaoke queues. It uses modern web technologies without frameworks, following a "vanilla" approach with internationalization (i18n) and theme support.

---

## Directory Structure

```
karaoke-tracker/
├── .github/
│   ├── copilot-instructions.md   # GitHub Copilot instructions
│   └── workflows/                 # GitHub Actions for CI/CD
│
├── docs/                          # 📚 DOCUMENTATION SOURCE OF TRUTH
│   ├── RULES.md                   # Development rules
│   ├── PROJECT_STRUCTURE.md       # This file
│   ├── FUNCTIONAL_ANALYSIS.md     # Functional analysis
│   ├── ROADMAP.md                 # Roadmap and milestones
│   └── coding-styleguides/        # Code conventions
│       ├── javascript.md          # JavaScript standards
│       ├── css.md                 # CSS standards
│       ├── html.md                # HTML standards
│       └── a11y.md                # Accessibility standards
│
├── src/                           # 📁 SOURCE CODE
│   ├── index.html                 # HTML entry point
│   ├── styles/
│   │   └── index.css              # Main CSS with @layer (reset, foundations, layout)
│   ├── assets/
│   │   └── i18n/                  # Translation files (JSON)
│   │       ├── en.json            # English translations
│   │       ├── it.json            # Italian translations
│   │       ├── fr.json            # French translations
│   │       ├── de.json            # German translations
│   │       ├── es.json            # Spanish translations
│   │       ├── zh.json            # Chinese translations
│   │       ├── ja.json            # Japanese translations
│   │       └── ar.json            # Arabic translations (RTL)
│   └── scripts/
│       ├── index.js               # App entry point & initialization
│       ├── services/              # Business logic services
│       │   ├── index.js           # Services barrel export
│       │   ├── I18nService.js     # Language management
│       │   ├── ThemeService.js    # Theme management
│       │   └── StorageService.js  # IndexedDB storage
│       └── components/            # Custom Elements (folder per component)
│           ├── index.js           # Components barrel export
│           ├── BaseDialog/
│           │   ├── BaseDialog.js  # Base dialog component
│           │   └── BaseDialog.css # Base dialog styles
│           ├── StarRating/
│           │   ├── StarRating.js  # Star rating component
│           │   └── StarRating.css # Star rating styles
│           ├── SingerCard/
│           │   ├── SingerCard.js  # Singer card component
│           │   └── SingerCard.css # Singer card styles
│           ├── SingerForm/
│           │   ├── SingerForm.js  # Add singer form
│           │   └── SingerForm.css # Singer form styles
│           ├── SingerList/
│           │   ├── SingerList.js  # Singers list
│           │   └── SingerList.css # Singers list styles
│           └── SingerLeaderboard/
│               ├── SingerLeaderboard.js  # Leaderboard component
│               └── SingerLeaderboard.css # Leaderboard styles
│
├── dist/                          # 📦 Production build (generated)
│
├── .prettierrc                    # Prettier config (HTML, CSS, JSON)
├── .prettierignore                # Prettier ignore (JS files)
├── biome.json                     # Biome config (JS linting & formatting)
├── package.json                   # Project scripts & metadata (pnpm-managed)
├── pnpm-lock.yaml                 # pnpm lock file
├── pnpm-workspace.yaml            # pnpm workspace configuration
├── LICENSE                        # MIT License
└── README.md                      # Main documentation
```

---

## Source Files (`/src`)

### `index.html`
Application entry point. Contains:
- Meta tags for SEO and viewport
- Semantic HTML5 structure (`<header>`, `<main>`, `<footer>`)
- Header controls (auto re-add, theme switcher, language selector)
- Custom elements placeholders (`<singer-form>`, `<singer-list>`, `<singer-leaderboard>`)
- Dialog modals for confirmations (example list, reset, remove, done, edit)
- `data-i18n` attributes for translatable text
- CSS and JavaScript links

### `styles/index.css`
Main stylesheet using CSS `@layer` for cascade control:
- **`@layer reset`** - Modern CSS reset
- **`@layer foundations`** - Design tokens and CSS variables:
  - Colors (primary, secondary, success, danger, neutrals)
  - Spacing scale (xs → 2xl)
  - Typography (font family, sizes)
  - Border radius and shadows
  - Dark theme via `[data-theme="dark"]`
  - System theme via `@media (prefers-color-scheme: dark)`
  - RTL support via `[dir="rtl"]` selectors
- **`@layer layout`** - Page structure (header, main, footer, sections)
- **`@layer utilities`** - Buttons and utility classes

### Component CSS (in each component folder)
Each component has its own CSS file that is:
- Imported using Parcel's `bundle-text:` import
- Injected into `document.head` via `<style data-component="...">` tag
- Loaded once per component via static initialization block

### `assets/i18n/*.json`
Translation files for each supported language:
- One JSON file per language (e.g., `en.json`, `it.json`)
- Contains all translatable strings as key-value pairs
- Imported by `I18nService` at runtime

### `scripts/index.js`
Application entry point (~250 lines):
- Imports all services and components
- Contains sample data for example list
- `showConfirmDialog()` helper function
- `initApp()` function for application initialization
- Event handlers for dialogs and buttons

### `scripts/services/`
Business logic services (modular):
- **`I18nService.js`** - Language management with RTL support
  - Imports translation JSON files
  - `setLanguage()`, `t()`, `updatePage()`, `isRTL()`
- **`ThemeService.js`** - Theme management (light/dark/system)
  - `setTheme()`, `updateButtons()`, `init()`
- **`StorageService.js`** - IndexedDB management (v2, 2 stores)
  - CRUD operations for singers and performances
- **`index.js`** - Barrel export for all services

### `scripts/components/`
Custom Elements (folder per component with CSS):
- **`BaseDialog/`** - Base dialog component and shared dialog styles
- **`StarRating/`** - Star rating component (0-5, half-star)
- **`SingerCard/`** - Single singer card with actions
- **`SingerForm/`** - Add singer form
- **`SingerList/`** - Singers list container
- **`SingerLeaderboard/`** - Ranked performances display
- **`index.js`** - Barrel export for all components

Each component folder contains:
- `ComponentName.js` - Component logic with static initialization block
- `ComponentName.css` - Component-specific styles (imported via `bundle-text:`)

---

## CSS Architecture

### Layer Structure (`styles/index.css`)
```css
@layer reset, foundations, layout, utilities;
```

| Layer | Purpose |
|-------|---------|
| `reset` | Modern CSS reset for consistent base styling |
| `foundations` | Design tokens, custom properties, theme variables |
| `layout` | Page structure, header, main, footer, sections |
| `utilities` | Buttons and common utility classes |

### Component CSS Injection
Components inject their CSS into `document.head` using:
```javascript
import styles from 'bundle-text:./ComponentName.css';

static {
    const styleSheet = document.createElement('style');
    styleSheet.setAttribute('data-component', 'component-name');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    customElements.define('component-name', this);
}
```

---

## Architecture

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           index.html                                 │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                         <header>                               │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │               .header-controls                           │  │  │
│  │  │  [Auto Re-add] [Theme Switcher] [Language Select]       │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │               App Title & Subtitle                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                          <main>                                │  │
│  │  ┌─────────────────────────┐ ┌─────────────────────────────┐  │  │
│  │  │    .singers-section     │ │    .add-singer-section      │  │  │
│  │  │  ┌───────────────────┐  │ │  ┌───────────────────────┐  │  │  │
│  │  │  │   <singer-list>   │  │ │  │    <singer-form>      │  │  │  │
│  │  │  │ ┌───────────────┐ │  │ │  └───────────────────────┘  │  │  │
│  │  │  │ │ <singer-card> │ │  │ │  ┌───────────────────────┐  │  │  │
│  │  │  │ │ <star-rating> │ │  │ │  │ <singer-leaderboard>  │  │  │  │
│  │  │  │ └───────────────┘ │  │ │  └───────────────────────┘  │  │  │
│  │  │  └───────────────────┘  │ │                             │  │  │
│  │  └─────────────────────────┘ └─────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                         <footer>                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    <dialog> modals                             │  │
│  │  [Example List] [Reset] [Remove] [Done] [Edit]                │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
┌──────────────┐      Custom Events       ┌──────────────┐
│  SingerForm  │ ─────────────────────▶  │  SingerList  │
│              │    'singer-added'        │              │
└──────────────┘                          └──────────────┘
       │                                         │
       │                                         │
       ▼                                         ▼
┌────────────────────────────────────────────────────────┐
│                    StorageService                       │
│                      (IndexedDB)                        │
│            ┌─────────────┬─────────────┐               │
│            │   singers   │ performances│               │
│            └─────────────┴─────────────┘               │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  SingerLeaderboard  │
              │  'performance-added' │
              └─────────────────────┘
```

### Custom Events

| Event Name | Trigger | Listener |
|------------|---------|----------|
| `storage-ready` | App init | SingerList, SingerLeaderboard |
| `singer-added` | Form submit, Auto re-add | SingerList |
| `singer-deleted` | Card remove | SingerList |
| `singer-updated` | Edit save | SingerList |
| `performance-added` | Done with rating | SingerLeaderboard |
| `leaderboard-reset` | Clear all, Example list | SingerLeaderboard |
| `language-changed` | Language select | All components |
| `rating-change` | Star click | SingerCard |

### Services

| Service | Responsibility | Storage |
|---------|---------------|---------|
| `I18nService` | Language management, RTL detection | localStorage |
| `ThemeService` | Theme management (light/dark/system) | localStorage |
| `StorageService` | Data persistence | IndexedDB |

---

## Technology Decisions

### Why Vanilla JS?
- Simplicity and maintainability
- No framework dependencies
- Minimal bundle size
- Optimal performance
- Easy to learn

### Why Custom Elements?
- Native web standard
- Logical encapsulation without Shadow DOM
- Excellent browser compatibility
- No transpiler required

### Why IndexedDB?
- Persistent local storage
- Greater capacity than localStorage
- Asynchronous API
- Support for complex data structures
- Multiple object stores (singers, performances)

### Why Parcel?
- Zero configuration
- Hot module replacement
- Automatic optimized build
- Modern support out-of-the-box

### Why Custom i18n?
- Lightweight solution (~70 lines)
- Modular JSON translation files
- No external dependencies
- localStorage persistence
- RTL support
- Custom event for component updates

### Why Modular Architecture?
- Better code organization and maintainability
- Separation of concerns (services vs components)
- Static initialization blocks for auto-registration
- Barrel exports for clean imports
- Easier testing and debugging

---

## Supported Languages

| Code | Language | RTL |
|------|----------|-----|
| en | English | No |
| it | Italian | No |
| fr | French | No |
| de | German | No |
| es | Spanish | No |
| zh | Chinese | No |
| ja | Japanese | No |
| ar | Arabic | Yes |

---

## Build & Deploy

### Development
```bash
pnpm start          # Start dev server with HMR
```

### Production
```bash
pnpm run build      # Build to /dist
```

### Deploy
- **Target**: GitHub Pages
- **Trigger**: Push to `main` branch
- **CI/CD**: GitHub Actions

---

## Linting & Formatting

### Tools
| Tool | Scope | Config File |
|------|-------|-------------|
| **Biome** | JavaScript linting & formatting | `biome.json` |
| **Prettier** | HTML, CSS, JSON formatting | `.prettierrc` |

### Commands
```bash
pnpm run lint           # Lint JS with Biome
pnpm run lint:fix       # Lint & auto-fix JS with Biome
pnpm run format         # Format HTML, CSS, JSON with Prettier
pnpm run format:check   # Check formatting without changes
```

### Biome Configuration
- Indent: 2 spaces
- Line width: 120
- Semicolons: always
- Quote style: single quotes
- Trailing commas: none

### Prettier Configuration
- Indent: 2 spaces (JSON inherits 2 spaces)
- Line width: 120 (140 for HTML)
- Semicolons: always
- Single quotes: yes
- Trailing commas: none

---

## Conventions Reference

For detailed conventions, consult:
- `docs/RULES.md` - General rules
- `docs/coding-styleguides/javascript.md` - JavaScript
- `docs/coding-styleguides/css.md` - CSS
- `docs/coding-styleguides/html.md` - HTML
- `docs/coding-styleguides/a11y.md` - Accessibility
