"use client";
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/Input';

interface QuizOptionInputProps {
  optionCount: number;
  values: string[];
  onValuesChange: (values: string[]) => void;
  selectedOption: number | null;
  onSelectionChange: (option: number | null) => void;
  placeholder?: string;
}

const QuizOptionInput = ({
  optionCount,
  values,
  onValuesChange,
  selectedOption,
  onSelectionChange,
  placeholder = "Enter option text",
}: QuizOptionInputProps) => {
  const handleOptionChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onValuesChange(newValues);
  };

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <RadioGroup
      value={selectedOption !== null ? selectedOption.toString() : undefined}
      onValueChange={(value) => onSelectionChange(Number(value))}
      className="space-y-2"
    >
      {Array.from({ length: optionCount }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <RadioGroupItem
            value={index.toString()}
            id={`option-${index}`}
            className="flex-shrink-0"
          />
          <Label
            htmlFor={`option-${index}`}
            className="text-gray-700 font-medium w-4 flex-shrink-0"
          >
            {optionLabels[index]}
          </Label>
          <Input
            value={values[index] || ""}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={placeholder}
            className="w-full py-3 border-none rounded-lg bg-white"
          />
        </div>
      ))}
    </RadioGroup>
  );
};

export default QuizOptionInput;