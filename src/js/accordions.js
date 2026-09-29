// Accordions
window.initAccordions = function() {
    $$('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const accordion = header.parentElement;
            const isOpen = accordion.classList.contains('open');

            // Close all accordions in same group (optional: keep others open)
            // accordion.parentElement.querySelectorAll('.accordion').forEach(a => a.classList.remove('open'));

            if (isOpen) {
                accordion.classList.remove('open');
                header.querySelector('.accordion-icon').textContent = '+';
            } else {
                accordion.classList.add('open');
                header.querySelector('.accordion-icon').textContent = '−';
            }
        });
    });
}