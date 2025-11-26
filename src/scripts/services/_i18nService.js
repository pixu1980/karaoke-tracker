import ar from '../../assets/i18n/ar.json';
import de from '../../assets/i18n/de.json';
// Import all translations dynamically
import en from '../../assets/i18n/en.json';
import es from '../../assets/i18n/es.json';
import fr from '../../assets/i18n/fr.json';
import it from '../../assets/i18n/it.json';
import ja from '../../assets/i18n/ja.json';
import zh from '../../assets/i18n/zh.json';

const languages = { en, it, fr, de, es, zh, ja, ar };

/**
 * Internationalization Service
 * Manages language switching and translations
 */
class I18nService {
  constructor() {
    this.currentLang = localStorage.getItem('karaoke-lang') || 'en';
    this.languages = languages;
  }

  /**
   * Get all available languages
   * @returns {Array<{code: string, name: string, flag: string, isRTL: boolean}>}
   */
  getLanguages() {
    return Object.entries(this.languages).map(([code, lang]) => ({
      code,
      name: lang.name,
      flag: lang.flag,
      isRTL: lang.isRTL
    }));
  }

  /**
   * Get current language data
   * @returns {{code: string, name: string, flag: string, isRTL: boolean}}
   */
  getCurrentLanguage() {
    const lang = this.languages[this.currentLang] || this.languages.en;
    return {
      code: this.currentLang,
      name: lang.name,
      flag: lang.flag,
      isRTL: lang.isRTL
    };
  }

  /**
   * Check if current language is RTL
   * @returns {boolean}
   */
  isRTL() {
    return this.languages[this.currentLang]?.isRTL || false;
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
    return (
      this.languages[this.currentLang]?.translations?.[key] ||
      this.languages.en?.translations?.[key] ||
      key
    );
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
