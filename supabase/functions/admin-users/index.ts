// Supabase Edge Function: admin-users
//
// Creates, updates and deletes dashboard logins. These operations need the
// service-role key, which must never reach the browser, so they run here.
//
// Every request is made on behalf of the signed-in caller:
//   - the caller must have the `users.manage` permission;
//   - profile changes (role, page access, active) are written with the
//     caller's own token, so the database rules in schema.sql still apply;
//   - only login-level changes (create, email, password, delete) use the
//     service-role client.
//
// Deploy:  npx supabase functions deploy admin-users --project-ref <ref>
// (SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are provided
// to Edge Functions automatically.)

import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ROLES = ["super_admin", "admin", "editor", "content_creator", "viewer"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

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

function assertEmail(email: unknown): string {
  const value = String(email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(value)) throw new HttpError(400, "Enter a valid email address.");
  return value;
}

function assertPassword(password: unknown): string {
  const value = String(password ?? "");
  if (value.length < MIN_PASSWORD) {
    throw new HttpError(400, `Passwords must be at least ${MIN_PASSWORD} characters.`);
  }
  return value;
}

function assertSections(sections: unknown): string[] | null {
  if (sections === null || sections === undefined) return null;
  if (!Array.isArray(sections) || sections.some((s) => typeof s !== "string")) {
    throw new HttpError(400, "Page access must be a list of section names.");
  }
  return sections as string[];
}

interface Caller {
  id: string;
  email: string;
  isSuperAdmin: boolean;
}

async function getProfile(admin: SupabaseClient, id: string) {
  const { data, error } = await admin
    .from("profiles")
    .select("id, email, role, active")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new HttpError(500, error.message);
  if (!data) throw new HttpError(404, "That user no longer exists.");
  return data as { id: string; email: string; role: string; active: boolean };
}

async function countActiveSuperAdmins(admin: SupabaseClient) {
  const { count, error } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "super_admin")
    .eq("active", true);
  if (error) throw new HttpError(500, error.message);
  return count ?? 0;
}

async function logActivity(
  admin: SupabaseClient,
  caller: Caller,
  action: string,
  target: string,
  details: Record<string, unknown> = {}
) {
  // Logging must never block the actual change.
  await admin
    .from("activity_log")
    .insert({ actor: caller.id, actor_email: caller.email, action, target, details })
    .then(({ error }) => error && console.error("activity log:", error.message));
}

/** Applies role / name / page-access / active changes with the caller's permissions. */
async function updateProfile(
  asCaller: SupabaseClient,
  id: string,
  changes: Record<string, unknown>
) {
  const patch: Record<string, unknown> = {};
  if ("full_name" in changes) patch.full_name = String(changes.full_name ?? "").trim();
  if ("role" in changes) {
    if (!ROLES.includes(String(changes.role))) throw new HttpError(400, "Unknown role.");
    patch.role = changes.role;
  }
  if ("sections" in changes) patch.sections = assertSections(changes.sections);
  if ("active" in changes) patch.active = Boolean(changes.active);
  if (Object.keys(patch).length === 0) return;

  const { data, error } = await asCaller.from("profiles").update(patch).eq("id", id).select("id");
  if (error) throw new HttpError(403, error.message);
  if (!data?.length) throw new HttpError(403, "You don't have permission to change this user.");
}

async function handleCreate(admin: SupabaseClient, asCaller: SupabaseClient, caller: Caller, body: any) {
  const email = assertEmail(body.email);
  const password = assertPassword(body.password);
  const role = String(body.role ?? "viewer");
  if (!ROLES.includes(role)) throw new HttpError(400, "Unknown role.");
  if (role === "super_admin" && !caller.isSuperAdmin) {
    throw new HttpError(403, "Only a Super Admin can create Super Admins.");
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: String(body.full_name ?? "").trim() },
  });
  if (error) {
    const exists = /already/i.test(error.message);
    throw new HttpError(exists ? 409 : 400, exists ? "A user with this email already exists." : error.message);
  }

  const id = data.user.id;
  try {
    await updateProfile(asCaller, id, {
      full_name: body.full_name ?? "",
      role,
      sections: body.sections ?? null,
    });
  } catch (e) {
    // Don't leave a half-configured login behind.
    await admin.auth.admin.deleteUser(id);
    throw e;
  }

  await logActivity(admin, caller, "user.created", email, { user_id: id, role });
  return { id };
}

