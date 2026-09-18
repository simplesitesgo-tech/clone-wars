(function () {
  let audio = null;
  function getAudio() {
    if (!audio) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audio = new AudioCtx();
    }
    if (audio.state === 'suspended') audio.resume();
    return audio;
  }

  function flap() {
    try {
      const context = getAudio();
      if (!context) return;
      const now = context.currentTime;
      const body = context.createOscillator();
      const bodyGain = context.createGain();
      body.type = 'sine';
      body.frequency.setValueAtTime(145, now);
      body.frequency.exponentialRampToValueAtTime(75, now + 0.11);
      bodyGain.gain.setValueAtTime(0.18, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      body.connect(bodyGain);
      bodyGain.connect(context.destination);
      body.start(now);
      body.stop(now + 0.13);

      const impact = context.createOscillator();
      const impactGain = context.createGain();
      impact.type = 'square';
      impact.frequency.setValueAtTime(900, now);
      impact.frequency.exponentialRampToValueAtTime(180, now + 0.035);
      impactGain.gain.setValueAtTime(0.08, now);
      impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      impact.connect(impactGain);
      impactGain.connect(context.destination);
      impact.start(now);
      impact.stop(now + 0.05);
    } catch (error) {}
  }

  function score() {
    try {
      const context = getAudio();
      if (!context) return;
      const now = context.currentTime;
      const noise = context.createBufferSource();
      const buffer = context.createBuffer(1, context.sampleRate * 0.32, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * 0.6;
      noise.buffer = buffer;
      const filter = context.createBiquadFilter();
      const roarGain = context.createGain();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(850, now);
      filter.Q.setValueAtTime(0.7, now);
      roarGain.gain.setValueAtTime(0.001, now);
      roarGain.gain.linearRampToValueAtTime(0.12, now + 0.035);
      roarGain.gain.exponentialRampToValueAtTime(0.001, now + 0.31);
      noise.connect(filter);
      filter.connect(roarGain);
      roarGain.connect(context.destination);
      noise.start(now);
      noise.stop(now + 0.32);

      const cheer = context.createOscillator();
      const cheerGain = context.createGain();
      cheer.type = 'triangle';
      cheer.frequency.setValueAtTime(420, now + 0.02);
      cheer.frequency.exponentialRampToValueAtTime(620, now + 0.19);
      cheerGain.gain.setValueAtTime(0.001, now);
      cheerGain.gain.linearRampToValueAtTime(0.06, now + 0.04);
      cheerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      cheer.connect(cheerGain);
      cheerGain.connect(context.destination);
      cheer.start(now);
      cheer.stop(now + 0.27);
    } catch (error) {}
  }

  function crash() {
    try {
      const context = getAudio();
      if (!context) return;
      const now = context.currentTime;
      const whistle = context.createOscillator();
      const whistleGain = context.createGain();
      whistle.type = 'sine';
      whistle.frequency.setValueAtTime(1450, now);
      whistle.frequency.linearRampToValueAtTime(1050, now + 0.28);
      whistleGain.gain.setValueAtTime(0.001, now);
      whistleGain.gain.linearRampToValueAtTime(0.18, now + 0.015);
      whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.31);
      whistle.connect(whistleGain);
      whistleGain.connect(context.destination);
      whistle.start(now);
      whistle.stop(now + 0.33);
    } catch (error) {}
  }

  window.SOUNDS = { flap, score, crash };
})();
