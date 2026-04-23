import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_USER, DEMO_HOST, DEMO_PASSWORD } from '@/services/demoData';
import type { User, UserRole } from '@/types';

const USE_DEMO = true;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isHost: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (USE_DEMO) {
      const saved = localStorage.getItem('demo_user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
      setLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signIn = async (email: string, password: string) => {
    if (USE_DEMO) {
      const normalizedEmail = email.toLowerCase().trim();
      if (normalizedEmail === 'demo@rentpro.com' && password === DEMO_PASSWORD) {
        setUser(DEMO_USER);
        localStorage.setItem('demo_user', JSON.stringify(DEMO_USER));
        return { error: null };
      }
      if (normalizedEmail === 'host@rentpro.com' && password === DEMO_PASSWORD) {
        setUser(DEMO_HOST);
        localStorage.setItem('demo_user', JSON.stringify(DEMO_HOST));
        return { error: null };
      }
      // Allow any other login with demo credentials
      if (password === DEMO_PASSWORD) {
        const newUser: User = {
          id: 'demo-' + Date.now(),
          email: normalizedEmail,
          full_name: normalizedEmail.split('@')[0],
          role: 'guest',
          created_at: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem('demo_user', JSON.stringify(newUser));
        return { error: null };
      }
      return { error: new Error('Email o contrasena incorrectos') };
    }
    return { error: null };
  };

  const signUp = async (_email: string, _password: string, fullName: string, role: UserRole) => {
    if (USE_DEMO) {
      const newUser: User = {
        id: 'demo-' + Date.now(),
        email: _email.toLowerCase(),
        full_name: fullName,
        role,
        created_at: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem('demo_user', JSON.stringify(newUser));
      return { error: null };
    }
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    isHost: user?.role === 'host' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
