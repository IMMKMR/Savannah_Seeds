// Recording
window.initRecording = function() {
    const btnAllow = $('#btn-allow-camera');
    const btnNotNow = $('#btn-not-now');
    const btnRecord = $('#btn-record');
    const btnRecordAgain = $('#btn-record-again');
    const btnBackHome = $('#btn-back-home');
    const btnSwitchCamera = $('#btn-switch-camera');
    const btnDownload = $('#btn-download');
    const btnUploadVideo = $('#btn-upload-video');
    const fabUploadBtn = $('#fab-upload-btn');
    const uploadVideoInput = $('#upload-video-input');

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
        const previewVideo = document.getElementById('preview-video');
        if (previewVideo) {
            previewVideo.pause();
            previewVideo.removeAttribute('src'); // Stop loading
            previewVideo.load();
        }
        showRecordStep('permission');
        state.recordedBlob = null;
        state.jacketedBlob = null;
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

    btnUploadVideo?.addEventListener('click', () => {
        uploadVideoInput?.click();
    });

    fabUploadBtn?.addEventListener('click', () => {
        uploadVideoInput?.click();
    });

    uploadVideoInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Stop camera if running
        if (state.stream) {
            state.stream.getTracks().forEach(t => t.stop());
            state.stream = null;
        }

        // Use the uploaded file as the recorded blob
        state.recordedBlob = file;
        
        // Reset the input value to allow uploading the same file again if needed
        e.target.value = '';

        if (window.navigateTo) {
            window.navigateTo('record');
        }

        processRecording();
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

window.processRecording = async function() {
    // Show processing step
    showRecordStep('processing');

    // Reset animation
    const bar = $('.processing-bar-fill');
    if (bar) {
        bar.style.animation = 'none';
        bar.offsetHeight; // Force reflow
        bar.style.animation = 'progress-fill 3s ease-in-out forwards';
    }

    const processingText = $('.processing-text');
    const originalText = processingText ? processingText.innerText : 'Please wait...';

    if (processingText) processingText.innerText = 'Preparing video...';

    // Wait a brief moment to ensure the Blob is fully flushed and readable by the browser
    await new Promise(r => setTimeout(r, 500));

    try {
        state.jacketedBlob = await window.generateBrandJacketedVideoBlob((msg) => {
            if (processingText) processingText.innerText = msg;
        });
    } catch (e) {
        console.error("Failed to generate jacketed video", e);
        state.jacketedBlob = state.recordedBlob;
    }

    if (processingText) processingText.innerText = originalText;

    showBrandJacketedPreview();
    uploadToServerWithRetry(); // Auto-upload to Google Drive + Sheet in background
}

// ==========================================
// Upload Progress UI Helpers
// ==========================================
window.showUploadProgress = function(percent, statusText) {
    let bar = document.getElementById('upload-progress-bar');
    if (!bar) {
        // Create progress bar UI in the preview step
        const container = document.getElementById('record-step-preview');
        if (!container) return;
        
        const wrapper = document.createElement('div');
        wrapper.id = 'upload-progress-wrapper';
        wrapper.style.cssText = 'width:100%;max-width:360px;margin:12px auto;padding:0 16px;box-sizing:border-box;';
        
        const label = document.createElement('div');
        label.id = 'upload-progress-label';
        label.style.cssText = 'font-size:13px;color:#555;margin-bottom:6px;text-align:center;font-family:Inter,sans-serif;';
        label.textContent = statusText || 'Uploading...';
        
        const track = document.createElement('div');
        track.style.cssText = 'width:100%;height:8px;background:#e0e0e0;border-radius:8px;overflow:hidden;';
        
        bar = document.createElement('div');
        bar.id = 'upload-progress-bar';
        bar.style.cssText = 'width:0%;height:100%;background:linear-gradient(90deg,#4CAF50,#66BB6A);border-radius:8px;transition:width 0.3s ease;';
        
        track.appendChild(bar);
        wrapper.appendChild(label);
        wrapper.appendChild(track);
        container.appendChild(wrapper);
    }
    
    bar.style.width = Math.min(percent, 100) + '%';
    const label = document.getElementById('upload-progress-label');
    if (label) label.textContent = statusText || `Uploading... ${Math.round(percent)}%`;
}

window.hideUploadProgress = function(success) {
    const label = document.getElementById('upload-progress-label');
    const bar = document.getElementById('upload-progress-bar');
    if (label) {
        label.textContent = success ? '✅ Upload complete!' : '❌ Upload failed';
        label.style.color = success ? '#2E7D32' : '#C62828';
    }
    if (bar) {
        bar.style.width = '100%';
        bar.style.background = success 
            ? 'linear-gradient(90deg,#4CAF50,#66BB6A)' 
            : 'linear-gradient(90deg,#E53935,#EF5350)';
    }
    // Auto-hide after a few seconds
    setTimeout(() => {
        const wrapper = document.getElementById('upload-progress-wrapper');
        if (wrapper) {
            wrapper.style.transition = 'opacity 0.5s';
            wrapper.style.opacity = '0';
            setTimeout(() => wrapper.remove(), 600);
        }
    }, success ? 4000 : 8000);
}

// ==========================================
// Chunked Resumable Upload to Google Drive
// ==========================================

/**
 * Upload a single chunk via XHR with progress tracking.
 * Returns a promise that resolves with the XHR response.
 */
window.uploadChunkXHR = function(url, blob, offset, total, onProgress, timeoutMs) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const end = offset + blob.size - 1;
        
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('Content-Range', `bytes ${offset}-${end}/${total}`);
        xhr.timeout = timeoutMs || 120000; // 2 min per chunk
        
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                const chunkProgress = e.loaded / e.total;
                const overallBytes = offset + (blob.size * chunkProgress);
                const overallPercent = (overallBytes / total) * 100;
                onProgress(overallPercent);
            }
        });
        
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                resolve({ status: xhr.status, response: xhr.responseText });
            } else {
                reject(new Error(`Chunk upload failed: HTTP ${xhr.status} — ${xhr.responseText}`));
            }
        });
        
        xhr.addEventListener('error', () => reject(new Error('Network error during chunk upload')));
        xhr.addEventListener('timeout', () => reject(new Error('Chunk upload timed out')));
        xhr.addEventListener('abort', () => reject(new Error('Chunk upload aborted')));
        
        xhr.send(blob);
    });
}

