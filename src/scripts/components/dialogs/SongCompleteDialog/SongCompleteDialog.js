/**
 * SongCompleteDialog Component
 * Dialog for marking a song as complete with rating
 */
import { registerStylesheet, i18n, storage, pixEngine } from '../../../services/index.js';
import styles from 'bundle-text:./SongCompleteDialog.css';
import template from 'bundle-text:./SongCompleteDialog.template.html';

export class SongCompleteDialog extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('kt-song-complete-dialog', this);
  }

  constructor() {
    super();
    this._song = null;
    this._singers = [];
    this._autoRotate = true;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();

    // Load auto-rotate setting
    this._autoRotate = localStorage.getItem('karaoke-tracker-auto-rotate') !== 'false';
  }

  render() {
    this.innerHTML = pixEngine(template, {
      title: i18n.t('songComplete.title'),
      ratingLabel: i18n.t('songComplete.rating'),
      cancelLabel: i18n.t('common.cancel'),
      confirmLabel: i18n.t('songComplete.confirm')
    });
  }

  setupEventListeners() {
    const cancelBtn = this.querySelector('[data-action="cancel"]');
    const completeBtn = this.querySelector('[data-action="complete"]');
    const dialog = this.querySelector('pix-dialog');

    cancelBtn?.addEventListener('click', () => {
      this.close();
    });

    completeBtn?.addEventListener('click', () => {
      this.handleComplete();
    });

    dialog?.addEventListener('dialog:close', () => {
      this.reset();
    });
  }

  async handleComplete() {
    if (!this._song) return;

    const ratingEl = this.querySelector('pix-rating');
    const rating = ratingEl?.value || 0;

    try {
      // Archive the song
      await storage.archiveSong(this._song.id);

      // Create performance records for each singer
      const performances = this._singers.map(singer => ({
        songId: this._song.id,
        singerId: singer.id,
        songTitle: this._song.title,
        singerName: singer.name,
        rating: rating > 0 ? rating : null
      }));

      await storage.addPerformances(performances);

      // Rotate singers to bottom if auto-rotate is enabled
      if (this._autoRotate && this._song.singerIds?.length > 0) {
        await storage.rotateSingersToBottom(this._song.singerIds);
        document.dispatchEvent(new CustomEvent('singers:updated'));
      }

      // Notify updates
      document.dispatchEvent(new CustomEvent('songs:updated'));
      document.dispatchEvent(new CustomEvent('performances:updated'));

      this.close();
    } catch (error) {
      console.error('Failed to complete song:', error);
    }
  }

  open(data) {
    if (!data?.song) return;

    this._song = data.song;
    this._singers = data.singers || [];

    const songTitle = this.querySelector('[data-role="song-title"]');
    const singersEl = this.querySelector('[data-role="singers"]');

    if (songTitle) songTitle.textContent = this._song.title;
    if (singersEl) {
      const singerNames = this._singers.map(s => s.name).join(', ');
      singersEl.textContent = singerNames || i18n.t('song.unknownSinger');
    }

    const dialog = this.querySelector('pix-dialog');
    dialog?.open();
  }

  close() {
    const dialog = this.querySelector('pix-dialog');
    dialog?.close();
  }

  reset() {
    const ratingEl = this.querySelector('pix-rating');
    if (ratingEl) {
      ratingEl.value = 0;
    }
    this._song = null;
    this._singers = [];
  }
}

export default SongCompleteDialog;
