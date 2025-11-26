import styles from 'bundle-text:./SongForm.css';
import template from 'bundle-text:./SongForm.template.html';
import { i18n, pixEngine, registerStylesheet, storage } from '../../../services/index.js';

/**
 * Song Form Custom Element
 * Form for adding new songs or editing existing ones
 * @attr {string} mode - Form mode: 'new' (default) or 'edit'
 */
class SongForm extends HTMLElement {
  static {
    // Inject component styles using adoptedStyleSheets
    registerStylesheet(styles);

    customElements.define('song-form', SongForm);
  }

  static formCounter = 0;

  constructor() {
    super();
    this._song = null;
    this._formId = ++SongForm.formCounter;
  }

  get mode() {
    return this.getAttribute('mode') || 'new';
  }

  set mode(value) {
    this.setAttribute('mode', value);
  }

  get isEditMode() {
    return this.mode === 'edit';
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();

    // Listen for language changes
    window.addEventListener('language-changed', () => this.render());
  }

  render() {
    this.innerHTML = pixEngine(template, {
      formId: this._formId,
      songId: this._song?.id || '',
      singerName: this._song?.name || '',
      songTitle: this._song?.songTitle || '',
      songAuthor: this._song?.songAuthor || '',
      songKey: this._song?.songKey || '0',
      youtubeUrl: this._song?.youtubeUrl || '',
      isEditMode: this.isEditMode,
      singerNameLabel: i18n.t('singerName'),
      requiredLabel: i18n.t('required'),
      songTitleLabel: i18n.t('songTitle'),
      songAuthorLabel: i18n.t('songAuthor'),
      keyAdjustmentLabel: i18n.t('keyAdjustment'),
      originalLabel: i18n.t('original'),
      youtubeLinkLabel: i18n.t('youtubeLink'),
      submitLabel: this.isEditMode ? i18n.t('saveChanges') : i18n.t('addToQueue'),
      cancelLabel: i18n.t('cancel')
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.form = this.querySelector('.song-form');
    if (this.form) {
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    // Handle cancel button in edit mode
    const cancelBtn = this.querySelector('[data-action="cancel"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('song-edit-cancelled'));
      });
    }
  }

  /**
   * Set the song data for editing
   * @param {object} song - The song object to edit
   */
  setSong(song) {
    this._song = song;
    this.render();
  }

  /**
   * Clear the form and reset song data
   */
  clear() {
    this._song = null;
    this.render();
  }

  async handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this.form);
    const songData = {
      name: formData.get('name'),
      songTitle: formData.get('songTitle'),
      songAuthor: formData.get('songAuthor'),
      songKey: formData.get('songKey') || '',
      youtubeUrl: formData.get('youtubeUrl') || ''
    };

    try {
      if (this.isEditMode) {
        const songId = Number(formData.get('id'));
        await storage.updateSong(songId, songData);
        window.dispatchEvent(new CustomEvent('song-updated'));
      } else {
        await storage.addSong(songData);
        this.form.reset();
        window.dispatchEvent(new CustomEvent('song-added'));
      }
    } catch (error) {
      console.error(`Error ${this.isEditMode ? 'updating' : 'adding'} song:`, error);
      alert(`Failed to ${this.isEditMode ? 'update' : 'add'} song. Please try again.`);
    }
  }
}

export { SongForm };
export default SongForm;
