# Content Dashboard

The website is fully editable from a built-in admin panel at **`/dashboard`**, backed
by Supabase for storage and login.

Nothing about the public site depends on Supabase being reachable: if the database is
missing, empty or down, every page falls back to the content bundled in
`src/content/defaults.ts`. You can therefore set this up at any time without risk to
the live site.

---

## One-time setup

### 1. Create a Supabase project

Sign up at [supabase.com](https://supabase.com) (the free tier is sufficient) and
create a new project. Wait for it to finish provisioning.

### 2. Create the tables and storage bucket

In the Supabase dashboard go to **SQL Editor → New query**, paste the entire contents
of [`supabase/schema.sql`](supabase/schema.sql), and run it.

This creates:

- a `site_content` table — one row per section of the site, stored as JSON,
- row-level security so **anyone can read** content but **only signed-in users can
  change it**,
- a public `media` storage bucket for images uploaded through the dashboard.

### 3. Create your admin login

Go to **Authentication → Users → Add user**. Enter an email and password, and tick
**Auto Confirm User** so no confirmation email is required.

Then go to **Authentication → Sign In / Providers → Email** and turn **off**
"Allow new users to sign up". This is important — without it, anyone could register
themselves an account that can edit the site.

### 4. Add your keys locally

Copy `.env.example` to `.env` and fill in the two values:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Find them under **Project Settings → Data API** (Project URL) and
**Project Settings → API Keys** (the `anon` / `public` key).

The anon key is designed to be visible in the browser; the row-level security rules
from step 2 are what actually protect your content.

Restart the dev server afterwards — Vite only reads `.env` at startup.

### 5. Seed the database

Run `npm run dev`, open <http://localhost:5173/dashboard>, sign in, and press
**Publish all sections** on the Overview page. This writes the site's current content
into Supabase so you have something to edit.

### 6. Deploy

On Vercel, add the same two variables under
**Project → Settings → Environment Variables**, then redeploy. Vite inlines `VITE_*`
variables at build time, so a redeploy is required for them to take effect.

---

## What you can edit

| Dashboard page | Controls |
| --- | --- |
| **Overview** | Status, counts, publish-all, reload |
| **Home hero** | Rotating banner slides, images, headlines, buttons, timing |
| **Home — about** | "Why We Are" copy, photo, the four counters |
| **Mission & vision** | The dark blue purpose band |
| **Businesses** | Every company: name, URL, icon, images, overview, focus areas, statistics, product features, brand logos, gallery, publish state and order |
| **Leadership** | Page banner, heritage story, pull quote, every board profile (name, role, portrait, biography), closing quote |
| **About page** | Banner, heritage, philosophy, quote, vision/mission, core values |
| **Journey timeline** | Company milestones |
| **Brand partners** | Page framing (logos live under Businesses) |
| **Contact page** | Phone, email, address, hours, map, socials, form dropdowns, messages |
| **Footer & nav** | Header menu, mega-menu headings, footer columns, address, social icons, copyright |
| **Media library** | Upload, browse, copy URLs, delete images |
| **Settings** | Site title, meta description, brand colours, loading screen |

Some things are generated rather than typed, so they can never drift out of sync:

- the **Businesses** dropdown in the header,
- the **Businesses** column in the footer,
- the company blocks on the **Brand Partners** page.

All three come from whichever businesses are marked published.

---

## Day-to-day use

- Edits are buffered locally until you press **Save changes**, so you can experiment
  freely. **Discard** throws away unsaved edits.
- **Reset to default** restores that one section to the content the site originally
  shipped with. It affects only the section you are looking at.
- **Unpublish** hides a business or a leadership profile everywhere on the site while
  keeping its content intact — safer than deleting.
- Images can be a path to a file in `Public/assets` (for example
  `/assets/Leadership/photo.jpeg`) or an uploaded URL. Use **Browse** to pick from the
  media library or upload a new file.
- Deleting an image from the media library is permanent and is *not* undone by
  "Reset to default".

## Adding another editor

Create the user in **Supabase → Authentication → Users**. Keep public sign-ups
disabled so only people you add can log in.

## Troubleshooting

**The login screen says Supabase is not connected.**
`.env` is missing, has a typo, or the dev server was not restarted after it was
created. On Vercel, confirm the variables exist and redeploy.

**Saving fails with a permissions error.**
The SQL from step 2 did not run completely. Re-run `supabase/schema.sql`; it is safe
to run more than once.

**The site shows old content after saving.**
Content is fetched once when the page loads. Refresh the public site, and check the
Overview page shows "Connected to Supabase".
