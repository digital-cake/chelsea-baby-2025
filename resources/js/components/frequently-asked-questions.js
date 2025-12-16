window.handle_faqs = (section_id) => {
    const toggles = document.querySelectorAll(`.faqs-item--${section_id} .faqs-item__question`);
    const allItems = document.querySelectorAll(`.faqs-item--${section_id}`);

    if (!toggles.length) return;

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const item = toggle.closest('.faqs-item');
            const answer = item.querySelector('.faqs-item__answer');
            if (!answer) return;

            allItems.forEach(i => {
                i.classList.remove('is-open');
                const a = i.querySelector('.faqs-item__answer');
                if (a) {
                    a.style.maxHeight = null;
                    a.classList.remove('is-open');
                }
            });

            item.classList.add('is-open');
            answer.classList.add('is-open');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        });
    });
};
