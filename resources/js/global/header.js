const handle_header_scroll = () => {
    const header = document.querySelector('.section-header');
    const announcementBar = document.querySelector('.section-announcement-bar');
    if (!header) return;

    header.style.top = (announcementBar ? announcementBar.offsetHeight : 0) + 'px';

    let lastScrollTop = 0;
    let ticking = false;
    const scrollUpThreshold = 34;
    const directionThreshold = 101;

    const updateHeader = () => {
        header.style.top = (announcementBar ? announcementBar.offsetHeight : 0) + 'px';
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(scrollTop - lastScrollTop) < directionThreshold) {
            ticking = false;
            return;
        }

        if (scrollTop > lastScrollTop && scrollTop > directionThreshold) {
            header.classList.add('scrolling');
            announcementBar.classList.add('scrolling');
            header.classList.remove('scrolling-up');
        } else if (scrollTop < lastScrollTop) {
            header.classList.remove('scrolling');
            announcementBar.classList.remove('scrolling');

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