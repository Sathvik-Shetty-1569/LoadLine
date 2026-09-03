import { formatDrift } from '../lib/drift';

interface Props {
  driftSec: number;
  canOfferCatchup: boolean;
  onTrimRemaining?: () => void;
  trimActive: boolean;
}

/** Persistent schedule readout. Never auto-cuts anything - it only ever offers the isolation-rest
 * trim the program itself permits, and only when the user is meaningfully behind. */
export function DriftChip({ driftSec, canOfferCatchup, onTrimRemaining, trimActive }: Props) {
  const behind = driftSec > 5;
  const ahead = driftSec < -5;
  const label = behind ? 'behind' : ahead ? 'ahead' : 'on schedule';
  const cls = behind ? 'drift-chip drift-chip--behind' : ahead ? 'drift-chip drift-chip--ahead' : 'drift-chip';

  return (
    <div className={cls}>
      <span className="drift-chip__value">{formatDrift(driftSec)}</span>
      <span className="drift-chip__label">{label}</span>
      {canOfferCatchup && !trimActive && (
        <button type="button" className="drift-chip__action" onClick={onTrimRemaining}>
          Trim isolation rest to 45s
        </button>
      )}
      {trimActive && <span className="drift-chip__note">Isolation rest trimmed to 45s</span>}
    </div>
  );
}
