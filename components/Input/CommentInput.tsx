import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

type CommentInputProps = {
  label?: ReactNode;
  errorMessage?: string | false;
  className?: string;
  leftIcon?: ReactNode;
  leftIconClassName?: string;
  onLeftIconClick?: () => void;
  buttonCaption?: string;
  onButtonClick?: () => void;
  isLoading?: boolean;
} & React.ComponentProps<'input'>;

export const CommentInput = ({
  label,
  errorMessage,
  className,
  leftIcon,
  leftIconClassName,
  onLeftIconClick,
  buttonCaption,
  onButtonClick,
  isLoading,
  ...rest
}: CommentInputProps) => {
  return (
    <div className="leading-3">
      {label && (
        <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
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
            "outline-none focus:ring-0 ring-primary-700 border-primary-100 border-2 rounded py-3 text-gray-800 text-sm text-wrap w-full disabled:cursor-not-allowed placeholder:text-gray-400 placeholder:normal-case",
            leftIcon ? "pl-10" : "pl-3", // Padding for left icon
            "pr-32", // Add padding to the right to accommodate the button
            errorMessage ? "bg-red-100" : "bg-gray-100",
            className
          )}
          {...rest}
        />
        {buttonCaption && (
          <button
            type="button"
            onClick={onButtonClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-8 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-full border-l border-primary-100"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : buttonCaption}
          </button>
        )}
        {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
      </div>
    </div>
  );
};