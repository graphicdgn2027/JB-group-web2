import React from "react";
import { useSectionDraft, newId } from "../useSectionDraft";
import {
  Field,
  Grid,
  ListEditor,
  Panel,
  SaveBar,
  TextArea,
  TextInput,
} from "../components/ui";
import type { TimelineItem } from "../../content/types";

const TimelineEditor: React.FC = () => {
  const { draft, update, dirty, saving, error, savedAt, save, discard, resetToDefault } =
    useSectionDraft("timeline");

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Journey timeline</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          The vertical company history shown at the bottom of the About page.
        </p>
      </div>

      <Panel title="Section heading">
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
        <Field label="Subtitle">
          <TextArea value={draft.subtitle} onChange={(v) => update({ subtitle: v })} rows={2} />
        </Field>
      </Panel>

      <Panel
        title="Milestones"
        description="Listed top to bottom in this order. The year field accepts any short label, not just numbers."
      >
        <ListEditor<TimelineItem>
          label="Milestones"
          addLabel="Add milestone"
          items={draft.items}
          onChange={(items) => update({ items })}
          titleFor={(i) => `${i.year} — ${i.title}`.replace(/^ — $/, "New milestone")}
          makeNew={() => ({ id: newId("milestone"), year: "", title: "", desc: "" })}
          renderItem={(item, patch) => (
            <>
              <Grid>
                <Field label="Year or label" hint="e.g. 1982, Growth, Today">
                  <TextInput value={item.year} onChange={(v) => patch({ year: v })} />
                </Field>
                <Field label="Title">
                  <TextInput value={item.title} onChange={(v) => patch({ title: v })} />
                </Field>
              </Grid>
              <Field label="Description">
                <TextArea value={item.desc} onChange={(v) => patch({ desc: v })} rows={3} />
              </Field>
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

export default TimelineEditor;
