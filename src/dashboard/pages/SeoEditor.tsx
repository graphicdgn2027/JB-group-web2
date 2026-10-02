import React, { useState } from "react";
import { ExternalLink, FileSearch, Globe2, Link2, Settings2 } from "lucide-react";
import { useSectionDraft, newId } from "../useSectionDraft";
import {
  Field,
  Grid,
  ImageInput,
  ListEditor,
  Notice,
  Panel,
  SaveBar,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "../components/ui";
import { LengthHint, SearchPreview } from "../components/SearchPreview";
import type { LinkItem, PageSeo, SeoRedirect } from "../../content/types";

const TABS = [
  { id: "general", label: "Search appearance", icon: Globe2 },
  { id: "pages", label: "Pages", icon: FileSearch },
  { id: "advanced", label: "Advanced", icon: Settings2 },
  { id: "links", label: "Links", icon: Link2 },
] as const;
type TabId = (typeof TABS)[number]["id"];

const SeoEditor: React.FC = () => {
  const { draft, update, dirty, saving, error, savedAt, save, discard, resetToDefault } = useSectionDraft("seo");
  const [tab, setTab] = useState<TabId>("general");
  const sep = draft.titleSeparator || " | ";
  const fullTitle = (t: string) => (t ? `${t}${sep}${draft.siteName}` : draft.siteName);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">SEO</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          How the website appears in Google and when shared on social media. Leave a field empty to
          use the default.
        </p>
      </div>

      <div className="mb-6 -mx-1 px-1 overflow-x-auto">
        <div role="tablist" className="inline-flex gap-1 rounded-2xl bg-white p-1 ring-1 ring-slate-200 shadow-[var(--dash-shadow-xs)]">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-[13px] font-semibold ${
                tab === id ? "bg-[var(--dash-brand)] text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "general" && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px] items-start">
          <Panel title="Site-wide defaults" description="Used on any page that doesn't set its own.">
            <Grid>
              <Field label="Site name" hint="Added after every page title.">
                <TextInput value={draft.siteName} onChange={(v) => update({ siteName: v })} />
              </Field>
              <Field label="Title separator">
                <Select
                  value={draft.titleSeparator}
                  onChange={(v) => update({ titleSeparator: v })}
                  options={[
                    { value: " | ", label: "About us | JB Group" },
                    { value: " - ", label: "About us - JB Group" },
                    { value: " · ", label: "About us · JB Group" },
                  ]}
                />
              </Field>
            </Grid>
            <Field
              label="Default description"
              hint={<LengthHint value={draft.defaultDescription} ideal={[120, 160]} note="Shown under the title in search results." />}
            >
              <TextArea value={draft.defaultDescription} onChange={(v) => update({ defaultDescription: v })} rows={3} />
            </Field>
            <ImageInput
              label="Default share image"
              value={draft.defaultImage}
              onChange={(v) => update({ defaultImage: v })}
              hint="Shown when a link is shared on Facebook, LinkedIn or WhatsApp. 1200×630 works best."
            />
            <Field label="X (Twitter) handle" hint="Without the @. Optional.">
              <TextInput value={draft.twitterHandle} onChange={(v) => update({ twitterHandle: v })} placeholder="jbgroupnepal" />
            </Field>
          </Panel>
          <div className="xl:sticky xl:top-24">
            <p className="text-[12px] font-semibold text-slate-500 mb-2">Google preview: homepage</p>
            <SearchPreview
              siteName={draft.siteName}
              siteUrl={draft.siteUrl}
              path="/"
              title={fullTitle(draft.pages.find((p) => p.path === "/")?.title ?? "")}
              description={draft.pages.find((p) => p.path === "/")?.description || draft.defaultDescription}
            />
          </div>
        </div>
      )}

      {tab === "pages" && (
        <>
          <Notice>
            Business pages and blog posts take their title, summary and image from their own editors,
            so they always stay in step with the content.
          </Notice>
          <div className="grid gap-6 2xl:grid-cols-2">
            {draft.pages.map((page) => {
              const patch = (p: Partial<PageSeo>) =>
                update({ pages: draft.pages.map((x) => (x.id === page.id ? { ...x, ...p } : x)) });
              return (
                <Panel
                  key={page.id}
                  title={page.label}
                  description={page.path}
                  actions={
                    <a
                      href={page.path}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${page.label}`}
                      className="inline-flex w-8 h-8 items-center justify-center rounded-full ring-1 ring-slate-200 text-slate-500 hover:text-slate-900"
                    >
                      <ExternalLink size={14} />
                    </a>
                  }
                >
                  <Field label="Title" hint={<LengthHint value={fullTitle(page.title)} ideal={[30, 60]} note="Includes the site name." />}>
                    <TextInput value={page.title} onChange={(v) => patch({ title: v })} placeholder="Uses the page heading" />
                  </Field>
                  <Field label="Description" hint={<LengthHint value={page.description} ideal={[120, 160]} />}>
                    <TextArea value={page.description} onChange={(v) => patch({ description: v })} rows={3} placeholder="Uses the default description" />
                  </Field>
                  <ImageInput label="Share image" value={page.image} onChange={(v) => patch({ image: v })} />
                  <Toggle
                    checked={page.noindex}
                    onChange={(v) => patch({ noindex: v })}
                    label="Hide this page from search engines"
                  />
                  <SearchPreview
                    siteName={draft.siteName}
                    siteUrl={draft.siteUrl}
                    path={page.path}
                    title={fullTitle(page.title || page.label)}
                    description={page.description || draft.defaultDescription}
                  />
                </Panel>
              );
            })}
          </div>
        </>
      )}

      {tab === "advanced" && (
        <div className="grid gap-6 xl:grid-cols-2 items-start">
          <Panel title="Domain" description="The live address, used for canonical links and share previews.">
            <Field label="Website address">
              <TextInput value={draft.siteUrl} onChange={(v) => update({ siteUrl: v.trim() })} placeholder="https://jbgroup.com.np" />
            </Field>
            <div className="flex flex-wrap gap-2">
              {["/sitemap.xml", "/robots.txt"].map((p) => (
                <a
                  key={p}
                  href={p}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full ring-1 ring-slate-200 px-3 py-1.5 text-[12.5px] font-semibold text-slate-600 hover:text-slate-900"
                >
                  {p} <ExternalLink size={12} />
                </a>
              ))}
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              The sitemap lists every published page, business and blog post. It is generated when the
              site is built, so rebuild and redeploy after publishing new posts to update it.
            </p>
          </Panel>

          <Panel title="Search engine verification" description="Proves to Google and Bing that you own the site.">
            <Field label="Google Search Console code" hint='Paste only the content value, e.g. "abc123…", from the HTML tag method.'>
              <TextInput value={draft.googleVerification} onChange={(v) => update({ googleVerification: v.trim() })} />
            </Field>
            <Field label="Bing Webmaster code">
              <TextInput value={draft.bingVerification} onChange={(v) => update({ bingVerification: v.trim() })} />
            </Field>
            <Notice tone="warn">
              These codes are written into the page when the site is built. Publish, then rebuild and
              redeploy before pressing Verify in Google or Bing.
            </Notice>
          </Panel>

          <Panel
            title="Organisation details"
            description="Structured data that helps Google show your name, logo and contacts."
          >
            <Grid>
              <Field label="Organisation name">
                <TextInput value={draft.organizationName} onChange={(v) => update({ organizationName: v })} />
              </Field>
              <Field label="Phone">
                <TextInput value={draft.organizationPhone} onChange={(v) => update({ organizationPhone: v })} />
              </Field>
            </Grid>
            <Field label="Email">
              <TextInput value={draft.organizationEmail} onChange={(v) => update({ organizationEmail: v })} />
            </Field>
            <ImageInput label="Logo" value={draft.organizationLogo} onChange={(v) => update({ organizationLogo: v })} />
          </Panel>
        </div>
      )}

      {tab === "links" && (
        <div className="grid gap-6 xl:grid-cols-2 items-start">
          <Panel
            title="Redirects"
            description="Send visitors and search engines from an old address to the right page, e.g. after a page is renamed."
          >
            <ListEditor<SeoRedirect>
              label="Redirects"
              addLabel="Add redirect"
              items={draft.redirects}
              onChange={(redirects) => update({ redirects })}
              titleFor={(r) => (r.from ? `${r.from} → ${r.to || "…"}` : "New redirect")}
              makeNew={() => ({ id: newId("redirect"), from: "", to: "" })}
              renderItem={(r, patch) => (
                <Grid>
                  <Field label="Old address" hint="e.g. /about-us">
                    <TextInput value={r.from} onChange={(v) => patch({ from: v.trim() })} placeholder="/old-page" />
                  </Field>
                  <Field label="Send to" hint="A page on this site, or a full https:// link.">
                    <TextInput value={r.to} onChange={(v) => patch({ to: v.trim() })} placeholder="/about" />
                  </Field>
                </Grid>
              )}
            />
          </Panel>

          <Panel
            title="Official profiles"
            description="Your company's pages on other sites. Google uses these to connect them to this website."
          >
            <ListEditor<LinkItem>
              label="Profiles"
              addLabel="Add profile"
              items={draft.profileLinks}
              onChange={(profileLinks) => update({ profileLinks })}
              titleFor={(l) => l.label || l.href || "New profile"}
              makeNew={() => ({ id: newId("profile"), label: "", href: "" })}
              renderItem={(l, patch) => (
                <Grid>
                  <Field label="Name">
                    <TextInput value={l.label} onChange={(v) => patch({ label: v })} placeholder="LinkedIn" />
                  </Field>
                  <Field label="Link">
                    <TextInput value={l.href} onChange={(v) => patch({ href: v.trim() })} placeholder="https://www.linkedin.com/company/…" />
                  </Field>
                </Grid>
              )}
            />
          </Panel>
        </div>
      )}

      <SaveBar
        dirty={dirty}
        saving={saving}
        error={error}
        savedAt={savedAt}
        onSave={() => void save()}
        onDiscard={discard}
        onReset={() => void resetToDefault()}
      />
    </div>
  );
};

export default SeoEditor;
