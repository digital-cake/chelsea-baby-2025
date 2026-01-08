import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Mousewheel } from 'swiper/modules';

window.init_product_features_slider = function(swiperProductFeaturesData) {
    let slidesToShow = swiperProductFeaturesData.size;
    
    if (swiperProductFeaturesData.size >= 4) {
        slidesToShow = 4.3 
    }

    const swiper = new Swiper('.swiper-' + swiperProductFeaturesData.section_id, {
        modules: [Mousewheel, Navigation],
        spaceBetween: 16,
        slidesPerView: 1.6,
        init: false,
        navigation: swiperProductFeaturesData.enable_navigation && swiperProductFeaturesData.size > 1 ? {
            nextEl: '.swiper-button-next-' + swiperProductFeaturesData.section_id,
            prevEl: '.swiper-button-prev-' + swiperProductFeaturesData.section_id,
        } : false,
        mousewheel: {
            invert: false,
            forceToAxis: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2.3,
                spaceBetween: 16
            },
            1025: {
                slidesPerView: slidesToShow,
                spaceBetween: 16
            }
        }
    });
    swiper.init();

    document.addEventListener('mouseover', function(e) {
        let video = e.target.closest('.swiper-' + swiperProductFeaturesData.section_id + ' .swiper-slide video');
        if (video) video.play();
    }, { passive: true });

    document.addEventListener('mouseout', function(e) {
        let video = e.target.closest('.swiper-' + swiperProductFeaturesData.section_id + ' .swiper-slide video');
        if (video) video.pause();
    }, { passive: true });
}