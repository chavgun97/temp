/**
 * @fileoverview API сервис для аутентификации пользователей
 * @module api/auth
 * @description Обеспечивает функции регистрации, входа, выхода и управления профилем
 * через Supabase Auth API
 */

import { createClient } from '@supabase/supabase-js';
import { User, SignInFormData, SignUpFormData, UserRole } from '../types';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * User profile from user_profiles table
 */
interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  organization_name?: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Transform user profile to local format
 */
const transformUserProfile = (profile: UserProfile): User => {
  return {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    organizationName: profile.organization_name,
    fullName: profile.full_name,
    phone: profile.phone,
    createdAt: new Date(profile.created_at),
    updatedAt: new Date(profile.updated_at)
  };
};

/**
 * Sign up a new user
 */
export const signUp = async (email: string, password: string, metadata?: {
  fullName?: string;
  organizationName?: string;
  phone?: string;
  role?: UserRole;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName: metadata?.fullName,
        organizationName: metadata?.organizationName,
        phone: metadata?.phone,
        role: metadata?.role || (metadata?.organizationName ? UserRole.ORGANIZER : UserRole.USER)
      }
    }
  });

  return { data, error };
};

/**
 * Sign in user
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  return { data, error };
};

/**
 * Sign out user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Get current session
 */
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Get user profile from user_profiles table
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

/**
 * Update user profile in user_profiles table
 */
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Update user password
 */
export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  return { error };
};

/**
 * Reset password request
 */
export const requestPasswordReset = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });

  return { error };
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

/**
 * Check if user session is valid
 */
export const isSessionValid = async (): Promise<boolean> => {
  try {
    const session = await getCurrentSession();
    return !!session?.user;
  } catch (error) {
    return false;
  }
};

/**
 * Refresh current session
 */
export const refreshSession = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  return { data, error };
};