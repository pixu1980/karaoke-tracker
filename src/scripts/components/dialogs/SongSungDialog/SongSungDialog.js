import styles from 'bundle-text:./SongSungDialog.css';
import template from 'bundle-text:./SongSungDialog.template.html';
import { i18n, pixEngine, registerStylesheet, storage } from '../../../services/index.js';
import { Dialog } from '../../ui/Dialog/Dialog.js';

/**
 * Song Sung Dialog Custom Element - extends Dialog
 * Dialog for marking a singer's performance as complete with optional rating
 * Usage: <dialog is="song-sung-dialog">...</dialog>
 */
class SongSungDialog extends Dialog {
  static {
    // Inject component styles using adoptedStyleSheets
    registerStylesheet(styles);

    customElements.define('song-sung-dialog', SongSungDialog, { extends: 'dialog' });
  }

  constructor() {
    super();
    this._songId = null;
    this._songName = '';
    this._songTitle = '';
  }

  get songId() {
    return this._songId;
  }

  get songName() {
    return this._songName;
  }

  get songTitle() {
    return this._songTitle;
  }

  connectedCallback() {
    this.classList.add('confirm-dialog', 'song-sung-dialog');
    super.connectedCallback();
  }

  render() {
    this.innerHTML = pixEngine(template, {
      songName: this._songName
    });
  }
  
  /**
   * Open the dialog for a specific song
   * @param {object} song - The song object
   * @param {number} song.id - Song ID
   * @param {string} song.name - Song name
   * @param {string} song.songTitle - Song title
   */
  showModal(song) {
    this._songId = song.id;
    this._songName = song.name;
    this._songTitle = song.songTitle || '';

    this.render();
    this.setupEventListeners();
    this.updateTranslations();
    super.showModal();
  }

  async handleConfirm() {
    const starRating = this.querySelector('input[is="star-rating"]');
    const rating = starRating ? Number(starRating.value) : 0;
    const autoReaddCheckbox = document.getElementById('autoReaddCheckbox');

    try {
      // Save performance with rating for leaderboard
      if (rating > 0) {
        await storage.addPerformance({
          songName: this._songName,
          songTitle: this._songTitle,
          rating: rating
        });
        window.dispatchEvent(new CustomEvent('performance-added'));
      }

      await storage.deleteSong(this._songId);

      // Auto re-add if checkbox is checked
      if (autoReaddCheckbox?.checked) {
        await storage.addSong({
          name: this._songName,
          songTitle: '(next song)',
          songAuthor: '',
          songKey: '0',
          youtubeUrl: ''
        });
        window.dispatchEvent(new CustomEvent('song-added'));
      } else {
        window.dispatchEvent(new CustomEvent('song-deleted'));
      }

      this.close();
    } catch (error) {
      console.error('Error completing song:', error);
      alert('Failed to complete song. Please try again.');
    }
  }
}

export { SongSungDialog };
export default SongSungDialog;
