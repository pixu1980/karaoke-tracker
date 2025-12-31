# Cursor IDE Instructions - Karaoke Tracker

Project-specific context for Cursor IDE.

## Karaoke Tracker setup

**Tech stack:**
- Vanilla JS, Custom Elements
- Parcel bundler with `bundle-text:` loader
- pixEngine template engine
- CSS design tokens + light/dark theme
- IndexedDB storage
- Multi-language i18n

## Component conventions

- **Element tag:** `kt-component-name` (e.g., `kt-song-queue`)
- **Class name:** `ComponentName` (PascalCase)
- **File structure:** `src/scripts/components/app/ComponentName/`
  - `.js` — Component definition and registration
  - `.css` — Styles with design tokens
  - `.template.html` — pixEngine template

## Cursor skill prompts

### Generate component

```
Generate a new component from the component-scaffold skill:
- Name: ComponentName (class), kt-component-name (element)
- Purpose: [describe what it does]
- Features: [feature list]
- Events: [events using noun:action pattern]

Follow Karaoke Tracker conventions:
- Use registerStylesheet(styles) in static block
- Import via bundle-text:
- Use src/styles/index.css design tokens
- Clean up listeners in disconnectedCallback()
```

### Refactor component

```
Refactor [file] using the [skill-name] skill.

Ensure:
- Design token compliance (src/styles/index.css)
- pixEngine template syntax correctness
- Event naming follows noun:action pattern
- Accessibility best practices
```

### Add filtering

```
Add real-time filtering to [component] using real-time-filtering skill.

Apply pattern:
- input.oninput handler in render()
- Toggle li.hidden instead of modifying DOM
- Keep _filterText state on component
```

## Cursor workspace hints

### Code completion context

Cursor learns from:
- Component examples in `src/scripts/components/app/`
- Design tokens in `src/styles/index.css`
- pixEngine templates (`.template.html` files)
- Skill references in `.ai/skills/*/references/`

### Symbol definitions

Common Karaoke Tracker symbols:
- `registerStylesheet()` — `src/scripts/services/_stylesheetService.js`
- `pixEngine` — `src/scripts/services/_templateService.js`
- `storage` — `src/scripts/services/_storageService.js`
- `i18n` — `src/scripts/services/_i18nService.js`

### Recommended Cursor settings

```json
{
  "cursor.autocomplete.useLongContext": true,
  "cursor.indexing.includeGlobs": [
    "src/scripts/**",
    "src/styles/**",
    ".ai/skills/**"
  ],
  "cursor.documentation.paths": [
    ".ai/",
    ".context/"
  ]
}
```

## Code patterns

### Component template

```javascript
// src/scripts/components/app/ComponentName/ComponentName.js
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
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Attach listeners here
  }

  disconnectedCallback() {
    // Clean up listeners
  }
}
```

### Emit event pattern

```javascript
// Emit with noun:action naming
this.dispatchEvent(new CustomEvent('song:add-request', {
  detail: { song: this.song },
  bubbles: true,
  composed: true
}));
```

### Storage pattern

```javascript
import { storage } from '../../services/index.js';

// Get data
const singers = await storage.get('singers');

// Save data
await storage.set('singers', updatedSingers);
```

### i18n pattern

```javascript
import { i18n } from '../../services/index.js';

const translatedText = i18n.get('key_name');
```

### Filtering pattern

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

**From `src/styles/index.css`:**

```css
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem

--color-primary: light-dark(#007bff, #0d6efd)
--color-text: light-dark(#000, #fff)
--color-background: light-dark(#fff, #1a1a1a)

--radius-sm: 0.25rem
--radius-md: 0.5rem
--radius-lg: 1rem
```

## Testing with Cursor

Use testing-components skill to generate Playwright tests:

```
Generate Playwright tests for [component] covering:
- Rendering with sample data
- Event emission (e.g., song:add-request)
- Filtering behavior
- Accessibility (aria-labels, keyboard nav)

Use the testing-components skill.
```

## Project paths

- **Components:** `src/scripts/components/app/`
- **Services:** `src/scripts/services/`
- **Styles:** `src/styles/index.css`
- **i18n:** `src/assets/i18n/`
- **Skills:** `.ai/skills/`
- **Tests:** `tests/` (Playwright)

## Cursor commands

- **Open symbol:** Cmd+K Cmd+O (jump to `.ai/skills/*/SKILL.md`)
- **Search skill:** Cmd+P `.ai/skills/component-scaffold/`
- **View definition:** Cmd+Click on `registerStylesheet`, `storage`, etc.

## See also

- Generic Cursor guidance: [.ai/CURSOR.md](../.ai/CURSOR.md)
- Claude instructions: [CLAUDE.md](./CLAUDE.md)
- Copilot instructions: [COPILOT.md](./COPILOT.md)
- Skills reference: [.ai/skills/README.md](../.ai/skills/README.md)
