// Web Audio beeps - no asset files, no network. AudioContext must be created/resumed from
// inside a user-gesture handler (the Start button click) or browsers will keep it suspended.

let ctx: AudioContext | null = null;

export function primeAudio(): void {
  if (!ctx) {
    ctx = new AudioContext();
  }
  if (ctx.state === 'suspended') {
    void ctx.resume();
  }
}

function tone(freq: number, startAt: number, durationSec: number, gain = 0.15): void {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.frequency.value = freq;
  osc.type = 'sine';
  g.gain.setValueAtTime(0, startAt);
  g.gain.linearRampToValueAtTime(gain, startAt + 0.01);
  g.gain.linearRampToValueAtTime(0, startAt + durationSec);
  osc.connect(g).connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + durationSec + 0.02);
}

/** Three short blips, for the 3-2-1 before a timed step ends. */
export function playCountdownBlip(): void {
  if (!ctx) return;
  tone(880, ctx.currentTime, 0.08);
}

/** Distinct two-tone rising cue: rest/timed step is over, move on. */
export function playStepComplete(): void {
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(660, t, 0.12);
  tone(990, t + 0.14, 0.16);
}

/** Full session complete: a short three-note chime. */
export function playSessionComplete(): void {
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(523.25, t, 0.15);
  tone(659.25, t + 0.16, 0.15);
  tone(783.99, t + 0.32, 0.3);
}
