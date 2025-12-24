import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'
import path from 'path'

export default defineConfig(() => {

  return {
    base: "./",
    plugins: [
      react(),
      tailwindcss(),
      compression({
        include: /\.(js|mjs|json|css|html|svg)$/i,
        algorithms: ['brotliCompress'],
        threshold: 1024,
      }),
      compression({
        include: /\.(js|mjs|json|css|html|svg)$/i,
        algorithms: ['gzip'],
        threshold: 1024,
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      // Code splitting pour améliorer le chargement initial
      rollupOptions: {
        output: {
          manualChunks: {
            // Séparer les vendors pour un meilleur caching
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'tanstack-vendor': ['@tanstack/react-query'],
            icons: ['lucide-react'],
          },
        },
      },
      // Taille maximale des chunks (500kb)
      chunkSizeWarningLimit: 500,
      // Minification active par défaut avec esbuild
      minify: 'esbuild',
      // Source maps pour le debugging en production (peut être désactivé)
      sourcemap: false,
    },

    // Optimisations des dépendances
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    },

    server: {
      port: 3000,
      strictPort: false,
      open: false,
      proxy: {
        '/api': {
          target: 'https://api.fox-reviews.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
        },
      },
    },

    preview: {
      port: 4173,
      strictPort: false,
    },
  }
})
