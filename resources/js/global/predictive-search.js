class PredictiveSearch extends HTMLElement {
	constructor() {
		super();
		this.input = this.querySelector('input[type="search"]');
		this.predictiveSearchResults = this.querySelector('#predictive-search');
		this.preSearchResults = this.querySelector('.pre-search-results');
          console.log('THIS', this);
        console.log('this.input', this.input);
		this.input.addEventListener(
			'input',
			this.debounce(event => {
				this.onChange(event);
			}, 300).bind(this)
		);
	}
	onChange() {
		const searchTerm = this.input.value.trim();
		if (!searchTerm.length) {
			this.close();
			return;
		}
		this.getSearchResults(searchTerm);
	}
	getSearchResults(searchTerm) {
		fetch(`/search/suggest?q=${searchTerm}&resources[type]=product,page,collection,article&resources[limit]=5&resources[limit_scope]=each&section_id=predictive-search`)
			.then(response => {
				if (!response.ok) {
					let error = new Error(response.status);
					this.close();
					throw error;
				}
				return response.text();
			})
			.then(text => {
				const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
				this.predictiveSearchResults.innerHTML = resultsMarkup;
				this.open();
				let predictiveSubmit = document.getElementById('searchbutton');
				let predictiveField = document.getElementById('drawer-search-input');
				if (predictiveSubmit) {
					predictiveSubmit.addEventListener('click', function (e) {
						let searchTerm = predictiveField.value;
						let searchURL = '/search/?q=' + searchTerm + '&type=product';
						window.location = searchURL;
						e.preventDefault();
					});
				}
				window.displayHeight = function () {
					let windowHeight = Number(window.innerHeight);
					let siteHeader = document.querySelector('.section-header');
					let siteAnnouncementBar = document.querySelector('.section-announcement-bar');
					let siteHeaderHeight = Number(siteHeader.offsetHeight);
					let siteAnnoncementHeight = Number(siteAnnouncementBar.offsetHeight);
					let searchInput = document.querySelector('.drawer-search__input');
					let searchInputHeight = Number(searchInput.offsetHeight);
					let searchResultsHeight = windowHeight - siteHeaderHeight - searchInputHeight + 'px';
					let searchResultsDisplay = document.getElementById('predictive-search');
					searchResultsDisplay.style.maxHeight = searchResultsHeight;
					if (window.innerWidth <= 768) searchResultsDisplay.style.minHeight = searchResultsHeight;
					let preSearchResultsDisplay = document.querySelector('.pre-search-results');
					preSearchResultsDisplay.style.maxHeight = searchResultsHeight;
					if (window.innerWidth <= 768) preSearchResultsDisplay.style.minHeight = searchResultsHeight;
				};
				displayHeight();
				window.addEventListener('resize', function () {
					displayHeight();
				});
			})
			.catch(error => {
				this.close();
				throw error;
			});
	}
	open() {
		this.predictiveSearchResults.style.display = 'block';
		this.preSearchResults.classList.add('hidden');
	}
	close() {
		this.predictiveSearchResults.style.display = 'none';
		this.preSearchResults.classList.remove('hidden');
	}
	debounce(fn, wait) {
		let t;
		return (...args) => {
			clearTimeout(t);
			t = setTimeout(() => fn.apply(this, args), wait);
		};
	}
}
customElements.define('predictive-search', PredictiveSearch);