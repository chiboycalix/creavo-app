"use client";
import React from 'react';
import { Input } from '@/components/Input';
import { SelectInput } from '@/components/Input/SelectInput';
import { TextareaInput } from '@/components/Input/TextareaInput';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TrueOrFalseProps {
  questionNumber: number;
  title: string;
  setTitle: (title: string) => void;
  questionText: string;
  setQuestionText: (text: string) => void;
  correctAnswer: "true" | "false" | "";
  setCorrectAnswer: (answer: "true" | "false" | "") => void;
  allocatedPoint: number;
  setAllocatedPoint: (point: number) => void;
}

const TrueOrFalse = ({
  questionNumber,
  title,
  setTitle,
  questionText,
  setQuestionText,
  correctAnswer,
  setCorrectAnswer,
  allocatedPoint,
  setAllocatedPoint,
}: TrueOrFalseProps) => {
  return (
    <div>
      <div>
        <Input
          placeholder=""
          label="Add Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="bg-gray-100 mt-6 p-2 pt-4 rounded-md">
        <div className="mb-2">
          <p className="font-semibold text-sm">Question {questionNumber}</p>
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