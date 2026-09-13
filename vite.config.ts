import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

/**
 * On Windows, dropping a new file into a watched folder (e.g. Public/assets)
 * while it's still being written or scanned by antivirus/cloud sync can make
 * fs.watch report EBUSY. Vite's watcher has no error listener by default, so
 * Node treats that as an uncaught exception and kills the entire dev server.
 * Attaching a listener here just logs it instead — the watcher keeps running
 * and HMR is unaffected.
 */
function watcherErrorGuard() {
  return {
    name: 'watcher-error-guard',
    configureServer(server) {
      server.watcher.on('error', (err: unknown) => {
        const message = err instanceof Error ? err.message : String(err)
        console.error(`[vite] file watcher error (ignored, server stays up): ${message}`)
      })
    },
  }
}

export default defineConfig({
  publicDir: 'Public',
  plugins: [
    figmaAssetResolver(),
    watcherErrorGuard(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
