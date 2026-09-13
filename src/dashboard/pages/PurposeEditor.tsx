import React from "react";
import { useSectionDraft, newId } from "../useSectionDraft";
import {
  Field,
  ListEditor,
  Panel,
  SaveBar,
  TextArea,
  TextInput,
} from "../components/ui";
import type { PurposeItem } from "../../content/types";

const PurposeEditor: React.FC = () => {
  const { draft, update, dirty, saving, error, savedAt, save, discard, resetToDefault } =
    useSectionDraft("purpose");

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Mission & vision</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          The dark blue "Our Purpose" band on the homepage.
        </p>
      </div>

      <Panel title="Section heading">
        <Field label="Eyebrow">
          <TextInput value={draft.eyebrow} onChange={(v) => update({ eyebrow: v })} />
        </Field>
      </Panel>

      <Panel
        title="Columns"
        description="Two columns read best on this layout; more will stack."
      >
        <ListEditor<PurposeItem>
          label="Statements"
          addLabel="Add statement"
          items={draft.items}
          onChange={(items) => update({ items })}
          titleFor={(i) => i.label || "New statement"}
          makeNew={() => ({ id: newId("purpose"), label: "", title: "", text: "" })}
          renderItem={(item, patch) => (
            <>
              <Field label="Label" hint="e.g. Mission">
                <TextInput value={item.label} onChange={(v) => patch({ label: v })} />
              </Field>
              <Field label="Headline">
                <TextInput value={item.title} onChange={(v) => patch({ title: v })} />
              </Field>
              <Field label="Body">
                <TextArea value={item.text} onChange={(v) => patch({ text: v })} rows={4} />
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

export default PurposeEditor;
