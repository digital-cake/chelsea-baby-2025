import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Mousewheel } from 'swiper/modules';

window.init_ugc_slider = function(swiperUgcData) {
    const swiper = new Swiper('.swiper-' + swiperUgcData.section_id, {
        modules: [Pagination, Mousewheel],
        slidesPerView: 1.3,
        centeredSlides: false,
        watchSlidesProgress: true,
        loop: false,
        init: false,
        spaceBetween: 23,
        pagination: swiperUgcData.enable_pagination && swiperUgcData.size > 1 ? {
            el: '.swiper-pagination-' + swiperUgcData.section_id,
            clickable: true,
        } : false,
        mousewheel: {
            forceToAxis: true,
            sensitivity: 1
        },
        breakpoints: {
            480: {
                slidesPerView: 3,
                spaceBetween: 6,
                centeredSlides: true,
                initialSlide: 2,
            },
            1024: {
                slidesPerView: 5,
                spaceBetween: 6,
                centeredSlides: true,
                initialSlide: 2,
            }
        }
    });
    swiper.init();
};
