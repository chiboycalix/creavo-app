"use client";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type TimePickerInputProps = {
  label?: ReactNode;
  errorMessage?: string | false;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftIconClassName?: string;
  rightIconClassName?: string;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  onTimeSelect?: (time: string | undefined) => void;
  selectedTime?: string;
};

const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour % 12 || 12;
      const period = hour < 12 ? "AM" : "PM";
      const formattedMinute = minute.toString().padStart(2, "0");
      times.push(`${formattedHour}:${formattedMinute} ${period}`);
    }
  }
  return times;
};

export const TimePickerInput = ({
  label,
  errorMessage,
  className,
  leftIcon,
  rightIcon,
  leftIconClassName,
  rightIconClassName,
  onLeftIconClick,
  onRightIconClick,
  onTimeSelect,
  selectedTime,
}: TimePickerInputProps) => {
  const [time, setTime] = useState<string>(selectedTime || "");
  const [isOpen, setIsOpen] = useState(false);
  const timeOptions = generateTimeOptions();

  const handleTimeClick = (selected: string) => {
    setTime(selected);
    if (onTimeSelect) onTimeSelect(selected);
    setIsOpen(false);
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
          <button
            type="button"
            className={cn(
              "relative cursor-pointer bg-white rounded-lg border-2 border-primary-100 py-3 w-full text-left",
              leftIcon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              errorMessage && "bg-red-100",
              className
            )}
          >
            <div className="flex items-center justify-between">
              {leftIcon || <CalendarIcon className="w-5 h-5 text-gray-500 mr-2" />}
              <span className={cn("text-sm flex-1", !time && "text-gray-400")}>
                {time || "Select time"}
              </span>
              {rightIcon}
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="max-h-60 overflow-y-auto">
            {timeOptions.map((option) => (
              <div
                key={option}
                className={cn(
                  "px-4 py-2 text-sm cursor-pointer hover:bg-gray-50",
                  time === option && "bg-primary-100 text-primary-700"
                )}
                onClick={() => handleTimeClick(option)} // Ensure we're passing a string, not an event
              >
                {option}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
    </div>
  );
};
