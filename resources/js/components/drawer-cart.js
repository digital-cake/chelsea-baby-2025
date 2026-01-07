const cartDrawerButton = document.querySelector('.section-header__actions-cart button');
console.log('cartDrawerButton', cartDrawerButton);
if (cartDrawerButton)
	cartDrawerButton.addEventListener('click', e => {
console.log('click', e.target)
		e.preventDefault();
		if (document.body.classList.contains('drawer-cart-open')) {
			window.closeAllDrawers(() => {});
		} else {
			window.closeAllDrawers(() => {
				window.updateCartDrawer();
				window.openCartDrawer();
				window.countCartItems();
			});
		}
	});

const updateDrawerQuantity = input => {
	const quantity = input.value;
	const product_id = input.dataset.id;
	const data = { updates: {} };
	data.updates[product_id] = quantity;
	fetch(window.Shopify.routes.root + 'cart/update.js', {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then(response => response.json())
		.then(() => {
			window.updateCartDrawer();
			window.countCartItems();
		})
		.catch(err => {
			console.log(err);
		});
};

const initCartDrawerQuantity = () => {
	const cartDrawerContent = document.getElementById('drawer-cart-content');
	const quantityElements = cartDrawerContent.querySelectorAll('.cart-quantity');
	if (quantityElements)
		for (let i = 0; i < quantityElements.length; i++) {
			const input = quantityElements[i].querySelector('input');
			let current_val = input.value;
			const incrementors = quantityElements[i].querySelectorAll('.increment');
			for (let i = 0; i < incrementors.length; i++) {
				incrementors[i].addEventListener('click', e => {
					e.preventDefault();
					if (incrementors[i].classList.contains('down')) {
						if (current_val <= 0) return;
						current_val--;
					}
					if (incrementors[i].classList.contains('up')) {
						current_val++;
					}
					input.setAttribute('value', current_val);
					updateDrawerQuantity(input);
					window.countCartItems();
				});
			}
		}
	const quantityInputs = cartDrawerContent.querySelectorAll('input');
	if (quantityInputs)
		for (const input of quantityInputs)
			input.addEventListener('keyup', () => {
				clearTimeout(window.inputDelay);
				window.inputDelay = setTimeout(() => {
					updateDrawerQuantity(input);
					window.countCartItems();
				}, 500);
			});
};

const initCartDrawerRemove = () => {
	const cartDrawerContent = document.getElementById('drawer-cart-content');
	const cartDrawerRemoveButtons = cartDrawerContent.querySelectorAll('.remove');
	if (cartDrawerRemoveButtons)
		for (const button of cartDrawerRemoveButtons)
			button.addEventListener('click', e => {
				e.preventDefault();
				const current_id = button.dataset.product;
				const current_val = 0;
				const data = { updates: {} };
				data.updates[current_id] = current_val;
				fetch(window.Shopify.routes.root + 'cart/update.js', {
					method: 'POST',
					headers: {
						'Content-type': 'application/json',
					},
					body: JSON.stringify(data),
				})
					.then(response => response.json())
					.finally(() => {
						window.updateCartDrawer();
						window.countCartItems();
					})
					.catch(err => {
						console.log(err);
					});
			});
};

window.updateCartDrawer = () => {
	let cartEmpty = true;
	const cartDrawerContent = document.getElementById('drawer-cart-content');
	const cartContent = cartDrawerContent.querySelector('.cart-items');
	cartContent.innerHTML = '';
	const cartDrawerTotals = document.getElementById('drawer-cart-totals');
	const cartDrawerFooter = document.getElementById('drawer-cart-footer');
	cartDrawerContent.classList.add('content-loading');
	fetch(window.Shopify.routes.root + 'cart')
		.then(response => {
			return response.text();
		})
		.then(html => {
			let cartItems = '';
			let cartTotal = '';
			if (html.indexOf('<!--[cart-empty]-->') > 0) {
				cartItems = html.split('<!--[cart-empty]-->').pop().split('<!--[/cart-empty]-->')[0];
				cartTotal = '';
			} else {
				cartItems = html.split('<!--[cart-items]-->').pop().split('<!--[/cart-items]-->')[0];
				cartTotal = html.split('<!--[cart-total]-->').pop().split('<!--[/cart-total]-->')[0];
				cartEmpty = false;
			}
			cartContent.innerHTML = cartItems;
			cartDrawerTotals.innerHTML = cartTotal;
		})
		.finally(() => {
			if (cartEmpty === true) {
				cartDrawerFooter.classList.add('hide-content');
			} else {
				cartDrawerFooter.classList.remove('hide-content');
			}
			window.checkThreshold();
            initCartDrawerQuantity();
			initCartDrawerRemove();
			setTimeout(() => {
				cartDrawerContent.classList.remove('content-loading');
			}, 200);
		})
		.catch(error => {
			console.error(error);
		});
};

const handle_drawer_upsells = () => {
	const upsellsEl = document.querySelector('.cart-drawer-upsells');
	if (!upsellsEl) return;
	const toggle = upsellsEl.querySelector('.cart-drawer-upsells__title');
	toggle.addEventListener('click', function() {
		upsellsEl.classList.toggle('collapsed');
	});
};
handle_drawer_upsells();