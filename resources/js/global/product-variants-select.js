/*
* Written by T.
* Using methods described here: https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products
* Altered slightly as Shopify's described implementation assumes first available variant pre selection.
*
* The implementation below supports Shopify's new 2048 variant limit where previous
* implementations would only allow 250 (Liquid enforced limit on product.variants)
*/

document.addEventListener('change', (e) => {
	const $selector = e.target.closest('select.variant-group-select[data-option-position]');

	if (!$selector) return;

	handleOptionSelectionChange($selector);
});

let originalPrice = null;

async function handleOptionSelectionChange($selector) {

	const $parent = $selector.closest('form[action*="/cart/add"]');
	const $siblingSelectors = Array.from($parent.querySelectorAll('select.variant-group-select[data-option-position]'));
	const $errorMessages = Array.from($parent.querySelectorAll('.variant-error[data-for]'))
	const $variantIdInput = $parent.querySelector('input[name="id"]');

	const currentOptionPosition = parseInt($selector.dataset.optionPosition);
	const nextOptionPosition = currentOptionPosition + 1;
	const productHandle = $selector.dataset.productHandle;

	let $nextSelect = null;
	let selectedOptions = [];

	for (const $errMessage of $errorMessages) {
		$errMessage.classList.add('hidden');
	}

	for (const $s of $siblingSelectors) {
		const positon = parseInt($s.dataset.optionPosition);

		if (positon > currentOptionPosition) {
			$s.value = "";
			$s.disabled = true;
		}

		if ($s.value) {
			selectedOptions.push($s.value);
		}


		if (positon == nextOptionPosition) {
			$nextSelect = $s;
		}
	}

	const queryParams = new URLSearchParams();

	queryParams.append('sections', 'product-options');

	if (selectedOptions.length > 0) {
		queryParams.append('option_values', selectedOptions.join(','));
	}

	let response = null;

	try {
		response = await fetch(`${window.Shopify.routes.root}products/${productHandle}?${queryParams.toString()}`);
	} catch (err) {
		console.error(err);
		return;
	}

	if (!response.ok) {
		console.error(`Product Option request failed with status ${response.status}`);
		return;
	}

	response = await response.json();

	const $productOptionsResponseRoot = new DOMParser().parseFromString(response['product-options'], 'text/html');

	if ($nextSelect) {
		$nextSelect.innerHTML = $productOptionsResponseRoot.querySelector(`select[name="${$nextSelect.name}"]`).innerHTML;
		$nextSelect.disabled = false;
	}

	$variantIdInput.value = $productOptionsResponseRoot.querySelector('input[name="id"]').value;

	const variant = JSON.parse($productOptionsResponseRoot.getElementById('variantjson').innerText);
	let variantPreorderEl = $productOptionsResponseRoot?.getElementById('variantjsonpreorder');
	let variantPreorder = null;
	if (variantPreorderEl) {
		variantPreorder = JSON.parse(variantPreorderEl.innerText);
	}

	if (window.location.pathname.includes(productHandle)) {
		window.history.pushState({}, null, `?variant=${variant.id}`);
	}

	document.dispatchEvent(new CustomEvent('variantSelected', { detail: {
		variant: variant,
	} }));

	const $button = $parent.querySelector('.button--add-to-cart');
	const $klaviyoButton = document.querySelector('.klaviyo-bis-trigger');

	if ($button) {
		const $buttonLabel = $button.querySelector('.button-label');
		const $buttonPrice = $button.querySelector('.button-price');

		if (selectedOptions.length < $siblingSelectors.length) {
			$button.disabled = true;
			$buttonLabel.innerText = label_choose_options;
			window.updateProductMainStickyButton();
			return;
		} else if (variant.available) {
			$button.style.display = 'flex';
			$button.classList.add('button--transactional');
			$button.disabled = false;
			if($klaviyoButton) $klaviyoButton.style.display = 'none';
			if (variantPreorder) {
				$buttonLabel.innerHTML = label_preorder;
				const preorderInput = document.createElement('input');
				preorderInput.id = 'preorder';
				preorderInput.setAttribute('name', 'properties[_preorder]');
				preorderInput.type = 'hidden';
				preorderInput.value = true;
				$button.closest('form').append(preorderInput);
				if($klaviyoButton) $klaviyoButton.style.display = 'none';
			} else {
				$buttonLabel.innerHTML = label_add_to_cart;
				if($klaviyoButton) $klaviyoButton.style.display = 'none';
				const predorderInput = $button.closest('form').querySelector('input#preorder');
				if (predorderInput) predorderInput.remove();
			}
			$buttonPrice.style.display = 'block';
			window.updateProductMainStickyButton();
		} else {
			$button.style.display = 'none';
			if($klaviyoButton) $klaviyoButton.style.display = 'flex';
			$button.disabled = true;
			$buttonLabel.innerHTML = label_sold_out;
			window.updateProductMainStickyButton();
		}
	}

	const compareAtPrice = variant.compare_at_price && variant.compare_at_price > variant.price ? variant.compare_at_price : 0;

	const $priceDisplays = $parent.querySelectorAll('.product-price-display, .product-price-compare, .button-price');

	const newPrice = Shopify.formatMoney(variant.price, Shopify.money_format);
	const newCompareAtPrice = compareAtPrice ? Shopify.formatMoney(variant.compare_at_price, Shopify.money_format) : null;

	for (const $priceDisplay of $priceDisplays) {

		const $innerTypeSpan = $priceDisplay.querySelector('span.type');

		const additionalHtml = $innerTypeSpan ? $innerTypeSpan.outerHTML : "";

		if ($priceDisplay.classList.contains('product-price-compare') && newCompareAtPrice) {
			$priceDisplay.innerHTML = newCompareAtPrice + additionalHtml;
			$priceDisplay.dataset.price = compareAtPrice;
			continue;
		}

		$priceDisplay.innerHTML = newPrice + additionalHtml;
		$priceDisplay.dataset.price = variant.price;

	}

}