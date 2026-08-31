// Web Audio API & Speech Synthesis engine for offline CPR rhythm, emergency siren, DTMF and Tamil voice guidance

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

class CPRMetronomeEngine {
  private bpm: number = 110;
  private intervalId: number | null = null;
  private isRunning: boolean = false;
  private beatCallback: ((count: number) => void) | null = null;
  private count: number = 0;

  public start(onBeat?: (count: number) => void, bpm: number = 110) {
    if (this.isRunning) return;
    this.bpm = bpm;
    this.isRunning = true;
    this.count = 0;
    this.beatCallback = onBeat || null;

    const intervalMs = (60 / this.bpm) * 1000;
    this.playBeat();

    this.intervalId = window.setInterval(() => {
      this.playBeat();
    }, intervalMs);
  }

  public stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  private playBeat() {
    this.count++;
    if (this.beatCallback) {
      this.beatCallback(this.count);
    }

    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Heartbeat thump (Low frequency punch)
      const oscLow = ctx.createOscillator();
      const gainLow = ctx.createGain();
      oscLow.type = 'sine';
      oscLow.frequency.setValueAtTime(95, now);
      oscLow.frequency.exponentialRampToValueAtTime(35, now + 0.09);

      gainLow.gain.setValueAtTime(0.7, now);
      gainLow.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      oscLow.connect(gainLow);
      gainLow.connect(ctx.destination);

      oscLow.start(now);
      oscLow.stop(now + 0.1);

      // Sharp click for clear rhythm tracking
      const oscHigh = ctx.createOscillator();
      const gainHigh = ctx.createGain();
      oscHigh.type = 'triangle';
      oscHigh.frequency.setValueAtTime(880, now);
      oscHigh.frequency.exponentialRampToValueAtTime(440, now + 0.04);

      gainHigh.gain.setValueAtTime(0.3, now);
      gainHigh.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      oscHigh.connect(gainHigh);
      gainHigh.connect(ctx.destination);

      oscHigh.start(now);
      oscHigh.stop(now + 0.05);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }
}

export const cprMetronome = new CPRMetronomeEngine();

// Play Emergency Chime
export function playEmergencyAlertSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(650, now);
    osc1.frequency.linearRampToValueAtTime(900, now + 0.25);
    osc1.frequency.linearRampToValueAtTime(650, now + 0.5);

    osc2.frequency.setValueAtTime(440, now);
    osc2.frequency.linearRampToValueAtTime(660, now + 0.25);
    osc2.frequency.linearRampToValueAtTime(440, now + 0.5);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.8);
    osc2.stop(now + 0.8);
  } catch {
    // ignore audio block
  }
}

// Play DTMF Tone for keypad simulator
export function playDtmfTone(digit: string) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const dtmfFrequencies: Record<string, [number, number]> = {
      '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
      '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
      '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
      '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
    };

    const freqs = dtmfFrequencies[digit] || [440, 880];

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(freqs[0], now);
    osc2.frequency.setValueAtTime(freqs[1], now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.15);
    osc2.stop(now + 0.15);
  } catch {
    // Ignore audio error
  }
}

// Play phone ring cadence
export function playPhoneRing() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.frequency.setValueAtTime(400, now);
    osc2.frequency.setValueAtTime(450, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.setValueAtTime(0.2, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.0);
    osc2.stop(now + 1.0);
  } catch {
    // audio context ignored
  }
}

// Play success / score sound
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + i * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  } catch {
    // audio context ignored
  }
}

import { Language } from '../types';

// Text to Speech for Multilingual offline-like voice prompts
export function speakTamilOrEnglish(text: string, lang: Language = 'ta', rate: number = 0.95): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.0;

      const langMap: Record<Language, { code: string; matchers: string[] }> = {
        ta: { code: 'ta-IN', matchers: ['ta', 'tamil'] },
        en: { code: 'en-IN', matchers: ['en-in', 'en-gb', 'en-us', 'en'] },
        hi: { code: 'hi-IN', matchers: ['hi', 'hindi'] },
        te: { code: 'te-IN', matchers: ['te', 'telugu'] },
        kn: { code: 'kn-IN', matchers: ['kn', 'kannada'] },
        ml: { code: 'ml-IN', matchers: ['ml', 'malayalam'] },
      };

      const targetConfig = langMap[lang] || langMap.ta;
      const voices = window.speechSynthesis.getVoices();
      
      const matchedVoice = voices.find(v => {
        const voiceLang = v.lang.toLowerCase();
        const voiceName = v.name.toLowerCase();
        return targetConfig.matchers.some(m => voiceLang.includes(m) || voiceName.includes(m));
      });

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      utterance.lang = targetConfig.code;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}
