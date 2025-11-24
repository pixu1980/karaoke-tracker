// Storage Service - Using IndexedDB for better storage capabilities
class StorageService {
    constructor() {
        this.dbName = 'KaraokeTrackerDB';
        this.storeName = 'singers';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    async getAllSingers() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

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

    async deleteSinger(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clearAllSingers() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

// Initialize storage service
const storage = new StorageService();

// Custom Element: Singer Form
class SingerForm extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <form class="singer-form">
                <div class="form-group">
                    <label for="singerName" class="form-label">Singer Name *</label>
                    <input 
                        type="text" 
                        id="singerName" 
                        name="name" 
                        class="form-input" 
                        placeholder="Enter singer name"
                        required
                        aria-required="true"
                    >
                </div>
                
                <div class="form-group">
                    <label for="singerSong" class="form-label">Song Title *</label>
                    <input 
                        type="text" 
                        id="singerSong" 
                        name="song" 
                        class="form-input" 
                        placeholder="Enter song title"
                        required
                        aria-required="true"
                    >
                </div>
                
                <div class="form-group">
                    <label for="singerImage" class="form-label">Image URL (optional)</label>
                    <input 
                        type="url" 
                        id="singerImage" 
                        name="imageUrl" 
                        class="form-input" 
                        placeholder="https://example.com/image.jpg"
                    >
                </div>
                
                <div class="form-group">
                    <label for="singerNotes" class="form-label">Notes (optional)</label>
                    <textarea 
                        id="singerNotes" 
                        name="notes" 
                        class="form-textarea" 
                        placeholder="Add any notes or comments"
                    ></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary">Add to Queue</button>
            </form>
        `;

        this.form = this.querySelector('.singer-form');
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(this.form);
        const singer = {
            name: formData.get('name'),
            song: formData.get('song'),
            imageUrl: formData.get('imageUrl') || '',
            notes: formData.get('notes') || ''
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

// Custom Element: Singer List
class SingerList extends HTMLElement {
    connectedCallback() {
        // Wait for storage to be ready
        window.addEventListener('storage-ready', () => this.loadSingers());
        
        // Listen for singer-added events
        window.addEventListener('singer-added', () => this.loadSingers());
        window.addEventListener('singer-deleted', () => this.loadSingers());
    }

    async loadSingers() {
        try {
            const singers = await storage.getAllSingers();
            this.renderSingers(singers);
        } catch (error) {
            console.error('Error loading singers:', error);
            this.innerHTML = '<p class="empty-state-text">Failed to load singers.</p>';
        }
    }

    renderSingers(singers) {
        if (singers.length === 0) {
            this.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🎵</div>
                    <p class="empty-state-text">No singers in the queue yet. Add one above!</p>
                </div>
            `;
            return;
        }

        this.innerHTML = singers.map(singer => `
            <singer-card 
                data-id="${singer.id}"
                data-name="${this.escapeHtml(singer.name)}"
                data-song="${this.escapeHtml(singer.song)}"
                data-image="${this.escapeHtml(singer.imageUrl || '')}"
                data-notes="${this.escapeHtml(singer.notes || '')}"
            ></singer-card>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Custom Element: Singer Card
class SingerCard extends HTMLElement {
    connectedCallback() {
        const id = this.dataset.id;
        const name = this.dataset.name;
        const song = this.dataset.song;
        const imageUrl = this.dataset.image;
        const notes = this.dataset.notes;

        const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect fill="%23e5e7eb" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="32" fill="%236b7280"%3E🎤%3C/text%3E%3C/svg%3E';

        this.innerHTML = `
            <article class="singer-card" role="article" aria-label="Singer: ${name}">
                <img 
                    src="${imageUrl || defaultImage}" 
                    alt="${name}" 
                    class="singer-image"
                    onerror="this.src='${defaultImage}'"
                >
                <div class="singer-info">
                    <h3 class="singer-name">${name}</h3>
                    <p class="singer-song">🎵 ${song}</p>
                    ${notes ? `<p class="singer-notes">${notes}</p>` : ''}
                </div>
                <div class="singer-actions">
                    <button 
                        class="btn btn-success btn-sm" 
                        data-action="done"
                        aria-label="Mark ${name} as done"
                    >
                        ✓ Done
                    </button>
                    <button 
                        class="btn btn-danger btn-sm" 
                        data-action="remove"
                        aria-label="Remove ${name} from queue"
                    >
                        ✕ Remove
                    </button>
                </div>
            </article>
        `;

        // Add event listeners
        this.querySelector('[data-action="done"]').addEventListener('click', () => this.handleDone(id, name));
        this.querySelector('[data-action="remove"]').addEventListener('click', () => this.handleRemove(id, name));
    }

    async handleDone(id, name) {
        if (confirm(`Mark ${name} as done and remove from queue?`)) {
            await this.handleRemove(id, name, false);
        }
    }

    async handleRemove(id, name, showConfirm = true) {
        if (showConfirm && !confirm(`Remove ${name} from the queue?`)) {
            return;
        }

        try {
            await storage.deleteSinger(Number(id));
            window.dispatchEvent(new CustomEvent('singer-deleted'));
        } catch (error) {
            console.error('Error removing singer:', error);
            alert('Failed to remove singer. Please try again.');
        }
    }
}

// Define custom elements
customElements.define('singer-form', SingerForm);
customElements.define('singer-list', SingerList);
customElements.define('singer-card', SingerCard);

// Initialize the app
async function initApp() {
    try {
        await storage.init();
        console.log('Karaoke Tracker initialized successfully!');
        
        // Notify that storage is ready
        window.dispatchEvent(new CustomEvent('storage-ready'));
        
        // Clear all button handler
        const clearAllBtn = document.getElementById('clearAllBtn');
        clearAllBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to clear all singers from the queue?')) {
                try {
                    await storage.clearAllSingers();
                    window.dispatchEvent(new CustomEvent('singer-deleted'));
                } catch (error) {
                    console.error('Error clearing singers:', error);
                    alert('Failed to clear singers. Please try again.');
                }
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
