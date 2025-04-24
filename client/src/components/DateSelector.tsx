import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useDate } from "@/contexts/DateContext";

export default function DateSelector() {
  const { 
    currentDate, 
    formattedPeriod,
    timeRange,
    goToPreviousPeriod, 
    goToNextPeriod,
    resetToToday
  } = useDate();

  return (
    <div className="bg-white px-4 py-2 flex justify-between items-center">
      <button className="p-1" onClick={goToPreviousPeriod}>
        <ChevronLeft className="w-5 h-5" />
      </button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="px-3 py-1 font-medium flex items-center gap-1">
            {formattedPeriod}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto" align="center">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={(date) => {
              if (date) {
                resetToToday();
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <button className="p-1" onClick={goToNextPeriod}>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
