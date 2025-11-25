/**
 * Theme Service
 * Manages theme switching (light/dark/system)
 */
class ThemeService {
  constructor() {
    this.currentTheme = localStorage.getItem('karaoke-theme') || 'system';
  }

  /**
   * Set the current theme
   * @param {string} theme - Theme name ('light', 'dark', 'system')
   */
  setTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('karaoke-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.updateButtons();
  }

  /**
   * Update theme buttons active state
   */
  updateButtons() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === this.currentTheme);
    });
  }

  /**
   * Initialize theme on page load
   */
  init() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    this.updateButtons();
  }
}

// Export singleton instance
export const themeService = new ThemeService();
export default themeService;
