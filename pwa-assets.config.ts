import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Generates the manifest/apple-touch icons from public/favicon.svg (the app's existing mark),
// padded onto a solid --iron background square so it reads correctly as a home-screen icon.
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: {
      ...minimal2023Preset.maskable,
      padding: 0.3,
      resizeOptions: { background: '#16181b', fit: 'contain' },
    },
    apple: {
      ...minimal2023Preset.apple,
      padding: 0.3,
      resizeOptions: { background: '#16181b', fit: 'contain' },
    },
  },
  images: ['public/favicon.svg'],
});
