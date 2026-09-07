import type { DayKey } from '../data/types';

export function todayKey(): DayKey {
  const idx = new Date().getDay(); // 0=Sun..6=Sat
  const map: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return map[idx];
}

/** A plain unsigned `m:ss` (or `h:mm:ss`) duration - for elapsed times where sign/drift is not the
 * point (see `formatDrift` in `lib/drift.ts` for the signed +/- variant). */
export function formatDuration(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  return `${h > 0 ? `${h}:` : ''}${mm}:${String(sec).padStart(2, '0')}`;
}
