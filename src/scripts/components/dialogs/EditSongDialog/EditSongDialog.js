import styles from 'bundle-text:./EditSongDialog.css';
import template from 'bundle-text:./EditSongDialog.template.html';
import { Dialog } from '../../ui/Dialog/Dialog.js';
import { i18n, pixEngine, registerStylesheet } from '../../../services/index.js';

/**
 * Edit Song Dialog Custom Element - extends Dialog
 * Dialog for editing an existing song's information
 * Uses SongForm component internally for the form
 * Usage: <dialog is="edit-song-dialog">...</dialog>
 */
class EditSongDialog extends Dialog {
  static {
    // Inject component-specific styles using adoptedStyleSheets
    registerStylesheet(styles);

    // Register the custom element
    customElements.define('edit-song-dialog', EditSongDialog, { extends: 'dialog' });
  }

  constructor() {
    super();
    this._song = null;
  }

  connectedCallback() {
    this.classList.add('dialog', 'edit-song-dialog');
    super.connectedCallback();
    // Listen for song updates from the form
    window.addEventListener('singer-updated', () => this.close());
    window.addEventListener('song-edit-cancelled', () => this.close());
  }

  render() {
    this.innerHTML = pixEngine(template, {
      title: i18n.t('editSinger')
    });
  }

  /**
   * Open the dialog with song information
   * @param {Object} song - The song object to edit
   */
  showModal(song) {
    this._song = song;
    this.render();
    this.setupEventListeners();

    // Get the song form and set it up for editing
    const songForm = this.querySelector('song-form');
    if (songForm) {
      songForm.mode = 'edit';
      songForm.setSong(song);
    }

    super.showModal();
  }

  updateTranslations() {
    const titleEl = this.querySelector('[data-i18n="editSinger"]');
    if (titleEl) titleEl.textContent = i18n.t('editSinger');
  }
}

export { EditSongDialog };
export default EditSongDialog;
