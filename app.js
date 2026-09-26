/* ===================================================
   Savannah Seeds Microsite — Application Logic
   =================================================== */

// ── State ──
const state = {
    currentPage: 'home',
    currentLang: 'en',
    isRecording: false,
    mediaRecorder: null,
    recordedChunks: [],
    stream: null,
    timerInterval: null,
    recordingSeconds: 0,
    recordedBlob: null,
    selectedJacket: 'hindi', // default jacket language
    facingMode: 'user',
};

// ── i18n Translations ──
const translations = {
    en: {
        createVideo: 'Create your branded farmer video',
        recordStory: 'Record Your Story',
        brandJacket: 'Brand Jacketing',
        shareVideo: 'Share & Download',
        allowCamera: 'Allow Camera Access',
        cameraDesc: 'Savannah Seeds needs access to your camera and microphone to record your farmer story.',
        allowAccess: 'ALLOW ACCESS',
        notNow: 'NOT NOW',
        privacyNote: 'Your video is private and will only be shared with your consent.',
        processingText: 'Please wait. Keep this screen open.',
        recordAgain: 'RECORD AGAIN',
        backToHome: 'Back to Home',
        downloadVideo: 'DOWNLOAD',
        productName: 'Sava 7501 — Hybrid Paddy',
        productDesc: 'Sava 7501 is a premium hybrid paddy seed by Savannah Seeds, engineered for superior yield, disease resistance, and adaptability across diverse agro-climatic conditions. Ideal for farmers seeking consistent, high-quality harvests.',
        readMore: 'Read more...',
        keyFeatures: 'KEY FEATURES',
        ingredients: 'INGREDIENTS',
        howToUse: 'HOW TO USE',
        howToUseDesc: 'Prepare a well-puddled nursery bed. Sow seeds at 15–20 kg/ha rate. Transplant 20–25 day old seedlings at 20×15 cm spacing. Maintain proper water management and apply recommended fertilizers for best results.',
        feature1: 'High yield potential with excellent grain quality',
        feature2: 'Strong resistance to major diseases',
        feature3: 'Adaptable across diverse agro-climatic zones',
        feature4: 'Medium-duration variety (120–130 days)',
        feature5: 'Net Weight: 3 Kg per pack',
        ing1: 'Certified F1 Hybrid Rice Seed',
        ing2: 'Treated with Thiram fungicide for seed protection',
        ing3: 'Germination rate: >90%',
        badgeSafe: '100% Safe',
        badgeFarmer: 'Farmer Friendly',
        badgeEasy: 'Easy to Grow',
        badgeNoChemical: 'No Harsh Chemicals',
        wantToKnow: 'Want to know more?',
        faq1q: 'Is it safe?',
        faq1a: 'Yes, Sava 7501 is a completely safe and certified product. All seeds are tested and approved under stringent quality standards.',
        faq2q: 'What is the ideal planting season?',
        faq2a: 'Sava 7501 is best planted during the Kharif season (June–July). It performs well in both irrigated and rain-fed conditions.',
        stayConnected: 'Stay Connected, Stay Informed',
        subscribeDesc: 'Subscribe to receive exclusive updates, tips, and promotions straight to your inbox. Join our community for expert advice and resources to support your farming journey.',
        emailPlaceholder: 'Enter your email address',
        selectJacket: 'Select Brand Jacket:',
    },
    hi: {
        createVideo: 'अपना ब्रांडेड किसान वीडियो बनाएं',
        recordStory: 'अपनी कहानी रिकॉर्ड करें',
        brandJacket: 'ब्रांड जैकेटिंग',
        shareVideo: 'शेयर और डाउनलोड',
        allowCamera: 'कैमरा एक्सेस की अनुमति दें',
        cameraDesc: 'सवाना सीड्स को आपके किसान वीडियो को रिकॉर्ड करने के लिए आपके कैमरा और माइक्रोफ़ोन की एक्सेस चाहिए।',
        allowAccess: 'एक्सेस दें',
        notNow: 'अभी नहीं',
        privacyNote: 'आपका वीडियो निजी है और केवल आपकी सहमति से साझा किया जाएगा।',
        processingText: 'कृपया प्रतीक्षा करें। इस स्क्रीन को खुला रखें।',
        recordAgain: 'फिर से रिकॉर्ड करें',
        backToHome: 'होम पर वापस',
        downloadVideo: 'डाउनलोड',
        productName: 'सवा 7501 — हाइब्रिड धान',
        productDesc: 'सवा 7501 सवाना सीड्स का एक प्रीमियम हाइब्रिड धान बीज है, जिसे बेहतर उपज, रोग प्रतिरोधकता और विविध कृषि-जलवायु स्थितियों में अनुकूलता के लिए इंजीनियर किया गया है।',
        readMore: 'और पढ़ें...',
        keyFeatures: 'मुख्य विशेषताएं',
        ingredients: 'सामग्री',
        howToUse: 'उपयोग कैसे करें',
        howToUseDesc: 'एक अच्छी तरह से तैयार नर्सरी बेड तैयार करें। 15-20 किग्रा/हेक्टेयर की दर से बीज बोएं। 20-25 दिन पुरानी पौधों को 20×15 सेमी स्पेसिंग पर ट्रांसप्लांट करें।',
        feature1: 'उत्कृष्ट अनाज गुणवत्ता के साथ उच्च उपज क्षमता',
        feature2: 'प्रमुख रोगों के खिलाफ मजबूत प्रतिरोध',
        feature3: 'विविध कृषि-जलवायु क्षेत्रों में अनुकूल',
        feature4: 'मध्यम अवधि की किस्म (120-130 दिन)',
        feature5: 'शुद्ध वजन: 3 किलो प्रति पैक',
        ing1: 'प्रमाणित F1 हाइब्रिड चावल बीज',
        ing2: 'बीज सुरक्षा के लिए थिरम फफूंदनाशक से उपचारित',
        ing3: 'अंकुरण दर: >90%',
        badgeSafe: '100% सुरक्षित',
        badgeFarmer: 'किसान अनुकूल',
        badgeEasy: 'उगाना आसान',
        badgeNoChemical: 'कोई कठोर रसायन नहीं',
        wantToKnow: 'और जानना चाहते हैं?',
        faq1q: 'क्या यह सुरक्षित है?',
        faq1a: 'हाँ, सवा 7501 पूरी तरह से सुरक्षित और प्रमाणित उत्पाद है।',
        faq2q: 'आदर्श रोपण मौसम क्या है?',
        faq2a: 'सवा 7501 खरीफ सीजन (जून-जुलाई) में बोने के लिए सबसे अच्छा है।',
        stayConnected: 'जुड़े रहें, जागरूक रहें',
        subscribeDesc: 'विशेष अपडेट, टिप्स और प्रमोशन प्राप्त करने के लिए सब्सक्राइब करें।',
        emailPlaceholder: 'अपना ईमेल पता दर्ज करें',
        selectJacket: 'ब्रांड जैकेट चुनें:',
    },
    pa: {
        createVideo: 'ਆਪਣਾ ਬ੍ਰਾਂਡਿਡ ਕਿਸਾਨ ਵੀਡੀਓ ਬਣਾਓ',
        recordStory: 'ਆਪਣੀ ਕਹਾਣੀ ਰਿਕਾਰਡ ਕਰੋ',
        brandJacket: 'ਬ੍ਰਾਂਡ ਜੈਕੇਟਿੰਗ',
        shareVideo: 'ਸ਼ੇਅਰ ਅਤੇ ਡਾਊਨਲੋਡ',
        allowCamera: 'ਕੈਮਰਾ ਐਕਸੈਸ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ',
        cameraDesc: 'ਸਵਾਨਾ ਸੀਡਜ਼ ਨੂੰ ਤੁਹਾਡੀ ਕਿਸਾਨ ਕਹਾਣੀ ਰਿਕਾਰਡ ਕਰਨ ਲਈ ਤੁਹਾਡੇ ਕੈਮਰੇ ਅਤੇ ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਦੀ ਲੋੜ ਹੈ।',
        allowAccess: 'ਐਕਸੈਸ ਦਿਓ',
        notNow: 'ਹੁਣੇ ਨਹੀਂ',
        privacyNote: 'ਤੁਹਾਡਾ ਵੀਡੀਓ ਨਿੱਜੀ ਹੈ ਅਤੇ ਸਿਰਫ਼ ਤੁਹਾਡੀ ਸਹਿਮਤੀ ਨਾਲ ਸਾਂਝਾ ਕੀਤਾ ਜਾਵੇਗਾ।',
        processingText: 'ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ। ਇਸ ਸਕ੍ਰੀਨ ਨੂੰ ਖੁੱਲ੍ਹਾ ਰੱਖੋ।',
        recordAgain: 'ਦੁਬਾਰਾ ਰਿਕਾਰਡ ਕਰੋ',
        backToHome: 'ਘਰ ਵਾਪਸ',
        downloadVideo: 'ਡਾਊਨਲੋਡ',
        productName: 'ਸਵਾ 7501 — ਹਾਈਬ੍ਰਿਡ ਝੋਨਾ',
        productDesc: 'ਸਵਾ 7501 ਸਵਾਨਾ ਸੀਡਜ਼ ਦਾ ਇੱਕ ਪ੍ਰੀਮੀਅਮ ਹਾਈਬ੍ਰਿਡ ਝੋਨਾ ਬੀਜ ਹੈ, ਜੋ ਵਧੀਆ ਝਾੜ, ਬੀਮਾਰੀ ਪ੍ਰਤੀਰੋਧ ਅਤੇ ਵੱਖ-ਵੱਖ ਖੇਤੀ-ਜਲਵਾਯੂ ਹਾਲਤਾਂ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ।',
        readMore: 'ਹੋਰ ਪੜ੍ਹੋ...',
        keyFeatures: 'ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
        ingredients: 'ਸਮੱਗਰੀ',
        howToUse: 'ਵਰਤੋਂ ਕਿਵੇਂ ਕਰੀਏ',
        howToUseDesc: 'ਇੱਕ ਚੰਗੀ ਤਰ੍ਹਾਂ ਤਿਆਰ ਨਰਸਰੀ ਬੈੱਡ ਤਿਆਰ ਕਰੋ। 15-20 ਕਿਲੋ/ਹੈਕਟੇਅਰ ਦੀ ਦਰ ਨਾਲ ਬੀਜ ਬੀਜੋ।',
        feature1: 'ਸ਼ਾਨਦਾਰ ਅਨਾਜ ਗੁਣਵੱਤਾ ਨਾਲ ਉੱਚ ਝਾੜ ਸਮਰੱਥਾ',
        feature2: 'ਮੁੱਖ ਬੀਮਾਰੀਆਂ ਵਿਰੁੱਧ ਮਜ਼ਬੂਤ ਪ੍ਰਤੀਰੋਧ',
        feature3: 'ਵੱਖ-ਵੱਖ ਖੇਤੀ-ਜਲਵਾਯੂ ਖੇਤਰਾਂ ਵਿੱਚ ਅਨੁਕੂਲ',
        feature4: 'ਮੱਧ-ਅਵਧੀ ਕਿਸਮ (120-130 ਦਿਨ)',
        feature5: 'ਸ਼ੁੱਧ ਭਾਰ: 3 ਕਿਲੋ ਪ੍ਰਤੀ ਪੈਕ',
        ing1: 'ਪ੍ਰਮਾਣਿਤ F1 ਹਾਈਬ੍ਰਿਡ ਚਾਵਲ ਬੀਜ',
        ing2: 'ਬੀਜ ਸੁਰੱਖਿਆ ਲਈ ਥਿਰਮ ਫੰਗੀਸਾਈਡ ਨਾਲ ਟ੍ਰੀਟ ਕੀਤਾ',
        ing3: 'ਉਗਣ ਦੀ ਦਰ: >90%',
        badgeSafe: '100% ਸੁਰੱਖਿਅਤ',
        badgeFarmer: 'ਕਿਸਾਨ ਅਨੁਕੂਲ',
        badgeEasy: 'ਉਗਾਉਣਾ ਆਸਾਨ',
        badgeNoChemical: 'ਕੋਈ ਕਠੋਰ ਕੈਮੀਕਲ ਨਹੀਂ',
        wantToKnow: 'ਹੋਰ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?',
        faq1q: 'ਕੀ ਇਹ ਸੁਰੱਖਿਅਤ ਹੈ?',
        faq1a: 'ਹਾਂ, ਸਵਾ 7501 ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਰੱਖਿਅਤ ਅਤੇ ਪ੍ਰਮਾਣਿਤ ਉਤਪਾਦ ਹੈ।',
        faq2q: 'ਆਦਰਸ਼ ਬਿਜਾਈ ਦਾ ਮੌਸਮ ਕੀ ਹੈ?',
        faq2a: 'ਸਵਾ 7501 ਖ਼ਰੀਫ਼ ਸੀਜ਼ਨ (ਜੂਨ-ਜੁਲਾਈ) ਵਿੱਚ ਬੀਜਣ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਹੈ।',
        stayConnected: 'ਜੁੜੇ ਰਹੋ, ਜਾਣਕਾਰ ਰਹੋ',
        subscribeDesc: 'ਵਿਸ਼ੇਸ਼ ਅੱਪਡੇਟ, ਟਿਪਸ ਅਤੇ ਪ੍ਰਮੋਸ਼ਨ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਸਬਸਕ੍ਰਾਈਬ ਕਰੋ।',
        emailPlaceholder: 'ਆਪਣਾ ਈਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ',
        selectJacket: 'ਬ੍ਰਾਂਡ ਜੈਕੇਟ ਚੁਣੋ:',
    }
};

