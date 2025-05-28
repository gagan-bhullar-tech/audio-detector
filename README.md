## Audio detector

## Usage in Browser

```javascript
const audioDetector = require('audio-detector');

const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

const options = {
    threshold: -40, // Custom threshold
    smoothing: 0.2, // Custom smoothing time constant
    interval: 100,  // Custom interval
    audioContext: new (window.AudioContext || window.webkitAudioContext)() // Custom audio context
};

const detector = audioDetector(stream, options);

detector.on("speaking", () => {
    console.log("Speaking");
});

detector.on("stopped", () => {
    console.log("Stopped speaking");
});

You can pass following options to customize the behavior:

- `threshold`: The volume threshold to detect speaking (default: -50)
- `smoothing`: The smoothing time constant for the analyser (default: 0.1)
- `interval`: The interval in milliseconds to check the audio (default: 200)
- `audioContext`: An optional custom audio context
```

If you like my work, please consider giving it a star on [GitHub](http://github.com/gagan-bhullar-tech/audio-detector) or
Sponsor my work by following [sponsoring me](https://github.com/sponsors/gagan-bhullar-tech) link.
