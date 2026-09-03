import { describe, expect, it } from 'vitest';
import {
  createBlankProgram, exportProgramJson, importProgramJson, validateProgram, getDay, newBlockId,
} from '../programStore';
import { templates } from '../../data/templates';
import type { Program, RepsBlock } from '../../data/types';

// localStorage-backed load/save/clear are thin wrappers exercised in the browser E2E pass instead -
// vitest's default environment has no `localStorage` global. Everything here is pure and testable
// without a DOM: the export/import round trip, validation, and the blank-program shape.

function sampleExercise(id = 'ex-1'): RepsBlock {
  return {
    id, phase: 'work', mode: 'reps', name: 'Test Squat', prescription: '3 x 10', sets: 3,
    estWorkSec: 30, restSec: 60, restKind: 'isolation', notes: 'keep form tight',
  };
}

describe('createBlankProgram', () => {
  it('has all 7 days, each empty and editable', () => {
    const p = createBlankProgram();
    expect(p.days).toHaveLength(7);
    expect(p.days.map((d) => d.key).sort()).toEqual(['fri', 'mon', 'sat', 'sun', 'thu', 'tue', 'wed']);
    expect(p.days.every((d) => d.blocks.length === 0)).toBe(true);
  });
});

describe('getDay', () => {
  it('finds a day by key', () => {
    const p = createBlankProgram();
    expect(getDay(p, 'mon').key).toBe('mon');
  });
  it('throws on an unknown key rather than returning undefined silently', () => {
    const p: Program = { title: 'x', days: [] };
    // @ts-expect-error - deliberately invalid key to test the guard
    expect(() => getDay(p, 'nope')).toThrow();
  });
});

describe('export/import round trip', () => {
  it('a program built in the editor survives export -> import unchanged', () => {
    const original = createBlankProgram('My Routine');
    original.days[0].blocks.push(sampleExercise());
    original.days[0].sessionName = 'Push Day';

    const json = exportProgramJson(original);
    const result = importProgramJson(json);

    expect(result.ok).toBe(true);
    expect(result.program).toEqual(original);
  });

  it('the shipped v7 template round-trips too', () => {
    const original = templates[0].build();
    const result = importProgramJson(exportProgramJson(original));
    expect(result.ok).toBe(true);
    expect(result.program).toEqual(original);
  });
});

describe('malformed import is rejected with a readable error, never a partial load', () => {
  it('rejects non-JSON text', () => {
    const result = importProgramJson('not json at all {{{');
    expect(result.ok).toBe(false);
    expect(result.program).toBeUndefined();
    expect(result.error).toBeTruthy();
  });

  it('rejects a JSON value that is not an object', () => {
    expect(importProgramJson('[1,2,3]').ok).toBe(false);
    expect(importProgramJson('"hello"').ok).toBe(false);
  });

  it('rejects a missing title', () => {
    const result = importProgramJson(JSON.stringify({ days: [] }));
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/title/i);
  });

  it('rejects an invalid day key', () => {
    const bad = { title: 'x', days: [{ key: 'funday', label: 'Fun', sessionName: 'x', blocks: [] }] };
    expect(validateProgram(bad)).toMatch(/key/i);
  });

  it('rejects a reps block missing required numeric fields', () => {
    const bad = {
      title: 'x',
      days: [{ key: 'mon', label: 'Monday', sessionName: 'x', blocks: [
        { id: 'a', phase: 'work', mode: 'reps', name: 'Squat', restKind: 'isolation' }, // no sets/estWorkSec/restSec
      ] }],
    };
    const err = validateProgram(bad);
    expect(err).toBeTruthy();
    expect(err).toMatch(/must be a number/);
  });

  it('rejects a duplicate day key', () => {
    const bad = {
      title: 'x',
      days: [
        { key: 'mon', label: 'Monday', sessionName: 'a', blocks: [] },
        { key: 'mon', label: 'Monday again', sessionName: 'b', blocks: [] },
      ],
    };
    expect(validateProgram(bad)).toMatch(/duplicate/i);
  });
});

describe('newBlockId', () => {
  it('produces unique ids', () => {
    const ids = new Set(Array.from({ length: 20 }, () => newBlockId()));
    expect(ids.size).toBe(20);
  });
});
