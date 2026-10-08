// Subscribe
window.initSubscribe = function() {
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

const openFarmerModal = (el) => {
    if(farmerModalName) farmerModalName.textContent = el.dataset.name;
    if(farmerModalLoc) farmerModalLoc.textContent = el.dataset.loc;
    if(farmerModalYield) farmerModalYield.textContent = el.dataset.yield;
    if(farmerModalQuote) farmerModalQuote.textContent = el.dataset.quote;
    if(farmerModalPlayer) {
        farmerModalPlayer.src = el.dataset.video;
        farmerModalPlayer.play().catch(e => console.log('Autoplay prevented', e));
    }
    
    if(farmerModal) {
        farmerModal.classList.add('open');
        farmerModal.setAttribute('aria-hidden', 'false');
    }
};

farmerVideoCards.forEach(card => {
    card.addEventListener('click', () => openFarmerModal(card));
});

const watchVideoBtns = document.querySelectorAll('.watch-video-btn');
watchVideoBtns.forEach(btn => {
    btn.addEventListener('click', () => openFarmerModal(btn));
});

if (farmerModalClose && farmerModal) {
    farmerModalClose.addEventListener('click', () => {
        farmerModal.classList.remove('open');
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
        const text = '#UpajDikhaoInaamPao #upajkadhurandar';
        
        if (!state.recordedBlob) return;

        // Show loading state on button
        const originalHtml = btnShareFb.innerHTML;
        btnShareFb.innerHTML = '<span class="download-spinner"></span> Preparing...';
        btnShareFb.style.pointerEvents = 'none';

        try {
            // Use the already generated jacketed blob, or fallback
            const blobToShare = state.jacketedBlob || state.recordedBlob;
            if (!blobToShare) throw new Error("Could not find video");

            // Try sharing directly using the Web Share API (Files support)
            if (navigator.share && navigator.canShare) {
                try {
                    const ext = blobToShare.type.includes('mp4') ? 'mp4' : 'webm';
                    const file = new File([blobToShare], `Savannah-Farmer-Video-${Date.now()}.${ext}`, { type: blobToShare.type });
                    
                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            title: 'Savannah Seeds Contest',
                            text: text,
                            files: [file]
                        });
                        console.log('Video shared successfully');
                        return; // Stop here if native file sharing worked
                    }
                } catch (err) {
                    console.warn('Native file share failed or cancelled:', err);
                    if (err.name === 'AbortError') return;
                }
            }

            // Fallback: Desktop or unsupported browsers
            const ext = blobToShare.type.includes('mp4') ? 'mp4' : 'webm';
            const url = URL.createObjectURL(blobToShare);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `Savannah-Farmer-Video-${Date.now()}.${ext}`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 100);
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).catch(e => console.warn('Clipboard failed:', e));
            }
            
            window.open('https://www.facebook.com/', '_blank');
        } catch (err) {
            console.error("Share error:", err);
        } finally {
            // Restore button state
            btnShareFb.innerHTML = originalHtml;
            btnShareFb.style.pointerEvents = 'auto';
        }
    });
}
