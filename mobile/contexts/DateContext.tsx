import React, { createContext, useContext, useState, ReactNode } from 'react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addDays, addWeeks, addMonths, addYears, subDays, subWeeks, subMonths, subYears } from 'date-fns';

// Define the time range type
export type TimeRange = 'day' | 'week' | 'month' | 'year';

// Define the context type
interface DateContextType {
  currentDate: Date;
  timeRange: TimeRange;
  startDate: Date;
  endDate: Date;
  formattedPeriod: string;
  setTimeRange: (range: TimeRange) => void;
  goToPreviousPeriod: () => void;
  goToNextPeriod: () => void;
  resetToToday: () => void;
}

// Create the context
const DateContext = createContext<DateContextType | undefined>(undefined);

// Provider component
export function DateProvider({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  // Calculate date range based on current date and range
  const calculateDates = (date: Date, range: TimeRange) => {
    let startDate: Date;
    let endDate: Date;

    switch (range) {
      case 'day':
        startDate = startOfDay(date);
        endDate = endOfDay(date);
        break;
      case 'week':
        startDate = startOfWeek(date, { weekStartsOn: 1 }); // Monday
        endDate = endOfWeek(date, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
        break;
      case 'year':
        startDate = startOfYear(date);
        endDate = endOfYear(date);
        break;
      default:
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
    }

    return { startDate, endDate };
  };

  // Format the period for display
  const formatPeriod = (date: Date, range: TimeRange): string => {
    switch (range) {
      case 'day':
        return format(date, 'MMMM d, yyyy');
      case 'week':
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'month':
        return format(date, 'MMMM yyyy');
      case 'year':
        return format(date, 'yyyy');
      default:
        return format(date, 'MMMM yyyy');
    }
  };

  // Go to previous period
  const goToPreviousPeriod = () => {
    let newDate;
    switch (timeRange) {
      case 'day':
        newDate = subDays(currentDate, 1);
        break;
      case 'week':
        newDate = subWeeks(currentDate, 1);
        break;
      case 'month':
        newDate = subMonths(currentDate, 1);
        break;
      case 'year':
        newDate = subYears(currentDate, 1);
        break;
      default:
        newDate = subMonths(currentDate, 1);
    }
    setCurrentDate(newDate);
  };

  // Go to next period
  const goToNextPeriod = () => {
    let newDate;
    switch (timeRange) {
      case 'day':
        newDate = addDays(currentDate, 1);
        break;
      case 'week':
        newDate = addWeeks(currentDate, 1);
        break;
      case 'month':
        newDate = addMonths(currentDate, 1);
        break;
      case 'year':
        newDate = addYears(currentDate, 1);
        break;
      default:
        newDate = addMonths(currentDate, 1);
    }
    setCurrentDate(newDate);
  };

  // Reset to today
  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  // Calculate date range
  const { startDate, endDate } = calculateDates(currentDate, timeRange);
  const formattedPeriod = formatPeriod(currentDate, timeRange);

  // Context value
  const value = {
    currentDate,
    timeRange,
    startDate,
    endDate,
    formattedPeriod,
    setTimeRange,
    goToPreviousPeriod,
    goToNextPeriod,
    resetToToday,
  };

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
}

// Custom hook to use the context
export function useDate() {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
}