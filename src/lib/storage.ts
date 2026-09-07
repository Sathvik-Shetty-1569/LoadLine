import type { PullupTier } from '../data/types';
import type { SetLogRecord, SkipRecord } from './sessionLog';
import type { ExerciseTime } from './exerciseTime';

const KEYS = {
  tier: 'gym.pullupTier',
  dayOverride: 'gym.dayOverride',
  history: 'gym.sessionHistory',
  soundOn: 'gym.soundOn',
} as const;

export function getTier(): PullupTier {
  const raw = localStorage.getItem(KEYS.tier);
  const n = raw ? Number(raw) : 1;
  return (n === 1 || n === 2 || n === 3 || n === 4 ? n : 1) as PullupTier;
}

export function setTier(tier: PullupTier): void {
  localStorage.setItem(KEYS.tier, String(tier));
}

export function getSoundOn(): boolean {
  const raw = localStorage.getItem(KEYS.soundOn);
  return raw === null ? true : raw === 'true';
}

export function setSoundOn(on: boolean): void {
  localStorage.setItem(KEYS.soundOn, String(on));
}

export interface SessionLogEntry {
  dayKey: string;
  sessionName: string;
  finishedAt: string; // ISO
  targetSec: number;
  actualSec: number;
  maxTimeLogs: { label: string; sec: number }[];
  sets: SetLogRecord[];
  /** Sets/steps the user tapped "Skip - not done" on. Absent on entries logged before this
   * existed - always read as `entry.skips ?? []`. */
  skips?: SkipRecord[];
  /** Real wall-clock time spent per exercise. Absent on older entries - read as `?? []`. */
  exerciseTimes?: ExerciseTime[];
}

export function logSession(entry: SessionLogEntry): void {
  const history = getHistory();
  history.unshift(entry);
  localStorage.setItem(KEYS.history, JSON.stringify(history.slice(0, 50)));
}

export function getHistory(): SessionLogEntry[] {
  try {
    const raw = localStorage.getItem(KEYS.history);
    return raw ? (JSON.parse(raw) as SessionLogEntry[]) : [];
  } catch {
    return [];
  }
}
