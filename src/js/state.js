// State
window.state = {
    currentPage: 'home',
    currentLang: 'hi',
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