import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Textarea } from "../ui/textarea"; // Assuming Textarea is a custom component

type TextareaInputProps = {
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
  rows?: number;
  maxRows?: number;
  minRows?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
  maxLength?: number; // Add maxLength prop
  value?: string; // Ensure value is controlled
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // Ensure onChange is typed correctly
} & React.ComponentProps<'textarea'>;

export const TextareaInput = ({
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
  rows,
  maxRows,
  minRows,
  resize = "vertical",
  maxLength,
  value = "", // Default to empty string
  onChange,
  ...rest
}: TextareaInputProps) => {
  const remainingChars = maxLength ? maxLength - value.length : null;

  return (
    <div className="leading-3">
      {label && (
        <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div
            className={cn("absolute left-0 top-3 pl-3", leftIconClassName)}
            onClick={onLeftIconClick}
          >
            {icon}
          </div>
        )}
        {leftIcon && (
          <div
            className={cn("absolute left-0 top-3 pl-3", leftIconClassName)}
            onClick={onLeftIconClick}
          >
            {leftIcon}
          </div>
        )}
        <Textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-primary-100 bg-primary-50 px-3 py-2 text-base",
            "placeholder:text-neutral-500 focus-visible:outline-none outline-none focus-visible:border-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "md:text-sm outline-none focus:ring-0 ring-primary-700 border-primary-100 border-2",
            (icon || leftIcon) && "pl-10",
            rightIcon && "pr-10",
            errorMessage && "border-red-500 focus-visible:ring-red-500",
            resize === "none" && "resize-none",
            resize === "vertical" && "resize-y",
            resize === "horizontal" && "resize-x",
            resize === "both" && "resize",
            className
          )}
          rows={rows}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          {...rest}
        />
        {rightIcon && (
          <div
            className={cn("absolute right-0 top-3 pr-3", rightIconClassName)}
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
      {errorMessage && <small className="text-red-600 text-sm mt-1">{errorMessage}</small>}
    </div>
  );
};