import WildEmitter from 'wildemitter';

let audioContext;

if (typeof window !== "undefined") {
    audioContext = window.AudioContext || window.webkitAudioContext;
}

function audioDetector(stream, options) {
    options = options || {};

    // default threshold
    options.threshold = options.threshold || -50;

    const emitter = new WildEmitter();

    // initialize the audio context
    const context = options.audioContext || new audioContext();

    const analyser = context.createAnalyser();
    console.log(analyser)
    analyser.fftSize = 2048;
    const fftBins = new Float32Array(analyser.frequencyBinCount);

    const source = context.createMediaStreamSource(stream);

    source.connect(analyser);

    // set speaking property
    emitter.speaking = false;

    function checkAudio() {
        analyser.getFloatFrequencyData(fftBins);
        const maxVolume = Math.max(...fftBins);

        if (maxVolume > options.threshold) {
            emitter.speaking = true;
            emitter.emit("speaking");
        } else {
            console.log('No audio detected');
        }

        requestAnimationFrame(checkAudio);
    }

    // start checking audio
    checkAudio();

    return emitter;
};

export default audioDetector;