/**
 * Header Component
 * 
 * Main navigation header for the Hobbly application.
 * Features logo, search bar, notifications, and user profile.
 * 
 * @module components/layout/Header
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { Icon } from '../../common/Icon';

/**
 * Props for the Header component
 * @interface HeaderProps
 */
export interface HeaderProps {
  /** Current user information */
  user?: {
    name: string;
    avatar?: string;
  };
  /** Number of unread messages */
  unreadMessages?: number;
  /** Number of unread notifications */
  unreadNotifications?: number;
  /** Search handler */
  onSearch?: (query: string) => void;
  /** Notification click handler */
  onNotificationClick?: () => void;
  /** Message click handler */
  onMessageClick?: () => void;
  /** Profile click handler */
  onProfileClick?: () => void;
  /** Menu toggle handler for mobile navigation */
  onMenuClick?: () => void;
}

/**
 * Header Component
 * 
 * Renders the main application header with navigation elements.
 * Styled according to Hobbly design system with dark teal background.
 * 
 * @component
 * @example
 * ```tsx
 * <Header 
 *   user={{ name: "Jack Sparrow" }}
 *   unreadMessages={1}
 *   unreadNotifications={3}
 *   onSearch={(query) => console.log(query)}
 * />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({
  user,
  unreadMessages = 0,
  unreadNotifications = 0,
  onSearch,
  onNotificationClick,
  onMessageClick,
  onProfileClick,
  onMenuClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  /**
   * Handle search form submission
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  /**
   * Handle logo click - navigate to home
   */
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className={styles.header}>
      {/* Pattern overlay */}
      <div className={styles.patternOverlay} />

      {/* Mobile Menu Button */}
      {onMenuClick && (
        <button className={styles.menuButton} onClick={onMenuClick}>
          <Icon name="menu" size={24} color="white" />
        </button>
      )}

      {/* Logo */}
      <div className={styles.logo} onClick={handleLogoClick}>
        <div className={styles.logoIcon}>a</div>
        <span className={styles.logoText}>Hobbly</span>
      </div>

      {/* Right section */}
      <div className={styles.headerRight}>
        {/* Icons */}
        <div className={styles.headerIcons}>
          {/* Messages */}
          <div className={styles.iconWrapper} onClick={onMessageClick}>
            <Icon name="mail" size={24} color="white" />
            {unreadMessages > 0 && (
              <span className={styles.badge}>{unreadMessages}</span>
            )}
          </div>

          {/* Notifications */}
          <div className={styles.iconWrapper} onClick={onNotificationClick}>
            <Icon name="notification" size={24} color="white" />
            {unreadNotifications > 0 && (
              <span className={styles.badge}>{unreadNotifications}</span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Search Bar */}
        <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
          <Icon name="search" size={20} color="#9B9B9B" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </form>

        {/* User Profile */}
        {user && (
          <div className={styles.userProfile} onClick={onProfileClick}>
            <div className={styles.userAvatar}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <Icon name="user" size={24} color="#073B3A" />
              )}
            </div>
            <div className={styles.userName}>
              {user.name.split(' ').map((part, index) => (
                <div key={index}>{part}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