// ── DOM References ──
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── Initialization ──
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initLanguage();
    initAccordions();
    initRecording();
    initSubscribe();
    initCarousel();
});

// ── Carousel ──
function initCarousel() {
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

// ── Navigation ──
function initNavigation() {
    const navItems = $$('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateTo(page);
        });
    });

    // Feature cards click to navigate
    $('#feature-record')?.addEventListener('click', () => navigateTo('record'));
    $('#feature-brand')?.addEventListener('click', () => navigateTo('record'));
    $('#feature-share')?.addEventListener('click', () => navigateTo('record'));

    // Home video preview click
    $('#home-video-preview')?.addEventListener('click', () => navigateTo('record'));

    // Notice Board click
    $('#badge-btn')?.addEventListener('click', () => navigateTo('notice'));
}

function navigateTo(page) {
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

// ── Language ──
function initLanguage() {
    const langToggle = $('#lang-toggle');
    const langModal = $('#lang-modal');
    const langOptions = $$('.lang-option');
    const backdrop = langModal?.querySelector('.lang-modal-backdrop');

    langToggle?.addEventListener('click', () => {
        langModal?.classList.toggle('hidden');
    });

    backdrop?.addEventListener('click', () => {
        langModal?.classList.add('hidden');
    });

    langOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const lang = opt.dataset.lang;
            state.currentLang = lang;

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

function applyTranslations(lang) {
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

// ── Accordions ──
function initAccordions() {
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

// ── Recording ──
function initRecording() {
    const btnAllow = $('#btn-allow-camera');
    const btnNotNow = $('#btn-not-now');
    const btnRecord = $('#btn-record');
    const btnRecordAgain = $('#btn-record-again');
    const btnBackHome = $('#btn-back-home');
    const btnSwitchCamera = $('#btn-switch-camera');
    const btnDownload = $('#btn-download');

    btnAllow?.addEventListener('click', async () => {
        await requestCamera();
    });

    btnNotNow?.addEventListener('click', () => {
        navigateTo('home');
    });

    btnRecord?.addEventListener('click', () => {
        if (state.isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });

    btnRecordAgain?.addEventListener('click', () => {
        showRecordStep('permission');
        state.recordedBlob = null;
    });

    btnBackHome?.addEventListener('click', () => {
        navigateTo('home');
        showRecordStep('permission');
    });

    btnSwitchCamera?.addEventListener('click', async () => {
        state.facingMode = state.facingMode === 'user' ? 'environment' : 'user';
        if (state.stream) {
            state.stream.getTracks().forEach(t => t.stop());
        }
        await requestCamera();
    });

    btnDownload?.addEventListener('click', () => {
        downloadBrandJacketedVideo();
    });
}

async function requestCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: state.facingMode,
                width: { ideal: 720 },
                height: { ideal: 1280 },
            },
            audio: true
        });
        state.stream = stream;
        const preview = $('#camera-preview');
        if (preview) {
            preview.srcObject = stream;
        }
        showRecordStep('camera');
    } catch (err) {
        console.error('Camera access denied:', err);
        alert('Camera access was denied. Please allow camera access to record.');
    }
}

