import styles from 'bundle-text:./StarRating.css';
import template from 'bundle-text:./StarRating.template.html';
import { i18n, pixEngine } from '../../services/index.js';

/**
 * Star Rating Custom Element
 * Displays a 5-star rating with half-star increments
 */
export class StarRating extends HTMLElement {
  static {
    // Inject component styles into document head
    const styleSheet = document.createElement('style');
    styleSheet.setAttribute('data-component', 'star-rating');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    customElements.define('star-rating', StarRating);
  }

  constructor() {
    super();
    this._value = 0;
    this._hoverValue = null;
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = parseFloat(val) || 0;
    this.render();
  }

  connectedCallback() {
    this._value = parseFloat(this.getAttribute('value')) || 0;
    this.render();
  }

  render() {
    const hasValue = this._value > 0;

    // Create stars array for template iteration
    const stars = [1, 2, 3, 4, 5].map(value => ({
      value,
      halfLeft: value - 0.5
    }));

    this.innerHTML = pixEngine(template, {
      ratingLabel: i18n.t('rating'),
      value: this._value,
      stars,
      resetHidden: hasValue ? '' : 'hidden'
    });

    this.updateDisplay();
    this.addEventListeners();
  }

  updateDisplay(displayValue = this._value) {
    const stars = this.querySelectorAll('.star');
    stars.forEach((star, index) => {
      const starValue = index + 1;
      const leftHalf = star.querySelector('.star-left');
      const rightHalf = star.querySelector('.star-right');

      if (displayValue >= starValue) {
        leftHalf.classList.add('filled');
        rightHalf.classList.add('filled');
      } else if (displayValue >= starValue - 0.5) {
        leftHalf.classList.add('filled');
        rightHalf.classList.remove('filled');
      } else {
        leftHalf.classList.remove('filled');
        rightHalf.classList.remove('filled');
      }
    });
  }

  addEventListeners() {
    const starContainer = this.querySelector('.star-rating');
    const starHalves = this.querySelectorAll('.star-half');

    // Hover preview
    starHalves.forEach(half => {
      half.addEventListener('mouseenter', () => {
        this._hoverValue = parseFloat(half.dataset.half);
        this.updateDisplay(this._hoverValue);
      });
    });

    // Leave hover: restore actual value
    starContainer?.addEventListener('mouseleave', () => {
      this._hoverValue = null;
      this.updateDisplay(this._value);
    });

    // Click commits selection
    starHalves.forEach(half => {
      half.addEventListener('click', e => {
        e.stopPropagation();
        const newValue = parseFloat(half.dataset.half);
        this._value = newValue;
        this._hoverValue = null;
        this.updateDisplay();
        this.updateResetButton();
        this.dispatchEvent(new CustomEvent('rating-change', { detail: { value: this._value } }));
      });
    });

    // Reset button listener
    const resetBtn = this.querySelector('.btn-reset-rating');
    if (resetBtn) {
      resetBtn.addEventListener('click', e => {
        e.stopPropagation();
        this._value = 0;
        this._hoverValue = null;
        this.updateDisplay();
        this.updateResetButton();
        this.dispatchEvent(new CustomEvent('rating-change', { detail: { value: this._value } }));
      });
    }
  }

  updateResetButton() {
    const resetBtn = this.querySelector('.btn-reset-rating');
    if (resetBtn) {
      if (this._value > 0) {
        resetBtn.classList.remove('hidden');
      } else {
        resetBtn.classList.add('hidden');
      }
    }
  }
}

export default StarRating;
