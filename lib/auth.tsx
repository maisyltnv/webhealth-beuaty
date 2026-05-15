"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ApiUser } from "@/lib/api-types";
import {
  apiLogin,
  apiMe,
  apiRegister,
  getStoredAccessToken,
  setStoredAccessToken,
} from "@/lib/api";

interface AuthContextValue {
  user: ApiUser | null;
  token: string | null;
  isReady: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    role?: string
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setToken(getStoredAccessToken());
    setIsReady(true);
  }, []);

  const refreshUser = useCallback(async () => {
    const t = getStoredAccessToken();
    if (!t) {
      setUser(null);
      return;
    }
    try {
      const me = await apiMe();
      setUser(me);
    } catch {
      setUser(null);
      setStoredAccessToken(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (token) void refreshUser();
    else setUser(null);
  }, [isReady, token, refreshUser]);

  const login = useCallback(async (username: string, password: string) => {
    const res = await apiLogin({ username, password });
    setStoredAccessToken(res.access_token);
    setToken(res.access_token);
    const me = await apiMe();
    setUser(me);
  }, []);

  const register = useCallback(
    async (username: string, password: string, role?: string) => {
      await apiRegister({ username, password, ...(role ? { role } : {}) });
      await login(username, password);
    },
    [login]
  );

  const logout = useCallback(() => {
    setStoredAccessToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isReady,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, token, isReady, login, register, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