function showRecordStep(step) {
    $$('.record-step').forEach(s => s.classList.remove('active'));
    $(`#record-step-${step}`)?.classList.add('active');
}

function startRecording() {
    if (!state.stream) return;

    state.recordedChunks = [];
    state.isRecording = true;
    state.recordingSeconds = 0;

    // Visual feedback
    const btn = $('#btn-record');
    btn?.classList.add('recording');
    const timer = $('#recording-timer');
    timer?.classList.remove('hidden');
    updateTimerDisplay();

    state.timerInterval = setInterval(() => {
        state.recordingSeconds++;
        updateTimerDisplay();

        // Auto-stop at 60 seconds
        if (state.recordingSeconds >= 60) {
            stopRecording();
        }
    }, 1000);

    // Set up MediaRecorder
    const options = { mimeType: getSupportedMimeType() };
    try {
        state.mediaRecorder = new MediaRecorder(state.stream, options);
    } catch (e) {
        state.mediaRecorder = new MediaRecorder(state.stream);
    }

    state.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
            state.recordedChunks.push(event.data);
        }
    };

    state.mediaRecorder.onstop = () => {
        const mimeType = state.mediaRecorder.mimeType || 'video/webm';
        state.recordedBlob = new Blob(state.recordedChunks, { type: mimeType });
        processRecording();
    };

    state.mediaRecorder.start(100); // Collect data every 100ms
}

