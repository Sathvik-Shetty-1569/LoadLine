import { useState } from 'react';
import type { PullupTier } from '../data/types';

interface Props {
  tier: PullupTier;
  onTierChange: (tier: PullupTier) => void;
  soundOn: boolean;
  onSoundChange: (on: boolean) => void;
  onStartOver: () => void;
  onBack: () => void;
}

const TIER_DESCRIPTIONS: Record<PullupTier, string> = {
  1: 'Not do a single pull-up yet - dead hangs + negatives',
  2: 'Do 1-4 pull-ups - 4 sets to failure',
  3: 'Do 5+ pull-ups - 4 x 6-10, 2-sec pause at top',
  4: 'Do 10+ easily - 4 x 8-12, 3-sec eccentric or weighted',
};

export function Settings({ tier, onTierChange, soundOn, onSoundChange, onStartOver, onBack }: Props) {
  const [confirmingStartOver, setConfirmingStartOver] = useState(false);

  return (
    <div className="settings">
      <header className="settings__header">
        <button type="button" className="btn btn--ghost btn--small" onClick={onBack}>
          Back
        </button>
        <h1 className="settings__title">Settings</h1>
      </header>

      <section className="settings__section">
        <h2 className="settings__section-title">Pull-up / chin-up tier</h2>
        <p className="settings__hint">
          Used by the built-in 7kg template's tiered pull-up/chin-up blocks (not by exercises you
          add yourself). Move up a tier once you complete all sets at the top of the rep range for
          two sessions in a row.
        </p>
        {([1, 2, 3, 4] as const).map((t) => (
          <label key={t} className="settings__radio">
            <input type="radio" name="tier" checked={tier === t} onChange={() => onTierChange(t)} />
            <span>
              <strong>Tier {t}</strong> - {TIER_DESCRIPTIONS[t]}
            </span>
          </label>
        ))}
      </section>

      <section className="settings__section">
        <h2 className="settings__section-title">Sound</h2>
        <label className="settings__radio">
          <input type="checkbox" checked={soundOn} onChange={(e) => onSoundChange(e.target.checked)} />
          <span>Audio cues (countdown blips, rest-over chime)</span>
        </label>
      </section>

      <section className="settings__section">
        <h2 className="settings__section-title">Program</h2>
        {!confirmingStartOver ? (
          <button type="button" className="btn btn--ghost" onClick={() => setConfirmingStartOver(true)}>
            Start over
          </button>
        ) : (
          <div className="settings__confirm">
            <p>This deletes your current program from this browser. Export it first if you want to keep it.</p>
            <div className="settings__confirm-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setConfirmingStartOver(false)}>Cancel</button>
              <button type="button" className="btn btn--primary" onClick={onStartOver}>Yes, delete and start over</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
