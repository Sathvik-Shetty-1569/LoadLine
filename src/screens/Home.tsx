import { useState } from 'react';
import type { DayKey, Program, PullupTier } from '../data/types';
import type { SessionLogEntry } from '../lib/storage';
import { dayTargetMinutes } from '../lib/schedule';
import { todayKey } from '../lib/date';

interface Props {
  program: Program;
  tier: PullupTier;
  onStart: (dayKey: DayKey) => void;
  onOpenSettings: () => void;
  onEditProgram: () => void;
  onOpenHistory: () => void;
  history: SessionLogEntry[];
}

export function Home({ program, tier, onStart, onOpenSettings, onEditProgram, onOpenHistory, history }: Props) {
  const [dayKey, setDayKey] = useState<DayKey>(todayKey());
  const day = program.days.find((d) => d.key === dayKey)!;
  const hasContent = day.blocks.length > 0;
  const targetMinutes = dayTargetMinutes(day, tier);

  const lastForDay = history.find((h) => h.dayKey === dayKey);

  return (
    <div className="home">
      <div className="home__top">
        <h1 className="home__title">{program.title}</h1>
        <div className="home__top-actions">
          <button type="button" className="btn btn--ghost btn--small" onClick={onEditProgram}>
            Edit program
          </button>
          <button type="button" className="btn btn--ghost btn--small" onClick={onOpenHistory}>
            History
          </button>
          <button type="button" className="btn btn--ghost btn--small" onClick={onOpenSettings}>
            Settings
          </button>
        </div>
      </div>

      <div className="home__day-select">
        {program.days.map((d) => (
          <button
            key={d.key}
            type="button"
            className={`day-pill${d.key === dayKey ? ' day-pill--active' : ''}${d.key === todayKey() ? ' day-pill--today' : ''}`}
            onClick={() => setDayKey(d.key)}
          >
            {d.label.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="home__card">
        <div className="home__session-name">{day.sessionName}</div>

        {hasContent ? (
          <>
            <div className="home__target">Target: {targetMinutes} min</div>
            <p className="home__note">Warm-up through cool-down, driven step by step.</p>
          </>
        ) : (
          <p className="home__note">Nothing scheduled for this day yet.</p>
        )}

        {lastForDay && (
          <p className="home__last-run">
            Last time: {Math.round(lastForDay.actualSec / 60)} min actual vs {Math.round(lastForDay.targetSec / 60)} min target
          </p>
        )}

        {hasContent ? (
          <button type="button" className="btn btn--primary btn--large" onClick={() => onStart(dayKey)}>
            Start session
          </button>
        ) : (
          <button type="button" className="btn btn--ghost btn--large" onClick={onEditProgram}>
            Add exercises to this day
          </button>
        )}
      </div>
    </div>
  );
}
