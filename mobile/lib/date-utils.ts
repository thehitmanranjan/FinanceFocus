import { format } from 'date-fns';

// Define the TimeRange type
export type TimeRange = 'day' | 'week' | 'month' | 'year';

// Format transaction date for display
export function formatTransactionDate(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return format(date, 'MMM d, yyyy');
}

// Get formatted date for API queries
export function getQueryTimeFormat(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}