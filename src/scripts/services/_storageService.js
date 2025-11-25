/**
 * Storage Service
 * Manages IndexedDB operations for singers and performances
 */
class StorageService {
  constructor() {
    this.dbName = 'KaraokeTrackerDB';
    this.storeName = 'singers';
    this.performancesStoreName = 'performances';
    this.version = 2;
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
          perfStore.createIndex('singerName', 'singerName', { unique: false });
          perfStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  /**
   * Get all singers from the database
   * @returns {Promise<Array>}
   */
  async getAllSingers() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add a singer to the database
   * @param {Object} singer - Singer data
   * @returns {Promise<number>} - ID of the added singer
   */
  async addSinger(singer) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.add({
        ...singer,
        timestamp: Date.now()
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a singer from the database
   * @param {number} id - Singer ID
   * @returns {Promise<void>}
   */
  async deleteSinger(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all singers from the database
   * @returns {Promise<void>}
   */
  async clearAllSingers() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update a singer in the database
   * @param {number} id - Singer ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} - Updated singer
   */
  async updateSinger(id, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const getRequest = objectStore.get(id);

      getRequest.onsuccess = () => {
        const existingSinger = getRequest.result;
        if (!existingSinger) {
          reject(new Error('Singer not found'));
          return;
        }
        const updatedSinger = { ...existingSinger, ...data };
        const putRequest = objectStore.put(updatedSinger);
        putRequest.onsuccess = () => resolve(updatedSinger);
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
