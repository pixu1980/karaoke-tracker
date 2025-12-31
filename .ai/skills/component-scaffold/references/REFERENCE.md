## Component scaffold — reference

Full scaffold and example for creating components. This reference contains the complete example code, template notes, CSS notes and quality checklist.

### Example component JS

```javascript
import styles from 'bundle-text:./ComponentName.css';
import template from 'bundle-text:./ComponentName.template.html';
import { registerStylesheet, pixEngine, i18n } from '../../services/index.js';

class ComponentName extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('kt-component-name', ComponentName);
  }

  constructor() {
    super();
    this._data = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    window.addEventListener('language-changed', this._boundRender = () => this.render());
  }

  disconnectedCallback() {
    window.removeEventListener('language-changed', this._boundRender);
  }

  render() {
    this.innerHTML = pixEngine(template, {
      title: i18n.t('component.title'),
      items: this._data || []
    });
  }

  setupEventListeners() {
    this.addEventListener('click', (e) => {
      if (e.target.matches('.action')) this.handleAction(e);
    });
  }
}

export default ComponentName;
```

### Template notes

- Use `{{ var }}` for escaped text and `{{{ var }}}` for raw HTML (SVGs).
- Use `<if>` and `<for>` for control flow.

### CSS notes

- Use tokens from `src/styles/index.css` (spacing, colors, radius).
- Prefer element/attribute selectors (no global classes).

### Quality checklist

- No Shadow DOM
- Styles registered via `registerStylesheet`
- Clean up listeners in `disconnectedCallback`
- i18n keys used for user-facing text
