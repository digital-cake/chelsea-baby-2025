window.countCartItems = function () {
	fetch('/cart.js')
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