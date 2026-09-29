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
        navHome: 'HOME',
        navRecord: 'RECORD',
        navProduct: 'PRODUCT',
        contestTitle: 'Show your crop, win a prize!',
        contestStep1: 'Make a video with your crop',
        contestStep2: 'Share it on Facebook',
        contestStep3: 'Follow our Facebook page',
        recordVideoBtn: 'Make a Video',
        videoTutorial: 'How to Record Video',
        videoTutorialLabel: 'Tutorial: How to Record Your Story',
        testimonialsTitle: 'Farmer Stories & Videos',
        testimonialsSubtitle: 'Real video experiences from Sava 7501 growers',
        watchStory: 'Watch Video',
        termsHeading: 'Terms & Conditions',
        campaignTitle: 'Campaign: Show crop, win prize!',
        hl1Title: '1. Make a video',
        hl1Desc: 'Short video with your crop',
        hl2Title: '2. Share on FB',
        hl2Desc: '#FasalDikhaoInaamPao',
        hl3Title: '3. Lucky Draw',
        hl3Desc: 'Selection from Eligible Entries',
        termsAccordionTitle: 'Terms & Conditions (10 Official Rules)',
        rule1: 'To participate, create a short video with your crop.',
        rule2: 'Share the video on your Facebook Profile/Page using #FasalDikhaoInaamPao.',
        rule3: 'Follow the official Savannah Seeds Facebook Page.',
        rule4: 'Multiple entries are allowed, but only valid entries will be considered.',
        rule5: 'Winners will be selected via Lucky Draw from eligible entries.',
        rule6: 'Prizes will be distributed after verifying participant details.',
        rule7: 'Winners will be contacted via Facebook or Phone.',
        rule8: 'Prizes are subject to verification.',
        rule9: 'By participating, you allow Savannah Seeds to use your video for campaign communication.',
        rule10: 'Participation implies agreement with these Terms & Conditions.',
        disclaimerFooter: 'Savannah Seeds India Pvt. Ltd. • All Rights Reserved',
        shareFacebook: 'Share on Facebook',
        shareInstagram: 'Share on Instagram',
        regWelcome: 'Welcome',
        regDesc: 'Please enter your details to access the app',
        regNameLabel: 'Name',
        regNamePlaceholder: 'Enter your name',
        regLocLabel: 'Location',
        regLocPlaceholder: 'Enter your location',
        regMobLabel: 'Mobile Number',
        regMobPlaceholder: 'Enter your mobile number',
        regBtn: 'Continue',
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
        navHome: 'होम',
        navRecord: 'रिकॉर्ड',
        navProduct: 'उत्पाद',
        contestTitle: 'अपनी फसल दिखाएं, इनाम जीतें!',
        contestStep1: 'अपनी फसल के साथ एक वीडियो बनाएं',
        contestStep2: 'इसे Facebook पर शेयर करें',
        contestStep3: 'हमारे Facebook पेज को फॉलो करें',
        recordVideoBtn: 'वीडियो बनाएं',
        videoTutorial: 'वीडियो कैसे रिकॉर्ड करें',
        videoTutorialLabel: 'ट्यूटोरियल: अपनी कहानी कैसे रिकॉर्ड करें',
        testimonialsTitle: 'किसान की कहानियाँ और वीडियो',
        testimonialsSubtitle: 'सवा 7501 उगाने वालों के वास्तविक वीडियो अनुभव',
        watchStory: 'वीडियो देखें',
        termsHeading: 'नियम और शर्तें',
        campaignTitle: 'Campaign: फसल दिखाओ, इनाम पाओ!',
        hl1Title: '1. वीडियो बनाएं',
        hl1Desc: 'फसल के साथ छोटा वीडियो',
        hl2Title: '2. FB पर शेयर',
        hl2Desc: '#FasalDikhaoInaamPao',
        hl3Title: '3. Lucky Draw',
        hl3Desc: 'Eligible Entries में से चयन',
        termsAccordionTitle: 'Terms & Conditions (10 Official Rules)',
        rule1: 'प्रतिभागी अपनी फसल के साथ एक छोटा वीडियो रिकॉर्ड करें।',
        rule2: 'वीडियो को अपने Facebook Profile/Page पर #FasalDikhaoInaamPao के साथ पोस्ट करें।',
        rule3: 'Savannah Seeds के Facebook Page को Follow करें।',
        rule4: 'एक किसान एकाधिक बार Campaign में भाग ले सकता है, लेकिन Valid Entries ही लकी ड्रॉ के लिए मानी जाएंगी।',
        rule5: 'सभी Eligible Entries में से Winners का चयन Lucky Draw के माध्यम से किया जाएगा।',
        rule6: 'Winner घोषित होने पर, एंट्री और Participant Details Verify होने के बाद इनाम दिया जाएगा।',
        rule7: 'Winners को Facebook / Phone के माध्यम से संपर्क किया जाएगा।',
        rule8: 'Verification के बाद Prize प्रदान किया जाएगा।',
        rule9: 'Winner के Photos/Videos को उनकी सहमति से Campaign Communication में उपयोग किया जा सकता है।',
        rule10: 'Campaign में भाग लेने का अर्थ है कि प्रतिभागी इन Terms & Conditions से सहमत है।',
        disclaimerFooter: 'Savannah Seeds India Pvt. Ltd. • सर्वाधिकार सुरक्षित',
        shareFacebook: 'Facebook पर शेयर करें',
        shareInstagram: 'Instagram पर शेयर करें',
        regWelcome: 'स्वागत है',
        regDesc: 'ऐप का उपयोग करने के लिए अपना विवरण दर्ज करें',
        regNameLabel: 'नाम',
        regNamePlaceholder: 'अपना नाम दर्ज करें',
        regLocLabel: 'स्थान',
        regLocPlaceholder: 'अपना स्थान दर्ज करें',
        regMobLabel: 'मोबाइल नंबर',
        regMobPlaceholder: 'अपना मोबाइल नंबर दर्ज करें',
        regBtn: 'जारी रखें',
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
        navHome: 'ਮੁੱਖ ਪੰਨਾ',
        navRecord: 'ਰਿਕਾਰਡ',
        navProduct: 'ਉਤਪਾਦ',
        contestTitle: 'ਆਪਣੀ ਫ਼ਸਲ ਦਿਖਾਓ, ਇਨਾਮ ਜਿੱਤੋ!',
        contestStep1: 'ਆਪਣੀ ਫ਼ਸਲ ਦੇ ਨਾਲ ਇੱਕ ਵੀਡੀਓ ਬਣਾਓ',
        contestStep2: "ਇਸਨੂੰ Facebook 'ਤੇ ਸ਼ੇਅਰ ਕਰੋ",
        contestStep3: 'ਸਾਡੇ Facebook ਪੇਜ ਨੂੰ ਫਾਲੋ ਕਰੋ',
        recordVideoBtn: 'ਵੀਡੀਓ ਬਣਾਓ',
        videoTutorial: 'ਵੀਡੀਓ ਕਿਵੇਂ ਰਿਕਾਰਡ ਕਰਨਾ ਹੈ',
        videoTutorialLabel: 'ਟਿਊਟੋਰਿਅਲ: ਆਪਣੀ ਕਹਾਣੀ ਕਿਵੇਂ ਰਿਕਾਰਡ ਕਰਨੀ ਹੈ',
        testimonialsTitle: 'ਕਿਸਾਨ ਦੀਆਂ ਕਹਾਣੀਆਂ ਅਤੇ ਵੀਡੀਓ',
        testimonialsSubtitle: 'ਸਵਾ 7501 ਉਗਾਉਣ ਵਾਲਿਆਂ ਦੇ ਅਸਲ ਵੀਡੀਓ ਅਨੁਭਵ',
        watchStory: 'ਵੀਡੀਓ ਦੇਖੋ',
        termsHeading: 'ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ',
        campaignTitle: 'Campaign: ਫ਼ਸਲ ਦਿਖਾਓ, ਇਨਾਮ ਪਾਓ!',
        hl1Title: '1. ਵੀਡੀਓ ਬਣਾਓ',
        hl1Desc: 'ਫ਼ਸਲ ਦੇ ਨਾਲ ਛੋਟਾ ਵੀਡੀਓ',
        hl2Title: '2. FB ਤੇ ਸ਼ੇਅਰ',
        hl2Desc: '#FasalDikhaoInaamPao',
        hl3Title: '3. Lucky Draw',
        hl3Desc: 'Eligible Entries ਵਿੱਚੋਂ ਚੋਣ',
        termsAccordionTitle: 'Terms & Conditions (10 Official Rules)',
        rule1: 'ਭਾਗ ਲੈਣ ਲਈ, ਆਪਣੀ ਫ਼ਸਲ ਦੇ ਨਾਲ ਇੱਕ ਛੋਟਾ ਵੀਡੀਓ ਰਿਕਾਰਡ ਕਰੋ।',
        rule2: 'ਵੀਡੀਓ ਨੂੰ ਆਪਣੇ Facebook Profile/Page ਤੇ #FasalDikhaoInaamPao ਦੇ ਨਾਲ ਪੋਸਟ ਕਰੋ।',
        rule3: 'Savannah Seeds ਦੇ Facebook Page ਨੂੰ Follow ਕਰੋ।',
        rule4: 'ਇੱਕ ਕਿਸਾਨ ਕਈ ਵਾਰ Campaign ਵਿੱਚ ਭਾਗ ਲੈ ਸਕਦਾ ਹੈ, ਪਰ ਸਿਰਫ Valid Entries ਹੀ ਲੱਕੀ ਡਰਾਅ ਲਈ ਮੰਨੀਆਂ ਜਾਣਗੀਆਂ।',
        rule5: 'ਸਾਰੀਆਂ Eligible Entries ਵਿੱਚੋਂ Winners ਦੀ ਚੋਣ Lucky Draw ਰਾਹੀਂ ਕੀਤੀ ਜਾਵੇਗੀ।',
        rule6: 'Winner ਘੋਸ਼ਿਤ ਹੋਣ ਤੇ, ਐਂਟਰੀ ਅਤੇ Participant Details Verify ਹੋਣ ਤੋਂ ਬਾਅਦ ਇਨਾਮ ਦਿੱਤਾ ਜਾਵੇਗਾ।',
        rule7: 'Winners ਨਾਲ Facebook / Phone ਰਾਹੀਂ ਸੰਪਰਕ ਕੀਤਾ ਜਾਵੇਗਾ।',
        rule8: 'Verification ਤੋਂ ਬਾਅਦ Prize ਪ੍ਰਦਾਨ ਕੀਤਾ ਜਾਵੇਗਾ।',
        rule9: 'Winner ਦੀਆਂ Photos/Videos ਨੂੰ ਉਹਨਾਂ ਦੀ ਸਹਿਮਤੀ ਨਾਲ Campaign Communication ਵਿੱਚ ਵਰਤਿਆ ਜਾ ਸਕਦਾ ਹੈ।',
        rule10: 'Campaign ਵਿੱਚ ਭਾਗ ਲੈਣ ਦਾ ਅਰਥ ਹੈ ਕਿ ਭਾਗੀਦਾਰ ਇਹਨਾਂ Terms & Conditions ਨਾਲ ਸਹਿਮਤ ਹਨ।',
        disclaimerFooter: 'Savannah Seeds India Pvt. Ltd. • ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ',
        shareFacebook: 'Facebook ਤੇ ਸ਼ੇਅਰ ਕਰੋ',
        shareInstagram: 'Instagram ਤੇ ਸ਼ੇਅਰ ਕਰੋ',
        regWelcome: 'ਸਵਾਗਤ ਹੈ',
        regDesc: 'ਐਪ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਆਪਣੇ ਵੇਰਵੇ ਦਰਜ ਕਰੋ',
        regNameLabel: 'ਨਾਮ',
        regNamePlaceholder: 'ਆਪਣਾ ਨਾਮ ਦਰਜ ਕਰੋ',
        regLocLabel: 'ਸਥਾਨ',
        regLocPlaceholder: 'ਆਪਣਾ ਸਥਾਨ ਦਰਜ ਕਰੋ',
        regMobLabel: 'ਮੋਬਾਈਲ ਨੰਬਰ',
        regMobPlaceholder: 'ਆਪਣਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ',
        regBtn: 'ਜਾਰੀ ਰੱਖੋ',
    }
};

