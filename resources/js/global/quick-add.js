//QUICK ADD DRAWER
document.addEventListener('click', function (e) {
    const quickAddBtn = e.target.closest('#quick-add');

    if (!quickAddBtn) return;

    const productHandle = quickAddBtn.dataset.productHandle;
    const fromWishlist = quickAddBtn.dataset.fromWishlist == 'true';
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
            //window.initProductAddToWishlist();

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