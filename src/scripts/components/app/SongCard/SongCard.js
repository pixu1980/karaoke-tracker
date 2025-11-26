import styles from 'bundle-text:./SongCard.css';
import template from 'bundle-text:./SongCard.template.html';
import { i18n, pixEngine, registerStylesheet, storage } from '../../../services/index.js';

/**
 * Song Card Custom Element
 * Displays a single song card with singer info and actions
 */
class SongCard extends HTMLElement {
  static {
    // Inject component styles using adoptedStyleSheets
    registerStylesheet(styles);

    customElements.define('song-card', SongCard);
  }

  connectedCallback() {
    const id = this.dataset.id;
    const name = this.dataset.name;
    const songTitle = this.dataset.songTitle;
    const songAuthor = this.dataset.songAuthor;
    const songKey = this.dataset.songKey;
    const youtubeUrl = this.dataset.youtubeUrl;
    const rating = this.dataset.rating || '';
    const isSinging = this.hasAttribute('data-singing');

    // Format key display (handle both numeric and string values with +/- prefix)
    let keyDisplay = '';
    if (songKey && songKey !== '0') {
      const keyNum = parseInt(songKey, 10);
      keyDisplay = keyNum > 0 ? `+${keyNum}` : String(keyNum);
    }

    this.innerHTML = pixEngine(template, {
      id,
      name,
      songTitle,
      songAuthor,
      songKey,
      youtubeUrl,
      rating,
      isSinging,
      keyDisplay,
      nowSingingLabel: i18n.t('nowSinging'),
      editLabel: i18n.t('edit'),
      doneLabel: i18n.t('done'),
      removeLabel: i18n.t('remove')
    });

    // Add event listeners
    this.querySelector('[data-action="edit"]').addEventListener('click', () => this.handleEdit(id));
    this.querySelector('[data-action="done"]').addEventListener('click', () => this.handleDone(id, name));
    this.querySelector('[data-action="remove"]').addEventListener('click', () => this.handleRemove(id, name));

    // Rating change listener
    const starRating = this.querySelector('pix-rating');
    starRating.addEventListener('rating-change', async e => {
      try {
        await storage.updateSong(Number(id), { rating: e.detail.value });
        // Update the data-rating attribute so it's available when opening Done dialog
        this.dataset.rating = e.detail.value;
      } catch (error) {
        console.error('Error updating rating:', error);
      }
    });
  }

  handleEdit(id) {
    const editDialog = document.getElementById('editSongDialog');

    // Build song object from card data
    const song = {
      id: Number(id),
      name: this.dataset.name,
      songTitle: this.dataset.songTitle,
      songAuthor: this.dataset.songAuthor || '',
      songKey: this.dataset.songKey || '0',
      youtubeUrl: this.dataset.youtubeUrl || ''
    };

    editDialog.showModal(song);
  }

  async handleDone(id, name) {
    const doneDialog = document.getElementById('doneSongDialog');

    // Build song object for the dialog
    const song = {
      id: Number(id),
      name: name,
      songTitle: this.dataset.songTitle
    };

    doneDialog.showModal(song);
  }

  async handleRemove(id, name) {
    const removeDialog = document.getElementById('removeSongDialog');
    removeDialog.showModal(Number(id), name);
  }
}

export { SongCard };
export default SongCard;
