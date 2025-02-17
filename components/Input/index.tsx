import { TextInput } from "./TextInput";
import { PasswordInput } from "./PasswordInput";
import { SelectInput } from "./SelectInput";
import { DatePickerInput } from "./DatePickerInput";
import { DateRangePickerInput } from "./DateRangePickerInput";
import { TimeRange, TimeRangePickerInput } from "./TimeRangePickerInput";
import { TextareaInput } from "./TextareaInput";
import { CommentInput } from "./CommentInput";
import { SearchInput } from "./SearchInput";
import { ReactNode } from "react";

type Props = {
  variant?: "text" | "password" | "search" | "select" | "datePicker" | "dateRangePicker" | "timeRangePicker" | "textarea" | "comment";
  label?: string | ReactNode;
  errorMessage?: string;
  className?: string;
  options?: Array<{ value: string; label: string|ReactNode }>;
  onSelect?: (value: string) => void;
  leftIcon?: React.ReactNode;
  leftIconClassName?: string;
  dropdownClass?: string;
  dropdownItemClass?: string;
  selectTextClass?: string;
  selectSize?: "small" | "large";
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  buttonCaption?: string;
  onButtonClick?: () => void;
  isLoading?: boolean;
  rightIcon?: ReactNode;
  rightIconClassName?: string;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  onTimeRangeSelect?: (range: TimeRange | undefined) => void;
  selectedTimeRange?: TimeRange;

  rows?: number;
  maxRows?: number;
  minRows?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";


} & React.ComponentProps<'input'> & React.ComponentProps<'textarea'>;

export const Input = ({ variant = "text", ...props }: Props) => {
  switch (variant) {
    case "password":
      return <PasswordInput {...props} />;
    case "select":
      const {
        label,
        errorMessage,
        className,
        options,
        onSelect,
        leftIcon,
        leftIconClassName,
        dropdownClass,
        dropdownItemClass,
        selectTextClass,
        selectSize,
        value,
        onChange,
      } = props;
      return (
        <SelectInput
          label={label}
          errorMessage={errorMessage}
          className={className}
          options={options}
          onSelect={onSelect}
          leftIcon={leftIcon}
          leftIconClassName={leftIconClassName}
          dropdownClass={dropdownClass}
          dropdownItemClass={dropdownItemClass}
          selectTextClass={selectTextClass}
          selectSize={selectSize}
          value={value}
          onChange={onChange}
        />
      );
    case "datePicker":
      return <DatePickerInput {...props} />;
    case "dateRangePicker":
      return <DateRangePickerInput {...props} />;
    case "timeRangePicker":
      const { onTimeRangeSelect } = props;
      return <TimeRangePickerInput {...props} onTimeRangeSelect={onTimeRangeSelect} />;
    case "textarea":
      return <TextareaInput {...props} />;
    case "comment":
      const { buttonCaption, onButtonClick, isLoading } = props;
      return <CommentInput
        {...props}
        buttonCaption={buttonCaption}
        onButtonClick={onButtonClick}
        isLoading={isLoading}
      />;
    case "search":
      return <SearchInput {...props} />;
    case "text":
    default:
      return <TextInput {...props} />;
  }
};