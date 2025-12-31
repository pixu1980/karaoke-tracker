# Copilot Instructions - Karaoke Tracker

Project-specific context for GitHub Copilot in VS Code.

## Karaoke Tracker context

**Tech stack:**
- Vanilla JS, Custom Elements (no Shadow DOM)
- Parcel bundler with `bundle-text:` loader
- pixEngine template syntax (`{{ }}` escaped, `{{{ }}}` raw)
- CSS design tokens, light/dark theme
- IndexedDB storage service
- Multi-language i18n

## Component naming and structure

- **Element tags:** `kt-*` prefix (e.g., `kt-song-queue`, `kt-singer-card`)
- **Directory structure:** `src/scripts/components/app/ComponentName/`
  - `ComponentName.js` — Component class and registration
  - `ComponentName.css` — Styles using design tokens
  - `ComponentName.template.html` — pixEngine template

## File-specific Copilot hints

### For new components

**Prompt template:**

```
Create a new component named <ComponentName> for [feature] using the component-scaffold skill.

Requirements:
- Element name: kt-component-name (kebab-case)
- Features: [feature list]
- Events to emit: [event names using noun:action pattern]

Follow Karaoke Tracker conventions:
- Use registerStylesheet(styles) in static block
- Import styles and templates via bundle-text:
- Use design tokens from src/styles/index.css
- Clean up listeners in disconnectedCallback()
```

**Example:**

```
Create a new component named SongStats for displaying song performance metrics using the component-scaffold skill.

Requirements:
- Element name: kt-song-stats
- Display: Song title, play count, average rating
- Features: Filter by date range, real-time search
- Events: rating:submit when user rates a song

Follow Karaoke Tracker conventions:
- Use registerStylesheet(styles) in static block
- Use design tokens from src/styles/index.css
- Implement real-time filtering using input.oninput
- Use light-dark() for theme colors
```

### For styling updates

```
Update CSS for <component> to:
- [styling goal 1]
- [styling goal 2]

Reference styling-guidelines skill and ensure:
- Use design tokens from src/styles/index.css
- Apply CSS layers for component styles
- Use light-dark() for theme-aware colors
```

### For template improvements

```
Refactor the template for <component> to:
- [improvement 1]
- [improvement 2]

Use template-engine skill and follow pixEngine conventions:
- {{ var }} for escaped output
- {{{ var }}} for raw HTML
- <if>, <for>, <else> for control flow
```

### For filtering

```
Add real-time filtering to <component> list using real-time-filtering skill.

Pattern:
- Add <input> to template
- Attach input.oninput handler in render()
- Toggle li.hidden instead of modifying DOM
- Keep _filterText state on component
```

## Common component patterns

### Event emission (event-system skill)

```javascript
// Emit song:add-request event
this.dispatchEvent(new CustomEvent('song:add-request', {
  detail: { song: this.song },
  bubbles: true,
  composed: true
}));

// Emit rating:submit event
this.dispatchEvent(new CustomEvent('rating:submit', {
  detail: { songId: this.songId, rating: 5 },
  bubbles: true,
  composed: true
}));
```

### Using storage service

```javascript
import { storage } from '../../services/index.js';

// Get data
const singers = await storage.get('singers');

// Save data
await storage.set('singers', updatedSingers);

// Clear storage
await storage.clear();
```

### Using i18n service

```javascript
import { i18n } from '../../services/index.js';

// Get translated string
const label = i18n.get('add_song');
const placeholder = i18n.get('search_songs');
```

### Scrolling and layout

For scrollable content in flex containers:

```css
/* Parent container */
.song-list {
  display: flex;
  flex-direction: column;
  max-height: 500px;
}

/* Scrollable child */
.song-list ul {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
```

## Copilot Chat examples

### "Create a new singer stats component"

Copilot should suggest:
1. Create `src/scripts/components/app/SingerStats/` directory
2. Create `SingerStats.js` with:
   - Import styles and template via `bundle-text:`
   - `registerStylesheet(styles)` in static block
   - `customElements.define('kt-singer-stats', this)`
3. Create `SingerStats.css` using `src/styles/index.css` tokens
4. Create `SingerStats.template.html` with pixEngine syntax

### "Add filtering to the song queue"

Copilot should reference real-time-filtering skill and suggest:
1. Add `<input type="text">` to template
2. Attach `input.oninput` in `render()`
3. Implement `updateList()` to toggle `li.hidden`
4. Keep `_filterText` state variable

### "Fix styling for dark mode"

Copilot should reference styling-guidelines skill and suggest:
1. Check `src/styles/index.css` for color tokens
2. Replace hardcoded colors with `light-dark()` function
3. Use `var(--color-text-dark)`, `var(--color-bg-dark)`, etc.

## Design token reference

From `src/styles/index.css`:

**Spacing:**
- `--spacing-xs`: 0.25rem
- `--spacing-sm`: 0.5rem
- `--spacing-md`: 1rem
- `--spacing-lg`: 1.5rem

**Colors:**
- `--color-primary`: Theme-aware primary color
- `--color-text`: Text color (dark on light, light on dark)
- `--color-background`: Background color

**Border radius:**
- `--radius-sm`: 0.25rem
- `--radius-md`: 0.5rem
- `--radius-lg`: 1rem

## Testing hints

For testing-components skill:

```
Generate Playwright tests for <component> covering:
- Rendering with sample data
- Event emission (e.g., song:add-request)
- Filtering behavior (if applicable)
- Accessibility (keyboard nav, aria-labels)

Use the testing-components skill and follow Karaoke Tracker conventions.
```

## Project file paths

- **Components:** `src/scripts/components/app/`
- **Services:** `src/scripts/services/` (_storageService.js, _i18nService.js, etc.)
- **Styles:** `src/styles/index.css` (design tokens)
- **i18n:** `src/assets/i18n/` (ar.json, de.json, en.json, etc.)
- **Skills:** `.ai/skills/`

## See also

- Generic Copilot guidance: [.ai/COPILOT.md](../.ai/COPILOT.md)
- Claude instructions: [CLAUDE.md](./CLAUDE.md)
- Skills reference: [.ai/skills/README.md](../.ai/skills/README.md)
