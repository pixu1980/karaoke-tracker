/**
 * SingerStatsDialog Component
 * Dialog showing detailed stats for a specific singer
 */
import { registerStylesheet, i18n, storage, pixEngine } from '../../../services/index.js';
import styles from 'bundle-text:./SingerStatsDialog.css';
import template from 'bundle-text:./SingerStatsDialog.template.html';

export class SingerStatsDialog extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('kt-singer-stats-dialog', this);
  }

  constructor() {
    super();
    this._singerId = null;
    this._stats = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = pixEngine(template, {
      title: i18n.t('singerStats.title'),
      closeText: i18n.t('common.close'),
      noPerformances: i18n.t('singerStats.noPerformances'),
      songsLabel: i18n.t('singerStats.songsPerformed'),
      averageLabel: i18n.t('singerStats.averageRating'),
      bestLabel: i18n.t('singerStats.bestRating'),
      historyLabel: i18n.t('singerStats.history'),
      hasStats: false
    });
  }

  renderStats() {
    if (!this._stats) return;

    const history = this._stats.songHistory.map(song => ({
      title: song.title,
      author: song.author,
      rating: song.rating ? this.renderStars(song.rating) : '—',
      ratingValue: song.rating ? song.rating.toFixed(1) : null,
      time: new Date(song.performedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    this.innerHTML = pixEngine(template, {
      title: this._stats.singerName,
      closeText: i18n.t('common.close'),
      noPerformances: i18n.t('singerStats.noPerformances'),
      songsLabel: i18n.t('singerStats.songsPerformed'),
      averageLabel: i18n.t('singerStats.averageRating'),
      bestLabel: i18n.t('singerStats.bestRating'),
      historyLabel: i18n.t('singerStats.history'),
      hasStats: this._stats.songCount > 0,
      songCount: this._stats.songCount,
      averageRating: this._stats.averageRating?.toFixed(1) || '—',
      averageStars: this._stats.averageRating ? this.renderStars(this._stats.averageRating) : '',
      bestRating: this._stats.bestRating?.toFixed(1) || '—',
      bestStars: this._stats.bestRating ? this.renderStars(this._stats.bestRating) : '',
      history,
      hasHistory: history.length > 0
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    const closeBtn = this.querySelector('[data-action="close"]');
    const dialog = this.querySelector('pix-dialog');

    closeBtn?.addEventListener('click', () => this.close());
    dialog?.addEventListener('dialog:close', () => this.reset());
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    // SVG star icons
    const fullStar = '<svg class="star-icon star-full" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    const halfStar = '<svg class="star-icon star-half" width="14" height="14" viewBox="0 0 24 24"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#half)" stroke="currentColor" stroke-width="1" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    const emptyStar = '<svg class="star-icon star-empty" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars += fullStar;
      } else if (i === fullStars && hasHalfStar) {
        stars += halfStar;
      } else {
        stars += emptyStar;
      }
    }

    return stars;
  }

  async open(singerId) {
    this._singerId = singerId;

    try {
      this._stats = await storage.getSingerStats(singerId);
      this.renderStats();
    } catch (error) {
      console.error('Failed to load singer stats:', error);
    }

    const dialog = this.querySelector('pix-dialog');
    dialog?.open();
  }

  close() {
    const dialog = this.querySelector('pix-dialog');
    dialog?.close();
  }

  reset() {
    this._singerId = null;
    this._stats = null;
  }
}

export default SingerStatsDialog;
