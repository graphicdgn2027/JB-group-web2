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
- roles, user profiles and permission checks (see **Roles and permissions** below),
- the review queue and the activity log,
- a public `media` storage bucket for images uploaded through the dashboard,
- row-level security so **anyone can read** content, but only people whose role
  allows it can change anything.

The script is safe to run again whenever it changes; permissions you customised in the
dashboard are kept.

### 3. Create your Super Admin login

Go to **Authentication → Users → Add user**. Enter **graphicdgn2027@gmail.com** and a
password, and tick **Auto Confirm User** so no confirmation email is required.

That email is made **Super Admin** automatically (it's set at the top of
`schema.sql` — change it there if needed). Every other new login starts as a Viewer
until a Super Admin changes their role.

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
**Seed database** on the Overview page. This writes the site's current content
into Supabase so you have something to edit.

### 6. Deploy user management

Creating and deleting logins, and changing someone's email or password, needs
Supabase's secret service key, so it runs in a small Edge Function
(`supabase/functions/admin-users`) rather than in the browser.

```
npx supabase login
npx supabase functions deploy admin-users --project-ref cbfkuatjuvlwhgptytcx
```

No extra configuration is needed: Supabase gives Edge Functions their keys
automatically. Until it's deployed, the Users page still lets you change roles, page
access and enable/disable accounts — it just can't add or remove logins.

### 7. Deploy the website

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
| **Contact page** | Phone, email, address, hours, map, socials, form dropdowns, messages, form delivery key (see below) |
| **Footer & nav** | Header menu, mega-menu headings, footer columns, address, social icons, copyright |
| **Media library** | Upload, browse, copy URLs, delete images |
| **Settings** | Site title, meta description, brand colours, loading screen |

Some things are generated rather than typed, so they can never drift out of sync:

- the **Businesses** dropdown in the header,
- the **Businesses** column in the footer,
- the company blocks on the **Brand Partners** page.

All three come from whichever businesses are marked published.

### Contact form delivery

The enquiry form on the Contact page sends through
[Web3Forms](https://web3forms.com) rather than a server of our own — there's
nothing to host or maintain. Sign up free with the inbox you want enquiries
sent to (e.g. `info@rtinepal.com`), then paste the access key it gives you
into **Contact page → Form delivery**. Submissions also show up in your
Web3Forms dashboard as a backup record. Leave the key empty and the form
instead opens the visitor's own email app with everything filled in.

---

## Day-to-day use

- Every edit is a **draft** until you publish it. Drafts are kept in your browser, so
  they survive closing the tab, and a dot in the sidebar marks pages with drafts.
- **Preview** (top bar) shows the real website with your drafts beside the editor,
  updating as you type. Switch between desktop, tablet and mobile widths, pick any
  page, or open the preview in its own tab.
- **Publish** (top bar, or `Ctrl+S`) puts every draft live at once. The amber
  "unpublished" menu lists them so you can publish or discard them one at a time; each
  page's own bar also has **Publish section**.
- **View live** opens the published page for whatever you're editing.
- **Restore original** loads the content the site originally shipped with into that
  section's draft. Nothing changes on the website until you publish it.
- **Unpublish** hides a business or a leadership profile everywhere on the site while
  keeping its content intact — safer than deleting.
- Images can be a path to a file in `Public/assets` (for example
  `/assets/Leadership/photo.jpeg`) or an uploaded URL. Use **Browse** to pick from the
  media library or upload a new file.
- Deleting an image from the media library is permanent and is *not* undone by
  "Reset to default".

## Roles and permissions

| Role | What they can do |
| --- | --- |
| **Super Admin** | Everything, including users and roles. There is always at least one, and nobody can remove the last one. |
| **Admin** | Edit and publish all content, upload and delete media, change site settings, see the activity log. |
| **Editor** | Edit and publish content, approve or reject submissions, upload media, see the activity log. |
| **Content Creator** | Edit the pages they're given and upload media. They can't publish — they **submit for review** instead. |
| **Viewer** | Look around the dashboard and the live preview, without changing anything. |

- **Roles & permissions** (Super Admins only) is a grid where you can change what
  Admin, Editor, Content Creator and Viewer are allowed to do.
- **Users** is where you add people, pick their role, and — for roles that edit —
  choose **All pages** or only specific pages (for example, just Leadership).
- **Review** is where content creators' submissions wait. Editors can preview a
  submission with the live preview, then **Approve** (it goes live) or **Request
  changes** with a note. Creators see the note and can revise and resubmit.
- **Activity** lists who published, reviewed or changed users, and when.
- **My account** lets anyone change their own name and password, see what their role
  allows, and sign out on every device.

These rules are enforced by the database, not just hidden in the dashboard, so they
hold even if someone calls Supabase directly.

## Adding another person

Open **Users → Add user**, enter their name, email and a password (or press
**Generate**), pick a role, and share the password with them securely. Keep public
sign-ups disabled in Supabase so only people you add can log in.

If someone forgets their password, use **Send password reset** from the user's menu.
The link brings them back to the dashboard to choose a new one.

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
