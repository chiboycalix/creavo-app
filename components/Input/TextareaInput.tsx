// src/components/TextareaInput.tsx
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type TextareaInputProps = {
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
  maxLength?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
} & React.ComponentProps<"textarea">;

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
  rows = 4,
  maxRows,
  minRows,
  resize = "vertical",
  maxLength,
  value = "",
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
        {(icon || leftIcon) && (
          <div
            className={cn(
              "absolute inset-y-0 left-0 pl-3 flex items-start pt-3",
              leftIconClassName
            )}
            onClick={onLeftIconClick}
          >
            {icon || leftIcon}
          </div>
        )}
        <textarea
          className={cn(
            "outline-none focus:ring-0 border-primary-100 border-2 rounded py-3 text-gray-800 text-sm w-full disabled:cursor-not-allowed placeholder:text-gray-400 placeholder:normal-case",
            (icon || leftIcon) ? "pl-10" : "pl-3",
            rightIcon ? "pr-10" : "pr-3",
            errorMessage ? "bg-red-100" : "bg-primary-50/25",
            resize === "none" && "resize-none",
            resize === "vertical" && "resize-y",
            resize === "horizontal" && "resize-x",
            resize === "both" && "resize",
            className
          )}
          rows={rows}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          {...rest}
        />
        {rightIcon && (
          <div
            className={cn(
              "absolute inset-y-0 right-0 pr-3 flex items-start pt-3",
              rightIconClassName
            )}
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