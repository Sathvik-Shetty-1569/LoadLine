import { Figure } from '../../exercises/Figure';
import { archetypes, getArchetype } from '../../exercises/archetypes';
import { resolveArchetype } from '../../exercises/resolve';

interface Props {
  name: string;
  /** '' means "auto-resolve from name". */
  figure: string;
  onChange: (figure: string) => void;
  label?: string;
}

/** Shows what an exercise name auto-resolves to, with a searchable override for when a
 * user-invented name (or one the resolver just doesn't cover well) needs a different diagram. */
export function FigurePicker({ name, figure, onChange, label = 'Diagram' }: Props) {
  const auto = resolveArchetype(name);
  const shown = figure ? getArchetype(figure) : auto;

  return (
    <div className="figure-picker">
      <Figure archetype={shown} className="figure-picker__preview" />
      <label className="figure-picker__select">
        {label}
        <select value={figure} onChange={(e) => onChange(e.target.value)}>
          <option value="">
            Auto{auto ? ` - ${auto.label}` : ' - no match, pick one'}
          </option>
          {archetypes.map((a) => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
