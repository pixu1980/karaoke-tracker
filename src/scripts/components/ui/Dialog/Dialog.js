/**
 * Dialog Component
 * Base dialog using native <dialog> element
 */
import { registerStylesheet, i18n, pixEngine } from '../../../services/index.js';
import styles from 'bundle-text:./Dialog.css';
import template from 'bundle-text:./Dialog.template.html';

export class Dialog extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('pix-dialog', this);
  }

  constructor() {
    super();
    this.dialog = null;
    this._contentNodes = null;
  }

  connectedCallback() {
    if (!this._contentNodes || this._contentNodes.length === 0) {
      this._contentNodes = Array.from(this.childNodes);
    }

    this.render();
    this.dialog = this.querySelector('dialog');
    this.restoreContent();
    this.setupEventListeners();
  }

  render() {
    const title = this.getAttribute('dialog-title') || '';
    this.innerHTML = pixEngine(template, { title, commonClose: i18n.t('common.close') });
  }

  restoreContent() {
    const content = this.querySelector('dialog > div');
    if (!content) return;

    content.innerHTML = '';

    if (this._contentNodes?.length) {
      this._contentNodes.forEach(node => {
        content.appendChild(node);
      });
    }
  }

  setupEventListeners() {
    // Close button
    const closeBtn = this.querySelector('header button');
    closeBtn?.addEventListener('click', () => this.close());

    // Close on backdrop click
    this.dialog?.addEventListener('click', e => {
      if (e.target === this.dialog) {
        this.close();
      }
    });

    // Close on Escape key
    this.dialog?.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  open() {
    this.dialog?.showModal();
    this.dispatchEvent(new CustomEvent('dialog:open', { bubbles: true }));
  }

  close() {
    this.dialog?.close();
    this.dispatchEvent(new CustomEvent('dialog:close', { bubbles: true }));
  }

  setTitle(title) {
    const titleEl = this.querySelector('header h2');
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  setContent(html) {
    const content = this.querySelector('dialog > div');
    if (content) {
      content.innerHTML = html;
      this._contentNodes = Array.from(content.childNodes);
    }
  }
}

export default Dialog;
