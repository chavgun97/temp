/**
 * Welcome Page
 * 
 * Landing page for the Hobbly application with sign up and sign in options.
 * Features hero image and call-to-action buttons.
 * 
 * @module pages/Welcome
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css';
import { Button } from '../../components/common/Button';

/**
 * Welcome Page Component
 * 
 * Displays the welcome screen with Hobbly branding and navigation options.
 * Includes hero image and primary action buttons for user registration/login.
 * 
 * @component
 * @example
 * ```tsx
 * <Welcome />
 * ```
 */
export const Welcome: React.FC = () => {
  const navigate = useNavigate();

  /**
   * Handle sign up button click
   */
  const handleSignUp = () => {
    navigate('/signup');
  };

  /**
   * Handle sign in button click
   */
  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className={styles.welcomeContainer}>
      {/* Pattern Background */}
      <div className={styles.patternOverlay} />

      {/* Content */}
      <div className={styles.content}>
        {/* Left Section - Title, Brand, CTAs */}
        <div className={styles.leftSection}>
          <h1 className={styles.welcomeTitle}>Welcome to our web-page!</h1>

          {/* Brand */}
          <div className={styles.brandRow}>
            <div className={styles.brandIcon}>
              <div className={styles.brandKnot} />
            </div>
            <div className={styles.brandText}>
              <div className={styles.brandName}>Hobbly</div>
              <div className={styles.brandCompany}>Technologies Oy</div>
            </div>
          </div>

          {/* CTAs */}
          <div className={styles.ctaRow}>
            <div className={styles.ctaCard}>
              <div className={styles.actionLabel}>Not a user yet?</div>
              <Button
                variant="primary"
                size="large"
                onClick={handleSignUp}
                className={styles.actionButton}
              >
                Sign up
              </Button>
            </div>
            <div className={styles.ctaCard}>
              <div className={styles.actionLabel}>Already have an account?</div>
              <Button
                variant="primary"
                size="large"
                onClick={handleSignIn}
                className={styles.actionButton}
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>

        {/* Right Section - Hero Image */}
        <div className={styles.rightSection}>
          <div className={styles.imageCard}>
            <img
              className={styles.heroImg}
              src="https://images.unsplash.com/photo-1682687982141-0143020ed3e1?q=80&w=1200&auto=format&fit=crop"
              alt="Ocean scene with ship"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
