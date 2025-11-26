import styles from 'bundle-text:./Dialog.css';
import { i18n, registerStylesheet } from '../../../services/index.js';

/**
 * Dialog Custom Element - extends native HTMLDialogElement
 * Provides common functionality for dialog components
 * Usage: <dialog is="pix-dialog">...</dialog>
 */
class Dialog extends HTMLDialogElement {
  static {
    // Inject base dialog styles using adoptedStyleSheets
    registerStylesheet(styles);

    customElements.define('pix-dialog', Dialog, { extends: 'dialog' });
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.setupEventListeners();

    // Listen for language changes
    window.addEventListener('language-changed', () => this.updateTranslations());
  }

  setupEventListeners() {
    // Handle cancel button
    const cancelBtn = this.querySelector('[data-action="cancel"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.close());
    }

    // Handle confirm button
    const confirmBtn = this.querySelector('[data-action="confirm"]');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.handleConfirm());
    }

    // Handle form submit
    const form = this.querySelector('form');
    if (form) {
      form.addEventListener('submit', e => this.handleSubmit(e));
    }

    // Close on backdrop click
    this.addEventListener('click', e => {
      if (e.target === this) {
        this.close();
      }
    });

    // Close on Escape key (native dialog already supports this, but we add for custom handling)
    this.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      }
    });
  }

  handleConfirm() {
    // Override in subclasses
    this.close();
  }

  handleSubmit(event) {
    // Override in subclasses
    event.preventDefault();
  }

  updateTranslations() {
    // Update all data-i18n elements
    this.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = i18n.t(key);
    });
  }
}

export { Dialog };
export default Dialog;
