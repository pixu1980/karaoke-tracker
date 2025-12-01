/**
 * Storage Service
 * Manages IndexedDB operations for singers, songs, and performances
 *
 * Data Model:
 * - singers: List of karaoke participants
 * - songs: Queue of songs to be performed (with multi-singer support)
 * - performances: Archived performances with ratings
 */
class StorageService {
  constructor() {
    this.dbName = 'KaraokeTrackerDB';
    this.version = 5; // Incremented to force index migration
    this.db = null;

    // Store names
    this.stores = {
      singers: 'singers',
      songs: 'songs',
      performances: 'performances'
    };
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
        const transaction = event.target.transaction;

        // Singers store
        let singersStore;
        if (!db.objectStoreNames.contains(this.stores.singers)) {
          singersStore = db.createObjectStore(this.stores.singers, {
            keyPath: 'id',
            autoIncrement: true
          });
        } else {
          singersStore = transaction.objectStore(this.stores.singers);
        }
        // Ensure indexes exist
        if (!singersStore.indexNames.contains('name')) {
          singersStore.createIndex('name', 'name', { unique: true });
        }
        if (!singersStore.indexNames.contains('sortOrder')) {
          singersStore.createIndex('sortOrder', 'sortOrder', { unique: false });
        }

        // Songs store
        let songsStore;
        if (!db.objectStoreNames.contains(this.stores.songs)) {
          songsStore = db.createObjectStore(this.stores.songs, {
            keyPath: 'id',
            autoIncrement: true
          });
        } else {
          songsStore = transaction.objectStore(this.stores.songs);
        }
        // Ensure indexes exist
        if (!songsStore.indexNames.contains('status')) {
          songsStore.createIndex('status', 'status', { unique: false });
        }
        if (!songsStore.indexNames.contains('createdAt')) {
          songsStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Performances store
        let perfStore;
        if (!db.objectStoreNames.contains(this.stores.performances)) {
          perfStore = db.createObjectStore(this.stores.performances, {
            keyPath: 'id',
            autoIncrement: true
          });
        } else {
          perfStore = transaction.objectStore(this.stores.performances);
        }
        // Ensure indexes exist
        if (!perfStore.indexNames.contains('singerId')) {
          perfStore.createIndex('singerId', 'singerId', { unique: false });
        }
        if (!perfStore.indexNames.contains('performedAt')) {
          perfStore.createIndex('performedAt', 'performedAt', { unique: false });
        }
      };
    });
  }

  // ==========================================
  // SINGERS CRUD
  // ==========================================

  /**
   * Get all singers sorted by sortOrder
   * @returns {Promise<Array>}
   */
  async getAllSingers() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.singers], 'readonly');
      const store = transaction.objectStore(this.stores.singers);
      const request = store.getAll();

      request.onsuccess = () => {
        const singers = request.result.sort((a, b) => a.sortOrder - b.sortOrder);
        resolve(singers);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get a single singer by ID
   * @param {number} id - Singer ID
   * @returns {Promise<Object|null>}
   */
  async getSinger(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.singers], 'readonly');
      const store = transaction.objectStore(this.stores.singers);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add a new singer
   * @param {Object} singer - Singer data { name: string }
   * @returns {Promise<number>} - ID of the added singer
   */
  async addSinger(singer) {
    const singers = await this.getAllSingers();
    const maxOrder = singers.length > 0 ? Math.max(...singers.map(s => s.sortOrder || 0)) : 0;

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.singers], 'readwrite');
      const store = transaction.objectStore(this.stores.singers);
      const request = store.add({
        name: singer.name.trim(),
        sortOrder: maxOrder + 1,
        createdAt: Date.now()
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update a singer
   * @param {number} id - Singer ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>}
   */
  async updateSinger(id, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.singers], 'readwrite');
      const store = transaction.objectStore(this.stores.singers);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const singer = getRequest.result;
        if (!singer) {
          reject(new Error('Singer not found'));
          return;
        }

        const updated = { ...singer, ...data };
        const putRequest = store.put(updated);
        putRequest.onsuccess = () => resolve(updated);
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Delete a singer
   * @param {number} id - Singer ID
   * @returns {Promise<void>}
   */
  async deleteSinger(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.singers], 'readwrite');
      const store = transaction.objectStore(this.stores.singers);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Move singers to the bottom (for rotation)
   * @param {number[]} singerIds - IDs of singers to move
   * @returns {Promise<void>}
   */
  async rotateSingersToBottom(singerIds) {
    const singers = await this.getAllSingers();
    const maxOrder = Math.max(...singers.map(s => s.sortOrder || 0));

    let newOrder = maxOrder;
    for (const id of singerIds) {
      newOrder += 1;
      await this.updateSinger(id, { sortOrder: newOrder });
    }
  }

  /**
   * Clear all singers
   * @returns {Promise<void>}
   */
  async clearAllSingers() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.singers], 'readwrite');
      const store = transaction.objectStore(this.stores.singers);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ==========================================
  // SONGS CRUD
  // ==========================================

  /**
   * Get all queued songs (not archived)
   * @returns {Promise<Array>}
   */
  async getQueuedSongs() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.songs], 'readonly');
      const store = transaction.objectStore(this.stores.songs);
      const index = store.index('status');
      const request = index.getAll('queued');

      request.onsuccess = () => {
        const songs = request.result.sort((a, b) => a.createdAt - b.createdAt);
        resolve(songs);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get a single song by ID
   * @param {number} id - Song ID
   * @returns {Promise<Object|null>}
   */
  async getSong(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.songs], 'readonly');
      const store = transaction.objectStore(this.stores.songs);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add a new song to the queue
   * @param {Object} song - Song data
   * @returns {Promise<number>} - ID of the added song
   */
  async addSong(song) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.songs], 'readwrite');
      const store = transaction.objectStore(this.stores.songs);
      const request = store.add({
        title: song.title.trim(),
        author: song.author?.trim() || '',
        singerIds: song.singerIds, // Array of singer IDs
        key: song.key || null,
        youtubeUrl: song.youtubeUrl?.trim() || '',
        status: 'queued',
        createdAt: Date.now(),
        completedAt: null
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update a song
   * @param {number} id - Song ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>}
   */
  async updateSong(id, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.songs], 'readwrite');
      const store = transaction.objectStore(this.stores.songs);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const song = getRequest.result;
        if (!song) {
          reject(new Error('Song not found'));
          return;
        }

        const updated = { ...song, ...data };
        const putRequest = store.put(updated);
        putRequest.onsuccess = () => resolve(updated);
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Archive a song (mark as completed)
   * @param {number} id - Song ID
   * @returns {Promise<Object>}
   */
  async archiveSong(id) {
    return this.updateSong(id, {
      status: 'archived',
      completedAt: Date.now()
    });
  }

  /**
   * Delete a song
   * @param {number} id - Song ID
   * @returns {Promise<void>}
   */
  async deleteSong(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.songs], 'readwrite');
      const store = transaction.objectStore(this.stores.songs);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all songs
   * @returns {Promise<void>}
   */
  async clearAllSongs() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.songs], 'readwrite');
      const store = transaction.objectStore(this.stores.songs);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ==========================================
  // PERFORMANCES CRUD
  // ==========================================

  /**
   * Get all performances
   * @returns {Promise<Array>}
   */
  async getAllPerformances() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.performances], 'readonly');
      const store = transaction.objectStore(this.stores.performances);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get performances by singer ID
   * @param {number} singerId - Singer ID
   * @returns {Promise<Array>}
   */
  async getPerformancesBySinger(singerId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.performances], 'readonly');
      const store = transaction.objectStore(this.stores.performances);
      const index = store.index('singerId');
      const request = index.getAll(singerId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add a performance record
   * Creates one record per singer (for duets, creates multiple records)
   * @param {Object} performance - Performance data
   * @returns {Promise<number>} - ID of the added performance
   */
  async addPerformance(performance) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.performances], 'readwrite');
      const store = transaction.objectStore(this.stores.performances);
      const request = store.add({
        songId: performance.songId,
        singerId: performance.singerId,
        songTitle: performance.songTitle,
        singerName: performance.singerName,
        rating: performance.rating || null,
        performedAt: Date.now()
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add multiple performances (for duets/groups)
   * @param {Array} performances - Array of performance data
   * @returns {Promise<number[]>} - IDs of added performances
   */
  async addPerformances(performances) {
    const ids = [];
    for (const perf of performances) {
      const id = await this.addPerformance(perf);
      ids.push(id);
    }
    return ids;
  }

  /**
   * Get leaderboard data (singers ranked by average rating)
   * @returns {Promise<Array>}
   */
  async getLeaderboard() {
    const performances = await this.getAllPerformances();
    const singers = await this.getAllSingers();

    // Group performances by singer
    const singerStats = new Map();

    for (const perf of performances) {
      if (perf.rating === null) continue;

      if (!singerStats.has(perf.singerId)) {
        const singer = singers.find(s => s.id === perf.singerId);
        singerStats.set(perf.singerId, {
          singerId: perf.singerId,
          singerName: singer?.name || perf.singerName,
          totalRating: 0,
          songCount: 0
        });
      }

      const stats = singerStats.get(perf.singerId);
      stats.totalRating += perf.rating;
      stats.songCount += 1;
    }

    // Calculate averages and sort
    const leaderboard = Array.from(singerStats.values())
      .map(stats => ({
        ...stats,
        averageRating: stats.songCount > 0 ? Math.round((stats.totalRating / stats.songCount) * 10) / 10 : 0
      }))
      .sort((a, b) => b.averageRating - a.averageRating);

    return leaderboard;
  }

  /**
   * Get song count for each singer (including unrated performances)
   * @returns {Promise<Map>}
   */
  async getSongCountsBySinger() {
    const performances = await this.getAllPerformances();
    const counts = new Map();

    for (const perf of performances) {
      const current = counts.get(perf.singerId) || 0;
      counts.set(perf.singerId, current + 1);
    }

    return counts;
  }

  /**
   * Clear all performances
   * @returns {Promise<void>}
   */
  async clearAllPerformances() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.performances], 'readwrite');
      const store = transaction.objectStore(this.stores.performances);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all archived (completed) songs
   * @returns {Promise<Array>}
   */
  async getArchivedSongs() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.songs], 'readonly');
      const store = transaction.objectStore(this.stores.songs);
      const index = store.index('status');
      const request = index.getAll('archived');

      request.onsuccess = () => {
        const songs = request.result.sort((a, b) => b.completedAt - a.completedAt);
        resolve(songs);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Check if a song (by title+author) was already performed
   * @param {string} title - Song title
   * @param {string} author - Song author
   * @returns {Promise<{performed: boolean, song: Object|null}>}
   */
  async checkSongPerformed(title, author) {
    const archived = await this.getArchivedSongs();
    const normalizedTitle = title.toLowerCase().trim();
    const normalizedAuthor = (author || '').toLowerCase().trim();

    const found = archived.find(song => {
      const songTitle = song.title.toLowerCase().trim();
      const songAuthor = (song.author || '').toLowerCase().trim();
      return songTitle === normalizedTitle && songAuthor === normalizedAuthor;
    });

    return {
      performed: !!found,
      song: found || null
    };
  }

  /**
   * Get session statistics
   * @returns {Promise<Object>}
   */
  async getSessionStats() {
    const [singers, queuedSongs, archivedSongs, performances] = await Promise.all([
      this.getAllSingers(),
      this.getQueuedSongs(),
      this.getArchivedSongs(),
      this.getAllPerformances()
    ]);

    // Calculate singer stats
    const singerStats = new Map();
    for (const perf of performances) {
      if (!singerStats.has(perf.singerId)) {
        singerStats.set(perf.singerId, {
          singerId: perf.singerId,
          singerName: perf.singerName,
          songCount: 0,
          totalRating: 0,
          ratedCount: 0
        });
      }
      const stats = singerStats.get(perf.singerId);
      stats.songCount++;
      if (perf.rating !== null) {
        stats.totalRating += perf.rating;
        stats.ratedCount++;
      }
    }

    // Find most active singer
    let mostActiveSinger = null;
    let maxSongs = 0;
    for (const stats of singerStats.values()) {
      if (stats.songCount > maxSongs) {
        maxSongs = stats.songCount;
        mostActiveSinger = stats;
      }
    }

    // Calculate average rating
    const ratedPerformances = performances.filter(p => p.rating !== null);
    const totalRating = ratedPerformances.reduce((sum, p) => sum + p.rating, 0);
    const averageRating =
      ratedPerformances.length > 0 ? Math.round((totalRating / ratedPerformances.length) * 10) / 10 : 0;

    // Estimate remaining time (4 min per song)
    const estimatedMinutesRemaining = queuedSongs.length * 4;

    // Build top singers list sorted by average rating
    const topSingers = Array.from(singerStats.values())
      .map(stats => ({
        singerId: stats.singerId,
        name: stats.singerName,
        songCount: stats.songCount,
        averageRating:
          stats.ratedCount > 0 ? Math.round((stats.totalRating / stats.ratedCount) * 10) / 10 : null
      }))
      .filter(s => s.averageRating !== null)
      .sort((a, b) => b.averageRating - a.averageRating);

    return {
      totalSingers: singers.length,
      totalSongsPerformed: archivedSongs.length,
      songsInQueue: queuedSongs.length,
      totalPerformances: performances.length,
      averageRating,
      topSingers,
      mostActiveSinger: mostActiveSinger
        ? {
            name: mostActiveSinger.singerName,
            songCount: mostActiveSinger.songCount,
            averageRating:
              mostActiveSinger.ratedCount > 0
                ? Math.round((mostActiveSinger.totalRating / mostActiveSinger.ratedCount) * 10) / 10
                : null
          }
        : null,
      estimatedMinutesRemaining,
      singerStats: Array.from(singerStats.values())
    };
  }

  /**
   * Get detailed stats for a specific singer
   * @param {number} singerId - Singer ID
   * @returns {Promise<Object>}
   */
  async getSingerStats(singerId) {
    const [singer, performances, archivedSongs] = await Promise.all([
      this.getSinger(singerId),
      this.getPerformancesBySinger(singerId),
      this.getArchivedSongs()
    ]);

    if (!singer) return null;

    // Get song details for this singer's performances
    const songHistory = performances
      .map(perf => {
        const song = archivedSongs.find(s => s.id === perf.songId);
        return {
          title: perf.songTitle,
          author: song?.author || '',
          rating: perf.rating,
          performedAt: perf.performedAt
        };
      })
      .sort((a, b) => b.performedAt - a.performedAt);

    const ratedPerformances = performances.filter(p => p.rating !== null);
    const totalRating = ratedPerformances.reduce((sum, p) => sum + p.rating, 0);
    const averageRating =
      ratedPerformances.length > 0 ? Math.round((totalRating / ratedPerformances.length) * 10) / 10 : null;

    return {
      singerId,
      singerName: singer.name,
      songCount: performances.length,
      averageRating,
      bestRating: ratedPerformances.length > 0 ? Math.max(...ratedPerformances.map(p => p.rating)) : null,
      songHistory
    };
  }

  /**
   * Reorder songs in queue
   * @param {number} songId - Song to move
   * @param {number} newPosition - New position (0-based index)
   * @returns {Promise<void>}
   */
  async reorderSong(songId, newPosition) {
    const songs = await this.getQueuedSongs();
    const songIndex = songs.findIndex(s => s.id === songId);

    if (songIndex === -1) return;

    // Remove song from current position
    const [song] = songs.splice(songIndex, 1);
    // Insert at new position
    songs.splice(newPosition, 0, song);

    // Update createdAt to reflect new order
    const now = Date.now();
    for (let i = 0; i < songs.length; i++) {
      await this.updateSong(songs[i].id, { createdAt: now + i });
    }
  }

  /**
   * Calculate optimal position for a new song based on fair play rules
   * Ensures singers who have sung less get priority
   * @param {number[]} singerIds - IDs of singers for the new song
   * @returns {Promise<number>} - Optimal position (0-based index)
   */
  async getFairPlayPosition(singerIds) {
    const [queuedSongs, performances] = await Promise.all([this.getQueuedSongs(), this.getAllPerformances()]);

    // Count how many times each singer has performed (including queued)
    const singerCounts = new Map();

    // Count completed performances
    for (const perf of performances) {
      const current = singerCounts.get(perf.singerId) || 0;
      singerCounts.set(perf.singerId, current + 1);
    }

    // Count queued songs
    for (const song of queuedSongs) {
      for (const singerId of song.singerIds) {
        const current = singerCounts.get(singerId) || 0;
        singerCounts.set(singerId, current + 1);
      }
    }

    // Find the minimum song count among the new song's singers
    let minCount = Infinity;
    for (const singerId of singerIds) {
      const count = singerCounts.get(singerId) || 0;
      if (count < minCount) minCount = count;
    }

    // Find optimal position: insert before singers who have sung more
    for (let i = 0; i < queuedSongs.length; i++) {
      const song = queuedSongs[i];
      const songMinCount = Math.min(...song.singerIds.map(id => singerCounts.get(id) || 0));

      // Insert before songs where all singers have sung more
      if (songMinCount > minCount) {
        return i;
      }
    }

    // Otherwise, add at the end
    return queuedSongs.length;
  }

  /**
   * Add a song at a specific position in the queue
   * @param {Object} song - Song data
   * @param {number} position - Position in queue (0-based)
   * @returns {Promise<number>} - ID of the added song
   */
  async addSongAtPosition(song, position) {
    // First add the song normally
    const songId = await this.addSong(song);

    // Then reorder if needed
    if (position !== undefined && position >= 0) {
      await this.reorderSong(songId, position);
    }

    return songId;
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Clear all data (reset session)
   * @returns {Promise<void>}
   */
  async clearAll() {
    await this.clearAllSingers();
    await this.clearAllSongs();
    await this.clearAllPerformances();
  }
}

// Export singleton instance
export const storage = new StorageService();
export default storage;
