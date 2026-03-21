//QUICK ADD DRAWER
document.addEventListener('click', function (e) {
    const quickAddBtn = e.target.closest('#quick-add');

    if (!quickAddBtn) return;

    const productHandle = quickAddBtn.dataset.productHandle;
    const quickAddContentEl = document.querySelector('.drawer-quick-add__content');
    const quickAddImagestEl = document.querySelector('.drawer-quick-add__images');

    if (!productHandle) return;

    if (document.body.classList.contains('drawer-quick-add-open')) {
        window.closeAllDrawers(() => {});
    } else {
        window.closeAllDrawers(() => {
            window.openQuickAddDrawer(productHandle);
        });
    }

    fetch(window.Shopify.routes.root + 'products/' + productHandle)
        .then(response => {
            return response.text();
        })
        .then(html => {
            let productDetails = '';
            let productMedia = '';
            if (html.indexOf('<!--[product-details]-->') > 0) {
                productDetails = html.split('<!--[product-details]-->').pop().split('<!--[/product-details]-->')[0];
            }
            if (html.indexOf('<!--[product-media]-->') > 0) {
                productMedia = html.split('<!--[product-media]-->').pop().split('<!--[/product-media]-->')[0];
            }
            quickAddContentEl.innerHTML = productDetails;
            quickAddImagestEl.innerHTML = productMedia;

            const klaviyoOOSButton = quickAddContentEl.querySelector('.klaviyo-bis-trigger');

            if (klaviyoOOSButton) {
                klaviyoOOSButton.href = window.Shopify.routes.root + 'products/' + productHandle;
            }
        })
        .finally(() => {
            window.initProductAddToWishlist();
            window.handle_product_read_more_button();

            const productMediaEl = document.querySelector('.drawer-quick-add .section-main-product__media');
	        if (productMediaEl) window.init_product_media(productMediaEl);

         	const drawerQuickAddEl = document.querySelector('.drawer-quick-add');
			if (drawerQuickAddEl) window.init_product_media(drawerQuickAddEl);

            const drawerCloseButton = document.querySelector('.drawer-quick-add .drawer-close');
            if (drawerCloseButton) {
                drawerCloseButton.addEventListener('click', e => {
                    e.preventDefault();
                    window.closeAllDrawers(() => {
                        return;
                    });
                });
            }
        })
        .catch(error => {
            console.error(error);
        });
    
});

window.handle_product_read_more_button = () => {
  const toggle = document.getElementById('product-description-toggle');
  const descriptionAccordion = document.querySelector('.accordion-toggle--description');
  const header = document.querySelector('.section-header');
  const announcementBar = document.querySelector('.section-announcement-bar');

  if (!toggle || !descriptionAccordion) return;

  toggle.addEventListener('click', function (e) {
    e.preventDefault();

    const productUrl = toggle.dataset.productUrl;
    if (!productUrl) return;

    if (!window.location.pathname.includes('/products/')) {
      window.location.href = window.Shopify.routes.root + 'products/' + productUrl;
      return;
    }

    descriptionAccordion.click();

    setTimeout(() => {
      const targetRect = descriptionAccordion.getBoundingClientRect();
      const headerHeight = header?.offsetHeight || 0;
      const announcementBarHeight = announcementBar?.offsetHeight || 0;
      const totalOffsetHeight = headerHeight + announcementBarHeight;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const newScrollTop = scrollTop + targetRect.top - totalOffsetHeight;

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      
      if (isIOS) {
        window.scrollTo(0, Math.max(0, newScrollTop));
      } else {
        window.scrollTo({
          top: Math.max(0, newScrollTop),
          behavior: 'smooth'
        });
      }
    }, 350);
  });
};

window.addEventListener('DOMContentLoaded', window.handle_product_read_more_button);

