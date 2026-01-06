let FilterFormMobile = document.getElementById('filter-form-mobile');

const renderFilterDrawer = async (formdata) => {
    if (!formdata) {
        formdata = new FormData();
    }

    const searchParams = window.location.search.includes('q=') ? new URLSearchParams(window.location.search) : null;

    if (searchParams) {
        formdata.append('q', searchParams.get('q'));
    }

    if (!formdata.has('filter.v.availability')) {
        formdata.append('filter.v.availability', '1');
    }

    formdata.append('sections', 'drawer-filters');

    let urlParams = new URLSearchParams(formdata);

    console.log(`${window.location.pathname}?${urlParams.toString()}`);

    let response = await fetch(`${window.location.pathname}?${urlParams.toString()}`);
    response = await response.json();

    const newSectionWrapper = document.createElement('div');
    newSectionWrapper.innerHTML = response['drawer-filters'];


    const renderedSection = document.getElementById('shopify-section-drawer-filters');

    const newListItems = newSectionWrapper.querySelectorAll('.filter-group-display__list-item');
    const renderedFilterListItems = renderedSection.querySelectorAll('.filter-group-display__list-item');
    
    for (let i = 0; i < newListItems.length; i++) {
        renderedFilterListItems[i].setAttribute('class', newListItems[i].getAttribute('class'));
    }
}

const initialiseMobileFilters = async () => {

    renderFilterDrawer();
    
    document.addEventListener('click', function(e) {
        const summary = e.target.closest('.filter-group-summary');
 
        if (summary) {
            e.preventDefault();
            const parent = summary.parentNode;
            parent.classList.toggle('active');   
        }
    });

    document.addEventListener('change', function(e) {
        const input = e.target.closest('.radio-input input');
    
        if (input) {
            const formData = new FormData(FilterFormMobile)
            console.log('formData', formData);
            renderFilterDrawer(formData);
        }
    });

}

initialiseMobileFilters();