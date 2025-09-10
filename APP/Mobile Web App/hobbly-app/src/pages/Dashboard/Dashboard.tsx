/**
 * Dashboard Page
 * 
 * Main dashboard page for the Hobbly application.
 * Shows user activities and navigation with authentication integration.
 * Designed with desktop-first responsive approach for admin panel usage.
 * 
 * @module pages/Dashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import * as activitiesAPI from '../../api/activities.api';
import styles from './Dashboard.module.css';

/**
 * Dashboard statistics interface
 */
interface DashboardStats {
  totalActivities: number;
  pendingApprovals: number;
  activeUsers: number;
  monthlyRevenue: number;
}

/**
 * Dashboard Page Component
 * 
 * Main application dashboard with header, sidebar and content area.
 * Integrates with AuthContext for user management and logout functionality.
 * 
 * @component
 */
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalActivities: 0,
    pendingApprovals: 0,
    activeUsers: 0,
    monthlyRevenue: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  /**
   * Load dashboard statistics
   */
  const loadDashboardStats = async () => {
    if (!user?.id) return;
    
    setStatsLoading(true);
    setError('');
    
    try {
      const stats = await activitiesAPI.getUserActivityStats(user.id);
      
      setDashboardStats({
        totalActivities: stats.total_activities,
        pendingApprovals: stats.pending_activities,
        activeUsers: stats.total_participants,
        monthlyRevenue: Math.floor(Math.random() * 5000) + 1000 // Mock revenue data
      });
    } catch (err: any) {
      console.error('Error loading dashboard stats:', err);
      setError(err.message || 'Ошибка загрузки статистики');
    } finally {
      setStatsLoading(false);
    }
  };

  /**
   * Load data when user is available
   */
  useEffect(() => {
    if (user?.id) {
      loadDashboardStats();
    }
  }, [user?.id]);

  /**
   * Handle search functionality
   * 
   * @param query - Search query string
   */
  const handleSearch = (query: string) => {
    console.log('Dashboard search:', query);
    // TODO: Implement global search functionality
  };

  /**
   * Handle user logout
   * Signs out user and redirects to login page
   */
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle navigation to different sections
   */
  const handleNavigateToActivities = () => {
    navigate('/admin/activities');
  };

  const handleNavigateToPersonalInfo = () => {
    navigate('/admin/personal-info');
  };

  const handleCreateActivity = () => {
    navigate('/admin/activities/new');
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <Header
        user={{ 
          name: user?.fullName || user?.email || 'Administrator'
        }}
        unreadMessages={1}
        unreadNotifications={3}
        onSearch={handleSearch}
      />
      
      <div className={styles.mainContent}>
        <Sidebar
          showBackButton={true}
          onLogout={handleLogout}
          isLoading={isLoading}
        />
        
        <main className={styles.contentArea}>
          <div className={styles.content}>
            {/* Welcome Section */}
            <div className={styles.welcomeSection}>
              <h1 className={styles.pageTitle}>DASHBOARD</h1>
              <p className={styles.welcomeMessage}>
                Welcome back, {user?.fullName || 'Administrator'}! 👋
              </p>
              <p className={styles.organizationInfo}>
                {user?.organizationName && (
                  <span className={styles.organizationBadge}>
                    <Icon name="settings" size={16} />
                    {user.organizationName}
                  </span>
                )}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className={styles.errorMessage}>
                <Icon name="error" size={20} color="#FF4444" />
                <span>{error}</span>
                <button 
                  onClick={() => setError('')} 
                  className={styles.errorClose}
                >
                  <Icon name="close" size={16} color="#FF4444" />
                </button>
              </div>
            )}

            {/* Dashboard Statistics */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Icon name="activities" size={24} color="#667eea" />
                </div>
                <div className={styles.statContent}>
                  {statsLoading ? (
                    <div className={styles.statSkeleton} />
                  ) : (
                    <h3 className={styles.statNumber}>{dashboardStats.totalActivities}</h3>
                  )}
                  <p className={styles.statLabel}>Total Activities</p>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Icon name="clock" size={24} color="#f59e0b" />
                </div>
                <div className={styles.statContent}>
                  {statsLoading ? (
                    <div className={styles.statSkeleton} />
                  ) : (
                    <h3 className={styles.statNumber}>{dashboardStats.pendingApprovals}</h3>
                  )}
                  <p className={styles.statLabel}>Pending Approvals</p>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Icon name="user" size={24} color="#10b981" />
                </div>
                <div className={styles.statContent}>
                  {statsLoading ? (
                    <div className={styles.statSkeleton} />
                  ) : (
                    <h3 className={styles.statNumber}>{dashboardStats.activeUsers}</h3>
                  )}
                  <p className={styles.statLabel}>Total Participants</p>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Icon name="plus" size={24} color="#8b5cf6" />
                </div>
                <div className={styles.statContent}>
                  {statsLoading ? (
                    <div className={styles.statSkeleton} />
                  ) : (
                    <h3 className={styles.statNumber}>€{dashboardStats.monthlyRevenue}</h3>
                  )}
                  <p className={styles.statLabel}>Monthly Revenue</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActionsSection}>
              <h2 className={styles.sectionTitle}>Quick Actions</h2>
              <div className={styles.actionGrid}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleNavigateToActivities}
                  className={styles.actionButton}
                >
                  <Icon name="plus" size={20} />
                  Manage Activities
                </Button>
                
                <Button
                  variant="secondary"
                  size="large"
                  onClick={handleNavigateToPersonalInfo}
                  className={styles.actionButton}
                >
                  <Icon name="user" size={20} />
                  Update Profile
                </Button>
                
                <Button
                  variant="outline"
                  size="large"
                  onClick={() => console.log('Reports clicked')}
                  className={styles.actionButton}
                >
                  <Icon name="grid" size={20} />
                  View Reports
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.recentActivitySection}>
              <h2 className={styles.sectionTitle}>Recent Activity</h2>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <Icon name="check" size={16} color="#10b981" />
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>New activity "Yoga Workshop" approved</p>
                    <span className={styles.activityTime}>2 hours ago</span>
                  </div>
                </div>
                
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <Icon name="user" size={16} color="#667eea" />
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>3 new users registered</p>
                    <span className={styles.activityTime}>4 hours ago</span>
                  </div>
                </div>
                
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <Icon name="edit" size={16} color="#f59e0b" />
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>Activity "Music Concert" updated</p>
                    <span className={styles.activityTime}>1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
