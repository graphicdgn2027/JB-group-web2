// Supabase Edge Function: contact-form
//
// Two jobs:
//   submit  (public)  Saves a contact-form message to the dashboard inbox and
//                     emails a notification through your own SMTP server.
//   test    (signed in, settings.manage)  Sends a test email with the saved
//                     settings so the dashboard can confirm they work.
//
// The SMTP password lives in public.mail_settings, which no browser can read;
// only this function (service role) sees it.
//
// Supabase blocks outgoing connections on ports 25 and 587, so use your mail
// server's SSL port, 465.
//
// Deploy:  npx supabase functions deploy contact-form --no-verify-jwt --project-ref <ref>
// (--no-verify-jwt lets the public form call it; the test action checks the
// caller's login itself.)

import { createClient } from "npm:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.16";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_WINDOW_MINUTES = 10;
const RATE_MAX = 5;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function hashIp(ip: string): Promise<string> {
  // Stored only as a salted hash, for rate limiting; never the address itself.
  const data = new TextEncoder().encode(`${ip}:${SERVICE_KEY.slice(-16)}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

interface MailSettings {
  enabled: boolean;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  from_email: string;
  from_name: string;
  notify_to: string;
  autoreply_enabled: boolean;
  autoreply_subject: string;
  autoreply_body: string;
  routes: { companies?: Record<string, string>; inquiries?: Record<string, string> } | null;
  copy_main_inbox: boolean;
}

const splitAddresses = (value: string | undefined) =>
  (value ?? "")
    .split(/[,;\s]+/)
    .map((x) => x.trim())
    .filter((x) => EMAIL_RE.test(x));

/**
 * Who gets a message: the mailbox set for the chosen company and/or enquiry
 * type, plus the main address when "copy main inbox" is on. Addresses come
 * only from the private settings row, never from the request, so the form
 * can't be used to email anyone else.
 */
function routeFor(s: MailSettings, companyId: string, inquiryId: string): string[] {
  const routed = [
    ...splitAddresses(s.routes?.companies?.[companyId]),
    ...splitAddresses(s.routes?.inquiries?.[inquiryId]),
  ];
  const main = splitAddresses(s.notify_to);
  const all = routed.length ? (s.copy_main_inbox ? [...routed, ...main] : routed) : main;
  return [...new Set(all.map((a) => a.toLowerCase()))];
}

async function loadMailSettings(): Promise<MailSettings | null> {
  const { data, error } = await admin.from("mail_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  return data as MailSettings | null;
}

function transportFor(s: MailSettings) {
  if (!s.smtp_host || !s.smtp_user || !s.smtp_password) {
    throw new HttpError(400, "Email isn't fully set up: add the mail server, username and password.");
  }
  return nodemailer.createTransport({
    host: s.smtp_host,
    port: s.smtp_port || 465,
    secure: (s.smtp_port || 465) === 465,
    auth: { user: s.smtp_user, pass: s.smtp_password },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });
}

const fromHeader = (s: MailSettings) => {
  const address = s.from_email || s.smtp_user;
  return s.from_name ? `"${s.from_name.replace(/"/g, "")}" <${address}>` : address;
};

const recipients = (s: MailSettings) => splitAddresses(s.notify_to);

/* -------------------------------------------------------------- handlers */

