import styles from 'bundle-text:./ColorSchemeSwitcher.css';
import template from 'bundle-text:./ColorSchemeSwitcher.template.html';
import { i18n, pixEngine, registerStylesheet } from '../../../services/index.js';

const STORAGE_KEY = 'karaoke-color-scheme';
const DEFAULT_SCHEME = 'light dark'; // System preference

/**
 * Color Scheme Switcher Custom Element
 * Manages color scheme switching using native CSS color-scheme and light-dark()
 */
class ColorSchemeSwitcher extends HTMLElement {
  static {
    // Inject component styles using adoptedStyleSheets
    registerStylesheet(styles);

    customElements.define('color-scheme-switcher', ColorSchemeSwitcher);
  }

  constructor() {
    super();
    this._currentScheme = this.loadScheme();
  }

  /**
   * Load color scheme from localStorage
   * @returns {string} The stored scheme or default
   */
  loadScheme() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_SCHEME;
  }

  /**
   * Save color scheme to localStorage
   * @param {string} scheme - The scheme to save
   */
  saveScheme(scheme) {
    localStorage.setItem(STORAGE_KEY, scheme);
  }

  /**
   * Update the meta color-scheme tag
   * @param {string} scheme - The scheme value
   */
  updateMetaColorScheme(scheme) {
    let meta = document.querySelector('meta[name="color-scheme"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'color-scheme';
      document.head.appendChild(meta);
    }
    meta.content = scheme;
  }

  /**
   * Set the current color scheme
   * @param {string} scheme - 'light', 'dark', or 'light dark' (system)
   */
  setScheme(scheme) {
    this._currentScheme = scheme;
    this.saveScheme(scheme);
    this.updateMetaColorScheme(scheme);
    this.updateRadioButtons();

    // Dispatch event for other components that might need to react
    window.dispatchEvent(new CustomEvent('color-scheme-changed', {
      detail: { scheme }
    }));
  }

  /**
   * Update radio button checked states
   */
  updateRadioButtons() {
    const radios = this.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.checked = radio.value === this._currentScheme;
    });
  }

  connectedCallback() {
    // Apply scheme immediately on connection
    this.updateMetaColorScheme(this._currentScheme);
    
    this.render();
    this.setupEventListeners();

    // Listen for language changes
    window.addEventListener('language-changed', () => this.render());
  }

  render() {
    this.innerHTML = pixEngine(template, {
      selectColorSchemeLabel: i18n.t('selectColorScheme') || 'Select Color Scheme',
      lightModeLabel: i18n.t('lightMode') || 'Light mode',
      darkModeLabel: i18n.t('darkMode') || 'Dark mode',
      systemModeLabel: i18n.t('systemMode') || 'System mode',
      lightChecked: this._currentScheme === 'light' ? 'checked' : '',
      darkChecked: this._currentScheme === 'dark' ? 'checked' : '',
      systemChecked: this._currentScheme === 'light dark' ? 'checked' : ''
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    const radios = this.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', e => {
        if (e.target.checked) {
          this.setScheme(e.target.value);
        }
      });
    });
  }
}

export { ColorSchemeSwitcher };
export default ColorSchemeSwitcher;
