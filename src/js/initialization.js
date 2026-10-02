document.addEventListener('DOMContentLoaded', () => {
    // Dismiss splash screen after loader finishes
    const splash = document.getElementById('splash-screen');
    const regModal = document.getElementById('registration-modal');
    
    const isRegistered = localStorage.getItem('savannah_user');
    const floatingActions = document.getElementById('floating-actions');

    if (splash) {
        setTimeout(() => {
            splash.classList.add('hidden');
            // Remove from DOM after transition
            setTimeout(() => {
                splash.remove();
                if (isRegistered && regModal) {
                    regModal.classList.add('hidden');
                    setTimeout(() => regModal.remove(), 600);
                    if (floatingActions) floatingActions.classList.remove('hidden');
                }
            }, 600);
        }, 1800);
    } else if (isRegistered && regModal) {
        regModal.classList.add('hidden');
        setTimeout(() => regModal.remove(), 600);
        if (floatingActions) floatingActions.classList.remove('hidden');
    }

    const regForm = document.getElementById('registration-form');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const location = document.getElementById('reg-location').value;
            const mobile = document.getElementById('reg-mobile').value;
            
            localStorage.setItem('savannah_user', JSON.stringify({ name, location, mobile }));
            
            regModal.classList.add('hidden');
            setTimeout(() => regModal.remove(), 600);
            if (floatingActions) floatingActions.classList.remove('hidden');
        });
    }

    initNavigation();
    initLanguage();
    initAccordions();
    initRecording();
    initSubscribe();
    initCarousel();
});