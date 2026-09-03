// Vercel project configuration.
//
// Loadline is a pure client-side Vite SPA - no server routes, no API, everything (the
// program, history, settings) lives in the visitor's own browser via localStorage. There's
// nothing here that needs @vercel/config's route-builder helpers (rewrites/redirects), so this
// file is dependency-free on purpose - the only alternative pulled in a high-severity transitive
// vulnerability (a ReDoS in path-to-regexp, via @vercel/routing-utils) for a feature this project
// doesn't use. A plain typed object is all `vercel.ts` needs to be picked up.

interface VercelConfig {
  framework: string;
  buildCommand: string;
  outputDirectory: string;
  headers?: Array<{
    source: string;
    headers: Array<{ key: string; value: string }>;
  }>;
}

export const config: VercelConfig = {
  framework: 'vite',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  headers: [
    {
      // Vite fingerprints every asset filename with a content hash, so a cached asset is safe to
      // cache forever - a program update ships under a new filename, never overwrites this one.
      source: '/assets/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ],
};
