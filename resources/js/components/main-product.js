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