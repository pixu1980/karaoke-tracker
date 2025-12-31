# Claude Instructions - Karaoke Tracker

Project-specific context and conventions for Claude API integration.

## Project overview

**Karaoke Tracker** is a vanilla JavaScript web app for managing karaoke sessions:

- **Frontend:** Custom Elements (no Shadow DOM), Parcel bundler
- **Template engine:** pixEngine (escaped `{{ var }}` and raw `{{{ var }}}`)
- **Styling:** CSS design tokens, CSS layers, light/dark mode via `light-dark()`
- **Storage:** IndexedDB wrapper (`storage` service)
- **i18n:** Multi-language support (ar, de, en, es, fr, it, ja, zh)
- **Events:** Custom events with `noun:action` pattern (e.g., `song:add-request`)

## Code examples and conventions

### Component creation (component-scaffold skill)

Key Karaoke Tracker conventions:
- Import styles and templates via `bundle-text:` (Parcel loader)
- Register stylesheet in static block: `registerStylesheet(styles)`
- Define custom element: `customElements.define('kt-component-name', ComponentName)`
- Emit events: `this.dispatchEvent(new CustomEvent('noun:action', { detail: {...} }))`
- Clean up listeners in `disconnectedCallback()`

**Example:**

```javascript
// src/scripts/components/app/SongQueue/SongQueue.js
import styles from 'bundle-text:./SongQueue.css';
import template from 'bundle-text:./SongQueue.template.html';
import { registerStylesheet, i18n } from '../../services/index.js';

class SongQueue extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('kt-song-queue', this);
  }

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

  handleSongSelect(song) {
    this.dispatchEvent(new CustomEvent('song:select', { 
      detail: { song },
      bubbles: true,
      composed: true
    }));
  }
}
```

### Styling (styling-guidelines skill)

- Use tokens from `src/styles/index.css` (spacing, colors, radii)
- Component-specific CSS in `ComponentName/ComponentName.css`
- For scrollable content in flex: `flex: 1; min-height: 0;` on parent
- Use `light-dark()` for theme colors
- Prefer element/attribute selectors (no utility classes)
- CSS layers: `@layer base`, `@layer components`, `@layer utilities`

**Example:**

```css
/* src/styles/index.css excerpt */
:root {
  /* spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  
  /* colors */
  --color-primary: light-dark(#007bff, #0d6efd);
  --color-text: light-dark(#000, #fff);
  
  /* border-radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}

@layer components {
  button {
    border-radius: var(--radius-md);
    padding: var(--spacing-sm) var(--spacing-md);
    color: var(--color-text);
  }
}
```

### Templates (template-engine skill)

- `{{ var }}` — escaped (safe for user input)
- `{{{ var }}}` — raw HTML (SVGs, internal markup only)
- `<if condition="...">`, `<for list="..." as="item">`, `<else>` for control flow

**Example:**

```html
<!-- SongQueue.template.html -->
<div class="song-queue">
  <input type="text" placeholder="{{ i18n.get('search_songs') }}" aria-label="Search songs">
  <ul>
    <for list="songs" as="song">
      <li data-id="{{ song.id }}">
        <h3>{{ song.title }}</h3>
        <p>{{ song.artist }}</p>
        <button onclick="this.dispatchSongSelect('{{ song.id }}')">
          {{ i18n.get('add_to_queue') }}
        </button>
      </li>
    </for>
  </ul>
  <if condition="songs.length === 0">
    <p>{{ i18n.get('no_songs_found') }}</p>
  </if>
</div>
```

### Real-time filtering (real-time-filtering skill)

Karaoke Tracker pattern:
- Attach `input.oninput` handler in `render()`
- Toggle `li.hidden = true/false` instead of modifying DOM structure
- Keep `_filterText` state on component instance
- Applied to: SongQueue, SingerList, Leaderboard

**Example:**

