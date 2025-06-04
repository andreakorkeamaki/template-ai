import { supabase } from '../../../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
};

export type Pair = {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
};

export type Letter = {
  id: string;
  author_id: string;
  recipient_id: string;
  content: string;
  is_draft: boolean;
  is_shared: boolean;
  is_read: boolean;
  shared_at: string | null;
  read_at: string | null;
  reading_mode: 'timed' | 'manual' | 'weekly' | 'silent';
  unlock_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ReadingPreference = 'timed' | 'manual' | 'weekly' | 'silent';

/**
 * Profile Functions
 */

// Create or update a user's profile
export const upsertProfile = async (user: User, profile: Partial<Profile> = {}) => {
  const { data, error } = await supabase.from('profiles').upsert({
    id: user.id,
    username: profile.username || null,
    full_name: profile.full_name || user.user_metadata.full_name || null,
    avatar_url: profile.avatar_url || user.user_metadata.avatar_url || null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error upserting profile:', error);
    throw error;
  }

  return data;
};

// Get a user's profile
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error getting profile:', error);
    throw error;
  }

  return data as Profile;
};

/**
 * Pairing Functions
 */

// Create a pair between two users
export const createPair = async (user1Id: string, user2Id: string) => {
  // Check if pair already exists (in either direction)
  const { data: existingPair, error: checkError } = await supabase
    .from('pairs')
    .select('*')
    .or(`user1_id.eq.${user1Id},user1_id.eq.${user2Id}`)
    .or(`user2_id.eq.${user1Id},user2_id.eq.${user2Id}`)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking existing pair:', checkError);
    throw checkError;
  }

  if (existingPair) {
    return existingPair as Pair;
  }

  // Create new pair
  const { data, error } = await supabase
    .from('pairs')
    .insert([{ user1_id: user1Id, user2_id: user2Id }])
    .select()
    .single();

  if (error) {
    console.error('Error creating pair:', error);
    throw error;
  }

  return data as Pair;
};

// Get a user's paired partner
export const getPairedUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('pairs')
    .select('*, profiles(*)')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No paired user found
      return null;
    }
    console.error('Error getting paired user:', error);
    throw error;
  }

  // Determine which user is the partner
  const partnerId = data.user1_id === userId ? data.user2_id : data.user1_id;
  const partnerProfile = data.profiles.find((p: Profile) => p.id === partnerId);

  return partnerProfile as Profile;
};

/**
 * Letter Functions
 */

// Create or update a letter
export const upsertLetter = async (letter: Partial<Letter> & { author_id: string }) => {
  const { data, error } = await supabase
    .from('letters')
    .upsert({
      ...letter,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error upserting letter:', error);
    throw error;
  }

  return data as Letter;
};

// Get a user's draft letters
export const getDraftLetters = async (userId: string) => {
  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .eq('author_id', userId)
    .eq('is_draft', true)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error getting draft letters:', error);
    throw error;
  }

  return data as Letter[];
};

// Get a user's shared letters
export const getSharedLetters = async (userId: string) => {
  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .eq('author_id', userId)
    .eq('is_shared', true)
    .order('shared_at', { ascending: false });

  if (error) {
    console.error('Error getting shared letters:', error);
    throw error;
  }

  return data as Letter[];
};

// Get letters received by a user
export const getReceivedLetters = async (userId: string) => {
  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .eq('recipient_id', userId)
    .eq('is_shared', true)
    .order('shared_at', { ascending: false });

  if (error) {
    console.error('Error getting received letters:', error);
    throw error;
  }

  return data as Letter[];
};

// Share a letter with the recipient
export const shareLetter = async (letterId: string) => {
  const { data, error } = await supabase
    .from('letters')
    .update({ 
      is_shared: true, 
      is_draft: false,
      shared_at: new Date().toISOString()
    })
    .eq('id', letterId)
    .select()
    .single();

  if (error) {
    console.error('Error sharing letter:', error);
    throw error;
  }

  return data as Letter;
};

// Mark a letter as read
export const markLetterAsRead = async (letterId: string) => {
  const { data, error } = await supabase
    .from('letters')
    .update({ 
      is_read: true,
      read_at: new Date().toISOString()
    })
    .eq('id', letterId)
    .select()
    .single();

  if (error) {
    console.error('Error marking letter as read:', error);
    throw error;
  }

  return data as Letter;
};

// Delete a letter
export const deleteLetter = async (letterId: string) => {
  const { error } = await supabase
    .from('letters')
    .delete()
    .eq('id', letterId);

  if (error) {
    console.error('Error deleting letter:', error);
    throw error;
  }

  return true;
};

// Update user reading preferences (application-wide setting)
export const updateReadingPreference = async (userId: string, preference: ReadingPreference) => {
  // This would be stored in a user settings or preferences table
  // For now, we can add it to the profile
  const { data, error } = await supabase
    .from('profiles')
    .update({ reading_preference: preference })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating reading preference:', error);
    throw error;
  }

  return data;
};
