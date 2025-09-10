/**
 * @fileoverview API сервис для управления активностями
 * @module api/activities
 * @description Обеспечивает полный CRUD функционал для активностей через Supabase REST API
 * Включает создание, чтение, обновление и удаление активностей с валидацией и обработкой ошибок
 */

import { apiClient, buildFilterQuery, buildPaginationConfig } from './config';
import { Activity, ActivityType, ActivityFormData, ActivityFilters, User, UserRole } from '../types';
import { mockActivities, mockUsers, mockStats, simulateApiDelay, mockCategories, mockTags } from './mockData';

// Временный флаг для переключения между mock данными и реальным API
const USE_MOCK_DATA = true;

/**
 * Интерфейс для сырых данных активности из Supabase
 */
interface RawActivityData {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  type: ActivityType;
  category_id: string;
  location: string;
  price: number;
  currency: string;
  date_time: string;
  duration: number;
  max_participants: number;
  current_participants: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  is_active: boolean;
  requires_equipment: boolean;
  age_restriction?: number;
  organizer_id: string;
  contact_email: string;
  contact_phone?: string;
  image_urls?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
  // Joined data
  categories?: {
    id: string;
    name: string;
  };
  user_profiles?: {
    id: string;
    full_name: string;
    email: string;
  };
}

/**
 * Преобразование сырых данных Supabase в интерфейс Activity
 * 
 * @param rawData - Сырые данные из Supabase
 * @returns Преобразованный объект Activity
 */
const transformRawActivity = (rawData: RawActivityData): Activity => {
  return {
    id: rawData.id,
    title: rawData.title,
    description: rawData.description,
    shortDescription: rawData.short_description,
    type: rawData.type,
    categoryId: rawData.category_id,
    category: rawData.categories ? {
      id: rawData.categories.id,
      name: rawData.categories.name
    } : undefined,
    location: rawData.location,
    price: rawData.price,
    currency: rawData.currency,
    startDate: new Date(rawData.date_time),
    maxParticipants: rawData.max_participants,
    isDeleted: false,
    userId: rawData.organizer_id,
    organizer: rawData.user_profiles ? {
      id: rawData.user_profiles.id,
      fullName: rawData.user_profiles.full_name,
      email: rawData.user_profiles.email,
      role: UserRole.ORGANIZER,
      createdAt: new Date(),
      updatedAt: new Date()
    } : undefined,
    contactEmail: rawData.contact_email,
    contactPhone: rawData.contact_phone,
    imageUrl: rawData.image_urls?.[0],
    tags: (rawData.tags || []).map(tagName => ({ 
      id: tagName, 
      name: tagName 
    })),
    createdAt: new Date(rawData.created_at),
    updatedAt: new Date(rawData.updated_at)
  };
};

/**
 * Преобразование данных формы в формат Supabase
 * 
 * @param formData - Данные формы активности
 * @param organizerId - ID организатора
 * @returns Данные для отправки в Supabase
 */
const transformActivityFormData = (formData: ActivityFormData, organizerId: string) => {
  return {
    title: formData.title.trim(),
    description: formData.description.trim(),
    short_description: formData.description?.slice(0, 100) || null,
    type: formData.type,
    category_id: formData.categoryId,
    location: formData.location.trim(),
    price: formData.price,
    currency: 'EUR',
    date_time: new Date().toISOString(),
    max_participants: formData.maxParticipants,
    difficulty_level: 'beginner',
    requires_equipment: false,
    age_restriction: formData.minAge || null,
    organizer_id: organizerId,
    contact_email: formData.contactEmail?.trim() || '',
    contact_phone: formData.contactPhone?.trim() || null,
    image_urls: [],
    tags: formData.tags || [],
    is_active: true,
    current_participants: 0
  };
};

/**
 * Получить все активности с фильтрацией и пагинацией
 * 
 * @param filters - Параметры фильтрации
 * @param page - Номер страницы (начиная с 1)
 * @param limit - Количество элементов на странице
 * @returns Promise с активностями и метаданными пагинации
 */
