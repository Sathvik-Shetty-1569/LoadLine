import { useEffect, useMemo, useRef, useState } from 'react';
import type { DayProgram, PullupTier, Step } from '../data/types';
import { compileSession, AUTO_KINDS } from '../lib/compileSession';
import { dayTargetSec } from '../lib/schedule';
import { useCountdown, useStopwatch } from '../lib/useTimer';
import { computeDrift, scheduledOffsets, CATCHUP_THRESHOLD_SEC, TRIMMED_ISOLATION_REST_SEC, STANDARD_ISOLATION_REST_SEC } from '../lib/drift';
import { playCountdownBlip, playStepComplete, playSessionComplete } from '../lib/audio';
import { AutoTimedStepView, ManualWorkStepView, MaxTimeStepView, type SetLog } from '../components/StepView';
import { RestView } from '../components/RestView';
import { DriftChip } from '../components/DriftChip';
import { SessionTrack } from '../components/SessionTrack';
import { getHistory, type SessionLogEntry } from '../lib/storage';
import { getLastSetValues, type SetLogRecord } from '../lib/sessionLog';

interface Props {
  day: DayProgram;
  tier: PullupTier;
  soundOn: boolean;
  onExit: () => void;
  onComplete: (entry: Omit<SessionLogEntry, 'dayKey' | 'sessionName' | 'finishedAt'>) => void;
}

