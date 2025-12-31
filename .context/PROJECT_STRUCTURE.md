# Project Structure

## Overview

Karaoke Tracker is a single-page web application for managing karaoke queues with a **three-column layout**. It uses modern web technologies without frameworks, following a "vanilla" approach with Custom Elements, IndexedDB, internationalization (i18n), and theme support.

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
│       ├── polyfills/             # Browser polyfills
│       │   ├── index.js           # Polyfills barrel export
│       │   └── _customElementsPolyfill.js  # Safari custom elements polyfill
│       ├── services/              # Business logic services
│       │   ├── index.js           # Services barrel export
│       │   ├── _i18nService.js    # Language management
│       │   ├── _storageService.js # IndexedDB storage
│       │   ├── _templateService.js # Template engine (pixEngine)
│       │   └── _stylesheetService.js # CSS injection
│       └── components/            # Custom Elements (folder per component)
│           ├── index.js           # Components barrel export
│           ├── ui/                # Reusable UI components
│           │   ├── index.js
│           │   ├── Dialog/
│           │   │   ├── Dialog.js
│           │   │   └── Dialog.css
│           │   ├── Rating/
│           │   │   ├── Rating.js
│           │   │   ├── Rating.css
│           │   │   └── Rating.template.html
│           │   ├── ColorSchemeSwitcher/
│           │   │   ├── ColorSchemeSwitcher.js
│           │   │   ├── ColorSchemeSwitcher.css
│           │   │   └── ColorSchemeSwitcher.template.html
│           │   └── LanguageSelect/
│           │       ├── LanguageSelect.js
│           │       └── LanguageSelect.css
│           ├── app/               # Application-specific components
│           │   ├── index.js
│           │   ├── SingerList/
│           │   │   ├── SingerList.js
│           │   │   ├── SingerList.css
│           │   │   └── SingerList.template.html
│           │   ├── SingerCard/
│           │   │   ├── SingerCard.js
│           │   │   ├── SingerCard.css
│           │   │   └── SingerCard.template.html
│           │   ├── SongQueue/
│           │   │   ├── SongQueue.js
│           │   │   ├── SongQueue.css
│           │   │   └── SongQueue.template.html
│           │   ├── SongCard/
│           │   │   ├── SongCard.js
│           │   │   ├── SongCard.css
│           │   │   └── SongCard.template.html
│           │   └── Leaderboard/
│           │       ├── Leaderboard.js
│           │       ├── Leaderboard.css
│           │       └── Leaderboard.template.html
│           └── dialogs/           # Dialog components
│               ├── index.js
│               ├── AddSingerDialog/
│               │   ├── AddSingerDialog.js
│               │   ├── AddSingerDialog.css
│               │   └── AddSingerDialog.template.html
│               ├── AddSongDialog/
│               │   ├── AddSongDialog.js
│               │   ├── AddSongDialog.css
│               │   └── AddSongDialog.template.html
│               ├── SongCompleteDialog/
│               │   ├── SongCompleteDialog.js
│               │   ├── SongCompleteDialog.css
│               │   └── SongCompleteDialog.template.html
│               └── ConfirmDialog/
│                   ├── ConfirmDialog.js
│                   ├── ConfirmDialog.css
│                   └── ConfirmDialog.template.html
│
├── dist/                          # 📦 Production build (generated)
│
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
- Meta tags for SEO, viewport, and color-scheme
- Semantic HTML5 structure (`<header>`, `<main>`, `<footer>`)
- Three-column grid layout structure
- Header with logo (left) and actions (right)
- Custom elements placeholders
- `data-i18n` attributes for translatable text
- CSS and JavaScript links

### `styles/index.css`
Main stylesheet using CSS `@layer` for cascade control:
- **`@layer reset`** - Modern CSS reset
- **`@layer foundations`** - Design tokens and CSS variables
- **`@layer layout`** - Three-column grid, header, footer
- **`@layer utilities`** - Buttons and utility classes

### Component Structure
Each component folder contains:
```
ComponentName/
├── ComponentName.js           # Component logic with static initialization
├── ComponentName.css          # Component-specific styles
└── ComponentName.template.html # HTML template (processed by pixEngine)
```

---

## Architecture

### Three-Column Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                              HEADER                                  │
│  [Logo]                    [+ Add Song] [Auto] [🎨] [🌐]             │
├────────────────────┬────────────────────┬───────────────────────────┤
│   SINGERS LIST     │    SONG QUEUE      │      LEADERBOARD          │
│   (Left Column)    │    (Center Column) │      (Right Column)       │
│                    │                    │                           │
│   <singer-list>    │    <song-queue>    │    <leaderboard>          │
│                    │                    │                           │
├────────────────────┴────────────────────┴───────────────────────────┤
│                              FOOTER                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
┌──────────────┐     Custom Events      ┌──────────────┐
│  AddSong     │ ─────────────────────▶ │  SongQueue   │
│  Dialog      │    'song-added'        │              │
└──────────────┘                        └──────────────┘
       │                                       │
       │                                       │ 'song-completed'
       │                                       ▼
       │                                ┌──────────────┐
       │                                │ Leaderboard  │
       │                                └──────────────┘
       │                                       ▲
       ▼                                       │
