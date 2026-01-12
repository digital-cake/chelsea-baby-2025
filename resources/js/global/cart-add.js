document.addEventListener('submit', (e) => {
  const $cartAddForm = e.target.closest('form[action*="/cart/add"]');

  if (!$cartAddForm) return;
  e.preventDefault();

  const $productOptions = Array.from($cartAddForm.querySelectorAll('select.variant-group-select'));
  const $selectedProductOptions = $productOptions.filter($opt => !!$opt.value);

  if ($selectedProductOptions.length < $productOptions.length) {
    for (const $option of $productOptions) {
      if ($option.value) continue;
      const $errorMessage = $cartAddForm.querySelector(`.variant-error[data-for="${$option.name}"]`);
      if (!$errorMessage) continue;
      $errorMessage.classList.remove('hidden');
      //SCROLL TO VARIANTS
      const variantsContainer = document.querySelector('.section-main-product__content-variants');

      variantsContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
    return;
  }

  const isBalconyProduct = $cartAddForm.dataset.balconyProduct;
  const checkbox = document.getElementById('balcony-disclaimer-checkbox');
  const balconyDisclaimerStatus = checkbox ? checkbox.checked : true;

  if (isBalconyProduct === 'true' && balconyDisclaimerStatus === false) {
    const atcButton = document.getElementById('disclaimer-faux-atc-button');
    const mainAtcButton = document.querySelector('.section-main-product__content-actions .button--add-to-cart');
    const closeModalButton = document.querySelector('.balcony-disclaimer-popup__close');
    
    if (!checkbox || !atcButton || !mainAtcButton) return;
    
    document.body.classList.add('balcony-disclaimer-popup-open');

    checkbox.addEventListener('change', function() { 
      atcButton.disabled = !this.checked;
    });
    
    atcButton.addEventListener('click', function() {
      document.body.classList.remove('balcony-disclaimer-popup-open');
      mainAtcButton.click();
    });

    if (closeModalButton) {
      closeModalButton.addEventListener('click', function() {
          document.body.classList.remove('balcony-disclaimer-popup-open');
      });
    }
    
    return;
  }

  submitForm($cartAddForm);
});

function submitForm($cartAddForm) {
  const formData = new FormData($cartAddForm);
  const requestUrl = `${window.Shopify.routes.root}cart/add.js`;

  fetch(requestUrl, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      return Promise.reject(`Request to ${requestUrl} failed with status ${response.status}`);
    }
    return response.json();
  })
  .then(cartAdd => {
    console.log('cartAdd', cartAdd);
    const url = window.location.pathname;
    if ($cartAddForm.classList.contains('product-form-main') || $cartAddForm.classList.contains('product-form-quick')) {
      window.closeAllDrawers(() => {});
      if (!url.includes('/cart')) {
        window.updateCartDrawer();
        window.countCartItems();
        window.openCartDrawer();
      } else {
        location.reload();
      }
      document.body.classList.remove('card-product-quick-add-modal-open');

      const allActiveModals = document.querySelectorAll('.card-product__quick-add-modal.open');
      allActiveModals.forEach(modal => modal.classList.remove('open'));
    } else {
        if (!url.includes('/cart')) {
          window.updateCartDrawer();
        } else {
          location.reload();
        }
    }
  });
}

window.countCartItems = function () {
	fetch(`${window.Shopify.routes.root}cart.js`)
		.then(response => {
			return response.json();
		})
		.then(cart => {
			let cartItemCount = cart.item_count;
			const cartCounter = document.getElementById('cart-counter');
			if(cartCounter){
				const cartCounterDisplay = cartCounter.querySelector('span');
				if (cartItemCount >= 1) {
					cartCounterDisplay.textContent = cartItemCount;
				} else {
					cartCounterDisplay.textContent = '0';
				}
			}
		});
};

window.addEventListener('DOMContentLoaded', window.countCartItems);

//Handle add to cart and modal 
document.addEventListener('click', function(e) {
	const productCardQuickAdd = e.target.closest('.product-card-quick-add');
	if (!productCardQuickAdd) return;

	let variantId = productCardQuickAdd.dataset.id;
	if (variantId) {
		//add to cart
		const requestUrl = `${window.Shopify.routes.root}cart/add.js`;
		fetch(requestUrl, {
			method: 'POST',
			headers: {
                'Content-type': 'application/json'
            },
			body: JSON.stringify({
				items: [{
					id: variantId,
					quantity: 1
				}]
			})
		})
		.then(response => {
			if (!response.ok) {
				return Promise.reject(response);
			}

			return response.json();
		})
		.then(cartAdd => {
      const url = window.location.pathname;
      console.log('cartAdd', cartAdd);
      if (!url.includes('/cart')) {
        window.updateCartDrawer();
      } else {
        location.reload();
      }
			window.countCartItems();
			window.openCartDrawer();
		});
	} else {
		//open modal
		const allActiveModals = document.querySelectorAll('.card-product__quick-add-modal.open');
		if (allActiveModals) {
			allActiveModals.forEach(modal => modal.classList.remove('open'));
		}
		
		//hide collection floating filter
		const floatingCollectionFilter = document.querySelector('.main-collection-mobile-floating-filter');
		if (floatingCollectionFilter) floatingCollectionFilter.style.display = 'none';

		const productModal = productCardQuickAdd.parentNode.parentNode.querySelector('.card-product__quick-add-modal');
		if (!productModal) return;
		const closeModalButton = productModal.querySelector('#close-quick-add');
		productModal.classList.add('open');
    document.body.classList.add('card-product-quick-add-modal-open');
		closeModalButton.addEventListener('click', function() {
			productModal.classList.remove('open');
      document.body.classList.remove('card-product-quick-add-modal-open');
			if (floatingCollectionFilter) floatingCollectionFilter.style.display = 'block';
		})
	}
})

document.addEventListener('click', function(e) {
	const stickyAdd = e.target.closest('.main-product-sticky-atc');
	if (!stickyAdd) return;
	const productFormMain = document.querySelector('.product-form-main');
	if (!productFormMain) return;
	const mainAtcButton = productFormMain.querySelector('.button--add-to-cart');
	if (mainAtcButton) mainAtcButton.click();
});

window.updateProductMainStickyButton = () => {
	const atcButtonContainerEl = document.querySelector('.section-main-product__content-actions');
	if (!atcButtonContainerEl) return;
	const clone = atcButtonContainerEl.cloneNode(true);

	const stickyModalContainerEl = document.querySelector('.main-product-sticky-add');
	if (!stickyModalContainerEl) return;
	const stickyModalActions = stickyModalContainerEl.querySelector('.main-product-sticky-add__actions');
	stickyModalActions.innerHTML = "";
	stickyModalActions.append(clone);

	//handle visbility 
	const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stickyModalContainerEl.style.display = 'none';
                document.body.classList.remove('show-mobile-quick-add');
            } else {
                stickyModalContainerEl.style.display = 'block';
            }
        });
    }, {
        root: null,
        threshold: 0,
    });

  observer.observe(atcButtonContainerEl);
}
window.updateProductMainStickyButton();