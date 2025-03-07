"use client";
import React from 'react';
import { SelectInput } from '@/components/Input/SelectInput';
import { TextareaInput } from '@/components/Input/TextareaInput';
import QuizOptionInput from '@/components/Input/QuizOptionInput';
import { Trash } from 'lucide-react';

interface MutipleChoiceProps {
  questionNumber: number;
  questionText: string;
  setQuestionText: (text: string) => void;
  optionValues: string[];
  setOptionValues: (values: string[]) => void;
  selectedOption: number | null; // Single selected option index
  setSelectedOption: (option: number | null) => void;
  allocatedPoint: number;
  setAllocatedPoint: (point: number) => void;
  onDelete: () => void;
}

const MutipleChoice = ({
  questionNumber,
  questionText,
  setQuestionText,
  optionValues,
  setOptionValues,
  selectedOption,
  setSelectedOption,
  allocatedPoint,
  setAllocatedPoint,
  onDelete,
}: MutipleChoiceProps) => {
  return (
    <div className="w-full">
      <div className="bg-gray-100 mt-6 p-2 pt-4 rounded-md w-full">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-semibold text-sm">Question {questionNumber}</p>
          <Trash
            className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700"
            onClick={onDelete}
          />
        </div>
        <div className="flex items-start gap-2">
          <div className="basis-9/12">
            <TextareaInput
              placeholder="Enter your question here"
              className="bg-white w-full border-none"
              resize="none"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <SelectInput
              options={[
                { value: 1, label: "1 Point" },
                { value: 2, label: "2 Points" },
                { value: 3, label: "3 Points" },
                { value: 4, label: "4 Points" },
                { value: 5, label: "5 Points" },
              ]}
              className="bg-white w-full border-none"
              onChange={(value) => setAllocatedPoint(Number(value))}
              value={allocatedPoint}
            />
          </div>
        </div>

        <div className="mt-3 w-full">
          <QuizOptionInput
            optionCount={4}
            values={optionValues}
            onValuesChange={setOptionValues}
            selectedOption={selectedOption}
            onSelectionChange={setSelectedOption}
            placeholder="Enter option text"
          />
        </div>
      </div>
    </div>
  );
};

export default MutipleChoice;