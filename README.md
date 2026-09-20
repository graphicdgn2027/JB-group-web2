# JB Group website

The public JB Group website (home, about, leadership, brand partners, contact and a page per
business) plus the `/dashboard` admin area used to edit every piece of that content.

Built with Vite, React 18, React Router and Tailwind CSS v4. Content is stored in Supabase and
falls back to the built-in copy in `src/content/defaults.ts` whenever the database is unreachable
or not yet set up, so the site always renders.

## Running locally

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run typecheck` | TypeScript check (no files emitted) |
| `npm run verify` | `typecheck` then `build` — run this before deploying |
| `npm run setup:supabase` | Creates the database schema and the first admin user |

## Environment variables

Copy `.env.example` to `.env` and fill it in. `.env` is git-ignored — never commit real keys.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Dashboard + saved content | Supabase → Project Settings → Data API |
| `VITE_SUPABASE_ANON_KEY` | Dashboard + saved content | Safe in the browser; row-level security guards writes |
| `VITE_SITE_URL` | Correct SEO/social links | The live domain, no trailing slash |
| `SUPABASE_ACCESS_TOKEN` | `npm run setup:supabase` only | Never used by the website itself |

`VITE_SITE_URL` fills in the canonical link, the social-preview tags, `robots.txt` and
`sitemap.xml`. If it is not set, the build falls back to `https://jbgroup.com.np` — set it to the
real domain before going live.

## Deploying

The site is a static single-page app; `vercel.json` already rewrites every path to `index.html`
so deep links such as `/leadership` work on a hard refresh.

1. Push the repository to your Git host.
2. Import it on Vercel (or any static host). Build command `npm run build`, output directory `dist`.
3. Add the environment variables above under **Project → Settings → Environment Variables**.
   Vite inlines `VITE_*` values at build time, so **redeploy after changing them**.
4. Deploy, then check `/`, a business page, `/sitemap.xml` and a made-up URL (it should show the
   404 page, not a blank screen).

On another host, serve `dist/` and add the same catch-all rewrite to `index.html`.

## Database and the dashboard

The dashboard lives at `/dashboard` and is excluded from search engines in `robots.txt`. Until
Supabase is set up, the site shows its built-in content and the dashboard cannot sign anyone in.
See `DASHBOARD.md` for the roles, the review workflow and the full setup steps.
