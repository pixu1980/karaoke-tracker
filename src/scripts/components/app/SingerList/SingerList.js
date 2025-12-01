/**
 * SingerList Component
 * Displays the list of singers with add functionality
 */
import { registerStylesheet, i18n, storage, pixEngine } from '../../../services/index.js';
import styles from 'bundle-text:./SingerList.css';
import template from 'bundle-text:./SingerList.template.html';

export class SingerList extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('kt-singer-list', this);
  }

  constructor() {
    super();
    this._singers = [];
    this._songCounts = new Map();
    this._filterText = '';
    this._handleAppReady = () => this.loadData();
    this._handleSingersUpdated = () => this.loadData();
    this._handlePerformancesUpdated = () => this.loadSongCounts();
    this._handleLanguageChanged = () => this.render();
    this._handleClick = this.handleClick.bind(this);
    this._handleFilter = this.handleFilter.bind(this);
    this._handleSingerEdit = event => {
      this.dispatchEvent(
        new CustomEvent('singer:edit-request', {
          bubbles: true,
          detail: event.detail
        })
      );
    };
    this._handleSingerDelete = event => {
      this.dispatchEvent(
        new CustomEvent('singer:delete-request', {
          bubbles: true,
          detail: event.detail
        })
      );
    };
  }

  async connectedCallback() {
    this.render();
    this.addEventListener('click', this._handleClick);
    this.addEventListener('input', this._handleFilter);
    this.addEventListener('singer:edit', this._handleSingerEdit);
    this.addEventListener('singer:delete', this._handleSingerDelete);

    document.addEventListener('app:ready', this._handleAppReady);
    document.addEventListener('singers:updated', this._handleSingersUpdated);
    document.addEventListener('performances:updated', this._handlePerformancesUpdated);
    window.addEventListener('language-changed', this._handleLanguageChanged);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('input', this._handleFilter);
    this.removeEventListener('singer:edit', this._handleSingerEdit);
    this.removeEventListener('singer:delete', this._handleSingerDelete);

    document.removeEventListener('app:ready', this._handleAppReady);
    document.removeEventListener('singers:updated', this._handleSingersUpdated);
    document.removeEventListener('performances:updated', this._handlePerformancesUpdated);
    window.removeEventListener('language-changed', this._handleLanguageChanged);
  }

  handleFilter(event) {
    const input = event.target.closest('input[data-filter]');
    if (!input) return;

    this._filterText = input.value.toLowerCase().trim();
    this.updateList();
  }

  async loadData() {
    try {
      this._singers = await storage.getAllSingers();
      await this.loadSongCounts();
      this.render();
    } catch (error) {
      console.error('Failed to load singers:', error);
    }
  }

  async loadSongCounts() {
    try {
      this._songCounts = await storage.getSongCountsBySinger();
      this.render();
    } catch (error) {
      console.error('Failed to load song counts:', error);
    }
  }

  render() {
    const singers = this._singers.map(singer => ({
      id: singer.id,
      name: singer.name,
      songCount: this._songCounts.get(singer.id) || 0
    }));

    this.innerHTML = pixEngine(template, {
      title: i18n.t('singerList.title'),
      addLabel: i18n.t('singerList.add'),
      clearLabel: i18n.t('singerList.clear'),
      filterPlaceholder: i18n.t('filter.singers'),
      emptyText: i18n.t('singerList.empty'),
      singers,
      hasSingers: singers.length > 0,
      count: singers.length
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
      const card = li.querySelector('kt-singer-card');
      const name = card?.getAttribute('singer-name')?.toLowerCase() || '';
      li.hidden = this._filterText && !name.includes(this._filterText);
    });
  }

  handleClick(event) {
    const addBtn = event.target.closest('button[primary]');
    const clearBtn = event.target.closest('button[danger]');

    if (addBtn) {
      this.dispatchEvent(
        new CustomEvent('singer:add-request', {
          bubbles: true
        })
      );
    }

    if (clearBtn) {
      this.dispatchEvent(
        new CustomEvent('singers:clear-request', {
          bubbles: true
        })
      );
    }
  }
}

export default SingerList;
