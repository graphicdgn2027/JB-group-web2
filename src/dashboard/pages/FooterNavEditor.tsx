import React from "react";
import { useSectionDraft, newId } from "../useSectionDraft";
import {
  Field,
  Grid,
  ListEditor,
  Notice,
  Panel,
  SaveBar,
  Select,
  StringListEditor,
  TextArea,
  TextInput,
} from "../components/ui";
import type { LinkItem, SocialLink } from "../../content/types";

const PLATFORMS = ["Linkedin", "Twitter", "Facebook", "Instagram", "Youtube"];

const FooterNavEditor: React.FC = () => {
  const footer = useSectionDraft("footer");
  const nav = useSectionDraft("nav");

  const dirty = footer.dirty || nav.dirty;
  const saving = footer.saving || nav.saving;

  const saveBoth = async () => {
    if (footer.dirty) await footer.save();
    if (nav.dirty) await nav.save();
  };
  const discardBoth = () => {
    footer.discard();
    nav.discard();
  };
  const resetBoth = async () => {
    await footer.resetToDefault();
    await nav.resetToDefault();
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Footer & navigation</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          The header menu and the footer that appear on every page.
        </p>
      </div>

      <Notice>
        The <strong>Businesses</strong> dropdown and the footer's Businesses column are
        generated automatically from your published businesses, so they never fall out
        of sync.
      </Notice>

      <Panel title="Header menu">
        <ListEditor<LinkItem>
          label="Menu items"
          addLabel="Add menu item"
          items={nav.draft.items}
          onChange={(items) => nav.update({ items })}
          titleFor={(i) => i.label || "New item"}
          makeNew={() => ({ id: newId("nav"), label: "", href: "/" })}
          collapsible={false}
          renderItem={(item, patch) => (
            <Grid>
              <Field label="Label">
                <TextInput value={item.label} onChange={(v) => patch({ label: v })} />
              </Field>
              <Field label="Link" hint="e.g. /about or /about#journey">
                <TextInput value={item.href} onChange={(v) => patch({ href: v })} />
              </Field>
            </Grid>
          )}
        />
        <Grid>
          <Field label="Mega menu — first column heading">
            <TextInput
              value={nav.draft.megaMenuGroup1Heading}
              onChange={(v) => nav.update({ megaMenuGroup1Heading: v })}
            />
          </Field>
          <Field label="Mega menu — second column heading">
            <TextInput
              value={nav.draft.megaMenuGroup2Heading}
              onChange={(v) => nav.update({ megaMenuGroup2Heading: v })}
            />
          </Field>
        </Grid>
      </Panel>

      <Panel title="Footer call to action">
        <Grid>
          <Field label="Eyebrow">
            <TextInput
              value={footer.draft.ctaEyebrow}
              onChange={(v) => footer.update({ ctaEyebrow: v })}
            />
          </Field>
          <Field label="Button label">
            <TextInput
              value={footer.draft.ctaButtonLabel}
              onChange={(v) => footer.update({ ctaButtonLabel: v })}
            />
          </Field>
          <Field label="Headline — first line">
            <TextInput
              value={footer.draft.ctaTitleTop}
              onChange={(v) => footer.update({ ctaTitleTop: v })}
            />
          </Field>
          <Field label="Headline — second line" hint="Rendered in gold.">
            <TextInput
              value={footer.draft.ctaTitleBottom}
              onChange={(v) => footer.update({ ctaTitleBottom: v })}
            />
          </Field>
          <Field label="Button link">
            <TextInput
              value={footer.draft.ctaButtonHref}
              onChange={(v) => footer.update({ ctaButtonHref: v })}
            />
          </Field>
        </Grid>
      </Panel>

      <Panel title="Footer identity">
        <Field label="Tagline">
          <TextInput
            value={footer.draft.tagline}
            onChange={(v) => footer.update({ tagline: v })}
          />
        </Field>
        <Field label="Short blurb">
          <TextArea
            value={footer.draft.blurb}
            onChange={(v) => footer.update({ blurb: v })}
            rows={2}
          />
        </Field>
        <ListEditor<SocialLink>
          label="Social icons"
          addLabel="Add icon"
          items={footer.draft.socials}
          onChange={(socials) => footer.update({ socials })}
          titleFor={(s) => s.platform || "New icon"}
          makeNew={() => ({ id: newId("social"), platform: "Linkedin", url: "" })}
          collapsible={false}
          renderItem={(social, patch) => (
            <Grid>
              <Field label="Platform">
                <Select
                  value={social.platform}
                  onChange={(v) => patch({ platform: v })}
                  options={PLATFORMS.map((p) => ({ value: p, label: p }))}
                />
              </Field>
              <Field label="Profile URL">
                <TextInput value={social.url} onChange={(v) => patch({ url: v })} />
              </Field>
            </Grid>
          )}
        />
      </Panel>

      <Panel title="Footer columns">
        <Grid>
          <Field label="Company column heading">
            <TextInput
              value={footer.draft.companyHeading}
              onChange={(v) => footer.update({ companyHeading: v })}
            />
          </Field>
          <Field label="Businesses column heading">
            <TextInput
              value={footer.draft.businessesHeading}
              onChange={(v) => footer.update({ businessesHeading: v })}
            />
          </Field>
        </Grid>

        <ListEditor<LinkItem>
          label="Company links"
          addLabel="Add link"
          items={footer.draft.companyLinks}
          onChange={(companyLinks) => footer.update({ companyLinks })}
          titleFor={(l) => l.label || "New link"}
          makeNew={() => ({ id: newId("link"), label: "", href: "/" })}
          collapsible={false}
          renderItem={(item, patch) => (
            <Grid>
              <Field label="Label">
                <TextInput value={item.label} onChange={(v) => patch({ label: v })} />
              </Field>
              <Field label="Link">
                <TextInput value={item.href} onChange={(v) => patch({ href: v })} />
              </Field>
            </Grid>
          )}
        />
      </Panel>

      <Panel title="Footer contact column">
        <Field label="Column heading">
          <TextInput
            value={footer.draft.contactHeading}
            onChange={(v) => footer.update({ contactHeading: v })}
          />
        </Field>
        <StringListEditor
          label="Address lines"
          addLabel="Add line"
          value={footer.draft.addressLines}
          onChange={(addressLines) => footer.update({ addressLines })}
        />
        <Grid>
          <Field label="Extra link label">
            <TextInput
              value={footer.draft.contactExtraLink.label}
              onChange={(v) =>
                footer.update({
                  contactExtraLink: { ...footer.draft.contactExtraLink, label: v },
                })
              }
            />
          </Field>
          <Field label="Extra link target">
            <TextInput
              value={footer.draft.contactExtraLink.href}
              onChange={(v) =>
                footer.update({
                  contactExtraLink: { ...footer.draft.contactExtraLink, href: v },
                })
              }
            />
          </Field>
        </Grid>
      </Panel>

      <Panel title="Footer base">
        <Grid>
          <Field label="Copyright line">
            <TextInput
              value={footer.draft.copyright}
              onChange={(v) => footer.update({ copyright: v })}
            />
          </Field>
          <Field label="Background watermark" hint="The huge faint word behind the footer.">
            <TextInput
              value={footer.draft.watermark}
              onChange={(v) => footer.update({ watermark: v })}
            />
          </Field>
        </Grid>
      </Panel>

      <SaveBar
        dirty={dirty}
        saving={saving}
        error={footer.error || nav.error}
        savedAt={footer.savedAt ?? nav.savedAt}
        onSave={() => void saveBoth()}
        onDiscard={discardBoth}
        onReset={() => void resetBoth()}
      />
    </div>
  );
};

export default FooterNavEditor;
