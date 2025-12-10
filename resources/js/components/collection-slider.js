import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Mousewheel } from 'swiper/modules';

window.init_collection_slider = function(section_id) {
    const swiper = new Swiper('.swiper-' + section_id, {
        modules: [Navigation, Mousewheel],
        spaceBetween: 16,
        slidesPerView: 1.5,
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
            650: {
                slidesPerView: 2.2
            },
            1024: {
                slidesPerView: 3.2
            },
            1220: {
                slidesPerView: 4.2
            }
        }
    });
    swiper.init();
};
