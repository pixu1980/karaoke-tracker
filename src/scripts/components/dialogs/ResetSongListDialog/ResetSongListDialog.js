import styles from 'bundle-text:./ResetSongListDialog.css';
import { ConfirmDialog } from '../../ui/ConfirmDialog/ConfirmDialog.js';
import { i18n, registerStylesheet, storage } from '../../../services/index.js';

/**
 * Reset Song List Dialog Custom Element - extends ConfirmDialog
 * Dialog for clearing all singers and performances
 * Usage: <dialog is="reset-song-list-dialog">...</dialog>
 */
class ResetSongListDialog extends ConfirmDialog {
  static {
    // Inject component-specific styles using adoptedStyleSheets
    registerStylesheet(styles);

    // Register the custom element
    customElements.define('reset-song-list-dialog', ResetSongListDialog, { extends: 'dialog' });
  }

  connectedCallback() {
    // Set attributes before calling super to configure the confirm dialog
    this.setAttribute('title-key', 'resetListTitle');
    this.setAttribute('message-key', 'resetListMsg');
    this.setAttribute('confirm-key', 'resetListConfirm');
    this.setAttribute('cancel-key', 'cancel');
    this.setAttribute('confirm-variant', 'btn-danger');
    this.classList.add('dialog', 'reset-song-list-dialog');
    
    super.connectedCallback();
  }

  async handleConfirm() {
    try {
      await storage.clearAllSongs();
      await storage.clearAllPerformances();

      window.dispatchEvent(new CustomEvent('song-deleted'));
      window.dispatchEvent(new CustomEvent('leaderboard-reset'));
      this.close();
    } catch (error) {
      console.error('Error clearing songs:', error);
      alert('Failed to clear songs. Please try again.');
    }
  }
}

export { ResetSongListDialog };
export default ResetSongListDialog;
