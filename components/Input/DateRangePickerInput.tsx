"use client"
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ReactNode, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

type DateRangePickerInputProps = {
  label?: ReactNode;
  errorMessage?: string | false;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftIconClassName?: string;
  rightIconClassName?: string;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  onDateRangeSelect?: (range: DateRange | undefined) => void;
  selectedDateRange?: DateRange;
  numberOfMonths?: number;
} & React.ComponentProps<'div'>;

export const DateRangePickerInput = ({
  label,
  errorMessage,
  className,
  leftIcon,
  rightIcon,
  leftIconClassName,
  rightIconClassName,
  onLeftIconClick,
  onRightIconClick,
  onDateRangeSelect,
  selectedDateRange,
  numberOfMonths = 2,
  ...rest
}: DateRangePickerInputProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    selectedDateRange || { from: undefined, to: undefined }
  );

  return (
    <div className="leading-3">
      {label && (
        <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "relative cursor-pointer bg-gray-100 rounded-lg border-2 border-primary-100 py-3",
              leftIcon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              errorMessage && "bg-red-100",
              className
            )}
          >
            <div className="flex items-center justify-between">
              {leftIcon || <CalendarIcon className="w-5 h-5 text-gray-500" />}
              <span className={cn(
                "text-sm flex-1",
                !dateRange?.from && "text-gray-400"
              )}>
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Select date range"
                )}
              </span>
              {rightIcon}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(newDateRange) => {
              setDateRange(newDateRange);
              onDateRangeSelect?.(newDateRange);
            }}
            numberOfMonths={numberOfMonths}
            className="rounded-lg border"
          />
        </PopoverContent>
      </Popover>
      {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
    </div>
  );
};