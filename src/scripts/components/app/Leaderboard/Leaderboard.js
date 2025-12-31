/**
 * Leaderboard Component
 * Displays singers ranked by average rating
 */
import { registerStylesheet, i18n, storage, pixEngine } from '../../../services/index.js';
import styles from 'bundle-text:./Leaderboard.css';
import template from 'bundle-text:./Leaderboard.template.html';

export class Leaderboard extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('kt-leaderboard', this);
  }

  constructor() {
    super();
    this._leaderboard = [];
    this._filterText = '';
    this._handleAppReady = () => this.loadData();
    this._handlePerformancesUpdated = () => this.loadData();
    this._handleLanguageChanged = () => this.render();
    this._handleClick = this.handleClick.bind(this);
  }

  async connectedCallback() {
    this.render();
    this.addEventListener('click', this._handleClick);
    this.addEventListener('input', this.handleFilter.bind(this));
    document.addEventListener('app:ready', this._handleAppReady);
    document.addEventListener('performances:updated', this._handlePerformancesUpdated);
    window.addEventListener('language-changed', this._handleLanguageChanged);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._handleClick);
    document.removeEventListener('app:ready', this._handleAppReady);
    document.removeEventListener('performances:updated', this._handlePerformancesUpdated);
    window.removeEventListener('language-changed', this._handleLanguageChanged);
  }

  handleFilter(event) {
    const input = event.target.closest('input[data-filter]');
    if (!input) return;

    this._filterText = input.value.toLowerCase().trim();
    this.updateList();
  }

  handleClick(event) {
    const li = event.target.closest('li[rank]');
    if (!li) return;

    const rank = parseInt(li.getAttribute('rank'), 10);
    const entry = this._leaderboard[rank - 1];
    if (!entry) return;

    this.dispatchEvent(
      new CustomEvent('singer:stats-request', {
        bubbles: true,
        detail: { singerId: entry.singerId, singerName: entry.singerName }
      })
    );
  }

  async loadData() {
    try {
      this._leaderboard = await storage.getLeaderboard();
      this.render();
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  }

  render() {
    const entries = this._leaderboard.map((entry, index) => ({
      rank: index + 1,
      rankDisplay: this.getRankDisplay(index),
      name: entry.singerName,
      singerId: entry.singerId,
      stars: this.renderStars(entry.averageRating),
      ratingValue: entry.averageRating.toFixed(1),
      ratingLabel: `${entry.averageRating.toFixed(1)} ${i18n.t('rating.stars')}`,
      songCountText: `${entry.songCount} ${entry.songCount === 1 ? i18n.t('singer.song') : i18n.t('singer.songs')}`
    }));

    this.innerHTML = pixEngine(template, {
      title: i18n.t('leaderboard.title'),
      filterPlaceholder: i18n.t('filter.leaderboard'),
      emptyText: i18n.t('leaderboard.empty'),
      entries,
      hasEntries: entries.length > 0
    });

    // Restore filter text
    const filterInput = this.querySelector('input[data-filter]');
    if (filterInput && this._filterText) {
      filterInput.value = this._filterText;
      this.updateList();
    }

    // Ensure real-time filtering by attaching a direct input handler
    if (filterInput) {
      filterInput.oninput = e => {
        this._filterText = e.target.value.toLowerCase().trim();
        this.updateList();
      };
    }
  }

  updateList() {
    const items = this.querySelectorAll('ul > li');
    items.forEach(li => {
      const nameSpan = li.querySelector('span:nth-child(2)');
      const name = nameSpan?.textContent?.toLowerCase() || '';
      li.hidden = this._filterText && !name.includes(this._filterText);
    });
  }

  getRankDisplay(index) {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return index + 1;
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars += '★';
      } else if (i === fullStars && hasHalfStar) {
        stars += '☆';
      } else {
        stars += '☆';
      }
    }

    return stars;
  }
}

export default Leaderboard;
