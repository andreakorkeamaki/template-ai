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
  signInWithGoogle: () => Promise<{ error: any } | void>; // Added for Google Sign-In
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async (email, password) => { return { error: 'Context not ready' }; },
  signOut: async () => {},
  signInWithGoogle: async () => { return { error: 'Context not ready' }; }, // Added for Google Sign-In
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

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Optional: Add redirectTo if you need to redirect to a specific page after login
          // redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error('Error signing in with Google:', error);
        setLoading(false);
        return { error };
      }
      // Supabase handles the redirect and session update via onAuthStateChange
      // No explicit user/session setting here needed immediately after this call
    } catch (error) {
      console.error('Exception during Google sign in:', error);
      setLoading(false);
      return { error: error || new Error('An unexpected error occurred during Google sign-in') };
    }
    // setLoading(false) will be handled by onAuthStateChange or if an error occurs
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
