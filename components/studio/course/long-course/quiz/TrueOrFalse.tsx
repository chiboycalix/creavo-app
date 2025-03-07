"use client";
import React from 'react';
import { SelectInput } from '@/components/Input/SelectInput';
import { TextareaInput } from '@/components/Input/TextareaInput';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash } from 'lucide-react';

interface TrueOrFalseProps {
  questionNumber: number;
  questionText: string;
  setQuestionText: (text: string) => void;
  correctAnswer: "true" | "false" | "";
  setCorrectAnswer: (answer: "true" | "false" | "") => void;
  allocatedPoint: number;
  setAllocatedPoint: (point: number) => void;
  onDelete: () => void; // Callback to delete this question
}

const TrueOrFalse = ({
  questionNumber,
  questionText,
  setQuestionText,
  correctAnswer,
  setCorrectAnswer,
  allocatedPoint,
  setAllocatedPoint,
  onDelete,
}: TrueOrFalseProps) => {
  return (
    <div>
      <div className="bg-gray-100 mt-6 p-2 pt-4 rounded-md">
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
              className="bg-white w-full"
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
              className="bg-white w-full"
              onChange={(value) => setAllocatedPoint(Number(value))}
              value={allocatedPoint}
            />
          </div>
        </div>

        <div className="mt-6">
          <RadioGroup
            value={correctAnswer}
            onValueChange={(value) => setCorrectAnswer(value as "true" | "false")}
          >
            <div className="flex items-center space-x-2 bg-white p-4 rounded-md">
              <RadioGroupItem value="true" id={`r2-${questionNumber}`} />
              <Label htmlFor={`r2-${questionNumber}`}>True</Label>
            </div>
            <div className="flex items-center space-x-2 bg-white p-4 rounded-md">
              <RadioGroupItem value="false" id={`r3-${questionNumber}`} />
              <Label htmlFor={`r3-${questionNumber}`}>False</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default TrueOrFalse;