// ── DOM References ──
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── Initialization ──
document.addEventListener('DOMContentLoaded', () => {
    // Dismiss splash screen after loader finishes
    const splash = document.getElementById('splash-screen');
    const regModal = document.getElementById('registration-modal');
    
    // Check if user is already registered
    const isRegistered = localStorage.getItem('savannah_user');

    if (splash) {
        setTimeout(() => {
            splash.classList.add('hidden');
            // Remove from DOM after transition
            setTimeout(() => {
                splash.remove();
                if (isRegistered && regModal) {
                    regModal.classList.add('hidden');
                    setTimeout(() => regModal.remove(), 600);
                }
            }, 600);
        }, 1800);
    } else if (isRegistered && regModal) {
        regModal.classList.add('hidden');
        setTimeout(() => regModal.remove(), 600);
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
    $('#feature-record')?.addEventListener('click', () => navigateTo('product'));
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

    // Determine which jacket to use based on language (from Data URIs to prevent tainting)
    const jacketSrc = state.selectedJacket === 'punjabi' ? JACKETS_BASE64.punjabi : JACKETS_BASE64.hindi;

    // Create brand-jacketed layout
    const wrapper = document.createElement('div');
    wrapper.className = 'jacket-preview-container';
    wrapper.style.cssText = 'position:relative;width:100%;height:100%;overflow:hidden;background:#000;display:flex;align-items:center;justify-content:center;';

    // Video element (positioned in the green screen area)
    const video = document.createElement('video');
    video.id = 'preview-video';
    video.controls = false; // We'll handle playback manually
    video.playsInline = true;
    video.loop = true;
    video.src = URL.createObjectURL(state.recordedBlob);

    // We'll use a canvas-based approach for the brand jacketing
    const canvas = document.createElement('canvas');
    canvas.id = 'brand-jacket-canvas';
    canvas.style.cssText = 'max-width:100%;max-height:100%;display:block;cursor:pointer;';

    const playOverlay = document.createElement('div');
    playOverlay.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
    `;
    playOverlay.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.5);border-radius:50%;padding:16px;pointer-events:none;display:flex;transition:opacity 0.2s;';

    // Load the jacket image as Data URI
    const jacketImg = new Image();
    let jacketLoaded = false;
    let videoLoaded = false;

    function tryInitialRender() {
        if (jacketLoaded && videoLoaded) {
            try {
                renderBrandJacketFrame(canvas, video, jacketImg);
            } catch(e) {
                console.error("Initial render failed:", e);
            }
        }
    }

    jacketImg.onload = () => {
        canvas.width = jacketImg.naturalWidth;
        canvas.height = jacketImg.naturalHeight;
        jacketLoaded = true;
        tryInitialRender();
    };
    jacketImg.onerror = (e) => console.error("Failed to load jacket image", e);
    jacketImg.src = jacketSrc;

    video.addEventListener('loadeddata', () => {
        videoLoaded = true;
        tryInitialRender();
    });

    video.addEventListener('play', () => {
        playOverlay.style.opacity = '0';
        function drawLoop() {
            if (!video.paused && !video.ended) {
                try {
                    renderBrandJacketFrame(canvas, video, jacketImg);
                } catch(e) {
                    console.error("Frame render failed:", e);
                }
                requestAnimationFrame(drawLoop);
            }
        }
        drawLoop();
    });

    video.addEventListener('pause', () => {
        playOverlay.style.opacity = '1';
    });

    // Add click handler to play/pause
    canvas.addEventListener('click', () => {
        if (video.paused) {
            video.play().catch(e => console.error("Playback failed:", e));
        } else {
            video.pause();
        }
    });

    // Hide the raw video, show canvas
    video.style.display = 'none';
    wrapper.appendChild(video);
    wrapper.appendChild(canvas);
    wrapper.appendChild(playOverlay);
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
        // 1. Load jacket image from Data URI
        const jacketSrc = state.selectedJacket === 'punjabi' ? JACKETS_BASE64.punjabi : JACKETS_BASE64.hindi;
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

        const codecConfig = {
            codec: 'avc1.42001f', // H.264 Baseline Profile
            width: ew,
            height: eh,
            bitrate: 2_500_000,
            framerate: fps,
        };

        // Check if the codec is supported before configuring
        if (typeof VideoEncoder.isConfigSupported === 'function') {
            const support = await VideoEncoder.isConfigSupported(codecConfig);
            if (!support.supported) {
                throw new Error('H.264 encoding is not supported by this browser. Please use Chrome 94+ on desktop.');
            }
        }

        videoEncoder.configure(codecConfig);

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
        const errMsg = err?.message || err?.toString?.() || 'Unknown error';
        // Fallback: download raw recording
        if (state.recordedBlob) {
            downloadBlob(state.recordedBlob, `Savannah-Farmer-Video-${Date.now()}.webm`);
        }
        alert('MP4 export encountered an error. Downloaded as WebM instead.\n\nError: ' + errMsg);
    } finally {
        setDownloadButtonState('DOWNLOAD MP4', false);
    }
}

function addJacketSelector(parentContainer) {
    // Intentionally empty.
    // The jacket is now automatically selected based on the current language
    // (Hindi jacket for Hindi, Punjabi jacket for Punjabi)
    // No manual selector UI is needed.
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

// ==========================================
// Testimonial Carousel Logic
// ==========================================
const testimonialsTrack = document.getElementById('testimonials-scroll-track');
const btnTestimonialsPrev = document.getElementById('testimonials-prev');
const btnTestimonialsNext = document.getElementById('testimonials-next');
const testimonialDots = document.querySelectorAll('.testimonial-dot');

if (testimonialsTrack && btnTestimonialsPrev && btnTestimonialsNext) {
    const updateDots = (scrollLeft) => {
        const cardWidth = testimonialsTrack.clientWidth;
        const index = Math.round(scrollLeft / cardWidth);
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        if (testimonialDots[index]) {
            testimonialDots[index].classList.add('active');
        }
    };

    btnTestimonialsPrev.addEventListener('click', () => {
        testimonialsTrack.scrollBy({ left: -testimonialsTrack.clientWidth, behavior: 'smooth' });
    });

    btnTestimonialsNext.addEventListener('click', () => {
        testimonialsTrack.scrollBy({ left: testimonialsTrack.clientWidth, behavior: 'smooth' });
    });

    testimonialsTrack.addEventListener('scroll', () => {
        updateDots(testimonialsTrack.scrollLeft);
    });
    
    // Initial dot setup
    testimonialDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            testimonialsTrack.scrollTo({ left: index * testimonialsTrack.clientWidth, behavior: 'smooth' });
        });
    });
}

// ==========================================
// Farmer Video Modal Logic
// ==========================================
const farmerModal = document.getElementById('farmer-video-modal');
const farmerModalClose = document.getElementById('farmer-modal-close');
const farmerModalPlayer = document.getElementById('farmer-modal-player');
const farmerModalName = document.getElementById('farmer-modal-name');
const farmerModalLoc = document.getElementById('farmer-modal-loc');
const farmerModalYield = document.getElementById('farmer-modal-yield');
const farmerModalQuote = document.getElementById('farmer-modal-quote');
const farmerVideoCards = document.querySelectorAll('.farmer-video-thumb-wrap');

farmerVideoCards.forEach(card => {
    card.addEventListener('click', () => {
        if(farmerModalName) farmerModalName.textContent = card.dataset.name;
        if(farmerModalLoc) farmerModalLoc.textContent = card.dataset.loc;
        if(farmerModalYield) farmerModalYield.textContent = card.dataset.yield;
        if(farmerModalQuote) farmerModalQuote.textContent = card.dataset.quote;
        if(farmerModalPlayer) {
            farmerModalPlayer.src = card.dataset.video;
            farmerModalPlayer.play().catch(e => console.log('Autoplay prevented', e));
        }
        
        if(farmerModal) {
            farmerModal.classList.add('show');
            farmerModal.setAttribute('aria-hidden', 'false');
        }
    });
});

if (farmerModalClose && farmerModal) {
    farmerModalClose.addEventListener('click', () => {
        farmerModal.classList.remove('show');
        farmerModal.setAttribute('aria-hidden', 'true');
        if(farmerModalPlayer) farmerModalPlayer.pause();
    });
}

// ==========================================
// Terms & Conditions Accordion Logic
// ==========================================
const disclaimerToggleBtn = document.getElementById('disclaimer-toggle-btn');
const disclaimerContent = document.getElementById('disclaimer-content');

if (disclaimerToggleBtn && disclaimerContent) {
    disclaimerToggleBtn.addEventListener('click', () => {
        const isExpanded = disclaimerToggleBtn.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            disclaimerToggleBtn.setAttribute('aria-expanded', 'false');
            disclaimerToggleBtn.classList.remove('expanded');
            disclaimerContent.classList.add('hidden');
        } else {
            disclaimerToggleBtn.setAttribute('aria-expanded', 'true');
            disclaimerToggleBtn.classList.add('expanded');
            disclaimerContent.classList.remove('hidden');
        }
    });
}

// ==========================================
// Make a Video CTA Logic
// ==========================================
const contestRecordBtn = document.getElementById('contest-record-btn');
const navRecordBtn = document.getElementById('nav-record');
if (contestRecordBtn && navRecordBtn) {
    contestRecordBtn.addEventListener('click', () => {
        // Trigger a click on the main bottom navigation record button
        navRecordBtn.click();
        // Also scroll to top if needed
        window.scrollTo(0, 0);
    });
}

// ==========================================
// Facebook Share Logic
// ==========================================
const btnShareFb = document.getElementById('btn-share-fb');
if (btnShareFb) {
    btnShareFb.addEventListener('click', async () => {
        const text = '#FasalDikhaoInaamPao';
        
        // If we have a recorded blob, try sharing it directly using the Web Share API (Files support)
        if (navigator.share && state.recordedBlob) {
            try {
                // Convert Blob to File object
                const ext = state.recordedBlob.type.includes('mp4') ? 'mp4' : 'webm';
                const file = new File([state.recordedBlob], `Savannah-Farmer-Video-${Date.now()}.${ext}`, { type: state.recordedBlob.type });
                
                // Check if browser supports sharing files
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'Savannah Seeds Contest',
                        text: text,
                        files: [file]
                    });
                    console.log('Video shared successfully');
                    return; // Stop here if native file sharing worked
                }
            } catch (err) {
                console.warn('Native file share failed, falling back:', err);
                // Continue to fallback
            }
        }
        
        // Fallback: Just open Facebook sharing dialog with text (since we can't auto-attach local files in FB Sharer)
        // Note: Facebook Sharer doesn't support local file paths, so we encourage the user to download first.
        alert(
            (translations[state.currentLang]?.downloadPrompt || 'Please download the video first to upload it to Facebook.') + '\n\n' +
            'Caption: ' + text
        );
        // Optionally copy the hashtag to clipboard
        navigator.clipboard.writeText(text).catch(() => {});
        
        // Open Facebook (User will have to manually attach the video)
        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://www.facebook.com/hashtag/FasalDikhaoInaamPao')}&quote=${encodeURIComponent(text)}`;
        window.open(fbShareUrl, '_blank', 'width=600,height=400');
    });
}

