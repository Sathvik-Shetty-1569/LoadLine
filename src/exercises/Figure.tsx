import { useEffect, useState } from 'react';
import type { Archetype, Joint, Point, Pose } from './types';
import { FLOOR, HEAD_R } from './types';

const BONES: Array<[Joint, Joint]> = [
  ['neck', 'hip'],
  ['neck', 'shoulderL'], ['shoulderL', 'elbowL'], ['elbowL', 'handL'],
  ['hip', 'kneeL'], ['kneeL', 'footL'],
  ['neck', 'shoulderR'], ['shoulderR', 'elbowR'], ['elbowR', 'handR'],
  ['hip', 'kneeR'], ['kneeR', 'footR'],
];
const FAR_SIDE = new Set<Joint>(['shoulderL', 'elbowL', 'handL', 'kneeL', 'footL']);

function pointsToStr(a: Point, b: Point): string {
  return `${a[0]},${a[1]} ${b[0]},${b[1]}`;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function Bone({ joint, other, poses, dur, reduced }: {
  joint: Joint; other: Joint; poses: readonly [Pose, Pose]; dur: number; reduced: boolean;
}) {
  const far = FAR_SIDE.has(joint) || FAR_SIDE.has(other);
  const [p0, p1] = poses;
  const from = pointsToStr(p0[joint], p0[other]);
  const to = pointsToStr(p1[joint], p1[other]);
  return (
    <polyline
      className={far ? 'figure__bone figure__bone--far' : 'figure__bone'}
      points={reduced ? to : from}
    >
      {!reduced && (
        <animate attributeName="points" values={`${from};${to};${from}`} dur={`${dur}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" keyTimes="0;0.5;1" />
      )}
    </polyline>
  );
}

function Head({ poses, dur, reduced }: { poses: readonly [Pose, Pose]; dur: number; reduced: boolean }) {
  const [p0, p1] = poses;
  const from = p0.head;
  const to = p1.head;
  return (
    <circle className="figure__head" r={HEAD_R} cx={reduced ? to[0] : from[0]} cy={reduced ? to[1] : from[1]}>
      {!reduced && (
        <>
          <animate attributeName="cx" values={`${from[0]};${to[0]};${from[0]}`} dur={`${dur}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${from[1]};${to[1]};${from[1]}`} dur={`${dur}s`} repeatCount="indefinite" />
        </>
      )}
    </circle>
  );
}

function Equipment({ archetype, poses, dur, reduced }: {
  archetype: Archetype; poses: readonly [Pose, Pose]; dur: number; reduced: boolean;
}) {
  const hands: Joint[] =
    archetype.equipment === 'dumbbells' ? ['handL', 'handR']
    : archetype.equipment === 'dumbbell' ? ['handR']
    : [];
  return (
    <>
      {hands.map((h) => (
        <DumbbellAt key={h} joint={h} poses={poses} dur={dur} reduced={reduced} />
      ))}
    </>
  );
}

function DumbbellAt({ joint, poses, dur, reduced }: {
  joint: Joint; poses: readonly [Pose, Pose]; dur: number; reduced: boolean;
}) {
  const [p0, p1] = poses;
  const from = p0[joint];
  const to = p1[joint];
  const cx = reduced ? to[0] : from[0];
  const cy = reduced ? to[1] : from[1];
  return (
    <g className="figure__equipment" transform={`translate(${cx} ${cy})`}>
      {!reduced && (
        <animateTransform
          attributeName="transform" type="translate"
          values={`${from[0]} ${from[1]};${to[0]} ${to[1]};${from[0]} ${from[1]}`}
          dur={`${dur}s`} repeatCount="indefinite"
        />
      )}
      <rect x={-3.6} y={-0.9} width={7.2} height={1.8} rx={0.5} />
      <rect x={-3.6} y={-2} width={1.4} height={4} rx={0.4} />
      <rect x={2.2} y={-2} width={1.4} height={4} rx={0.4} />
    </g>
  );
}

function Prop({ prop }: { prop?: Archetype['prop'] }) {
  switch (prop) {
    case 'wall':
      return <line className="figure__prop" x1={96} y1={4} x2={96} y2={FLOOR} />;
    case 'doorframe':
      return (
        <>
          <line className="figure__prop" x1={92} y1={2} x2={92} y2={FLOOR} />
          <line className="figure__prop" x1={99} y1={2} x2={99} y2={FLOOR} />
        </>
      );
    case 'chair':
      return <rect className="figure__prop-fill" x={58} y={62} width={14} height={4} rx={0.6} />;
    case 'step':
      return <rect className="figure__prop-fill" x={62} y={80} width={16} height={6} rx={0.6} />;
    case 'bar':
      return <line className="figure__prop figure__prop--bar" x1={30} y1={9} x2={70} y2={9} />;
    default:
      return null;
  }
}

interface FigureProps {
  archetype: Archetype | null;
  className?: string;
  /** Compact mode drops the floor line and props - used for small list thumbnails. */
  compact?: boolean;
}

export function Figure({ archetype, className, compact }: FigureProps) {
  const reduced = usePrefersReducedMotion();

  if (!archetype) {
    return (
      <svg viewBox="0 0 100 100" className={`figure figure--empty ${className ?? ''}`} role="img" aria-label="No diagram available">
        <circle cx={50} cy={38} r={HEAD_R} className="figure__head figure__head--empty" />
        <line x1={50} y1={44} x2={50} y2={68} className="figure__bone figure__bone--empty" />
        <text x={50} y={86} textAnchor="middle" className="figure__empty-label">?</text>
      </svg>
    );
  }

  const dur = archetype.cycleSec ?? 1.1;
  const label = archetype.label;

  return (
    <svg viewBox="0 0 100 100" className={`figure ${className ?? ''}`} role="img" aria-label={label}>
      {archetype.prop === 'bar' && !compact && <line className="figure__prop figure__prop--bar" x1={30} y1={9} x2={70} y2={9} />}
      {!compact && <line className="figure__floor" x1={4} y1={FLOOR} x2={96} y2={FLOOR} />}
      {!compact && archetype.prop && archetype.prop !== 'bar' && archetype.prop !== 'floor' && <Prop prop={archetype.prop} />}

      {BONES.map(([a, b]) => (
        <Bone key={`${a}-${b}`} joint={a} other={b} poses={archetype.poses} dur={dur} reduced={reduced} />
      ))}
      <Head poses={archetype.poses} dur={dur} reduced={reduced} />
      <Equipment archetype={archetype} poses={archetype.poses} dur={dur} reduced={reduced} />
    </svg>
  );
}
