// Keeps the screen awake during a session. Re-acquires on visibility change, since the OS
// releases the lock whenever the tab is backgrounded (e.g. the user briefly checks something else).

let sentinel: WakeLockSentinel | null = null;

async function acquire(): Promise<void> {
  if (!('wakeLock' in navigator)) return;
  try {
    sentinel = await navigator.wakeLock.request('screen');
  } catch {
    // Not fatal - the session still runs, the screen just may sleep. Common causes: low battery,
    // permissions policy, or a browser that lacks the API.
    sentinel = null;
  }
}

function release(): void {
  sentinel?.release().catch(() => {});
  sentinel = null;
}

function onVisibilityChange(): void {
  if (document.visibilityState === 'visible' && sentinel === null) {
    void acquire();
  }
}

export function startWakeLock(): void {
  void acquire();
  document.addEventListener('visibilitychange', onVisibilityChange);
}

export function stopWakeLock(): void {
  document.removeEventListener('visibilitychange', onVisibilityChange);
  release();
}
