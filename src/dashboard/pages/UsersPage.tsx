import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Ban,
  Check,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users as UsersIcon,
} from "lucide-react";
import { useAccess } from "../AuthProvider";
import {
  createUser,
  deleteUser,
  listRoles,
  listUsers,
  sendResetEmail,
  updateUser,
  UserServiceMissingError,
  type ManagedUser,
  type UserChanges,
} from "../adminApi";
import {
  areasToSections,
  describePermissions,
  roleStyle,
  sectionsToAreas,
  type RoleDef,
} from "../permissions";
import { WORK_AREAS } from "../sections";
import { formatDateTime, timeAgo } from "../format";
import Modal from "../components/Modal";
import { Avatar, FormRow, PasswordField, RoleBadge, StatusBadge, textInputCls } from "../components/people";
import { Notice } from "../components/ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* -------------------------------------------------------------- row menu */

const RowMenu: React.FC<{ items: { label: string; icon: React.ElementType; onClick: () => void; danger?: boolean; disabled?: boolean }[] }> = ({
  items,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="More actions"
        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100"
      >
        <MoreHorizontal size={17} />
      </button>
      {open && (
        <div className="dash-fade-up absolute right-0 top-full mt-1 z-30 w-52 rounded-xl bg-white p-1.5 shadow-[var(--dash-shadow-lg)] ring-1 ring-slate-900/5">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-left text-[13px] font-medium disabled:opacity-35 disabled:cursor-not-allowed ${
                item.danger ? "text-rose-600 hover:bg-rose-50" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <item.icon size={15} /> {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------- user form */

interface FormState {
  full_name: string;
  email: string;
  password: string;
  role: string;
  allPages: boolean;
  areas: string[];
  active: boolean;
}

const UserFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  user: ManagedUser | null;
  roles: RoleDef[];
  onSaved: () => void;
  onServiceMissing: () => void;
}> = ({ open, onClose, user, roles, onSaved, onServiceMissing }) => {
  const access = useAccess();
  const isNew = !user;
  const isSelf = user?.id === access.profile.id;
  const targetIsSuper = user?.role === "super_admin";
  const lockedTarget = targetIsSuper && !access.isSuperAdmin;

  const [form, setForm] = useState<FormState>(() => initialForm(user));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(initialForm(user));
      setError(null);
    }
  }, [open, user]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const assignableRoles = roles.filter((r) => r.key !== "super_admin" || access.isSuperAdmin);
  const selectedRole = roles.find((r) => r.key === form.role);
  const roleEdits = selectedRole?.key !== "super_admin" && Boolean(selectedRole?.permissions["content.edit"]);
  const roleSettings = Boolean(selectedRole?.permissions["settings.manage"]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const email = form.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return setError("Enter a valid email address.");
    if (isNew && form.password.length < 8) return setError("Choose a password of at least 8 characters.");
    if (!isNew && form.password && form.password.length < 8) {
      return setError("New passwords must be at least 8 characters.");
    }
    if (roleEdits && !form.allPages && form.areas.length === 0) {
      return setError("Choose at least one page, or allow all pages.");
    }

    const sections = roleEdits && !form.allPages ? areasToSections(form.areas) : null;
    setBusy(true);
    try {
      if (isNew) {
        await createUser({ email, password: form.password, full_name: form.full_name.trim(), role: form.role, sections });
        toast.success("User created", { description: `${email} can now sign in.` });
      } else {
        const changes: UserChanges = { full_name: form.full_name.trim() };
        if (!isSelf && !lockedTarget) {
          changes.role = form.role;
          changes.active = form.active;
        }
        if (!lockedTarget) changes.sections = sections;
        if (email !== user.email.toLowerCase()) changes.email = email;
        if (form.password) changes.password = form.password;
        await updateUser(user.id, changes);
        toast.success("Changes saved", { description: user.email });
      }
      onSaved();
      onClose();
    } catch (err) {
      if (err instanceof UserServiceMissingError) onServiceMissing();
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      locked={busy}
      side="right"
      title={isNew ? "Add a user" : "Edit user"}
      description={
        isNew
          ? "They can sign in straight away with the email and password you set here."
          : user?.email
      }
      icon={
        user ? (
          <Avatar name={user.full_name} email={user.email} role={user.role} size={40} />
        ) : (
          <span className="w-10 h-10 rounded-xl bg-amber-50 ring-1 ring-amber-200 flex items-center justify-center">
            <UserPlus size={19} className="text-amber-700" />
          </span>
        )
      }
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-4 py-2.5 text-[13.5px] font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="user-form"
            disabled={busy}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-white bg-[var(--dash-brand)] hover:bg-[var(--dash-brand-2)] shadow-sm disabled:opacity-50"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            {isNew ? "Create user" : "Save changes"}
          </button>
        </>
      }
    >
      <form id="user-form" onSubmit={submit} className="space-y-6" noValidate>
        {lockedTarget && (
          <Notice tone="warn">Only a Super Admin can change another Super Admin's role, access or login.</Notice>
        )}

        <section className="space-y-4">
          <FormRow label="Full name">
            <input
              className={textInputCls}
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              placeholder="e.g. Sita Sharma"
              autoFocus={isNew}
            />
          </FormRow>
          <FormRow label="Email address" hint={!isNew ? "Changing this changes the address they sign in with." : undefined}>
            <div className="relative flex items-center">
              <Mail size={16} className="pointer-events-none absolute left-3.5 text-slate-400" />
              <input
                type="email"
                className={`${textInputCls} pl-10`}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="name@company.com"
                disabled={lockedTarget}
                autoComplete="off"
              />
            </div>
          </FormRow>
          <FormRow
            label={isNew ? "Password" : "Set a new password"}
            hint={
              isNew
                ? "Share it with them securely. They can change it later under My account."
                : "Leave empty to keep their current password."
            }
          >
            {lockedTarget ? (
              <p className="text-[13px] text-slate-400">Not available for this account.</p>
            ) : (
              <PasswordField
                value={form.password}
                onChange={(v) => set("password", v)}
                placeholder={isNew ? "At least 8 characters" : "Unchanged"}
              />
            )}
          </FormRow>
        </section>

        <section>
          <h3 className="text-[13px] font-semibold text-slate-700 mb-2">Role</h3>
          {isSelf ? (
            <p className="text-[13px] text-slate-500 rounded-xl bg-slate-50 px-3.5 py-3">
              You can't change your own role. Ask another Super Admin if it needs to change.
            </p>
          ) : (
            <div className="grid gap-2" role="radiogroup">
              {assignableRoles.map((role) => {
                const checked = form.role === role.key;
                return (
                  <button
                    key={role.key}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    disabled={lockedTarget}
                    onClick={() => set("role", role.key)}
                    className={`text-left flex items-start gap-3 p-3.5 rounded-xl ring-1 transition disabled:opacity-50 ${
                      checked
                        ? "ring-2 ring-[var(--dash-gold)] bg-amber-50/40"
                        : "ring-slate-200 hover:ring-slate-300 bg-white"
                    }`}
                  >
                    <span
                      className={`mt-0.5 w-4 h-4 shrink-0 rounded-full ring-1 flex items-center justify-center ${
                        checked ? "ring-[var(--dash-gold)] bg-[var(--dash-gold)]" : "ring-slate-300"
                      }`}
                    >
                      {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${roleStyle(role.key).dot}`} />
                        <span className="text-[13.5px] font-semibold text-slate-900">{role.label}</span>
                      </span>
                      <span className="block text-[12.5px] text-slate-500 mt-0.5 leading-relaxed">
                        {role.description}
                      </span>
                      <span className="mt-1.5 flex flex-wrap gap-1">
                        {describePermissions(role.permissions, role.key === "super_admin").map((p) => (
                          <span key={p} className="text-[11px] font-medium text-slate-500 bg-slate-100 rounded-md px-1.5 py-0.5">
                            {p}
                          </span>
                        ))}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {roleEdits && (
          <section>
            <h3 className="text-[13px] font-semibold text-slate-700 mb-1">Page access</h3>
            <p className="text-[12.5px] text-slate-500 mb-3">Which parts of the website this person can work on.</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { value: true, label: "All pages", text: "Including pages added later" },
                { value: false, label: "Selected pages", text: "Only the ones you tick" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  disabled={lockedTarget}
                  onClick={() => set("allPages", opt.value)}
                  className={`text-left p-3 rounded-xl ring-1 transition ${
                    form.allPages === opt.value
                      ? "ring-2 ring-[var(--dash-gold)] bg-amber-50/40"
                      : "ring-slate-200 hover:ring-slate-300"
                  }`}
                >
                  <span className="block text-[13px] font-semibold text-slate-900">{opt.label}</span>
                  <span className="block text-[11.5px] text-slate-500">{opt.text}</span>
                </button>
              ))}
            </div>
            {!form.allPages && (
              <div className="grid sm:grid-cols-2 gap-1.5 rounded-xl bg-slate-50 p-2">
                {WORK_AREAS.filter((a) => a.id !== "settings" || roleSettings).map((area) => {
                  const on = form.areas.includes(area.id);
                  return (
                    <label
                      key={area.id}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[13px] font-medium transition ${
                        on ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-white/60"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        disabled={lockedTarget}
                        onChange={() =>
                          set("areas", on ? form.areas.filter((x) => x !== area.id) : [...form.areas, area.id])
                        }
                        className="w-4 h-4 accent-[#cb9733]"
                      />
                      {area.label}
                    </label>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {!isNew && !isSelf && (
          <section className="flex items-center justify-between gap-4 rounded-xl ring-1 ring-slate-200 p-3.5">
            <div>
              <p className="text-[13.5px] font-semibold text-slate-900">Account active</p>
              <p className="text-[12.5px] text-slate-500">Disabled users can't sign in or change anything.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.active}
              disabled={lockedTarget}
              onClick={() => set("active", !form.active)}
              className="relative w-11 h-6 shrink-0 disabled:opacity-40"
              style={{ borderRadius: 9999, background: form.active ? "var(--dash-gold)" : "#cbd1db" }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white shadow transition-transform"
                style={{ borderRadius: 9999, transform: form.active ? "translateX(20px)" : "none" }}
              />
            </button>
          </section>
        )}

        {error && (
          <div role="alert" className="flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-[13px] bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" /> {error}
          </div>
        )}
      </form>
    </Modal>
  );
};

function initialForm(user: ManagedUser | null): FormState {
  const areas = sectionsToAreas(user?.sections ?? null);
  return {
    full_name: user?.full_name ?? "",
    email: user?.email ?? "",
    password: "",
    role: user?.role ?? "content_creator",
    allPages: areas === null,
    areas: areas ?? [],
    active: user?.active ?? true,
  };
}

/* ----------------------------------------------------------- delete user */

const DeleteUserModal: React.FC<{
  user: ManagedUser | null;
  onClose: () => void;
  onDeleted: () => void;
  onServiceMissing: () => void;
}> = ({ user, onClose, onDeleted, onServiceMissing }) => {
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setConfirm("");
    setError(null);
  }, [user]);

  const matches = user && confirm.trim().toLowerCase() === user.email.toLowerCase();

  const run = async () => {
    if (!user || !matches) return;
    setBusy(true);
    setError(null);
    try {
      await deleteUser(user.id);
      toast.success("User deleted", { description: user.email });
      onDeleted();
      onClose();
    } catch (err) {
      if (err instanceof UserServiceMissingError) onServiceMissing();
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={!!user}
      onClose={onClose}
      locked={busy}
      width="sm"
      title="Delete this user?"
      description="Their login is removed permanently. Content they published stays on the site, and their history stays in the activity log."
      icon={
        <span className="w-10 h-10 rounded-xl bg-rose-50 ring-1 ring-rose-200 flex items-center justify-center">
          <Trash2 size={18} className="text-rose-600" />
        </span>
      }
      footer={
        <>
          <button type="button" onClick={onClose} disabled={busy} className="px-4 py-2.5 text-[13.5px] font-semibold text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void run()}
            disabled={!matches || busy}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />} Delete user
          </button>
        </>
      }
    >
      {user && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <Avatar name={user.full_name} email={user.email} role={user.role} />
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold text-slate-900 truncate">{user.full_name || user.email}</p>
              <p className="text-[12.5px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <FormRow label={`Type ${user.email} to confirm`}>
            <input
              className={textInputCls}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={user.email}
              autoComplete="off"
            />
          </FormRow>
          {error && <p className="text-[13px] text-rose-600">{error}</p>}
        </div>
      )}
    </Modal>
  );
};

/* ------------------------------------------------------------------ page */

const UsersPage: React.FC = () => {
  const access = useAccess();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [roles, setRoles] = useState<RoleDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<ManagedUser | null>(null);
  const [serviceMissing, setServiceMissing] = useState(false);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const [u, r] = await Promise.all([listUsers(), listRoles()]);
      setUsers(u);
      setRoles(r);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const roleLabel = (key: string) => roles.find((r) => r.key === key)?.label ?? key;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (!roleFilter || u.role === roleFilter) &&
        (!q || u.email.toLowerCase().includes(q) || u.full_name.toLowerCase().includes(q))
    );
  }, [users, query, roleFilter]);

  const counts = useMemo(() => {
    const byRole: Record<string, number> = {};
    for (const u of users) byRole[u.role] = (byRole[u.role] ?? 0) + 1;
    return { total: users.length, active: users.filter((u) => u.active).length, byRole };
  }, [users]);

  const toggleActive = async (u: ManagedUser) => {
    try {
      await updateUser(u.id, { active: !u.active });
      toast.success(u.active ? "User disabled" : "User enabled", { description: u.email });
      void load();
    } catch (err) {
      toast.error("Couldn't update user", { description: err instanceof Error ? err.message : String(err) });
    }
  };

  const sendReset = async (u: ManagedUser) => {
    try {
      await sendResetEmail(u.email);
      toast.success("Reset email sent", { description: `${u.email} will get a link to choose a new password.` });
    } catch (err) {
      toast.error("Couldn't send email", { description: err instanceof Error ? err.message : String(err) });
    }
  };

  const accessLabel = (u: ManagedUser) => {
    const role = roles.find((r) => r.key === u.role);
    if (u.role === "super_admin") return "Everything";
    if (!role?.permissions["content.edit"]) return "View only";
    const areas = sectionsToAreas(u.sections);
    return areas === null ? "All pages" : `${areas.length} page${areas.length === 1 ? "" : "s"}`;
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Users</h2>
          <p className="text-[13.5px] text-slate-500 mt-1">
            Who can sign in to the dashboard, and what each person is allowed to do.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
            title="Refresh"
            className="p-2.5 text-slate-500 hover:text-slate-900 bg-white ring-1 ring-slate-200 hover:ring-slate-300"
          >
            <RefreshCw size={16} />
          </button>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-white bg-[var(--dash-brand)] hover:bg-[var(--dash-brand-2)] shadow-sm"
          >
            <UserPlus size={16} /> Add user
          </button>
        </div>
      </div>

      {serviceMissing && (
        <Notice tone="warn">
          <strong>User management service not deployed.</strong> You can still change roles, page access and
          enable or disable users. Creating and deleting logins, and changing emails or passwords, need the{" "}
          <code className="bg-black/5 px-1 rounded">admin-users</code> Edge Function — see DASHBOARD.md.
        </Notice>
      )}

      {/* Summary + role filters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="dash-card p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <UsersIcon size={15} />
            <span className="text-[12px] font-semibold uppercase tracking-wide">Total</span>
          </div>
          <p className="text-[26px] font-bold text-slate-900 mt-1">{counts.total}</p>
        </div>
        <div className="dash-card p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 size={15} />
            <span className="text-[12px] font-semibold uppercase tracking-wide">Active</span>
          </div>
          <p className="text-[26px] font-bold text-slate-900 mt-1">{counts.active}</p>
        </div>
        <div className="dash-card p-4 col-span-2">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck size={15} />
            <span className="text-[12px] font-semibold uppercase tracking-wide">By role</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setRoleFilter(null)}
              className={`px-2.5 py-1 text-[12px] font-semibold ring-1 ${
                roleFilter === null ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-600 ring-slate-200 hover:ring-slate-300"
              }`}
            >
              All
            </button>
            {roles.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRoleFilter(roleFilter === r.key ? null : r.key)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-semibold ring-1 ${
                  roleFilter === r.key
                    ? "bg-slate-900 text-white ring-slate-900"
                    : "bg-white text-slate-600 ring-slate-200 hover:ring-slate-300"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${roleStyle(r.key).dot}`} />
                {r.label}
                <span className="opacity-60">{counts.byRole[r.key] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="dash-card overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email"
              className="w-full h-10 rounded-xl pl-9 pr-3 outline-none"
            />
          </div>
          <span className="ml-auto text-[12px] text-slate-400">
            {filtered.length} of {users.length}
          </span>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-slate-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-40 rounded bg-slate-100" />
                  <div className="h-2.5 w-56 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="p-6 text-center">
            <p className="text-[13.5px] font-semibold text-slate-800">Couldn't load users</p>
            <p className="text-[12.5px] text-slate-500 mt-1">{loadError}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[13.5px] font-semibold text-slate-800">No users match</p>
            <p className="text-[12.5px] text-slate-500 mt-1">Try a different search or role filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100">
                  <th className="px-4 py-2.5 font-semibold">User</th>
                  <th className="px-4 py-2.5 font-semibold">Role</th>
                  <th className="px-4 py-2.5 font-semibold hidden md:table-cell">Access</th>
                  <th className="px-4 py-2.5 font-semibold hidden sm:table-cell">Status</th>
                  <th className="px-4 py-2.5 font-semibold hidden lg:table-cell">Last sign-in</th>
                  <th className="px-2 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => {
                  const isSelf = u.id === access.profile.id;
                  const protectedSuper = u.role === "super_admin" && !access.isSuperAdmin;
                  return (
                    <tr key={u.id} className="group hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setEditing(u)} className="flex items-center gap-3 text-left min-w-0">
                          <Avatar name={u.full_name} email={u.email} role={u.role} muted={!u.active} />
                          <span className="min-w-0">
                            <span className="flex items-center gap-1.5">
                              <span className="text-[13.5px] font-semibold text-slate-900 truncate group-hover:text-[#a97a20]">
                                {u.full_name || u.email.split("@")[0]}
                              </span>
                              {isSelf && (
                                <span className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">
                                  You
                                </span>
                              )}
                            </span>
                            <span className="block text-[12.5px] text-slate-500 truncate">{u.email}</span>
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <RoleBadge role={u.role} label={roleLabel(u.role)} />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-[13px] text-slate-600">{accessLabel(u)}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <StatusBadge active={u.active} />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-[13px] text-slate-500" title={formatDateTime(u.last_sign_in_at)}>
                        {timeAgo(u.last_sign_in_at)}
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center justify-end gap-0.5">
                          <button
                            type="button"
                            onClick={() => setEditing(u)}
                            title="Edit"
                            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                          >
                            <Pencil size={15} />
                          </button>
                          <RowMenu
                            items={[
                              { label: "Edit details", icon: Pencil, onClick: () => setEditing(u) },
                              {
                                label: "Send password reset",
                                icon: KeyRound,
                                onClick: () => void sendReset(u),
                                disabled: protectedSuper,
                              },
                              {
                                label: u.active ? "Disable account" : "Enable account",
                                icon: Ban,
                                onClick: () => void toggleActive(u),
                                disabled: isSelf || protectedSuper,
                              },
                              {
                                label: "Delete user",
                                icon: Trash2,
                                danger: true,
                                onClick: () => setDeleting(u),
                                disabled: isSelf || protectedSuper,
                              },
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserFormModal
        open={creating || !!editing}
        user={editing}
        roles={roles}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSaved={() => void load()}
        onServiceMissing={() => setServiceMissing(true)}
      />
      <DeleteUserModal
        user={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={() => void load()}
        onServiceMissing={() => setServiceMissing(true)}
      />
    </div>
  );
};

export default UsersPage;
