let audioContext;

if (typeof window !== "undefined") {
    audioContext = window.AudioContext || window.webkitAudioContext;
}

module.exports = function (stream, options) {
    // initialize the audio context
    audioContext = options.audioContext || audioContext || new audioContext();

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const fftBins = new Float32Array(analyser.frequencyBinCount);

    const source = audioContext.createMediaStreamSource(stream);

    source.connect(analyser);

    function checkAudio() {
        analyser.getFloatFrequencyData(fftBins);
        const maxVolume = Math.max(...fftBins);

        if (maxVolume > options.threshold) {
            console.log('Audio detected');
        } else {
            console.log('No audio detected');
        }

        requestAnimationFrame(checkAudio);
    }

    // start checking audio
    checkAudio();
};