┌────────────────────────────────────────────────────────┐
│                    StorageService                       │
│                      (IndexedDB)                        │
│      ┌─────────────┬─────────────┬─────────────┐       │
│      │   singers   │    songs    │ performances│       │
│      └─────────────┴─────────────┴─────────────┘       │
└────────────────────────────────────────────────────────┘
```

### Custom Events

| Event Name | Trigger | Listener |
|------------|---------|----------|
| `storage-ready` | App init | All data components |
| `singer-added` | Add singer dialog | SingerList |
| `singer-updated` | Edit singer | SingerList |
| `singer-deleted` | Remove singer | SingerList, SongQueue |
| `song-added` | Add song dialog | SongQueue |
| `song-updated` | Edit song | SongQueue |
| `song-completed` | Done action | Leaderboard, SingerList |
| `song-deleted` | Remove song | SongQueue |
| `singers-rotated` | Auto re-add | SingerList |
| `language-changed` | Language select | All components |
| `color-scheme-changed` | Theme switcher | App |

---

## Custom Elements Pattern

### Component Registration Pattern
All components use a **static initialization block** for auto-registration:

```javascript
import styles from 'bundle-text:./ComponentName.css';
import template from 'bundle-text:./ComponentName.template.html';
import { i18n, pixEngine, registerStylesheet } from '../../services/index.js';

class ComponentName extends HTMLElement {
    static {
        // 1. Register component styles (once, globally)
        registerStylesheet(styles);
        
        // 2. Register custom element
        customElements.define('component-name', ComponentName);
    }
    
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
        
        // Listen for language changes
        window.addEventListener('language-changed', () => this.render());
    }
    
    render() {
        // Use template engine with i18n
        this.innerHTML = pixEngine(template, {
            title: i18n.t('componentTitle'),
            // ... other data
        });
    }
    
    setupEventListeners() {
        // Event delegation on component root
    }
}
```

### Template Engine (pixEngine)
The `pixEngine` function processes HTML templates with:

**Variable interpolation**:
```html
<h1>{{ title }}</h1>
<p>{{ user.name }}</p>
```

**Conditionals**:
```html
<if condition="isVisible">
    <div>Visible content</div>
</if>
<else>
    <div>Hidden content</div>
</else>
```

**Loops**:
```html
<for each="index, item in items">
    <li data-index="{{ index }}">{{ item.name }}</li>
</for>
```

---

## Services

### I18nService (`_i18nService.js`)
- Manages translations for 8 languages
- RTL support for Arabic
- `i18n.t(key)` for translations
- `i18n.setLanguage(code)` to switch language
- Dispatches `language-changed` event

### StorageService (`_storageService.js`)
- IndexedDB wrapper with 3 stores: `singers`, `songs`, `performances`
- CRUD operations for each entity
- Async/Promise-based API

### TemplateService (`_templateService.js`)
- `pixEngine(template, data)` - Template rendering
- `escapeHtml(text)` - XSS prevention
- Supports loops, conditionals, nested data

### StylesheetService (`_stylesheetService.js`)
- `registerStylesheet(css)` - Injects CSS using `adoptedStyleSheets`
- Ensures styles are loaded once per component

---

## CSS Architecture

### Layer Structure
```css
@layer reset, foundations, layout, utilities;
```

| Layer | Purpose |
|-------|---------|
| `reset` | Modern CSS reset for consistent base styling |
| `foundations` | Design tokens, custom properties, theme variables |
| `layout` | Three-column grid, header, footer, sections |
| `utilities` | Buttons, forms, and common utility classes |

### Theme Support
Uses CSS `color-scheme` property and `light-dark()` function:
```css
:root {
    color-scheme: light dark;
    --color-bg: light-dark(#ffffff, #1a1a1a);
    --color-text: light-dark(#1a1a1a, #ffffff);
}
```

---

## Technology Decisions

| Decision | Rationale |
|----------|-----------|
| **Vanilla JS** | Simplicity, no framework overhead, optimal performance |
| **Custom Elements v1** | Native web standard, logical encapsulation without Shadow DOM |
| **IndexedDB** | Persistent local storage with complex data support |
| **Parcel.js** | Zero-config bundler with HMR |
| **CSS Layers** | Explicit cascade control |
| **Static Blocks** | Clean component auto-registration |

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
pnpm install     # Install dependencies
pnpm start       # Start dev server with HMR
```

### Production
```bash
pnpm run build   # Build to /dist
```

### Deploy
- **Target**: GitHub Pages
- **Trigger**: Push to `main` branch
- **CI/CD**: GitHub Actions
