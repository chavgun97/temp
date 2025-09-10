import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { Icon } from '../../components/common/Icon';
import styles from './PersonalInfo.module.css';

/**
 * PersonalInfo Page Component
 * 
 * This component renders a personal information management page where users can:
 * - View and edit their profile information
 * - Upload profile pictures
 * - Update personal preferences
 * - Manage account settings
 * 
 * Features:
 * - Integrated with Supabase authentication
 * - Real user data from AuthContext
 * - Sidebar navigation with logout functionality
 * - Header with authenticated user info
 * - Form for personal information with validation
 * - Profile picture upload
 * - Desktop-first responsive design for admin panel
 * 
 * @component
 */

interface PersonalInfoData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bio: string;
  location: string;
  website: string;
  profilePicture?: File | null;
}

export const PersonalInfo: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, signOut, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState<PersonalInfoData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    bio: '',
    location: '',
    website: ''
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  /**
   * Initialize form data with user information from AuthContext
   */
  useEffect(() => {
    if (user) {
      // Parse full name into first and last name
      const nameParts = (user.fullName || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData({
        firstName,
        lastName,
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: '', // TODO: Add to user profile
        bio: '', // TODO: Add to user profile  
        location: '', // TODO: Add to user profile
        website: '' // TODO: Add to user profile
      });
    }
  }, [user]);

  /**
   * Handle form field changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle profile picture upload
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      profilePicture: file
    }));
  };

  /**
   * Handle form submission
   * Updates user profile information via AuthContext
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Prepare update data
      const updateData = {
        full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        phone: formData.phone.trim() || undefined,
        // TODO: Add other fields when user profile schema is extended
        // bio: formData.bio.trim() || null,
        // location: formData.location.trim() || null,
        // website: formData.website.trim() || null,
        // date_of_birth: formData.dateOfBirth || null
      };
      
      await updateProfile(updateData);
      
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.personalInfoPage}>
      <Header 
        user={{ 
          name: user?.fullName || user?.email || 'Administrator'
        }}
        unreadMessages={1}
        unreadNotifications={3}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className={styles.container}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onLogout={handleLogout}
          isLoading={logoutLoading}
          showBackButton={true}
        />
        
        <main className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Personal Information</h1>
            <p className={styles.pageDescription}>
              Update your personal details and preferences
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.personalInfoForm}>
            {/* Error Message */}
            {error && (
              <div className={styles.errorMessage}>
                <Icon name="error" size={20} color="#FF4444" />
                <span>{error}</span>
              </div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className={styles.successMessage}>
                <Icon name="check" size={20} color="#22C55E" />
                <span>{success}</span>
              </div>
            )}
            
            {/* Profile Picture Section */}
            <div className={styles.profilePictureSection}>
              <div className={styles.profilePictureContainer}>
                <div className={styles.profilePicture}>
                  {formData.profilePicture ? (
                    <img 
                      src={URL.createObjectURL(formData.profilePicture)} 
                      alt="Profile" 
                      className={styles.profileImage}
                    />
                  ) : (
                    <div className={styles.profilePlaceholder}>
                      <span>JD</span>
                    </div>
                  )}
                </div>
                <div className={styles.profilePictureActions}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    id="profilePicture"
                  />
                  <label htmlFor="profilePicture" className={styles.uploadButton}>
                    Change Photo
                  </label>
                </div>
              </div>
            </div>

            {/* Personal Information Form */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Basic Information</h2>
              
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="firstName" className={styles.label}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="lastName" className={styles.label}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="dateOfBirth" className={styles.label}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="location" className={styles.label}>
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="website" className={styles.label}>
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="https://your-website.com"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="bio" className={styles.label}>
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
