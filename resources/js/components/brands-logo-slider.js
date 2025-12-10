import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/mousewheel';
import { Autoplay, Mousewheel } from 'swiper/modules';

window.init_brands_logo_slider = function(swiperLogoSlider) {
    const swiper = new Swiper('.swiper-' + swiperLogoSlider.section_id, {
        modules: [Autoplay, Mousewheel],
        speed: swiperLogoSlider.autoplay ? parseInt(swiperLogoSlider.speed) * 1000 : 300,
        spaceBetween: 96,
        slidesPerView: 'auto',
        loop: true,
        autoplay: swiperLogoSlider.autoplay ? {
            delay: 1,
            disableOnInteraction: false
        } : false,
        mousewheel: swiperLogoSlider.autoplay == false ? {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: false
        }: true
    });
    swiper.init();
};
