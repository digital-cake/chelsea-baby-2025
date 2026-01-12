const handle_header_scroll = () => {
    if (window.innerWidth <= 1024) return;
    const header = document.querySelector('.section-header');
    if (!header) return;

    let lastScrollTop = 0;
    let ticking = false;
    let direction = 'down';
    const scrollUpThreshold = 34;
    const directionThreshold = 50;

    const updateHeader = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(scrollTop - lastScrollTop) < directionThreshold) {
            ticking = false;
            return;
        }

        if (scrollTop > lastScrollTop && scrollTop > directionThreshold) {
            direction = 'down';
            header.classList.add('scrolling');
            header.classList.remove('scrolling-up');
        } else if (scrollTop < lastScrollTop) {
            direction = 'up';
            header.classList.remove('scrolling');

            if (scrollTop > scrollUpThreshold) {
                header.classList.add('scrolling-up');
            } else {
                header.classList.remove('scrolling-up');
            }
        }

        lastScrollTop = Math.max(scrollTop, 0);
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
};

window.addEventListener('DOMContentLoaded', function() {
    handle_header_scroll();
});