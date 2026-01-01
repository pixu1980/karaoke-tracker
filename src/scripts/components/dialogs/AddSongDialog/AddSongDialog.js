/**
 * AddSongDialog Component
 * Dialog for adding a new song to the queue (supports multi-singer)
 */
import { registerStylesheet, i18n, storage, escapeHtml, pixEngine } from '../../../services/index.js';
import styles from 'bundle-text:./AddSongDialog.css';
import template from 'bundle-text:./AddSongDialog.template.html';

export class AddSongDialog extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('kt-add-song-dialog', this);
  }

  constructor() {
    super();
    this._editMode = false;
    this._songId = null;
    this._singers = [];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();

    document.addEventListener('singers:updated', () => this.loadSingers());
    document.addEventListener('app:ready', () => this.loadSingers());
  }

  async loadSingers() {
    try {
      this._singers = await storage.getAllSingers();
      this.renderSingerCheckboxes();
    } catch (error) {
      console.error('Failed to load singers:', error);
    }
  }

  render() {
    this.innerHTML = pixEngine(template, {
      title: i18n.t('addSong.title'),
      songTitleLabel: i18n.t('addSong.songTitle'),
      songTitlePlaceholder: i18n.t('addSong.songTitlePlaceholder'),
      authorLabel: i18n.t('addSong.author'),
      authorPlaceholder: i18n.t('addSong.authorPlaceholder'),
      singersLabel: i18n.t('addSong.singers'),
      noSingersText: i18n.t('addSong.noSingers'),
      keyLabel: i18n.t('addSong.key'),
      keyOriginal: i18n.t('addSong.keyOriginal'),
      youtubeLabel: i18n.t('addSong.youtubeUrl'),
      youtubePlaceholder: i18n.t('addSong.youtubeUrlPlaceholder'),
      cancelText: i18n.t('common.cancel'),
      saveText: i18n.t('common.save')
    });
  }

  renderSingerCheckboxes() {
    const container = this.querySelector('#singer-checkboxes');
    if (!container) return;

    if (this._singers.length === 0) {
      container.innerHTML = `<p>${i18n.t('addSong.noSingers')}</p>`;
      return;
    }

    container.innerHTML = this._singers
      .map(
        singer => `
            <label>
                <input type="checkbox" name="singerIds" value="${singer.id}">
                <span>${escapeHtml(singer.name)}</span>
            </label>
        `
      )
      .join('');
  }

  setupEventListeners() {
    const form = this.querySelector('form');
    const cancelBtn = this.querySelector('[data-action="cancel"]');
    const dialog = this.querySelector('pix-dialog');
    const titleInput = this.querySelector('#song-title');
    const authorInput = this.querySelector('#song-author');

    // Check for duplicate song on blur
    const checkDuplicate = async () => {
      const title = titleInput?.value?.trim();
      const author = authorInput?.value?.trim();

      if (!title) {
        this.hideWarning();
        return;
      }

      const result = await storage.checkSongPerformed(title, author);
      if (result.performed) {
        this.showWarning(i18n.t('addSong.alreadyPerformed'));
      } else {
        this.hideWarning();
      }
    };

    titleInput?.addEventListener('blur', checkDuplicate);
    authorInput?.addEventListener('blur', checkDuplicate);

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

  showWarning(message) {
    const warning = this.querySelector('#song-warning');
    const text = this.querySelector('#song-warning-text');
    if (warning && text) {
      text.textContent = message;
      warning.hidden = false;
    }
  }

  hideWarning() {
    const warning = this.querySelector('#song-warning');
    if (warning) {
      warning.hidden = true;
    }
  }

  async handleSubmit(formData) {
    const title = formData.get('title')?.trim();
    const author = formData.get('author')?.trim();
    const singerIds = formData.getAll('singerIds').map(id => parseInt(id, 10));
    const keyValue = formData.get('key');
    const key = keyValue && keyValue !== '' ? keyValue : null;
    const youtubeUrl = formData.get('youtubeUrl')?.trim();

    if (!title || singerIds.length === 0) {
      // Could show validation message
      return;
    }

    try {
      const songData = { title, author, singerIds, key, youtubeUrl };

      if (this._editMode && this._songId) {
        await storage.updateSong(this._songId, songData);
      } else {
        // Check if fair play mode is enabled
        const fairPlayEnabled = localStorage.getItem('karaoke-tracker-fair-play') === 'true';

        if (fairPlayEnabled) {
          const position = await storage.getFairPlayPosition(singerIds);
          await storage.addSongAtPosition(songData, position);
        } else {
          await storage.addSong(songData);
        }
      }

      document.dispatchEvent(new CustomEvent('songs:updated'));
      this.close();
    } catch (error) {
      console.error('Failed to save song:', error);
    }
  }

  async open(editData = null) {
    await this.loadSingers();

    const dialog = this.querySelector('pix-dialog');
    const title = dialog?.querySelector('.dialog__title');

    if (editData?.song) {
      this._editMode = true;
      this._songId = editData.song.id;

      // Populate form fields
      const titleInput = this.querySelector('#song-title');
      const authorInput = this.querySelector('#song-author');
      const keyInput = this.querySelector('#song-key');
      const youtubeInput = this.querySelector('#song-youtube');

      if (titleInput) titleInput.value = editData.song.title || '';
      if (authorInput) authorInput.value = editData.song.author || '';
      if (keyInput) keyInput.value = editData.song.key || '';
      if (youtubeInput) youtubeInput.value = editData.song.youtubeUrl || '';

      // Check singer checkboxes
      const checkboxes = this.querySelectorAll('input[name="singerIds"]');
      checkboxes.forEach(cb => {
        cb.checked = editData.song.singerIds?.includes(parseInt(cb.value, 10)) || false;
      });

      if (title) title.textContent = i18n.t('addSong.editTitle');
    } else {
      this._editMode = false;
      this._songId = null;
      if (title) title.textContent = i18n.t('addSong.title');
    }

    dialog?.open();
    this.querySelector('#song-title')?.focus();
  }

  close() {
    const dialog = this.querySelector('pix-dialog');
    dialog?.close();
  }

  reset() {
    const form = this.querySelector('form');
    form?.reset();
    this._editMode = false;
    this._songId = null;
  }
}

export default AddSongDialog;
