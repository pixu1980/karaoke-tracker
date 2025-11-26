import styles from 'bundle-text:./LanguageSelect.css';
import { i18n } from '../../../services/index.js';
import { Select } from '../Select/Select.js';

/**
 * Language Select Custom Element
 * Dropdown for selecting the application language
 * Extends Select (HTMLSelectElement)
 * Usage: <select is="pix-language-select">...</select>
 */
class LanguageSelect extends Select {
  static {
    // Inject component styles into document head
    const styleSheet = document.createElement('style');
    styleSheet.setAttribute('data-component', 'pix-language-select');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    customElements.define('pix-language-select', LanguageSelect, { extends: 'select' });
  }
  
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.render();
    this.setupEventListeners();

    // Update page on initial load
    i18n.updatePage();
  }

  render() {
    const languages = i18n.getLanguages();
    const currentLang = i18n.currentLang;

    // Set aria-label
    this.setAttribute('aria-label', i18n.t('selectLanguage') || 'Select language');
    this.classList.add('pix-language-select', 'header-control');

    // Clear existing options and render new ones
    this.innerHTML = '';

    for (const lang of languages) {
      const option = document.createElement('option');
      option.value = lang.code;
      option.textContent = `${lang.flag} ${lang.code.toUpperCase()}`;
      if (lang.code === currentLang) {
        option.selected = true;
      }
      this.appendChild(option);
    }
  }

  setupEventListeners() {
    this.addEventListener('change', e => {
      i18n.setLanguage(e.target.value);
    });
  }
}

export { LanguageSelect };
export default LanguageSelect;
