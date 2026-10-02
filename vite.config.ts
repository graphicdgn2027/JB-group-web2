import { defineConfig, loadEnv } from 'vite'
import { DEFAULT_CONTENT } from './src/content/defaults'
import type { SiteContent } from './src/content/types'
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
type PublishedContent = Pick<SiteContent, 'businesses' | 'blog' | 'seo'>

/**
 * Reads the published content the sitemap and verification tags depend on.
 * The anon key only has public read access, which is all this needs. If the
 * database can't be reached the bundled defaults are used, so a build never
 * fails because of the network.
 */
async function loadPublishedContent(env: Record<string, string>): Promise<PublishedContent> {
  const fallback: PublishedContent = {
    businesses: DEFAULT_CONTENT.businesses,
    blog: DEFAULT_CONTENT.blog,
    seo: DEFAULT_CONTENT.seo,
  }
  const url = env.VITE_SUPABASE_URL
  const key = env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return fallback
  try {
    const res = await fetch(`${url.replace(/\/+$/, '')}/rest/v1/site_content?select=id,data&id=in.(businesses,blog,seo)`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const rows = (await res.json()) as { id: keyof PublishedContent; data: unknown }[]
    const out = { ...fallback }
    for (const row of rows) {
      if (row.id === 'businesses' && Array.isArray(row.data)) out.businesses = row.data as SiteContent['businesses']
      if (row.id === 'blog' && row.data) out.blog = { ...fallback.blog, ...(row.data as object) }
      if (row.id === 'seo' && row.data) out.seo = { ...fallback.seo, ...(row.data as object) }
    }
    return out
  } catch (err) {
    console.warn(`[seo] using built-in content for the sitemap: ${err instanceof Error ? err.message : err}`)
    return fallback
  }
}

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function seoAssets(env: Record<string, string>) {
  const siteUrl = (env.VITE_SITE_URL || 'https://jbgroup.com.np').replace(/\/+$/, '')
  let content: PublishedContent | null = null
  const load = async () => (content ??= await loadPublishedContent(env))

  return {
    name: 'seo-assets',
    async buildStart() {
      await load()
    },
    async transformIndexHtml(html: string) {
      const { seo } = await load()
      const tags = [
        seo.googleVerification &&
          `<meta name="google-site-verification" content="${escapeXml(seo.googleVerification)}" />`,
        seo.bingVerification && `<meta name="msvalidate.01" content="${escapeXml(seo.bingVerification)}" />`,
      ]
        .filter(Boolean)
        .join('\n  ')
      const withUrl = html.replaceAll('__SITE_URL__', siteUrl)
      return tags ? withUrl.replace('</head>', `  ${tags}\n</head>`) : withUrl
    },
    async generateBundle(this: { emitFile: (f: { type: 'asset'; fileName: string; source: string }) => void }) {
      const { businesses, blog, seo } = await load()
      const today = new Date().toISOString().slice(0, 10)
      const hidden = new Set(seo.pages.filter((p) => p.noindex).map((p) => p.path))
      const entries: { path: string; lastmod: string; freq: string }[] = [
        ...['/', '/about', '/leadership', '/brand-partners', '/blog', '/contact'].map((path) => ({
          path,
          lastmod: today,
          freq: path === '/blog' ? 'weekly' : 'monthly',
        })),
        ...businesses
          .filter((b) => b.published && b.slug)
          .map((b) => ({ path: `/portfolio/${b.slug}`, lastmod: today, freq: 'monthly' })),
        ...blog.posts
          .filter((p) => p.published && p.slug)
          .map((p) => ({
            path: `/blog/${p.slug}`,
            lastmod: (p.updatedAt || p.publishedAt || today).slice(0, 10),
            freq: 'yearly',
          })),
      ].filter((e) => !hidden.has(e.path))

      const urls = entries
        .map(
          (e) =>
            `  <url>\n    <loc>${escapeXml(siteUrl + e.path)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.freq}</changefreq>\n  </url>`
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
  // Server config files ship with no extension (or a non-web one) but are
  // required by the host — keep these regardless of the extension check above.
  const allowedByName = new Set(['.htaccess', '_redirects', 'web.config'])

  return {
    name: 'strip-non-web-assets',
    apply: 'build' as const,
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      if (!fs.existsSync(dist)) return
      const removed: string[] = []
      // Returns true if the directory ends up empty (e.g. an accidental
      // "New folder" left in Public/, or one only containing stripped files),
      // so the caller can remove it too instead of shipping empty clutter.
      const walk = (dir: string): boolean => {
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        for (const entry of entries) {
          const full = path.join(dir, entry.name)
          if (entry.isDirectory()) {
            if (walk(full)) {
              fs.rmdirSync(full)
              removed.push(path.relative(dist, full) + '/')
            }
          } else if (!allowed.test(entry.name) && !allowedByName.has(entry.name)) {
            fs.unlinkSync(full)
            removed.push(path.relative(dist, full))
          }
        }
        return fs.readdirSync(dir).length === 0
      }
      walk(dist)
      if (removed.length) {
        console.log(`[build] left out of the deploy (not a web format): ${removed.join(', ')}`)
      }
    },
  }
}

export default defineConfig(({ mode }) => ({
  publicDir: 'Public',
  plugins: [
    figmaAssetResolver(),
    watcherErrorGuard(),
    seoAssets(loadEnv(mode, process.cwd(), '')),
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
}))
