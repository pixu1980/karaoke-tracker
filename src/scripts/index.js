// Import services
import './polyfills/index.js';
import { storage } from './services/index.js';

// Import components - they register themselves via static initialization blocks
import './components/index.js';

/**
 * Initialize the application
 */
async function initApp() {
  try {
    await storage.init();
    console.log('Karaoke Tracker initialized successfully!');

    // Notify that storage is ready
    window.dispatchEvent(new CustomEvent('storage-ready'));

    // Reset list (clear all) button handler
    const clearAllBtn = document.getElementById('clearAllBtn');
    clearAllBtn.addEventListener('click', () => {
      const dialog = document.getElementById('resetListDialog');
      dialog.showModal();
    });

    // Example list button handler (populate with sample data)
    const resetListBtn = document.getElementById('resetListBtn');
    if (resetListBtn) {
      resetListBtn.addEventListener('click', () => {
        const dialog = document.getElementById('exampleListDialog');
        dialog.showModal();
      });
    }

    // Listen for singer-updated event
    window.addEventListener('singer-updated', () => {
      const songList = document.querySelector('song-list');
      if (songList) {
        songList.loadSongs();
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
