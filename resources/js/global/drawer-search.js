window.openSearchDrawer = function () {
	const documentBody = document.querySelector('body');
	if (documentBody) {
		documentBody.classList.add('drawer-open');
		documentBody.classList.add('drawer-search-open');
		documentBody.classList.add('scroll-lock');
		window.calculatePreSearchHeight();
	}
};

window.calculatePreSearchHeight = () => {
	let windowHeight = Number(window.innerHeight);
	let siteHeader = document.querySelector('.section-header');
	let siteHeaderHeight = Number(siteHeader.offsetHeight);
	let searchInput = document.querySelector('.drawer-search__input');
	let searchInputHeight = Number(searchInput.offsetHeight);
	let searchResultsHeight = windowHeight - siteHeaderHeight - searchInputHeight + 'px';
	let preSearchResultsDisplay = document.querySelector('.pre-search-results');
	preSearchResultsDisplay.style.maxHeight = searchResultsHeight;
	if (window.innerWidth <= 768) preSearchResultsDisplay.style.minHeight = searchResultsHeight;
};

window.addEventListener('resize', function () {
	window.calculatePreSearchHeight();
});

const searchInput = document.getElementById('drawer-search-input');
const searchResults = document.getElementById('predictive-search');
const drawerSearchEl = document.querySelector('.drawer-search');
const announcementBar = document.querySelector('.section-announcement-bar');

const searchDrawerToggles = document.querySelectorAll('#header-search-toggle');
if (searchDrawerToggles) {
	for (const toggle of searchDrawerToggles) {
		toggle.addEventListener('click', e => {
		e.preventDefault();
        // if (drawerSearchEl && announcementBar) {
        //     drawerSearchEl.style.top = announcementBar.offsetHeight + 'px';
        // }
		const documentBody = document.querySelector('body');
		if (documentBody.classList.contains('drawer-search-open')) {
			window.closeAllDrawers(() => {
                if (searchInput) {
                    searchInput.value = '';
                    searchResults.style.display = 'none';
                }
            });
			return;
		} else {
			window.closeAllDrawers(() => {
                window.openSearchDrawer();
                if (searchInput) {
                    searchInput.focus();
                    searchInput.value = '';
                }
            });
		}
	});
	}
}

const searchDrawerClose = document.querySelector('.drawer-search__input--close');
if (searchDrawerClose) {
	searchDrawerClose.addEventListener('click', e => {
		e.preventDefault();
		window.closeAllDrawers(() => {
            if (searchInput) {
                searchInput.value = '';
                searchResults.style.display = 'none';
            }
            const preSearchResults = document.querySelector('.pre-search-results');
            if (preSearchResults) {
				preSearchResults.classList.remove('hidden');
				preSearchResults.style.maxHeight = 0;
			}
        })
	});
}

const searchForm = document.getElementById('searchbox');
if (searchInput && searchForm)
	searchInput.addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			searchForm.submit();
		}
	});

const searchDrawerInputClear = document.querySelector('.drawer-search__input--clear');
if (searchDrawerInputClear) {
	searchDrawerInputClear.addEventListener('click', function(e) {
		e.preventDefault();
		searchInput.value = '';
	})
}
