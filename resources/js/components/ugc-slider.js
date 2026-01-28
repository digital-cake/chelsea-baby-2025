import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Mousewheel, Autoplay } from 'swiper/modules';

window.init_ugc_slider = function(swiperUgcData) {
    console.log('swiperUgcData', swiperUgcData);
    const swiper = new Swiper('.swiper-' + swiperUgcData.section_id, {
        modules: [Pagination, Mousewheel, Autoplay],
        slidesPerView: 1.2,
        spaceBetween: 22,
        centeredSlides: true,
        initialSlide: 2,
        loop: swiperUgcData.size >= 10,
        autoplay: swiperUgcData.autoplay && swiperUgcData.size >= 10 ? {
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
                spaceBetween: 6,
                slidesPerView: "auto",
            }
        }
    });
    swiper.init();
};
