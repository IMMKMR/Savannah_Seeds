// Language
window.initLanguage = function() {
    const langToggle = $('#lang-toggle');
    const langModal = $('#lang-modal');
    const langOptions = $$('.lang-option');
    const backdrop = langModal?.querySelector('.lang-modal-backdrop');

    // Check saved language
    const savedLang = localStorage.getItem('savannah_lang');
    if (savedLang) {
        state.currentLang = savedLang;
        if (savedLang === 'hi') state.selectedJacket = 'hindi';
        else if (savedLang === 'pa') state.selectedJacket = 'punjabi';
        else state.selectedJacket = 'hindi';

        langOptions.forEach(o => {
            o.classList.remove('active');
            if (o.dataset.lang === savedLang) o.classList.add('active');
        });
    } else {
        // Prompt language selection after splash screen
        setTimeout(() => {
            if (langModal) langModal.classList.remove('hidden');
        }, 2400); // Wait for splash screen (1.8s + 0.6s)
    }

    // Apply default language on load
    applyTranslations(state.currentLang);

    langToggle?.addEventListener('click', () => {
        langModal?.classList.toggle('hidden');
    });

    backdrop?.addEventListener('click', () => {
        // Only allow closing if a language is selected
        if (localStorage.getItem('savannah_lang')) {
            langModal?.classList.add('hidden');
        }
    });

    langOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const lang = opt.dataset.lang;
            state.currentLang = lang;

            // Save to localStorage
            localStorage.setItem('savannah_lang', lang);

            // Also set jacket based on language
            if (lang === 'hi') state.selectedJacket = 'hindi';
            else if (lang === 'pa') state.selectedJacket = 'punjabi';
            else state.selectedJacket = 'hindi'; // default

            langOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            applyTranslations(lang);
            langModal?.classList.add('hidden');
        });
    });
}

window.applyTranslations = function(lang) {
    const t = translations[lang];
    if (!t) return;

    $$('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    $$('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });
}