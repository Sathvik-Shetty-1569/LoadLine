# Loadline

A session-driving timer for your own gym routine. Push to the line, never past it: build a program
(or load the bundled 7kg Dumbbell + Doorway Bar Hypertrophy Program v7 as a starter), and it runs
the clock through every warm-up, working set, rest period and stretch in order - so you finish on
time instead of drifting.

No accounts, no server beyond `vite dev` - everything lives in your browser's localStorage. Deploys
as a static site (see `vercel.ts`) or runs entirely local.

## Run it

```bash
npm install
npm run dev
```

Open the printed `localhost` URL.

## First run

You'll land on an empty-state screen with two options:
- **Build my routine** - opens the program editor on a blank week.
- **Load the 7kg template** - loads the shipped v7 program as a starting point (or as-is, if it's
  yours - see below).

## How a session is timed

The one rule that shapes everything: a program can call for **0-2 RIR on every working set, true
failure on the last set**. A timer that force-advances a set would break that. So:

- **Auto-timed, auto-advancing, with audio cues:** warm-ups, cool-down stretches, timed holds
  (plank, superman, farmer's carry), superset switches, and **every rest period**.
- **Manual, waits for you:** every rep-based working set ("Set done") and max-time holds like a
  dead hang (Start/Stop, counts up, logs the time).

Rest is where a session actually drains time, so rest is the thing that's fully enforced. Reps are
never enforced - each exercise carries an *estimated* seconds-per-set used only to build the
schedule and the drift readout, never to cut a set short.

A persistent drift chip shows how you're tracking against the schedule. If you fall behind by more
than 2 minutes, it *offers* to trim isolation rest from 60s to 45s on exercises still ahead of
you, and never touches compound, unilateral, or hold rest. Nothing is ever cut automatically.

## Building a program

**Edit program** on Home opens the editor: pick a day, add exercises, reorder/duplicate/remove
them. Each exercise's type (sets & reps, each-side, timed hold, max-effort hold, superset pair, or
a warm-up/stretch) drives how the session plays it. A live "adds about N min" readout updates as
you type, and each day shows its running total, so you can see the cost of a 4th set before you
commit to it.

**Export JSON** / **Import JSON** in the editor let you back up a program or move it between
machines/browsers.

## Set logging

Work steps have optional reps/weight fields, prefilled from what you logged last time for that
exact exercise and set - dismissible in one tap, and "Set done" always works whether or not you
fill them in. **History** on Home shows recent sessions and a per-exercise timeline of what you've
logged. For the bundled template's pull-up/chin-up tiers, Done will suggest moving up a tier once
you've hit the top of the rep range for two sessions running - the program's own progression rule,
automated.

## Project layout

- `src/data/` - `types.ts` (the program schema), `templates.ts` (the template registry),
  `day.*.ts` + `program.ts` (the v7 template's data, unedited by anything the app does).
- `src/lib/programStore.ts` - load/save/export/import the active program (localStorage), with
  hand-written validation that rejects malformed JSON without ever partially loading it.
- `src/lib/schedule.ts` - derives a block/day's time budget from its sets/rest - the single place
  that knows how long anything takes, shared by the builder's live preview and the real session.
- `src/lib/compileSession.ts` - flattens a day's blocks into the linear step list a session plays
  through; `AUTO_KINDS` there is the one source of truth for what auto-advances vs. waits for a tap.
- `src/lib/useTimer.ts` - timestamp-based countdown/stopwatch hooks (never tick-accumulated, so a
  backgrounded tab can't cause drift).
- `src/lib/sessionLog.ts` - set-log types, last-value lookup for prefill, tier-upgrade suggestion.
- `src/lib/__tests__/` - validates the v7 template's derived schedule still reproduces the
  original Notion timings, plus the program store's export/import round-trip. Run with `npm test`.
- `src/screens/`, `src/components/` (`editor/` for the builder) - the UI.

## Exercise diagrams

Every exercise gets an animated stick-figure diagram, resolved automatically from its name
(`src/exercises/resolve.ts`) - a user-invented exercise name still gets a sensible diagram, with a
manual override in the builder if the guess is wrong. See `public/exercises/README.md` for how to
swap in a real photo instead, for any exercise.
