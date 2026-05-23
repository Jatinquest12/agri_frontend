"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  fetchMe,
  logoutSession,
  requestOtp,
  verifyOtp as verifyOtpApi,
  type BackendUser,
} from "@/lib/auth-api";
import {
  clearTokens,
  getRefreshToken,
  setTokens,
} from "@/lib/token-storage";
import type { AuthUser, UserRole } from "@/types/platform";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  otpSent: boolean;
  pendingPhone: string;
  authError: string | null;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<AuthUser, "name" | "email" | "phone">>) => void;
  refreshUser: () => Promise<void>;
};

const STORAGE_KEY = "agritrust_user_v1";

const AuthContext = createContext<AuthContextValue | null>(null);

function mapBackendUser(u: BackendUser): AuthUser {
  return {
    id: u.id,
    name: u.name ?? `User ${u.phone.slice(-4)}`,
    phone: u.phone,
    role: u.role,
    verified: true,
  };
}

function loadStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  if (!user) window.localStorage.removeItem(STORAGE_KEY);
  else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const { user: backendUser } = await fetchMe();
      const next = mapBackendUser(backendUser);
      setUser(next);
      saveUser(next);
    } catch {
      clearTokens();
      setUser(null);
      saveUser(null);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const stored = loadStoredUser();
      if (stored) setUser(stored);
      if (getRefreshToken()) {
        await refreshUser();
      }
      setLoading(false);
    };
    void init();
  }, [refreshUser]);

  const sendOtp = useCallback(async (phone: string) => {
    setAuthError(null);
    const trimmed = phone.trim();
    if (!trimmed) {
      setAuthError("Enter a mobile number.");
      throw new Error("Enter a mobile number.");
    }
    await requestOtp(trimmed);
    setPendingPhone(trimmed);
    setOtpSent(true);
  }, []);

  const verifyOtp = useCallback(async (code: string) => {
    setAuthError(null);
    const trimmed = code.trim();
    if (trimmed.length < 4) {
      setAuthError("Enter a valid OTP.");
      return false;
    }
    try {
      const tokens = await verifyOtpApi(pendingPhone, trimmed);
      setTokens(tokens.access_token, tokens.refresh_token);
      const next = mapBackendUser(tokens.user);
      setUser(next);
      saveUser(next);
      setOtpSent(false);
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "OTP verification failed.";
      setAuthError(message);
      return false;
    }
  }, [pendingPhone]);

  const logout = useCallback(async () => {
    const refresh = getRefreshToken();
    if (refresh) {
      try {
        await logoutSession(refresh);
      } catch {
        /* ignore */
      }
    }
    clearTokens();
    setUser(null);
    saveUser(null);
    setOtpSent(false);
    setPendingPhone("");
    setAuthError(null);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<Pick<AuthUser, "name" | "email" | "phone">>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        saveUser(next);
        return next;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      otpSent,
      pendingPhone,
      authError,
      sendOtp,
      verifyOtp,
      logout,
      updateProfile,
      refreshUser,
    }),
    [
      user,
      loading,
      otpSent,
      pendingPhone,
      authError,
      sendOtp,
      verifyOtp,
      logout,
      updateProfile,
      refreshUser,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
