import ar from '../../assets/i18n/ar.json';
import de from '../../assets/i18n/de.json';
// Import all translations dynamically
import en from '../../assets/i18n/en.json';
import es from '../../assets/i18n/es.json';
import fr from '../../assets/i18n/fr.json';
import it from '../../assets/i18n/it.json';
import ja from '../../assets/i18n/ja.json';
import zh from '../../assets/i18n/zh.json';

const translations = { en, it, fr, de, es, zh, ja, ar };

/**
 * Internationalization Service
 * Manages language switching and translations
 */
class I18nService {
  constructor() {
    this.currentLang = localStorage.getItem('karaoke-lang') || 'en';
    this.rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    this.translations = translations;
  }

  /**
   * Check if current language is RTL
   * @returns {boolean}
   */
  isRTL() {
    return this.rtlLanguages.includes(this.currentLang);
  }

  /**
   * Set the current language
   * @param {string} lang - Language code
   */
  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('karaoke-lang', lang);
    this.updatePage();
    window.dispatchEvent(new CustomEvent('language-changed', { detail: { lang } }));
  }

  /**
   * Get translation for a key
   * @param {string} key - Translation key
   * @returns {string} - Translated text
   */
  t(key) {
    return this.translations[this.currentLang]?.[key] || this.translations.en?.[key] || key;
  }

  /**
   * Update all elements with data-i18n attribute
   */
  updatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    // Update document language and direction
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.isRTL() ? 'rtl' : 'ltr';
  }
}

// Export singleton instance
export const i18n = new I18nService();
export default i18n;
