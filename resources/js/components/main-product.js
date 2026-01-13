import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

Fancybox.bind('[data-fancybox="product-gallery"]', {
  Thumbs: {
    type: "classic",
  },
  Toolbar: false,
});

const zoomBtn = document.querySelector('.navigation-zoom');
if (zoomBtn) {
  zoomBtn.addEventListener('click', () => {
    const links = Array.from(
      document.querySelectorAll('[data-fancybox="product-gallery"]')
    );

    const items = links.map((el) => ({
      src: el.getAttribute('href'),
      type: el.dataset.type || 'image',
      caption: el.dataset.caption || '',
    }));

    Fancybox.show(items, {
      Thumbs: {
        type: "classic",
      },
      Toolbar: false,
    });
  });
}


const open_product_description = () => {
    const toggle = document.getElementById('product-description-toggle');
    const descriptionAccordion = document.querySelector('.accordion-toggle--description');
    if (!toggle || !descriptionAccordion) return;

    toggle.addEventListener('click', function() {
        descriptionAccordion.click();
        descriptionAccordion.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    });
}

window.addEventListener('DOMContentLoaded', open_product_description);


/**
 * Store Availability Module (Vanilla JS)
 * --------------------------------------
 * Converted by AI from jQuery to standard JS, original code from chelsea baby them.
 * Dependencies removed — usable in any store.
 */

class StoreAvailability {
  constructor(container) {
    this.container = container;
    this.loadingClass = 'store-availability-loading';
    this.initClass = 'store-availability-initialized';
    
    // Data attributes
    this.productId = container.dataset.storeAvailabilityContainer;
    this.sectionUrl = container.dataset.sectionUrl;
    
    // Animation
    this.transitionDurationMS = parseFloat(getComputedStyle(container).transitionDuration) * 1000 || 0;
    this.removeFixedHeightTimeout = -1;

    // Initialize
    container.classList.add(this.initClass);
    this._setupVariantListener();
    this._handleSingleVariant();
  }

  _setupVariantListener() {
    // Listen for variant changes via CustomEvent 'cc-variant-updated'
    // { detail: { product: { id }, variant: { id, available } } }
    window.addEventListener('cc-variant-updated', (e) => {
      const args = e.detail;
      if (!args?.product?.id || args.product.id !== this.productId) return;

      this.updateContent(
        args.variant?.id || null,
        args.product.title,
        this.container.dataset.hasOnlyDefaultVariant === 'true',
        args.variant ? args.variant.available : false
      );
    });
  }

  _handleSingleVariant() {
    if (this.container.dataset.singleVariantId) {
      this.updateContent(
        this.container.dataset.singleVariantId,
        this.container.dataset.singleVariantProductTitle,
        this.container.dataset.hasOnlyDefaultVariant === 'true',
        this.container.dataset.singleVariantProductAvailable === 'true'
      );
    }
  }

  async getAvailableStores(variantId) {
    const url = this.sectionUrl.replace('VARIANT_ID', variantId);
    try {
      const response = await fetch(url);
      return response.text();
    } catch (error) {
      console.warn('Store availability fetch failed:', error);
      return '';
    }
  }

  async updateContent(variantId, productTitle, isSingleDefaultVariant, isVariantAvailable) {
    // Show loading state
    this.container.classList.add(this.loadingClass);
    
    // Preserve height during transition (if animated)
    if (this.transitionDurationMS > 0) {
      this.container.style.height = isVariantAvailable 
        ? `${this.container.offsetHeight}px` 
        : '0px';
    }

    // Variant unavailable → clear container
    if (!isVariantAvailable || !variantId) {
      this.container.innerHTML = '';
      
      if (this.transitionDurationMS > 0) {
        clearTimeout(this.removeFixedHeightTimeout);
        this.removeFixedHeightTimeout = setTimeout(() => {
          this.container.style.height = '';
        }, this.transitionDurationMS);
      }
      
      this.container.classList.remove(this.loadingClass);
      return;
    }

    // Fetch store availability
    const response = await this.getAvailableStores(variantId);
    
    // No stores available → clear container
    if (!response.trim() || response.includes('NO_PICKUP')) {
      this.container.innerHTML = '';
    } else {
      // Inject store availability message directly
      this.container.innerHTML = response;
      
      // Editor bug workaround (original logic)
      const firstChild = this.container.firstElementChild;
      if (firstChild) {
        this.container.innerHTML = firstChild.innerHTML;
      }

      // Update product title if element exists
      const titleEl = this.container.querySelector('[data-store-availability-modal-product-title]');
      if (titleEl) {
        titleEl.textContent = productTitle;
      }

      // Remove variant title for single variant products
      if (isSingleDefaultVariant) {
        const variantTitleEl = this.container.querySelector('.store-availabilities-modal__variant-title');
        if (variantTitleEl) variantTitleEl.remove();
      }
    }

    // Remove loading state and handle height animation
    this.container.classList.remove(this.loadingClass);
    
    if (this.transitionDurationMS > 0) {
      const newHeight = this.container.querySelector('.store-availability-container')?.offsetHeight 
        || this.container.offsetHeight 
        || 0;
      
      this.container.style.height = newHeight > 0 ? `${newHeight}px` : '';
      
      clearTimeout(this.removeFixedHeightTimeout);
      this.removeFixedHeightTimeout = setTimeout(() => {
        this.container.style.height = '';
      }, this.transitionDurationMS);
    }
  }
}

// Initialize all containers on page
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-store-availability-container]').forEach(container => {
    new StoreAvailability(container);
  });
});

// Also support dynamic content (SPAs)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-store-availability-container]').forEach(container => {
      new StoreAvailability(container);
    });
  });
} else {
  document.querySelectorAll('[data-store-availability-container]').forEach(container => {
    new StoreAvailability(container);
  });
}