function getSupportedMimeType() {
    const types = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4',
    ];
    for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return '';
}

function stopRecording() {
    state.isRecording = false;

    const btn = $('#btn-record');
    btn?.classList.remove('recording');
    const timer = $('#recording-timer');
    timer?.classList.add('hidden');

    clearInterval(state.timerInterval);

    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
        state.mediaRecorder.stop();
    }

    // Stop camera tracks
    if (state.stream) {
        state.stream.getTracks().forEach(t => t.stop());
        state.stream = null;
    }
}

function updateTimerDisplay() {
    const mins = Math.floor(state.recordingSeconds / 60).toString().padStart(2, '0');
    const secs = (state.recordingSeconds % 60).toString().padStart(2, '0');
    const display = $('#timer-display');
    if (display) display.textContent = `${mins}:${secs}`;
}

function processRecording() {
    // Show processing step
    showRecordStep('processing');

    // Reset animation
    const bar = $('.processing-bar-fill');
    if (bar) {
        bar.style.animation = 'none';
        bar.offsetHeight; // Force reflow
        bar.style.animation = 'progress-fill 3s ease-in-out forwards';
    }

    // After processing delay, show brand-jacketed preview
    setTimeout(() => {
        showBrandJacketedPreview();
    }, 3200);
}

function showBrandJacketedPreview() {
    showRecordStep('preview');

    const container = $('#preview-video-container');
    if (!container || !state.recordedBlob) return;

    // Clear previous content
    container.innerHTML = '';

    // Determine which jacket to use based on language
    const jacketSrc = state.selectedJacket === 'punjabi' ? 'assets/Punjabi.jpeg' : 'assets/Hindi.jpeg';

    // Create brand-jacketed layout
    const wrapper = document.createElement('div');
    wrapper.className = 'jacket-preview-container';
    wrapper.style.cssText = 'position:relative;width:100%;height:100%;overflow:hidden;background:#000;';

    // Video element (positioned in the green screen area)
    const video = document.createElement('video');
    video.id = 'preview-video';
    video.controls = true;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = true;
    video.src = URL.createObjectURL(state.recordedBlob);

    // We'll use a canvas-based approach for the brand jacketing
    const canvas = document.createElement('canvas');
    canvas.id = 'brand-jacket-canvas';
    canvas.style.cssText = 'width:100%;height:100%;display:block;';

    // Load the jacket image
    const jacketImg = new Image();
    jacketImg.crossOrigin = 'anonymous';
    jacketImg.src = jacketSrc;

    jacketImg.onload = () => {
        // Set canvas to jacket aspect ratio (9:16 portrait)
        canvas.width = jacketImg.naturalWidth;
        canvas.height = jacketImg.naturalHeight;

        video.addEventListener('loadeddata', () => {
            renderBrandJacketFrame(canvas, video, jacketImg);
        });

        video.addEventListener('play', () => {
            function drawLoop() {
                if (!video.paused && !video.ended) {
                    renderBrandJacketFrame(canvas, video, jacketImg);
                    requestAnimationFrame(drawLoop);
                }
            }
            drawLoop();
        });

        // Add click handler to play/pause
        canvas.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    };

    // Hide the raw video, show canvas
    video.style.display = 'none';
    wrapper.appendChild(video);
    wrapper.appendChild(canvas);
    container.appendChild(wrapper);

    // Add jacket selector below
    addJacketSelector(container);

    video.play().catch(() => {});
}

