// Web Audio API Synthesizer with Zen Ambient Relaxation & Hypersonic Soundscapes

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.zenMode = true; // Default to peaceful stress-free roaming
    this.masterGain = null;

    // Wind & Aerodynamics
    this.windGain = null;
    this.windFilter = null;
    this.windSource = null;

    // Ambient Zen Drone / Music Chord Synthesizer
    this.zenGain = null;
    this.zenOscs = [];

    // Hypersonic sound effects
    this.plasmaGain = null;
    this.plasmaOsc = null;

    this.initialized = false;
    this.prevMach = 0;
    this.sonicBoomCooldown = 0;
    this.chordStep = 0;
    this.nextChordTime = 0;
  }

  init() {
    if (this.initialized) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // --- 1. Procedural Wind Synthesizer (Pink Noise) ---
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }

      this.windSource = this.ctx.createBufferSource();
      this.windSource.buffer = noiseBuffer;
      this.windSource.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = 'bandpass';
      this.windFilter.frequency.setValueAtTime(200, this.ctx.currentTime);
      this.windFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.01, this.ctx.currentTime);

      this.windSource.connect(this.windFilter);
      this.windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);
      this.windSource.start();

      // --- 2. Zen Ambient Chords (Stress-Free Roaming Music) ---
      // Warm, relaxing chord pads (D major / Pentatonic calming progression)
      this.zenGain = this.ctx.createGain();
      this.zenGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.zenGain.connect(this.masterGain);

      const baseFreqs = [146.83, 220.00, 293.66, 369.99, 440.00]; // D3, A3, D4, F#4, A4
      baseFreqs.forEach(freq => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, this.ctx.currentTime);

        const oscGain = this.ctx.createGain();
        oscGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.zenGain);
        osc.start();

        this.zenOscs.push({ osc, filter, oscGain, baseFreq: freq });
      });

      // --- 3. Hypersonic Plasma Hiss (Mach 5 - 20) ---
      this.plasmaOsc = this.ctx.createOscillator();
      this.plasmaOsc.type = 'sine';
      this.plasmaOsc.frequency.setValueAtTime(2400, this.ctx.currentTime);

      const plasmaFilter = this.ctx.createBiquadFilter();
      plasmaFilter.type = 'highpass';
      plasmaFilter.frequency.setValueAtTime(1800, this.ctx.currentTime);
      plasmaFilter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      this.plasmaGain = this.ctx.createGain();
      this.plasmaGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      this.plasmaOsc.connect(plasmaFilter);
      plasmaFilter.connect(this.plasmaGain);
      this.plasmaGain.connect(this.masterGain);
      this.plasmaOsc.start();

      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API initialization failed:', e);
    }
  }

  ensureContext() {
    if (!this.initialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  update(speedKmh, mach, altitude) {
    if (!this.initialized || !this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Sonic boom trigger when passing Mach 1.0
    if (this.prevMach < 1.0 && mach >= 1.0 && (t - this.sonicBoomCooldown) > 2.0) {
      this.triggerSonicBoom();
      this.sonicBoomCooldown = t;
    }
    this.prevMach = mach;

    const density = Math.max(0.05, Math.exp(-altitude / 8500));
    const speedRatio = Math.min(1.0, speedKmh / 24700);

    // Wind noise modulates with human flight speed
    const windTargetVol = Math.min(0.8, (speedKmh / 1400) * 0.4 * density + speedRatio * 0.35);
    const filterFreq = Math.min(4500, 180 + speedRatio * 3800);

    this.windGain.gain.setTargetAtTime(windTargetVol, t, 0.1);
    this.windFilter.frequency.setTargetAtTime(filterFreq, t, 0.1);

    // Zen Ambient Chords: gently shifts chords over time for a dreamy meditation feel
    if (t > this.nextChordTime) {
      this.nextChordTime = t + 7.0; // shift every 7 seconds
      const chordOffsets = [
        [1.0, 1.0, 1.0, 1.0, 1.0],         // D Major
        [1.122, 1.0, 1.122, 1.0, 1.122],   // E minor
        [0.89, 0.89, 0.89, 0.89, 0.89],    // B minor
        [1.059, 1.0, 1.059, 1.0, 1.059]    // G Major
      ];
      this.chordStep = (this.chordStep + 1) % chordOffsets.length;
      const currentOffsets = chordOffsets[this.chordStep];

      this.zenOscs.forEach((item, idx) => {
        const targetFreq = item.baseFreq * currentOffsets[idx];
        item.osc.frequency.setTargetAtTime(targetFreq, t, 2.5);
      });
    }

    // Zen music volume: prominent at gentle roaming speeds, gently fades into wind at extreme Mach
    const zenTargetVol = this.zenMode ? Math.max(0.04, 0.22 - speedRatio * 0.18) : 0.0;
    this.zenGain.gain.setTargetAtTime(zenTargetVol, t, 0.3);

    // Hypersonic plasma sizzle (active above Mach 4 in atmosphere)
    if (mach > 4.0 && density > 0.08) {
      const plasmaVol = Math.min(0.35, ((mach - 4.0) / 16.0) * 0.35 * density);
      this.plasmaGain.gain.setTargetAtTime(plasmaVol, t, 0.1);
      this.plasmaOsc.frequency.setTargetAtTime(2200 + (mach / 20) * 1600, t, 0.1);
    } else {
      this.plasmaGain.gain.setTargetAtTime(0.0, t, 0.1);
    }
  }

  triggerSonicBoom() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();

    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(130, t);
    boomOsc.frequency.exponentialRampToValueAtTime(26, t + 0.65);

    boomGain.gain.setValueAtTime(1.0, t);
    boomGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    boomOsc.connect(boomGain);
    boomGain.connect(this.masterGain);
    boomOsc.start(t);
    boomOsc.stop(t + 1.3);
  }

  toggleZenMusic() {
    this.zenMode = !this.zenMode;
    if (this.zenGain && this.ctx) {
      this.zenGain.gain.setTargetAtTime(this.zenMode ? 0.20 : 0.0, this.ctx.currentTime, 0.3);
    }
    return this.zenMode;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  setVolume(val) {
    if (this.masterGain && this.ctx) {
      const v = Math.max(0, Math.min(1, val));
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : v, this.ctx.currentTime, 0.05);
    }
  }
}
