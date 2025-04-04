import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type TextInputProps = {
  label?: ReactNode;
  errorMessage?: string | false;
  className?: string;
  icon?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftIconClassName?: string;
  rightIconClassName?: string;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  maxLength?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isClickable?: boolean; // New prop to make input clickable
  onClick?: () => void;  // New prop for click handler
} & React.ComponentProps<'input'>;

export const TextInput = ({
  label,
  errorMessage,
  className,
  icon,
  leftIcon,
  rightIcon,
  leftIconClassName,
  rightIconClassName,
  onLeftIconClick,
  onRightIconClick,
  maxLength,
  value = "",
  onChange,
  isClickable = false, // Default to false
  onClick,
  ...rest
}: TextInputProps) => {
  const remainingChars = maxLength ? maxLength - value.length : null;

  return (
    <div className="leading-3 w-full">
      {label && (
        <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div
            className={cn("absolute inset-y-0 left-0 pl-3 flex items-center", leftIconClassName)}
            onClick={onLeftIconClick}
          >
            {icon}
          </div>
        )}
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
            (icon || leftIcon) ? "pl-10" : "pl-3",
            rightIcon ? "pr-10" : "pr-3",
            errorMessage ? "bg-red-100" : "bg-primary-50/25",
            isClickable && "cursor-pointer", // Add pointer cursor when clickable
            className
          )}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          onClick={isClickable ? onClick : undefined} // Only attach onClick when isClickable is true
          readOnly={isClickable} // Prevent typing when clickable
          {...rest}
        />
        {rightIcon && (
          <div
            className={cn("absolute inset-y-0 right-0 pr-3 flex items-center", rightIconClassName)}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        )}
        {maxLength !== undefined && (
          <div className="absolute right-2 bottom-2 text-xs text-gray-500">
            {remainingChars} characters remaining
          </div>
        )}
      </div>
      {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
    </div>
  );
};