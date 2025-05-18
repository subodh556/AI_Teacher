import { supabase } from './supabase';

/**
 * Utility functions for authentication
 */

/**
 * Sign up a new user with email and password
 * @param email - The user's email
 * @param password - The user's password
 * @param name - The user's name
 * @returns The user data or null if error
 */
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });

  if (error) {
    console.error('Error signing up:', error);
    return null;
  }

  // Create user profile in the Users table
  if (data.user) {
    const { error: profileError } = await supabase
      .from('Users')
      .insert({
        id: data.user.id,
        email: data.user.email || '',
        name,
        created_at: new Date().toISOString(),
        preferences: {}
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
    }
  }

  return data;
}

/**
 * Sign in a user with email and password
 * @param email - The user's email
 * @param password - The user's password
 * @returns The session data or null if error
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('Error signing in:', error);
    return null;
  }

  // Update last login time
  if (data.user) {
    const { error: updateError } = await supabase
      .from('Users')
      .update({
        last_login: new Date().toISOString()
      })
      .eq('id', data.user.id);

    if (updateError) {
      console.error('Error updating last login:', updateError);
    }
  }

  return data;
}

/**
 * Sign out the current user
 * @returns True if successful, false otherwise
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    return false;
  }

  return true;
}

/**
 * Get the current user session
 * @returns The session data or null if not authenticated
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error);
    return null;
  }

  return data.session;
}

/**
 * Get the current user
 * @returns The user data or null if not authenticated
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user:', error);
    return null;
  }

  return data.user;
}

/**
 * Reset password for a user
 * @param email - The user's email
 * @returns True if successful, false otherwise
 */
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  });

  if (error) {
    console.error('Error resetting password:', error);
    return false;
  }

  return true;
}

/**
 * Update user password
 * @param password - The new password
 * @returns True if successful, false otherwise
 */
export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    console.error('Error updating password:', error);
    return false;
  }

  return true;
}

/**
 * Update user profile
 * @param profile - The profile data to update
 * @returns The updated user data or null if error
 */
export async function updateProfile(profile: {
  name?: string;
  preferences?: any;
}) {
  const user = await getUser();
  
  if (!user) {
    console.error('No user found');
    return null;
  }
  
  // Update auth metadata if name is provided
  if (profile.name) {
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        name: profile.name
      }
    });
    
    if (authError) {
      console.error('Error updating auth metadata:', authError);
    }
  }
  
  // Update profile in Users table
  const updates: any = {};
  if (profile.name) updates.name = profile.name;
  if (profile.preferences) updates.preferences = profile.preferences;
  
  const { data, error } = await supabase
    .from('Users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  
  return data;
}
