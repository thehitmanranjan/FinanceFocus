import { TimeRange } from "@/lib/date-utils";
import { useDate } from "@/contexts/DateContext";

interface TimeRangeSelectorProps {
  className?: string;
}

export default function TimeRangeSelector({ className = "" }: TimeRangeSelectorProps) {
  const { timeRange, setTimeRange } = useDate();

  const ranges: { key: TimeRange; label: string }[] = [
    { key: "day", label: "Day" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
  ];

  return (
    <div className={`flex border-b ${className}`}>
      {ranges.map((range) => (
        <button
          key={range.key}
          className={`flex-1 text-center py-2 ${
            timeRange === range.key
              ? "border-b-2 border-accent text-accent font-medium"
              : "text-neutral-700"
          }`}
          onClick={() => setTimeRange(range.key)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