export function Session({ day, tier, soundOn, onExit, onComplete }: Props) {
  const [steps, setSteps] = useState<Step[]>(() => compileSession(day.blocks, tier));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isolationTrimApplied, setIsolationTrimApplied] = useState(false);
  const maxTimeLogs = useRef<{ label: string; sec: number }[]>([]);
  const setLogs = useRef<SetLogRecord[]>([]);
  const history = useRef(getHistory()).current;

  const currentStep = steps[currentIndex] as Step | undefined;
  const nextStep = steps[currentIndex + 1] ?? null;
  const offsets = useMemo(() => scheduledOffsets(steps), [steps]);

  // 1-based occurrence count of each work/maxtime step within its own exercise - used to key the
  // reps/weight prefill lookup ("what did I log last time for THIS exercise's set 2").
  const setIndexByStep = useMemo(() => {
    const counters: Record<string, number> = {};
    return steps.map((s) => {
      if (s.kind !== 'work' && s.kind !== 'maxtime') return 0;
      counters[s.blockId] = (counters[s.blockId] ?? 0) + 1;
      return counters[s.blockId];
    });
  }, [steps]);
  const currentSetIndex = setIndexByStep[currentIndex] ?? 0;

  const sessionClock = useStopwatch();
  const startedRef = useRef(false);
  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      sessionClock.start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blippedRef = useRef(new Set<number>());
  const handleAutoComplete = () => {
    if (soundOn) playStepComplete();
    goNext();
  };
  const countdown = useCountdown(currentStep?.durationSec ?? 0, handleAutoComplete);
  const stopwatch = useStopwatch();

  const isAutoKind = currentStep ? AUTO_KINDS.includes(currentStep.kind) : false;
  const isMaxTime = currentStep?.kind === 'maxtime';

  // Reset the shared timer whenever the current step changes.
  useEffect(() => {
    blippedRef.current = new Set();
    if (!currentStep) return;
    if (AUTO_KINDS.includes(currentStep.kind)) {
      countdown.reset(currentStep.durationSec);
      if (!paused) countdown.start();
    } else if (currentStep.kind === 'maxtime') {
      stopwatch.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Beep in the final 3 seconds of any auto-timed step.
  useEffect(() => {
    if (!isAutoKind || !soundOn) return;
    if (countdown.remainingSec <= 3 && countdown.remainingSec > 0 && !blippedRef.current.has(countdown.remainingSec)) {
      blippedRef.current.add(countdown.remainingSec);
      playCountdownBlip();
    }
  }, [countdown.remainingSec, isAutoKind, soundOn]);

  function finishSession() {
    const actualSec = sessionClock.stop();
    if (soundOn) playSessionComplete();
    const targetSec = dayTargetSec(day, tier);
    onComplete({ targetSec, actualSec, maxTimeLogs: maxTimeLogs.current, sets: setLogs.current });
  }

  function goNext() {
    if (currentIndex + 1 >= steps.length) {
      finishSession();
      return;
    }
    setCurrentIndex((i) => i + 1);
  }

  function completeWork(log?: SetLog) {
    if (currentStep && (log?.reps !== undefined || log?.weightKg !== undefined)) {
      setLogs.current.push({
        exerciseId: currentStep.blockId,
        exerciseName: currentStep.blockName,
        setIndex: currentSetIndex,
        reps: log?.reps,
        weightKg: log?.weightKg,
      });
    }
    goNext();
  }

  function completeMaxTime(finalSec: number) {
    if (currentStep) {
      maxTimeLogs.current.push({ label: `${currentStep.label} - ${currentStep.detail ?? ''}`.trim(), sec: finalSec });
    }
    goNext();
  }

  function goBack() {
    if (currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
  }

  function togglePause() {
    if (isMaxTime && stopwatch.isRunning) return; // don't pause mid-max-effort hold
    setPaused((p) => {
      const next = !p;
      if (next) {
        sessionClock.stop();
        if (isAutoKind) countdown.pause();
      } else {
        sessionClock.start();
        if (isAutoKind) countdown.start();
      }
      return next;
    });
  }

  const scheduledElapsedSec = offsets[currentIndex] ?? offsets[offsets.length - 1] ?? 0;
  const drift = computeDrift(scheduledElapsedSec, sessionClock.elapsedSec);

  const canOfferCatchup =
    !isolationTrimApplied &&
    drift.isBehind &&
    drift.driftSec > CATCHUP_THRESHOLD_SEC &&
    steps.slice(currentIndex + 1).some((s) => s.kind === 'rest' && s.restKind === 'isolation' && s.durationSec === STANDARD_ISOLATION_REST_SEC);

  function trimRemainingIsolationRest() {
    setSteps((prev) =>
      prev.map((s, i) =>
        i > currentIndex && s.kind === 'rest' && s.restKind === 'isolation' && s.durationSec === STANDARD_ISOLATION_REST_SEC
          ? { ...s, durationSec: TRIMMED_ISOLATION_REST_SEC }
          : s,
      ),
    );
    setIsolationTrimApplied(true);
  }

  if (!currentStep) return null;

  return (
    <div className="session">
      <header className="session__header">
        <button type="button" className="btn btn--ghost btn--small" onClick={onExit}>
          Exit
        </button>
        <div className="session__day-label">
          <span className="session__day">{day.label}</span>
          <span className="session__name">{day.sessionName}</span>
        </div>
      </header>

      <SessionTrack steps={steps} currentIndex={currentIndex} actualElapsedSec={sessionClock.elapsedSec} />

      <DriftChip
        driftSec={drift.driftSec}
        canOfferCatchup={canOfferCatchup}
        trimActive={isolationTrimApplied}
        onTrimRemaining={trimRemainingIsolationRest}
      />

      <main className="session__body">
        {paused ? (
          <div className="step step--paused">
            <h2 className="step__title">Paused</h2>
            <button type="button" className="btn btn--primary" onClick={togglePause}>
              Resume
            </button>
          </div>
        ) : currentStep.kind === 'rest' ? (
          <RestView step={currentStep} remainingSec={countdown.remainingSec} nextStep={nextStep} onAdvance={goNext} />
        ) : currentStep.kind === 'work' ? (
          <ManualWorkStepView
            key={currentStep.id}
            step={currentStep}
            lastValues={getLastSetValues(history, currentStep.blockId, currentSetIndex)}
            onAdvance={completeWork}
          />
        ) : currentStep.kind === 'maxtime' ? (
          <MaxTimeStepView
            key={currentStep.id}
            step={currentStep}
            elapsedSec={stopwatch.elapsedSec}
            isRunning={stopwatch.isRunning}
            onStart={stopwatch.start}
            onStop={() => completeMaxTime(stopwatch.stop())}
          />
        ) : (
          <AutoTimedStepView step={currentStep} remainingSec={countdown.remainingSec} onAdvance={goNext} />
        )}
      </main>

      <footer className="session__footer">
        <button type="button" className="btn btn--ghost" onClick={goBack} disabled={currentIndex === 0}>
          Back
        </button>
        <button type="button" className="btn btn--ghost" onClick={togglePause} disabled={isMaxTime && stopwatch.isRunning}>
          {paused ? 'Resume' : 'Pause'}
        </button>
      </footer>
    </div>
  );
}
