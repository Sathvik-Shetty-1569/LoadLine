import type { DayKey } from '../data/types';

export function todayKey(): DayKey {
  const idx = new Date().getDay(); // 0=Sun..6=Sat
  const map: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return map[idx];
}
