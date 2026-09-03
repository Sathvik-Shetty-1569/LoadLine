import { templates } from '../data/templates';

interface Props {
  onCreateBlank: () => void;
  onLoadTemplate: (templateId: string) => void;
}

export function Onboarding({ onCreateBlank, onLoadTemplate }: Props) {
  return (
    <div className="onboarding">
      <h1 className="onboarding__title">Loadline</h1>
      <p className="onboarding__subtitle">
        A session-driving timer: give it your routine and it runs the clock through every warm-up,
        set, rest and stretch, so you finish on time.
      </p>

      <div className="onboarding__card">
        <h2 className="onboarding__card-title">Start from scratch</h2>
        <p className="onboarding__card-body">Build your own routine in the program editor - exercises, sets, rest, all of it.</p>
        <button type="button" className="btn btn--primary" onClick={onCreateBlank}>
          Build my routine
        </button>
      </div>

      {templates.map((t) => (
        <div className="onboarding__card" key={t.id}>
          <h2 className="onboarding__card-title">{t.name}</h2>
          <p className="onboarding__card-body">{t.description}</p>
          <button type="button" className="btn btn--ghost" onClick={() => onLoadTemplate(t.id)}>
            Load this template
          </button>
        </div>
      ))}
    </div>
  );
}
