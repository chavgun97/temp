/**
 * Table Component
 * 
 * Reusable table component for displaying data in the Hobbly application.
 * Styled according to design system with rounded rows and soft shadows.
 * 
 * @module components/common/Table
 */

import React from 'react';
import styles from './Table.module.css';
import { Button } from '../Button';

/**
 * Table column configuration
 */
export interface TableColumn<T> {
  /** Column key */
  key: keyof T | string;
  /** Column header label */
  label: string;
  /** Custom render function */
  render?: (value: any, item: T) => React.ReactNode;
  /** Column width */
  width?: string;
  /** Alignment */
  align?: 'left' | 'center' | 'right';
}

/**
 * Props for the Table component
 * @interface TableProps
 */
export interface TableProps<T> {
  /** Array of data items */
  data: T[];
  /** Column configurations */
  columns: TableColumn<T>[];
  /** Row key extractor */
  keyExtractor: (item: T) => string | number;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Row click handler */
  onRowClick?: (item: T) => void;
  /** Whether to show hover effect */
  hoverable?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * Table Component
 * 
 * Displays data in a styled table format with support for custom rendering,
 * loading states, and row interactions.
 * 
 * @component
 * @example
 * ```tsx
 * const columns = [
 *   { key: 'name', label: 'Name' },
 *   { key: 'status', label: 'Status', render: (val) => <Badge>{val}</Badge> }
 * ];
 * 
 * <Table 
 *   data={activities}
 *   columns={columns}
 *   keyExtractor={(item) => item.id}
 * />
 * ```
 */
export function Table<T>({
  data,
  columns,
  keyExtractor,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  hoverable = true,
  className = ''
}: TableProps<T>) {
  /**
   * Get value from nested object path
   */
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  /**
   * Render cell content
   */
  const renderCell = (column: TableColumn<T>, item: T): React.ReactNode => {
    const value = getNestedValue(item, column.key as string);
    
    if (column.render) {
      return column.render(value, item);
    }
    
    return value?.toString() || '-';
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.tableContainer} ${className}`}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {columns.map((column) => (
              <th
                key={column.key as string}
                className={styles.headerCell}
                style={{
                  width: column.width,
                  textAlign: column.align || 'left'
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className={`${styles.dataRow} ${hoverable ? styles.hoverable : ''}`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td
                  key={column.key as string}
                  className={styles.dataCell}
                  style={{ textAlign: column.align || 'left' }}
                >
                  {renderCell(column, item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Pagination Component
 * 
 * Handles table pagination controls
 */
export interface PaginationProps {
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Page change handler */
  onPageChange: (page: number) => void;
  /** Show page numbers */
  showPageNumbers?: boolean;
  /** Maximum page buttons to show */
  maxPageButtons?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxPageButtons = 5
}) => {
  /**
   * Calculate page numbers to display
   */
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const halfRange = Math.floor(maxPageButtons / 2);
    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(totalPages, start + maxPageButtons - 1);
    
    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      {showPageNumbers && getPageNumbers().map((page) => (
        <button
          key={page}
          className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      <button
        className={styles.pageButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};
