/**
 * SongCard Component
 * Displays a single song in the queue with singer info and actions
 */
import { registerStylesheet, i18n, storage, pixEngine } from '../../../services/index.js';
import styles from 'bundle-text:./SongCard.css';
import template from 'bundle-text:./SongCard.template.html';

export class SongCard extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('kt-song-card', this);
  }

  static observedAttributes = ['song-id', 'wait-time'];

  constructor() {
    super();
    this._song = null;
    this._singers = [];
    this._waitTime = 0;
  }

  get songId() {
    return this._song?.id || null;
  }

  async connectedCallback() {
    const songId = parseInt(this.getAttribute('song-id'), 10);
    this._waitTime = parseInt(this.getAttribute('wait-time'), 10) || 0;
    if (songId) {
      await this.loadData(songId);
    }
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'song-id' && this.isConnected) {
      const songId = parseInt(newValue, 10);
      if (songId) {
        await this.loadData(songId);
      }
    }
  }

  async loadData(songId) {
    try {
      this._song = await storage.getSong(songId);
      if (this._song && this._song.singerIds) {
        const allSingers = await storage.getAllSingers();
        this._singers = allSingers.filter(s => this._song.singerIds.includes(s.id));
      }
      this.render();
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to load song:', error);
    }
  }

  render() {
    if (!this._song) {
      this.innerHTML = '';
      return;
    }

    const singerNames = this._singers.map(s => s.name).join(', ') || i18n.t('song.unknownSinger');

    this.innerHTML = pixEngine(template, {
      songId: this._song.id,
      title: this._song.title,
      author: this._song.author || '',
      hasAuthor: Boolean(this._song.author),
      singers: singerNames,
      hasKey: this._song.key !== null && this._song.key !== undefined && this._song.key !== '',
      keyValue: this._song.key ?? '',
      keyLabel: i18n.t('song.key'),
      hasWaitTime: this._waitTime > 0,
      waitTime: this._waitTime,
      waitTimeLabel: i18n.t('song.waitTime'),
      hasYoutube: Boolean(this._song.youtubeUrl),
      youtubeUrl: this._song.youtubeUrl || '',
      youtubeLabel: i18n.t('song.openYoutube'),
      completeLabel: i18n.t('song.markComplete'),
      editLabel: i18n.t('song.edit'),
      deleteLabel: i18n.t('song.delete')
    });
  }

  setupEventListeners() {
    const completeBtn = this.querySelector('button[complete]');
    const editBtn = this.querySelector('button[edit]');
    const deleteBtn = this.querySelector('button[delete]');

    completeBtn?.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('song:complete', {
          bubbles: true,
          detail: {
            songId: this._song.id,
            song: this._song,
            singers: this._singers
          }
        })
      );
    });

    editBtn?.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('song:edit', {
          bubbles: true,
          detail: { songId: this._song.id, song: this._song }
        })
      );
    });

    deleteBtn?.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('song:delete', {
          bubbles: true,
          detail: { songId: this._song.id, song: this._song }
        })
      );
    });
  }
}

export default SongCard;
