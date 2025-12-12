import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/mousewheel';
import "swiper/css/effect-fade";
import { Mousewheel, Autoplay } from 'swiper/modules';

window.init_announcement_bar_slider = function(swiperAnnouncementBarData) {
    const swiper = new Swiper('.swiper-' + swiperAnnouncementBarData.section_id, {
        modules: [Mousewheel, Autoplay],
        speed: parseInt(swiperAnnouncementBarData.speed) * 100,
        spaceBetween: 0,
        slidesPerView: 1,
        init: false,
        loop: swiperAnnouncementBarData.size > 1 ? true : false,
        autoplay: swiperAnnouncementBarData.autoplay ? {
            delay: parseInt(swiperAnnouncementBarData.delay) * 1000,
            disableOnInteraction: false
        } : false,
        mousewheel: {
            invert: false,
            forceToAxis: true,
        },
        breakpoints: {
            650: {
                slidesPerView: 2,
            },
            900: {
                slidesPerView: swiperAnnouncementBarData.size,
            }
        }
    });
    swiper.init();
};
