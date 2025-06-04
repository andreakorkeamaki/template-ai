"use client";

import React, { createContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabaseClient";
import { signInWithEmail as supabaseSignInWithEmail, signOut as supabaseSignOut } from "../supabase/auth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any } | void>; // Allow returning error for UI handling
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async (email, password) => { return { error: 'Context not ready' }; },
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error initializing authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: authUser, session: authSession, error } = await supabaseSignInWithEmail(email, password);
      if (error) {
        console.error("Error signing in with email", error);
        setUser(null);
        setSession(null);
        setLoading(false);
        return { error }; // Return error for UI to handle
      }
      if (authUser && authSession) {
        setUser(authUser);
        setSession(authSession);
      }
    } catch (error) {
      console.error("Exception during sign in with email", error);
      setUser(null);
      setSession(null);
      return { error: error || new Error('An unexpected error occurred') }; // Return error for UI
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabaseSignOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
