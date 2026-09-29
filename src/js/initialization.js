document.addEventListener('DOMContentLoaded', () => {
    // Dismiss splash screen after loader finishes
    const splash = document.getElementById('splash-screen');
    const regModal = document.getElementById('registration-modal');
    
    if (splash) {
        setTimeout(() => {
            splash.classList.add('hidden');
            // Remove from DOM after transition
            setTimeout(() => {
                splash.remove();
            }, 600);
        }, 1800);
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
        });
    }

    initNavigation();
    initLanguage();
    initAccordions();
    initRecording();
    initSubscribe();
    initCarousel();
});