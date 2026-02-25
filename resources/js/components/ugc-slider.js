import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Mousewheel, Autoplay } from 'swiper/modules';

window.init_ugc_slider = function(swiperUgcData) {
    const swiper = new Swiper('.swiper-' + swiperUgcData.section_id, {
        modules: [Pagination, Mousewheel, Autoplay],
        slidesPerView: 1.2,
        spaceBetween: 22,
        centeredSlides: true,
        centeredSlidesBounds: true,
        loop: true,
        autoplay: swiperUgcData.autoplay ? {
            delay: parseInt(swiperUgcData.delay) * 1000,
            disableOnInteraction: false
        } : false,
        pagination: swiperUgcData.enable_pagination && swiperUgcData.size > 1 ? {
            el: '.swiper-pagination-' + swiperUgcData.section_id,
            clickable: true,
        } : false,
        mousewheel: {
            invert: false,
            forceToAxis: true,
        },
        breakpoints: {
            650: {
                slidesPerView: 2.5,
                spaceBetween: 6,
            },
            1024: {
                slidesPerView: 3.2,
                spaceBetween: 6,
            },
            1280: {
                slidesPerView: 4.2,
                spaceBetween: 6,
            }
        }
    });
    swiper.init();
};