async function handleSubmit(req: Request, body: Record<string, unknown>) {
  // Bots fill every field; people never see this one.
  if (clean(body.website, 200)) return json({ ok: true });

  const msg = {
    first_name: clean(body.firstName, 80),
    last_name: clean(body.lastName, 80),
    email: clean(body.email, 160).toLowerCase(),
    phone: clean(body.phone, 40),
    company: clean(body.company, 120),
    inquiry_type: clean(body.inquiryType, 80),
    message: clean(body.message, 5000),
    page: clean(body.page, 200),
  };
  if (!msg.first_name) throw new HttpError(400, "Please enter your name.");
  if (!EMAIL_RE.test(msg.email)) throw new HttpError(400, "Please enter a valid email address.");
  if (msg.message.length < 10) throw new HttpError(400, "Please write a little more in your message.");

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const ip_hash = await hashIp(ip);
  const since = new Date(Date.now() - RATE_WINDOW_MINUTES * 60_000).toISOString();
  const { count } = await admin
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ip_hash)
    .gte("created_at", since);
  if ((count ?? 0) >= RATE_MAX) {
    throw new HttpError(429, "Too many messages in a short time. Please try again in a few minutes.");
  }

  const { data: row, error } = await admin
    .from("contact_messages")
    .insert({ ...msg, ip_hash })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  // The message is safe in the inbox now; email is a best-effort extra.
  let email_status: "sent" | "failed" | "skipped" = "skipped";
  let email_error = "";
  let routed_to = "";
  try {
    const s = await loadMailSettings();
    const to = s ? routeFor(s, clean(body.companyId, 80), clean(body.inquiryTypeId, 80)) : [];
    routed_to = to.join(", ");
    if (s?.enabled && to.length) {
      const transport = transportFor(s);
      const name = `${msg.first_name} ${msg.last_name}`.trim();
      const lines = [
        ["Name", name],
        ["Email", msg.email],
        ["Phone", msg.phone],
        ["Company", msg.company],
        ["Enquiry", msg.inquiry_type],
        ["Sent from", msg.page],
      ].filter(([, v]) => v);

      await transport.sendMail({
        from: fromHeader(s),
        to,
        replyTo: `"${name.replace(/"/g, "")}" <${msg.email}>`,
        subject: `New enquiry${msg.inquiry_type ? ` (${msg.inquiry_type})` : ""} from ${name}`,
        text: `${lines.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${msg.message}\n\nReply to this email to answer ${msg.first_name} directly.`,
        html: `<table style="font:14px/1.5 Arial,sans-serif;color:#111d43">${lines
          .map(([k, v]) => `<tr><td style="padding:2px 16px 2px 0;color:#64748b">${k}</td><td>${escapeHtml(v)}</td></tr>`)
          .join("")}</table><p style="font:14px/1.6 Arial,sans-serif;color:#111d43;white-space:pre-wrap;margin-top:16px">${escapeHtml(
          msg.message
        )}</p><p style="font:12px Arial,sans-serif;color:#94a3b8">Reply to this email to answer ${escapeHtml(
          msg.first_name
        )} directly. The message is also in the dashboard inbox.</p>`,
      });

      if (s.autoreply_enabled && s.autoreply_body.trim()) {
        await transport.sendMail({
          from: fromHeader(s),
          to: msg.email,
          subject: s.autoreply_subject || "We received your message",
          text: s.autoreply_body.replaceAll("{name}", msg.first_name),
        });
      }
      email_status = "sent";
    }
  } catch (e) {
    email_status = "failed";
    email_error = (e instanceof Error ? e.message : String(e)).slice(0, 500);
    console.error("[contact-form] email failed:", email_error);
  }
  await admin.from("contact_messages").update({ email_status, email_error, routed_to }).eq("id", row.id);

  return json({ ok: true });
}

async function handleTest(req: Request, body: Record<string, unknown>) {
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) throw new HttpError(401, "Sign in to send a test email.");
  const caller = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const { data: access, error } = await caller.rpc("my_access");
  const perms = (access as { permissions?: Record<string, boolean> } | null)?.permissions ?? {};
  if (error || !perms["settings.manage"]) {
    throw new HttpError(403, "You don't have permission to change email settings.");
  }

  const s = await loadMailSettings();
  if (!s) throw new HttpError(400, "Save your email settings first.");
  const to = clean(body.to, 160) || recipients(s)[0];
  if (!EMAIL_RE.test(to)) throw new HttpError(400, "Add an address to send the test to.");

  try {
    const transport = transportFor(s);
    await transport.verify();
    await transport.sendMail({
      from: fromHeader(s),
      to,
      subject: "Test email from the JB Group dashboard",
      text: "If you can read this, the website can send email through your mail server.",
    });
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(400, `Your mail server refused the connection: ${e instanceof Error ? e.message : e}`);
  }
  return json({ ok: true, to });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    if (body.action === "test") return await handleTest(req, body);
    return await handleSubmit(req, body);
  } catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    const message = e instanceof HttpError ? e.message : "Something went wrong. Please try again.";
    if (!(e instanceof HttpError)) console.error("[contact-form]", e);
    return json({ error: message }, status);
  }
});
