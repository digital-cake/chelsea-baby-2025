import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/mousewheel';
import { Pagination, Mousewheel, Navigation, Autoplay } from 'swiper/modules';

window.init_hero_banner_slider = function(swiperData) {
    const swiper = new Swiper('.swiper-' + swiperData.section_id, {
        modules: [Navigation, Mousewheel, Pagination, Autoplay],
        speed: parseInt(swiperData.speed) * 100,
        spaceBetween: 0,
        slidesPerView: 1,
        init: false,
        loop: swiperData.size > 1 ? true : false,
        autoHeight: true,
        autoplay: swiperData.autoplay ? {
            delay: parseInt(swiperData.delay) * 1000,
            disableOnInteraction: false
        } : false,
        navigation: swiperData.enable_arrows && swiperData.size > 1 ? {
            nextEl: '.next-' + swiperData.section_id,
            prevEl: '.prev-' + swiperData.section_id,
        } : false,
        pagination: swiperData.enable_pagination && swiperData.size > 1 ? {
            el: '.swiper-pagination-' + swiperData.section_id,
            clickable: true,
        } : false,
        mousewheel: {
            invert: false,
            forceToAxis: true,
        },
    });
    swiper.init();
};
