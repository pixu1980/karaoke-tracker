// Import services
import { i18n, storage, themeService } from './services/index.js';

// Import components - they register themselves via static initialization blocks
import './components/index.js';

// Sample data for testing
const sampleSingers = [
  {
    name: 'Marco Rossi',
    songTitle: 'Nel blu dipinto di blu',
    songAuthor: 'Domenico Modugno',
    songKey: '0',
    youtubeUrl: 'https://www.youtube.com/watch?v=DB2zv4QT6XY'
  },
  {
    name: 'Laura Bianchi',
    songTitle: 'Shallow',
    songAuthor: 'Lady Gaga & Bradley Cooper',
    songKey: '-2',
    youtubeUrl: 'https://www.youtube.com/watch?v=bo_efYhYU2A'
  },
  {
    name: 'Giuseppe Verdi',
    songTitle: 'Bohemian Rhapsody',
    songAuthor: 'Queen',
    songKey: '+1',
    youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ'
  },
  { name: 'Francesca Neri', songTitle: 'Rolling in the Deep', songAuthor: 'Adele', songKey: '-1', youtubeUrl: '' },
  {
    name: 'Antonio Bruno',
    songTitle: "Sweet Child O'Mine",
    songAuthor: "Guns N' Roses",
    songKey: '0',
    youtubeUrl: 'https://www.youtube.com/watch?v=1w7OgIMMRc4'
  },
  {
    name: 'Sara Conti',
    songTitle: 'I Will Always Love You',
    songAuthor: 'Whitney Houston',
    songKey: '-3',
    youtubeUrl: ''
  },
  {
    name: 'Luca Ferrari',
    songTitle: "Livin' on a Prayer",
    songAuthor: 'Bon Jovi',
    songKey: '+2',
    youtubeUrl: 'https://www.youtube.com/watch?v=lDK9QqIzhwk'
  },
  { name: 'Chiara Moretti', songTitle: 'Someone Like You', songAuthor: 'Adele', songKey: '0', youtubeUrl: '' }
];

/**
 * Helper function to show confirmation dialog
 * @param {string} dialogId - ID of the dialog element
 * @returns {Promise<boolean>} - Whether the user confirmed
 */
const showConfirmDialog = dialogId => {
  return new Promise(resolve => {
    const dialog = document.getElementById(dialogId);
    if (!dialog) {
      resolve(false);
      return;
    }

    const handleClick = event => {
      const action = event.target.dataset.action;
      if (action === 'confirm') {
        dialog.close();
        resolve(true);
      } else if (action === 'cancel') {
        dialog.close();
        resolve(false);
      }
    };

    const handleClose = () => {
      dialog.removeEventListener('click', handleClick);
      dialog.removeEventListener('close', handleClose);
      resolve(false);
    };

    dialog.addEventListener('click', handleClick);
    dialog.addEventListener('close', handleClose);
    dialog.showModal();
  });
};

/**
 * Initialize the application
 */
