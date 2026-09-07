import { formatDrift } from '../lib/drift';
import { formatDuration } from '../lib/date';
import type { SessionLogEntry } from '../lib/storage';
import type { TierUpgradeSuggestion } from '../lib/sessionLog';

interface Props {
  entry: Omit<SessionLogEntry, 'dayKey' | 'sessionName' | 'finishedAt'>;
  sessionName: string;
  tierSuggestion: TierUpgradeSuggestion | null;
  onDone: () => void;
}

export function Done({ entry, sessionName, tierSuggestion, onDone }: Props) {
  const diffSec = entry.actualSec - entry.targetSec;

  // Group logged sets by exercise, in the order they were first logged.
  const byExercise: { name: string; sets: typeof entry.sets }[] = [];
  for (const s of entry.sets) {
    const group = byExercise.find((g) => g.name === s.exerciseName);
    if (group) group.sets.push(s);
    else byExercise.push({ name: s.exerciseName, sets: [s] });
  }

  const exerciseTimes = entry.exerciseTimes ?? [];

  // Count skipped ("not performed") steps per exercise, in first-seen order.
  const skipped: { name: string; count: number }[] = [];
  for (const sk of entry.skips ?? []) {
    const group = skipped.find((g) => g.name === sk.exerciseName);
    if (group) group.count += 1;
    else skipped.push({ name: sk.exerciseName, count: 1 });
  }

  return (
    <div className="done">
      <h1 className="done__title">Session complete</h1>
      <div className="done__session-name">{sessionName}</div>

      <div className="done__stats">
        <div className="done__stat">
          <span className="done__stat-value">{Math.round(entry.actualSec / 60)} min</span>
          <span className="done__stat-label">Actual</span>
        </div>
        <div className="done__stat">
          <span className="done__stat-value">{Math.round(entry.targetSec / 60)} min</span>
          <span className="done__stat-label">Target</span>
        </div>
        <div className="done__stat">
          <span className={`done__stat-value${diffSec > 0 ? ' done__stat-value--over' : ' done__stat-value--under'}`}>
            {formatDrift(diffSec)}
          </span>
          <span className="done__stat-label">vs target</span>
        </div>
      </div>

      {tierSuggestion && (
        <div className="done__tier-suggestion">
          You hit {tierSuggestion.repTarget}+ reps on every set for two sessions running - consider
          moving to Tier {tierSuggestion.toTier} in Settings.
        </div>
      )}

      {byExercise.length > 0 && (
        <div className="done__log">
          <h2 className="done__section-title">Logged sets</h2>
          {byExercise.map((g) => (
            <div className="done__log-group" key={g.name}>
              <div className="done__log-name">{g.name}</div>
              <div className="done__log-sets">
                {g.sets.map((s, i) => (
                  <span className="done__log-set" key={i}>
                    {s.reps ?? '-'}{s.weightKg !== undefined ? ` × ${s.weightKg}kg` : ''}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {entry.maxTimeLogs.length > 0 && (
        <div className="done__maxtimes">
          <h2 className="done__section-title">Logged holds</h2>
          <ul>
            {entry.maxTimeLogs.map((log, i) => (
              <li key={i}>
                <span>{log.label}</span>
                <span>{log.sec}s</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {exerciseTimes.length > 0 && (
        <div className="done__exercise-times">
          <h2 className="done__section-title">Time per exercise</h2>
          <ul>
            {exerciseTimes.map((t) => (
              <li key={t.blockId}>
                <span>{t.name}</span>
                <span>{formatDuration(t.sec)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {skipped.length > 0 && (
        <div className="done__skips">
          <h2 className="done__section-title">Not performed</h2>
          <ul>
            {skipped.map((s) => (
              <li key={s.name}>
                <span>{s.name}</span>
                <span>{s.count === 1 ? 'skipped' : `${s.count} skipped`}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button type="button" className="btn btn--primary btn--large" onClick={onDone}>
        Done
      </button>
    </div>
  );
}
