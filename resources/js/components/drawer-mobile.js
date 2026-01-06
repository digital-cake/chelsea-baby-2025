const mobileDrawertoggle = document.querySelector('.section-header__mobile button');
const drawer = document.getElementById('drawer-mobile-content');
const burgerMenuButton = document.querySelector('.section-header__mobile .burger');
const closeMenuButton = document.querySelector('.section-header__mobile .cross');

if (mobileDrawertoggle) {
    mobileDrawertoggle.addEventListener('click', e => {
		e.preventDefault();
		if (document.body.classList.contains('drawer-mobile-open')) {
			window.closeAllDrawers(() => {
			});
		} else {
			window.closeAllDrawers(() => {
				window.openMobileDrawer();
			});
		}
        if (burgerMenuButton) burgerMenuButton.classList.toggle('hide');
        if (closeMenuButton) closeMenuButton.classList.toggle('show');
	});
}

//Calculate menu height
const setMobileMenuDrawerHeight = () => {
	let siteHeaderHeight = 0;
	const windowHeight = window.innerHeight;
	const siteHeaderGroup = Array.from(document.querySelectorAll('.shopify-section-group-header-group'));
	if (siteHeaderGroup) {
		siteHeaderGroup.forEach(section => {
			siteHeaderHeight += section.offsetHeight;
		})
	}
	const mobileMenuDrawerHeight = windowHeight - siteHeaderHeight - 8 + 'px';
	const mobileMenuDrawer = document.querySelector('.drawer-mobile');
	if (mobileMenuDrawer) mobileMenuDrawer.style.maxHeight = mobileMenuDrawerHeight;
	if (window.innerWidth <= 1024 && mobileMenuDrawer) mobileMenuDrawer.style.minHeight = mobileMenuDrawerHeight;
};

document.addEventListener('DOMContentLoaded', setMobileMenuDrawerHeight);
window.addEventListener('resize', setMobileMenuDrawerHeight);