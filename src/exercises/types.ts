// A figure is drawn from a 13-joint skeleton rather than hand-authored SVG. Each archetype is then
// just two coordinate sets - a start and an end pose - which keeps every diagram in the same visual
// language, keeps the data tiny, and makes the movement animation fall out for free.
//
// Coordinate space is the 0-100 viewBox. The figure is drawn in profile facing right, with the
// floor at y=FLOOR. Left-side limbs are the far side (drawn dimmer) so the near arm and leg read
// clearly on movements where the two differ.

export type Joint =
  | 'head' | 'neck'
  | 'shoulderL' | 'shoulderR'
  | 'elbowL' | 'elbowR'
  | 'handL' | 'handR'
  | 'hip'
  | 'kneeL' | 'kneeR'
  | 'footL' | 'footR';

export type Point = readonly [number, number];
export type Pose = Record<Joint, Point>;

export const FLOOR = 94;
export const HEAD_R = 6;

export type Equipment = 'dumbbell' | 'dumbbells' | 'bar' | 'none';
export type Prop = 'floor' | 'wall' | 'doorframe' | 'chair' | 'step' | 'bar' | 'none';

export interface Archetype {
  id: string;
  /** Shown in the builder's figure picker. */
  label: string;
  /** [start, end] of the movement. The renderer animates between them. */
  poses: readonly [Pose, Pose];
  equipment?: Equipment;
  prop?: Prop;
  /** Slower for stretches and holds, quicker for reps. Seconds for one full cycle. */
  cycleSec?: number;
}

// ---- Base poses ----
// Most movements only displace a handful of joints, so archetypes are written as small overrides
// of one of these via `pose()`. That is what keeps ~50 movements to a few lines each.

export const STANDING: Pose = {
  head: [50, 15], neck: [50, 25],
  shoulderL: [46, 28], shoulderR: [53, 28],
  elbowL: [45, 41], elbowR: [52, 41],
  handL: [45, 54], handR: [52, 54],
  hip: [49, 55],
  kneeL: [47, 74], kneeR: [53, 74],
  footL: [46, FLOOR], footR: [54, FLOOR],
};

/** Lying on the back, head to the left. */
export const SUPINE: Pose = {
  head: [18, 80], neck: [27, 80],
  shoulderL: [31, 78], shoulderR: [31, 84],
  elbowL: [41, 77], elbowR: [41, 85],
  handL: [51, 78], handR: [51, 84],
  hip: [56, 82],
  kneeL: [71, 80], kneeR: [71, 86],
  footL: [86, 82], footR: [86, 87],
};

/** Face down, head to the left. */
export const PRONE: Pose = {
  head: [20, 82], neck: [29, 83],
  shoulderL: [33, 81], shoulderR: [33, 86],
  elbowL: [24, 78], elbowR: [24, 88],
  handL: [14, 76], handR: [14, 88],
  hip: [58, 85],
  kneeL: [73, 85], kneeR: [73, 89],
  footL: [88, 86], footR: [88, 90],
};

/** Hands on the floor, body in a line - push-up top / plank. */
export const PLANK: Pose = {
  head: [22, 52], neck: [31, 55],
  shoulderL: [35, 57], shoulderR: [35, 61],
  elbowL: [37, 70], elbowR: [37, 74],
  handL: [38, 86], handR: [38, 88],
  hip: [62, 66],
  kneeL: [76, 76], kneeR: [76, 78],
  footL: [90, 87], footR: [90, 89],
};

/** On hands and knees. */
export const QUADRUPED: Pose = {
  head: [22, 52], neck: [31, 55],
  shoulderL: [35, 57], shoulderR: [35, 61],
  elbowL: [35, 71], elbowR: [35, 75],
  handL: [35, 87], handR: [35, 89],
  hip: [63, 60],
  kneeL: [63, 76], kneeR: [63, 78],
  footL: [70, 88], footR: [70, 90],
};

/** Hanging from an overhead bar (bar drawn at y=10). */
export const HANGING: Pose = {
  head: [50, 30], neck: [50, 38],
  shoulderL: [46, 41], shoulderR: [54, 41],
  elbowL: [45, 27], elbowR: [55, 27],
  handL: [44, 13], handR: [56, 13],
  hip: [50, 64],
  kneeL: [48, 78], kneeR: [53, 78],
  footL: [47, 91], footR: [54, 91],
};

/** Sitting on a step or chair, facing right. */
export const SEATED: Pose = {
  head: [42, 30], neck: [43, 40],
  shoulderL: [40, 43], shoulderR: [46, 43],
  elbowL: [41, 55], elbowR: [47, 55],
  handL: [48, 64], handR: [54, 64],
  hip: [42, 68],
  kneeL: [64, 66], kneeR: [64, 70],
  footL: [66, FLOOR], footR: [70, FLOOR],
};

/** Kneeling on the back knee, front foot planted - hip flexor stretch shape. */
export const KNEELING: Pose = {
  head: [50, 24], neck: [50, 34],
  shoulderL: [47, 37], shoulderR: [53, 37],
  elbowL: [47, 49], elbowR: [53, 49],
  handL: [48, 60], handR: [54, 60],
  hip: [49, 62],
  kneeL: [36, 82], kneeR: [66, 74],
  footL: [30, 90], footR: [70, FLOOR],
};

/** Build a pose as a small override of a base. */
export function pose(base: Pose, overrides: Partial<Pose>): Pose {
  return { ...base, ...overrides };
}
