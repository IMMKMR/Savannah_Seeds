// Carousel
window.initCarousel = function() {
    const carousel = $('#home-banner-carousel');
    
    if (!carousel) return;

    let autoScrollInterval;

    const startAutoScroll = () => {
        autoScrollInterval = setInterval(() => {
            if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10) {
                // Scroll back to start
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                // Scroll to next slide
                carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' });
            }
        }, 10000); // Scroll every 10 seconds
    };

    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };

    // Start auto scroll
    startAutoScroll();

    // Pause on touch/interaction
    carousel.addEventListener('touchstart', stopAutoScroll, { passive: true });
    carousel.addEventListener('touchend', startAutoScroll, { passive: true });
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);
}