import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Mousewheel, Autoplay } from 'swiper/modules';

const updateCartQuantity = input => {
	const quantity = input.value;
	const product_id = input.dataset.id;
	const data = { updates: {} };
	data.updates[product_id] = quantity;
	fetch(window.Shopify.routes.root + 'cart/update.js', {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then(response => response.json())
		.then(() => {
			location.href = '';
		})
		.catch(err => {
			console.log(err);
		});
};

const cartContent = document.querySelector('.section-cart');
const initCartQuantity = () => {
	const quantityElements = cartContent.querySelectorAll('.cart-quantity');
	if (quantityElements)
		for (let i = 0; i < quantityElements.length; i++) {
			const input = quantityElements[i].querySelector('input');
			let current_val = input.value;
			const incrementors = quantityElements[i].querySelectorAll('.increment');
			for (let i = 0; i < incrementors.length; i++) {
				incrementors[i].addEventListener('click', e => {
					e.preventDefault();
					if (incrementors[i].classList.contains('down')) {
						if (current_val <= 0) return;
						current_val--;
					}
					if (incrementors[i].classList.contains('up')) {
						current_val++;
					}
					input.setAttribute('value', current_val);
					updateCartQuantity(input);
					window.countCartItems();
				});
			}
		}
	const quantityInputs = cartContent.querySelectorAll('input');
	if (quantityInputs)
		for (const input of quantityInputs)
			input.addEventListener('keyup', () => {
				clearTimeout(window.inputDelay);
				window.inputDelay = setTimeout(() => {
					updateCartQuantity(input);
					window.countCartItems();
				}, 500);
			});
};

const handle_mobile_fixed_checkout_visibility = () => {
	const footerEl = document.querySelector('.section-footer');
	const cartTotalsInner = document.querySelector('.cart-totals__inner');
	const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cartTotalsInner.style.display = 'none';
            } else {
                cartTotalsInner.style.display = 'flex';
            }
        });
    }, {
        root: null,
        threshold: 0,
    });

    if (window.innerWidth <= 1024) {
        observer.observe(footerEl);
    }
}

const init_cart_usps = function() {
    const swiper = new Swiper('.swiper-cart-usps', {
        modules: [Pagination, Mousewheel, Autoplay],
        slidesPerView: 1,
        init: false,
		autoplay: true,
        pagination: {
            el: '.swiper-pagination-cart-usps',
            clickable: true,
        },
        mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: false
        },
		breakpoints: {
			550: {
				slidesPerView: 2,
				spaceBetween: 16,
			},
			650: {
				slidesPerView: 3,
				spaceBetween: 16,
			}
		}
    });
    swiper.init();
};


window.addEventListener('DOMContentLoaded', function() {
    initCartQuantity();
    window.checkThreshold();
	handle_mobile_fixed_checkout_visibility();
	init_cart_usps();
})