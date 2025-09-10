/**
 * Input Component
 * 
 * Reusable input field component for forms throughout the application.
 * Follows Hobbly design system with white backgrounds and subtle shadows.
 * 
 * @module components/common/Input
 */

import React, { forwardRef, InputHTMLAttributes } from 'react';
import styles from './Input.module.css';
import { Icon, IconName } from '../Icon';

/**
 * Props for the Input component
 * @interface InputProps
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text for the input */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display */
  helper?: string;
  /** Size variant of the input */
  size?: 'small' | 'medium' | 'large';
  /** Full width input */
  fullWidth?: boolean;
  /** Icon to display on the left */
  leftIcon?: IconName;
  /** Icon to display on the right */
  rightIcon?: IconName;
  /** Whether to show password visibility toggle */
  showPasswordToggle?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Input Component
 * 
 * A flexible input field component that supports various states,
 * icons, and validation feedback. Styled according to Hobbly design system.
 * 
 * @component
 * @example
 * ```tsx
 * <Input 
 *   label="Email Address"
 *   type="email"
 *   placeholder="Enter your email"
 *   leftIcon="mail"
 * />
 * 
 * <Input 
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 *   showPasswordToggle
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      size = 'medium',
      fullWidth = false,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      className = '',
      type = 'text',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    
    // Determine input type based on password visibility
    const inputType = type === 'password' && showPassword ? 'text' : type;
    
    // Determine right icon for password fields
    const passwordIcon = showPassword ? 'eye' : 'eyeOff';
    const finalRightIcon = type === 'password' && showPasswordToggle ? passwordIcon : rightIcon;
    
    // Build container classes
    const containerClasses = `
      ${styles.container}
      ${fullWidth ? styles.fullWidth : ''}
      ${className}
    `.trim();
    
    // Build input wrapper classes
    const wrapperClasses = `
      ${styles.inputWrapper}
      ${styles[size]}
      ${error ? styles.error : ''}
      ${disabled ? styles.disabled : ''}
      ${leftIcon ? styles.hasLeftIcon : ''}
      ${finalRightIcon ? styles.hasRightIcon : ''}
    `.trim();
    
    return (
      <div className={containerClasses}>
        {label && (
          <label className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        
        <div className={wrapperClasses}>
          {leftIcon && (
            <div className={styles.iconLeft}>
              <Icon name={leftIcon} size="small" color="var(--color-gray)" />
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={styles.input}
            disabled={disabled}
            {...props}
          />
          
          {finalRightIcon && (
            <div 
              className={styles.iconRight}
              onClick={type === 'password' && showPasswordToggle 
                ? () => setShowPassword(!showPassword)
                : undefined}
              style={{ cursor: type === 'password' && showPasswordToggle ? 'pointer' : 'default' }}
            >
              <Icon 
                name={finalRightIcon as IconName} 
                size="small" 
                color="var(--color-gray)" 
              />
            </div>
          )}
        </div>
        
        {(error || helper) && (
          <div className={`${styles.message} ${error ? styles.errorMessage : styles.helperMessage}`}>
            {error || helper}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
