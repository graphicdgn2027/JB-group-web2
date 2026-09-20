import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { buildAccess, type Access, type AccessProfile } from "./permissions";

/**
 * - `ready`: signed in with an active profile
 * - `not-installed`: the roles schema hasn't been applied to the database
 * - `no-profile`: signed in, but no dashboard profile exists for this login
 * - `inactive`: the account has been disabled
 */
export type AccessStatus = "idle" | "loading" | "ready" | "not-installed" | "no-profile" | "inactive" | "error";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  access: Access | null;
  accessStatus: AccessStatus;
  accessError: string | null;
  refreshAccess: () => Promise<void>;
  /** True after arriving from a password-reset email, until a new password is set. */
  passwordRecovery: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [access, setAccess] = useState<Access | null>(null);
  const [accessStatus, setAccessStatus] = useState<AccessStatus>("idle");
  const [accessError, setAccessError] = useState<string | null>(null);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
      if (event === "SIGNED_OUT") setPasswordRecovery(false);
      setSession(next);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user.id ?? null;

  const loadAccess = useCallback(async (uid: string | null) => {
    if (!supabase || !uid) {
      setAccess(null);
      setAccessStatus("idle");
      setAccessError(null);
      return;
    }
    setAccessStatus((s) => (s === "ready" ? s : "loading"));
    const { data, error } = await supabase.rpc("my_access");

    if (error) {
      const missing = error.code === "PGRST202" || /could not find the function/i.test(error.message);
      setAccess(null);
      setAccessError(error.message);
      setAccessStatus(missing ? "not-installed" : "error");
      return;
    }
    const profile = data as AccessProfile | null;
    if (!profile) {
      setAccess(null);
      setAccessStatus("no-profile");
      return;
    }
    setAccessError(null);
    setAccess(buildAccess({ ...profile, sections: profile.sections ?? null, permissions: profile.permissions ?? {} }));
    setAccessStatus(profile.active ? "ready" : "inactive");
  }, []);

  // Not inside onAuthStateChange: calling Supabase from that callback can deadlock.
  useEffect(() => {
    void loadAccess(userId);
  }, [userId, loadAccess]);

  // Pick up role changes made by an administrator without needing a reload.
  useEffect(() => {
    if (!userId) return;
    const onFocus = () => void loadAccess(userId);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [userId, loadAccess]);

  const refreshAccess = useCallback(() => loadAccess(userId), [loadAccess, userId]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard`,
    });
    if (error) throw new Error(error.message);
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
    setPasswordRecovery(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading: loading || (!!userId && accessStatus === "loading") || (!!userId && accessStatus === "idle"),
      configured: isSupabaseConfigured,
      access,
      accessStatus,
      accessError,
      refreshAccess,
      passwordRecovery,
      signIn,
      signOut,
      sendPasswordReset,
      updatePassword,
    }),
    [
      session,
      loading,
      userId,
      access,
      accessStatus,
      accessError,
      refreshAccess,
      passwordRecovery,
      signIn,
      signOut,
      sendPasswordReset,
      updatePassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/** Access for the signed-in user; only valid inside the dashboard shell. */
export function useAccess(): Access {
  const { access } = useAuth();
  if (!access) throw new Error("useAccess used before access was loaded");
  return access;
}
