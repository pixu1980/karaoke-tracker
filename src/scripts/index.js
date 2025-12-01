/**
 * Karaoke Tracker - Main Entry Point
 * Initializes polyfills, services, and components
 */

// Polyfills
import './polyfills/index.js';

// Services initialization
import { storage, i18n } from './services/index.js';

// Components
import './components/index.js';

/**
 * Application initialization
 */
class App {
  constructor() {
    this.dialogs = {};
  }

  async init() {
    try {
      // Initialize storage (IndexedDB)
      await storage.init();
      console.log('✓ Storage initialized');

      // Initialize i18n
      await i18n.init();
      console.log('✓ i18n initialized');

      // Cache dialog references
      this.dialogs = {
        addSinger: document.getElementById('add-singer-dialog'),
        addSong: document.getElementById('add-song-dialog'),
        songComplete: document.getElementById('song-complete-dialog'),
        confirm: document.getElementById('confirm-dialog'),
        singerStats: document.getElementById('singer-stats-dialog'),
        sessionStats: document.getElementById('session-stats-dialog')
      };

      // Setup event listeners
      this.setupEventListeners();

      // Load settings
      this.loadAutoRotateSetting();
      this.loadFairPlaySetting();

      // Dispatch app ready event
      document.dispatchEvent(new CustomEvent('app:ready'));
      console.log('✓ App ready');
    } catch (error) {
      console.error('App initialization failed:', error);
    }
  }

  setupEventListeners() {
    // Auto-rotate toggle
    const autoRotateToggle = document.getElementById('auto-rotate-toggle');
    autoRotateToggle?.addEventListener('change', e => {
      localStorage.setItem('karaoke-tracker-auto-rotate', e.target.checked);
    });

    // Fair play toggle
    const fairPlayToggle = document.getElementById('fair-play-toggle');
    fairPlayToggle?.addEventListener('change', e => {
      localStorage.setItem('karaoke-tracker-fair-play', e.target.checked);
    });

    // Example Data button
    const exampleDataBtn = document.getElementById('example-data-btn');
    exampleDataBtn?.addEventListener('click', () => {
      this.dialogs.confirm?.open({
        title: i18n.t('confirm.title'),
        message: i18n.t('confirm.exampleDataMessage'),
        confirmText: i18n.t('common.confirm'),
        variant: 'primary',
        onConfirm: async () => {
          await this.loadExampleData();
        }
      });
    });

    // Session Stats button
    const sessionStatsBtn = document.getElementById('session-stats-btn');
    sessionStatsBtn?.addEventListener('click', () => {
      this.dialogs.sessionStats?.open();
    });

    // Song add request (from SongQueue)
    document.addEventListener('song:add-request', () => {
      this.dialogs.addSong?.open();
    });

    // Songs clear request (from SongQueue)
    document.addEventListener('songs:clear-request', () => {
      this.dialogs.confirm?.open({
        title: i18n.t('confirm.title'),
        message: i18n.t('confirm.clearSongsMessage'),
        confirmText: i18n.t('common.delete'),
        variant: 'danger',
        onConfirm: async () => {
          try {
            await storage.clearAllSongs();
            document.dispatchEvent(new CustomEvent('songs:updated'));
          } catch (error) {
            console.error('Failed to clear songs:', error);
          }
        }
      });
    });

    // Singers clear request (from SingerList)
    document.addEventListener('singers:clear-request', () => {
      this.dialogs.confirm?.open({
        title: i18n.t('confirm.title'),
        message: i18n.t('confirm.clearSingersMessage'),
        confirmText: i18n.t('common.delete'),
        variant: 'danger',
        onConfirm: async () => {
          try {
            await storage.clearAll();
            document.dispatchEvent(new CustomEvent('singers:updated'));
            document.dispatchEvent(new CustomEvent('songs:updated'));
            document.dispatchEvent(new CustomEvent('performances:updated'));
          } catch (error) {
            console.error('Failed to clear all data:', error);
          }
        }
      });
    });

    // Singer list events
    document.addEventListener('singer:add-request', () => {
      this.dialogs.addSinger?.open();
    });

    document.addEventListener('singer:edit-request', e => {
      this.dialogs.addSinger?.open(e.detail);
    });

    document.addEventListener('singer:delete-request', e => {
      this.dialogs.confirm?.open({
        title: i18n.t('confirm.deleteSinger'),
        message: i18n.t('confirm.deleteSingerMessage', { name: e.detail.singerName }),
        confirmText: i18n.t('common.delete'),
        variant: 'danger',
        onConfirm: async () => {
          try {
            await storage.deleteSinger(e.detail.singerId);
            document.dispatchEvent(new CustomEvent('singers:updated'));
          } catch (error) {
            console.error('Failed to delete singer:', error);
          }
        }
      });
    });

    // Song queue events
    document.addEventListener('song:complete-request', e => {
      this.dialogs.songComplete?.open(e.detail);
    });

    document.addEventListener('song:edit-request', e => {
      this.dialogs.addSong?.open(e.detail);
    });

    document.addEventListener('song:delete-request', e => {
      this.dialogs.confirm?.open({
        title: i18n.t('confirm.deleteSong'),
        message: i18n.t('confirm.deleteSongMessage', { title: e.detail.song?.title }),
        confirmText: i18n.t('common.delete'),
        variant: 'danger',
        onConfirm: async () => {
          try {
            await storage.deleteSong(e.detail.songId);
            document.dispatchEvent(new CustomEvent('songs:updated'));
          } catch (error) {
            console.error('Failed to delete song:', error);
          }
        }
      });
    });

    // Singer stats request (from Leaderboard)
    document.addEventListener('singer:stats-request', e => {
      this.dialogs.singerStats?.open(e.detail.singerId);
    });
  }

