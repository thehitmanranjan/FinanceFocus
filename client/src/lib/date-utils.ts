import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
  isToday,
  isYesterday,
  isSameYear,
  parseISO,
} from "date-fns";

export type TimeRange = "day" | "week" | "month" | "year";

export function getDateRange(date: Date, range: TimeRange) {
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
}

export function formatDatePeriod(date: Date, range: TimeRange): string {
  switch (range) {
    case "day":
      return format(date, "EEEE, MMMM d, yyyy");
    case "week": {
      const { start, end } = getDateRange(date, "week");
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    }
    case "month":
      return format(date, "MMMM yyyy");
    case "year":
      return format(date, "yyyy");
  }
}

export function formatTransactionDate(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
  
  if (isToday(date)) {
    return `Today, ${format(date, "h:mm a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday, ${format(date, "h:mm a")}`;
  } else if (isSameYear(date, new Date())) {
    return format(date, "MMM d, h:mm a");
  } else {
    return format(date, "MMM d, yyyy, h:mm a");
  }
}

export function getQueryTimeFormat(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
