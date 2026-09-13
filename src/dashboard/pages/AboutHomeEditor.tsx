import React from "react";
import { useSectionDraft, newId } from "../useSectionDraft";
import {
  Field,
  Grid,
  ImageInput,
  ListEditor,
  Panel,
  SaveBar,
  StringListEditor,
  TextInput,
} from "../components/ui";
import type { StatItem } from "../../content/types";

const AboutHomeEditor: React.FC = () => {
  const { draft, update, dirty, saving, error, savedAt, save, discard, resetToDefault } =
    useSectionDraft("aboutHome");

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Home — about block</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          The "Why We Are" section on the homepage, with its photo and counters.
        </p>
      </div>

      <Panel title="Heading">
        <Grid cols={3}>
          <Field label="Eyebrow">
            <TextInput value={draft.eyebrow} onChange={(v) => update({ eyebrow: v })} />
          </Field>
          <Field label="Title — first line">
            <TextInput value={draft.titleLine1} onChange={(v) => update({ titleLine1: v })} />
          </Field>
          <Field label="Title — second line">
            <TextInput value={draft.titleLine2} onChange={(v) => update({ titleLine2: v })} />
          </Field>
        </Grid>
      </Panel>

      <Panel title="Photo">
        <ImageInput
          value={draft.image}
          onChange={(v) => update({ image: v })}
          label="Section photo"
          hint="Displayed tall on the left with a gentle parallax drift."
        />
      </Panel>

      <Panel
        title="Body copy"
        description="The first paragraph begins with a large drop cap. Because the cap is rendered separately, the first paragraph should start with the rest of that word — e.g. cap 'W' + text 'e exist to build…'."
      >
        <Field label="Drop cap letter">
          <TextInput value={draft.dropCap} onChange={(v) => update({ dropCap: v })} />
        </Field>
        <StringListEditor
          label="Paragraphs"
          addLabel="Add paragraph"
          multiline
          value={draft.paragraphs}
          onChange={(paragraphs) => update({ paragraphs })}
        />
      </Panel>

      <Panel title="Counters" description="The four small statistic tiles beneath the photo.">
        <ListEditor<StatItem>
          label="Statistics"
          addLabel="Add statistic"
          items={draft.stats}
          onChange={(stats) => update({ stats })}
          titleFor={(s) => `${s.value} ${s.label}`.trim() || "New statistic"}
          makeNew={() => ({ id: newId("stat"), value: "", label: "" })}
          renderItem={(stat, patch) => (
            <Grid>
              <Field label="Value" hint="e.g. 45+">
                <TextInput value={stat.value} onChange={(v) => patch({ value: v })} />
              </Field>
              <Field label="Label" hint="e.g. Years">
                <TextInput value={stat.label} onChange={(v) => patch({ label: v })} />
              </Field>
            </Grid>
          )}
        />
      </Panel>

      <Panel title="Link">
        <Grid>
          <Field label="Link label">
            <TextInput value={draft.ctaLabel} onChange={(v) => update({ ctaLabel: v })} />
          </Field>
          <Field label="Link target">
            <TextInput value={draft.ctaHref} onChange={(v) => update({ ctaHref: v })} />
          </Field>
        </Grid>
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

export default AboutHomeEditor;
