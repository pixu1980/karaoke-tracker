import styles from 'bundle-text:./SingerLeaderboard.css';
import template from 'bundle-text:./SingerLeaderboard.template.html';
import { i18n, pixEngine, registerStylesheet, storage } from '../../../services/index.js';

/**
 * Singer Leaderboard Custom Element
 * Displays ranked list of singers by average rating
 */
class SingerLeaderboard extends HTMLElement {
  static {
    // Inject component styles using adoptedStyleSheets
    registerStylesheet(styles);

    customElements.define('singer-leaderboard', SingerLeaderboard);
  }

  connectedCallback() {
    window.addEventListener('storage-ready', () => this.loadLeaderboard());
    window.addEventListener('performance-added', () => this.loadLeaderboard());
    window.addEventListener('leaderboard-reset', () => this.loadLeaderboard());
    window.addEventListener('language-changed', () => this.loadLeaderboard());
  }

  async loadLeaderboard() {
    try {
      const performances = await storage.getAllPerformances();
      this.renderLeaderboard(performances);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      this.innerHTML = '<p class="empty-state-text">Failed to load leaderboard.</p>';
    }
  }

  renderLeaderboard(performances) {
    // Group performances by singer name and calculate average rating
    const singerStats = {};

    for (const perf of performances) {
      if (perf.rating && perf.rating > 0) {
        if (!singerStats[perf.singerName]) {
          singerStats[perf.singerName] = {
            name: perf.singerName,
            totalRating: 0,
            count: 0,
            songs: []
          };
        }
        singerStats[perf.singerName].totalRating += perf.rating;
        singerStats[perf.singerName].count++;
        singerStats[perf.singerName].songs.push({
          title: perf.songTitle,
          rating: perf.rating
        });
      }
    }

    // Convert to array, calculate averages, and prepare for template
    const leaderboard = Object.values(singerStats)
      .map(singer => {
        const averageRating = singer.totalRating / singer.count;
        return {
          ...singer,
          averageRating,
          averageRatingFormatted: averageRating.toFixed(1),
          songLabel: singer.count > 1 ? i18n.t('songs') : i18n.t('song'),
          stars: this.renderStars(averageRating)
        };
      })
      .sort((a, b) => b.averageRating - a.averageRating)
      .map((singer, index) => ({
        ...singer,
        rankEmoji: this.getRankEmoji(index + 1)
      }));

    this.innerHTML = pixEngine(template, {
      hasLeaderboard: leaderboard.length > 0,
      leaderboard,
      noRatedPerformancesMessage: i18n.t('noRatedPerformances'),
      leaderboardHintMessage: i18n.t('leaderboardHint')
    });
  }

  getRankEmoji(rank) {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '½';
    return stars;
  }
}

export { SingerLeaderboard };
export default SingerLeaderboard;
