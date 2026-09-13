import React from "react";
import { useSectionDraft } from "../useSectionDraft";
import { useAuth } from "../AuthProvider";
import {
  Field,
  Grid,
  NumberInput,
  Panel,
  SaveBar,
  TextArea,
  TextInput,
  Toggle,
} from "../components/ui";

const ColorField: React.FC<{
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, hint, value, onChange }) => (
  <div>
    <span className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</span>
    <div className="flex gap-2 items-center">
      <input
        type="color"
        value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className="w-10 h-10 border border-slate-300 rounded-lg cursor-pointer bg-white p-1"
      />
      <div className="flex-1">
        <TextInput value={value} onChange={onChange} placeholder="#111D43" />
      </div>
    </div>
    {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
  </div>
);

const SettingsEditor: React.FC = () => {
  const { draft, update, dirty, saving, error, savedAt, save, discard, resetToDefault } =
    useSectionDraft("settings");
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Site-wide identity, brand colours and loading behaviour.
        </p>
      </div>

      <Panel title="Site identity">
        <Field label="Site title" hint="Shown in the browser tab.">
          <TextInput value={draft.siteTitle} onChange={(v) => update({ siteTitle: v })} />
        </Field>
        <Field label="Meta description" hint="Used by search engines and link previews.">
          <TextArea
            value={draft.metaDescription}
            onChange={(v) => update({ metaDescription: v })}
            rows={3}
          />
        </Field>
      </Panel>

      <Panel
        title="Brand colours"
        description="These drive the whole site palette. Changes preview live as you pick."
      >
        <Grid>
          <ColorField
            label="Primary blue"
            hint="Headers, footer, dark sections."
            value={draft.brandBlue}
            onChange={(v) => update({ brandBlue: v })}
          />
          <ColorField
            label="Accent gold"
            hint="Highlights, buttons, underlines."
            value={draft.brandGold}
            onChange={(v) => update({ brandGold: v })}
          />
        </Grid>
      </Panel>

      <Panel title="Homepage loading screen">
        <Toggle
          checked={draft.loaderEnabled}
          onChange={(v) => update({ loaderEnabled: v })}
          label={draft.loaderEnabled ? "Loading screen enabled" : "Loading screen disabled"}
        />
        <Field label="Duration (milliseconds)" hint="1500 = 1.5 seconds.">
          <NumberInput
            value={draft.loaderDurationMs}
            min={0}
            step={100}
            onChange={(v) => update({ loaderDurationMs: v })}
          />
        </Field>
      </Panel>

      <Panel
        title="Your account"
        description="Admin accounts are managed in Supabase under Authentication → Users."
      >
        <p className="text-sm text-slate-600">
          Signed in as <strong>{user?.email}</strong>.
        </p>
        <p className="text-xs text-slate-500 leading-relaxed">
          To add another editor, create the user in Supabase and keep public sign-ups
          disabled so nobody can register themselves.
        </p>
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

export default SettingsEditor;
