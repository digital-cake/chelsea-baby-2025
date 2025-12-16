const handleRecentlyViewedProducts = () => {
	const MAX_RECENT_ITEMS = 10;

	if (window.location.href.indexOf('/products/') != -1) {
		const productHandle = window.cake_product_handle;

		if (!productHandle) return;

		const recentlyViewedData = localStorage.getItem('cake_recently_viewed_products_CB');
		let recentlyViewedArray = recentlyViewedData ? JSON.parse(recentlyViewedData) : [];

		const productHandles = new Set(recentlyViewedArray);

		if (productHandles.has(productHandle)) {
			return;
		}
		if (recentlyViewedArray.length >= MAX_RECENT_ITEMS) {
			recentlyViewedArray.shift();
		}

		recentlyViewedArray.push(productHandle);

		try {
			localStorage.setItem(`cake_recently_viewed_products_CB`, JSON.stringify(recentlyViewedArray));
		} catch (e) {
			console.error('Failed to save recently viewed products', e);
		}
	}
};

window.addEventListener('DOMContentLoaded', handleRecentlyViewedProducts);