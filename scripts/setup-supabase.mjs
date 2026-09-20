#!/usr/bin/env node
// One-command backend setup for the JB Group dashboard.
//
//   npm run setup:supabase
//
// Reads from .env (git-ignored):
//   VITE_SUPABASE_URL        already there
//   SUPABASE_ACCESS_TOKEN    personal access token — supabase.com/dashboard/account/tokens
//   SUPER_ADMIN_EMAIL        optional, defaults to the email in supabase/schema.sql
//   SUPER_ADMIN_PASSWORD     optional; generated and printed once if missing
//
// Steps (each is safe to re-run):
//   1. apply supabase/schema.sql
//   2. turn off public sign-ups
//   3. create the Super Admin login, or reset its password and confirm it
//   4. deploy the admin-users Edge Function
//
// Revoke the access token afterwards if you don't need it again.

import { readFileSync, existsSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://api.supabase.com/v1";

function loadEnv() {
  const file = resolve(root, ".env");
  const env = { ...process.env };
  if (!existsSync(file)) return env;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const token = env.SUPABASE_ACCESS_TOKEN;
const url = env.VITE_SUPABASE_URL;
const ref = url?.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
const schema = readFileSync(resolve(root, "supabase/schema.sql"), "utf8");
const email = (env.SUPER_ADMIN_EMAIL || schema.match(/'super_admin_email',\s*'([^']+)'/)?.[1] || "").toLowerCase();

const ok = (msg) => console.log(`  ✓ ${msg}`);
const step = (msg) => console.log(`\n→ ${msg}`);
function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

if (!url || !ref) fail("VITE_SUPABASE_URL is missing or not a supabase.co URL in .env.");
if (!token) {
  fail(
    "SUPABASE_ACCESS_TOKEN is missing.\n" +
      "  Create one at https://supabase.com/dashboard/account/tokens and add this line to .env:\n" +
      "    SUPABASE_ACCESS_TOKEN=sbp_..."
  );
}
if (!email) fail("No Super Admin email found. Set SUPER_ADMIN_EMAIL in .env.");

async function api(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const detail = typeof body === "string" ? body : body?.message || JSON.stringify(body);
    throw new Error(`${init.method ?? "GET"} ${path} → ${res.status}: ${detail}`);
  }
  return body;
}

async function authAdmin(serviceKey, path, init = {}) {
  const res = await fetch(`${url}/auth/v1/admin${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`auth ${path} → ${res.status}: ${body?.msg || body?.message || JSON.stringify(body)}`);
  return body;
}

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#%*-_+=";
  let out;
  do {
    out = Array.from(randomBytes(18), (b) => chars[b % chars.length]).join("");
  } while (!(/[A-Z]/.test(out) && /[a-z]/.test(out) && /\d/.test(out) && /[^A-Za-z0-9]/.test(out)));
  return out;
}

console.log(`JB Group dashboard setup — project ${ref}`);

// 1. Schema
step("Applying supabase/schema.sql");
await api(`/projects/${ref}/database/query`, { method: "POST", body: JSON.stringify({ query: schema }) });
const tables = await api(`/projects/${ref}/database/query`, {
  method: "POST",
  body: JSON.stringify({
    query:
      "select string_agg(table_name, ', ' order by table_name) as t from information_schema.tables where table_schema = 'public' and table_name in ('site_content','profiles','roles','content_submissions','activity_log')",
  }),
});
ok(`tables ready: ${tables?.[0]?.t ?? "?"}`);

// 2. Sign-ups off
step("Turning off public sign-ups");
await api(`/projects/${ref}/config/auth`, { method: "PATCH", body: JSON.stringify({ disable_signup: true }) });
ok("only people added by an administrator can sign in");

// 3. Super Admin
step(`Setting up Super Admin ${email}`);
const keys = await api(`/projects/${ref}/api-keys?reveal=true`);
const serviceKey =
  keys.find((k) => k.name === "service_role")?.api_key ||
  keys.find((k) => k.type === "secret")?.api_key;
if (!serviceKey) fail("Couldn't read the project's service key with this token.");

let existing = null;
for (let page = 1; page <= 20 && !existing; page++) {
  const list = await authAdmin(serviceKey, `/users?page=${page}&per_page=100`);
  const users = list?.users ?? [];
  existing = users.find((u) => u.email?.toLowerCase() === email) ?? null;
  if (users.length < 100) break;
}

const providedPassword = env.SUPER_ADMIN_PASSWORD;
let printedPassword = null;

if (existing) {
  const patch = { email_confirm: true, ban_duration: "none" };
  if (providedPassword) patch.password = providedPassword;
  await authAdmin(serviceKey, `/users/${existing.id}`, { method: "PUT", body: JSON.stringify(patch) });
  ok(providedPassword ? "login exists — password updated from .env" : "login exists — password unchanged");
} else {
  const password = providedPassword || generatePassword();
  if (!providedPassword) printedPassword = password;
  await authAdmin(serviceKey, "/users", {
    method: "POST",
    body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { full_name: "" } }),
  });
  ok("login created");
}

// The schema promotes this email; re-assert in case the login predates it.
const role = await api(`/projects/${ref}/database/query`, {
  method: "POST",
  body: JSON.stringify({
    query: `update public.profiles set role = 'super_admin', active = true where lower(email) = '${email.replace(/'/g, "''")}' returning role`,
  }),
});
if (role?.[0]?.role !== "super_admin") fail("The login exists but its profile wasn't found. Re-run this script.");
ok("role: Super Admin");

// 4. Edge Function
step("Deploying the admin-users Edge Function");
const deploy = spawnSync(
  "npx",
  ["--yes", "supabase@latest", "functions", "deploy", "admin-users", "--project-ref", ref, "--use-api"],
  { cwd: root, stdio: "inherit", shell: process.platform === "win32", env: { ...process.env, SUPABASE_ACCESS_TOKEN: token } }
);
if (deploy.status !== 0) {
  console.log(
    "  ! Deploy failed. Everything else is set up; retry with:\n" +
      `    npx supabase functions deploy admin-users --project-ref ${ref} --use-api`
  );
} else {
  ok("user management is live");
}

console.log("\n✓ Setup complete.\n");
console.log(`  Sign in at /dashboard as ${email}`);
if (printedPassword) {
  console.log(`  Password: ${printedPassword}`);
  console.log("  (shown once — store it safely, then change it under My account)");
}
console.log("  Then press “Seed database” on the Overview page to copy the current site content into Supabase.\n");
