## Event system — reference

Patterns and best practices for component communication via custom events.

### Event naming patterns

Generic patterns (project may define specific conventions):

1. **Domain-specific events:** `noun:action` (e.g., `user:created`, `item:deleted`)
2. **UI events:** `state:changed` (e.g., `filter:changed`, `expanded:toggled`)
3. **Request events:** `resource:action-request` (e.g., `comment:delete-request`)
4. **Status events:** `operation:status` (e.g., `upload:started`, `sync:completed`)

Choose a consistent pattern across your codebase.

### Dispatching custom events

**Basic event:**

```javascript
this.dispatchEvent(new CustomEvent('item:deleted', {
  bubbles: true,      // Allows parent to catch via delegation
  composed: true      // For cross-component communication
}));
```

**With data:**

```javascript
this.dispatchEvent(new CustomEvent('item:selected', {
  detail: { itemId: 123, itemName: 'Example' },
  bubbles: true,
  composed: true
}));
```

**Important options:**
- `bubbles: true` — Event propagates up the DOM tree
- `composed: true` — Event crosses component boundaries (if using Web Components)
- `detail` — Custom data object (keep JSON-serializable and minimal)

### Listening to events

**Local listeners (inside component):**

```javascript
class MyComponent extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', this._handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._handleClick);
  }

  _handleClick = (e) => {
    if (e.target.matches('.delete-btn')) {
      this.dispatchEvent(new CustomEvent('item:delete-request', {
        detail: { itemId: this._currentItemId },
        bubbles: true,
        composed: true
      }));
    }
  };
}
```

**Global listeners (across components):**

```javascript
// Listen from app shell or parent component
document.addEventListener('item:deleted', (e) => {
  console.log('Item deleted:', e.detail);
  this.refreshList();
});
```

**Event delegation (parent listening for children):**

```javascript
class ListContainer extends HTMLElement {
  connectedCallback() {
    this.addEventListener('item:selected', (e) => {
      console.log('Selected:', e.detail);
      this._updateSelection(e.detail.itemId);
    });
  }
}
```

### Event cleanup

**Remove listeners to prevent memory leaks:**

```javascript
class MyComponent extends HTMLElement {
  connectedCallback() {
    // Bind once to same reference
    this._boundHandler = this._handleChange.bind(this);
    document.addEventListener('global-event', this._boundHandler);
  }

  disconnectedCallback() {
    // Remove the bound handler
    document.removeEventListener('global-event', this._boundHandler);
  }

  _handleChange(e) {
    // Handle event
  }
}
```

**Or with arrow functions:**

```javascript
class MyComponent extends HTMLElement {
  #handleUpdate = () => {
    // Event handler
  };

  connectedCallback() {
    window.addEventListener('update', this.#handleUpdate);
  }

  disconnectedCallback() {
    window.removeEventListener('update', this.#handleUpdate);
  }
}
```

### Common patterns

#### State synchronization

```javascript
// Component A emits when state changes
class FormComponent extends HTMLElement {
  handleInputChange(value) {
    this.dispatchEvent(new CustomEvent('form:changed', {
      detail: { value, fieldName: this._fieldName },
      bubbles: true
    }));
  }
}

// Component B listens and updates
class SummaryComponent extends HTMLElement {
  connectedCallback() {
    this.addEventListener('form:changed', (e) => {
      this._updateSummary(e.detail.value);
    });
  }
}
```

#### Async operation notification

```javascript
class DataComponent extends HTMLElement {
  async fetchData() {
    this.dispatchEvent(new CustomEvent('data:loading', { bubbles: true }));
    try {
      const data = await fetch('/api/data');
      this.dispatchEvent(new CustomEvent('data:loaded', {
        detail: { data },
        bubbles: true
      }));
    } catch (error) {
      this.dispatchEvent(new CustomEvent('data:error', {
        detail: { error: error.message },
        bubbles: true
      }));
    }
  }
}
```

#### User intent signals

```javascript
class ActionButton extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('action:requested', {
        detail: { action: this.dataset.action },
        bubbles: true,
        composed: true
      }));
    });
  }
}

// Parent listens and handles
document.addEventListener('action:requested', (e) => {
  console.log('User requested action:', e.detail.action);
  // Perform action
});
```

### Best practices

- ✅ Use clear, consistent event names
- ✅ Include minimal, relevant data in `detail`
- ✅ Set `bubbles: true` for parent delegation
- ✅ Remove all event listeners in `disconnectedCallback()`
- ✅ Use bound or arrow functions to maintain `this` context
- ✅ Avoid circular event patterns (A→B→A)
- ✅ Document event signatures (name, detail schema)
- ✅ Consider using events for user intent, not internal state

### Project-specific conventions

For project-specific event naming patterns and communication protocols, refer to the project's `.context/` directory.
