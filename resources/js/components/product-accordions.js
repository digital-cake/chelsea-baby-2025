const handle_product_accordions = () => {
    const toggles = document.querySelectorAll('.accordion-toggle');
    const allItems = document.querySelectorAll('.accordion');

    if (!toggles.length) return;

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const item = toggle.closest('.accordion');
            const answer = item.querySelector('.accordion__content');
            if (!answer) return;

            const isOpen = item.classList.contains('is-open');

            allItems.forEach(i => {
                i.classList.remove('is-open');
                const a = i.querySelector('.accordion__content');
                if (a) {
                    a.style.maxHeight = null;
                    a.classList.remove('is-open');
                }
            });

            if (!isOpen) {
                item.classList.add('is-open');
                answer.classList.add('is-open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
};

window.addEventListener('DOMContentLoaded', handle_product_accordions);