async function handleUpdate(admin: SupabaseClient, asCaller: SupabaseClient, caller: Caller, body: any) {
  const id = String(body.id ?? "");
  if (!id) throw new HttpError(400, "Missing user id.");
  const target = await getProfile(admin, id);
  const touchesSuper = target.role === "super_admin" || body.role === "super_admin";

  const authChanges: { email?: string; password?: string; email_confirm?: boolean } = {};
  if (body.email !== undefined && String(body.email).trim().toLowerCase() !== target.email.toLowerCase()) {
    authChanges.email = assertEmail(body.email);
    authChanges.email_confirm = true;
  }
  if (body.password) authChanges.password = assertPassword(body.password);

  if (Object.keys(authChanges).length && target.role === "super_admin" && !caller.isSuperAdmin) {
    throw new HttpError(403, "Only a Super Admin can change a Super Admin's email or password.");
  }
  if (touchesSuper && ("role" in body || "active" in body) && !caller.isSuperAdmin) {
    throw new HttpError(403, "Only a Super Admin can change Super Admin accounts.");
  }

  // Profile first: the database enforces role, self-lockout and last-admin rules.
  await updateProfile(asCaller, id, body);

  if (Object.keys(authChanges).length) {
    const { error } = await admin.auth.admin.updateUserById(id, authChanges);
    if (error) {
      const taken = /already/i.test(error.message);
      throw new HttpError(taken ? 409 : 400, taken ? "Another user already uses this email." : error.message);
    }
    if (authChanges.email) {
      await logActivity(admin, caller, "user.email_changed", authChanges.email, {
        user_id: id,
        from: target.email,
      });
    }
    if (authChanges.password) {
      await logActivity(admin, caller, "user.password_changed", authChanges.email ?? target.email, { user_id: id });
    }
  }

  // A disabled profile already has no permissions; banning the login also
  // stops the person signing in at all (and refreshing an existing session).
  if (typeof body.active === "boolean" && body.active !== target.active) {
    const { error } = await admin.auth.admin.updateUserById(id, {
      ban_duration: body.active ? "none" : "876000h",
    });
    if (error) console.error("ban toggle:", error.message);
  }

  return { id };
}

async function handleDelete(admin: SupabaseClient, caller: Caller, body: any) {
  const id = String(body.id ?? "");
  if (!id) throw new HttpError(400, "Missing user id.");
  if (id === caller.id) throw new HttpError(400, "You can't delete your own account.");

  const target = await getProfile(admin, id);
  if (target.role === "super_admin") {
    if (!caller.isSuperAdmin) throw new HttpError(403, "Only a Super Admin can delete a Super Admin.");
    if (target.active && (await countActiveSuperAdmins(admin)) <= 1) {
      throw new HttpError(400, "There must always be at least one active Super Admin.");
    }
  }

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) throw new HttpError(400, error.message);

  await logActivity(admin, caller, "user.deleted", target.email, { user_id: id, role: target.role });
  return { id };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";

    const asCaller = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const token = authHeader.replace(/^Bearer\s+/i, "");
    const { data: userData } = await asCaller.auth.getUser(token);
    if (!userData?.user) throw new HttpError(401, "Your session has expired. Sign in again.");

    const [{ data: canManage }, { data: isSuperAdmin }] = await Promise.all([
      asCaller.rpc("has_perm", { p: "users.manage" }),
      asCaller.rpc("is_super_admin"),
    ]);
    if (!canManage) throw new HttpError(403, "You don't have permission to manage users.");

    const caller: Caller = {
      id: userData.user.id,
      email: userData.user.email ?? "",
      isSuperAdmin: Boolean(isSuperAdmin),
    };

    const body = await req.json().catch(() => ({}));
    switch (body.action) {
      case "create":
        return json(await handleCreate(admin, asCaller, caller, body));
      case "update":
        return json(await handleUpdate(admin, asCaller, caller, body));
      case "delete":
        return json(await handleDelete(admin, caller, body));
      default:
        throw new HttpError(400, "Unknown action.");
    }
  } catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    const message = e instanceof Error ? e.message : "Something went wrong.";
    if (status === 500) console.error(e);
    return json({ error: message }, status);
  }
});
