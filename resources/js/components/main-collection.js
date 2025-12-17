const handle_floating_filter_visbility = () => {
    const floatingFilterContainer = document.querySelector('.main-collection-floating-filter');
    const sectionCollectionProducts = document.querySelector('.section-collection__products');

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

    observer.observe(sectionCollectionProducts);
}

window.addEventListener('DOMContentLoaded', handle_floating_filter_visbility);