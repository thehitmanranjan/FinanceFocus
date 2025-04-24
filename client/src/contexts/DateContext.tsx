import { createContext, useContext, useState, ReactNode } from "react";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from "date-fns";

type TimeRange = "day" | "week" | "month" | "year";

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

const DateContext = createContext<DateContextType | undefined>(undefined);

export function DateProvider({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  // Calculate start and end dates based on current date and time range
  const calculateDates = (date: Date, range: TimeRange) => {
    switch (range) {
      case "day":
        return {
          start: startOfDay(date),
          end: endOfDay(date),
        };
      case "week":
        return {
          start: startOfWeek(date, { weekStartsOn: 1 }),
          end: endOfWeek(date, { weekStartsOn: 1 }),
        };
      case "month":
        return {
          start: startOfMonth(date),
          end: endOfMonth(date),
        };
      case "year":
        return {
          start: startOfYear(date),
          end: endOfYear(date),
        };
    }
  };

  const { start: startDate, end: endDate } = calculateDates(currentDate, timeRange);

  // Format the period for display
  const getFormattedPeriod = () => {
    switch (timeRange) {
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy");
      case "week":
        return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
      case "month":
        return format(currentDate, "MMMM yyyy");
      case "year":
        return format(currentDate, "yyyy");
    }
  };

  const formattedPeriod = getFormattedPeriod();

  // Navigation functions
  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate);
    switch (timeRange) {
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const goToNextPeriod = () => {
    const newDate = new Date(currentDate);
    switch (timeRange) {
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

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

export function useDate() {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
}
