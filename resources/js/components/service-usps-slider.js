import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination, Mousewheel } from 'swiper/modules';

window.init_service_usps_slider = function(swiperServiceUspsSliderData) {
    const swiper = new Swiper('.swiper-' + swiperServiceUspsSliderData.section_id, {
        modules: [Autoplay, Pagination, Mousewheel],
        speed: parseInt(swiperServiceUspsSliderData.speed) * 100,
        spaceBetween: 0,
        slidesPerView: 1,
        init: false,
        loop: swiperServiceUspsSliderData.size > 1 ? true : false,
        autoplay: swiperServiceUspsSliderData.autoplay ? {
            delay: parseInt(swiperServiceUspsSliderData.delay) * 1000,
            disableOnInteraction: false
        } : false,
        pagination: swiperServiceUspsSliderData.enable_pagination && swiperServiceUspsSliderData.size > 1 ? {
            el: '.swiper-pagination-' + swiperServiceUspsSliderData.section_id,
            clickable: true,
        } : false,
        mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: false
        },
        breakpoints: {
            650: {
                slidesPerView: 2
            },
            976: {
                slidesPerView: 3
            }
        }
    });
    swiper.init();
};
