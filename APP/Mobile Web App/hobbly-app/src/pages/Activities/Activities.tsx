/**
 * Activities Page
 * 
 * Activities management page for the Hobbly application.
 * Shows list of activities with filtering, sorting, and pagination.
 * Integrated with Supabase authentication and designed for admin panel usage.
 * 
 * @module pages/Activities
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { Button } from '../../components/common/Button';
import { Table, Pagination, TableColumn } from '../../components/common/Table';
import { Icon } from '../../components/common/Icon';
import { useAuth } from '../../contexts/AuthContext';
import * as activitiesAPI from '../../api/activities.api';
import { Activity, ActivityFilters, ActivityType } from '../../types';
import styles from './Activities.module.css';

/**
 * Activity status type
 */
type ActivityStatus = 'Approved' | 'Pending' | 'Rejected';

/**
 * Activity display interface для таблицы
 */
interface ActivityDisplay {
  id: string;
  category: string;
  type: string;
  date: string;
  address: string;
  price: string;
  status: ActivityStatus;
  icon?: string;
}

/**
 * Activities Page Component
 * 
 * Main activities management interface with table view,
 * filtering, sorting, and pagination capabilities.
 * Integrated with AuthContext for user management and logout functionality.
 * 
 * @component
 */
export const Activities: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  
  const [activities, setActivities] = useState<ActivityDisplay[]>([]);
  const [rawActivities, setRawActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ActivityFilters>({});

  /**
   * Преобразование Activity в ActivityDisplay для таблицы
   * 
   * @param activity - Реальные данные активности
   * @returns Данные для отображения в таблице
   */
  const transformActivityForDisplay = (activity: Activity): ActivityDisplay => {
    return {
      id: activity.id,
      category: activity.category?.name || 'Без категории',
      type: getActivityTypeDisplayName(activity.type),
      date: activity.startDate?.toLocaleDateString('ru-RU') || 'TBA',
      address: activity.location,
      price: (activity.price ?? 0) > 0 ? `${activity.price}€` : 'Бесплатно',
      status: activity.isDeleted ? 'Rejected' : 'Approved',
      icon: getActivityTypeIcon(activity.type)
    };
  };

  /**
   * Получить иконку для типа активности
   */
  const getActivityTypeIcon = (type: ActivityType): string => {
    const iconMap: Record<ActivityType, string> = {
      [ActivityType.CLUB]: '👥',
      [ActivityType.EVENT]: '🎉',
      [ActivityType.COMPETITION]: '🏆',
      [ActivityType.ACTIVITY]: '📅',
      [ActivityType.HOBBY_OPPORTUNITY]: '⭐'
    };
    return iconMap[type] || '📅';
  };

  /**
   * Получить отображаемое название типа активности
   */
  const getActivityTypeDisplayName = (type: ActivityType): string => {
    const nameMap: Record<ActivityType, string> = {
      [ActivityType.CLUB]: 'Клуб',
      [ActivityType.EVENT]: 'Мероприятие',
      [ActivityType.COMPETITION]: 'Соревнование',
      [ActivityType.ACTIVITY]: 'Активность',
      [ActivityType.HOBBY_OPPORTUNITY]: 'Возможность'
    };
    return nameMap[type] || 'Другое';
  };

  /**
   * Загрузить активности пользователя из Supabase
   */
  const loadActivities = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const searchFilters: ActivityFilters = {
        search: searchQuery || undefined,
        ...filters
      };
      
      const result = await activitiesAPI.getUserActivities(
        user.id,
        currentPage,
        5
      );
      
      setRawActivities(result.activities);
      setActivities(result.activities.map(transformActivityForDisplay));
      setTotalPages(result.pagination.totalPages);
    } catch (err: any) {
      console.error('Error loading activities:', err);
      setError(err.message || 'Ошибка загрузки активностей');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load activities data when component mounts or dependencies change
   */
  useEffect(() => {
    if (user?.id) {
      loadActivities();
    }
  }, [user?.id, currentPage, searchQuery, filters]);

  /**
   * Table column configuration
   */
  const columns: TableColumn<ActivityDisplay>[] = [
    {
      key: 'category',
      label: 'Category',
      render: (value, item) => (
        <div className={styles.categoryCell}>
          <div className={styles.categoryIcon}>
            {item.icon || '📂'}
          </div>
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type'
    },
    {
      key: 'date',
      label: 'Date'
    },
    {
      key: 'address',
      label: 'Address'
    },
    {
      key: 'price',
      label: 'Price'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`${styles.status} ${styles[`status${value}`]}`}>
          {value}
        </span>
      )
    }
  ];

  /**
   * Handle search functionality
   * 
   * @param query - Search query string
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  /**
   * Handle user logout
   * Signs out user and redirects to login page
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

  /**
   * Handle add activity
   * Opens form/modal for creating new activity
   */
  const handleAddActivity = () => {
    console.log('Add activity clicked');
    // TODO: Реализовать модальное окно или навигацию к форме создания активности
    alert('Функция создания активности будет реализована в следующих итерациях');
  };

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  /**
   * Handle row click - показать детали активности
   */
  const handleRowClick = (activity: ActivityDisplay) => {
    // Находим полную информацию об активности
    const fullActivity = rawActivities.find(a => a.id === activity.id);
    if (fullActivity) {
      console.log('Activity details:', fullActivity);
      // TODO: Открыть модальное окно с деталями или форму редактирования
      alert(`Активность: ${fullActivity.title}\nОписание: ${fullActivity.description}`);
    }
  };

  /**
   * Обработать удаление активности
   */
  const handleDeleteActivity = async (activityId: string) => {
    if (!user?.id) return;
    
    if (window.confirm('Вы уверены, что хотите удалить эту активность?')) {
      try {
        setIsLoading(true);
        await activitiesAPI.deleteActivity(activityId, user.id);
        await loadActivities(); // Reload activities after deletion
      } catch (err: any) {
        console.error('Error deleting activity:', err);
        setError(err.message || 'Ошибка удаления активности');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading activities...</p>
      </div>
    );
  }

  return (
    <div className={styles.activitiesContainer}>
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
          isLoading={logoutLoading}
        />
        
        <main className={styles.contentArea}>
          <div className={styles.content}>
            {/* Header */}
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>MY<br />ACTIVITIES</h1>
              <Button
                variant="secondary"
                size="large"
                onClick={handleAddActivity}
                className={styles.addButton}
              >
                Add activity
              </Button>
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

            {/* Activities Table */}
            <div className={styles.tableSection}>
              <Table<ActivityDisplay>
                data={activities}
                columns={columns}
                keyExtractor={(item) => item.id}
                loading={isLoading}
                emptyMessage="No activities found"
                onRowClick={handleRowClick}
                hoverable={true}
              />

              {/* Pagination */}
              {!isLoading && activities.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  showPageNumbers={true}
                  maxPageButtons={5}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
