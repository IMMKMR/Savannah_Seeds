// Navigation
window.initNavigation = function() {
    const navItems = $$('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateTo(page);
        });
    });

    // Feature cards click to navigate
    $('#feature-record')?.addEventListener('click', () => navigateTo('product'));
    $('#feature-brand')?.addEventListener('click', () => navigateTo('record'));
    $('#feature-share')?.addEventListener('click', () => navigateTo('record'));

    // Home video preview click
    $('#home-video-preview')?.addEventListener('click', () => navigateTo('record'));

    // Notice Board click
    $('#badge-btn')?.addEventListener('click', () => navigateTo('notice'));
}

window.navigateTo = function(page) {
    state.currentPage = page;

    // Update pages
    $$('.page').forEach(p => p.classList.remove('active'));
    $(`#page-${page}`)?.classList.add('active');

    // Update nav
    $$('.nav-item').forEach(n => {
        n.classList.remove('active');
        n.querySelector('.nav-icon-wrapper')?.classList.remove('active-icon');
    });
    const activeNav = $(`#nav-${page}`);
    activeNav?.classList.add('active');
    activeNav?.querySelector('.nav-icon-wrapper')?.classList.add('active-icon');

    // Scroll to top
    $('#pages').scrollTop = 0;

    // If navigating away from record, stop camera
    if (page !== 'record' && state.stream) {
        // Don't stop if we have a recording
    }
}