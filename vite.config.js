import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Fitness',
        short_name: 'Fitness',
        theme_color: '#111214',
        background_color: '#111214',
        display: 'standalone',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 3_000_000,
        // Exercise photos are served from the dataset repo; cache them as they are viewed.
        runtimeCaching: [{
          urlPattern: /^https:\/\/raw\.githubusercontent\.com\/yuhonas\//,
          handler: 'CacheFirst',
          options: { cacheName: 'exercise-images', expiration: { maxEntries: 2000 } },
        }],
      },
    }),
  ],
})
