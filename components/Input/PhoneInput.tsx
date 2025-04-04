import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { TextInput } from "./TextInput";

// Country code options (you can expand this list)
const countryCodes = [
  { code: "+1", name: "United States" },
  { code: "+234", name: "Nigeria" },
  { code: "+44", name: "United Kingdom" },
  { code: "+91", name: "India" },
  // Add more country codes as needed
];

export type PhoneInputProps = {
  label?: ReactNode;
  errorMessage?: string | false;
  className?: string;
  value?: string; // The phone number value
  onChange?: (phone: string, countryCode: string) => void; // Updated to handle both phone and country code
  maxLength?: number; // Max length for the phone number
  selectedCountryCode?: string; // Controlled country code
  onCountryCodeChange?: (code: string) => void; // Handle country code change
} & Omit<React.ComponentProps<"input">, "onChange" | "value">;

export const PhoneInput = ({
  label,
  errorMessage,
  className,
  value = "",
  onChange,
  maxLength = 10,
  selectedCountryCode = "+234",
  onCountryCodeChange,
  ...rest
}: PhoneInputProps) => {
  const [countryCode, setCountryCode] = useState(selectedCountryCode);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    if (onChange) {
      onChange(newPhone, countryCode);
    }
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountryCode = e.target.value;
    setCountryCode(newCountryCode);
    if (onCountryCodeChange) {
      onCountryCodeChange(newCountryCode);
    }
    if (onChange) {
      onChange(value, newCountryCode);
    }
  };

  const remainingChars = maxLength ? maxLength - value.length : null;

  return (
    <div className="leading-3 w-full">
      {label && (
        <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {/* Country Code Dropdown */}
        <select
          value={countryCode}
          onChange={handleCountryCodeChange}
          className="border-2 border-primary-100 bg-white rounded-l-md py-3 px-1 text-gray-800 text-sm bg-primary-50/25 outline-none focus:ring-0"
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>
              {country.code}
            </option>
          ))}
        </select>

        {/* Phone Number Input */}
        <TextInput
          value={value}
          onChange={handlePhoneChange}
          maxLength={maxLength}
          className={cn("rounded-l-none border-l-0", className)}
          placeholder="Phone No."
          {...rest}
          onClick={undefined} // Ensure onClick matches the expected type or is omitted
        />

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