  loadAutoRotateSetting() {
    const toggle = document.getElementById('auto-rotate-toggle');
    const saved = localStorage.getItem('karaoke-tracker-auto-rotate');

    if (toggle && saved !== null) {
      toggle.checked = saved !== 'false';
    }
  }

  loadFairPlaySetting() {
    const toggle = document.getElementById('fair-play-toggle');
    const saved = localStorage.getItem('karaoke-tracker-fair-play');

    if (toggle && saved !== null) {
      toggle.checked = saved === 'true';
    }
  }

  /**
   * Load example data for demonstration
   * Creates 10 singers, 20 queued songs, and 10 completed performances with ratings
   */
  async loadExampleData() {
    try {
      // Clear existing data first
      await storage.clearAll();

      // Example singer names
      const singerNames = [
        'Alex Rivera',
        'Sam Chen',
        'Jordan Taylor',
        'Morgan Lee',
        'Casey Brooks',
        'Riley Kim',
        'Jamie Wong',
        'Quinn Adams',
        'Avery Martinez',
        'Sydney Park'
      ];

      // Add singers
      const singerIds = [];
      for (const name of singerNames) {
        const id = await storage.addSinger({ name });
        singerIds.push(id);
      }

      // Example songs with YouTube karaoke links
      const exampleSongs = [
        { title: 'Bohemian Rhapsody', author: 'Queen', key: '0', youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ' },
        { title: "Don't Stop Believin'", author: 'Journey', key: '+2', youtubeUrl: 'https://www.youtube.com/watch?v=1k8craCGpgs' },
        { title: 'Sweet Caroline', author: 'Neil Diamond', key: '-1', youtubeUrl: 'https://www.youtube.com/watch?v=1vhFnTjia_I' },
        { title: "Livin' on a Prayer", author: 'Bon Jovi', key: '+1', youtubeUrl: 'https://www.youtube.com/watch?v=lDK9QqIzhwk' },
        { title: 'I Will Survive', author: 'Gloria Gaynor', key: '0', youtubeUrl: 'https://www.youtube.com/watch?v=ARt9HV9T0w8' },
        { title: 'Take On Me', author: 'a-ha', key: '-2', youtubeUrl: 'https://www.youtube.com/watch?v=djV11Xbc914' },
        { title: 'Dancing Queen', author: 'ABBA', key: '0', youtubeUrl: 'https://www.youtube.com/watch?v=xFrGuyw1V8s' },
        { title: 'Total Eclipse of the Heart', author: 'Bonnie Tyler', key: '+1', youtubeUrl: 'https://www.youtube.com/watch?v=lcOxhH8N3Bo' },
        { title: 'My Way', author: 'Frank Sinatra', key: '-1', youtubeUrl: 'https://www.youtube.com/watch?v=qQzdAsjWGPg' },
        { title: 'Summer Nights', author: 'Grease', key: '0', youtubeUrl: 'https://www.youtube.com/watch?v=ZW0DfsCzfq4' },
        { title: 'Africa', author: 'Toto', key: '+2', youtubeUrl: 'https://www.youtube.com/watch?v=FTQbiNvZqaY' },
        { title: 'Wonderwall', author: 'Oasis', key: '0', youtubeUrl: 'https://www.youtube.com/watch?v=bx1Bh8ZvH84' },
        { title: 'Mr. Brightside', author: 'The Killers', key: '-1', youtubeUrl: 'https://www.youtube.com/watch?v=gGdGFtwCNBE' },
        { title: 'Shallow', author: 'Lady Gaga & Bradley Cooper', key: '+1', youtubeUrl: 'https://www.youtube.com/watch?v=bo_efYhYU2A' },
        { title: 'Piano Man', author: 'Billy Joel', key: '0', youtubeUrl: 'https://www.youtube.com/watch?v=gxEPV4kolz0' },
        { title: 'Hotel California', author: 'Eagles', key: '-2', youtubeUrl: 'https://www.youtube.com/watch?v=09839DpTctU' },
        { title: 'I Want It That Way', author: 'Backstreet Boys', key: '+1', youtubeUrl: 'https://www.youtube.com/watch?v=4fndeDfaWCg' },
        { title: 'Uptown Funk', author: 'Bruno Mars', key: '0', youtubeUrl: 'https://www.youtube.com/watch?v=OPf0YbXqDm0' },
        { title: 'Hallelujah', author: 'Leonard Cohen', key: '-1', youtubeUrl: 'https://www.youtube.com/watch?v=y8AWFf7EAc4' },
        { title: 'Rolling in the Deep', author: 'Adele', key: '+2', youtubeUrl: 'https://www.youtube.com/watch?v=rYEDA3JcQqw' },
        { title: 'Imagine', author: 'John Lennon', key: '0', youtubeUrl: 'https://www.youtube.com/watch?v=YkgkThdzX-8' },
        { title: 'Somebody That I Used to Know', author: 'Gotye', key: '-1', youtubeUrl: 'https://www.youtube.com/watch?v=8UVNT4wvIGY' },
        { title: 'Thriller', author: 'Michael Jackson', key: '0', youtubeUrl: 'https://www.youtube.com/watch?v=sOnqjkJTMaA' },
        { title: 'Let It Go', author: 'Frozen', key: '+1', youtubeUrl: 'https://www.youtube.com/watch?v=L0MK7qz13bU' },
        { title: 'Smells Like Teen Spirit', author: 'Nirvana', key: '-2', youtubeUrl: 'https://www.youtube.com/watch?v=hTWKbfoikeg' },
        { title: 'Billie Jean', author: 'Michael Jackson', key: '0', youtubeUrl: 'https://www.youtube.com/watch?v=Zi_XLOBDo_Y' },
        { title: 'All of Me', author: 'John Legend', key: '+1', youtubeUrl: 'https://www.youtube.com/watch?v=450p7goxZqg' },
        { title: 'Shape of You', author: 'Ed Sheeran', key: '0', youtubeUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8' },
        { title: 'Yesterday', author: 'The Beatles', key: '-1', youtubeUrl: 'https://www.youtube.com/watch?v=NrgmdOz227I' },
        { title: "Can't Help Falling in Love", author: 'Elvis Presley', key: '0', youtubeUrl: 'https://www.youtube.com/watch?v=vGJTaP6anOU' }
      ];

      // Add 20 queued songs (assigning 1-3 singers randomly)
      for (let i = 0; i < 20; i++) {
        const song = exampleSongs[i];
        const numSingers = Math.floor(Math.random() * 2) + 1; // 1-2 singers
        const shuffled = [...singerIds].sort(() => Math.random() - 0.5);
        const songSingerIds = shuffled.slice(0, numSingers);

        await storage.addSong({
          title: song.title,
          author: song.author,
          singerIds: songSingerIds,
          key: song.key,
          youtubeUrl: song.youtubeUrl
        });
      }

      // Add 10 completed performances with ratings
      for (let i = 20; i < 30; i++) {
        const song = exampleSongs[i];
        const numSingers = Math.floor(Math.random() * 2) + 1;
        const shuffled = [...singerIds].sort(() => Math.random() - 0.5);
        const songSingerIds = shuffled.slice(0, numSingers);

        // Add and archive the song
        const songId = await storage.addSong({
          title: song.title,
          author: song.author,
          singerIds: songSingerIds,
          key: song.key,
          youtubeUrl: song.youtubeUrl
        });

        await storage.archiveSong(songId);

        // Add performance records with random ratings (2.5-5)
        for (const singerId of songSingerIds) {
          const singer = singerNames[singerIds.indexOf(singerId)];
          const rating = Math.round((Math.random() * 2.5 + 2.5) * 2) / 2; // 2.5-5 in 0.5 steps

          await storage.addPerformance({
            songId,
            singerId,
            songTitle: song.title,
            singerName: singer,
            rating
          });
        }
      }

      // Dispatch update events
      document.dispatchEvent(new CustomEvent('singers:updated'));
      document.dispatchEvent(new CustomEvent('songs:updated'));
      document.dispatchEvent(new CustomEvent('performances:updated'));

      console.log('✓ Example data loaded');
    } catch (error) {
      console.error('Failed to load example data:', error);
    }
  }
}

// Initialize when DOM is ready
const app = new App();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

export { app };
