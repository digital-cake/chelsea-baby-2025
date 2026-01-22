document.addEventListener('submit', e => {
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

			const variantsContainer = document.querySelector('.section-main-product__content-variants');
			variantsContainer.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'nearest',
			});
		}
		return;
	}

	if (carSeatBundleData && carSeatBundleData.is_bundle_product) {
		submitBundleForm();
		console.log('BUNDLE');
	} else {
		submitForm($cartAddForm);
		console.log('NORMAL');
	}
});

function submitForm($cartAddForm) {
	const formData = new FormData($cartAddForm);
	const requestUrl = `${window.Shopify.routes.root}cart/add.js`;

	fetch(requestUrl, {
		method: 'POST',
		body: formData,
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
		} else {
			if (!url.includes('/cart')) {
				window.updateCartDrawer();
			} else {
				location.reload();
			}
		}
	});
}

function submitBundleForm() {
	const requestUrl = `${window.Shopify.routes.root}cart/add.js`;

	fetch(requestUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({items: CAR_SEAT_BUNDLE_ITEMS}),
	})
	.then(response => {
		if (!response.ok) {
			return Promise.reject(`Request to ${requestUrl} failed with status ${response.status}`);
		}
		return response.json();
	})
	.then(cartAdd => {
		console.log('cartAdd', cartAdd);
		window.updateCartDrawer();
		window.countCartItems();
		window.openCartDrawer();
	})
	.catch(error => {
		console.error(error);
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
			if (cartCounter) {
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

//Cart Drawer upsell quick add
document.addEventListener('click', function(e) {
	const productUpsellQuickAdd = e.target.closest('.product-upsell-quick-add');
	if (!productUpsellQuickAdd) return;

	let variantId = productUpsellQuickAdd.dataset.id;
	if (variantId) {
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
			console.log('cartAdd', cartAdd);
			window.updateCartDrawer();
		});
	}
});

document.addEventListener('click', function (e) {
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
	stickyModalActions.innerHTML = '';
	stickyModalActions.append(clone);

	//handle visbility
	const observer = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					stickyModalContainerEl.classList.remove('show')
					document.body.classList.remove('show-mobile-quick-add');
				} else {
					stickyModalContainerEl.classList.add('show')
				}
			});
		},
		{
			root: null,
			threshold: 0,
		}
	);

	observer.observe(atcButtonContainerEl);
};
window.updateProductMainStickyButton();

//CAR SEAT BUNDLE LOGIC 

let CAR_SEAT_BUNDLE_ITEMS = [];
let carSeatBundleData = {};

window.handleProductCarSeatBundle = () => {
	const carSeatBundleDataEl = document.querySelector('.product-bundle-car-seats');
	if (!carSeatBundleDataEl) return;
	const mainProductPrice = carSeatBundleDataEl.dataset.mainProductPrice;
	const mainProductId = carSeatBundleDataEl.dataset.mainProductId;
	const isBundleProduct = carSeatBundleDataEl.dataset.isBundleProduct;
	carSeatBundleData = {
		main_product_price: mainProductPrice ? mainProductPrice : 0,
		main_product_id: mainProductId ? mainProductId : 0,
		is_bundle_product: isBundleProduct ? isBundleProduct : false
	};

    const carSeatProducts = document.querySelectorAll('.product-bundle-car-seats__list .card-product-bundle-item');
    if (carSeatProducts.length < 1) return;

    for (const product of carSeatProducts) {
        product.addEventListener('click', function(e) {
            e.preventDefault();

            const productId = this.dataset.id;
            const productPrice = this.dataset.price;

            if (!productId) return;

            const formEl = this.closest('.product-form-main');
            if (!formEl) return;

            const submitButton = formEl.querySelector('.button--add-to-cart');
            if (!submitButton) return;

            const submitButtonLabel = submitButton.querySelector('.button-label');
            const submitButtonPrice = submitButton.querySelector('.button-price');

            carSeatProducts.forEach(product => product.classList.remove('selected'));
            this.classList.add('selected');
            submitButton.disabled = false;
            submitButtonLabel.innerHTML = label_add_to_cart;
            const totalPrice = Shopify.formatMoney(Number(carSeatBundleData.main_product_price) + Number(productPrice), Shopify.money_format);
            submitButtonPrice.innerHTML = totalPrice;
            submitButtonPrice.style.display = "inline-flex";
			window.updateProductMainStickyButton();

            const timeStamp = new Date().toISOString();

            CAR_SEAT_BUNDLE_ITEMS = [
                {
                    id: String(carSeatBundleData.main_product_id),
                    quantity: 1,
                    properties: { _bundle_id: `car_seat_bundle_id_${timeStamp}` }
                }, 
                {
                    id: String(productId),
                    quantity: 1,
                    properties: { _bundle_id: `car_seat_bundle_id_${timeStamp}` }
                }
            ];
        })
    }
};

window.handleProductCarSeatBundleItemColourSwatches = () => {
    document.addEventListener('click', function(e) {
        if (!e.target.classList.contains('swatch-bundle-item')) return;
        e.preventDefault();
        
        const selectedSwatch = e.target;
        const swatchProductHandle = selectedSwatch.dataset.handle;
        const selectedSwatchParent = e.target.closest('.card-product-bundle-item');
        const productBundleList = selectedSwatchParent.closest('.product-bundle-car-seats__list');
        const formEl = selectedSwatchParent.closest('.product-form-main');
        const submitButton = formEl ? formEl.querySelector('.button--add-to-cart') : null;

        if (!swatchProductHandle || !selectedSwatchParent) return;

        const encodedHandle = encodeURIComponent(swatchProductHandle);
        const fetchUrl = `/products/${encodedHandle}?view=bundle-item`;

        if (productBundleList) {
            productBundleList.querySelectorAll('.card-product-bundle-item').forEach(p => p.classList.remove('selected'));
        }
        if (submitButton) {
            submitButton.disabled = true;
            const submitButtonLabel = submitButton.querySelector('.button-label');
            const submitButtonPrice = submitButton.querySelector('.button-price');
            if (submitButtonLabel) submitButtonLabel.innerHTML = label_select_car_seat;
            if (submitButtonPrice) submitButtonPrice.style.display = 'none';
        }

        CAR_SEAT_BUNDLE_ITEMS = [];

        selectedSwatchParent.classList.add('loading');

        fetch(fetchUrl)
            .then(function(response) {
                if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
                return response.text();
            }) 
            .then(function(html) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                const newCardElement = tempDiv.querySelector('.card-product-bundle-item');
                if (newCardElement) {
                    selectedSwatchParent.replaceWith(newCardElement);
                    setTimeout(window.handleProductCarSeatBundle, 100);
                } else {
                    throw new Error('New card element not found in response');
                }
            })
            .catch(function(error) {
                console.error('Error fetching product suggestion:', error);
            })
            .finally(function() {
                selectedSwatchParent.classList.remove('loading');
            });
    });
}

window.addEventListener('DOMContentLoaded', function() {
    window.handleProductCarSeatBundle();
    window.handleProductCarSeatBundleItemColourSwatches();
});
