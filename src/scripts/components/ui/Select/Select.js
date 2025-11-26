import styles from 'bundle-text:./Select.css';
import { registerStylesheet } from '../../../services/index.js';

/**
 * Select - extends native HTMLSelectElement
 * Usage: <select is="custom-select">...</select>
 */
class Select extends HTMLSelectElement {
  static {
    // Inject component styles using adoptedStyleSheets
    registerStylesheet(styles);

    customElements.define('custom-select', Select, { extends: 'select' });
  }

  connectedCallback() {
    // Component connected – no additional setup required since styles apply via attribute selector
  }
}

export { Select };
export default Select;
