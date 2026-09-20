import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, Lock, RotateCcw, ShieldCheck } from "lucide-react";
import { listRoles, listUsers, saveRolePermissions } from "../adminApi";
import { PERMISSIONS, roleStyle, type Permission, type RoleDef } from "../permissions";
import { useAccess, useAuth } from "../AuthProvider";
import { Notice } from "../components/ui";

type Matrix = Record<string, Partial<Record<Permission, boolean>>>;

const GROUPS = Array.from(new Set(PERMISSIONS.map((p) => p.group)));

const Check3: React.FC<{
  on: boolean;
  locked: boolean;
  onToggle: () => void;
  label: string;
}> = ({ on, locked, onToggle, label }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={on}
    aria-label={label}
    disabled={locked}
    onClick={onToggle}
    className={`w-8 h-8 inline-flex items-center justify-center transition ${
      locked
        ? on
          ? "bg-amber-100 text-amber-700 cursor-not-allowed"
          : "bg-slate-50 text-slate-300 cursor-not-allowed"
        : on
          ? "bg-[var(--dash-brand)] text-white shadow-sm hover:bg-[var(--dash-brand-2)]"
          : "bg-white ring-1 ring-slate-200 text-transparent hover:ring-slate-400 hover:text-slate-300"
    }`}
  >
    {locked && on ? <Lock size={13} /> : <Check size={15} strokeWidth={3} />}
  </button>
);

const RolesPage: React.FC = () => {
  const access = useAccess();
  const { refreshAccess } = useAuth();
  const [roles, setRoles] = useState<RoleDef[]>([]);
  const [members, setMembers] = useState<Record<string, number>>({});
  const [draft, setDraft] = useState<Matrix>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [r, u] = await Promise.all([listRoles(), listUsers()]);
      setRoles(r);
      setDraft(Object.fromEntries(r.map((role) => [role.key, { ...role.permissions }])));
      const counts: Record<string, number> = {};
      for (const user of u) counts[user.role] = (counts[user.role] ?? 0) + 1;
      setMembers(counts);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const changed = useMemo(
    () =>
      roles.filter(
        (r) =>
          !r.locked &&
          PERMISSIONS.some((p) => Boolean(r.permissions[p.key]) !== Boolean(draft[r.key]?.[p.key]))
      ),
    [roles, draft]
  );

  const toggle = (roleKey: string, perm: Permission) =>
    setDraft((d) => ({ ...d, [roleKey]: { ...d[roleKey], [perm]: !d[roleKey]?.[perm] } }));

  const save = async () => {
    setSaving(true);
    try {
      for (const role of changed) {
        const clean = Object.fromEntries(
          PERMISSIONS.filter((p) => draft[role.key]?.[p.key]).map((p) => [p.key, true])
        );
        await saveRolePermissions(role.key, clean);
      }
      toast.success("Permissions updated", {
        description: `${changed.length} role${changed.length === 1 ? "" : "s"} changed. People see the new access next time they open the dashboard.`,
      });
      await load();
      await refreshAccess();
    } catch (e) {
      toast.error("Couldn't save permissions", { description: e instanceof Error ? e.message : String(e) });
    } finally {
      setSaving(false);
    }
  };

  const isOn = (role: RoleDef, perm: Permission) => role.key === "super_admin" || Boolean(draft[role.key]?.[perm]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Roles & permissions</h2>
          <p className="text-[13.5px] text-slate-500 mt-1 max-w-2xl">
            Decide what each role is allowed to do. Changes apply to everyone with that role. To limit a person
            to certain pages, edit them on the Users page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!changed.length || saving}
            onClick={() => setDraft(Object.fromEntries(roles.map((r) => [r.key, { ...r.permissions }])))}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-[13.5px] font-semibold text-slate-600 bg-white ring-1 ring-slate-200 hover:ring-slate-300 disabled:opacity-40"
          >
            <RotateCcw size={15} /> Undo
          </button>
          <button
            type="button"
            disabled={!changed.length || saving || !access.isSuperAdmin}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-white bg-[var(--dash-brand)] hover:bg-[var(--dash-brand-2)] shadow-sm disabled:opacity-40"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            Save{changed.length ? ` ${changed.length} change${changed.length === 1 ? "" : "s"}` : ""}
          </button>
        </div>
      </div>

      {error && <Notice tone="warn">{error}</Notice>}

      {/* Role cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-3 mb-6">
        {roles.map((role) => (
          <div key={role.key} className="dash-card p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${roleStyle(role.key).dot}`} />
                <span className="text-[14px] font-bold text-slate-900">{role.label}</span>
              </span>
              {role.locked && <Lock size={13} className="text-slate-300" />}
            </div>
            <p className="text-[12.5px] text-slate-500 mt-1.5 leading-relaxed">{role.description}</p>
            <p className="text-[12px] font-semibold text-slate-400 mt-3">
              {members[role.key] ?? 0} {members[role.key] === 1 ? "person" : "people"}
            </p>
          </div>
        ))}
      </div>

      {/* Matrix */}
      <div className="dash-card overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center text-slate-400">
            <Loader2 size={18} className="animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wide text-slate-400">
                    Permission
                  </th>
                  {roles.map((role) => (
                    <th key={role.key} className="px-3 py-3.5 text-center w-28">
                      <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-slate-800">
                        <span className={`w-2 h-2 rounded-full ${roleStyle(role.key).dot}`} />
                        {role.label}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GROUPS.map((group) => (
                  <React.Fragment key={group}>
                    <tr className="bg-slate-50/80">
                      <td colSpan={roles.length + 1} className="px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        {group}
                      </td>
                    </tr>
                    {PERMISSIONS.filter((p) => p.group === group).map((perm) => (
                      <tr key={perm.key} className="border-t border-slate-100 hover:bg-slate-50/50">
                        <td className="px-5 py-3.5">
                          <p className="text-[13.5px] font-semibold text-slate-900">{perm.label}</p>
                          <p className="text-[12.5px] text-slate-500 mt-0.5">{perm.description}</p>
                        </td>
                        {roles.map((role) => (
                          <td key={role.key} className="px-3 py-3.5 text-center">
                            <Check3
                              on={isOn(role, perm.key)}
                              locked={role.locked || !access.isSuperAdmin}
                              onToggle={() => toggle(role.key, perm.key)}
                              label={`${role.label}: ${perm.label}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[12.5px] text-slate-400">
        <ShieldCheck size={14} /> Super Admin always has every permission and can't be changed, so nobody can lock
        the dashboard.
      </p>
    </div>
  );
};

export default RolesPage;
