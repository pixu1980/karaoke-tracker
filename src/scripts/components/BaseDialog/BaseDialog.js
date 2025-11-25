import styles from 'bundle-text:./BaseDialog.css';
import { i18n } from '../../services/index.js';

/**
 * Base Dialog Custom Element
 * Provides common functionality for dialog components
 */
export class BaseDialog extends HTMLElement {
  static stylesInjected = false;

  static {
    // Inject base dialog styles into document head (only once)
    if (!BaseDialog.stylesInjected) {
      const styleSheet = document.createElement('style');
      styleSheet.setAttribute('data-component', 'base-dialog');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
      BaseDialog.stylesInjected = true;
    }
  }

  constructor() {
    super();
    this._dialog = null;
  }

  get dialog() {
    return this._dialog;
  }

  connectedCallback() {
    this.render();
    this._dialog = this.querySelector('dialog');
    this.setupEventListeners();

    // Listen for language changes
    window.addEventListener('language-changed', () => this.updateTranslations());
  }

  render() {
    // Override in subclasses
  }

  setupEventListeners() {
    if (!this._dialog) return;

    // Handle cancel button
    const cancelBtn = this._dialog.querySelector('[data-action="cancel"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.close());
    }

    // Handle confirm button
    const confirmBtn = this._dialog.querySelector('[data-action="confirm"]');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.handleConfirm());
    }

    // Handle form submit
    const form = this._dialog.querySelector('form');
    if (form) {
      form.addEventListener('submit', e => this.handleSubmit(e));
    }

    // Close on backdrop click
    this._dialog.addEventListener('click', e => {
      if (e.target === this._dialog) {
        this.close();
      }
    });

    // Close on Escape key
    this._dialog.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  showModal() {
    this._dialog?.showModal();
  }

  close() {
    this._dialog?.close();
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

export default BaseDialog;