```javascript
class SingerList extends HTMLElement {
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
      const name = li.querySelector('h3').textContent.toLowerCase();
      li.hidden = !name.includes(this.#filterText);
    });
  }
}
```

### Storage service (_storageService.js)

Karaoke Tracker uses IndexedDB for persistence:

```javascript
import { storage } from '../../services/index.js';

// Get all singers
const singers = await storage.get('singers');

// Add a song to queue
await storage.set('queue', [...currentQueue, newSong]);

// Clear session data
await storage.clear();
```

### Events (event-system skill)

Karaoke Tracker uses `noun:action` pattern:
- `song:add-request` — user wants to add a song
- `singer:add-request` — user wants to add a singer
- `song:complete` — song performance finished
- `rating:submit` — user submitted a rating

**Example:**

```javascript
class SongCard extends HTMLElement {
  onAddClick() {
    this.dispatchEvent(new CustomEvent('song:add-request', {
      detail: { song: this.song },
      bubbles: true,
      composed: true
    }));
  }
}
```

### i18n (i18nService)

Multi-language strings in `src/assets/i18n/*.json`:

```javascript
import { i18n } from '../../services/index.js';

const placeholder = i18n.get('search_songs'); // Returns translated string
```

## Component naming

- **Element tag:** `kt-component-name` (lowercase, hyphenated)
- **Class name:** `ComponentName` (PascalCase)
- **File structure:**
  ```
  src/scripts/components/app/ComponentName/
  ├── ComponentName.js
  ├── ComponentName.css
  └── ComponentName.template.html
  ```

## Skill usage examples

### When creating a new component (component-scaffold skill)

1. Create directory: `src/scripts/components/app/NewComponent/`
2. Create `NewComponent.js` with static block for `registerStylesheet()` and `customElements.define()`
3. Create `NewComponent.css` using design tokens from `src/styles/index.css`
4. Create `NewComponent.template.html` with pixEngine syntax
5. Implement `render()` method and event handlers

### When adding filtering (real-time-filtering skill)

1. Add `<input>` to template with `data-filter` attribute
2. Attach `input.oninput` handler in `render()`
3. Implement `updateList()` to toggle `li.hidden`
4. Keep `_filterText` state on component

### When styling (styling-guidelines skill)

1. Check `src/styles/index.css` for available design tokens
2. Use `var(--color-primary)`, `var(--spacing-md)`, etc. in component CSS
3. Use `light-dark()` for theme-aware colors
4. Apply CSS layers: `@layer components` for component styles
5. Ensure scrollable containers use `flex: 1; min-height: 0;` pattern

## Testing (testing-components skill)

Karaoke Tracker uses Playwright for E2E tests. Key patterns:
- Test component rendering with sample data
- Test event emission (e.g., `song:add-request`)
- Test filtering behavior
- Test accessibility (keyboard navigation, aria-labels)

**Example test:**

```javascript
// tests/components/SongQueue.spec.js
import { test, expect } from '@playwright/test';

test('SongQueue filters songs by title', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const queue = await page.locator('kt-song-queue');
  const input = await queue.locator('input');
  
  // Type in filter
  await input.fill('hello');
  
  // Check hidden items
  const items = await queue.locator('li');
  const visible = await items.filter({ has: page.locator('[hidden]').nth(0) }).count();
  
  expect(visible).toBeLessThan(await items.count());
});
```

## Recommendations for Claude

1. **Always reference skills:** When creating components, mention component-scaffold skill
2. **Use project conventions:** Custom Elements naming (`kt-`), event naming (`noun:action`)
3. **Design tokens:** Every CSS change should use tokens from `src/styles/index.css`
4. **pixEngine syntax:** Remember escaped vs. raw output, control flow tags
5. **Testing:** Suggest Playwright tests for critical features

## See also

- Generic guidance: [.ai/CLAUDE.md](../.ai/CLAUDE.md)
- Skills reference: [.ai/skills/README.md](../.ai/skills/README.md)
- Project rules: [RULES.md](../docs/RULES.md)
