# JavaScript Standards & Conventions

This document contains JavaScript standards, naming conventions, and the Custom Elements pattern used in this project.

---

## Naming Conventions

### `camelCase` for variables, functions, properties
### `PascalCase` for class names

```javascript
class SingerCard extends HTMLElement {
    propertyName = '';
    _privateProperty = null;

    constructor() {
        super();
    }

    methodName(argOne, argTwo) {
        const localVariable = 0;
        // ...
    }
}
```

---

## Variable Declarations

### Use `const` by default, `let` when needed, never `var`

```javascript
// ✅ DO
const immutableValue = 'fixed';
let mutableValue = 0;
mutableValue += 1;

// ❌ DON'T
var oldSchoolVariable = 'bad';
```

---

## Functions

### Prefer Arrow Functions for callbacks

```javascript
// ✅ DO
const items = data.map(item => item.name);
element.addEventListener('click', (e) => this.handleClick(e));

// ❌ DON'T (loses `this` context)
element.addEventListener('click', function(e) {
    this.handleClick(e);  // `this` is wrong!
});
```

### Use async/await for Promises

```javascript
// ✅ DO
async function loadData() {
    try {
        const data = await storage.getAllSingers();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// ❌ DON'T
function loadData() {
    return storage.getAllSingers()
        .then(data => data)
        .catch(error => console.error(error));
}
```

---

## Custom Elements Pattern (MANDATORY)

Every component MUST follow this exact pattern:

### Complete Component Template

```javascript
import styles from 'bundle-text:./ComponentName.css';
import template from 'bundle-text:./ComponentName.template.html';
import { i18n, pixEngine, registerStylesheet } from '../../services/index.js';

/**
 * ComponentName - Brief description of the component
 * @element component-name
 * 
 * @fires {CustomEvent} event-name - Description of dispatched event
 * 
 * @example
 * <component-name data-id="123"></component-name>
 */
class ComponentName extends HTMLElement {
    /**
     * Static initialization block - runs once when class is loaded
     * MUST register styles and define custom element
     */
    static {
        registerStylesheet(styles);
        customElements.define('component-name', ComponentName);
    }

    /**
     * Constructor - initialize instance state
     * Do NOT access DOM here
     */
    constructor() {
        super();
        this._data = null;
        this._boundHandlers = {
            onLanguageChange: () => this.render()
        };
    }

    /**
     * Called when element is added to DOM
     * Setup rendering and event listeners
     */
    connectedCallback() {
        this.render();
        this.setupEventListeners();
        
        // Listen for global events
        window.addEventListener('language-changed', this._boundHandlers.onLanguageChange);
    }

    /**
     * Called when element is removed from DOM
     * Clean up event listeners to prevent memory leaks
     */
    disconnectedCallback() {
        window.removeEventListener('language-changed', this._boundHandlers.onLanguageChange);
    }

    /**
     * Render component content using template engine
     */
    render() {
        this.innerHTML = pixEngine(template, {
            title: i18n.t('componentTitle'),
            items: this._data || [],
            isEmpty: !this._data?.length
        });
    }

    /**
     * Setup event listeners using delegation
     */
    setupEventListeners() {
        this.addEventListener('click', (e) => {
            const button = e.target.closest('[data-action]');
            if (!button) return;
            
            const action = button.dataset.action;
            const id = button.dataset.id;
            
            switch (action) {
                case 'edit':
                    this.handleEdit(id);
                    break;
                case 'delete':
                    this.handleDelete(id);
                    break;
            }
        });
    }

    /**
     * Handle edit action
     * @param {string} id - Item ID
     */
    handleEdit(id) {
        // Implementation
    }

    /**
     * Handle delete action  
     * @param {string} id - Item ID
     */
    handleDelete(id) {
        // Implementation
    }
}
```

### File Structure

Each component MUST have its own folder:

```
ComponentName/
├── ComponentName.js           # Class with static initialization
├── ComponentName.css          # Component-specific styles
└── ComponentName.template.html # Template for pixEngine
```

### Static Block Rules

```javascript
// ✅ DO: Use static initialization block
class MyComponent extends HTMLElement {
    static {
        registerStylesheet(styles);
        customElements.define('my-component', MyComponent);
    }
}

// ❌ DON'T: Define element outside class
class MyComponent extends HTMLElement { }
customElements.define('my-component', MyComponent);

// ❌ DON'T: Register styles in constructor
constructor() {
    registerStylesheet(styles);  // Wrong! Runs for each instance
}
```

---

## Template Engine (pixEngine)

### Variable Interpolation

```html
<!-- Simple variable -->
<h1>{{ title }}</h1>

<!-- Nested property access -->
<p>{{ user.profile.name }}</p>

<!-- Automatic HTML escaping (XSS protection) -->
<span>{{ userInput }}</span>
```

### Conditionals

```html
<!-- Simple if -->
<if condition="isVisible">
    <div>Visible content</div>
</if>

<!-- If/Else -->
<if condition="hasItems">
    <ul class="items-list">...</ul>
</if>
<else>
    <p class="empty-state">No items found</p>
</else>

<!-- Comparison operators -->
<if condition="count > 0">
    <span class="badge">{{ count }}</span>
</if>

<if condition="status === 'active'">
    <span class="active">Active</span>
</if>

<!-- Negation -->
<if condition="!isLoading">
    <div>Content loaded</div>
</if>
```

