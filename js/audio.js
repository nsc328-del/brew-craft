var audioCtx = null;

function initAudio() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    audioCtx = null;
  }
}

function ensureAudio() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, duration, volume) {
  if (!audioCtx) return;
  ensureAudio();
  var osc = audioCtx.createOscillator();
  var gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = freq;
  osc.type = 'square';
  gain.gain.setValueAtTime(volume || 0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playNoise(duration, volume) {
  if (!audioCtx) return;
  ensureAudio();
  var bufferSize = audioCtx.sampleRate * duration;
  var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  var data = buffer.getChannelData(0);
  for (var i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  var source = audioCtx.createBufferSource();
  source.buffer = buffer;
  var gain = audioCtx.createGain();
  source.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.setValueAtTime(volume || 0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  source.start();
}

function playSound(type) {
  if (!audioCtx) return;
  switch (type) {
    case 'click':
      playTone(800, 0.05, 0.08);
      break;
    case 'espresso':
      playNoise(0.8, 0.06);
      playTone(100, 0.8, 0.04);
      break;
    case 'steam':
      playNoise(0.5, 0.04);
      break;
    case 'pour':
      playTone(400, 0.15, 0.06);
      setTimeout(function() { playTone(350, 0.15, 0.06); }, 80);
      break;
    case 'serve':
      playTone(523, 0.1, 0.1);
      setTimeout(function() { playTone(659, 0.1, 0.1); }, 80);
      break;
    case 'perfect':
      playTone(523, 0.1, 0.1);
      setTimeout(function() { playTone(659, 0.1, 0.1); }, 80);
      setTimeout(function() { playTone(784, 0.15, 0.12); }, 160);
      break;
    case 'fail':
      playTone(300, 0.2, 0.1);
      setTimeout(function() { playTone(200, 0.3, 0.1); }, 120);
      break;
  }
}
