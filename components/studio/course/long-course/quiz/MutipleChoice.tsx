"use client";
import React from 'react';
import { Input } from '@/components/Input';
import { SelectInput } from '@/components/Input/SelectInput';
import { TextareaInput } from '@/components/Input/TextareaInput';
import { QuizOptionInput } from '@/components/Input/QuizOptionInput';

interface MutipleChoiceProps {
  questionNumber: number;
  title: string;
  setTitle: (title: string) => void;
  questionText: string;
  setQuestionText: (text: string) => void;
  optionValues: string[];
  setOptionValues: (values: string[]) => void;
  selectedOptions: number[];
  setSelectedOptions: (options: number[]) => void;
  allocatedPoint: number;
  setAllocatedPoint: (point: number) => void;
}

const MutipleChoice = ({
  questionNumber,
  title,
  setTitle,
  questionText,
  setQuestionText,
  optionValues,
  setOptionValues,
  selectedOptions,
  setSelectedOptions,
  allocatedPoint,
  setAllocatedPoint,
}: MutipleChoiceProps) => {
  return (
    <div className="w-full">
      <div>
        <Input
          placeholder=""
          label="Add Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className=""
        />
      </div>

      <div className="bg-gray-100 mt-6 p-2 pt-4 rounded-md w-full">
        <div className="mb-2">
          <p className="font-semibold text-sm">Question {questionNumber}</p>
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
            selectedOptions={selectedOptions}
            onSelectionChange={setSelectedOptions}
            placeholder="Enter option text"
          />
        </div>
      </div>
    </div>
  );
};

export default MutipleChoice;