function renderBrandJacketFrame(canvas, video, jacketImg) {
    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;

    const greenArea = {
        x: cw * 0.18,
        y: ch * 0.24,
        w: cw * 0.64,
        h: ch * 0.48,
    };

    const r = 16;
    const videoAspect = video.videoWidth / video.videoHeight;
    const areaAspect = greenArea.w / greenArea.h;

    let drawX, drawY, drawW, drawH;

    if (videoAspect > areaAspect) {
        drawH = greenArea.h;
        drawW = drawH * videoAspect;
        drawX = greenArea.x + (greenArea.w - drawW) / 2;
        drawY = greenArea.y;
    } else {
        drawW = greenArea.w;
        drawH = drawW / videoAspect;
        drawX = greenArea.x;
        drawY = greenArea.y + (greenArea.h - drawH) / 2;
    }

    // Clear canvas
    ctx.clearRect(0, 0, cw, ch);

    // 1. Draw video in green area (clipped to rounded rect)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(greenArea.x + r, greenArea.y);
    ctx.lineTo(greenArea.x + greenArea.w - r, greenArea.y);
    ctx.quadraticCurveTo(greenArea.x + greenArea.w, greenArea.y, greenArea.x + greenArea.w, greenArea.y + r);
    ctx.lineTo(greenArea.x + greenArea.w, greenArea.y + greenArea.h - r);
    ctx.quadraticCurveTo(greenArea.x + greenArea.w, greenArea.y + greenArea.h, greenArea.x + greenArea.w - r, greenArea.y + greenArea.h);
    ctx.lineTo(greenArea.x + r, greenArea.y + greenArea.h);
    ctx.quadraticCurveTo(greenArea.x, greenArea.y + greenArea.h, greenArea.x, greenArea.y + greenArea.h - r);
    ctx.lineTo(greenArea.x, greenArea.y + r);
    ctx.quadraticCurveTo(greenArea.x, greenArea.y, greenArea.x + r, greenArea.y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(video, drawX, drawY, drawW, drawH);
    ctx.restore();

    // 2. Draw processed jacket (green removed) on top — cached for performance
    const processedJacket = getProcessedJacket(jacketImg, cw, ch);
    ctx.drawImage(processedJacket, 0, 0, cw, ch);
}

// ── Cached green-screen-removed jacket ──
let _cachedJacketCanvas = null;
let _cachedJacketKey = null;

function getProcessedJacket(jacketImg, cw, ch) {
    const key = jacketImg.src + '|' + cw + 'x' + ch;
    if (_cachedJacketKey === key && _cachedJacketCanvas) {
        return _cachedJacketCanvas;
    }

    const offscreen = document.createElement('canvas');
    offscreen.width = cw;
    offscreen.height = ch;
    const octx = offscreen.getContext('2d');
    octx.drawImage(jacketImg, 0, 0, cw, ch);

    const imageData = octx.getImageData(0, 0, cw, ch);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Detect green-screen pixels (bright green)
        if (g > 100 && g > r * 1.4 && g > b * 1.4 && r < 180 && b < 180) {
            data[i + 3] = 0; // make transparent
        }
    }

    octx.putImageData(imageData, 0, 0);
    _cachedJacketCanvas = offscreen;
    _cachedJacketKey = key;
    return offscreen;
}

