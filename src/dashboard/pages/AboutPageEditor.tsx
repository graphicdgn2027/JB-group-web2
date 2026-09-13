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
  TextArea,
  TextInput,
} from "../components/ui";
import type { LabelledText } from "../../content/types";

const AboutPageEditor: React.FC = () => {
  const { draft, update, dirty, saving, error, savedAt, save, discard, resetToDefault } =
    useSectionDraft("aboutPage");

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">About page</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Everything on <code>/about</code> except the journey timeline, which has its
          own page in the sidebar.
        </p>
      </div>

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

      <Panel title="Heritage">
        <Field label="Heading">
          <TextInput
            value={draft.heritageHeading}
            onChange={(v) => update({ heritageHeading: v })}
          />
        </Field>
        <StringListEditor
          label="Paragraphs"
          addLabel="Add paragraph"
          multiline
          value={draft.heritageParagraphs}
          onChange={(heritageParagraphs) => update({ heritageParagraphs })}
        />
      </Panel>

      <Panel title="Philosophy sidebar" description="The dark blue card beside the heritage text.">
        <Field label="Heading">
          <TextInput
            value={draft.philosophyHeading}
            onChange={(v) => update({ philosophyHeading: v })}
          />
        </Field>
        <ListEditor<LabelledText>
          label="Philosophy items"
          addLabel="Add item"
          items={draft.philosophyItems}
          onChange={(philosophyItems) => update({ philosophyItems })}
          titleFor={(i) => i.title || "New item"}
          makeNew={() => ({ id: newId("phil"), title: "", text: "" })}
          collapsible={false}
          renderItem={(item, patch) => (
            <Grid>
              <Field label="Title" hint="e.g. BELIEVING">
                <TextInput value={item.title} onChange={(v) => patch({ title: v })} />
              </Field>
              <Field label="Text">
                <TextInput value={item.text} onChange={(v) => patch({ text: v })} />
              </Field>
            </Grid>
          )}
        />
      </Panel>

      <Panel title="Feature quote">
        <Field label="Quote">
          <TextArea value={draft.quote} onChange={(v) => update({ quote: v })} rows={3} />
        </Field>
      </Panel>

      <Panel title="Vision & mission cards">
        <Grid>
          <Field label="Vision title">
            <TextInput value={draft.visionTitle} onChange={(v) => update({ visionTitle: v })} />
          </Field>
          <Field label="Mission title">
            <TextInput
              value={draft.missionTitle}
              onChange={(v) => update({ missionTitle: v })}
            />
          </Field>
        </Grid>
        <Field label="Vision text">
          <TextArea
            value={draft.visionText}
            onChange={(v) => update({ visionText: v })}
            rows={4}
          />
        </Field>
        <Field label="Mission text">
          <TextArea
            value={draft.missionText}
            onChange={(v) => update({ missionText: v })}
            rows={4}
          />
        </Field>
      </Panel>

      <Panel title="Core values">
        <Grid>
          <Field label="Heading">
            <TextInput
              value={draft.coreValuesHeading}
              onChange={(v) => update({ coreValuesHeading: v })}
            />
          </Field>
          <Field label="Background watermark" hint="The huge faint text behind the grid.">
            <TextInput
              value={draft.coreValuesWatermark}
              onChange={(v) => update({ coreValuesWatermark: v })}
            />
          </Field>
        </Grid>
        <ListEditor<LabelledText>
          label="Values"
          addLabel="Add value"
          items={draft.coreValues}
          onChange={(coreValues) => update({ coreValues })}
          titleFor={(v) => v.title || "New value"}
          makeNew={() => ({ id: newId("value"), title: "", text: "" })}
          collapsible={false}
          renderItem={(item, patch) => (
            <>
              <Field label="Title">
                <TextInput value={item.title} onChange={(v) => patch({ title: v })} />
              </Field>
              <Field label="Description">
                <TextArea value={item.text} onChange={(v) => patch({ text: v })} rows={2} />
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

export default AboutPageEditor;
