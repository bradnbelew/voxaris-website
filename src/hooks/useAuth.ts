import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Profile, UserRole, AppRole } from '@/types/database';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: AppRole[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    roles: [],
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const hydrateUser = async (session: Session) => {
      // Fetch profile and roles - use maybeSingle to avoid errors if no profile exists
      const [profileResult, rolesResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle(),
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id),
      ]);

      setState({
        user: session.user,
        session,
        profile: (profileResult.data as Profile | null) ?? null,
        roles: (rolesResult.data?.map((r: { role: AppRole }) => r.role) || []) as AppRole[],
        isLoading: false,
        isAuthenticated: true,
      });
    };

    // Set up auth state listener BEFORE getting session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await hydrateUser(session);
        } else {
          setState({
            user: null,
            session: null,
            profile: null,
            roles: [],
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        hydrateUser(session);
        return;
      }
      setState(prev => ({ ...prev, isLoading: false }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: displayName },
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const hasRole = (role: AppRole) => state.roles.includes(role);
  const isSuperAdmin = () => hasRole('super_admin');
  const isAdmin = () => hasRole('admin') || hasRole('super_admin');

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    hasRole,
    isSuperAdmin,
    isAdmin,
  };
}
