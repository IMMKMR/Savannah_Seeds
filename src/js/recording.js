// Recording
window.initRecording = function() {
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

window.requestCamera = async function() {
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

window.showRecordStep = function(step) {
    $$('.record-step').forEach(s => s.classList.remove('active'));
    $(`#record-step-${step}`)?.classList.add('active');
}

window.startRecording = function() {
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

window.getSupportedMimeType = function() {
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

window.stopRecording = function() {
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

window.updateTimerDisplay = function() {
    const mins = Math.floor(state.recordingSeconds / 60).toString().padStart(2, '0');
    const secs = (state.recordingSeconds % 60).toString().padStart(2, '0');
    const display = $('#timer-display');
    if (display) display.textContent = `${mins}:${secs}`;
}

window.processRecording = function() {
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

window.showBrandJacketedPreview = function() {
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

window.renderBrandJacketFrame = function(canvas, video, jacketImg) {
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