import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Mousewheel } from 'swiper/modules';

window.init_product_complete_the_set_slider = function(swiperCompleteTheSetData) {
    const swiper = new Swiper('.swiper-' + swiperCompleteTheSetData.section_id, {
        modules: [Mousewheel],
        spaceBetween: 16,
        slidesPerView: 'auto',
        init: false,
        mousewheel: {
            invert: false,
            forceToAxis: true,
        },
    });
    swiper.init();
}