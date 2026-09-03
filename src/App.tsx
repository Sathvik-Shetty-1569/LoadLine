import { useEffect, useState } from 'react';
import type { DayKey, Program, PullupTier } from './data/types';
import { templates } from './data/templates';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Session } from './screens/Session';
import { Done } from './screens/Done';
import { Settings } from './screens/Settings';
import { History } from './screens/History';
import { ProgramEditor } from './screens/ProgramEditor';
import {
  getDay, loadProgram, saveProgram, clearProgram, createBlankProgram,
} from './lib/programStore';
import { getTier, setTier, getSoundOn, setSoundOn, getHistory, logSession, type SessionLogEntry } from './lib/storage';
import { suggestTierUpgrade, type TierUpgradeSuggestion } from './lib/sessionLog';
import { primeAudio } from './lib/audio';
import { startWakeLock, stopWakeLock } from './lib/wakeLock';

type View =
  | { name: 'home' }
  | { name: 'editor' }
  | { name: 'history' }
  | { name: 'session'; dayKey: DayKey }
  | {
      name: 'done'; dayKey: DayKey;
      entry: Omit<SessionLogEntry, 'dayKey' | 'sessionName' | 'finishedAt'>;
      tierSuggestion: TierUpgradeSuggestion | null;
    }
  | { name: 'settings' };

export default function App() {
  const [program, setProgramState] = useState<Program | null>(() => loadProgram());
  const [view, setView] = useState<View>({ name: 'home' });
  const [tier, setTierState] = useState<PullupTier>(() => getTier());
  const [soundOn, setSoundOnState] = useState(() => getSoundOn());
  const [history, setHistory] = useState(() => getHistory());

  useEffect(() => {
    if (view.name === 'session') {
      primeAudio();
      startWakeLock();
      return () => stopWakeLock();
    }
  }, [view.name]);

  function setProgram(p: Program) {
    setProgramState(p);
    saveProgram(p);
  }

  function handleStart(dayKey: DayKey) {
    setView({ name: 'session', dayKey });
  }

  function handleTierChange(t: PullupTier) {
    setTierState(t);
    setTier(t);
  }

  function handleSoundChange(on: boolean) {
    setSoundOnState(on);
    setSoundOn(on);
  }

  function handleStartOver() {
    clearProgram();
    setProgramState(null);
    setView({ name: 'home' });
  }

  if (!program) {
    return (
      <Onboarding
        onCreateBlank={() => setProgram(createBlankProgram())}
        onLoadTemplate={(id) => {
          const t = templates.find((x) => x.id === id);
          if (t) setProgram(t.build());
        }}
      />
    );
  }

  if (view.name === 'editor') {
    return <ProgramEditor program={program} tier={tier} onChange={setProgram} onBack={() => setView({ name: 'home' })} />;
  }

  if (view.name === 'history') {
    return <History history={history} onBack={() => setView({ name: 'home' })} />;
  }

  if (view.name === 'session') {
    const day = getDay(program, view.dayKey);
    return (
      <Session
        day={day}
        tier={tier}
        soundOn={soundOn}
        onExit={() => setView({ name: 'home' })}
        onComplete={(entry) => {
          logSession({
            dayKey: day.key,
            sessionName: day.sessionName,
            finishedAt: new Date().toISOString(),
            ...entry,
          });
          const newHistory = getHistory();
          setHistory(newHistory);

          const tieredBlock = day.blocks.find((b) => b.mode === 'tiered');
          const tierSuggestion = tieredBlock && tieredBlock.mode === 'tiered'
            ? suggestTierUpgrade(newHistory, tier, tieredBlock.id, tieredBlock.barExercise)
            : null;

          setView({ name: 'done', dayKey: day.key, entry, tierSuggestion });
        }}
      />
    );
  }

  if (view.name === 'done') {
    const day = getDay(program, view.dayKey);
    return (
      <Done
        entry={view.entry}
        sessionName={day.sessionName}
        tierSuggestion={view.tierSuggestion}
        onDone={() => setView({ name: 'home' })}
      />
    );
  }

  if (view.name === 'settings') {
    return (
      <Settings
        tier={tier}
        onTierChange={handleTierChange}
        soundOn={soundOn}
        onSoundChange={handleSoundChange}
        onStartOver={handleStartOver}
        onBack={() => setView({ name: 'home' })}
      />
    );
  }

  return (
    <Home
      program={program}
      tier={tier}
      onStart={handleStart}
      onOpenSettings={() => setView({ name: 'settings' })}
      onEditProgram={() => setView({ name: 'editor' })}
      onOpenHistory={() => setView({ name: 'history' })}
      history={history}
    />
  );
}