### Loops

```html
<!-- Simple loop -->
<ul>
    <for each="singer in singers">
        <li>{{ singer.name }}</li>
    </for>
</ul>

<!-- Loop with index -->
<for each="index, item in items">
    <li data-index="{{ index }}" data-id="{{ item.id }}">
        {{ item.name }}
    </li>
</for>

<!-- Nested loops -->
<for each="category in categories">
    <section>
        <h2>{{ category.name }}</h2>
        <for each="item in category.items">
            <div>{{ item.title }}</div>
        </for>
    </section>
</for>
```

---

## Services Usage

### Importing Services

```javascript
// Import from barrel export
import { i18n, storage, pixEngine, escapeHtml, registerStylesheet } from '../services/index.js';
```

### i18n Service

```javascript
// Get translation
const label = i18n.t('buttonLabel');

// Change language
i18n.setLanguage('it');

// Check RTL
if (i18n.isRTL()) {
    // Handle RTL layout
}

// Get current language
const { code, name, flag } = i18n.getCurrentLanguage();

// Listen for changes
window.addEventListener('language-changed', (e) => {
    console.log('Language changed to:', e.detail.lang);
});
```

### Storage Service

```javascript
// Initialize (once at app start)
await storage.init();

// Singers
const singers = await storage.getAllSingers();
const singerId = await storage.addSinger({ name: 'John Doe' });
await storage.updateSinger(singerId, { name: 'Jane Doe' });
await storage.deleteSinger(singerId);

// Songs (with multi-singer support)
const songs = await storage.getAllSongs();
const songId = await storage.addSong({
    title: 'Bohemian Rhapsody',
    author: 'Queen',
    singerIds: [1, 2],  // Duet
    key: '+2',
    youtubeUrl: 'https://...'
});

// Performances
await storage.addPerformance({
    songId: 1,
    singerId: 1,
    songTitle: 'Song Name',
    singerName: 'Singer Name',
    rating: 4.5
});
```

---

## Event System

### Dispatching Events

```javascript
// Dispatch custom event
window.dispatchEvent(new CustomEvent('song-added', {
    detail: { song: newSong }
}));

// Dispatch from component
this.dispatchEvent(new CustomEvent('item-selected', {
    detail: { id: itemId },
    bubbles: true,
    composed: true
}));
```

### Listening for Events

```javascript
// In connectedCallback
connectedCallback() {
    this._handleSongAdded = (e) => {
        const { song } = e.detail;
        this.addToQueue(song);
    };
    
    window.addEventListener('song-added', this._handleSongAdded);
}

// In disconnectedCallback (cleanup!)
disconnectedCallback() {
    window.removeEventListener('song-added', this._handleSongAdded);
}
```

---

## Error Handling

### Always use try/catch with async

```javascript
async loadSingers() {
    try {
        this._singers = await storage.getAllSingers();
        this.render();
    } catch (error) {
        console.error('Failed to load singers:', error);
        this._error = 'Unable to load data';
        this.render();
    }
}
```

### User-Friendly Error Messages

```javascript
try {
    await storage.addSinger({ name });
} catch (error) {
    if (error.message.includes('unique')) {
        alert(i18n.t('singerAlreadyExists'));
    } else {
        alert(i18n.t('genericError'));
    }
}
```

---

## JSDoc Comments

### Component Documentation

```javascript
/**
 * SingerCard displays a single singer with actions
 * @element singer-card
 * 
 * @attr {string} data-id - Singer ID
 * @attr {string} data-name - Singer name
 * @attr {number} data-song-count - Number of songs performed
 * 
 * @fires {CustomEvent} singer-edit - When edit button clicked
 * @fires {CustomEvent} singer-delete - When delete button clicked
 */
class SingerCard extends HTMLElement { }
```

### Method Documentation

```javascript
/**
 * Update singer data and re-render
 * @param {Object} singer - Singer data
 * @param {number} singer.id - Singer ID
 * @param {string} singer.name - Singer name
 * @returns {void}
 */
updateSinger(singer) {
    this._singer = singer;
    this.render();
}
```

---

## Prohibited Practices

```javascript
// ❌ NEVER use eval
eval(code);

// ❌ NEVER use var
var oldVariable = 'bad';

// ❌ NEVER use Shadow DOM
this.attachShadow({ mode: 'open' });

// ❌ NEVER use <template> tag
const template = document.createElement('template');

// ❌ NEVER skip error handling in async
async function riskyCode() {
    const data = await fetchData();  // Could throw!
}

// ❌ NEVER forget cleanup in disconnectedCallback
connectedCallback() {
    window.addEventListener('event', this.handler);
}
disconnectedCallback() {
    // Missing cleanup! Memory leak!
}

// ❌ NEVER define custom elements outside static block
customElements.define('my-element', MyElement);
```

---

## Best Practices Summary

1. **Use static initialization blocks** for component registration
2. **Use pixEngine** for all template rendering
3. **Use event delegation** for click handlers
4. **Always cleanup** event listeners in `disconnectedCallback`
5. **Use try/catch** for all async operations
6. **Document components** with JSDoc
7. **Import services** from barrel export
8. **Use i18n.t()** for all user-facing text

