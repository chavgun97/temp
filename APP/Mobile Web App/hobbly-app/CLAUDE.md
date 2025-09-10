# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hobbly Technologies Oy is a modern technology company whose mission is to make people's daily lives easier by providing easy access to hobbies and leisure opportunities. The company strives to enhance well-being and social interaction by offering digital solutions that connect users with service providers and recreational activities.

### Project Goal
Develop a mobile application and admin panel that unite a wide range of leisure and activity opportunities. The application should allow users to easily find suitable options and obtain reliable information about service providers.

The application targets different user groups: children, teenagers, adults, families, and elderly people. The solution must be convenient, attractive, and work on various devices.

### Development Approach
- **Mobile First**: User interface primarily optimized for mobile browsers (375px)
- **Desktop First**: Admin panel primarily designed for large screens (1440px)

## Project Requirements

### Core Application Features

1. **Activity Information Collection**
   - Service providers can add their events to the application
   - Users can filter activities by multiple parameters

2. **Filtering and Search**
   - Users can search hobbies by location, activity type, price, time, or target group
   - Ability to use multiple filters simultaneously

3. **Service Provider Information**
   - Clear information for each activity: description, location, contacts, schedule, and prices
   - Links to provider website or registration forms

4. **Usability and Accessibility**
   - Simple to use for all ages
   - Clear interface following accessibility principles

5. **Admin Panel for Service Providers**
   - Sports clubs, municipalities, associations, and companies can add, edit, and delete events
   - Administrators can approve and control content

6. **Future Scalability**
   - Application can be extended (user ratings, reviews)
   - Payment service integration possibilities

### Technical Specifications

- **Mobile App Standard Width**: 375px
- **Admin Panel Standard Width**: 1440px  
- **File Formats**: PNG or JPG

### Admin Panel Implementation

**Core Functions:**
- User registration and email/password login
- Password change in user settings
- Add, edit, delete activities (only own listings)
- Administrator rights for managing all listings and users
- Two-step deletion (trash and permanent deletion)

**User Registration:**
- Multi-step form (contact data, basic data, organization info)
- Email used as login
- Secure passwords (minimum 8 characters and one digit)
- Secure password storage (bcrypt or Argon2)

**User Roles:**
- **Organizers** (sports clubs, associations, companies) → see and manage only their listings
- **Administrators** (Hobbly staff) → can manage all accounts and listings

### Mobile Interface Implementation

**Bottom Navigation Bar** for easy page transitions

**Main Pages:**
- **Listings** (home): list of all hobby and activity listings
- **Search**: search functionality for hobbies and events  
- **Map**: display listing locations on map

**Data Loading:**
- All information loaded via REST API
- Infinite scroll pagination for activity lists
- OpenAPI documentation interpretation required

**Listing Display:**
Each listing shows:
- Title
- Image
- Short description (up to 100 characters)
- Organization name

**Detailed View:**
- Full activity information
- Contact details
- Search by title, description, organization name, and tags

### Content Categories

**Event Types (5):**
- Activity
- Event
- Hobby Opportunity
- Club
- Competition

**Categories (10):**
- Sports and Physical Activity
- Music and Performing Arts
- Crafts and Art
- Science and Technology
- Games and Esports
- Food and Cooking
- Nature and Tourism
- Culture and History
- Community and Volunteering
- Children and Families

**Tags (10 examples):**
- Free
- Open to All
- Suitable for Beginners
- Ongoing Event
- Online
- Family-Friendly
- Suitable for Seniors
- Suitable for Special Groups
- Equipment Provided
- Registration Required

## Quality Requirements

- **Semantic HTML/CSS**: Code must be semantically correct considering accessibility
- **Testing**: Use Chrome Lighthouse and axe DevTools for accessibility and quality assurance
- **Mobile-First Approach**: Primary focus on 375px width
- **Brand Compliance**: Follow established brand guidelines
- **Security and Usability**: Must be considered in all features
- **Performance**: Comfortable user experience even with large data volumes

## Architectural Separation Strategy