// ==========================================
// Instagram Share Logic
// ==========================================
const btnShareIg = document.getElementById('btn-share-ig');
if (btnShareIg) {
    btnShareIg.addEventListener('click', async () => {
        const text = '#FasalDikhaoInaamPao';
        
        // If we have a recorded blob, try sharing it directly using the Web Share API (Files support)
        if (navigator.share && state.recordedBlob) {
            try {
                // Convert Blob to File object
                const ext = state.recordedBlob.type.includes('mp4') ? 'mp4' : 'webm';
                const file = new File([state.recordedBlob], `Savannah-Farmer-Video-${Date.now()}.${ext}`, { type: state.recordedBlob.type });
                
                // Check if browser supports sharing files
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'Savannah Seeds Contest',
                        text: text,
                        files: [file]
                    });
                    console.log('Video shared successfully');
                    return; // Stop here if native file sharing worked
                }
            } catch (err) {
                console.warn('Native file share failed, falling back:', err);
            }
        }
        
        // Fallback: Just alert user to download and open Instagram.
        // Instagram does not have a web sharer that accepts pre-filled video/text.
        alert(
            (translations[state.currentLang]?.downloadPrompt || 'Please download the video first to upload it to Instagram.') + '\n\n' +
            'Caption: ' + text
        );
        // Optionally copy the hashtag to clipboard
        navigator.clipboard.writeText(text).catch(() => {});
        
        // Open Instagram (User will have to manually attach the video and paste caption)
        window.open('https://www.instagram.com/', '_blank');
    });
}
