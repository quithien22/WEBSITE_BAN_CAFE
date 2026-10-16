'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'CUSTOMER' | 'STAFF';
  loyaltyPoints: number;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isReady: boolean; // đã kiểm tra xong token lúc mở trang
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const TOKEN_KEY = 'brewlite_token';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function saveToken(token: string, remember: boolean) {
  try {
    clearToken();
    (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  } catch {}
}

function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Mở trang: nếu có token thì hỏi backend xem còn hợp lệ không
  useEffect(() => {
    const saved = readToken();
    if (!saved) {
      setIsReady(true);
      return;
    }
    api<AuthUser>('/auth/me', { token: saved })
      .then((u) => {
        setUser(u);
        setToken(saved);
      })
      .catch(() => clearToken())
      .finally(() => setIsReady(true));
  }, []);

  const applySession = (res: AuthResponse, remember: boolean) => {
    saveToken(res.accessToken, remember);
    setToken(res.accessToken);
    setUser(res.user);
  };

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    const res = await api<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    applySession(res, remember);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const res = await api<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    applySession(res, true); // đăng ký xong tự đăng nhập
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isReady, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  return ctx;
}