/**
 * Upload file to Google Drive using chunked resumable upload.
 * Splits file into 5MB chunks, retries failed chunks, and reports progress.
 */
window.chunkedResumableUpload = async function(uploadUrl, fileBlob, onProgress) {
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
    const totalSize = fileBlob.size;
    let offset = 0;
    
    // For small files (< 5MB), upload in one shot with XHR for progress
    if (totalSize <= CHUNK_SIZE) {
        const result = await window.uploadChunkXHR(
            uploadUrl, fileBlob, 0, totalSize, onProgress, 120000
        );
        return JSON.parse(result.response);
    }
    
    // Chunked upload for larger files
    while (offset < totalSize) {
        const chunkEnd = Math.min(offset + CHUNK_SIZE, totalSize);
        const chunk = fileBlob.slice(offset, chunkEnd);
        const isLastChunk = chunkEnd >= totalSize;
        
        let chunkAttempts = 0;
        const maxChunkRetries = 3;
        
        while (chunkAttempts < maxChunkRetries) {
            try {
                const result = await window.uploadChunkXHR(
                    uploadUrl, chunk, offset, totalSize, onProgress, 120000
                );
                
                if (isLastChunk) {
                    // Last chunk — Google returns the file metadata
                    return JSON.parse(result.response);
                }
                
                // Not last chunk — Google returns 308 Resume Incomplete (treated as success range)
                break; // Move to next chunk
                
            } catch (err) {
                chunkAttempts++;
                console.warn(`Chunk ${Math.floor(offset/CHUNK_SIZE)+1} attempt ${chunkAttempts} failed:`, err.message);
                
                if (chunkAttempts >= maxChunkRetries) {
                    throw new Error(`Upload failed at ${Math.round((offset/totalSize)*100)}% after ${maxChunkRetries} retries: ${err.message}`);
                }
                
                // Wait before retrying (exponential backoff)
                await new Promise(r => setTimeout(r, 1000 * chunkAttempts));
                
                // Query Google Drive for actual upload position (resume)
                try {
                    const resumeRes = await fetch(uploadUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Range': `bytes */${totalSize}`,
                        },
                    });
                    if (resumeRes.status === 308) {
                        const range = resumeRes.headers.get('Range');
                        if (range) {
                            const resumeOffset = parseInt(range.split('-')[1], 10) + 1;
                            console.log(`Resuming from byte ${resumeOffset}`);
                            offset = resumeOffset;
                            // Re-slice the chunk from the new offset
                            break; // This breaks the retry loop; outer while will re-create the chunk
                        }
                    }
                } catch (resumeErr) {
                    console.warn('Resume query failed:', resumeErr.message);
                }
            }
        }
        
        offset = chunkEnd;
    }
    
    throw new Error('Upload ended without receiving file metadata');
}

