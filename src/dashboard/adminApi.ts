import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { SectionKey, SiteContent } from "../content/types";
import type { Permission, RoleDef } from "./permissions";

function db() {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

/* ------------------------------------------------------------------ users */

export interface ManagedUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  sections: string[] | null;
  active: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

export async function listUsers(): Promise<ManagedUser[]> {
  const { data, error } = await db().rpc("list_users");
  if (error) throw new Error(error.message);
  return (data ?? []) as ManagedUser[];
}

export class UserServiceMissingError extends Error {
  constructor() {
    super(
      "The user-management service isn't deployed yet, so logins can't be created, deleted or have their email or password changed. See DASHBOARD.md → “Deploy user management”."
    );
  }
}

async function callAdminUsers<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await db().functions.invoke("admin-users", { body });
  if (!error) return data as T;

  if (error instanceof FunctionsHttpError) {
    const response = error.context as Response;
    if (response.status === 404) throw new UserServiceMissingError();
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? `Request failed (${response.status}).`);
  }
  if (error instanceof FunctionsFetchError || error instanceof FunctionsRelayError) {
    throw new UserServiceMissingError();
  }
  throw new Error(error.message);
}

export interface NewUserInput {
  email: string;
  password: string;
  full_name: string;
  role: string;
  sections: string[] | null;
}

export function createUser(input: NewUserInput) {
  return callAdminUsers<{ id: string }>({ action: "create", ...input });
}

export interface UserChanges {
  full_name?: string;
  role?: string;
  sections?: string[] | null;
  active?: boolean;
  email?: string;
  password?: string;
}

/**
 * Profile-only changes go straight to the database (the rules there apply),
 * so they work even before the Edge Function is deployed. Email and password
 * changes need the function.
 */
export async function updateUser(id: string, changes: UserChanges) {
  const needsService = Boolean(changes.password) || changes.email !== undefined;
  if (needsService) {
    await callAdminUsers({ action: "update", id, ...changes });
    return;
  }
  const { email: _e, password: _p, ...profile } = changes;
  const { data, error } = await db().from("profiles").update(profile).eq("id", id).select("id");
  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error("You don't have permission to change this user.");
}

export function deleteUser(id: string) {
  return callAdminUsers<{ id: string }>({ action: "delete", id });
}

export async function sendResetEmail(email: string) {
  const { error } = await db().auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/dashboard`,
  });
  if (error) throw new Error(error.message);
}

export async function updateOwnName(id: string, fullName: string) {
  const { error } = await db().from("profiles").update({ full_name: fullName.trim() }).eq("id", id);
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ roles */

export async function listRoles(): Promise<RoleDef[]> {
  const { data, error } = await db()
    .from("roles")
    .select("key, label, description, permissions, rank, locked")
    .order("rank", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as RoleDef[];
}

export async function saveRolePermissions(key: string, permissions: Partial<Record<Permission, boolean>>) {
  const { data, error } = await db().from("roles").update({ permissions }).eq("key", key).select("key");
  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error("Only a Super Admin can change role permissions.");
}

/* ------------------------------------------------------------ submissions */

export type SubmissionStatus = "pending" | "approved" | "rejected" | "withdrawn";

export interface Submission {
  id: string;
  section_id: SectionKey;
  data: SiteContent[SectionKey];
  note: string;
  status: SubmissionStatus;
  submitted_by: string | null;
  submitted_by_email: string;
  reviewed_by_email: string | null;
  review_note: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export async function listSubmissions(opts: {
  status?: SubmissionStatus[];
  mine?: string;
  limit?: number;
}): Promise<Submission[]> {
  let q = db()
    .from("content_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 100);
  if (opts.status) q = q.in("status", opts.status);
  if (opts.mine) q = q.eq("submitted_by", opts.mine);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as Submission[];
}

export async function countPendingSubmissions(): Promise<number> {
  const { count, error } = await db()
    .from("content_submissions")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function submitSections(rows: { section_id: SectionKey; data: unknown; note: string }[]) {
  // submitted_by defaults to the signed-in user in the database.
  const { error } = await db().from("content_submissions").insert(rows);
  if (error) throw new Error(error.message);
}

export async function approveSubmission(id: string, note?: string) {
  const { error } = await db().rpc("approve_submission", { submission_id: id, p_note: note ?? null });
  if (error) throw new Error(error.message);
}

export async function rejectSubmission(id: string, note: string) {
  const { error } = await db().rpc("reject_submission", { submission_id: id, p_note: note });
  if (error) throw new Error(error.message);
}

export async function withdrawSubmission(id: string) {
  const { data, error } = await db()
    .from("content_submissions")
    .update({ status: "withdrawn" })
    .eq("id", id)
    .select("id");
  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error("This submission can no longer be withdrawn.");
}

/* --------------------------------------------------------------- activity */

export interface ActivityEntry {
  id: number;
  actor_email: string;
  action: string;
  target: string;
  details: Record<string, unknown>;
  created_at: string;
}

export async function listActivity(opts: { before?: number; limit?: number; prefix?: string }) {
  let q = db()
    .from("activity_log")
    .select("id, actor_email, action, target, details, created_at")
    .order("id", { ascending: false })
    .limit(opts.limit ?? 50);
  if (opts.before) q = q.lt("id", opts.before);
  if (opts.prefix) q = q.like("action", `${opts.prefix}.%`);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as ActivityEntry[];
}
