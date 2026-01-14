import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import { Mousewheel, Navigation } from 'swiper/modules';

window.init_recently_viewed_swiper = function(section_id) {
	const recentlyViewedProductHandles = localStorage.getItem('cake_recently_viewed_products_CB');
	if (!recentlyViewedProductHandles) return;

	const parsedRecentlyViewedProductHandles = JSON.parse(recentlyViewedProductHandles);

	const swiperWrapper = document.querySelector(`.swiper__recently-viewed--${ section_id } .swiper-wrapper`);

	if (!swiperWrapper) return;
		swiperWrapper.innerHTML = '';

	try {
		for (const handle of parsedRecentlyViewedProductHandles) {
			const slide = document.createElement('div');
			slide.className = 'swiper-slide';

			fetch(`/products/${handle}?view=card`)
			.then(function(response) {
				if (!response.ok) throw new Error('Network response was not ok');
				return response.text();
			})
			.then(function(html) {
				slide.innerHTML = html;
			})
			.catch(function(error) {
				console.error('Error fetching product suggestion:', error);
			});
			
			swiperWrapper.prepend(slide);
            const recentlyViewedToggleButton = document.querySelector('.button-recently-viewed');
            if (recentlyViewedToggleButton) recentlyViewedToggleButton.classList.remove('hidden');
		}

        const swiper = new Swiper(`.swiper__recently-viewed--${ section_id }`, {
            modules: [Mousewheel, Navigation],
            spaceBetween: 16,
            slidesPerView: 1.4,
            mousewheel: {
                forceToAxis: true,
                sensitivity: 1,
                releaseOnEdges: true
            },
            navigation: {
                nextEl: '.swiper-button-next-' + section_id,
                prevEl: '.swiper-button-prev-' + section_id,
            },
            breakpoints: {
                768: {
                    slidesPerView: 3.2,
                    spaceBetween: 16,
                },
                1024: {
                    slidesPerView: 4.2,
                    spaceBetween: 16,
                }
            },
        });

	} catch (error) {
		console.error('Error processing recently viewed products:', error);
	}
}

window.init_recommendations_swiper = function(section_id) {
    const swiperEl = document.querySelector(`.swiper__recommendations--${ section_id }`);
    if (!swiperEl) return;

    const swiper = new Swiper(`.swiper__recommendations--${ section_id }`, {
        modules: [Mousewheel, Navigation],
        spaceBetween: 16,
        slidesPerView: 1.4,
        mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true
        },
        navigation: {
                nextEl: '.swiper-button-next-' + section_id,
                prevEl: '.swiper-button-prev-' + section_id,
        },
        breakpoints: {
            768: {
                slidesPerView: 3.2,
                spaceBetween: 16,
            },
            1024: {
                slidesPerView: 4.2,
                spaceBetween: 16,
            }
        }
    });
}

window.handle_swiper_tab_navigation = (sectionClassName) => {
    const section = document.querySelector(`.${sectionClassName}`);
    if (!section) return;

    const sliderSwitchButtons = section.querySelectorAll(`.${sectionClassName}__tabs button`);
    const allSwipers = section.querySelectorAll(`.swiper`);
    
    if (!sliderSwitchButtons.length || !allSwipers.length) return;

    sliderSwitchButtons.forEach(button => {
        button.addEventListener('click', () => {
            sliderSwitchButtons.forEach(btn => btn.classList.remove('active'));
            allSwipers.forEach(swp => swp.classList.add('hidden'));

            button.classList.add('active');

            const identifier = button.dataset.swiperTarget;
            const targetSwiper = section.querySelector(`.swiper[data-name="${identifier}"]`);
            if (targetSwiper) {
                targetSwiper.classList.remove('hidden');
            }
        });
    });
};