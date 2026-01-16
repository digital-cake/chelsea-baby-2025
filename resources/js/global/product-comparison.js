const productCardPlaceholderEl = (i) =>`
	<div class="product-card-placeholder">
		<div class="product-card-placeholder__inner">
			<div class="product-card-placeholder__count">${i}</div>
		</div>
		<button onclick="window.history.back();" type="button" class="button button--full-width product-card-placeholder__button"><span>${product_card_placeholder_button_text}</span></button>
	</div>
`;

const productSpecPlaceholderEl = () =>`
	<div class="section-product-comparison__table-column">
		<div class="section-product-comparison__table-row">-</div>
		<div class="section-product-comparison__table-row">-</div>
		<div class="section-product-comparison__table-row">-</div>
		<div class="section-product-comparison__table-row">-</div>
		<div class="section-product-comparison__table-row">-</div>
		<div class="section-product-comparison__table-row">-</div>
		<div class="section-product-comparison__table-row">-</div>
		<div class="section-product-comparison__table-row">-</div>
		<div class="section-product-comparison__table-row">-</div>
	</div>
`;

const comparisonProductsData = localStorage.getItem('cake_comparison_products_CB');
let comparisonProductHandlesArray = comparisonProductsData ? JSON.parse(comparisonProductsData) : [];

const store_comparison_products = () => {
    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('product-comparison-toggle')) return;
        const productHandle = e.target.dataset.productHandle;
        if (!productHandle) return;

		const productHandles = new Set(comparisonProductHandlesArray);

		if (productHandles.has(productHandle)) {
			return;
		}
		
		if (comparisonProductHandlesArray.length >= 3) {
			alert('Product comparison full, please remove a product');
		} else {
			comparisonProductHandlesArray.push(productHandle);
			update_comparison_counter();
		}

		try {
			localStorage.setItem(`cake_comparison_products_CB`, JSON.stringify(comparisonProductHandlesArray));
		} catch (e) {
			console.error('Failed to save comparison products', e);
		}

    });
}

const update_comparison_counter = () => {
	const comparisonCounters = document.querySelectorAll('#comparison-count');
	const floatingComparisonBar = document.querySelector('.floating-product-comparison-counter');

	if (!comparisonCounters) return;

	if (comparisonProductHandlesArray.length === 0) {
		if (floatingComparisonBar) floatingComparisonBar.style.display = 'none';
	} else {
		if (floatingComparisonBar) floatingComparisonBar.style.display = 'flex';
	}

	if (comparisonCounters.length < 1 || comparisonProductHandlesArray.length < 1) return;

	for (const counter of comparisonCounters) {
		counter.textContent = `${comparisonProductHandlesArray.length}/3`;
	}
}

const render_product_card_placeholders = (placeholderCardsToRender) => {
  const productCardsContainerEl = document.querySelector('.section-product-comparison__cards');
  if (!productCardsContainerEl) return;

  const currentCount = comparisonProductHandlesArray.length;

  for (let i = 0; i < placeholderCardsToRender; i++) {
    productCardsContainerEl.insertAdjacentHTML('beforeend',productCardPlaceholderEl(currentCount + i + 1).trim());
  }
};


const render_product_column_placeholders = (placeholderColumnsToRender) => {
	const productSpecsTableColumnEl = document.querySelector('.section-product-comparison__table-columns');
	if (!productSpecsTableColumnEl) return;

	for (let i = 0; i < placeholderColumnsToRender; i++) {
		productSpecsTableColumnEl.insertAdjacentHTML('beforeend', productSpecPlaceholderEl().trim());
	}
}

const render_product_comparison_items = async () => {

  const productCardsContainerEl = document.querySelector('.section-product-comparison__cards');
  const productSpecsTableColumnEl = document.querySelector('.section-product-comparison__table-columns');
  if (!productCardsContainerEl || !productSpecsTableColumnEl) return;

  productCardsContainerEl.innerHTML = "";
  productSpecsTableColumnEl.innerHTML = "";

  for (const handle of comparisonProductHandlesArray) {
    try {
      const [cardResponse, specsResponse] = await Promise.all([
        fetch(`/products/${handle}?view=card`),
        fetch(`/products/${handle}?view=specs`)
      ]);

      if (!cardResponse.ok || !specsResponse.ok) {
        throw new Error(`Failed to fetch view for ${handle}`);
      }

      const [cardHTML, specsHTML] = await Promise.all([
        cardResponse.text(),
        specsResponse.text()
      ]);

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('card-product__wrapper');
      cardWrapper.innerHTML = cardHTML;
      productCardsContainerEl.appendChild(cardWrapper);

      productSpecsTableColumnEl.insertAdjacentHTML('beforeend', specsHTML);

    } catch (error) {
      console.error(`Error fetching product data for ${handle}:`, error);
    }
  }

  const missingCount = 3 - comparisonProductHandlesArray.length;
  if (missingCount > 0) {
    render_product_card_placeholders(missingCount);
    render_product_column_placeholders(missingCount);
  }
};

const handle_remove_product = () => {
	document.addEventListener('click', (e) => {
		const removeBtn = e.target.closest('.card-product__compare-remove');
		if (!removeBtn) return;

		const productHandle = removeBtn.dataset.productHandle;
		if (!productHandle) return;

		const index = comparisonProductHandlesArray.indexOf(productHandle);

		if (index !== -1) {
			comparisonProductHandlesArray.splice(index, 1);
			localStorage.setItem("cake_comparison_products_CB",JSON.stringify(comparisonProductHandlesArray));
			render_product_comparison_items();
			update_comparison_counter();
		}
	});
};

window.addEventListener('DOMContentLoaded', function() {
    store_comparison_products();
	render_product_comparison_items();
	handle_remove_product();
	update_comparison_counter();
});