import { supabase } from '../../../lib/supabaseClient';
import { Provider } from '@supabase/supabase-js';

/**
 * Sign in with a third-party OAuth provider
 */
export const signInWithOAuth = async (provider: Provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) {
    console.error('OAuth sign in error:', error);
    throw error;
  }
  
  return data;
};

/**
 * Sign in with Google OAuth provider specifically
 */
export const signInWithGoogle = async () => {
  return signInWithOAuth('google');
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Email sign in error:', error);
    // It's often better to let the calling UI handle the error display
    // rather than throwing here, so it can show user-friendly messages.
    return { user: null, session: null, error }; 
  }
  
  return { user: data.user, session: data.session, error: null };
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Get the current authenticated session
 */
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Get session error:', error);
    throw error;
  }
  
  return data.session;
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Get user error:', error);
    throw error;
  }
  
  return data.user;
};
