import { useMemo } from 'react';
import type { Step } from '../data/types';
import { scheduledOffsets } from '../lib/drift';

interface Props {
  steps: Step[];
  currentIndex: number;
  actualElapsedSec: number;
}

function segmentClass(step: Step): string {
  if (step.kind === 'rest') return 'track__seg--rest';
  if (step.kind === 'work' || step.kind === 'hold' || step.kind === 'maxtime') return 'track__seg--work';
  return 'track__seg--prep'; // timed warm-up/cooldown steps, superset switches
}

/**
 * The session rendered as one bar: every step is a segment, sized by its share of the planned
 * time and coloured by what kind of time it is. Two markers ride the same axis - where the plan
 * currently has you (step marker) and how much real time has actually elapsed (time marker) - so
 * falling behind is a visible gap between them, not just a number.
 */
export function SessionTrack({ steps, currentIndex, actualElapsedSec }: Props) {
  const { segments, stepMarkerPct, timeMarkerPct } = useMemo(() => {
    const offsets = scheduledOffsets(steps);
    const total = steps.reduce((s, st) => s + Math.max(st.durationSec, 1), 0) || 1;
    let cursor = 0;
    const segs = steps.map((s) => {
      const w = Math.max(s.durationSec, 1);
      const startPct = (cursor / total) * 100;
      cursor += w;
      return { id: s.id, startPct, widthPct: (w / total) * 100, cls: segmentClass(s) };
    });
    const stepOffset = offsets[currentIndex] ?? offsets[offsets.length - 1] ?? 0;
    return {
      segments: segs,
      stepMarkerPct: (stepOffset / total) * 100,
      timeMarkerPct: (Math.min(actualElapsedSec, total) / total) * 100,
    };
  }, [steps, currentIndex, actualElapsedSec]);

  const driftSec = actualElapsedSec - (scheduledOffsets(steps)[currentIndex] ?? 0);
  // "Slip" means behind schedule specifically - running ahead isn't a problem worth flagging.
  const slipping = driftSec > 20 && Math.abs(timeMarkerPct - stepMarkerPct) > 0.5;

  return (
    <div className="track" role="img" aria-label={`Step ${currentIndex + 1} of ${steps.length}`}>
      <div className="track__bar">
        {segments.map((s) => (
          <span key={s.id} className={`track__seg ${s.cls}`} style={{ left: `${s.startPct}%`, width: `${s.widthPct}%` }} />
        ))}
        <span className="track__marker track__marker--step" style={{ left: `${stepMarkerPct}%` }} />
        <span
          className={`track__marker track__marker--time${slipping ? ' track__marker--slip' : ''}`}
          style={{ left: `${timeMarkerPct}%` }}
        />
      </div>
      <div className="track__count">{currentIndex + 1} / {steps.length}</div>
    </div>
  );
}
