import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination, Mousewheel } from 'swiper/modules';

window.init_ugc_slider = function(swiperUgcData) {
    const swiper = new Swiper('.swiper-' + swiperUgcData.section_id, {
        modules: [Autoplay, Pagination, Mousewheel],
        speed: parseInt(swiperUgcData.speed) * 100,
        spaceBetween: 23,
        slidesPerView: 'auto',
        init: false,
        centeredSlides: true,
        loop: true,
        centeredSlidesBounds: true,
        autoplay: swiperUgcData.autoplay ? {
            delay: parseInt(swiperUgcData.delay) * 1000,
            disableOnInteraction: false
        } : false,
        pagination: swiperUgcData.enable_pagination && swiperUgcData.size > 1 ? {
            el: '.swiper-pagination-' + swiperUgcData.section_id,
            clickable: true,
        } : false,
        mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: false
        },
        breakpoints: {
            650: {
                spaceBetween: 6
            }
        }
    });
    swiper.init();
};
