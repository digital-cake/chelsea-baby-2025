window.init_product_media = root => {
	const images = root.querySelectorAll('.main-product-media__image, .main-product-media__video');
	const prevBtn = root.querySelector('.navigation-button.prev');
	const nextBtn = root.querySelector('.navigation-button.next');

	if (images.length && prevBtn && nextBtn) {
		function isMobile() {
			return window.innerWidth <= 768;
		}

		function groupImages(images) {
			const rows = [];
			let i = 0;
			let isEvenRow = true; // Start with 2-image row

			if (isMobile()) {
				while (i < images.length) {
					rows.push([images[i]]);
					i += 1;
				}
			} else {
				while (i < images.length) {
					if (isEvenRow) {
						if (i + 1 < images.length) {
							rows.push([images[i], images[i + 1]]);
							i += 2;
						} else {
							rows.push([images[i]]);
							i += 1;
						}
					} else {
						rows.push([images[i]]);
						i += 1;
					}
					isEvenRow = !isEvenRow;
				}
			}

			return rows;
		}

		let rows = groupImages(Array.from(images));
		let currentRow = 0;

		rows.forEach((row, idx) => {
			if (!isMobile() && row.length === 1) {
				row[0].classList.add('full-span');
				row[0].querySelector('img').classList.remove('zoomable-image');
			}
		});

		function scrollToRow(rowIdx) {
			const el = rows[rowIdx][0];
			const scrollContainer = root.querySelector('.main-product-media');

			if (scrollContainer && el) {
				if (isMobile()) {
					// Horizontal scroll on mobile
					scrollContainer.scrollTo({
						left: el.offsetLeft,
						behavior: 'smooth',
					});
				} else {
					// Vertical scroll on desktop
					const containerRect = scrollContainer.getBoundingClientRect();
					const elRect = el.getBoundingClientRect();

					const offset = elRect.top - containerRect.top + scrollContainer.scrollTop;

					scrollContainer.scrollTo({
						top: offset,
						behavior: 'smooth',
					});
				}
			}

			currentRow = rowIdx;
		}

		prevBtn.addEventListener('click', () => {
			if (currentRow > 0) scrollToRow(currentRow - 1);
		});
		nextBtn.addEventListener('click', () => {
			if (currentRow < rows.length - 1) scrollToRow(currentRow + 1);
		});

		if (!isMobile()) {
			const scrollContainer = document.querySelector('.main-product-media');

			if (scrollContainer) {
				scrollContainer.addEventListener('scroll', () => {
					const containerRect = scrollContainer.getBoundingClientRect();
					const containerCenterY = containerRect.top + containerRect.height / 2;

					let closestRow = 0;
					let minDistance = Infinity;

					rows.forEach((row, idx) => {
						if (row.length > 0) {
							const el = row[0];
							const elRect = el.getBoundingClientRect();
							const elCenterY = elRect.top + elRect.height / 2;
							const distance = Math.abs(containerCenterY - elCenterY);
							if (distance < minDistance) {
								minDistance = distance;
								closestRow = idx;
							}
						}
					});

					if (closestRow !== currentRow) {
						currentRow = closestRow;
					}
				});
			}
		}

		if (isMobile()) {
			const scrollContainer = root.querySelector('.main-product-media');

			if (scrollContainer) {
				scrollContainer.addEventListener('scroll', () => {
					const containerRect = scrollContainer.getBoundingClientRect();
					const containerCenterX = containerRect.left + containerRect.width / 2;

					let closestIndex = 0;
					let minDistance = Infinity;

					Array.from(images).forEach((imgEl, idx) => {
						const elRect = imgEl.getBoundingClientRect();
						const elCenterX = elRect.left + elRect.width / 2;
						const distance = Math.abs(containerCenterX - elCenterX);
						if (distance < minDistance) {
							minDistance = distance;
							closestIndex = idx;
						}
					});

					if (closestIndex !== currentRow) {
						currentRow = closestIndex;
					}
				});
			}
		}

		window.addEventListener('resize', () => {
			rows = groupImages(Array.from(images));
			if (currentRow >= rows.length) {
				currentRow = rows.length - 1;
			}
		});
	}
};

window.addEventListener('DOMContentLoaded', function () {
	const productMediaEl = document.querySelector('.section-main-product__media');
	if (productMediaEl) window.init_product_media(productMediaEl);
});
