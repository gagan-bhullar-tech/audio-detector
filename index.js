import WildEmitter from 'wildemitter';

let audioContext;

if (typeof window !== "undefined") {
    audioContext = window.AudioContext || window.webkitAudioContext;
}

function audioDetector(stream, options) {
    options = options || {};

    // default threshold
    options.threshold = options.threshold || -50;
    options.smoothingTimeConstant = options.smoothing || 0.1;
    options.interval = (options.interval || 200);

    let running = true;

    const emitter = new WildEmitter();

    // initialize the audio context
    const context = options.audioContext || new audioContext();

    if (!context) return emitter;

    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothing = options.smoothing;

    const fftBins = new Float32Array(analyser.frequencyBinCount);

    const source = context.createMediaStreamSource(stream);

    source.connect(analyser);

    // set speaking property
    emitter.speaking = false;

    emitter.stop = () => {
        running = false;
        if (emitter.speaking) {
            emitter.speaking = false;
            emitter.emit("stopped");
        }
        analyser.disconnect();
        source.disconnect();
    };

    function checkAudio() {
        if (!running) return;

        analyser.getFloatFrequencyData(fftBins);
        const maxVolume = Math.max(...fftBins);

        if (maxVolume > options.threshold && !emitter.speaking) {
            emitter.speaking = true;
            emitter.emit("speaking");
        } 
        
        if (maxVolume < options.threshold && emitter.speaking) {
            emitter.speaking = false;
            emitter.emit("stopped");
        }

        requestAnimationFrame(checkAudio);
    }

    // start checking audio
    setTimeout(() => {
        checkAudio();
    }, options.interval);

    return emitter;
};

export default audioDetector;