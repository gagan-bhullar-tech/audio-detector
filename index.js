let audioContext;

if (typeof window !== "undefined") {
    audioContext = window.AudioContext || window.webkitAudioContext;
}

module.exports = function (stream, options) {
    // initialize the audio context
    audioContext = options.audioContext || audioContext || new audioContext();

};