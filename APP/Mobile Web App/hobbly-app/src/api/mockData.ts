/**
 * @fileoverview Mock data for testing admin panel functionality
 * @module api/mockData
 * @description Provides fake data for testing until real Supabase integration is complete
 */

import { Activity, ActivityType, User, UserRole, Category, Tag } from '../types';

/**
 * Mock categories data
 */
export const mockCategories: Category[] = [
  { id: '1', name: 'Спорт и физическая активность', icon: '⚽', description: 'Спортивные мероприятия и активности' },
  { id: '2', name: 'Музыка и исполнительское искусство', icon: '🎵', description: 'Музыкальные мероприятия' },
  { id: '3', name: 'Ремесла и искусство', icon: '🎨', description: 'Творческие мастерские и курсы' },
  { id: '4', name: 'Наука и технологии', icon: '🔬', description: 'Научные и технические мероприятия' },
  { id: '5', name: 'Игры и киберспорт', icon: '🎮', description: 'Игровые турниры и события' },
];

/**
 * Mock tags data
 */
export const mockTags: Tag[] = [
  { id: '1', name: 'Бесплатно', color: '#65FF81' },
  { id: '2', name: 'Открыто для всех', color: '#F5FF65' },
  { id: '3', name: 'Подходит для начинающих', color: '#73B3FF' },
  { id: '4', name: 'Постоянное событие', color: '#FF9473' },
  { id: '5', name: 'Онлайн', color: '#B473FF' },
];

/**
 * Mock users data
 */
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'organizer@example.com',
    role: UserRole.ORGANIZER,
    fullName: 'Иван Петров',
    organizationName: 'Спортивный клуб Энергия',
    phone: '+358401234567',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'user-2', 
    email: 'admin@hobbly.fi',
    role: UserRole.ADMIN,
    fullName: 'Анна Админова',
    organizationName: 'Hobbly Technologies Oy',
    phone: '+358409876543',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

/**
 * Mock activities data
 */
export const mockActivities: Activity[] = [
  {
    id: 'activity-1',
    title: 'Йога для начинающих',
    description: 'Занятия йогой для людей без опыта. Включает базовые позы и дыхательные упражнения. Инструктор поможет освоить основы и создать правильную практику.',
    shortDescription: 'Йога для новичков с базовыми позами',
    type: ActivityType.ACTIVITY,
    categoryId: '1',
    category: mockCategories[0],
    location: 'Хельсинки',
    address: 'Центральный парк, павильон A',
    price: 15.00,
    currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    userId: 'user-1',
    organizer: mockUsers[0],
    tags: [mockTags[0], mockTags[2]],
    startDate: new Date('2024-02-01T18:00:00'),
    endDate: new Date('2024-02-01T19:30:00'),
    maxParticipants: 20,
    minAge: 16,
    maxAge: 65,
    contactEmail: 'contact@energyclub.fi',
    contactPhone: '+358401234567',
    externalLink: 'https://energyclub.fi/yoga',
    isDeleted: false,
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00')
  },
  {
    id: 'activity-2',
    title: 'Мастер-класс по керамике',
    description: 'Изучите основы работы с глиной. Создайте свою первую керамическую посуду под руководством опытного мастера.',
    shortDescription: 'Основы керамики и создание посуды',
    type: ActivityType.EVENT,
    categoryId: '3',
    category: mockCategories[2],
    location: 'Тампере',
    address: 'Студия керамики, ул. Художников 15',
    price: 45.00,
    currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    userId: 'user-1',
    organizer: mockUsers[0],
    tags: [mockTags[2], mockTags[4]],
    startDate: new Date('2024-02-10T14:00:00'),
    endDate: new Date('2024-02-10T17:00:00'),
    maxParticipants: 12,
    minAge: 18,
    contactEmail: 'pottery@example.com',
    contactPhone: '+358407654321',
    isDeleted: false,
    createdAt: new Date('2024-01-20T14:20:00'),
    updatedAt: new Date('2024-01-20T14:20:00')
  },
  {
    id: 'activity-3',
    title: 'Футбольный турнир для детей',
    description: 'Дружеский турнир для юных футболистов 8-14 лет. Возможность попробовать свои силы в команде и найти новых друзей.',
    shortDescription: 'Детский футбольный турнир 8-14 лет',
    type: ActivityType.COMPETITION,
    categoryId: '1',
    category: mockCategories[0],
    location: 'Турку',
    address: 'Спортивный комплекс Турку, поле №3',
    price: 0,
    currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
    userId: 'user-1',
    organizer: mockUsers[0],
    tags: [mockTags[0], mockTags[3]],
    startDate: new Date('2024-02-15T10:00:00'),
    endDate: new Date('2024-02-15T16:00:00'),
    maxParticipants: 48,
    minAge: 8,
    maxAge: 14,
    contactEmail: 'football@energyclub.fi',
    contactPhone: '+358401234567',
    isDeleted: false,
    createdAt: new Date('2024-01-25T09:15:00'),
    updatedAt: new Date('2024-01-25T09:15:00')
  },
  {
    id: 'activity-4',
    title: 'Программирование для подростков',
    description: 'Курс основ программирования на Python для подростков 13-17 лет. Изучим основы алгоритмов и создадим простые игры.',
    shortDescription: 'Python для подростков 13-17 лет',
    type: ActivityType.CLUB,
    categoryId: '4',
    category: mockCategories[3],
    location: 'Эспоо',
    address: 'IT-центр Эспоо, класс 201',
    price: 80.00,
    currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
    userId: 'user-2',
    organizer: mockUsers[1],
    tags: [mockTags[1], mockTags[2]],
    startDate: new Date('2024-02-20T16:00:00'),
    endDate: new Date('2024-02-20T18:00:00'),
    maxParticipants: 15,
    minAge: 13,
    maxAge: 17,
    contactEmail: 'coding@hobbly.fi',
    contactPhone: '+358409876543',
    externalLink: 'https://hobbly.fi/coding-course',
    isDeleted: false,
    createdAt: new Date('2024-01-28T11:45:00'),
    updatedAt: new Date('2024-01-28T11:45:00')
  },
  {
    id: 'activity-5',
    title: 'Игровой турнир по Counter-Strike',
    description: 'Киберспортивный турнир по CS:GO для игроков всех уровней. Призы для победителей и отличная атмосфера.',
    shortDescription: 'CS:GO турнир для всех уровней',
    type: ActivityType.COMPETITION,
    categoryId: '5',
    category: mockCategories[4],
    location: 'Вантаа',
    address: 'Игровой центр Galaxy, зал 3',
    price: 25.00,
    currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    userId: 'user-1',
    organizer: mockUsers[0],
    tags: [mockTags[1], mockTags[4]],
    startDate: new Date('2024-03-05T18:00:00'),
    endDate: new Date('2024-03-05T23:00:00'),
    maxParticipants: 32,
    minAge: 16,
    contactEmail: 'esports@energyclub.fi',
    contactPhone: '+358401234567',
    isDeleted: false,
    createdAt: new Date('2024-02-01T16:30:00'),
    updatedAt: new Date('2024-02-01T16:30:00')
  }
];

/**
 * Simulate API delay for realistic testing
 */
export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Mock statistics data
 */
export const mockStats = {
  totalActivities: mockActivities.length,
  activeActivities: mockActivities.filter(a => !a.isDeleted).length,
  pendingActivities: 2,
  totalParticipants: 150,
  thisMonthActivities: 3
};