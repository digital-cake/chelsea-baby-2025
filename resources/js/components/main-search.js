const handle_search_floating_filter_visbility = () => {
    const floatingFilterContainer = document.querySelector('.main-search-floating-filter');
    const sectionSearchProducts = document.querySelector('.section-search__products');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                floatingFilterContainer.style.display = 'block';
            } else {
                floatingFilterContainer.style.display = 'none';
            }
        });
    }, {
        root: null,
        threshold: 0,
    });

    observer.observe(sectionSearchProducts);
}

window.addEventListener('DOMContentLoaded', handle_search_floating_filter_visbility);