export const getActivities = async (
  filters: ActivityFilters = {},
  page: number = 1,
  limit: number = 10
) => {
  try {
    // Строим параметры фильтрации
    const queryParams = new URLSearchParams();
    
    // Добавляем поля для выборки
    queryParams.set('select', '*,category:categories(*),organizer:users(full_name,organization_name,email)');
    
    // Применяем фильтры
    if (filters.type) {
      queryParams.set('type', `eq.${filters.type}`);
    }
    
    if (filters.categoryId) {
      queryParams.set('category_id', `eq.${filters.categoryId}`);
    }
    
    if (filters.location) {
      queryParams.set('location', `ilike.*${filters.location}*`);
    }
    
    if (filters.minPrice !== undefined) {
      queryParams.set('price', `gte.${filters.minPrice}`);
    }
    
    if (filters.maxPrice !== undefined) {
      queryParams.set('price', `lte.${filters.maxPrice}`);
    }
    
    if (filters.search) {
      queryParams.set('or', `(title.ilike.*${filters.search}*,description.ilike.*${filters.search}*)`);
    }
    
    // Только не удаленные активности
    queryParams.set('is_deleted', 'eq.false');
    
    // Сортировка
    queryParams.set('order', 'created_at.desc');
    
    // Пагинация
    const offset = (page - 1) * limit;
    queryParams.set('limit', limit.toString());
    queryParams.set('offset', offset.toString());
    
    const paginationConfig = buildPaginationConfig(page, limit);
    
    const response = await apiClient.get(`/activities?${queryParams.toString()}`, {
      ...paginationConfig
    });
    
    const activities = response.data?.map(transformRawActivity) || [];
    
    // Получаем общее количество из заголовка Content-Range
    const contentRange = response.headers['content-range'];
    const totalCount = contentRange ? parseInt(contentRange.split('/')[1]) : activities.length;
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      activities,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    };
  } catch (error) {
    console.error('Get activities error:', error);
    throw error;
  }
};

/**
 * Получить активность по ID
 * 
 * @param id - ID активности
 * @returns Promise с данными активности
 */
export const getActivityById = async (id: string): Promise<Activity> => {
  try {
    if (USE_MOCK_DATA) {
      await simulateApiDelay(500);
      const activity = mockActivities.find(a => a.id === id);
      if (!activity) {
        throw new Error('Activity not found');
      }
      return activity;
    }

    // Real Supabase implementation would go here
    throw new Error('Real Supabase implementation not available yet');
  } catch (error) {
    console.error('Get activity by ID error:', error);
    throw error;
  }
};

/**
 * Получить активности текущего пользователя
 * 
 * @param organizerId - ID организатора
 * @param page - Номер страницы
 * @param limit - Количество элементов на странице
 * @returns Promise с активностями пользователя
 */
export const getUserActivities = async (
  organizerId: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    if (USE_MOCK_DATA) {
      // Используем mock данные для демонстрации
      await simulateApiDelay(800);
      
      // Фильтруем активности по пользователю
      let userActivities = mockActivities.filter(activity => 
        activity.userId === organizerId || organizerId === 'current-user'
      );
      
      // Если пользователь не найден, показываем все активности для демонстрации
      if (userActivities.length === 0) {
        userActivities = mockActivities;
      }
      
      // Пагинация
      const offset = (page - 1) * limit;
      const paginatedActivities = userActivities.slice(offset, offset + limit);
      const totalCount = userActivities.length;
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        activities: paginatedActivities,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1
        }
      };
    }

    // Реальный API код (для будущего использования)
    const queryParams = new URLSearchParams();
    
    // Выбираем поля с joins
    queryParams.set('select', '*,category:categories(*),organizer:users(full_name,organization_name,email)');
    
    // Фильтруем по организатору
    queryParams.set('user_id', `eq.${organizerId}`);
    
    // Сортировка по дате создания
    queryParams.set('order', 'created_at.desc');
    
    // Пагинация
    const offset = (page - 1) * limit;
    queryParams.set('limit', limit.toString());
    queryParams.set('offset', offset.toString());
    
    const paginationConfig = buildPaginationConfig(page, limit);
    
    const response = await apiClient.get(`/activities?${queryParams.toString()}`, {
      ...paginationConfig
    });
    
    const activities = response.data?.map(transformRawActivity) || [];
    
    // Получаем общее количество из заголовка
    const contentRange = response.headers['content-range'];
    const totalCount = contentRange ? parseInt(contentRange.split('/')[1]) : activities.length;
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      activities,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    };
  } catch (error) {
    console.error('Get user activities error:', error);
    throw error;
  }
};

