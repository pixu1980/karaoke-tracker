/**
 * ColorSchemeSwitcher Component
 * Toggle between light and dark color schemes
 */
import { registerStylesheet, i18n, pixEngine } from '../../../services/index.js';
import styles from 'bundle-text:./ColorSchemeSwitcher.css';
import template from 'bundle-text:./ColorSchemeSwitcher.template.html';

export class ColorSchemeSwitcher extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('pix-color-scheme-switcher', this);
  }

  static STORAGE_KEY = 'karaoke-tracker-color-scheme';
  static SCHEMES = ['light', 'dark', 'system'];

  constructor() {
    super();
    this._scheme = 'auto';
  }

  connectedCallback() {
    this.loadScheme();
    this.render();
    this.setupEventListeners();
    this.applyScheme();
  }

  render() {
    this.innerHTML = pixEngine(template, {
      toggleLabel: i18n.t('colorScheme.toggle'),
      lightLabel: i18n.t('colorScheme.light'),
      darkLabel: i18n.t('colorScheme.dark'),
      systemLabel: i18n.t('colorScheme.system')
    });
  }

  setupEventListeners() {
    this.querySelectorAll('input[name="color-scheme"]').forEach(input => {
      input.addEventListener('change', e => {
        const val = e.target.value;
        this._scheme = val === 'system' ? 'auto' : val;
        this.saveScheme();
        this.applyScheme();
        this.dispatchEvent(
          new CustomEvent('colorscheme:change', {
            bubbles: true,
            detail: { scheme: this._scheme }
          })
        );
      });
    });
  }

  loadScheme() {
    const stored = localStorage.getItem(ColorSchemeSwitcher.STORAGE_KEY);
    if (stored && ColorSchemeSwitcher.SCHEMES.includes(stored)) {
      this._scheme = stored;
    }
  }

  saveScheme() {
    localStorage.setItem(ColorSchemeSwitcher.STORAGE_KEY, this._scheme);
  }

  toggleScheme() {
    // Cycle: light -> dark -> auto -> light
    const currentIndex = ColorSchemeSwitcher.SCHEMES.indexOf(this._scheme);
    const nextIndex = (currentIndex + 1) % ColorSchemeSwitcher.SCHEMES.length;
    this._scheme = ColorSchemeSwitcher.SCHEMES[nextIndex];

    this.saveScheme();
    this.applyScheme();

    this.dispatchEvent(
      new CustomEvent('colorscheme:change', {
        bubbles: true,
        detail: { scheme: this._scheme }
      })
    );
  }

  applyScheme() {
    const root = document.documentElement;

    // Remove existing scheme classes
    root.classList.remove('light-scheme', 'dark-scheme');

    if (this._scheme === 'light') {
      root.classList.add('light-scheme');
      root.style.colorScheme = 'light';
    } else if (this._scheme === 'dark') {
      root.classList.add('dark-scheme');
      root.style.colorScheme = 'dark';
    } else {
      // Auto - let system decide
      root.style.colorScheme = 'light dark';
    }

    // Update radio checked state
    const radioVal = this._scheme === 'auto' ? 'system' : this._scheme;
    this.querySelectorAll('input[name="color-scheme"]').forEach(r => (r.checked = r.value === radioVal));
  }

  updateIcon() {
    const lightIcon = this.querySelector('.color-scheme-switcher__icon--light');
    const darkIcon = this.querySelector('.color-scheme-switcher__icon--dark');

    if (this._scheme === 'dark') {
      lightIcon?.classList.add('hidden');
      darkIcon?.classList.remove('hidden');
    } else {
      lightIcon?.classList.remove('hidden');
      darkIcon?.classList.add('hidden');
    }
  }
}

export default ColorSchemeSwitcher;
