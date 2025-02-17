"use client"
import { ChevronDown } from "lucide-react";
import { useState, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SelectInputProps = {
  label?: ReactNode;
  errorMessage?: string | false;
  className?: string;
  options?: { label: any; value: any }[];
  onSelect?: (value: string) => void; // Explicitly define the type
  leftIcon?: ReactNode;
  leftIconClassName?: string;
  dropdownClass?: string;
  dropdownItemClass?: string;
  selectTextClass?: string;
  selectSize?: "small" | "large";
  value?: any; // Add value prop to handle controlled input
  onChange?: (value: any) => void; // Add onChange prop to handle controlled input
};

export const SelectInput = ({
  label,
  errorMessage,
  className,
  options = [],
  onSelect,
  leftIcon,
  leftIconClassName,
  dropdownClass,
  dropdownItemClass,
  selectTextClass,
  selectSize = "large",
  value,
  onChange,
}: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative cursor-pointer bg-primary-50 rounded border-2 border-primary-100",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
          <div className={cn(
            "flex items-center justify-between w-full py-1",
            leftIcon ? "pl-10" : "pl-3",
            selectSize === "small" ? "py-1" : "py-3",
            "pr-3"
          )}>
            {leftIcon && (
              <div className={cn("absolute inset-y-0 left-0 pl-3 flex items-center", leftIconClassName)}>
                {leftIcon}
              </div>
            )}
            <span className={cn("text-gray-600 text-sm", selectTextClass)}>
              {selectedLabel || "Select option"}
            </span>
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-200" />
          </div>
          {isOpen && (
            <div className={cn(
              "absolute w-full top-full left-0 right-0 mt-2 bg-white border border-primary-100 rounded-lg shadow-lg z-50",
              dropdownClass
            )}>
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm",
                    value === option.value && "bg-primary-50",
                    dropdownItemClass
                  )}
                  onClick={() => {
                    setSelectedLabel(option.label);
                    onSelect?.(option.value);
                    onChange?.(option.value); // Call onChange if provided
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
    </div>
  );
};