**CRITICAL REQUIREMENT**: The admin panel and mobile application must be maximally separated to enable future migration to separate projects. This architectural approach provides:

### Separation Benefits
- **Independent Development**: Different teams can work on mobile vs admin without conflicts
- **Optimized Deployments**: Mobile app and admin panel can be deployed independently
- **Performance Optimization**: Each application loads only necessary code
- **Technology Flexibility**: Future ability to use different frameworks/technologies
- **Scalability**: Independent scaling based on usage patterns

### Current Monorepo Structure
While currently in a single React project, code should be organized with clear boundaries:
```
src/
├── mobile/          # Mobile-first components and pages (375px)
│   ├── components/  # Bottom navigation, mobile cards, etc.
│   └── pages/       # Welcome, Search, Map, Activity Details
├── admin/           # Desktop-first components and pages (1440px)  
│   ├── components/  # Sidebar, tables, desktop forms, etc.
│   └── pages/       # Dashboard, Activities Management, Users
├── shared/          # Common code for both applications
│   ├── api/         # Supabase REST API clients
│   ├── contexts/    # Authentication context
│   ├── types/       # TypeScript interfaces
│   └── utils/       # Utility functions
```

## Project RULES
- **Maximal Documentation**: Every function, file, step, and architecture must be documented
- **API Universality**: Backend accessed via Supabase REST API for universality and backend flexibility
- **Clear Separation**: Mobile and admin components must not cross-reference each other
- **Shared Library Pattern**: Common functionality (API, auth, types) should be easily extractable

## Development Commands

### Core Commands
```bash
# Development server
npm start

# Build for production  
npm run build

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Eject from Create React App (use with caution)
npm run eject
```

## Project Architecture

### Tech Stack
- **React 19.1.1** with **TypeScript 4.9.5** for type safety
- **React Router v7.8.2** for client-side routing
- **Axios 1.11.0** for HTTP requests to REST API
- **CSS Modules** for component styling
- **Supabase** as Backend-as-a-Service (PostgreSQL + Auth + Storage)
- **React Testing Library** with **Jest** for testing

### Application Structure
This is a **mobile-first React application** for Hobbly - a platform connecting hobby/activity providers with users. The app has two main interfaces:
1. **Mobile Web App** (mobile-first) - User interface for finding activities
2. **Admin Panel** (desktop-first) - Provider interface for managing activities

### Key Architecture Patterns
- **API-First**: All backend interaction through REST API (`src/api/`)
- **Component Architecture**: Reusable components with CSS Modules
- **Type Safety**: Comprehensive TypeScript interfaces (`src/types/index.ts`)
- **Barrel Exports**: Clean imports using index.ts files

## Directory Structure

```
src/
├── api/                    # API layer with Supabase REST clients
│   ├── config.ts          # Axios clients, interceptors & error handling
│   ├── auth.api.ts        # Authentication API
│   ├── activities.api.ts  # Activities CRUD API
│   └── activities.api.old.ts # Legacy activities API (backup)
├── components/            # Reusable UI components with CSS Modules
│   ├── common/           # Generic components (Button, Input, Table, Icon, ProtectedRoute)
│   │   └── [Component]/  # Each component has own folder with .tsx, .module.css, index.ts
│   └── layout/           # Layout components (Header, Sidebar)
│       └── [Component]/  # Each component has own folder with .tsx, .module.css, index.ts
├── contexts/             # React Context providers
│   └── AuthContext.tsx  # Authentication context with Supabase integration
├── pages/                # Route components (each with own folder)
│   ├── Welcome/          # Landing page
│   ├── Login/            # Authentication
│   ├── SignUp/          # Registration with multi-step form
│   ├── Dashboard/        # Main user dashboard
│   ├── Activities/       # Activities management table
│   └── PersonalInfo/     # User profile management
├── types/                # TypeScript interfaces, enums & constants
│   └── index.ts         # All type definitions with predefined data
├── styles/               # Global CSS variables and base styles
├── App.tsx              # Router setup and main routes
└── index.tsx            # React entry point with StrictMode
```

