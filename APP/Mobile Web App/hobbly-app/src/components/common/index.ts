/**
 * Common components barrel export
 * 
 * Exports all common reusable components used throughout the application.
 * These components form the foundation of the UI component library.
 * 
 * @module components/common
 */

// Button component
export { Button } from './Button';
export type { ButtonProps } from './Button';

// Icon component
export { Icon } from './Icon';
export type { IconProps, IconName } from './Icon';

// Input component
export { Input } from './Input';
export type { InputProps } from './Input';

// Table component
export { Table, Pagination } from './Table';
export type { TableProps, TableColumn, PaginationProps } from './Table';

// ProtectedRoute component
export { ProtectedRoute } from './ProtectedRoute';
