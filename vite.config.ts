import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
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

/**
 * Search engines and social networks need absolute URLs, which depend on the
 * domain the site is deployed to. Rather than hard-coding one, `index.html`
 * carries the `__SITE_URL__` placeholder and this plugin substitutes
 * `VITE_SITE_URL` (set it in the host's environment variables, e.g. Vercel).
 * It also emits robots.txt and sitemap.xml so both always agree with that URL.
 */
function seoAssets() {
  const siteUrl = (process.env.VITE_SITE_URL || 'https://jbgroup.com.np').replace(/\/+$/, '')
  const routes = ['/', '/about', '/leadership', '/brand-partners', '/contact']

  return {
    name: 'seo-assets',
    transformIndexHtml(html: string) {
      return html.replaceAll('__SITE_URL__', siteUrl)
    },
    generateBundle(this: { emitFile: (f: { type: 'asset'; fileName: string; source: string }) => void }) {
      const today = new Date().toISOString().slice(0, 10)
      const urls = routes
        .map(
          (r) =>
            `  <url>\n    <loc>${siteUrl}${r}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n  </url>`
        )
        .join('\n')

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /dashboard\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
    },
  }
}

/**
 * Everything in `Public/` is copied into the deployed build as-is, so a working
 * file left in an assets folder (a .psd, a .zip, a raw camera file) would be
 * published and downloadable. This removes those from `dist/` after the copy —
 * only formats a browser can actually use are shipped.
 */
function stripNonWebAssets() {
  const allowed = /\.(png|jpe?g|gif|svg|webp|avif|ico|mp4|webm|woff2?|ttf|otf|json|txt|xml|pdf|css|js|map|html)$/i

  return {
    name: 'strip-non-web-assets',
    apply: 'build' as const,
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      if (!fs.existsSync(dist)) return
      const removed: string[] = []
      const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name)
          if (entry.isDirectory()) walk(full)
          else if (!allowed.test(entry.name)) {
            fs.unlinkSync(full)
            removed.push(path.relative(dist, full))
          }
        }
      }
      walk(dist)
      if (removed.length) {
        console.log(`[build] left out of the deploy (not a web format): ${removed.join(', ')}`)
      }
    },
  }
}

export default defineConfig({
  publicDir: 'Public',
  plugins: [
    figmaAssetResolver(),
    watcherErrorGuard(),
    seoAssets(),
    stripNonWebAssets(),
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

  build: {
    // Split the big, rarely-changing libraries out of the app bundle so a content
    // or layout change doesn't invalidate the whole download for return visitors.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router'],
          motion: ['motion'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
