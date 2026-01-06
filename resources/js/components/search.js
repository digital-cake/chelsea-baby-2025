window.init_handle_search_sort_by = () => {
    const sortButton = document.querySelector('.search-sort .button-text');
    const searchSort = document.querySelector('.search-sort');
    const sortForm = document.getElementById('sort-form');

    if (!sortButton || !searchSort || !sortForm) return;

    sortButton.addEventListener('click', function (e) {
        e.preventDefault();
        searchSort.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
        if (!sortButton.contains(e.target) && !searchSort.contains(e.target)) {
            searchSort.classList.remove('active');
        }
    });

    sortForm.addEventListener('change', function(e) {
        if (e.target.name === 'sort_by') {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('sort_by', e.target.value);
            window.location.search = urlParams.toString();
        }
    });
};

window.init_handle_search_sort_by_mobile = () => {
    const sortButton = document.querySelector('.search-sort-mobile .button-text');
    const searchSort = document.querySelector('.search-sort-mobile');
    const sortForm = document.getElementById('sort-form-mobile');

    if (!sortButton || !searchSort || !sortForm) return;

        sortButton.addEventListener('click', function (e) {
        e.preventDefault();
        searchSort.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
        if (!sortButton.contains(e.target) && !searchSort.contains(e.target)) {
            searchSort.classList.remove('active');
        }
    });

    sortForm.addEventListener('change', function(e) {
        if (e.target.name === 'sort_by') {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('sort_by', e.target.value);
            window.location.search = urlParams.toString();
        }
    });
}

const handle_search_floating_filter_visbility = () => {
    const floatingFilterContainer = document.querySelector('.main-search-mobile-floating-filter');
    if (!floatingFilterContainer) return;
    const filterButton = document.querySelector('.drawer-filters-toggle');
    const floatingFilterButton = floatingFilterContainer.querySelector('button');
    const footerGroup = document.querySelector('.shopify-section-group-footer-group');
    if (!filterButton || !floatingFilterButton) return;

    if (window.innerWidth <= 876) {
        floatingFilterContainer.style.display = 'block';
    } else {
        floatingFilterContainer.style.display = 'none';
    }

    floatingFilterButton.addEventListener('click', function(){
        filterButton.click();
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                floatingFilterContainer.style.display = 'none';
                document.body.classList.remove('show-mobile-quick-add');
            } else {
                floatingFilterContainer.style.display = 'block';
            }
        });
    }, {
        root: null,
        threshold: 0,
    });

    if (window.innerWidth <= 876) {
        observer.observe(filterButton);
        //observer.observe(footerGroup);
    }
}

window.addEventListener('DOMContentLoaded', handle_search_floating_filter_visbility);
window.addEventListener('resize', handle_search_floating_filter_visbility);