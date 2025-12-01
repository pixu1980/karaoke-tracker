/**
 * SessionStatsDialog Component
 * Dialog showing overall session statistics
 */
import { registerStylesheet, i18n, storage, pixEngine } from '../../../services/index.js';
import styles from 'bundle-text:./SessionStatsDialog.css';
import template from 'bundle-text:./SessionStatsDialog.template.html';

export class SessionStatsDialog extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('kt-session-stats-dialog', this);
  }

  constructor() {
    super();
    this._stats = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = pixEngine(template, {
      title: i18n.t('sessionStats.title'),
      closeText: i18n.t('common.close'),
      hasStats: false
    });
  }

  renderStats() {
    if (!this._stats) return;

    const formatTime = minutes => {
      if (minutes < 60) return `${minutes} min`;
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    // Build top 3 singers
    const medals = ['🥇', '🥈', '🥉'];
    const topSingers = (this._stats.topSingers || []).slice(0, 3).map((singer, index) => ({
      medal: medals[index],
      name: singer.name,
      songCount: singer.songCount,
      avgRating: singer.averageRating?.toFixed(1) || '',
      stars: singer.averageRating ? this.renderStars(singer.averageRating) : ''
    }));

    this.innerHTML = pixEngine(template, {
      title: i18n.t('sessionStats.title'),
      closeText: i18n.t('common.close'),
      noStats: i18n.t('sessionStats.noStats') || 'No session data yet',
      hasStats: true,
      // Main stats
      totalSingers: this._stats.totalSingers,
      totalSongsPerformed: this._stats.totalSongsPerformed,
      songsInQueue: this._stats.songsInQueue,
      averageRating: this._stats.averageRating?.toFixed(1) || '—',
      averageStars: this._stats.averageRating ? this.renderStars(this._stats.averageRating) : '',
      estimatedTimeRemaining: formatTime(this._stats.estimatedMinutesRemaining),
      // Labels
      singersLabel: i18n.t('sessionStats.singers'),
      performedLabel: i18n.t('sessionStats.performed'),
      inQueueLabel: i18n.t('sessionStats.inQueue'),
      avgRatingLabel: i18n.t('sessionStats.avgRating'),
      timeRemainingLabel: i18n.t('sessionStats.timeRemaining'),
      // Top 3 singers
      hasTopSingers: topSingers.length > 0,
      topSingersLabel: i18n.t('sessionStats.topSingers') || 'Top Performers',
      topSingers,
      songsText: i18n.t('common.songs') || 'songs'
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

  async open() {
    try {
      this._stats = await storage.getSessionStats();
      this.renderStats();
    } catch (error) {
      console.error('Failed to load session stats:', error);
    }

    const dialog = this.querySelector('pix-dialog');
    dialog?.open();
  }

  close() {
    const dialog = this.querySelector('pix-dialog');
    dialog?.close();
  }

  reset() {
    this._stats = null;
  }
}

export default SessionStatsDialog;
