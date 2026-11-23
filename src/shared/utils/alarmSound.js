/**
 * Urgent two-tone alarm, synthesized with Web Audio so it sounds different from the
 * regular notification bell and needs no audio file.
 *
 * Browsers only allow sound after the user has interacted with the page, so the audio
 * context is created/resumed on the first click or key press (see unlockAlarmSound).
 */
let ctx = null;

function getContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  return ctx;
}

/** Call once at app start: resumes audio on the first user gesture. */
export function unlockAlarmSound() {
  const unlock = () => {
    const c = getContext();
    if (c && c.state === 'suspended') c.resume().catch(() => {});
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);
}

/** Play the alarm (about 1.6 s). Returns false if the browser blocked it. */
export function playAlarm() {
  const c = getContext();
  if (!c) return false;
  if (c.state === 'suspended') c.resume().catch(() => {});
  if (c.state !== 'running') return false;

  const start = c.currentTime + 0.02;
  const beep = 0.18;
  const gap = 0.05;
  const tones = [988, 740, 988, 740, 988, 740];

  tones.forEach((freq, i) => {
    const t = start + i * (beep + gap);
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.015);
    gain.gain.setValueAtTime(0.12, t + beep - 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + beep);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + beep + 0.01);
  });
  return true;
}
