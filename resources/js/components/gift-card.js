const handle_custom_date_picker = () => {
    const chevron = document.querySelector('.date-chevron');
    const input = document.getElementById('send-on-date');
    if (chevron && input) {
        chevron.addEventListener('click', function() {
            input.focus();
            input.click();
        });
    }
}

const handle_gift_card_fields = () => {
    const recipientContainer = document.querySelector('.recipient-details');
    const recipientToggleButtons = document.querySelectorAll('.recipient-select button');

    const setFieldStatuses = status => {
        const fields = recipientContainer.querySelectorAll('input, textarea');
        for (const field of fields) field.disabled = status;
    };

    if (recipientToggleButtons)
        for (const button of recipientToggleButtons)
            button.addEventListener('click', e => {
                e.preventDefault();
                if (button.classList.contains('actice')) return;
                for (const button of recipientToggleButtons) button.classList.remove('active');
                if (button.dataset.target === 'them') {
                    recipientContainer.classList.add('active');
                    button.classList.add('active');
                    setFieldStatuses(false);
                } else {
                    recipientContainer.classList.remove('active');
                    button.classList.add('active');
                    setFieldStatuses(true);
                }
            });
}

document.addEventListener('DOMContentLoaded', function() {
    handle_custom_date_picker();
    handle_gift_card_fields();
});