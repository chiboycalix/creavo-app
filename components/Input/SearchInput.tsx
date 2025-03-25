"use client"
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { ReactNode } from "react";

type SearchInputProps = {
  label?: ReactNode;
  errorMessage?: string | false;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftIconClassName?: string;
  rightIconClassName?: string;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
} & React.ComponentProps<'input'>;

export const SearchInput = ({
  label,
  errorMessage,
  className,
  leftIcon,
  rightIcon,
  leftIconClassName,
  rightIconClassName,
  onLeftIconClick,
  onRightIconClick,
  ...rest
}: SearchInputProps) => {
  return (
    <div className="leading-3 w-full">
      {label && (
        <label className="flex items-center text-gray-500 font-medium text-sm gap-x-2 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div
            className={cn("absolute inset-y-0 left-0 pl-3 flex items-center", leftIconClassName)}
            onClick={onLeftIconClick}
          >
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            "outline-none focus:ring-0 ring-primary-700 border-primary-100 border-2 rounded-lg py-3 text-gray-800 text-sm text-wrap w-full disabled:cursor-not-allowed placeholder:text-gray-400 placeholder:normal-case",
            leftIcon ? "pl-10" : "pl-3",
            rightIcon ? "pr-10" : "pr-3",
            errorMessage ? "bg-red-100" : "bg-primary-50/25",
            "bg-primary-50/25rounded-lg",
            className
          )}
          {...rest}
        />
        {rightIcon || (
          <div
            className={cn("absolute inset-y-0 right-0 pr-3 flex items-center", rightIconClassName)}
            onClick={onRightIconClick}
          >
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
    </div>
  );
};