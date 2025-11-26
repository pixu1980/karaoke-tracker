import styles from 'bundle-text:./ExampleListDialog.css';
import { ConfirmDialog } from '../../ui/ConfirmDialog/ConfirmDialog.js';
import { i18n, registerStylesheet, storage } from '../../../services/index.js';
import { sampleSongs } from '../../../data/sampleData.js';

/**
 * Example List Dialog Custom Element - extends ConfirmDialog
 * Dialog for loading sample data into the song list
 * Usage: <dialog is="example-list-dialog">...</dialog>
 */
class ExampleListDialog extends ConfirmDialog {
  static {
    // Inject component-specific styles using adoptedStyleSheets
    registerStylesheet(styles);

    // Register the custom element
    customElements.define('example-list-dialog', ExampleListDialog, { extends: 'dialog' });
  }

  connectedCallback() {
    // Set attributes before calling super to configure the confirm dialog
    this.setAttribute('title-key', 'loadExampleTitle');
    this.setAttribute('message-key', 'loadExampleMsg');
    this.setAttribute('confirm-key', 'loadExampleConfirm');
    this.setAttribute('cancel-key', 'cancel');
    this.setAttribute('confirm-variant', 'btn-danger');
    this.classList.add('dialog', 'example-list-dialog');
    
    super.connectedCallback();
  }

  async handleConfirm() {
    try {
      await storage.clearAllSongs();
      await storage.clearAllPerformances();

      for (const song of sampleSongs) {
        await storage.addSong(song);
      }

      window.dispatchEvent(new CustomEvent('song-added'));
      window.dispatchEvent(new CustomEvent('leaderboard-reset'));
      this.close();
    } catch (error) {
      console.error('Error loading example list:', error);
      alert('Failed to load example list. Please try again.');
    }
  }
}

export { ExampleListDialog };
export default ExampleListDialog;
