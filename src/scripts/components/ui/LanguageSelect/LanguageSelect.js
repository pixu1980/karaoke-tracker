/**
 * LanguageSelect Component
 * Simple native select for language switching
 */
import { registerStylesheet, i18n } from '../../../services/index.js';
import styles from 'bundle-text:./LanguageSelect.css';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true }
];

export class LanguageSelect extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('pix-language-select', LanguageSelect);
  }

  connectedCallback() {
    this.render();
    this.querySelector('select').addEventListener('change', this.handleChange.bind(this));
  }

  render() {
    const currentLang = i18n.getCurrentLanguage().code;

    const options = LANGUAGES.map(lang =>
      `<option value="${lang.code}"${lang.code === currentLang ? ' selected' : ''}>${lang.flag} ${lang.name}</option>`
    ).join('');

    this.innerHTML = `<select aria-label="${i18n.t('language.select')}">${options}</select>`;
  }

  handleChange(event) {
    const newLang = event.target.value;
    const langData = LANGUAGES.find(l => l.code === newLang);

    // Update document direction for RTL languages
    document.documentElement.dir = langData?.rtl ? 'rtl' : 'ltr';

    // Update i18n service (this also dispatches language-changed event)
    i18n.setLanguage(newLang);
  }
}

export default LanguageSelect;
