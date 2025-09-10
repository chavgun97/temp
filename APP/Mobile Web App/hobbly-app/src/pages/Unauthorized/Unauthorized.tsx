/**
 * Unauthorized Page
 * 
 * Shown when user doesn't have required permissions
 * 
 * @module pages/Unauthorized
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import styles from './Unauthorized.module.css';

/**
 * Unauthorized Page Component
 * 
 * Displays error message for unauthorized access attempts
 * 
 * @component
 */
export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.unauthorizedContainer}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <Icon name="lock" size={64} color="#FF4444" />
        </div>
        
        <h1 className={styles.title}>Access Denied</h1>
        
        <p className={styles.message}>
          You don't have permission to access this page. 
          Please contact your administrator if you believe this is an error.
        </p>
        
        <div className={styles.actions}>
          <Button
            variant="primary"
            onClick={handleGoBack}
            className={styles.actionButton}
          >
            <Icon name="chevronLeft" size={20} />
            Go Back
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleGoHome}
            className={styles.actionButton}
          >
            <Icon name="home" size={20} />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};