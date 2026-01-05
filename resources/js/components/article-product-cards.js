import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Mousewheel } from 'swiper/modules';

window.init_article_product_cards_slider = function(section_id) {
    const swiper = new Swiper('.swiper-' + section_id, {
        modules: [Navigation, Mousewheel],
        spaceBetween: 16,
        slidesPerView: 'auto',
        init: false,
        mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: false
        },
        navigation: {
            nextEl: '.swiper-button-next-' + section_id,
            prevEl: '.swiper-button-prev-' + section_id,
        },
        breakpoints: {
            768: {
                spaceBetween: 50,
            }
        }
    });
    swiper.init();
};
