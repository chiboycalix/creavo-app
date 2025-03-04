"use client"
import { ChevronDown } from "lucide-react";
import { useState, useRef, ReactNode, ChangeEvent } from "react";
import { cn } from "@/lib/utils";

type SelectInputProps = {
  label?: ReactNode;
  errorMessage?: string | false;
  className?: string;
  options?: { label: any; value: any }[];
  onSelect?: (value: string | string[]) => void;
  leftIcon?: ReactNode;
  leftIconClassName?: string;
  dropdownClass?: string;
  dropdownItemClass?: string;
  selectTextClass?: string;
  selectSize?: "small" | "large";
  value?: any | any[];
  onChange?: (value: any | any[]) => void;
  searchable?: boolean;
  multiSelect?: boolean;
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
  searchable = false,
  multiSelect = false,
}: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] = useState<any[]>(Array.isArray(value) ? value : value ? [value] : []);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelection = (optionValue: any) => {
    let newSelectedValues: any[];

    if (multiSelect) {
      if (selectedValues.includes(optionValue)) {
        newSelectedValues = selectedValues.filter(v => v !== optionValue);
      } else {
        newSelectedValues = [...selectedValues, optionValue];
      }
    } else {
      newSelectedValues = [optionValue];
      setIsOpen(false);
    }

    setSelectedValues(newSelectedValues);
    onSelect?.(multiSelect ? newSelectedValues : newSelectedValues[0]);
    onChange?.(multiSelect ? newSelectedValues : newSelectedValues[0]);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return "Select option";
    if (!multiSelect) return options.find(opt => opt.value === selectedValues[0])?.label || "Select option";
    return `${selectedValues.length} selected`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative cursor-pointer bg-primary-50/25 rounded border-2 border-primary-100",
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
              {getDisplayText()}
            </span>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </div>
          {isOpen && (
            <div className={cn(
              "absolute w-full top-full left-0 right-0 mt-2 bg-white border border-primary-100 rounded-lg shadow-lg z-50",
              dropdownClass
            )}>
              {searchable && (
                <div className="p-2 border-b border-primary-100">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary-200"
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              )}
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-2",
                      selectedValues.includes(option.value) && "bg-primary-50/25",
                      dropdownItemClass
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelection(option.value);
                    }}
                  >
                    {multiSelect && (
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(option.value)}
                        onChange={() => { }}
                        className={cn(
                          "w-4 h-4 rounded border-primary-200",
                          "text-primary-600 focus:ring-primary-200",
                          "bg-white checked:bg-primary-600"
                        )}
                        onClick={e => e.stopPropagation()}
                      />
                    )}
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
    </div>
  );
};