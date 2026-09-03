import { useCallback, useEffect, useRef, useState } from 'react';

// Timestamp-based, never tick-accumulated: remaining/elapsed is always recomputed from Date.now(),
// so a throttled/backgrounded tab (browsers slow down timers when a tab is hidden) still reports the
// correct value the instant it's checked again, instead of drifting.

interface CountdownState {
  remainingSec: number;
  isRunning: boolean;
  isDone: boolean;
}

export function useCountdown(durationSec: number, onComplete?: () => void) {
  const [state, setState] = useState<CountdownState>({
    remainingSec: durationSec,
    isRunning: false,
    isDone: durationSec <= 0,
  });
  const endsAtRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(durationSec * 1000);
  const rafRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const tick = useCallback(() => {
    if (endsAtRef.current === null) return;
    const remainingMs = Math.max(0, endsAtRef.current - Date.now());
    const remainingSec = Math.ceil(remainingMs / 1000);
    if (remainingMs <= 0) {
      setState({ remainingSec: 0, isRunning: false, isDone: true });
      endsAtRef.current = null;
      onCompleteRef.current?.();
      return;
    }
    setState((s) => (s.remainingSec === remainingSec ? s : { ...s, remainingSec }));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    const ms = remainingMsRef.current;
    if (ms <= 0) return;
    endsAtRef.current = Date.now() + ms;
    setState((s) => ({ ...s, isRunning: true, isDone: false }));
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pause = useCallback(() => {
    if (endsAtRef.current !== null) {
      remainingMsRef.current = Math.max(0, endsAtRef.current - Date.now());
    }
    endsAtRef.current = null;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setState((s) => ({ ...s, isRunning: false }));
  }, []);

  const reset = useCallback((newDurationSec = durationSec) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    endsAtRef.current = null;
    remainingMsRef.current = newDurationSec * 1000;
    setState({ remainingSec: newDurationSec, isRunning: false, isDone: newDurationSec <= 0 });
  }, [durationSec]);

  const skip = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    endsAtRef.current = null;
    remainingMsRef.current = 0;
    setState({ remainingSec: 0, isRunning: false, isDone: true });
  }, []);

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  return { ...state, start, pause, reset, skip };
}

export function useStopwatch() {
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const baseMsRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (startedAtRef.current === null) return;
    const elapsedMs = baseMsRef.current + (Date.now() - startedAtRef.current);
    setElapsedSec(Math.floor(elapsedMs / 1000));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    startedAtRef.current = Date.now();
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback((): number => {
    let finalMs = baseMsRef.current;
    if (startedAtRef.current !== null) {
      finalMs += Date.now() - startedAtRef.current;
    }
    baseMsRef.current = finalMs;
    startedAtRef.current = null;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setIsRunning(false);
    const finalSec = Math.floor(finalMs / 1000);
    setElapsedSec(finalSec);
    return finalSec;
  }, []);

  const reset = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    startedAtRef.current = null;
    baseMsRef.current = 0;
    setElapsedSec(0);
    setIsRunning(false);
  }, []);

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  return { elapsedSec, isRunning, start, stop, reset };
}
