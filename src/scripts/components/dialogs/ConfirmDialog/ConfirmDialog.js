/**
 * ConfirmDialog Component
 * Generic confirmation dialog for delete/reset actions
 */
import { registerStylesheet, i18n, pixEngine } from '../../../services/index.js';
import styles from 'bundle-text:./ConfirmDialog.css';
import template from 'bundle-text:./ConfirmDialog.template.html';

export class ConfirmDialog extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('kt-confirm-dialog', this);
  }

  constructor() {
    super();
    this._onConfirm = null;
    this._variant = 'danger'; // 'danger' | 'warning' | 'info'
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = pixEngine(template, {
      title: i18n.t('confirm.title'),
      message: i18n.t('confirm.message'),
      cancelLabel: i18n.t('common.cancel'),
      confirmLabel: i18n.t('common.confirm')
    });
  }

  setupEventListeners() {
    const cancelBtn = this.querySelector('[data-action="cancel"]');
    const confirmBtn = this.querySelector('[data-action="confirm"]');
    const dialog = this.querySelector('pix-dialog');

    cancelBtn?.addEventListener('click', () => {
      this.close();
    });

    confirmBtn?.addEventListener('click', () => {
      if (this._onConfirm) {
        this._onConfirm();
      }
      this.close();
    });

    dialog?.addEventListener('dialog:close', () => {
      this._onConfirm = null;
    });
  }

  open(options = {}) {
    const {
      title = i18n.t('confirm.title'),
      message = i18n.t('confirm.message'),
      confirmText = i18n.t('common.confirm'),
      variant = 'danger',
      onConfirm = null
    } = options;

    this._onConfirm = onConfirm;
    this._variant = variant;

    const dialog = this.querySelector('pix-dialog');
    const messageEl = this.querySelector('[data-role="message"]');
    const confirmBtn = this.querySelector('[data-action="confirm"]');
    const titleEl = dialog?.querySelector('.dialog__title');

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    if (confirmBtn) {
      confirmBtn.textContent = confirmText;
      confirmBtn.setAttribute('data-variant', variant);
    }

    dialog?.open();
  }

  close() {
    const dialog = this.querySelector('pix-dialog');
    dialog?.close();
  }
}

export default ConfirmDialog;
