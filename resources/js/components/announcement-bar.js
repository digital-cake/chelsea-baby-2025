import Swiper from 'swiper';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

window.init_announcement_bar_slider = function(swiperAnnouncementBarData) {
    const swiper = new Swiper('.swiper-' + swiperAnnouncementBarData.section_id, {
        modules: [Autoplay],
        speed: parseInt(swiperAnnouncementBarData.speed) * 100,
        spaceBetween: 0,
        slidesPerView: 1,
        init: false,
        loop: swiperAnnouncementBarData.size > 1 ? true : false,
        autoplay: swiperAnnouncementBarData.autoplay ? {
            delay: parseInt(swiperAnnouncementBarData.delay) * 1000,
            disableOnInteraction: false
        } : false,
        breakpoints: {
            900: {
                slidesPerView: swiperAnnouncementBarData.size,
            }
        }
    });
    swiper.init();
};
