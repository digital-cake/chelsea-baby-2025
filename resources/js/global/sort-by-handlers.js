window.init_handle_collection_sort_by = () => {
    const sortButton = document.querySelector('.collection-sort .button-text');
    const collectionSort = document.querySelector('.collection-sort');
    const sortForm = document.getElementById('sort-form');
    
    if (!sortButton || !collectionSort || !sortForm) return;

    sortButton.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('click');
        collectionSort.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
        if (!sortButton.contains(e.target) && !collectionSort.contains(e.target)) {
            collectionSort.classList.remove('active');
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

window.init_handle_collection_sort_by_mobile = () => {
    const sortButton = document.querySelector('.collection-sort-mobile .button-text');
    const collectionSort = document.querySelector('.collection-sort-mobile');
    const sortForm = document.getElementById('sort-form-mobile');

    if (!sortButton || !collectionSort) return;

    sortButton.addEventListener('click', function (e) {
        e.preventDefault();
        collectionSort.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
        if (!sortButton.contains(e.target) && !collectionSort.contains(e.target)) {
            collectionSort.classList.remove('active');
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