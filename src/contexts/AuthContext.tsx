import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase/client';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  mockLogin: (role: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  mockLogin: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /*
   * PRODUCT DESIGN NOTE: ROLE PERMANENCE
   * Currently, the user's role (requester or volunteer) is a permanent fork decided post-registration.
   * If dual-role support is introduced in the future (allowing a single user to act as both a requester and volunteer),
   * the following changes will be required:
   * 1. AuthContext & useRole: Allow multiple roles or a dynamic active role toggle (e.g., activeRole state).
   * 2. ProtectedRoute.tsx: Update route guarding logic to handle transition/toggling between dashboards.
   * 3. Navigation (BottomNav.tsx) & Settings/Profile UI: Add role-switching toggle controls.
   * 4. Supabase profiles schema / database: Support dual status flag or multi-role arrays.
   */
  const mockLogin = (role: string) => {
    if (import.meta.env.DEV) {
      localStorage.setItem('mock_role', role);
      const mockUser = { id: 'mock', email: 'mock@mock.com', user_metadata: { role } } as any;
      setUser(mockUser);
      setSession({ user: mockUser } as any);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        if (import.meta.env.DEV) {
          const mockRole = localStorage.getItem('mock_role');
          if (mockRole && mounted) {
            mockLogin(mockRole);
          }
        }
        if (mounted) setLoading(false);
        return;
      }
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          setSession(data.session);
          setUser(data.session?.user || null);
        }
      } catch (error) {
        console.error('Failed to get session', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    if (!import.meta.env.VITE_SUPABASE_URL) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (import.meta.env.VITE_SUPABASE_URL) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      if (import.meta.env.DEV) {
        localStorage.removeItem('mock_role');
      }
      setSession(null);
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, mockLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
