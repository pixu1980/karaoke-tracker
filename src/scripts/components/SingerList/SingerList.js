import styles from 'bundle-text:./SingerList.css';
import template from 'bundle-text:./SingerList.template.html';
import { i18n, pixEngine, storage } from '../../services/index.js';

/**
 * Singer List Custom Element
 * Displays the list of all singers in the queue
 */
export class SingerList extends HTMLElement {
  static {
    // Inject component styles into document head
    const styleSheet = document.createElement('style');
    styleSheet.setAttribute('data-component', 'singer-list');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    customElements.define('singer-list', SingerList);
  }

  connectedCallback() {
    // Wait for storage to be ready
    window.addEventListener('storage-ready', () => this.loadSingers());

    // Listen for singer-added events
    window.addEventListener('singer-added', () => this.loadSingers());
    window.addEventListener('singer-deleted', () => this.loadSingers());

    // Listen for language changes
    window.addEventListener('language-changed', () => this.loadSingers());
  }

  async loadSingers() {
    try {
      const singers = await storage.getAllSingers();
      this.renderSingers(singers);
    } catch (error) {
      console.error('Error loading singers:', error);
      this.innerHTML = '<p class="empty-state-text">Failed to load singers.</p>';
    }
  }

  renderSingers(singers) {
    // Prepare singers data with fallback values (escaping handled by template engine)
    const preparedSingers = singers.map(singer => ({
      id: singer.id,
      name: singer.name,
      songTitle: singer.songTitle || singer.song || '',
      songAuthor: singer.songAuthor || '',
      songKey: singer.songKey || '',
      youtubeUrl: singer.youtubeUrl || '',
      rating: singer.rating || ''
    }));

    this.innerHTML = pixEngine(template, {
      hasSingers: singers.length > 0,
      singers: preparedSingers,
      noSingersMessage: i18n.t('noSingers')
    });
  }
}

export default SingerList;
