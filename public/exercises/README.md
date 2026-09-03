# Exercise images

Empty for now — the app runs text-only until you drop images in here.

## How to wire one up

1. Add an image file to this folder, e.g. `db-romanian-deadlift.jpg`.
2. In the matching block in `src/data/day.*.ts`, set `image: '/exercises/db-romanian-deadlift.jpg'`.
   Only `RepsBlock`, `UnilateralBlock`, `HoldBlock`, `MaxTimeBlock`, and superset sub-exercises
   have an `image` field — warmup/cooldown stretches (`TimedBlock`) don't, since they're one-line
   instructions rather than a lift worth a photo.
3. Refresh the dev server. No build step needed — anything in `public/` is served as-is.

Any format `<img>` supports works (jpg/png/webp/gif). Keep files reasonably small (a few hundred KB)
since this is served from localhost with no CDN.
