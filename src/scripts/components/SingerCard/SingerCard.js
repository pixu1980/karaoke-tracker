import styles from 'bundle-text:./SingerCard.css';
import template from 'bundle-text:./SingerCard.template.html';
import { i18n, pixEngine, storage } from '../../services/index.js';

/**
 * Singer Card Custom Element
 * Displays a single singer card with their info and actions
 */
export class SingerCard extends HTMLElement {
  static {
    // Inject component styles into document head
    const styleSheet = document.createElement('style');
    styleSheet.setAttribute('data-component', 'singer-card');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    customElements.define('singer-card', SingerCard);
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
    const starRating = this.querySelector('star-rating');
    starRating.addEventListener('rating-change', async e => {
      try {
        await storage.updateSinger(Number(id), { rating: e.detail.value });
        // Update the data-rating attribute so it's available when opening Done dialog
        this.dataset.rating = e.detail.value;
      } catch (error) {
        console.error('Error updating rating:', error);
      }
    });
  }

  handleEdit(id) {
    const editDialog = document.getElementById('editSingerDialog');
    const form = editDialog.querySelector('form');

    // Populate form with current data
    form.querySelector('[name="editId"]').value = id;
    form.querySelector('[name="editName"]').value = this.dataset.name;
    form.querySelector('[name="editSongTitle"]').value = this.dataset.songTitle;
    form.querySelector('[name="editSongAuthor"]').value = this.dataset.songAuthor || '';
    form.querySelector('[name="editSongKey"]').value = this.dataset.songKey || '0';
    form.querySelector('[name="editYoutubeUrl"]').value = this.dataset.youtubeUrl || '';

    editDialog.showModal();
  }

  async handleDone(id, name) {
    const doneDialog = document.getElementById('doneSingerDialog');
    const dialogName = doneDialog.querySelector('.dialog-singer-name');
    dialogName.textContent = name;

    // Set star rating from card's current rating
    const starRating = doneDialog.querySelector('star-rating');
    if (starRating) {
      const currentRating = parseFloat(this.dataset.rating) || 0;
      starRating.value = currentRating;
    }

    doneDialog.dataset.singerId = id;
    doneDialog.dataset.singerName = name;
    doneDialog.dataset.songTitle = this.dataset.songTitle;
    doneDialog.showModal();
  }

  async handleRemove(id, name) {
    const removeDialog = document.getElementById('removeSingerDialog');
    const dialogName = removeDialog.querySelector('.dialog-singer-name');
    dialogName.textContent = name;
    removeDialog.dataset.singerId = id;
    removeDialog.showModal();
  }
}

export default SingerCard;
