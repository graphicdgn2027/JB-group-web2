import React from "react";
import { useSectionDraft, newId } from "../useSectionDraft";
import {
  Field,
  Grid,
  ListEditor,
  Panel,
  SaveBar,
  Select,
  TextArea,
  TextInput,
} from "../components/ui";
import type { SelectOption, SocialLink } from "../../content/types";

const PLATFORMS = ["Linkedin", "Twitter", "Facebook", "Instagram", "Youtube"];

const ContactEditor: React.FC = () => {
  const { draft, update, dirty, saving, error, savedAt, save, discard, resetToDefault } =
    useSectionDraft("contact");

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Contact page</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Contact details, map, social links and the enquiry form's dropdown options.
        </p>
      </div>

      <Panel title="Page banner">
        <Grid>
          <Field label="Eyebrow">
            <TextInput
              value={draft.heroEyebrow}
              onChange={(v) => update({ heroEyebrow: v })}
            />
          </Field>
          <Field label="Subtitle">
            <TextInput
              value={draft.heroSubtitle}
              onChange={(v) => update({ heroSubtitle: v })}
            />
          </Field>
          <Field label="Title">
            <TextInput value={draft.heroTitle} onChange={(v) => update({ heroTitle: v })} />
          </Field>
          <Field label="Title accent word" hint="Rendered in gold.">
            <TextInput
              value={draft.heroTitleAccent}
              onChange={(v) => update({ heroTitleAccent: v })}
            />
          </Field>
        </Grid>
      </Panel>

      <Panel
        title="Contact details"
        description="These fill the four quick-action cards and are also used for the tel: and mailto: links."
      >
        <Grid>
          <Field label="Phone number">
            <TextInput value={draft.phone} onChange={(v) => update({ phone: v })} />
          </Field>
          <Field label="Phone caption">
            <TextInput value={draft.phoneSub} onChange={(v) => update({ phoneSub: v })} />
          </Field>
          <Field label="Email address">
            <TextInput value={draft.email} onChange={(v) => update({ email: v })} />
          </Field>
          <Field label="Email caption">
            <TextInput value={draft.emailSub} onChange={(v) => update({ emailSub: v })} />
          </Field>
          <Field label="Address — building">
            <TextInput
              value={draft.addressTitle}
              onChange={(v) => update({ addressTitle: v })}
            />
          </Field>
          <Field label="Address — area">
            <TextInput value={draft.addressSub} onChange={(v) => update({ addressSub: v })} />
          </Field>
          <Field label="Working days">
            <TextInput value={draft.hoursValue} onChange={(v) => update({ hoursValue: v })} />
          </Field>
          <Field label="Working hours">
            <TextInput value={draft.hoursSub} onChange={(v) => update({ hoursSub: v })} />
          </Field>
        </Grid>
        <Field label="Hours badge text" hint="The small pill on the working-hours card.">
          <TextInput value={draft.hoursNote} onChange={(v) => update({ hoursNote: v })} />
        </Field>
      </Panel>

      <Panel title="Map">
        <Field
          label="Google Maps embed URL"
          hint="In Google Maps choose Share → Embed a map, then copy only the src=… value."
        >
          <TextArea
            value={draft.mapEmbedUrl}
            onChange={(v) => update({ mapEmbedUrl: v })}
            rows={3}
          />
        </Field>
        <Field label="Get directions link">
          <TextInput
            value={draft.mapDirectionsUrl}
            onChange={(v) => update({ mapDirectionsUrl: v })}
          />
        </Field>
      </Panel>

      <Panel title="Social links">
        <ListEditor<SocialLink>
          label="Profiles"
          addLabel="Add profile"
          items={draft.socials}
          onChange={(socials) => update({ socials })}
          titleFor={(s) => s.platform || "New profile"}
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

      <Panel title="Enquiry form options">
        <ListEditor<SelectOption>
          label="Enquiry types"
          addLabel="Add type"
          items={draft.inquiryTypes}
          onChange={(inquiryTypes) => update({ inquiryTypes })}
          titleFor={(o) => o.label || "New option"}
          makeNew={() => ({ id: newId("inq"), label: "" })}
          collapsible={false}
          renderItem={(opt, patch) => (
            <Field label="Label">
              <TextInput value={opt.label} onChange={(v) => patch({ label: v })} />
            </Field>
          )}
        />
        <div className="pt-2">
          <ListEditor<SelectOption>
            label="Company options"
            addLabel="Add company"
            items={draft.companies}
            onChange={(companies) => update({ companies })}
            titleFor={(o) => o.label || "New option"}
            makeNew={() => ({ id: newId("co"), label: "" })}
            collapsible={false}
            renderItem={(opt, patch) => (
              <Field label="Label">
                <TextInput value={opt.label} onChange={(v) => patch({ label: v })} />
              </Field>
            )}
          />
        </div>
      </Panel>

      <Panel
        title="Form delivery"
        description="Routes enquiry-form submissions to an email inbox — no server of our own required."
      >
        <Field
          label="Web3Forms access key"
          hint={
            <>
              Free at{" "}
              <a
                href="https://web3forms.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline"
              >
                web3forms.com
              </a>
              : sign up with the inbox you want enquiries sent to (e.g. info@rtinepal.com),
              then paste the access key it gives you here. Leave empty and the form falls
              back to opening the visitor's own email app instead.
            </>
          }
        >
          <TextInput
            value={draft.formAccessKey}
            onChange={(v) => update({ formAccessKey: v })}
            placeholder="e.g. 5b3b2e21-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          />
        </Field>
      </Panel>

      <Panel title="Form messages">
        <Field label="Success heading">
          <TextInput
            value={draft.successTitle}
            onChange={(v) => update({ successTitle: v })}
          />
        </Field>
        <Field label="Success message">
          <TextArea
            value={draft.successMessage}
            onChange={(v) => update({ successMessage: v })}
            rows={2}
          />
        </Field>
        <Field label="Privacy note">
          <TextArea
            value={draft.privacyNote}
            onChange={(v) => update({ privacyNote: v })}
            rows={2}
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

export default ContactEditor;
