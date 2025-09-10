/**
 * SignUp Page
 * 
 * User registration page for the Hobbly application.
 * Features comprehensive registration form with organization details.
 * 
 * @module pages/SignUp
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Icon } from '../../components/common/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { SignUpFormData as AuthSignUpFormData } from '../../types';

/**
 * Extended SignUp form data interface for UI
 * Extends the base SignUpFormData with additional fields for form validation
 */
interface ExtendedSignUpFormData extends AuthSignUpFormData {
  phoneNumber: string;  // UI uses phoneNumber instead of phone (phone is optional in base)
  address: string;
  organizationAddress: string;
  organizationNumber: string;
  profilePhoto?: File;
}

/**
 * SignUp Page Component
 * 
 * Displays the user registration form with Hobbly branding.
 * Includes form validation and user registration handling.
 * 
 * @component
 */
export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState<ExtendedSignUpFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    phone: '', // Base interface field
    agreeToTerms: false, // Required by base interface
    address: '',
    phoneNumber: '', // UI field that maps to phone
    organizationAddress: '',
    organizationNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ExtendedSignUpFormData, string>>>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  /**
   * Redirect authenticated users
   * If user is already logged in, redirect to dashboard
   */
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  /**
   * Handle input field changes
   * Updates form data and clears related error messages
   * 
   * @param field - The form field to update
   * @param value - The new value for the field
   */
  const handleInputChange = (field: keyof ExtendedSignUpFormData, value: string | boolean) => {
    setFormData(prev => {
      const updates: any = { [field]: value };
      
      // Sync phoneNumber with phone field
      if (field === 'phoneNumber' && typeof value === 'string') {
        updates.phone = value;
      }
      
      return {
        ...prev,
        ...updates
      };
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError('');
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  /**
   * Handle profile photo upload
   * Validates file type and size before setting in form data
   * 
   * @param e - File input change event
   */
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setGeneralError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setGeneralError('Image size must be less than 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        profilePhoto: file
      }));
      
      if (generalError) {
        setGeneralError('');
      }
    }
  };

  /**
   * Validate form data
   * Performs comprehensive validation of all form fields
   * 
   * @returns true if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExtendedSignUpFormData, string>> = {};

    // Required fields validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      // Enhanced password validation
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/\d/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Phone number validation (optional but must be valid if provided)
    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const phoneRegex = /^[+]?[1-9]\d{1,14}$/; // International format
      if (!phoneRegex.test(formData.phoneNumber.replace(/[\s\-()]/g, ''))) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
    }
    
    // Organization name validation (required if any org fields are filled)
    const hasOrgData = formData.organizationAddress || formData.organizationNumber;
    if (hasOrgData && (!formData.organizationName || !formData.organizationName.trim())) {
      newErrors.organizationName = 'Organization name is required when providing organization details';
    }
    
    // Terms of service validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * Validates form, creates user account via Supabase, and handles success/error states
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setGeneralError('Please correct the errors above');
      return;
    }

    setIsLoading(true);
    setGeneralError('');
    setSuccessMessage('');

    try {
      // Transform form data to match AuthContext expectations
      const signUpData: AuthSignUpFormData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phoneNumber.trim() || undefined,
        organizationName: formData.organizationName?.trim() || undefined,
        agreeToTerms: formData.agreeToTerms
      };
      
      // Create user account via AuthContext
      await signUp(signUpData);
      
      // Show success message
      setSuccessMessage('Registration successful! Please check your email to verify your account.');
      
      console.log('Registration successful for:', formData.email);
      
      // Clear form data on success
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        organizationName: '',
        phone: '',
        agreeToTerms: false,
        address: '',
        phoneNumber: '',
        organizationAddress: '',
        organizationNumber: ''
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', {
          state: { 
            message: 'Please check your email and verify your account before logging in.',
            email: signUpData.email 
          }
        });
      }, 3000);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Handle specific error messages from Supabase
      let errorMessage = 'An error occurred during registration';
      
      if (err.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists';
      } else if (err.message?.includes('Password should be at least')) {
        errorMessage = 'Password does not meet security requirements';
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address';
      } else if (err.message?.includes('signup_disabled')) {
        errorMessage = 'User registration is currently disabled';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setGeneralError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Google sign up
   * Initiates Google OAuth authentication flow via Supabase
   */
  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      setGeneralError('');
      
      // Import Supabase client for OAuth
      const { supabase } = await import('../../api/auth.api');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Google sign up error:', err);
      setGeneralError('Google sign up is not available at the moment');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Apple sign up
   * Initiates Apple Sign In authentication flow via Supabase
   */
  const handleAppleSignUp = async () => {
    try {
      setIsLoading(true);
      setGeneralError('');
      
      // Import Supabase client for OAuth
      const { supabase } = await import('../../api/auth.api');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Apple sign up error:', err);
      setGeneralError('Apple Sign In is not available at the moment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signUpContainer}>
      {/* Pattern Background */}
      <div className={styles.patternOverlay} />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>a</div>
          <span className={styles.logoText}>Hobbly</span>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <div className={styles.formContainer}>
          <h1 className={styles.pageTitle}>SIGN UP</h1>
          
          <form onSubmit={handleSubmit} className={styles.signUpForm}>
            {/* Error Message */}
            {generalError && (
              <div className={styles.errorMessage}>
                <Icon name="error" size={20} color="#FF4444" />
                <span>{generalError}</span>
              </div>
            )}
            
            {/* Success Message */}
            {successMessage && (
              <div className={styles.successMessage}>
                <Icon name="check" size={20} color="#22C55E" />
                <span>{successMessage}</span>
              </div>
            )}
            
            <div className={styles.formLayout}>
              {/* Left Column */}
              <div className={styles.leftColumn}>
                <Input
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  error={errors.fullName}
                  fullWidth
                  required
                />

                <Input
                  type="email"
                  placeholder="E-mail address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  fullWidth
                  required
                />

                <Input
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  fullWidth
                />

                <Input
                  placeholder="Phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  fullWidth
                />

                <Input
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                  showPasswordToggle
                  fullWidth
                  required
                />

                <Input
                  type="password"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                  showPasswordToggle
                  fullWidth
                  required
                />

                <div className={styles.passwordNote}>
                  The password must contain at least 8 characters,<br />
                  one number and special symbols.
                </div>
                
                {/* Terms of Service Checkbox */}
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>
                      I agree to the Terms of Service and Privacy Policy
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <div className={styles.fieldError}>{errors.agreeToTerms}</div>
                  )}
                </div>
              </div>

              {/* Middle Column */}
              <div className={styles.middleColumn}>
                <Input
                  placeholder="Organisation name"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  fullWidth
                />

                <Input
                  placeholder="Organisation address"
                  value={formData.organizationAddress}
                  onChange={(e) => handleInputChange('organizationAddress', e.target.value)}
                  fullWidth
                />

                <Input
                  placeholder="Organisation number"
                  value={formData.organizationNumber}
                  onChange={(e) => handleInputChange('organizationNumber', e.target.value)}
                  fullWidth
                />

                <div className={styles.buttonGroup}>
                  <Button
                    variant="dark"
                    size="large"
                    className={styles.saveButton}
                  >
                    Save info
                  </Button>

                  <Button
                    type="submit"
                    variant="secondary"
                    size="large"
                    loading={isLoading}
                    className={styles.signUpButton}
                  >
                    Sign up
                  </Button>
                </div>
              </div>

              {/* Right Column - Photo Upload */}
              <div className={styles.rightColumn}>
                <div className={styles.photoUpload}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className={styles.fileInput}
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className={styles.uploadLabel}>
                    {formData.profilePhoto ? (
                      <img 
                        src={URL.createObjectURL(formData.profilePhoto)} 
                        alt="Profile" 
                        className={styles.uploadedPhoto}
                      />
                    ) : (
                      <>
                        <div className={styles.uploadIcon}>
                          <Icon name="camera" size={24} color="#9B9B9B" />
                        </div>
                        <span className={styles.uploadText}>Add photo</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Social Login */}
            <div className={styles.socialSection}>
              <p className={styles.socialText}>Or log in with</p>
              <div className={styles.socialButtons}>
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className={styles.socialButton}
                >
                  <span className={styles.socialLetter}>G</span>
                </button>
                <button
                  type="button"
                  onClick={handleAppleSignUp}
                  className={styles.socialButton}
                >
                  <span className={styles.socialLetter}>🍎</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerLogo}>
          <div className={styles.footerLogoIcon}>a</div>
          <span className={styles.footerLogoText}>Hobbly Technologies Oy</span>
        </div>
      </div>
    </div>
  );
};
