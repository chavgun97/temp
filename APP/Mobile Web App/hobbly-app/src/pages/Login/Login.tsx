/**
 * Login Page
 * 
 * Admin login page for the Hobbly application.
 * Features email/password authentication with "Remember me" option.
 * 
 * @module pages/Login
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Login.module.css';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Icon } from '../../components/common/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { SignInFormData } from '../../types';

/**
 * Extended login form data with remember me functionality
 */
interface ExtendedLoginFormData extends SignInFormData {
  rememberMe: boolean;
}

/**
 * Login Page Component
 * 
 * Displays the admin login form with Hobbly branding.
 * Includes form validation and authentication handling.
 * 
 * @component
 * @example
 * ```tsx
 * <Login />
 * ```
 */
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState<ExtendedLoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  /**
   * Redirect authenticated users
   * If user is already logged in, redirect to intended page or dashboard
   */
  useEffect(() => {
    if (user && !authLoading) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  /**
   * Handle input field changes
   * Updates form data and clears error messages
   * 
   * @param field - The form field to update
   * @param value - The new value for the field
   */
  const handleInputChange = (field: keyof ExtendedLoginFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  /**
   * Handle form submission
   * Validates input, authenticates user via Supabase, and redirects on success
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Sign in using AuthContext
      await signIn({
        email: formData.email,
        password: formData.password
      });
      
      // Store remember me preference in localStorage
      if (formData.rememberMe) {
        localStorage.setItem('hobbly_remember_me', 'true');
        localStorage.setItem('hobbly_email', formData.email);
      } else {
        localStorage.removeItem('hobbly_remember_me');
        localStorage.removeItem('hobbly_email');
      }
      
      // Navigation will be handled by useEffect when user state updates
      console.log('Login successful for:', formData.email);
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle specific error messages from Supabase
      let errorMessage = 'An error occurred during login';
      
      if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account';
      } else if (err.message?.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please try again later';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle registration link click
   * Redirects user to signup page
   */
  const handleRegistrationClick = () => {
    navigate('/signup');
  };

  /**
   * Handle forgot password click
   * Initiates password reset process via email
   */
  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Import auth API for password reset
      const { requestPasswordReset } = await import('../../api/auth.api');
      const { error: resetError } = await requestPasswordReset(formData.email);
      
      if (resetError) {
        throw resetError;
      }
      
      // Show success message
      setError('');
      alert('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load remembered email on component mount
   */
  useEffect(() => {
    const rememberMe = localStorage.getItem('hobbly_remember_me');
    const savedEmail = localStorage.getItem('hobbly_email');
    
    if (rememberMe === 'true' && savedEmail) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        rememberMe: true
      }));
    }
  }, []);

  return (
    <div className={styles.loginContainer}>
      {/* Pattern Background */}
      <div className={styles.patternOverlay} />

      {/* Content */}
      <div className={styles.content}>
        {/* Left Section - Branding */}
        <div className={styles.leftSection}>
          <div className={styles.header}>
            <h1 className={styles.welcomeTitle}>
              Welcome back, Administrator!
            </h1>
          </div>

          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}>a</div>
            <span className={styles.logoText}>Hobbly</span>
          </div>

          {/* Registration Link */}
          <div className={styles.registrationSection}>
            <p className={styles.registrationText}>Not currently an administrator?</p>
            <Button 
              variant="primary" 
              size="large"
              onClick={handleRegistrationClick}
              className={styles.registrationButton}
            >
              Registration
            </Button>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className={styles.rightSection}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Login to your admin panel</h2>
            
            <form onSubmit={handleSubmit} className={styles.loginForm}>
              {/* Email Field */}
              <div className={styles.fieldGroup}>
                <Input
                  type="email"
                  placeholder="E-mail address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  leftIcon="mail"
                  fullWidth
                  required
                />
              </div>

              {/* Password Field */}
              <div className={styles.fieldGroup}>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  leftIcon="lock"
                  showPasswordToggle
                  fullWidth
                  required
                />
              </div>

              {/* Remember Me Checkbox */}
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Remember me</span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className={styles.errorMessage}>
                  <Icon name="error" size={20} color="#FF4444" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                variant="dark"
                size="large"
                loading={isLoading}
                fullWidth
                className={styles.loginButton}
              >
                Login
              </Button>

              {/* Forgot Password Link */}
              <button
                type="button"
                onClick={handleForgotPassword}
                className={styles.forgotPasswordLink}
              >
                Forgot your password?
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
