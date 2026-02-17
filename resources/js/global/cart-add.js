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

	submitForm($cartAddForm);
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
