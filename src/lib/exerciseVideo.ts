/**
 * The demo-video link shown on a step. An explicit `videoUrl` on the exercise always wins;
 * otherwise fall back to a YouTube search for the movement's name so the user can still pull up a
 * form check for anything they don't know how to perform.
 */
export function exerciseVideoUrl(name: string, explicit?: string | null): string {
  const trimmed = explicit?.trim();
  if (trimmed) return trimmed;
  const query = encodeURIComponent(`${name} proper form`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

/** True when the exercise carries its own video link (vs. relying on the search fallback). */
export function hasOwnVideo(explicit?: string | null): boolean {
  return !!explicit?.trim();
}
