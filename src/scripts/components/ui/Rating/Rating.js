import styles from 'bundle-text:./Rating.css';
import template from 'bundle-text:./Rating.template.html';
import { i18n, pixEngine, registerStylesheet } from '../../../services/index.js';

/**
 * Rating Custom Element - extends HTMLInputElement
 * Displays a 5-star rating with half-star increments
 * Usage: <input is="star-rating" type="number" value="0" min="0" max="5" step="0.5">
 * The component wraps itself in a label to render the visual star interface
 */
class Rating extends HTMLInputElement {
  static {
    // Inject component styles using adoptedStyleSheets
    registerStylesheet(styles);

    customElements.define('star-rating', Rating, { extends: 'input' });
  }

  constructor() {
    super();
    this._hoverValue = null;
    this._wrapper = null;
  }

  connectedCallback() {
    // Force type to number and hide the native input
    this.type = 'number';
    this.min = '0';
    this.max = '5';
    this.step = '0.5';
    this.classList.add('sr-only');

    // Create wrapper label element
    this._wrapper = document.createElement('label');
    this._wrapper.classList.add('rating-wrapper');

    // Insert wrapper after this input
    this.parentNode.insertBefore(this._wrapper, this.nextSibling);

    this.renderStars();

    // Sync with native input value changes
    this.addEventListener('change', () => {
      this.renderStars();
    });
  }

  disconnectedCallback() {
    // Clean up wrapper when element is removed
    if (this._wrapper && this._wrapper.parentNode) {
      this._wrapper.parentNode.removeChild(this._wrapper);
    }
  }

  renderStars() {
    const currentValue = parseFloat(this.value) || 0;
    const hasValue = currentValue > 0;

    // Create stars array for template iteration
    const stars = [1, 2, 3, 4, 5].map(value => ({
      value,
      halfLeft: value - 0.5
    }));

    this._wrapper.innerHTML = pixEngine(template, {
      ratingLabel: i18n.t('rating'),
      value: currentValue,
      stars,
      resetHidden: hasValue ? '' : 'hidden'
    });

    this.updateDisplay(currentValue);
    this.setupStarListeners();
  }

  updateDisplay(displayValue) {
    const starElements = this._wrapper.querySelectorAll('.star');
    starElements.forEach((star, index) => {
      const starValue = index + 1;
      const leftHalf = star.querySelector('.star-left');
      const rightHalf = star.querySelector('.star-right');

      if (displayValue >= starValue) {
        leftHalf?.classList.add('filled');
        rightHalf?.classList.add('filled');
      } else if (displayValue >= starValue - 0.5) {
        leftHalf?.classList.add('filled');
        rightHalf?.classList.remove('filled');
      } else {
        leftHalf?.classList.remove('filled');
        rightHalf?.classList.remove('filled');
      }
    });
  }

  setupStarListeners() {
    const starContainer = this._wrapper.querySelector('.pix-rating');
    const starHalves = this._wrapper.querySelectorAll('.star-half');

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
      this.updateDisplay(parseFloat(this.value) || 0);
    });

    // Click commits selection
    starHalves.forEach(half => {
      half.addEventListener('click', e => {
        e.stopPropagation();
        const newValue = parseFloat(half.dataset.half);
        this.value = newValue;
        this._hoverValue = null;
        this.updateDisplay(newValue);
        this.updateResetButton();

        // Dispatch both native and custom events
        this.dispatchEvent(new Event('change', { bubbles: true }));
        this.dispatchEvent(
          new CustomEvent('rating-change', {
            detail: { value: newValue },
            bubbles: true
          })
        );
      });
    });

    // Reset button listener
    const resetBtn = this._wrapper.querySelector('.btn-reset-rating');
    if (resetBtn) {
      resetBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.value = 0;
        this._hoverValue = null;
        this.updateDisplay(0);
        this.updateResetButton();

        // Dispatch both native and custom events
        this.dispatchEvent(new Event('change', { bubbles: true }));
        this.dispatchEvent(
          new CustomEvent('rating-change', {
            detail: { value: 0 },
            bubbles: true
          })
        );
      });
    }
  }

  updateResetButton() {
    const resetBtn = this._wrapper.querySelector('.btn-reset-rating');
    if (resetBtn) {
      const currentValue = parseFloat(this.value) || 0;
      if (currentValue > 0) {
        resetBtn.classList.remove('hidden');
      } else {
        resetBtn.classList.add('hidden');
      }
    }
  }
}

export { Rating };
export default Rating;
