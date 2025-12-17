window.closeAllDrawers = _callback => {
	const documentBody = document.querySelector('body');
	const bodyClasses = documentBody.className.split(' ');
	documentBody.classList.remove('scroll-lock');
	bodyClasses.forEach(bodyClass => {
		if (bodyClass.match('drawer-open') || bodyClass.match('drawer-search-open') || bodyClass.match('drawer-cart-open') || bodyClass.match('drawer-filters-open') || bodyClass.match('drawer-collection-header-description-open')) {
			documentBody.classList.remove(bodyClass);
			documentBody.classList.remove('scroll-lock');
		}
	});
	window.setTimeout(() => {
		_callback();
	}, 250);
};

const overlayMask = document.getElementById('overlay-mask');
if (overlayMask) overlayMask.addEventListener('click', function() {
	window.closeAllDrawers(()=>{});
});

const cartDrawer = document.getElementById('drawer-cart');
if (cartDrawer) cartDrawer.addEventListener('click', function(e) {
    if (e.target.closest('.cart-recommendations') || e.target.closest('.drawer-cart__inner')) return;
    window.closeAllDrawers(()=>{});
});

window.openCartDrawer = () => {
	const documentBody = document.querySelector('body');
	if (documentBody.classList.contains('drawer-open')) {
		window.closeAllDrawers(() => {
			documentBody.classList.add('drawer-open', 'drawer-cart-open');
			window.setTimeout(() => {
				documentBody.classList.add('scroll-lock');
			}, 125);
		});
	} else {
		documentBody.classList.add('drawer-open', 'drawer-cart-open');
		window.setTimeout(() => {
			documentBody.classList.add('scroll-lock');
		}, 125);
	}
};

window.openFiltersDrawer = () => {
	const documentBody = document.querySelector('body');
	if (documentBody.classList.contains('drawer-filters-open')) {
		window.closeAllDrawers(() => {
			documentBody.classList.add('drawer-filters-open');
			window.setTimeout(() => {
				documentBody.classList.add('scroll-lock');
			}, 125);
		});
	} else {
		documentBody.classList.add('drawer-filters-open');
		window.setTimeout(() => {
			documentBody.classList.add('scroll-lock');
		}, 125);
	}
	document.dispatchEvent(new CustomEvent('FilterDrawerOpened'));
};

const drawerCloseButtons = document.querySelectorAll('.drawer-close');
if (drawerCloseButtons)
	for (const button of drawerCloseButtons)
		button.addEventListener('click', e => {
			e.preventDefault();
			window.closeAllDrawers(() => {
				return;
			});
		});

window.openMobileDrawer = () => {
	const documentBody = document.querySelector('body');
	if (documentBody.classList.contains('drawer-open')) {
		window.closeAllDrawers(() => {
			documentBody.classList.add('drawer-menu-open', 'drawer-mobile-open');
		});
	} else {
		documentBody.classList.add('drawer-menu-open', 'drawer-mobile-open');
	}
};