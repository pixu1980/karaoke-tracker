/**
 * AddSingerDialog Component
 * Dialog for adding a new singer
 */
import { registerStylesheet, i18n, storage, pixEngine } from '../../../services/index.js';
import styles from 'bundle-text:./AddSingerDialog.css';
import template from 'bundle-text:./AddSingerDialog.template.html';

export class AddSingerDialog extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('kt-add-singer-dialog', this);
  }

  constructor() {
    super();
    this._editMode = false;
    this._singerId = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = pixEngine(template, {
      title: i18n.t('addSinger.title'),
      nameLabel: i18n.t('addSinger.name'),
      namePlaceholder: i18n.t('addSinger.namePlaceholder'),
      cancelText: i18n.t('common.cancel'),
      saveText: i18n.t('common.save')
    });
  }

  setupEventListeners() {
    const form = this.querySelector('form');
    const cancelBtn = this.querySelector('[data-action="cancel"]');
    const dialog = this.querySelector('pix-dialog');

    form?.addEventListener('submit', async e => {
      e.preventDefault();
      await this.handleSubmit(new FormData(form));
    });

    cancelBtn?.addEventListener('click', () => {
      this.close();
    });

    dialog?.addEventListener('dialog:close', () => {
      this.reset();
    });
  }

  async handleSubmit(formData) {
    const name = formData.get('name')?.trim();

    if (!name) return;

    try {
      if (this._editMode && this._singerId) {
        await storage.updateSinger(this._singerId, { name });
      } else {
        await storage.addSinger({ name });
      }

      document.dispatchEvent(new CustomEvent('singers:updated'));
      this.close();
    } catch (error) {
      console.error('Failed to save singer:', error);
      // Could show error message
    }
  }

  open(editData = null) {
    const dialog = this.querySelector('pix-dialog');
    const input = this.querySelector('#singer-name');
    const title = dialog?.querySelector('.dialog__title');

    if (editData) {
      this._editMode = true;
      this._singerId = editData.singerId;
      if (input) input.value = editData.singerName || '';
      if (title) title.textContent = i18n.t('addSinger.editTitle');
    } else {
      this._editMode = false;
      this._singerId = null;
      if (title) title.textContent = i18n.t('addSinger.title');
    }

    dialog?.open();
    input?.focus();
  }

  close() {
    const dialog = this.querySelector('pix-dialog');
    dialog?.close();
  }

  reset() {
    const form = this.querySelector('form');
    form?.reset();
    this._editMode = false;
    this._singerId = null;
  }
}

export default AddSingerDialog;
