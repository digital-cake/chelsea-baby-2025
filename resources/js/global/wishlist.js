window.initProductAddToWishlist = () => { 
	const addToWishlistButtons = document.querySelectorAll('.wishlist-toggle');
	if (addToWishlistButtons)
		for (const button of addToWishlistButtons) {
			if (button.classList.contains('initialized')) continue;
			button.addEventListener('click', e => {
				e.preventDefault();
				if (button.classList.contains('active')) {
					const thisProduct = button.dataset.id;
                    console.log('thisProduct', thisProduct);
					window.wishlistProductAddOrRemove(thisProduct)
					.then(data => {
						if (data.result === 'ADDED') {
							button.classList.add('added');
                            console.log('Product added to wishlist');
						} else {
							button.classList.remove('added');
                            console.log('Product removed from wishlist');
						}
					});
				} else {
					window.location = window.Shopify.routes.root + 'pages/wishlist';
				}
			});
			button.classList.add('initialized');
		}
};

window.wishlistProductAddOrRemove = async (productId) => {

	let response = await fetch('https://chelsea-baby-wishlist-app.long-truth-eb2b.workers.dev/public/api/wishlist/add-or-remove', {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'X-Cake-Customer-Wishlist-Token': cake.customer_api_token,
		},
		body: JSON.stringify({
			customer_id: cake.customer_id,
			shop: Shopify.shop,
			product_id: productId,
		}),
	});

	const data = await response.json();

	return data;
}

addEventListener('DOMContentLoaded', function() {
	window.initProductAddToWishlist();
});