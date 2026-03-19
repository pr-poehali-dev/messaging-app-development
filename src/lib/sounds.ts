// Генерация звуков через Web Audio API (без внешних файлов)

const ctx = (): AudioContext | null => {
  try {
    const W = window as Window & { webkitAudioContext?: typeof AudioContext };
    return new (window.AudioContext || W.webkitAudioContext!)();
  } catch {
    return null;
  }
};

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  const ac = ctx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ac.currentTime);
  gain.gain.setValueAtTime(volume, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + duration);
}

function playSequence(notes: { freq: number; start: number; dur: number; type?: OscillatorType }[], volume = 0.25) {
  const ac = ctx();
  if (!ac) return;
  notes.forEach(n => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = n.type || 'sine';
    osc.frequency.setValueAtTime(n.freq, ac.currentTime + n.start);
    gain.gain.setValueAtTime(volume, ac.currentTime + n.start);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + n.start + n.dur);
    osc.start(ac.currentTime + n.start);
    osc.stop(ac.currentTime + n.start + n.dur);
  });
}

// Звук входящего сообщения — лёгкий двойной пинг
export function playSmsSound() {
  playSequence([
    { freq: 880, start: 0, dur: 0.08 },
    { freq: 1100, start: 0.1, dur: 0.1 },
  ], 0.2);
}

// Звук отправки — мягкий «свуш»
export function playSendSound() {
  playSequence([
    { freq: 440, start: 0, dur: 0.04, type: 'triangle' },
    { freq: 660, start: 0.04, dur: 0.06, type: 'triangle' },
  ], 0.15);
}

// Звонок — пульсирующий сигнал
let ringtoneInterval: ReturnType<typeof setInterval> | null = null;

export function playRingtone() {
  stopRingtone();
  const ring = () => {
    playSequence([
      { freq: 880, start: 0, dur: 0.15 },
      { freq: 1100, start: 0.18, dur: 0.15 },
      { freq: 880, start: 0.36, dur: 0.15 },
    ], 0.35);
  };
  ring();
  ringtoneInterval = setInterval(ring, 1500);
}

export function stopRingtone() {
  if (ringtoneInterval) {
    clearInterval(ringtoneInterval);
    ringtoneInterval = null;
  }
}

// Звук уведомления
export function playNotificationSound() {
  playSequence([
    { freq: 660, start: 0, dur: 0.1 },
    { freq: 990, start: 0.12, dur: 0.15 },
  ], 0.2);
}

// Звук входящего звонка (мелодичный)
export function playCallSound() {
  playSequence([
    { freq: 523, start: 0,    dur: 0.12, type: 'sine' },
    { freq: 659, start: 0.14, dur: 0.12, type: 'sine' },
    { freq: 784, start: 0.28, dur: 0.2,  type: 'sine' },
  ], 0.3);
}

// Звук «онлайн» (соединение установлено)
export function playConnectSound() {
  playTone(880, 0.1, 'triangle', 0.2);
  setTimeout(() => playTone(1100, 0.15, 'triangle', 0.15), 120);
}

let soundEnabled = true;
export const setSoundEnabled = (v: boolean) => { soundEnabled = v; };
export const isSoundEnabled = () => soundEnabled;

// Обёртки с проверкой
export const sms = () => soundEnabled && playSmsSound();
export const send = () => soundEnabled && playSendSound();
export const ring = () => soundEnabled && playRingtone();
export const stopRing = () => stopRingtone();
export const notification = () => soundEnabled && playNotificationSound();
export const call = () => soundEnabled && playCallSound();
export const connect = () => soundEnabled && playConnectSound();