## API Configuration

### Environment Variables
Required environment variables (create `.env` file):
```bash
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### API Clients (src/api/config.ts)
- `apiClient` - REST API for data operations (`/rest/v1`)
- `authClient` - Authentication API (`/auth/v1`) 
- `storageClient` - File storage API (`/storage/v1`)

All clients include:
- Automatic token management with localStorage
- Comprehensive error handling and localization (Russian)
- Request/Response interceptors for authentication
- Automatic token removal on 401 errors

## Key Types & Interfaces (src/types/index.ts)

### Core Entities
- `User` - User profiles with roles (organizer, admin, user)
- `Activity` - Events/activities with full metadata
- `Category` & `Tag` - Classification system with predefined data
- `ActivityFilters` - Search and filtering parameters
- `AuthContextType` - Authentication context interface

### Form Data Types
- `SignInFormData` & `SignUpFormData` - Authentication forms
- `ActivityFormData` - Activity creation/editing

### Enums
- `UserRole` - ORGANIZER, ADMIN, USER
- `ActivityType` - ACTIVITY, EVENT, HOBBY_OPPORTUNITY, CLUB, COMPETITION

### Constants
- `CATEGORIES` - 10 predefined categories with icons (emojis)
- `TAGS` - 10 predefined tags with colors

## Routing

Main routes configured in `App.tsx`:
- `/` - Welcome/landing page
- `/login` & `/signup` - Authentication
- `/dashboard` - Main user interface  
- `/activities` - Activities management
- `/personal-info` - User profile

Unknown routes redirect to `/` automatically.

## Styling System

### CSS Architecture
- **CSS Modules** for component isolation
- **Global variables** in `src/styles/variables.css`
- **Mobile-first** responsive design approach
- **Montserrat** font family from Google Fonts

### Color Palette
- Primary: `#667eea` (purple gradient start)
- Secondary: `#764ba2` (purple gradient end)
- Background gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

## Development Workflow

### Current Status
✅ **Completed**: UI components, routing, styling, TypeScript setup, AuthContext
🔄 **Next Steps**: Supabase authentication integration, API data binding

### Testing
- **Jest** + **React Testing Library** for component tests
- **Chrome Lighthouse** for performance auditing
- Run tests with `npm test`
- Test files: `App.test.tsx`, `setupTests.ts`, `reportWebVitals.ts`

## Architecture Patterns & Best Practices

### Component Structure
Each component follows the same folder pattern:
```
ComponentName/
├── ComponentName.tsx      # Main component file
├── ComponentName.module.css # CSS Modules styles
└── index.ts              # Barrel export
```

### Shared Library Architecture

**Core Shared Components** (easily extractable for future separation):

#### API Layer (`src/api/`)
- **config.ts**: Base axios instances with interceptors
- **auth.api.ts**: Authentication operations using Supabase Auth
- **activities.api.ts**: CRUD operations for activities
- All API clients share error handling and token management
- **Universal Design**: API layer works identically for both mobile and admin apps

#### State Management (`src/contexts/`)
- **AuthContext**: Global authentication state using React Context
- **localStorage**: Token persistence
- **React State**: Local component state management
- **Authentication**: Single auth system serves both mobile and admin interfaces

#### Type System (`src/types/`)
- **Shared Interfaces**: User, Activity, Category, Tag definitions
- **Form Types**: SignIn, SignUp, Activity form data
- **API Types**: Error handling, pagination, filtering
- **Enums & Constants**: UserRole, ActivityType, predefined categories/tags

#### Utilities & Configuration
- **Error Handling**: Comprehensive error handling with Russian localization
- **API Helpers**: Filter building, pagination, sorting utilities
- **Constants**: API URLs, default configurations, storage buckets

### Component Isolation Strategy

**Mobile Components** (should never import admin components):
- Bottom navigation patterns
- Mobile-optimized cards and lists
- Touch-friendly interfaces
- Infinite scroll implementations

