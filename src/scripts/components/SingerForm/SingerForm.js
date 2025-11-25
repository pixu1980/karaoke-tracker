import styles from 'bundle-text:./SingerForm.css';
import template from 'bundle-text:./SingerForm.template.html';
import { i18n, pixEngine, storage } from '../../services/index.js';

/**
 * Singer Form Custom Element
 * Form for adding new singers to the queue
 */
export class SingerForm extends HTMLElement {
  static {
    // Inject component styles into document head
    const styleSheet = document.createElement('style');
    styleSheet.setAttribute('data-component', 'singer-form');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    customElements.define('singer-form', SingerForm);
  }

  connectedCallback() {
    this.render();
    this.form = this.querySelector('.singer-form');
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    // Listen for language changes
    window.addEventListener('language-changed', () => this.render());
  }

  render() {
    this.innerHTML = pixEngine(template, {
      singerNameLabel: i18n.t('singerName'),
      requiredLabel: i18n.t('required'),
      songTitleLabel: i18n.t('songTitle'),
      songAuthorLabel: i18n.t('songAuthor'),
      keyAdjustmentLabel: i18n.t('keyAdjustment'),
      originalLabel: i18n.t('original'),
      youtubeLinkLabel: i18n.t('youtubeLink'),
      addToQueueLabel: i18n.t('addToQueue')
    });

    this.form = this.querySelector('.singer-form');
    if (this.form) {
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this.form);
    const singer = {
      name: formData.get('name'),
      songTitle: formData.get('songTitle'),
      songAuthor: formData.get('songAuthor'),
      songKey: formData.get('songKey') || '',
      youtubeUrl: formData.get('youtubeUrl') || ''
    };

    try {
      await storage.addSinger(singer);
      this.form.reset();

      // Dispatch custom event to refresh the list
      window.dispatchEvent(new CustomEvent('singer-added'));
    } catch (error) {
      console.error('Error adding singer:', error);
      alert('Failed to add singer. Please try again.');
    }
  }
}

export default SingerForm;
