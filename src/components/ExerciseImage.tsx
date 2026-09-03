import { Figure } from '../exercises/Figure';
import { getArchetype } from '../exercises/archetypes';
import { resolveArchetype } from '../exercises/resolve';

interface Props {
  /** A real photo/file, if one was added under public/exercises/ - always wins when set. */
  src?: string | null;
  /** Explicit archetype id override from the block's `figure` field. */
  figure?: string | null;
  /** The exercise name, used to auto-resolve a diagram when neither of the above is set. */
  name: string;
  compact?: boolean;
  className?: string;
}

/**
 * Precedence: an uploaded photo file, then an explicit figure override, then a diagram resolved
 * from the exercise's own name, then an honest empty state. This is the one place that decision
 * is made, so every render path (session steps, rest's "next up", editor rows) agrees.
 */
export function ExerciseImage({ src, figure, name, compact, className }: Props) {
  if (src) {
    return (
      <div className={`exercise-image ${className ?? ''}`}>
        <img src={src} alt={name} />
      </div>
    );
  }

  const archetype = figure ? getArchetype(figure) : resolveArchetype(name);
  return (
    <div className={`exercise-image ${className ?? ''}`}>
      <Figure archetype={archetype} compact={compact} />
    </div>
  );
}
