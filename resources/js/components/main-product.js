// import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
// import "@fancyapps/ui/dist/fancybox/fancybox.css";

// const init_product_media = () => {
//     Fancybox.bind('[data-fancybox="gallery"]', {
//         Thumbs: {
//             type: "classic",
//         },
//         Toolbar: false
//     });
// }

const open_product_description = () => {
    const toggle = document.getElementById('product-description-toggle');
    const descriptionAccordion = document.querySelector('.accordion-toggle--description');
    if (!toggle || !descriptionAccordion) return;

    toggle.addEventListener('click', function() {
        descriptionAccordion.click();
        descriptionAccordion.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    });
}

window.addEventListener('DOMContentLoaded', open_product_description);