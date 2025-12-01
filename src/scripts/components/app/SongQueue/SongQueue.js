/**
 * SongQueue Component
 * Displays the queue of songs to be performed
 */
import { registerStylesheet, i18n, storage, pixEngine } from '../../../services/index.js';
import styles from 'bundle-text:./SongQueue.css';
import template from 'bundle-text:./SongQueue.template.html';

export class SongQueue extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('kt-song-queue', this);
  }

  constructor() {
    super();
    this._songs = [];
    this._singers = new Map();
    this._filterText = '';
    this._handleAppReady = () => this.loadData();
    this._handleSongsUpdated = () => this.loadData();
    this._handleSingersUpdated = () => this.loadSingers();
    this._handleLanguageChanged = () => this.render();
  }

  async connectedCallback() {
    this.render();
    this.setupEventListeners();

    document.addEventListener('app:ready', this._handleAppReady);
    document.addEventListener('songs:updated', this._handleSongsUpdated);
    document.addEventListener('singers:updated', this._handleSingersUpdated);
    window.addEventListener('language-changed', this._handleLanguageChanged);
  }

  disconnectedCallback() {
    document.removeEventListener('app:ready', this._handleAppReady);
    document.removeEventListener('songs:updated', this._handleSongsUpdated);
    document.removeEventListener('singers:updated', this._handleSingersUpdated);
    window.removeEventListener('language-changed', this._handleLanguageChanged);
  }

  async loadSingers() {
    try {
      const singers = await storage.getAllSingers();
      this._singers = new Map(singers.map(s => [s.id, s]));
    } catch (error) {
      console.error('Failed to load singers:', error);
    }
  }

  async loadData() {
    try {
      await this.loadSingers();
      this._songs = await storage.getQueuedSongs();
      this.render();
    } catch (error) {
      console.error('Failed to load songs:', error);
    }
  }

  render() {
    const songs = this._songs.map((song, index) => ({
      id: song.id,
      title: song.title,
      author: song.author,
      singerNames:
        song.singerIds
          ?.map(id => this._singers.get(id)?.name)
          .filter(Boolean)
          .join(', ') || '',
      isNext: index === 0,
      waitTime: index * 4 // 4 minutes per song
    }));

    this.innerHTML = pixEngine(template, {
      title: i18n.t('songQueue.title'),
      addLabel: i18n.t('header.addSong'),
      clearLabel: i18n.t('songQueue.clear'),
      filterPlaceholder: i18n.t('filter.songs'),
      emptyText: i18n.t('songQueue.empty'),
      nextLabel: i18n.t('songQueue.next'),
      songs,
      hasSongs: songs.length > 0,
      count: songs.length
    });

    // Restore filter text
    const filterInput = this.querySelector('input[data-filter]');
    if (filterInput && this._filterText) {
      filterInput.value = this._filterText;
      this.updateList();
    }
  }

  updateList() {
    const items = this.querySelectorAll('ul > li');
    items.forEach(li => {
      const card = li.querySelector('kt-song-card');
      if (!card) return;

      const songId = parseInt(card.getAttribute('song-id'), 10);
      const song = this._songs.find(s => s.id === songId);
      if (!song) return;

      const searchText =
        `${song.title} ${song.author} ${song.singerIds?.map(id => this._singers.get(id)?.name).join(' ')}`.toLowerCase();
      li.hidden = this._filterText && !searchText.includes(this._filterText);
    });
  }

  setupEventListeners() {
    // Filter input
    this.addEventListener('input', e => {
      const input = e.target.closest('input[data-filter]');
      if (!input) return;

      this._filterText = input.value.toLowerCase().trim();
      this.updateList();
    });

    // Drag and drop
    this.addEventListener('dragstart', this.handleDragStart.bind(this));
    this.addEventListener('dragover', this.handleDragOver.bind(this));
    this.addEventListener('dragend', this.handleDragEnd.bind(this));
    this.addEventListener('drop', this.handleDrop.bind(this));

    // Header buttons
    this.addEventListener('click', e => {
      const addBtn = e.target.closest('button[primary]');
      const clearBtn = e.target.closest('button[danger]');

      if (addBtn) {
        this.dispatchEvent(
          new CustomEvent('song:add-request', {
            bubbles: true
          })
        );
      }

      if (clearBtn) {
        this.dispatchEvent(
          new CustomEvent('songs:clear-request', {
            bubbles: true
          })
        );
      }
    });

    // Delegate song card events
    this.addEventListener('song:complete', e => {
      this.dispatchEvent(
        new CustomEvent('song:complete-request', {
          bubbles: true,
          detail: e.detail
        })
      );
    });

    this.addEventListener('song:edit', e => {
      this.dispatchEvent(
        new CustomEvent('song:edit-request', {
          bubbles: true,
          detail: e.detail
        })
      );
    });

    this.addEventListener('song:delete', e => {
      this.dispatchEvent(
        new CustomEvent('song:delete-request', {
          bubbles: true,
          detail: e.detail
        })
      );
    });
  }

  handleDragStart(e) {
    const li = e.target.closest('li[data-song-id]');
    if (!li) return;

    this._draggedItem = li;
    li.setAttribute('dragging', '');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', li.dataset.songId);
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const li = e.target.closest('li[data-song-id]');
    if (!li || li === this._draggedItem) return;

    const ul = this.querySelector('ul');
    const items = [...ul.querySelectorAll('li[data-song-id]:not([dragging])')];
    const draggedIndex = items.indexOf(this._draggedItem);
    const targetIndex = items.indexOf(li);

    if (draggedIndex < targetIndex) {
      li.after(this._draggedItem);
    } else {
      li.before(this._draggedItem);
    }
  }

  handleDragEnd(e) {
    const li = e.target.closest('li[data-song-id]');
    if (li) {
      li.removeAttribute('dragging');
    }
    this._draggedItem = null;
  }

  async handleDrop(e) {
    e.preventDefault();

    const ul = this.querySelector('ul');
    const items = [...ul.querySelectorAll('li[data-song-id]')];

    // Update order in storage
    for (let i = 0; i < items.length; i++) {
      const songId = parseInt(items[i].dataset.songId, 10);
      await storage.reorderSong(songId, i);
    }

    // Update wait times without full re-render
    const songs = await storage.getAllSongs();
    const sortedSongs = songs.sort((a, b) => a.order - b.order);
    let cumulativeTime = 0;

    items.forEach((item, index) => {
      const song = sortedSongs[index];
      if (song) {
        const waitTimeSpan = item.querySelector('span[wait-time]');
        cumulativeTime += song.estimatedDuration || 3;

        if (waitTimeSpan) {
          waitTimeSpan.textContent = `~${cumulativeTime} min`;
          item.dataset.wait = cumulativeTime;
        }

        // Update next indicator
        item.removeAttribute('next');
        if (index === 0) {
          item.setAttribute('next', '');
        }
      }
    });

    // Update count
    const countEl = this.querySelector('span[count]');
    if (countEl) {
      countEl.textContent = songs.length;
    }
  }
}