/**
 * Создать новую активность
 * 
 * @param formData - Данные формы активности
 * @param organizerId - ID организатора
 * @returns Promise с созданной активностью
 */
export const createActivity = async (
  formData: ActivityFormData,
  organizerId: string
): Promise<Activity> => {
  try {
    if (USE_MOCK_DATA) {
      await simulateApiDelay(1000);
      // Mock creation - in real app this would insert to database
      const newActivity: Activity = {
        id: `activity-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        shortDescription: formData.description.substring(0, 100),
        type: formData.type,
        categoryId: formData.categoryId,
        category: mockCategories.find(c => c.id === formData.categoryId)!,
        location: formData.location,
        address: formData.address,
        price: formData.price || 0,
        currency: 'EUR',
        imageUrl: formData.image ? URL.createObjectURL(formData.image) : undefined,
        userId: organizerId,
        organizer: mockUsers.find(u => u.id === organizerId)!,
        tags: formData.tags ? formData.tags.map((tid: string) => mockTags.find(t => t.id === tid)!).filter(Boolean) : [],
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        maxParticipants: formData.maxParticipants,
        minAge: formData.minAge,
        maxAge: formData.maxAge,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        externalLink: formData.externalLink,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add to mock array for persistence during session
      mockActivities.push(newActivity);
      return newActivity;
    }

    // Real Supabase implementation would go here
    throw new Error('Real Supabase implementation not available yet');
  } catch (error) {
    console.error('Create activity error:', error);
    throw error;
  }
};

/**
 * Обновить активность
 * 
 * @param id - ID активности
 * @param formData - Обновленные данные формы
 * @param organizerId - ID организатора (для проверки прав)
 * @returns Promise с обновленной активностью
 */
export const updateActivity = async (
  id: string,
  formData: ActivityFormData,
  organizerId: string
): Promise<Activity> => {
  try {
    if (USE_MOCK_DATA) {
      await simulateApiDelay(800);
      
      const activityIndex = mockActivities.findIndex(a => a.id === id);
      if (activityIndex === -1) {
        throw new Error('Activity not found');
      }
      
      const existingActivity = mockActivities[activityIndex];
      if (existingActivity.userId !== organizerId) {
        throw new Error('Access denied: You can only edit your own activities');
      }
      
      // Update the activity
      const updatedActivity: Activity = {
        ...existingActivity,
        title: formData.title,
        description: formData.description,
        shortDescription: formData.description.substring(0, 100),
        type: formData.type,
        categoryId: formData.categoryId,
        category: mockCategories.find(c => c.id === formData.categoryId)!,
        location: formData.location,
        address: formData.address,
        price: formData.price || 0,
        imageUrl: formData.image ? URL.createObjectURL(formData.image) : undefined,
        tags: formData.tags ? formData.tags.map((tid: string) => mockTags.find(t => t.id === tid)!).filter(Boolean) : [],
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        maxParticipants: formData.maxParticipants,
        minAge: formData.minAge,
        maxAge: formData.maxAge,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        externalLink: formData.externalLink,
        updatedAt: new Date()
      };
      
      mockActivities[activityIndex] = updatedActivity;
      return updatedActivity;
    }

    // Real Supabase implementation would go here
    throw new Error('Real Supabase implementation not available yet');
  } catch (error) {
    console.error('Update activity error:', error);
    throw error;
  }
};

/**
 * Удалить активность (мягкое удаление - деактивация)
 * 
 * @param id - ID активности
 * @param organizerId - ID организатора (для проверки прав)
 * @returns Promise с результатом операции
 */
export const deleteActivity = async (id: string, organizerId: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      await simulateApiDelay(500);
      
      // Находим активность в mock данных
      const activityIndex = mockActivities.findIndex(a => a.id === id);
      if (activityIndex === -1) {
        throw new Error('Activity not found');
      }
      
      const activity = mockActivities[activityIndex];
      
      // Проверяем права (админ может удалить любую активность)
      if (activity.userId !== organizerId && organizerId !== 'admin-user') {
        throw new Error('You do not have permission to delete this activity');
      }
      
      // Мягкое удаление - помечаем как удаленную
      mockActivities[activityIndex] = {
        ...activity,
        isDeleted: true,
        updatedAt: new Date()
      };
      
      return;
    }

    // Реальный API код будет здесь
    throw new Error('Real API not implemented yet');
  } catch (error) {
    console.error('Delete activity error:', error);
    throw error;
  }
};

/**
 * Получить все категории
 * 
 * @returns Promise с массивом категорий
 */
export const getCategories = async () => {
  try {
    if (USE_MOCK_DATA) {
      await simulateApiDelay(300);
      return mockCategories;
    }

    // Real Supabase implementation would go here
    throw new Error('Real Supabase implementation not available yet');
  } catch (error) {
    console.error('Get categories error:', error);
    throw error;
  }
};

/**
 * Получить все теги
 * 
 * @returns Promise с массивом тегов
 */
export const getTags = async () => {
  try {
    if (USE_MOCK_DATA) {
      await simulateApiDelay(300);
      return mockTags;
    }

    // Real Supabase implementation would go here
    throw new Error('Real Supabase implementation not available yet');
  } catch (error) {
    console.error('Get tags error:', error);
    throw error;
  }
};

/**
 * Загрузить изображения для активности
 * 
 * @param files - Массив файлов изображений
 * @param activityId - ID активности
 * @returns Promise с массивом URL изображений
 */
export const uploadActivityImages = async (
  files: File[],
  activityId: string
): Promise<string[]> => {
  try {
    if (USE_MOCK_DATA) {
      await simulateApiDelay(1500);
      // Return mock image URLs for testing
      return files.map((file, index) => 
        `https://images.unsplash.com/photo-${1581833971358 + index}?w=400&h=300&fit=crop&auto=format`
      );
    }

    // Real Supabase storage implementation would go here
    throw new Error('Real Supabase storage implementation not available yet');
  } catch (error) {
    console.error('Upload activity images error:', error);
    throw error;
  }
};

