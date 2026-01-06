const filtersDrawerToggles = document.querySelectorAll('.drawer-filters-toggle');
if (filtersDrawerToggles)
	for (const toggle of filtersDrawerToggles)
		toggle.addEventListener('click', e => {
			e.preventDefault();
			if (document.body.classList.contains('drawer-filters-open')) {
				window.closeAllDrawers(() => {});
			} else {
				window.closeAllDrawers(() => {
					window.openFiltersDrawer();
				});
			}
		});
