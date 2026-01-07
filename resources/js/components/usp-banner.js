import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/mousewheel';
import { Mousewheel, Autoplay, Pagination } from 'swiper/modules';

window.init_usp_banner_slider = function(uspSwiperData) {
    const swiper = new Swiper('.swiper-' + uspSwiperData.section_id, {
        modules: [Mousewheel, Autoplay, Pagination],
        speed: parseInt(uspSwiperData.speed) * 100,
        spaceBetween: 0,
        slidesPerView: 1,
        init: false,
        loop: uspSwiperData.size > 1 ? true : false,
        autoplay: uspSwiperData.autoplay ? {
            delay: parseInt(uspSwiperData.delay) * 1000,
            disableOnInteraction: false
        } : false,
        mousewheel: {
            invert: false,
            forceToAxis: true,
        },
        pagination: uspSwiperData.enable_pagination && uspSwiperData.size > 1 ? {
            el: '.swiper-pagination-' + uspSwiperData.section_id,
            clickable: true,
        } : false,
        breakpoints: {
            650: {
                slidesPerView: 2,
                //spaceBetween: 55,
            },
            900: {
                slidesPerView: uspSwiperData.size,
                //spaceBetween: 55,
            }
        }
    });
    swiper.init();
};
