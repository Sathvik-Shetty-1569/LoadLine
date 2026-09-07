import type { SessionLogEntry } from '../lib/storage';

interface Props {
  history: SessionLogEntry[];
  onBack: () => void;
}

interface ExerciseRow {
  finishedAt: string;
  sets: { reps?: number; weightKg?: number }[];
}

export function History({ history, onBack }: Props) {
  // Newest-first history -> per-exercise timelines, newest-first within each.
  const byExercise = new Map<string, ExerciseRow[]>();
  for (const entry of history) {
    for (const set of entry.sets ?? []) {
      const rows = byExercise.get(set.exerciseName) ?? [];
      let row = rows.find((r) => r.finishedAt === entry.finishedAt);
      if (!row) {
        row = { finishedAt: entry.finishedAt, sets: [] };
        rows.push(row);
      }
      row.sets.push({ reps: set.reps, weightKg: set.weightKg });
      byExercise.set(set.exerciseName, rows);
    }
  }

  const exerciseNames = Array.from(byExercise.keys()).sort();

  return (
    <div className="history">
      <header className="history__header">
        <button type="button" className="btn btn--ghost btn--small" onClick={onBack}>Back</button>
        <h1 className="history__title">History</h1>
      </header>

      {exerciseNames.length === 0 && (
        <p className="history__empty">No logged sets yet - log reps or weight during a session to build a history here.</p>
      )}

      <div className="history__sessions">
        <h2 className="history__section-title">Recent sessions</h2>
        {history.length === 0 && <p className="history__empty">No sessions completed yet.</p>}
        {history.slice(0, 10).map((h, i) => (
          <div className="history__session-row" key={i}>
            <span>{new Date(h.finishedAt).toLocaleDateString()}</span>
            <span>{h.sessionName}</span>
            <span>
              {Math.round(h.actualSec / 60)} min
              {h.skips && h.skips.length > 0 && ` · ${h.skips.length} skipped`}
            </span>
          </div>
        ))}
      </div>

      {exerciseNames.map((name) => (
        <div className="history__exercise" key={name}>
          <h2 className="history__section-title">{name}</h2>
          <div className="history__rows">
            {byExercise.get(name)!.map((row, i) => (
              <div className="history__row" key={i}>
                <span className="history__row-date">{new Date(row.finishedAt).toLocaleDateString()}</span>
                <span className="history__row-sets">
                  {row.sets.map((s, j) => (
                    <span className="history__row-set" key={j}>
                      {s.reps ?? '-'}{s.weightKg !== undefined ? `×${s.weightKg}kg` : ''}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
