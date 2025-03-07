import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { TextInput, TextInputProps } from "./TextInput";

export type QuizOptionInputProps = {
  optionCount: number;
  values?: string[];
  onValuesChange?: (values: string[]) => void;
  selectedOptions?: number[];
  onSelectionChange?: (selected: number[]) => void;
  className?: string;
  errorMessage?: string | false;
  label?: ReactNode;
} & Omit<TextInputProps, 'value' | 'onChange' | 'leftIcon' | 'onLeftIconClick'>;

export const QuizOptionInput = ({
  optionCount,
  values = Array(optionCount).fill(""),
  onValuesChange,
  selectedOptions = [],
  onSelectionChange,
  className,
  errorMessage,
  label,
  ...rest
}: QuizOptionInputProps) => {
  const optionLabels = Array.from(
    { length: optionCount },
    (_, i) => String.fromCharCode(65 + i)
  );

  const handleCheckboxChange = (index: number) => {
    const newSelected = selectedOptions.includes(index)
      ? selectedOptions.filter((i) => i !== index)
      : [...selectedOptions, index];
    onSelectionChange?.(newSelected);
  };

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = [...values];
    newValues[index] = e.target.value;
    onValuesChange?.(newValues);
  };

  return (
    <div className={cn("space-y-3 w-full", className)}>
      {label && (
        <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
          {label}
        </label>
      )}
      {optionLabels.map((label, index) => (
        <div key={index} className="relative flex items-center w-full">
          <TextInput
            value={values[index]}
            onChange={(e) => handleInputChange(index, e)}
            leftIcon={
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
                  className="h-4 w-4 text-primary-700 bg-white border-none rounded focus:ring-primary-700"
                />
                <span className="text-gray-900 font-medium">{label}</span>
              </div>
            }
            leftIconClassName="pl-3"
            className={cn(
              "pl-16 w-full bg-white border-none", // Ensure full width
              selectedOptions.includes(index) && "bg-green-50/50 border"
            )}
            errorMessage={errorMessage}
            {...rest}
          />
        </div>
      ))}
      {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
    </div>
  );
};