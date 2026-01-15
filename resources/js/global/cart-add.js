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

	if (typeof carSeatBundleData !== 'undefined' && carSeatBundleData.is_bundle_product) {
		submitBundleForm();
	} else {
		submitForm($cartAddForm);
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
					stickyModalContainerEl.style.display = 'none';
					document.body.classList.remove('show-mobile-quick-add');
				} else {
					stickyModalContainerEl.style.display = 'block';
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

	//switch card colour variant on click of swatches, disable swatch link

let CAR_SEAT_BUNDLE_ITEMS = [];

const handleProductCarSeatBundle = () => {
	if (typeof carSeatBundleData == 'undefined') return; //Generated in liquid within the if statement

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
			submitButtonPrice.innerHTML = totalPrice
			submitButtonPrice.style.display = "inline-flex";

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

window.addEventListener('DOMContentLoaded', handleProductCarSeatBundle);
