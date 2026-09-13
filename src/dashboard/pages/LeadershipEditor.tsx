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
  Toggle,
} from "../components/ui";
import type { Leader } from "../../content/types";

const LeadershipEditor: React.FC = () => {
  const { draft, update, dirty, saving, error, savedAt, save, discard, resetToDefault } =
    useSectionDraft("leadership");

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Leadership</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          The full <code>/leadership</code> page — banner, heritage story, and every
          board profile.
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

      <Panel title="Heritage introduction">
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
          hint="The first paragraph gets the large decorative drop cap."
        />
        <Field label="Pull quote" hint="The large statement beside the heritage text.">
          <TextArea
            value={draft.pullQuote}
            onChange={(v) => update({ pullQuote: v })}
            rows={2}
          />
        </Field>
      </Panel>

      <Panel
        title="Board profiles"
        description="Each profile shows a portrait, a name, a role and a multi-paragraph biography. Unpublish to hide someone without deleting their profile."
      >
        <Field label="Section heading">
          <TextInput
            value={draft.boardHeading}
            onChange={(v) => update({ boardHeading: v })}
          />
        </Field>

        <ListEditor<Leader>
          label="Profiles"
          addLabel="Add profile"
          items={draft.leaders}
          onChange={(leaders) =>
            update({ leaders: leaders.map((l, idx) => ({ ...l, order: idx })) })
          }
          titleFor={(l, i) =>
            `${l.name || `Profile ${i + 1}`}${l.role ? ` — ${l.role}` : ""}${
              l.published ? "" : "  (hidden)"
            }`
          }
          makeNew={() => ({
            id: newId("leader"),
            name: "",
            role: "",
            photo: "",
            bio: [""],
            published: true,
            order: 0,
          })}
          renderItem={(leader, patch) => (
            <>
              <div className="pb-3 border-b border-slate-100">
                <Toggle
                  checked={leader.published}
                  onChange={(v) => patch({ published: v })}
                  label={leader.published ? "Published" : "Hidden from the site"}
                />
              </div>

              <Grid>
                <Field label="Full name" hint="Shown as the large headline.">
                  <TextInput value={leader.name} onChange={(v) => patch({ name: v })} />
                </Field>
                <Field label="Role / title">
                  <TextInput
                    value={leader.role}
                    onChange={(v) => patch({ role: v })}
                    placeholder="Joint Managing Director"
                  />
                </Field>
              </Grid>

              <ImageInput
                value={leader.photo}
                onChange={(v) => patch({ photo: v })}
                label="Portrait"
                hint="A 3:4 portrait crop looks best."
              />

              <StringListEditor
                label="Biography paragraphs"
                addLabel="Add paragraph"
                multiline
                value={leader.bio}
                onChange={(bio) => patch({ bio })}
                hint="The first paragraph begins with a coloured drop cap."
              />
            </>
          )}
        />
      </Panel>

      <Panel title="Closing statement">
        <Field label="Quote">
          <TextArea
            value={draft.closingQuote}
            onChange={(v) => update({ closingQuote: v })}
            rows={4}
          />
        </Field>
        <ImageInput
          value={draft.closingImage}
          onChange={(v) => update({ closingImage: v })}
          label="Background image"
          hint="Used very faintly behind the closing quote."
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

export default LeadershipEditor;