// ── MP4 Download using WebCodecs + mp4-muxer ──

function waitForSeek(video) {
    return new Promise((resolve) => {
        if (video.seeking) {
            video.addEventListener('seeked', resolve, { once: true });
        } else {
            resolve();
        }
    });
}

function loadImageAsync(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function setDownloadButtonState(text, disabled) {
    const btn = $('#btn-download');
    if (!btn) return;
    btn.disabled = disabled;
    if (disabled) {
        btn.innerHTML = `<span class="download-spinner"></span> ${text}`;
    } else {
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg> DOWNLOAD MP4`;
    }
}

async function downloadBrandJacketedVideo() {
    if (!state.recordedBlob) return;

    // Check for WebCodecs + mp4-muxer support
    const hasWebCodecs = typeof VideoEncoder !== 'undefined' && typeof VideoFrame !== 'undefined';
    const hasMuxer = typeof Mp4Muxer !== 'undefined';

    if (!hasWebCodecs || !hasMuxer) {
        // Fallback: download raw recording as-is
        console.warn('WebCodecs or mp4-muxer not available, falling back to raw download.');
        downloadBlob(state.recordedBlob, `Savannah-Farmer-Video-${Date.now()}.webm`);
        alert('MP4 export requires a modern browser (Chrome 94+). Downloaded as WebM instead.');
        return;
    }

    setDownloadButtonState('Preparing...', true);

    try {
        // 1. Load jacket image
        const jacketSrc = state.selectedJacket === 'punjabi' ? 'assets/Punjabi.jpeg' : 'assets/Hindi.jpeg';
        const jacketImg = await loadImageAsync(jacketSrc);

        // 2. Create an offscreen canvas matching jacket dimensions
        const exportCanvas = document.createElement('canvas');
        // Use a reasonable export size (scale down if jacket is huge)
        const maxDim = 1080;
        let ew = jacketImg.naturalWidth;
        let eh = jacketImg.naturalHeight;
        if (eh > maxDim) {
            const scale = maxDim / eh;
            ew = Math.round(ew * scale);
            eh = maxDim;
        }
        // Ensure even dimensions (required by H.264)
        ew = ew % 2 === 0 ? ew : ew + 1;
        eh = eh % 2 === 0 ? eh : eh + 1;
        exportCanvas.width = ew;
        exportCanvas.height = eh;

        // Pre-cache the processed jacket at export resolution
        getProcessedJacket(jacketImg, ew, eh);

        // 3. Create source video element for seeking
        const sourceVideo = document.createElement('video');
        sourceVideo.muted = true;
        sourceVideo.playsInline = true;
        sourceVideo.preload = 'auto';
        sourceVideo.src = URL.createObjectURL(state.recordedBlob);

        await new Promise((resolve, reject) => {
            sourceVideo.oncanplay = () => {
                sourceVideo.oncanplay = null; // Ensure it only fires once
                if (sourceVideo.duration === Infinity || isNaN(sourceVideo.duration)) {
                    sourceVideo.currentTime = 1e8; // Seek to the end
                    sourceVideo.onseeked = () => {
                        sourceVideo.onseeked = null;
                        sourceVideo.currentTime = 0; // Seek back
                        resolve();
                    };
                } else {
                    resolve();
                }
            };
            sourceVideo.onerror = () => reject(new Error('Failed to load video'));
        });

        // Ensure we wait for the seek back to 0 to complete if needed
        if (sourceVideo.currentTime !== 0) {
            await new Promise(r => {
                sourceVideo.onseeked = () => {
                    sourceVideo.onseeked = null;
                    r();
                };
            });
        }

        let duration = sourceVideo.duration;
        if (duration === Infinity || isNaN(duration)) {
             // Fallback if browser still fails
             duration = 5.0; // Assume 5 seconds
        }
        const fps = 24;
        const totalFrames = Math.ceil(duration * fps);
        const frameDurationUs = Math.round(1_000_000 / fps);

        setDownloadButtonState('Encoding 0%...', true);

        // 4. Setup mp4-muxer
        const muxerConfig = {
            target: new Mp4Muxer.ArrayBufferTarget(),
            video: {
                codec: 'avc',
                width: ew,
                height: eh,
            },
            fastStart: 'in-memory',
            firstTimestampBehavior: 'offset',
        };

        // Try to include audio
        let includeAudio = false;
        let audioBuffer = null;
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const arrayBuf = await state.recordedBlob.arrayBuffer();
            audioBuffer = await audioCtx.decodeAudioData(arrayBuf);
            audioCtx.close();

            if (typeof AudioEncoder !== 'undefined') {
                const numberOfChannels = Math.min(audioBuffer.numberOfChannels, 2);
                const sampleRate = audioBuffer.sampleRate;
                muxerConfig.audio = {
                    codec: 'aac',
                    numberOfChannels: numberOfChannels,
                    sampleRate: sampleRate,
                };
                includeAudio = true;
            }
        } catch (audioErr) {
            console.warn('Audio decoding failed, exporting video-only:', audioErr);
        }

        const muxer = new Mp4Muxer.Muxer(muxerConfig);

        // 5. Setup VideoEncoder
        let videoEncoderDone = false;
        const videoEncoder = new VideoEncoder({
            output: (chunk, meta) => {
                muxer.addVideoChunk(chunk, meta);
            },
            error: (e) => console.error('VideoEncoder error:', e),
        });

        videoEncoder.configure({
            codec: 'avc1.42001f', // H.264 Baseline Profile
            width: ew,
            height: eh,
            bitrate: 2_500_000,
            framerate: fps,
        });

        // 6. Encode video frames by seeking through the source video
        for (let i = 0; i < totalFrames; i++) {
            const targetTime = Math.min(i / fps, duration - 0.001);
            sourceVideo.currentTime = targetTime;
            await waitForSeek(sourceVideo);

            // Small delay to ensure the frame is ready
            await new Promise(r => setTimeout(r, 10));

            // Render brand-jacketed frame onto export canvas
            renderBrandJacketFrame(exportCanvas, sourceVideo, jacketImg);

            // Create VideoFrame from canvas
            const timestamp = i * frameDurationUs;
            const frame = new VideoFrame(exportCanvas, {
                timestamp: timestamp,
                duration: frameDurationUs,
            });

            const keyFrame = i % (fps * 2) === 0;
            videoEncoder.encode(frame, { keyFrame });
            frame.close();

            // Update progress
            const progress = Math.round((i / totalFrames) * 100);
            setDownloadButtonState(`Encoding ${progress}%...`, true);

            // Yield to UI thread periodically and prevent encoder queue overflow
            if (i % 5 === 0) {
                await new Promise(r => setTimeout(r, 0));
            }
            // Backpressure: don't overload the encoder
            while (videoEncoder.encodeQueueSize > 30) {
                await new Promise(r => setTimeout(r, 10));
            }
        }

        await videoEncoder.flush();
        videoEncoder.close();

        // 7. Encode audio if available
        if (includeAudio && audioBuffer) {
            setDownloadButtonState('Encoding audio...', true);

            const numberOfChannels = Math.min(audioBuffer.numberOfChannels, 2);
            const sampleRate = audioBuffer.sampleRate;

            const audioEncoder = new AudioEncoder({
                output: (chunk, meta) => {
                    muxer.addAudioChunk(chunk, meta);
                },
                error: (e) => console.error('AudioEncoder error:', e),
            });

            audioEncoder.configure({
                codec: 'mp4a.40.2', // AAC-LC
                numberOfChannels: numberOfChannels,
                sampleRate: sampleRate,
                bitrate: 128_000,
            });

            // Feed audio in chunks of 1024 samples
            const chunkSize = 1024;
            const totalSamples = audioBuffer.length;

            for (let offset = 0; offset < totalSamples; offset += chunkSize) {
                const numFrames = Math.min(chunkSize, totalSamples - offset);

                // Build planar Float32Array: [ch0_samples][ch1_samples]...
                const planarData = new Float32Array(numFrames * numberOfChannels);
                for (let ch = 0; ch < numberOfChannels; ch++) {
                    const channelData = audioBuffer.getChannelData(ch);
                    planarData.set(
                        channelData.subarray(offset, offset + numFrames),
                        ch * numFrames
                    );
                }

                const audioData = new AudioData({
                    format: 'f32-planar',
                    sampleRate: sampleRate,
                    numberOfFrames: numFrames,
                    numberOfChannels: numberOfChannels,
                    timestamp: Math.round((offset / sampleRate) * 1_000_000),
                    data: planarData,
                });

                audioEncoder.encode(audioData);
                audioData.close();

                // Yield periodically
                if ((offset / chunkSize) % 50 === 0) {
                    await new Promise(r => setTimeout(r, 0));
                }
            }

            await audioEncoder.flush();
            audioEncoder.close();
        }

        // 8. Finalize and download
        muxer.finalize();

        setDownloadButtonState('Downloading...', true);

        const mp4Blob = new Blob([muxer.target.buffer], { type: 'video/mp4' });
        downloadBlob(mp4Blob, `Savannah-Farmer-Video-${Date.now()}.mp4`);

        // Cleanup
        URL.revokeObjectURL(sourceVideo.src);

    } catch (err) {
        console.error('MP4 export failed:', err);
        // Fallback: download raw recording
        downloadBlob(state.recordedBlob, `Savannah-Farmer-Video-${Date.now()}.webm`);
        alert('MP4 export encountered an error. Downloaded as WebM instead.\n\nError: ' + err.message);
    } finally {
        setDownloadButtonState('DOWNLOAD MP4', false);
    }
}

function addJacketSelector(parentContainer) {
    // Check if selector already exists
    const existingSelector = parentContainer.parentElement?.querySelector('.jacket-selector-container');
    if (existingSelector) existingSelector.remove();

    const container = document.createElement('div');
    container.className = 'jacket-selector-container';

    const label = document.createElement('h3');
    label.className = 'jacket-selector-label';
    label.textContent = translations[state.currentLang]?.selectJacket || 'Select Brand Jacket';

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'jacket-options-wrapper';

    const hindiOpt = createJacketOption('hindi', 'assets/Hindi.jpeg', 'Hindi');
    const punjabiOpt = createJacketOption('punjabi', 'assets/Punjabi.jpeg', 'Punjabi');

    if (state.selectedJacket === 'hindi') hindiOpt.classList.add('selected');
    else punjabiOpt.classList.add('selected');

    optionsContainer.appendChild(hindiOpt);
    optionsContainer.appendChild(punjabiOpt);

    container.appendChild(label);
    container.appendChild(optionsContainer);

    // Insert after the preview container
    parentContainer.after(container);
}

function createJacketOption(jacketId, imgSrc, label) {
    const opt = document.createElement('div');
    opt.className = 'jacket-option';
    opt.dataset.jacket = jacketId;

    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'jacket-img-wrapper';
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = `${label} Jacket`;
    imgWrapper.appendChild(img);

    const checkIcon = document.createElement('div');
    checkIcon.className = 'jacket-check-icon';
    checkIcon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="white" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    imgWrapper.appendChild(checkIcon);

    const textSpan = document.createElement('span');
    textSpan.className = 'jacket-label';
    textSpan.textContent = label;

    opt.appendChild(imgWrapper);
    opt.appendChild(textSpan);

    opt.addEventListener('click', () => {
        state.selectedJacket = jacketId;
        $$('.jacket-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');

        // Re-render with new jacket
        showBrandJacketedPreview();
    });

    return opt;
}

// ── Subscribe ──
function initSubscribe() {
    const btn = $('#subscribe-btn');
    const input = $('#subscribe-email');

    btn?.addEventListener('click', () => {
        const email = input?.value?.trim();
        if (email && email.includes('@')) {
            alert('Thank you for subscribing! 🌾');
            if (input) input.value = '';
        } else {
            alert('Please enter a valid email address.');
        }
    });
}
