import styles from 'bundle-text:./ConfirmDialog.css';
import template from 'bundle-text:./ConfirmDialog.template.html';
import { i18n, pixEngine, registerStylesheet } from '../../../services/index.js';
import { Dialog } from '../Dialog/Dialog.js';

/**
 * ConfirmDialog Custom Element - extends Dialog (HTMLDialogElement)
 * A confirmation dialog with configurable title, message, and buttons
 * Usage: <dialog is="pix-confirm-dialog" title-key="..." message-key="..."></dialog>
 */
class ConfirmDialog extends Dialog {
  static {
    // Inject component styles using adoptedStyleSheets
    registerStylesheet(styles);

    customElements.define('pix-confirm-dialog', ConfirmDialog, { extends: 'dialog' });
  }

  constructor() {
    super();
  }

  static get observedAttributes() {
    return [
      'title-key',
      'message-key',
      'message-after-key',
      'warning-key',
      'confirm-key',
      'cancel-key',
      'confirm-variant',
      'cancel-variant',
      'show-dynamic-name'
    ];
  }

  connectedCallback() {
    this.render();
    super.connectedCallback();
    this.updateTranslations();

    // Listen for language changes
    window.addEventListener('language-changed', () => this.updateTranslations());
  }

  disconnectedCallback() {
  }

  attributeChangedCallback(_name, oldValue, newValue) {
    if (oldValue === newValue || !this.isConnected) {
      return;
    }

    this.render();
    this.setupEventListeners();
    this.updateTranslations();
  }

  render() {
    const titleKey = this.getAttribute('title-key') || '';
    const messageKey = this.getAttribute('message-key') || '';
    const messageAfterKey = this.getAttribute('message-after-key') || '';
    const warningKey = this.getAttribute('warning-key') || '';
    const confirmKey = this.getAttribute('confirm-key') || '';
    const cancelKey = this.getAttribute('cancel-key') || 'cancel';
    const confirmVariant = this.getAttribute('confirm-variant') || 'btn-primary';
    const cancelVariant = this.getAttribute('cancel-variant') || 'btn-secondary';
    const showDynamicName = this.hasAttribute('show-dynamic-name');

    this.innerHTML = pixEngine(template, {
      titleKey,
      titleText: titleKey ? i18n.t(titleKey) : '',
      messageKey,
      messageText: messageKey ? i18n.t(messageKey) : '',
      messageAfterKey,
      messageAfterText: messageAfterKey ? i18n.t(messageAfterKey) : '',
      warningKey,
      warningText: warningKey ? i18n.t(warningKey) : '',
      confirmKey,
      confirmText: confirmKey ? i18n.t(confirmKey) : '',
      cancelKey,
      cancelText: i18n.t(cancelKey),
      confirmVariant,
      cancelVariant,
      showDynamicName
    });
  }

  handleConfirm() {
    // Override in subclasses or handle via event
    this.close();
  }

  updateTranslations() {
    // Update all data-i18n elements
    this.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = i18n.t(key);
      }
    });
  }
}

export { ConfirmDialog };
export default ConfirmDialog;
