/**
 * AuthContext - Context for managing authentication state
 * 
 * Provides authentication functionality using Supabase Auth
 * Manages user session, login, logout, and registration
 * 
 * @module contexts/AuthContext
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import * as authAPI from '../api/auth.api';
import { AuthContextType, SignInFormData, SignUpFormData, UserRole } from '../types';

/**
 * Authentication Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props for AuthProvider component
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication Provider Component
 * 
 * Wraps the application with authentication context
 * Handles user session management and authentication state
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Временный mock пользователь для тестирования
  const MOCK_USER: User = {
    id: 'user-1',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'organizer@example.com',
    email_confirmed_at: '2024-01-15T00:00:00Z',
    phone: '+358401234567',
    confirmed_at: '2024-01-15T00:00:00Z',
    last_sign_in_at: new Date().toISOString(),
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {
      fullName: 'Иван Петров',
      organizationName: 'Спортивный клуб Энергия',
      role: 'organizer'
    },
    identities: [],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: new Date().toISOString()
  };
  
  const MOCK_PROFILE = {
    id: 'user-1',
    email: 'organizer@example.com',
    role: 'organizer' as const,
    full_name: 'Иван Петров',
    organization_name: 'Спортивный клуб Энергия',
    phone: '+358401234567',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: new Date().toISOString()
  };

  /**
   * Initialize authentication state
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Временно используем mock пользователя для тестирования
        setTimeout(() => {
          setUser(MOCK_USER);
          setProfile(MOCK_PROFILE);
          setLoading(false);
        }, 1000);
        
        return; // Пропускаем реальную аутентификацию пока

        /* Real authentication code (commented out for now)
        // Get current session
        const session = await authAPI.getCurrentSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // Get user profile
          const userProfile = await authAPI.getUserProfile(session.user.id);
          setProfile(userProfile);
        }
        */
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = authAPI.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        
        // Get updated profile
        authAPI.getUserProfile(session.user.id)
          .then(setProfile)
          .catch(console.error);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, [MOCK_USER, MOCK_PROFILE]); // Added dependencies to fix React hooks warning

  /**
   * Sign in user
   */
  const signIn = async (data: SignInFormData): Promise<void> => {
    try {
      setLoading(true);
      const result = await authAPI.signIn(data.email, data.password);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // User and profile will be set by auth state change listener
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign up new user
   */
  const signUp = async (data: SignUpFormData): Promise<void> => {
    try {
      setLoading(true);
      
      const result = await authAPI.signUp(
        data.email, 
        data.password,
        {
          fullName: data.fullName,
          organizationName: data.organizationName,
          phone: data.phone,
          role: UserRole.ORGANIZER // Default role for new users
        }
      );
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // User will be set by auth state change listener after email confirmation
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out user
   */
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await authAPI.signOut();
      
      // User will be cleared by auth state change listener
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates: Partial<any>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    try {
      setLoading(true);
      const updatedProfile = await authAPI.updateUserProfile(user.id, updates);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change user password
   */
  const changePassword = async (newPassword: string): Promise<void> => {
    try {
      setLoading(true);
      await authAPI.updatePassword(newPassword);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get user role from profile
   */
  const getUserRole = (): UserRole => {
    return profile?.role || UserRole.USER;
  };

  /**
   * Check if user is admin
   */
  const isAdmin = (): boolean => {
    return getUserRole() === UserRole.ADMIN;
  };

  /**
   * Check if user is organizer
   */
  // const isOrganizer = (): boolean => {
  //   return getUserRole() === UserRole.ORGANIZER || isAdmin();
  // };

  // Context value
  const value: AuthContextType = {
    user: profile ? {
      id: user?.id || '',
      email: profile.email,
      role: profile.role,
      organizationName: profile.organization_name,
      fullName: profile.full_name,
      phone: profile.phone,
      createdAt: new Date(profile.created_at),
      updatedAt: new Date(profile.updated_at)
    } : null,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Hook to get user role utilities
 */
export const useUserRole = () => {
  const { user } = useAuth();
  
  return {
    role: user?.role || UserRole.USER,
    isAdmin: user?.role === UserRole.ADMIN,
    isOrganizer: user?.role === UserRole.ORGANIZER || user?.role === UserRole.ADMIN,
    isUser: user?.role === UserRole.USER
  };
};