window.uploadToServerOnce = async function() {
    if (!state.recordedBlob) return false;
    
    // Get user details
    const userJson = localStorage.getItem('savannah_user');
    let user = { name: '', location: '', mobile: '' };
    if (userJson) {
        try { user = JSON.parse(userJson); } catch (e) {}
    }

    const blobToUpload = state.jacketedBlob || state.recordedBlob;
    const ext = blobToUpload.type.includes('mp4') ? 'mp4' : 'webm';
    const filename = `farmer_video_${Date.now()}.${ext}`;

    try {
        showUploadProgress(0, 'Preparing upload...');
        
        console.log('Requesting Google Drive upload URL from Vercel API...');
        const urlRes = await fetch('/api/getUploadUrl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, mimeType: blobToUpload.type, fileSize: blobToUpload.size })
        });
        
        if (!urlRes.ok) {
            throw new Error('Failed to get upload URL: ' + await urlRes.text());
        }
        
        const { uploadUrl } = await urlRes.json();
        
        showUploadProgress(2, 'Uploading video...');

        console.log(`Uploading video (${(blobToUpload.size / 1024 / 1024).toFixed(1)} MB) to Google Drive...`);
        
        const fileData = await window.chunkedResumableUpload(
            uploadUrl, 
            blobToUpload,
            (percent) => showUploadProgress(percent * 0.9, `Uploading... ${Math.round(percent)}%`)
        );
        
        const fileId = fileData.id;
        
        showUploadProgress(92, 'Saving details...');

        console.log('Saving farmer details to Google Sheets...');
        const saveRes = await fetch('/api/saveData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: user.name || 'Anonymous Farmer', 
                location: user.location || 'Unknown', 
                mobile: user.mobile || 'Unknown', 
                fileId 
            })
        });

        if (!saveRes.ok) {
            throw new Error('Failed to save data to Sheets: ' + await saveRes.text());
        }

        showUploadProgress(100, '✅ Upload complete!');
        hideUploadProgress(true);
        console.log('Successfully uploaded video and saved data!');
        return true;
    } catch (e) {
        console.error('Upload flow failed:', e);
        hideUploadProgress(false);
        throw e;
    }
}

// Background upload with retries (runs after encoding, never blocks the UI)
window.uploadToServerWithRetry = async function(maxAttempts = 4) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await window.uploadToServerOnce();
        } catch (e) {
            if (attempt === maxAttempts) {
                console.error(`Upload failed after ${maxAttempts} attempts`);
                showUploadProgress(0, `❌ Upload failed after ${maxAttempts} attempts. Please download your video and try later.`);
                return false;
            }
            const waitMs = 3000 * attempt;
            console.warn(`Upload attempt ${attempt} failed, retrying in ${waitMs / 1000}s...`);
            showUploadProgress(0, `Retry ${attempt + 1}/${maxAttempts} in ${waitMs / 1000}s...`);
            await new Promise(r => setTimeout(r, waitMs));
        }
    }
}

window.showBrandJacketedPreview = function() {
    showRecordStep('preview');

    const container = $('#preview-video-container');
    if (!container || !state.recordedBlob) return;

    // Clear previous content
    container.innerHTML = '';

    if (state.jacketedBlob && state.jacketedBlob !== state.recordedBlob) {
        const wrapper = document.createElement('div');
        wrapper.className = 'jacket-preview-container';
        wrapper.style.cssText = 'position:relative;width:100%;height:100%;overflow:hidden;background:#000;display:flex;align-items:center;justify-content:center;';

        const video = document.createElement('video');
        video.id = 'preview-video';
        video.controls = true;
        video.playsInline = true;
        video.loop = true;
        video.style.cssText = 'max-width:100%;max-height:100%;display:block;';
        video.src = URL.createObjectURL(state.jacketedBlob);

        wrapper.appendChild(video);
        container.appendChild(wrapper);
        video.play().catch(() => {});
        return;
    }

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
        x: cw * 0.13,
        y: ch * 0.28,
        w: cw * 0.75,
        h: ch * 0.61,
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