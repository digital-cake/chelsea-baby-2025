window.checkThreshold = function () {
    const deliveryMessageEl = document.getElementById('cart-delivery-threshold__discount-message');
    const deliveryBarEl = document.querySelector('.cart-delivery-threshold__discount-bar .progress');
    let deliveryMessage = '';
    let deliveryThreshold = '';
    let deliverySuccess = '';
    if (deliveryMessageEl) {
        deliveryMessage = deliveryMessageEl.dataset.message;
        deliverySuccess = deliveryMessageEl.dataset.success;
        deliveryThreshold = deliveryMessageEl.dataset.threshold * 100;
    }

	fetch(window.Shopify.routes.root + 'cart.js')
    .then(response => {
        return response.json();
    })
    .then(cart => {
        const shippingThresholdContainer = document.querySelector(".cart-delivery-threshold");
        if (cart.total_price == 0) {
            shippingThresholdContainer.style.display = "none"
        } else {
            shippingThresholdContainer.style.display = "flex"
        }
        if (cart.total_price < deliveryThreshold) {
            let remainingAmount = Shopify.formatMoney(deliveryThreshold - cart.total_price, Shopify.money_format);
            let message = deliveryMessage.replace(/\[value\]/g, `<span>${remainingAmount}</span>`);
            deliveryMessageEl.innerHTML = `<p>${message}</p>`;
        } else {
            deliveryMessageEl.innerHTML = `<p>${deliverySuccess}</p>`;
        }
        deliveryBarEl.style.width = `${cart.total_price / deliveryThreshold * 100}%`;
    });
}