/**
 * Rating Component
 * Star rating input (0-5 stars, supports half-stars via left/right click zones)
 * Uses SVG stars for better rendering
 */
import { registerStylesheet, i18n } from '../../../services/index.js';
import styles from 'bundle-text:./Rating.css';

// SVG path for star shape
const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

export class Rating extends HTMLElement {
  static {
    registerStylesheet(styles);
    customElements.define('pix-rating', this);
  }

  static observedAttributes = ['value', 'readonly', 'name', 'max'];

  constructor() {
    super();
    this._value = 0;
    this._previewValue = null;
    this._readonly = false;
    this._name = 'rating';
    this._max = 5;
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = parseFloat(val) || 0;
    this.updateStars();
    this.updateHiddenInput();
  }

  get readonly() {
    return this._readonly;
  }

  set readonly(val) {
    this._readonly = val === true || val === 'true' || val === '';
    if (this._readonly) {
      this.setAttribute('readonly', '');
    } else {
      this.removeAttribute('readonly');
    }
    this.updateButtons();
  }

  connectedCallback() {
    this._value = parseFloat(this.getAttribute('value')) || 0;
    this._readonly = this.hasAttribute('readonly');
    this._name = this.getAttribute('name') || 'rating';
    this._max = parseInt(this.getAttribute('max'), 10) || 5;

    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'value':
        this.value = newValue;
        break;
      case 'readonly':
        this.readonly = newValue !== null;
        break;
      case 'name':
        this._name = newValue || 'rating';
        break;
      case 'max':
        this._max = parseInt(newValue, 10) || 5;
        break;
    }
  }

  render() {
    const ariaLabel = i18n.t('rating.label');
    const singular = i18n.t('rating.star');
    const plural = i18n.t('rating.stars');

    // Hidden input for form submission
    let html = `<input type="number" min="0" max="${this._max}" step="0.5" value="${this._value}" name="${this._name}" aria-label="${ariaLabel}">`;

    // Star buttons with two clickable zones (left half, right half)
    for (let i = 1; i <= this._max; i++) {
      const label = `${i} ${i === 1 ? singular : plural}`;
      html += `
        <button type="button" data-value="${i}" aria-label="${label}" ${this._readonly ? 'disabled' : ''}>
          <span zone="left" data-half="${i - 0.5}"></span>
          <span zone="right" data-full="${i}"></span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="${STAR_PATH}"/>
          </svg>
        </button>`;
    }

    this.innerHTML = html;

    if (this._readonly) {
      this.setAttribute('readonly', '');
    }

    this.updateStars();
  }

  setupEventListeners() {
    this.querySelectorAll('button').forEach(button => {
      // Click on zones
      button.addEventListener('click', e => {
        if (this._readonly) return;

        const leftZone = button.querySelector('[zone="left"]');
        let newValue;

        if (e.target === leftZone || e.target.closest('[zone="left"]')) {
          newValue = parseFloat(leftZone.dataset.half);
        } else {
          newValue = parseFloat(button.dataset.value);
        }

        this._value = newValue;
        this._previewValue = null;
        this.updateStars();
        this.updateHiddenInput();

        this.dispatchEvent(
          new CustomEvent('rating:change', {
            bubbles: true,
            detail: { value: newValue }
          })
        );
      });

      // Hover preview
      button.addEventListener('mousemove', e => {
        if (this._readonly) return;

        const leftZone = button.querySelector('[zone="left"]');
        if (e.target === leftZone || e.target.closest('[zone="left"]')) {
          this._previewValue = parseFloat(leftZone.dataset.half);
        } else {
          this._previewValue = parseFloat(button.dataset.value);
        }
        this.updateStars();
      });

      button.addEventListener('mouseleave', () => {
        if (this._readonly) return;
        this._previewValue = null;
        this.updateStars();
      });
    });
  }

  updateStars() {
    const displayValue = this._previewValue !== null ? this._previewValue : this._value;
    const buttons = this.querySelectorAll('button');

    buttons.forEach(button => {
      const starValue = parseFloat(button.dataset.value);
      const isHalf = starValue - 0.5 === displayValue;
      const isFilled = starValue <= displayValue;

      // Remove all states
      button.removeAttribute('filled');
      button.removeAttribute('half');
      button.removeAttribute('preview');

      if (isFilled && !isHalf) {
        button.setAttribute('filled', '');
      } else if (isHalf) {
        button.setAttribute('half', '');
      }

      if (this._previewValue !== null && starValue <= this._previewValue && starValue > this._value) {
        button.setAttribute('preview', '');
      }
    });
  }

  updateHiddenInput() {
    const input = this.querySelector('input[type="number"]');
    if (input) {
      input.value = this._value;
    }
  }

  updateButtons() {
    const buttons = this.querySelectorAll('button');
    buttons.forEach(button => {
      button.disabled = this._readonly;
    });
  }
}

export default Rating;
