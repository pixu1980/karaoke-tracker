# Karaoke Tracker - Project Context

Project-specific guidance for AI assistants (Claude, Copilot, Cursor) working on Karaoke Tracker.

This directory contains **project-specific** conventions, architecture details, and examples. For **generic, reusable** Agent Skills guidance, see [../.ai/README.md](../.ai/README.md).

## Quick start

- **Using Claude API?** See [CLAUDE.md](./CLAUDE.md)
- **Using Copilot Chat?** See [COPILOT.md](./COPILOT.md)
- **Using Cursor IDE?** See [CURSOR.md](./CURSOR.md)

## Project overview

**Karaoke Tracker** is a vanilla JavaScript web app for managing karaoke sessions with:

- Vanilla JS + Custom Elements (no Shadow DOM)
- Parcel bundler with `bundle-text:` loader
- pixEngine templating
- CSS design tokens + light/dark theme
- IndexedDB storage service
- Multi-language i18n (8 languages)

## Key conventions

### Component naming

- **Element tag:** `kt-component-name` (kebab-case)
- **Class name:** `ComponentName` (PascalCase)
- **Directory:** `src/scripts/components/app/ComponentName/`

Example: `kt-song-queue` element, `SongQueue` class

### File structure

```
src/scripts/components/app/ComponentName/
├── ComponentName.js              # Component definition
├── ComponentName.css             # Styles
└── ComponentName.template.html   # Template
```

### Event naming

Custom events use `noun:action` pattern:
- `song:add-request` — User wants to add a song
- `singer:add-request` — User wants to add a singer
- `song:complete` — Song finished
- `rating:submit` — User submitted rating

### Styling

- Use design tokens from `src/styles/index.css`
- Theme colors use `light-dark()` for automatic dark mode
- CSS layers for organization
- Scrollable containers use `flex: 1; min-height: 0;`

### Templates

- `{{ var }}` — Escaped output (safe)
- `{{{ var }}}` — Raw HTML (internal only)
- `<if>`, `<for>`, `<else>` — Control flow

## Architecture patterns

### Component scaffold

```javascript
import styles from 'bundle-text:./ComponentName.css';
import template from 'bundle-text:./ComponentName.template.html';
import { registerStylesheet } from '../../services/index.js';

class ComponentName extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('kt-component-name', this);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = template;
  }

  disconnectedCallback() {
    // Cleanup
  }
}
```

### Storage service

```javascript
import { storage } from '../../services/index.js';

const data = await storage.get('singers');
await storage.set('singers', updatedData);
```

### i18n service

```javascript
import { i18n } from '../../services/index.js';

const text = i18n.get('search_songs');
```

### Event emission

```javascript
this.dispatchEvent(new CustomEvent('song:add-request', {
  detail: { song: this.song },
  bubbles: true,
  composed: true
}));
```

### Real-time filtering

```javascript
#filterText = '';

render() {
  this.innerHTML = template;
  this.querySelector('input').oninput = (e) => {
    this.#filterText = e.target.value.toLowerCase();
    this.updateList();
  };
}

updateList() {
  this.querySelectorAll('li').forEach(li => {
    li.hidden = !li.textContent.toLowerCase().includes(this.#filterText);
  });
}
```

## Design tokens

From `src/styles/index.css`:

**Spacing:** `--spacing-xs` (0.25rem), `--spacing-sm` (0.5rem), `--spacing-md` (1rem), `--spacing-lg` (1.5rem)

**Colors:** `--color-primary`, `--color-text`, `--color-background` (all use `light-dark()`)

**Border radius:** `--radius-sm` (0.25rem), `--radius-md` (0.5rem), `--radius-lg` (1rem)

## Services

- **_stylesheetService.js** — Register component styles via `registerStylesheet()`
- **_storageService.js** — IndexedDB wrapper with `storage.get()`, `storage.set()`
- **_i18nService.js** — Multi-language via `i18n.get('key')`
- **_templateService.js** — pixEngine template engine

## File structure

```
src/
├── index.html
├── assets/
│   ├── i18n/              # Language files (ar, de, en, es, fr, it, ja, zh)
│   └── icons/
├── scripts/
│   ├── components/
│   │   ├── app/           # Feature components (SongQueue, SingerList, etc.)
│   │   ├── dialogs/       # Modal dialogs
│   │   └── ui/            # UI primitives (Dialog, ColorSchemeSwitcher, etc.)
│   ├── services/          # Core services (storage, i18n, etc.)
│   └── polyfills/         # Browser polyfills
└── styles/
    └── index.css          # Design tokens and global styles
```

## Skills reference

Available Agent Skills (see [../.ai/skills/README.md](../.ai/skills/README.md)):

- **component-scaffold** — Component structure and patterns
- **styling-guidelines** — CSS and design system
- **template-engine** — pixEngine templating
- **event-system** — Custom event patterns
- **real-time-filtering** — Client-side search
- **storage-service** — IndexedDB usage
- **accessibility-rules** — a11y compliance
- **testing-components** — Playwright testing

## Project links

- **Rules & conventions:** [../../docs/RULES.md](../../docs/RULES.md)
- **Contributing guide:** [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
- **Development setup:** [../../DEVELOPING.md](../../DEVELOPING.md)
- **Skills:** [../../.ai/skills/README.md](../../.ai/skills/README.md)

## For AI assistants

When working on Karaoke Tracker:

1. **Reference skills** by name (component-scaffold, styling-guidelines, etc.)
2. **Use project conventions** (kt-* elements, noun:action events)
3. **Follow design tokens** (src/styles/index.css)
4. **Use pixEngine syntax** correctly ({{ }}, {{{ }}}, control flow)
5. **Test thoroughly** with Playwright

For generic, reusable guidance applicable to any project, see [../.ai/](../.ai/).
