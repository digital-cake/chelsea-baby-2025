window.open_collection_header_description_drawer = function () {
	document.body.classList.add('drawer-open');
	document.body.classList.add('drawer-collection-header-description-open');
	document.body.classList.add('scroll-lock');
};

window.init_collection_header_description_drawer = () => {
    const drawerToggle = document.querySelector('.show-collection-content');
    if (!drawerToggle) return;

    drawerToggle.addEventListener('click', e => {
		e.preventDefault();
		if (document.body.classList.contains('drawer-collection-header-description-open')) {
			window.closeAllDrawers(() => {});
			return;
		} else {
			window.closeAllDrawers(() => {});
			window.open_collection_header_description_drawer();
		}
    });
}