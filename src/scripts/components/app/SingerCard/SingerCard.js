/**
 * SingerCard Component
 * Displays a single singer with song count and actions
 */
import { registerStylesheet, i18n, pixEngine } from '../../../services/index.js';
import styles from 'bundle-text:./SingerCard.css';
import template from 'bundle-text:./SingerCard.template.html';

export class SingerCard extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('kt-singer-card', this);
  }

  static observedAttributes = ['singer-id', 'singer-name', 'song-count'];

  constructor() {
    super();
    this._singerId = null;
    this._singerName = '';
    this._songCount = 0;
  }

  get singerId() {
    return this._singerId;
  }

  get singerName() {
    return this._singerName;
  }

  get songCount() {
    return this._songCount;
  }

  connectedCallback() {
    this._singerId = parseInt(this.getAttribute('singer-id'), 10) || null;
    this._singerName = this.getAttribute('singer-name') || '';
    this._songCount = parseInt(this.getAttribute('song-count'), 10) || 0;

    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'singer-id') {
      this._singerId = parseInt(newValue, 10) || null;
    } else if (name === 'singer-name') {
      this._singerName = newValue || '';
    } else if (name === 'song-count') {
      this._songCount = parseInt(newValue, 10) || 0;
    }

    if (this.isConnected) {
      this.render();
      this.setupEventListeners();
    }
  }

  render() {
    this.innerHTML = pixEngine(template, {
      singerId: this._singerId,
      name: this._singerName,
      songCount: this._songCount,
      songLabel: this._songCount === 1 ? i18n.t('singer.song') : i18n.t('singer.songs'),
      editLabel: i18n.t('singer.edit'),
      deleteLabel: i18n.t('singer.delete')
    });
  }

  setupEventListeners() {
    const editBtn = this.querySelector('button[edit]');
    const deleteBtn = this.querySelector('button[delete]');

    editBtn?.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('singer:edit', {
          bubbles: true,
          detail: { singerId: this._singerId, singerName: this._singerName }
        })
      );
    });

    deleteBtn?.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('singer:delete', {
          bubbles: true,
          detail: { singerId: this._singerId, singerName: this._singerName }
        })
      );
    });
  }
}

export default SingerCard;