async function initApp() {
  try {
    // Initialize theme
    themeService.init();

    // Initialize language
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
      langSelect.value = i18n.currentLang;
      langSelect.addEventListener('change', e => {
        i18n.setLanguage(e.target.value);
      });
    }
    i18n.updatePage();

    // Theme switcher buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        themeService.setTheme(btn.dataset.theme);
      });
    });

    await storage.init();
    console.log('Karaoke Tracker initialized successfully!');

    // Notify that storage is ready
    window.dispatchEvent(new CustomEvent('storage-ready'));

    // Reset list (clear all) button handler
    const clearAllBtn = document.getElementById('clearAllBtn');
    clearAllBtn.addEventListener('click', async () => {
      const confirmed = await showConfirmDialog('resetListDialog');
      if (confirmed) {
        try {
          await storage.clearAllSingers();
          await storage.clearAllPerformances();
          window.dispatchEvent(new CustomEvent('singer-deleted'));
          window.dispatchEvent(new CustomEvent('leaderboard-reset'));
        } catch (error) {
          console.error('Error clearing singers:', error);
          alert('Failed to clear singers. Please try again.');
        }
      }
    });

    // Example list button handler (populate with sample data)
    const resetListBtn = document.getElementById('resetListBtn');
    if (resetListBtn) {
      resetListBtn.addEventListener('click', async () => {
        const confirmed = await showConfirmDialog('exampleListDialog');
        if (confirmed) {
          try {
            await storage.clearAllSingers();
            await storage.clearAllPerformances();
            for (const singer of sampleSingers) {
              await storage.addSinger(singer);
            }
            window.dispatchEvent(new CustomEvent('singer-added'));
            window.dispatchEvent(new CustomEvent('leaderboard-reset'));
          } catch (error) {
            console.error('Error loading example list:', error);
            alert('Failed to load example list. Please try again.');
          }
        }
      });
    }

    // Remove singer dialog handler
    const removeDialog = document.getElementById('removeSingerDialog');
    if (removeDialog) {
      removeDialog.addEventListener('click', async event => {
        const action = event.target.dataset.action;
        if (action === 'confirm') {
          const singerId = Number(removeDialog.dataset.singerId);
          try {
            await storage.deleteSinger(singerId);
            window.dispatchEvent(new CustomEvent('singer-deleted'));
          } catch (error) {
            console.error('Error removing singer:', error);
            alert('Failed to remove singer. Please try again.');
          }
          removeDialog.close();
        } else if (action === 'cancel') {
          removeDialog.close();
        }
      });
    }

    // Done singer dialog handler
    const doneDialog = document.getElementById('doneSingerDialog');
    if (doneDialog) {
      doneDialog.addEventListener('click', async event => {
        const action = event.target.dataset.action;
        if (action === 'confirm') {
          const singerId = Number(doneDialog.dataset.singerId);
          const singerName = doneDialog.dataset.singerName;
          const songTitle = doneDialog.dataset.songTitle || '';
          const autoReaddCheckbox = document.getElementById('autoReaddCheckbox');
          const starRating = doneDialog.querySelector('star-rating');
          const rating = starRating ? starRating.value : 0;

          try {
            // Save performance with rating for leaderboard
            if (rating > 0) {
              await storage.addPerformance({
                singerName: singerName,
                songTitle: songTitle,
                rating: rating
              });
              window.dispatchEvent(new CustomEvent('performance-added'));
            }

            await storage.deleteSinger(singerId);

            // Auto re-add if checkbox is checked
            if (autoReaddCheckbox?.checked) {
              await storage.addSinger({
                name: singerName,
                songTitle: '(next song)',
                songAuthor: '',
                songKey: '0',
                youtubeUrl: ''
              });
              window.dispatchEvent(new CustomEvent('singer-added'));
            } else {
              window.dispatchEvent(new CustomEvent('singer-deleted'));
            }
          } catch (error) {
            console.error('Error completing singer:', error);
            alert('Failed to complete singer. Please try again.');
          }
          doneDialog.close();
        } else if (action === 'cancel') {
          doneDialog.close();
        }
      });
    }

    // Edit singer dialog handler
    const editDialog = document.getElementById('editSingerDialog');
    if (editDialog) {
      const editForm = editDialog.querySelector('form');

      editDialog.addEventListener('click', event => {
        if (event.target.dataset.action === 'cancel') {
          editDialog.close();
        }
      });

      editForm.addEventListener('submit', async event => {
        event.preventDefault();
        const formData = new FormData(editForm);
        const singerId = Number(formData.get('editId'));

        const updatedData = {
          name: formData.get('editName'),
          songTitle: formData.get('editSongTitle'),
          songAuthor: formData.get('editSongAuthor'),
          songKey: formData.get('editSongKey'),
          youtubeUrl: formData.get('editYoutubeUrl')
        };

        try {
          await storage.updateSinger(singerId, updatedData);
          window.dispatchEvent(new CustomEvent('singer-updated'));
          editDialog.close();
        } catch (error) {
          console.error('Error updating singer:', error);
          alert('Failed to update singer. Please try again.');
        }
      });
    }

    // Listen for singer-updated event
    window.addEventListener('singer-updated', () => {
      const singerList = document.querySelector('singer-list');
      if (singerList) {
        singerList.loadSingers();
      }
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
    alert('Failed to initialize the application. Please refresh the page.');
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
