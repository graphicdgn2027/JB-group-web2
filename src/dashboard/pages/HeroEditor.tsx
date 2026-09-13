import React from "react";
import { useSectionDraft, newId } from "../useSectionDraft";
import {
  Field,
  Grid,
  ImageInput,
  ListEditor,
  NumberInput,
  Panel,
  SaveBar,
  TextArea,
  TextInput,
} from "../components/ui";
import type { HeroSlide } from "../../content/types";

const HeroEditor: React.FC = () => {
  const { draft, update, dirty, saving, error, savedAt, save, discard, resetToDefault } =
    useSectionDraft("hero");

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Home hero</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          The full-screen rotating banner at the top of the homepage.
        </p>
      </div>

      <Panel title="Slideshow behaviour">
        <Field
          label="Seconds each slide stays on screen"
          hint="Stored in milliseconds. 6500 = 6.5 seconds."
        >
          <NumberInput
            value={draft.slideDurationMs}
            min={1000}
            step={500}
            onChange={(v) => update({ slideDurationMs: v })}
          />
        </Field>
      </Panel>

      <Panel
        title="Slides"
        description="Shown in this order. Each slide has a background image, a two-line headline and one call-to-action button."
      >
        <ListEditor<HeroSlide>
          label="Hero slides"
          addLabel="Add slide"
          items={draft.slides}
          onChange={(slides) => update({ slides })}
          titleFor={(s, i) => s.label || s.titleTop || `Slide ${i + 1}`}
          makeNew={() => ({
            id: newId("slide"),
            image: "",
            eyebrow: "",
            label: "",
            titleTop: "",
            titleBottom: "",
            description: "",
            ctaLabel: "Learn More",
            ctaHref: "/about",
          })}
          renderItem={(slide, patch) => (
            <>
              <ImageInput
                value={slide.image}
                onChange={(v) => patch({ image: v })}
                label="Background image"
                hint="Wide landscape images work best — roughly 1920×1080."
              />
              <Grid>
                <Field label="Eyebrow" hint="Small label above the title.">
                  <TextInput
                    value={slide.eyebrow}
                    onChange={(v) => patch({ eyebrow: v })}
                    placeholder="Since 1982"
                  />
                </Field>
                <Field label="Company label">
                  <TextInput
                    value={slide.label}
                    onChange={(v) => patch({ label: v })}
                    placeholder="JB Group"
                  />
                </Field>
                <Field label="Headline — first line" hint="Shown in the gold accent colour.">
                  <TextInput
                    value={slide.titleTop}
                    onChange={(v) => patch({ titleTop: v })}
                  />
                </Field>
                <Field label="Headline — second line" hint="Shown in bold white.">
                  <TextInput
                    value={slide.titleBottom}
                    onChange={(v) => patch({ titleBottom: v })}
                  />
                </Field>
              </Grid>
              <Field label="Description">
                <TextArea
                  value={slide.description}
                  onChange={(v) => patch({ description: v })}
                  rows={3}
                />
              </Field>
              <Grid>
                <Field label="Button label">
                  <TextInput
                    value={slide.ctaLabel}
                    onChange={(v) => patch({ ctaLabel: v })}
                  />
                </Field>
                <Field label="Button link" hint="e.g. /about or /brand-partners">
                  <TextInput value={slide.ctaHref} onChange={(v) => patch({ ctaHref: v })} />
                </Field>
              </Grid>
            </>
          )}
        />
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

export default HeroEditor;
