import React from "react";
import { Link } from "react-router";
import { useSectionDraft } from "../useSectionDraft";
import {
  Field,
  Grid,
  ImageInput,
  Notice,
  Panel,
  SaveBar,
  TextArea,
  TextInput,
} from "../components/ui";

const BrandPartnersEditor: React.FC = () => {
  const { draft, update, dirty, saving, error, savedAt, save, discard, resetToDefault } =
    useSectionDraft("brandPartners");

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Brand partners page</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          The framing of <code>/brand-partners</code>.
        </p>
      </div>

      <Notice>
        The partner logos themselves live with each company. Edit them under{" "}
        <Link to="/dashboard/businesses" className="underline font-medium">
          Businesses → Associated brands
        </Link>
        .
      </Notice>

      <Panel title="Page banner">
        <Grid cols={3}>
          <Field label="Title — first line">
            <TextInput
              value={draft.heroTitleTop}
              onChange={(v) => update({ heroTitleTop: v })}
            />
          </Field>
          <Field label="Title — second line" hint="Rendered in the gold gradient.">
            <TextInput
              value={draft.heroTitleBottom}
              onChange={(v) => update({ heroTitleBottom: v })}
            />
          </Field>
          <Field label="Subtitle">
            <TextInput
              value={draft.heroSubtitle}
              onChange={(v) => update({ heroSubtitle: v })}
            />
          </Field>
        </Grid>
        <ImageInput
          value={draft.heroImage}
          onChange={(v) => update({ heroImage: v })}
          label="Banner background image"
        />
      </Panel>

      <Panel title="Section heading">
        <Grid>
          <Field label="Eyebrow">
            <TextInput
              value={draft.sectionEyebrow}
              onChange={(v) => update({ sectionEyebrow: v })}
            />
          </Field>
          <Field label="Heading">
            <TextInput
              value={draft.sectionHeading}
              onChange={(v) => update({ sectionHeading: v })}
            />
          </Field>
        </Grid>
        <Field label="Intro paragraph" hint="Shown above the list of businesses and their brands.">
          <TextArea value={draft.intro} onChange={(v) => update({ intro: v })} rows={3} />
        </Field>
        <Field
          label="Empty state text"
          hint="Shown for a company that has no associated brands."
        >
          <TextInput
            value={draft.emptyStateText}
            onChange={(v) => update({ emptyStateText: v })}
          />
        </Field>
      </Panel>

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

export default BrandPartnersEditor;
