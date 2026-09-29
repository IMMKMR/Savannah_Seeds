// Cached green-screen-removed jacket
let _cachedJacketCanvas = null;
let _cachedJacketKey = null;

window.getProcessedJacket = function(jacketImg, cw, ch) {
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