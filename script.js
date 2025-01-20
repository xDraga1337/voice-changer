const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const gainSlider = document.getElementById('gain');
const pitchSlider = document.getElementById('pitch-slider');
const decaySlider = document.getElementById('decay-slider');
const preDelaySlider = document.getElementById('predelay-slider');
const wetSlider = document.getElementById('wet-slider');
const volumeMeter = document.getElementById('volume-meter');

let mic, pitchShift, gain, analyser, reverb, meterInterval;

startButton.addEventListener('click', async () => {
    if (!mic) {
        // Create microphone input
        mic = new Tone.UserMedia();

        // Create effects
        pitchShift = new Tone.PitchShift(0).toDestination();
        gain = new Tone.Volume().toDestination();
        analyser = new Tone.Analyser('waveform', 256);
        reverb = new Tone.Reverb({
            decay: 10,
            preDelay: 0.5
        }).toDestination();
        reverb.wet.value = 0.4;

        // Initialize microphone
        await mic.open();

        // Connect audio nodes
        mic.connect(pitchShift);
        pitchShift.connect(reverb);
        reverb.connect(gain);
        mic.connect(analyser);

        // Update the volume meter at regular intervals
        meterInterval = setInterval(() => {
            const values = analyser.getValue();
            const maxValue = Math.max(...values.map(v => Math.abs(v)));
            volumeMeter.value = maxValue;
        }, 50);

        console.log('Microphone initialized with reverb, pitch shifting, and volume meter!');
    }

    startButton.disabled = true;
    stopButton.disabled = false;
});

stopButton.addEventListener('click', () => {
    if (mic) {
        mic.disconnect();
        clearInterval(meterInterval);
        startButton.disabled = false;
        stopButton.disabled = true;
    }
});

// Update effects based on slider values
gainSlider.addEventListener('input', () => {
    if (gain) {
        gain.volume.value = parseFloat(gainSlider.value);
    }
});

pitchSlider.addEventListener('input', () => {
    if (pitchShift) {
        pitchShift.pitch = parseFloat(pitchSlider.value);
    }
});

decaySlider.addEventListener('input', () => {
    if (reverb) {
        reverb.decay = parseFloat(decaySlider.value);
    }
});

preDelaySlider.addEventListener('input', () => {
    if (reverb) {
        reverb.preDelay = parseFloat(preDelaySlider.value);
    }
});

wetSlider.addEventListener('input', () => {
    if (reverb) {
        reverb.wet.value = parseFloat(wetSlider.value);
    }
});


// Volume control slider
gainSlider.addEventListener('input', (event) => {
    if (gain) {
        gain.volume.value = event.target.value;
    }
});

// Pitch control slider
pitchSlider.addEventListener('mouseup', (event) => {
    if (pitchShift) {
        pitchShift.pitch = parseFloat(event.target.value);
        console.log('Pitch set to:', pitchShift.pitch);
    }
});

// Echo effect checkbox
echoCheckbox.addEventListener('change', (event) => {
    if (event.target.checked) {
        pitchShift.connect(echo);
        console.log('Echo effect enabled');
    } else {
        pitchShift.disconnect(echo);
        console.log('Echo effect disabled');
    }
});

// Stop voice changer
stopButton.addEventListener('click', () => {
    if (mic) {
        mic.close();
        console.log('Microphone stopped!');

        // Clear volume meter updates
        clearInterval(meterInterval);
        volumeMeter.value = 0;
    }

    startButton.disabled = false;
    stopButton.disabled = true;
});
