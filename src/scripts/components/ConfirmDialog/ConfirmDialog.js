import styles from 'bundle-text:./ConfirmDialog.css';
import template from 'bundle-text:./ConfirmDialog.template.html';
import { i18n, pixEngine } from '../../services/index.js';
import { BaseDialog } from '../BaseDialog/BaseDialog.js';

export class ConfirmDialog extends BaseDialog {
  static stylesInjected = false;

  static {
    if (!ConfirmDialog.stylesInjected) {
      const styleSheet = document.createElement('style');
      styleSheet.setAttribute('data-component', 'confirm-dialog');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
      ConfirmDialog.stylesInjected = true;
    }

    customElements.define('confirm-dialog', ConfirmDialog);
  }

  constructor() {
    super();
    this._handleInternalClose = () => this.dispatchEvent(new Event('close'));
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
    super.connectedCallback();
    this.forwardCloseEvent();
    this.updateTranslations();
  }

  disconnectedCallback() {
    this._dialog?.removeEventListener('close', this._handleInternalClose);
  }

  attributeChangedCallback(_name, oldValue, newValue) {
    if (oldValue === newValue || !this.isConnected) {
      return;
    }

    this.render();
    this._dialog = this.querySelector('dialog');
    this.setupEventListeners();
    this.forwardCloseEvent();
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

    const titleTemplate = titleKey ? `<h3 class="dialog-title" data-i18n="${titleKey}">${i18n.t(titleKey)}</h3>` : '';

    const messagePrimary = messageKey
      ? `<span data-role="message-primary" data-i18n="${messageKey}">${i18n.t(messageKey)}</span>`
      : '';

    const messageAfter = messageAfterKey
      ? `<span data-role="message-after" data-i18n="${messageAfterKey}">${i18n.t(messageAfterKey)}</span>`
      : '';

    const dynamicName = showDynamicName ? '<strong class="dialog-singer-name" aria-live="polite"></strong>' : '';

    const messageWrapper =
      messagePrimary || messageAfter || dynamicName
        ? `<p class="dialog-message">${messagePrimary} ${dynamicName} ${messageAfter}</p>`
        : '';

    const warningTemplate = warningKey
      ? `<p class="dialog-warning" data-i18n="${warningKey}">${i18n.t(warningKey)}</p>`
      : '';

    const cancelButton = `<button type="button" class="btn ${cancelVariant}" data-action="cancel" data-i18n="${cancelKey}">${i18n.t(cancelKey)}</button>`;

    const confirmButton = `<button type="button" class="btn ${confirmVariant}" data-action="confirm" data-i18n="${confirmKey}">${i18n.t(confirmKey)}</button>`;

    this.innerHTML = pixEngine(template, {
      titleTemplate,
      messageWrapper,
      warningTemplate,
      cancelButton,
      confirmButton
    });
  }

  forwardCloseEvent() {
    if (!this._dialog) return;
    this._dialog.removeEventListener('close', this._handleInternalClose);
    this._dialog.addEventListener('close', this._handleInternalClose);
  }
}

export default ConfirmDialog;
