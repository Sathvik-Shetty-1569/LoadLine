import type { Step } from '../data/types';
import { ExerciseImage } from './ExerciseImage';

interface Props {
  step: Step;
  remainingSec: number;
  nextStep: Step | null;
  onAdvance: () => void;
}

/** Purely presentational. Rest is fully auto-timed and auto-advances (owned by Session) - the one
 * thing this program calls non-negotiable. Shows the *next* movement, diagram included, so setup
 * (e.g. the floor fly's couch/pillows) can happen during the countdown instead of eating into it. */
export function RestView({ step, remainingSec, nextStep, onAdvance }: Props) {
  return (
    <div className="step step--rest">
      <div className="step__label">{step.label}</div>
      <div className="step__timer step__timer--rest">{remainingSec}</div>
      {nextStep && (
        <div className="rest__next">
          <ExerciseImage src={nextStep.image} figure={nextStep.figure} name={nextStep.label} compact className="rest__next-figure" />
          <div className="rest__next-text">
            <span className="rest__next-label">Next</span>
            <span className="rest__next-name">{nextStep.label}</span>
            {nextStep.detail && <span className="rest__next-detail">{nextStep.detail}</span>}
            {nextStep.prescription && <span className="rest__next-prescription">{nextStep.prescription}</span>}
          </div>
        </div>
      )}
      <button type="button" className="btn btn--ghost" onClick={onAdvance}>
        Skip rest
      </button>
    </div>
  );
}
