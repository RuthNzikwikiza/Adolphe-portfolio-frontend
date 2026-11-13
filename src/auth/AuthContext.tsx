import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import {
  ApiError,
  clearTokens,
  getMe,
  getTokens,
  login as apiLogin,
  register as apiRegister,
} from '../api';
import type { User } from '../api';

type AuthValue = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => getTokens() !== null);

  useEffect(() => {
    if (!getTokens()) return;
    getMe()
      .then(setUser)
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) clearTokens();
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username: string, password: string): Promise<void> {
    await apiLogin(username, password);
    setUser(await getMe());
  }

  async function register(
    username: string,
    email: string,
    password: string,
    name: string,
  ): Promise<void> {
    await apiRegister(username, email, password, name);
    await login(username, password);
  }

  function logout(): void {
    clearTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