/**
 * Получить статистику активностей пользователя
 * 
 * @param organizerId - ID организатора
 * @returns Promise со статистикой
 */
export const getUserActivityStats = async (organizerId: string) => {
  try {
    if (USE_MOCK_DATA) {
      await simulateApiDelay(300);
      
      // Фильтруем активности по пользователю
      const userActivities = mockActivities.filter(activity => 
        activity.userId === organizerId || organizerId === 'current-user'
      );
      
      // Если не найдены активности пользователя, используем общую статистику
      const activities = userActivities.length > 0 ? userActivities : mockActivities;
      
      const total = activities.length;
      const active = activities.filter(a => !a.isDeleted).length;
      const thisMonth = activities.filter(a => {
        const activityDate = new Date(a.createdAt);
        const now = new Date();
        return activityDate.getMonth() === now.getMonth() && 
               activityDate.getFullYear() === now.getFullYear();
      }).length;
      
      return {
        total_activities: total,
        active_activities: active,
        pending_activities: 2,
        total_participants: Math.floor(Math.random() * 200) + 50,
        this_month_activities: thisMonth
      };
    }

    // Реальный API код будет здесь
    throw new Error('Real API not implemented yet');
  } catch (error) {
    console.error('Get user activity stats error:', error);
    return {
      total_activities: 0,
      active_activities: 0,
      pending_activities: 0,
      total_participants: 0,
      this_month_activities: 0
    };
  }
};