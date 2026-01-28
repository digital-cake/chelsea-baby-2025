import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Mousewheel } from 'swiper/modules';

window.init_ugc_slider = function(swiperUgcData) {
    const swiper = new Swiper('.swiper-' + swiperUgcData.section_id, {
        modules: [Pagination, Mousewheel],
        slidesPerView: "auto",
        spaceBetween: 22,
        centeredSlides: true,
        initialSlide: 2,
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
                spaceBetween: 6,
            },
        }
    });
    swiper.init();
};
