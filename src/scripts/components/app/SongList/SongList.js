import styles from 'bundle-text:./SongList.css';
import template from 'bundle-text:./SongList.template.html';
import { i18n, pixEngine, registerStylesheet, storage } from '../../../services/index.js';

/**
 * Song List Custom Element
 * Displays the list of all songs in the queue
 */
class SongList extends HTMLElement {
  static {
    // Inject component styles using adoptedStyleSheets
    registerStylesheet(styles);

    customElements.define('song-list', SongList);
  }

  connectedCallback() {
    // Wait for storage to be ready
    window.addEventListener('storage-ready', () => this.loadSongs());

    // Listen for song-added events
    window.addEventListener('singer-added', () => this.loadSongs());
    window.addEventListener('singer-deleted', () => this.loadSongs());

    // Listen for language changes
    window.addEventListener('language-changed', () => this.loadSongs());
  }

  async loadSongs() {
    try {
      const songs = await storage.getAllSongs();
      this.renderSongs(songs);
    } catch (error) {
      console.error('Error loading songs:', error);
      this.innerHTML = '<p class="empty-state-text">Failed to load songs.</p>';
    }
  }

  renderSongs(songs) {
    // Prepare songs data with fallback values (escaping handled by template engine)
    const preparedSongs = songs.map(song => ({
      id: song.id,
      name: song.name,
      songTitle: song.songTitle || song.song || '',
      songAuthor: song.songAuthor || '',
      songKey: song.songKey || '',
      youtubeUrl: song.youtubeUrl || '',
      rating: song.rating || ''
    }));

    this.innerHTML = pixEngine(template, {
      hasSongs: songs.length > 0,
      songs: preparedSongs,
      noSongsMessage: i18n.t('noSingers')
    });
  }
}

export { SongList };
export default SongList;
