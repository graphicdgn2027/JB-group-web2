import React from "react";
import { useSectionDraft, newId } from "../useSectionDraft";
import {
  Button,
  Field,
  Grid,
  ImageInput,
  ListEditor,
  Panel,
  SaveBar,
  Select,
  StringListEditor,
  TextArea,
  TextInput,
  Toggle,
} from "../components/ui";
import { ICON_KEYS } from "../../content/icons";
import type {
  Business,
  BusinessBrand,
  BusinessFeature,
  BusinessStat,
} from "../../content/types";

/** Turns a title into a clean URL segment. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const BusinessesEditor: React.FC = () => {
  const section = useSectionDraft("businessesSection");
  const list = useSectionDraft("businesses");

  const dirty = section.dirty || list.dirty;
  const saving = section.saving || list.saving;

  const saveBoth = async () => {
    if (section.dirty) await section.save();
    if (list.dirty) await list.save();
  };
  const discardBoth = () => {
    section.discard();
    list.discard();
  };
  const resetBoth = async () => {
    await section.resetToDefault();
    await list.resetToDefault();
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Businesses</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          The group companies. Each one powers a homepage card, an entry in the
          Businesses menu, its own <code>/portfolio/…</code> page, and a block on the
          Brand Partners page.
        </p>
      </div>

      <Panel
        title="Section heading"
        description="Shown above the business cards on the homepage."
      >
        <Grid cols={3}>
          <Field label="Eyebrow">
            <TextInput
              value={section.draft.subtitle}
              onChange={(v) => section.update({ subtitle: v })}
            />
          </Field>
          <Field label="Title — first line">
            <TextInput
              value={section.draft.titleLine1}
              onChange={(v) => section.update({ titleLine1: v })}
            />
          </Field>
          <Field label="Title — second line">
            <TextInput
              value={section.draft.titleLine2}
              onChange={(v) => section.update({ titleLine2: v })}
            />
          </Field>
        </Grid>
        <Field label="Intro paragraph">
          <TextArea
            value={section.draft.intro}
            onChange={(v) => section.update({ intro: v })}
            rows={3}
          />
        </Field>
      </Panel>

      <Panel
        title="Companies"
        description="Drag order is set with the arrows. Unpublish to hide a company everywhere without deleting it."
      >
        <ListEditor<Business>
          label="Businesses"
          addLabel="Add business"
          items={list.draft}
          onChange={(items) =>
            list.setDraft(items.map((b, idx) => ({ ...b, order: idx })))
          }
          titleFor={(b, i) =>
            `${b.title || `Business ${i + 1}`}${b.published ? "" : "  (hidden)"}`
          }
          makeNew={() => ({
            id: newId("business"),
            slug: "",
            title: "",
            icon: "Briefcase",
            cardImage: "",
            heroImage: "",
            description: "",
            overview: "",
            details: [],
            stats: [],
            features: [],
            brands: [],
            gallery: [],
            published: true,
            order: 0,
          })}
          renderItem={(biz, patch) => (
            <>
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <Toggle
                  checked={biz.published}
                  onChange={(v) => patch({ published: v })}
                  label={biz.published ? "Published" : "Hidden from the site"}
                />
                <a
                  href={`/portfolio/${biz.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-500 hover:text-[#cb9733]"
                >
                  Preview page →
                </a>
              </div>

              <Grid>
                <Field label="Name">
                  <TextInput value={biz.title} onChange={(v) => patch({ title: v })} />
                </Field>
                <Field label="URL slug" hint={`Page address: /portfolio/${biz.slug || "…"}`}>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <TextInput value={biz.slug} onChange={(v) => patch({ slug: v })} />
                    </div>
                    <Button onClick={() => patch({ slug: slugify(biz.title) })}>
                      From name
                    </Button>
                  </div>
                </Field>
              </Grid>

              <Field label="Icon" hint="Shown on the homepage card and in the menu.">
                <Select
                  value={biz.icon}
                  onChange={(v) => patch({ icon: v })}
                  options={ICON_KEYS.map((k) => ({ value: k, label: k }))}
                />
              </Field>

              <Field label="Short description" hint="Used on cards and as the page subtitle.">
                <TextArea
                  value={biz.description}
                  onChange={(v) => patch({ description: v })}
                  rows={2}
                />
              </Field>

              <Grid>
                <ImageInput
                  value={biz.cardImage}
                  onChange={(v) => patch({ cardImage: v })}
                  label="Card image"
                  hint="Homepage grid thumbnail."
                />
                <ImageInput
                  value={biz.heroImage}
                  onChange={(v) => patch({ heroImage: v })}
                  label="Page banner image"
                  hint="Wide banner on the detail page."
                />
              </Grid>

              <ImageInput
                value={biz.logo ?? ""}
                onChange={(v) => patch({ logo: v })}
                label="Logo (optional)"
                hint="Shown white on the detail page banner. Leave empty to omit."
              />

              <Field label="Overview" hint="The long editorial paragraph on the detail page.">
                <TextArea
                  value={biz.overview}
                  onChange={(v) => patch({ overview: v })}
                  rows={7}
                />
              </Field>

              <StringListEditor
                label="Key focus areas"
                addLabel="Add focus area"
                value={biz.details}
                onChange={(details) => patch({ details })}
                placeholder="Automotive & Commercial vehicle lubricants"
              />

              <ListEditor<BusinessStat>
                label="Sidebar statistics"
                addLabel="Add statistic"
                items={biz.stats}
                onChange={(stats) => patch({ stats })}
                titleFor={(s) => `${s.label}: ${s.value}` || "New statistic"}
                makeNew={() => ({ id: newId("stat"), label: "", value: "" })}
                collapsible={false}
                renderItem={(stat, p) => (
                  <Grid>
                    <Field label="Label">
                      <TextInput value={stat.label} onChange={(v) => p({ label: v })} />
                    </Field>
                    <Field label="Value">
                      <TextInput value={stat.value} onChange={(v) => p({ value: v })} />
                    </Field>
                  </Grid>
                )}
              />

              <ListEditor<BusinessFeature>
                label="Product features"
                addLabel="Add feature"
                items={biz.features}
                onChange={(features) => patch({ features })}
                titleFor={(f, i) => f.title || `Feature ${i + 1}`}
                makeNew={() => ({
                  id: newId("feature"),
                  title: "",
                  description: "",
                  image: "",
                })}
                renderItem={(feat, p) => (
                  <>
                    <Field label="Title">
                      <TextInput value={feat.title} onChange={(v) => p({ title: v })} />
                    </Field>
                    <Field label="Description">
                      <TextArea
                        value={feat.description}
                        onChange={(v) => p({ description: v })}
                        rows={3}
                      />
                    </Field>
                    <ImageInput
                      value={feat.image}
                      onChange={(v) => p({ image: v })}
                      label="Feature image"
                    />
                  </>
                )}
              />

              <ListEditor<BusinessBrand>
                label="Associated brands"
                addLabel="Add brand"
                items={biz.brands}
                onChange={(brands) => patch({ brands })}
                titleFor={(b, i) => b.name || `Brand ${i + 1}`}
                makeNew={() => ({ id: newId("brand"), name: "", logo: "", fallbackText: "" })}
                renderItem={(brand, p) => (
                  <>
                    <Grid>
                      <Field label="Brand name">
                        <TextInput value={brand.name} onChange={(v) => p({ name: v })} />
                      </Field>
                      <Field
                        label="Fallback text"
                        hint="Shown if the logo image fails to load."
                      >
                        <TextInput
                          value={brand.fallbackText ?? ""}
                          onChange={(v) => p({ fallbackText: v })}
                        />
                      </Field>
                    </Grid>
                    <ImageInput
                      value={brand.logo}
                      onChange={(v) => p({ logo: v })}
                      label="Brand logo"
                    />
                  </>
                )}
              />

              <StringListEditor
                label="Gallery"
                addLabel="Add image"
                image
                value={biz.gallery}
                onChange={(gallery) => patch({ gallery })}
                hint="Only shown on the detail page when the business has no product features."
              />
            </>
          )}
        />
      </Panel>

      <SaveBar
        dirty={dirty}
        saving={saving}
        error={section.error || list.error}
        savedAt={list.savedAt ?? section.savedAt}
        onSave={() => void saveBoth()}
        onDiscard={discardBoth}
        onReset={() => void resetBoth()}
      />
    </div>
  );
};

export default BusinessesEditor;
