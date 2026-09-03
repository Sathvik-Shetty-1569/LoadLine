import { useState } from 'react';
import type { DayKey, Program, PullupTier } from '../data/types';
import { exportProgramJson, importProgramJson } from '../lib/programStore';
import { DayEditor } from '../components/editor/DayEditor';

interface Props {
  program: Program;
  tier: PullupTier;
  onChange: (program: Program) => void;
  onBack: () => void;
}

export function ProgramEditor({ program, tier, onChange, onBack }: Props) {
  const [dayKey, setDayKey] = useState<DayKey>(program.days[0].key);
  const [importError, setImportError] = useState<string | null>(null);
  const day = program.days.find((d) => d.key === dayKey)!;

  function handleExport() {
    const json = exportProgramJson(program);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${program.title.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'program'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    const text = await file.text();
    const result = importProgramJson(text);
    if (!result.ok || !result.program) {
      setImportError(result.error ?? 'Could not read that file.');
      return;
    }
    setImportError(null);
    onChange(result.program);
    setDayKey(result.program.days[0]?.key ?? dayKey);
  }

  return (
    <div className="program-editor">
      <header className="program-editor__header">
        <button type="button" className="btn btn--ghost btn--small" onClick={onBack}>Back</button>
        <input
          type="text"
          className="program-editor__title"
          value={program.title}
          onChange={(e) => onChange({ ...program, title: e.target.value })}
        />
      </header>

      <div className="program-editor__io">
        <button type="button" className="btn btn--ghost btn--small" onClick={handleExport}>Export JSON</button>
        <label className="btn btn--ghost btn--small program-editor__import-label">
          Import JSON
          <input type="file" accept="application/json" onChange={handleImportFile} hidden />
        </label>
      </div>
      {importError && <p className="program-editor__error">{importError}</p>}

      <div className="home__day-select">
        {program.days.map((d) => (
          <button
            key={d.key}
            type="button"
            className={`day-pill${d.key === dayKey ? ' day-pill--active' : ''}`}
            onClick={() => setDayKey(d.key)}
          >
            {d.label.slice(0, 3)}
          </button>
        ))}
      </div>

      <DayEditor
        day={day}
        tier={tier}
        onChange={(updatedDay) => onChange({
          ...program,
          days: program.days.map((d) => (d.key === dayKey ? updatedDay : d)),
        })}
      />
    </div>
  );
}
