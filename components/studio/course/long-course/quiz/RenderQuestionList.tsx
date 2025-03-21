import QuizSkeletonLoader from '@/components/sketetons/QuizSkeletonLoader';
import React from 'react'
import { Button } from '@/components/ui/button';
import { generalHelpers } from '@/helpers';
import { fetchQuizService } from '@/services/quiz.service';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Clipboard, Pencil } from 'lucide-react';

const RenderQuestionList = ({ setIsAddingQuiz, setQuestions, setQuestionData, setEditingQuestionIndex, selectedModule, setQuizTitle }: any) => {

  const { data: quiz, isFetching: isFetchingQuiz } = useQuery<any>({
    queryKey: ["quizData", selectedModule?.id],
    queryFn: async () => {
      const data = await fetchQuizService({
        moduleId: selectedModule?.id,
      });
      return data;
    },
    enabled: !!selectedModule?.id,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });

  if (isFetchingQuiz) {
    return <QuizSkeletonLoader />
  }

  if (quiz?.questions?.length === undefined) {
    return (
      <>
        <div className="h-full text-sm mb-4 flex flex-col justify-center items-center mt-10">
          <Clipboard size={48} />
          <p className="text-xl font-regular mt-4 font-semibold">No Questions Available</p>
          <p className="text-sm text-gray-500 mt-2">Add questions to create a quiz!</p>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <Button onClick={() => { setIsAddingQuiz(true); setEditingQuestionIndex(null); }} type="button">
            Add Quiz
          </Button>
        </div>
      </>
    );
  }

  const formmattedQuestions = quiz?.questions?.map((question: any, index: number) => {
    return {
      type: question?.type === "MCQ" ? "multipleChoice" : "trueFalse",
      questionNumber: index + 1,
      questionText: question?.text,
      optionValues: question?.options?.map((option: { text: string }) => option?.text),
      selectedOption: generalHelpers.findCorrectOptionIndex(question?.options),
      correctAnswer: question?.correctAnswer,
      allocatedPoint: question?.allocatedPoint,
    }
  })

  return (
    <>
      <div className="space-y-4">
        {formmattedQuestions?.map((question: any, index: number) => (
          <div
            key={index}
            className="p-4 border rounded-md hover:bg-gray-50 flex justify-between items-start"
          >
            <div>
              <p className="font-semibold">Question {question.questionNumber}: {question.questionText}</p>
              {question.type === "multipleChoice" ? (
                <ul className="list-disc pl-5 text-sm text-gray-500 mt-2">
                  {question.optionValues.map((option: any, optIndex: number) => (
                    <li key={optIndex} className={optIndex === question.selectedOption ? "text-green-600" : ""}>
                      {option} {optIndex === question.selectedOption ? "(Correct)" : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  Correct Answer: {question.correctAnswer === "true" ? "True" : "False"}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">Points: {question.allocatedPoint}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAddingQuiz(true);
                setQuestions([question]);
                setQuizTitle(quiz?.quiz?.title)
                setQuestionData([{
                  questionText: question.questionText,
                  optionValues: question.optionValues,
                  selectedOption: question.selectedOption,
                  correctAnswer: question.correctAnswer as "" | "true" | "false",
                  allocatedPoint: question.allocatedPoint,
                }]);
                setEditingQuestionIndex(index);
              }}
            >
              <Pencil size={16} />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}

export default RenderQuestionList