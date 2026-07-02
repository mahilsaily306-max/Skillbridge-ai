'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { api } from './api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  googleAuth: (email: string, name: string, googleId: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, token: null, loading: true,
  login: async () => {}, register: async () => {},
  googleAuth: async () => {}, logout: () => {}, updateUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      api.auth.getProfile()
        .then(data => setUser(data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const saveAuth = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    const data = await api.auth.login({ email, password });
    saveAuth(data.token, data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const data = await api.auth.register({ email, password, name });
    saveAuth(data.token, data.user);
  };

  const googleAuth = async (email: string, name: string, googleId: string) => {
    const data = await api.auth.googleAuth({ email, name, googleId });
    saveAuth(data.token, data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleAuth, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
