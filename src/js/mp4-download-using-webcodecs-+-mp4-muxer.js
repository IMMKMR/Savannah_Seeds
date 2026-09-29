// MP4 Download using WebCodecs + mp4-muxer
window.waitForSeek = function(video) {
    return new Promise((resolve) => {
        if (video.seeking) {
            video.addEventListener('seeked', resolve, { once: true });
        } else {
            resolve();
        }
    });
}

window.loadImageAsync = function(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

window.downloadBlob = function(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
}

window.setDownloadButtonState = function(text, disabled) {
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

window.downloadBrandJacketedVideo = async function() {
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

window.addJacketSelector = function(parentContainer) {
    // Intentionally empty.
    // The jacket is now automatically selected based on the current language
    // (Hindi jacket for Hindi, Punjabi jacket for Punjabi)
    // No manual selector UI is needed.
}

window.createJacketOption = function(jacketId, imgSrc, label) {
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