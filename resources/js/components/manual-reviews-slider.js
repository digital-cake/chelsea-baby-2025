import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Mousewheel, Pagination, Navigation } from 'swiper/modules';

window.init_manual_reviews_slider = function(manualReviewsSliderData) {
    const swiper = new Swiper('.swiper-' + manualReviewsSliderData.section_id, {
        modules: [Mousewheel, Pagination, Navigation],
        speed: parseInt(manualReviewsSliderData.speed) * 100,
        spaceBetween: 0,
        slidesPerView: 1,
        init: false,
        autoHeight: true,
        navigation: manualReviewsSliderData.enable_navigation && manualReviewsSliderData.size > 1 ? {
            nextEl: '.swiper-button-next-' + manualReviewsSliderData.section_id,
            prevEl: '.swiper-button-prev-' + manualReviewsSliderData.section_id,
        } : false,
        mousewheel: {
            invert: false,
            forceToAxis: true,
        },
        pagination: manualReviewsSliderData.enable_pagination && manualReviewsSliderData.size > 1 ? {
            el: '.swiper-pagination-' + manualReviewsSliderData.section_id,
            clickable: true,
        } : false,
    });
    swiper.init();
};
