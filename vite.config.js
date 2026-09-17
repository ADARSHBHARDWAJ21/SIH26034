import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    open: true,
    watch: {
      // Saving a scan writes server/data/*.json. If Vite watches that file,
      // it full-reloads the SPA and wipes Inspect Studio state back to Home.
      ignored: ['**/server/data/**', '**/server/**/*.json']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            console.warn('[vite] API proxy: backend not reachable on :5000 —', err.code || err.message);
            if (res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: 'API server offline', scans: [] }));
            }
          });
        }
      }
    }
  }
})
