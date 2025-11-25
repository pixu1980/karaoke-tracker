import styles from 'bundle-text:./CustomSelect.css';

/**
 * Custom Select - extends native HTMLSelectElement
 * Usage: <select is="custom-select">...</select>
 */
export class CustomSelect extends HTMLSelectElement {
  static stylesInjected = false;

  static {
    if (!CustomSelect.stylesInjected) {
      const styleSheet = document.createElement('style');
      styleSheet.setAttribute('data-component', 'custom-select');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
      CustomSelect.stylesInjected = true;
    }

    customElements.define('custom-select', CustomSelect, { extends: 'select' });
  }

  connectedCallback() {
    // Component connected – no additional setup required since styles apply via attribute selector
  }
}

export default CustomSelect;
