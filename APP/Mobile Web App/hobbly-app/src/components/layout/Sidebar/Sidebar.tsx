/**
 * Sidebar Component
 * 
 * Navigation sidebar for the Hobbly application dashboard.
 * Contains menu items and utility options.
 * 
 * @module components/layout/Sidebar
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { Icon, IconName } from '../../common/Icon';

/**
 * Menu item configuration
 */
export interface MenuItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon name */
  icon: IconName;
  /** Route path */
  path: string;
  /** Whether item is in bottom section */
  isBottom?: boolean;
}

/**
 * Props for the Sidebar component
 * @interface SidebarProps
 */
export interface SidebarProps {
  /** Custom menu items */
  menuItems?: MenuItem[];
  /** Whether sidebar is collapsed */
  isCollapsed?: boolean;
  /** Whether sidebar is open (for mobile) */
  isOpen?: boolean;
  /** Toggle dark mode handler */
  onDarkModeToggle?: () => void;
  /** Logout handler */
  onLogout?: () => void;
  /** Back button handler */
  onBack?: () => void;
  /** Whether to show back button */
  showBackButton?: boolean;
  /** Whether logout is in progress */
  isLoading?: boolean;
}

/**
 * Default menu items
 */
const defaultMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
  { id: 'activities', label: 'Activities', icon: 'activities', path: '/admin/activities' },
  { id: 'users', label: 'Users', icon: 'user', path: '/admin/users' },
  { id: 'personal', label: 'Personal info', icon: 'user', path: '/admin/personal-info' },
];

const bottomMenuItems: MenuItem[] = [
  { id: 'trash', label: 'Trash bin', icon: 'trash', path: '/admin/trash', isBottom: true },
];

/**
 * Sidebar Component
 * 
 * Renders the navigation sidebar with menu items and utility options.
 * Styled according to Hobbly design system with dark teal background.
 * 
 * @component
 * @example
 * ```tsx
 * <Sidebar 
 *   showBackButton={true}
 *   onBack={() => navigate(-1)}
 *   onLogout={() => handleLogout()}
 * />
 * ```
 */
export const Sidebar: React.FC<SidebarProps> = ({
  menuItems = defaultMenuItems,
  isCollapsed = false,
  isOpen = false,
  onDarkModeToggle,
  onLogout,
  onBack,
  showBackButton = false,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Check if menu item is active
   */
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  /**
   * Handle menu item click
   */
  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  /**
   * Handle dark mode toggle
   */
  const handleDarkModeClick = () => {
    if (onDarkModeToggle) {
      onDarkModeToggle();
    }
  };

  /**
   * Handle logout click
   */
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isOpen ? styles.open : ''}`}>
      {/* Pattern overlay */}
      <div className={styles.patternOverlay} />

      {/* Main menu */}
      <nav className={styles.sidebarMenu}>
        {/* Top menu items */}
        <div className={styles.menuSection}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.menuItem} ${isActive(item.path) ? styles.active : ''}`}
              onClick={() => handleMenuClick(item.path)}
            >
              <Icon name={item.icon} size={24} color="white" />
              {!isCollapsed && <span className={styles.menuLabel}>{item.label}</span>}
            </div>
          ))}
        </div>

        {/* Bottom menu items */}
        <div className={styles.menuSection}>
          {/* Trash bin */}
          {bottomMenuItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.menuItem} ${isActive(item.path) ? styles.active : ''}`}
              onClick={() => handleMenuClick(item.path)}
            >
              <Icon name={item.icon} size={24} color="white" />
              {!isCollapsed && <span className={styles.menuLabel}>{item.label}</span>}
            </div>
          ))}

          {/* Dark mode toggle */}
          <div className={styles.menuItem} onClick={handleDarkModeClick}>
            <Icon name="moon" size={24} color="white" />
            {!isCollapsed && <span className={styles.menuLabel}>Dark mode</span>}
          </div>

          {/* Logout */}
          <div 
            className={`${styles.menuItem} ${isLoading ? styles.loading : ''}`} 
            onClick={isLoading ? undefined : handleLogoutClick}
          >
            {isLoading ? (
              <div className={styles.spinner} />
            ) : (
              <Icon name="logout" size={24} color="white" />
            )}
            {!isCollapsed && (
              <span className={styles.menuLabel}>
                {isLoading ? 'Logging out...' : 'Log out'}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Back button */}
      {showBackButton && !isCollapsed && (
        <div className={styles.sidebarBottom}>
          <button className={styles.backButton} onClick={onBack}>
            Back
          </button>
        </div>
      )}
    </aside>
  );
};
