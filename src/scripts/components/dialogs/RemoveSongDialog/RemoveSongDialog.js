import styles from 'bundle-text:./RemoveSongDialog.css';
import { ConfirmDialog } from '../../ui/ConfirmDialog/ConfirmDialog.js';
import { i18n, registerStylesheet, storage } from '../../../services/index.js';

/**
 * Remove Song Dialog Custom Element - extends ConfirmDialog
 * Dialog for confirming singer removal from the list
 * Usage: <dialog is="remove-song-dialog">...</dialog>
 */
class RemoveSongDialog extends ConfirmDialog {
  static {
    // Inject component-specific styles using adoptedStyleSheets
    registerStylesheet(styles);

    // Register the custom element
    customElements.define('remove-song-dialog', RemoveSongDialog, { extends: 'dialog' });
  }

  constructor() {
    super();
    this._songId = null;
    this._singerName = '';
  }

  connectedCallback() {
    // Set attributes before calling super to configure the confirm dialog
    this.setAttribute('title-key', 'removeSingerTitle');
    this.setAttribute('message-key', 'removeSingerMsg');
    this.setAttribute('message-after-key', '');
    this.setAttribute('confirm-key', 'removeSingerConfirm');
    this.setAttribute('cancel-key', 'cancel');
    this.setAttribute('confirm-variant', 'btn-danger');
    this.setAttribute('show-dynamic-name', '');
    this.classList.add('dialog', 'remove-song-dialog');
    
    super.connectedCallback();
  }

  /**
   * Open the dialog with singer information
   * @param {number} singerId - The ID of the singer to remove
   * @param {string} singerName - The name of the singer to display
   */
  showModal(singerId, singerName) {
    this._songId = singerId;
    this._singerName = singerName;
    
    // Update the dynamic name element
    const nameEl = this.querySelector('.dialog-singer-name');
    if (nameEl) {
      nameEl.textContent = singerName;
    }
    
    super.showModal();
  }

  async handleConfirm() {
    if (this._songId === null) {
      this.close();
      return;
    }

    try {
      await storage.deleteSong(this._songId);
      window.dispatchEvent(new CustomEvent('song-deleted'));
      this.close();
    } catch (error) {
      console.error('Error removing song:', error);
      alert('Failed to remove song. Please try again.');
    }
  }
}

export { RemoveSongDialog };
export default RemoveSongDialog;
