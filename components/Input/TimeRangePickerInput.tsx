import { cn } from "@/lib/utils";
import { CalendarIcon, ArrowUpAzIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type TimeRange = {
  from: string;
  to: string;
};

type TimeRangePickerInputProps = {
  label?: ReactNode;
  errorMessage?: string | false;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftIconClassName?: string;
  rightIconClassName?: string;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  onTimeRangeSelect?: (range: TimeRange | undefined) => void;
  selectedTimeRange?: TimeRange;
} & React.ComponentProps<'div'>;

const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour % 12 || 12;
      const period = hour < 12 ? 'AM' : 'PM';
      const formattedMinute = minute.toString().padStart(2, '0');
      times.push(`${formattedHour}:${formattedMinute}${period}`);
    }
  }
  return times;
};

export const TimeRangePickerInput = ({
  label,
  errorMessage,
  className,
  leftIcon,
  rightIcon,
  leftIconClassName,
  rightIconClassName,
  onLeftIconClick,
  onRightIconClick,
  onTimeRangeSelect,
  selectedTimeRange,
  ...rest
}: TimeRangePickerInputProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>(
    selectedTimeRange || { from: '', to: '' }
  );
  const [isSelectingTo, setIsSelectingTo] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timeOptions = generateTimeOptions();

  const handleTimeClick = (time: string) => {
    if (!isSelectingTo) {
      setTimeRange({ from: time, to: '' });
      setIsSelectingTo(true);
    } else {
      const fromIndex = timeOptions.indexOf(timeRange.from);
      const toIndex = timeOptions.indexOf(time);

      if (toIndex > fromIndex) {
        const newRange = { from: timeRange.from, to: time };
        setTimeRange(newRange);
        onTimeRangeSelect?.(newRange);
        setIsOpen(false);
        setIsSelectingTo(false);
      }
    }
  };

  return (
    <div className="leading-3">
      {label && (
        <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
          {label}
        </label>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "relative cursor-pointer bg-gray-100 rounded border-2 border-primary-100 py-3",
              leftIcon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              errorMessage && "bg-red-100",
              className
            )}
          >
            <div className="flex items-center justify-between">
              {leftIcon || <CalendarIcon className="w-5 h-5 text-gray-500 mr-2" />}
              <span className={cn(
                "text-sm flex-1",
                !timeRange.from && "text-gray-400"
              )}>
                {timeRange.from ? (
                  timeRange.to ? (
                    <span className="flex items-center">
                      <span className="basis-1/2">
                        {timeRange.from}
                      </span>
                      <span className="flex-1 flex items-center gap-2">
                        <ArrowUpAzIcon />
                        <span>{timeRange.to}</span>
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="basis-1/2">
                        {timeRange.from}
                      </span>
                      <span className="flex-1 flex items-center gap-2">
                        <ArrowUpAzIcon />
                        <span>Select end time</span>
                      </span>
                    </span>
                  )
                ) : (
                  <span className="flex items-center">
                    <span className="basis-1/2">Start time</span>
                    <span className="flex-1 flex items-center gap-2">
                      <ArrowUpAzIcon />
                      <span>End time</span>
                    </span>
                  </span>
                )}
              </span>
              {rightIcon}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="max-h-60 overflow-y-auto">
            <div className="p-2 bg-primary-50 text-sm font-medium text-gray-600 sticky top-0">
              {!isSelectingTo ? "Select start time" : "Select end time"}
            </div>
            {timeOptions.map((time, index) => {
              const isDisabled = isSelectingTo &&
                timeOptions.indexOf(time) <= timeOptions.indexOf(timeRange.from);

              return (
                <div
                  key={time}
                  className={cn(
                    "px-4 py-2 text-sm cursor-pointer",
                    isDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-50",
                    timeRange.from === time && "bg-primary-50 text-primary-700",
                    timeRange.to === time && "bg-primary-100 text-primary-700"
                  )}
                  onClick={() => !isDisabled && handleTimeClick(time)}
                >
                  {time}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
    </div>
  );
};