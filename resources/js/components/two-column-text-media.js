import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Mousewheel, Autoplay, Pagination, Navigation } from 'swiper/modules';

window.init_two_column_text_media_slider = function(twoColumnTextMediaSwiperData) {
    const swiper = new Swiper('.swiper-' + twoColumnTextMediaSwiperData.section_id, {
        modules: [Mousewheel, Autoplay, Pagination, Navigation],
        speed: parseInt(twoColumnTextMediaSwiperData.speed) * 100,
        spaceBetween: 0,
        slidesPerView: 1,
        init: false,
        loop: twoColumnTextMediaSwiperData.size > 1 ? true : false,
        autoplay: twoColumnTextMediaSwiperData.autoplay ? {
            delay: parseInt(twoColumnTextMediaSwiperData.delay) * 1000,
            disableOnInteraction: false
        } : false,
        navigation: twoColumnTextMediaSwiperData.enable_navigation && twoColumnTextMediaSwiperData.size > 1 ? {
            nextEl: '.swiper-button-next-' + twoColumnTextMediaSwiperData.section_id,
            prevEl: '.swiper-button-prev-' + twoColumnTextMediaSwiperData.section_id,
        } : false,
        mousewheel: {
            invert: false,
            forceToAxis: true,
        },
        pagination: twoColumnTextMediaSwiperData.enable_pagination && twoColumnTextMediaSwiperData.size > 1 ? {
            el: '.swiper-pagination-' + twoColumnTextMediaSwiperData.section_id,
            clickable: true,
        } : false,
    });
    swiper.init();
};
