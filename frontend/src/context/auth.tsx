import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "@/api/authApi";

export interface UserBrief {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface AuthContextValue {
  user: UserBrief | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, name?: string): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = "gs:token";
const USER_KEY = "gs:user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserBrief | null>(null);
  const [loading, setLoading] = useState(true);

  // При старте читаем токен и проверяем через /me
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await authApi.me(token);
        setUser({ id: me.id, email: me.email, name: me.name ?? undefined });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser({
      id: res.user.id,
      email: res.user.email,
      name: res.user.name ?? undefined,
    });
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      const res = await authApi.register(email, password, name);
      localStorage.setItem(TOKEN_KEY, res.token);
      setUser({
        id: res.user.id,
        email: res.user.email,
        name: res.user.name ?? undefined,
      });
    },
    []
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [user, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}