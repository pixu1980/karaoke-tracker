/**
 * Storage Service
 * Manages IndexedDB operations for songs and performances
 */
class StorageService {
  constructor() {
    this.dbName = 'KaraokeTrackerDB';
    this.storeName = 'karaoke-tracker';
    this.performancesStoreName = 'performances';
    this.version = 3;
    this.db = null;
  }

  /**
   * Initialize IndexedDB connection
   * @returns {Promise<void>}
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = event => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        if (!db.objectStoreNames.contains(this.performancesStoreName)) {
          const perfStore = db.createObjectStore(this.performancesStoreName, { keyPath: 'id', autoIncrement: true });
          perfStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  /**
   * Get all singers from the database
   * @returns {Promise<Array>}
   */
  async getAllSongs() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add a song to the database
   * @param {Object} song - Song data
   * @returns {Promise<number>} - ID of the added song
   */
  async addSong(song) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.add({
        ...song,
        timestamp: Date.now()
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a song from the database
   * @param {number} id - Song ID
   * @returns {Promise<void>}
   */
  async deleteSong(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all songs from the database
   * @returns {Promise<void>}
   */
  async clearAllSongs() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update a song in the database
   * @param {number} id - Song ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} - Updated song
   */
  async updateSong(id, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const getRequest = objectStore.get(id);

      getRequest.onsuccess = () => {
        const existingSong = getRequest.result;
        if (!existingSong) {
          reject(new Error('Song not found'));
          return;
        }
        const updatedSong = { ...existingSong, ...data };
        const putRequest = objectStore.put(updatedSong);
        putRequest.onsuccess = () => resolve(updatedSong);
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Add a performance to the database
   * @param {Object} performance - Performance data
   * @returns {Promise<number>} - ID of the added performance
   */
  async addPerformance(performance) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.performancesStoreName], 'readwrite');
      const objectStore = transaction.objectStore(this.performancesStoreName);
      const request = objectStore.add({
        ...performance,
        timestamp: Date.now()
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all performances from the database
   * @returns {Promise<Array>}
   */
  async getAllPerformances() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.performancesStoreName], 'readonly');
      const objectStore = transaction.objectStore(this.performancesStoreName);
      const request = objectStore.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all performances from the database
   * @returns {Promise<void>}
   */
  async clearAllPerformances() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.performancesStoreName], 'readwrite');
      const objectStore = transaction.objectStore(this.performancesStoreName);
      const request = objectStore.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Export singleton instance
export const storage = new StorageService();
export default storage;