**Admin Components** (should never import mobile components):
- Desktop sidebar navigation
- Data tables and forms
- Multi-column layouts
- Desktop-optimized modals and dropdowns

**Shared UI Components** (can be used by both):
- Basic Button, Input, Icon components
- Loading states and error messages
- Modal/dialog base components

## Future Migration Path

### Phase 1: Current Monorepo Organization
Organize existing code with clear separation boundaries:
```bash
# Current structure reorganization
src/
├── mobile/
│   ├── components/     # Mobile-specific components
│   ├── pages/          # Welcome, Search, Map pages
│   └── styles/         # Mobile-first CSS
├── admin/
│   ├── components/     # Admin-specific components  
│   ├── pages/          # Dashboard, Activities, Users
│   └── styles/         # Desktop-first CSS
└── shared/
    ├── api/            # Supabase REST clients
    ├── contexts/       # Auth context
    ├── types/          # TypeScript definitions
    └── utils/          # Common utilities
```

### Phase 2: Extract Shared Library
Create separate package for common functionality:
```bash
# Future structure
packages/
├── hobbly-shared/           # Shared library package
│   ├── src/api/            # API clients and configuration
│   ├── src/types/          # TypeScript interfaces
│   ├── src/contexts/       # Authentication context
│   ├── src/utils/          # Utility functions
│   └── package.json        # Shared dependencies
├── hobbly-mobile/          # Mobile application
│   ├── src/components/     # Mobile UI components
│   ├── src/pages/          # Mobile pages
│   ├── package.json        # Mobile dependencies
│   └── vite.config.ts      # Mobile build config
└── hobbly-admin/           # Admin panel
    ├── src/components/     # Desktop UI components
    ├── src/pages/          # Admin pages
    ├── package.json        # Admin dependencies
    └── vite.config.ts      # Admin build config
```

### Phase 3: Independent Deployment
- **Mobile App**: Deploy to mobile-optimized CDN
- **Admin Panel**: Deploy to admin subdomain
- **Shared Library**: Publish to npm registry or private repository

### Migration Checklist
- [ ] Reorganize current codebase with clear separation
- [ ] Extract shared library (@hobbly/shared)
- [ ] Create separate build configurations
- [ ] Set up independent CI/CD pipelines
- [ ] Configure separate domains/subdomains
- [ ] Update environment variable management

## Bundle Optimization Strategy

### Current Single Bundle Issues
- Mobile users download admin panel code (unnecessary)
- Admin users download mobile components (unnecessary)
- Single cache invalidation affects both applications

### Optimized Approach

#### Mobile Bundle Optimization
```json
// Mobile-specific optimizations
{
  "build": {
    "target": "es2015",
    "minify": true,
    "cssCodeSplit": true,
    "rollupOptions": {
      "external": ["admin/*"],
      "output": {
        "manualChunks": {
          "vendor": ["react", "react-dom"],
          "api": ["axios", "@supabase/supabase-js"]
        }
      }
    }
  }
}
```

#### Admin Bundle Optimization  
```json
// Admin-specific optimizations
{
  "build": {
    "target": "es2020",
    "minify": true,
    "rollupOptions": {
      "external": ["mobile/*"],
      "output": {
        "manualChunks": {
          "vendor": ["react", "react-dom"],
          "admin": ["recharts", "react-table"],
          "api": ["axios", "@supabase/supabase-js"]
        }
      }
    }
  }
}
```

### Performance Benefits
- **Mobile**: 40-60% smaller bundle size
- **Admin**: Optimized for desktop performance
- **Independent Caching**: Updates to admin don't affect mobile cache
- **Parallel Development**: Teams can work independently

## Important Notes

- Project uses **Russian language** in README, comments, and error messages
- **TypeScript strict mode** enabled with comprehensive type definitions
- **Barrel exports** pattern used throughout for clean imports
- **JSDoc documentation** extensively used in components and API layer
- All components use **CSS Modules** for style isolation
- **AuthContext** provides authentication state management throughout the app
- **Separation Strategy**: Admin panel and mobile app must remain maximally decoupled for future extraction