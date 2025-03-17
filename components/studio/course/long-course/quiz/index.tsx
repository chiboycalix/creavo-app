"use client";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Spinner from '@/components/Spinner';
import TrueOrFalse from './TrueOrFalse';
import MutipleChoice from './MutipleChoice';
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from 'next/navigation';
import { Clipboard, GripVertical, Loader2, Pencil } from 'lucide-react';
import { useFetchCourseData } from '@/hooks/courses/useFetchCourseData';
import { useAppDispatch } from '@/hooks/useStore.hook';
import { updateSelectedModuleData } from '@/redux/slices/module.slice';
import { generalHelpers } from '@/helpers';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/Input';
import { toast } from 'sonner';
import { addQuizToModuleService, fetchQuizService } from '@/services/quiz.service';

type QuestionType = {
  type: "trueFalse" | "multipleChoice";
  questionNumber: number;
};

type QuestionData = {
  questionText: string;
  optionValues: string[];
  selectedOption: number | null;
  correctAnswer: "true" | "false" | "";
  allocatedPoint: number;
};

type QuizData = {
  moduleId: number | null;
  title: string;
  description: string;
  allocatedTime: number;
  totalPoint: number;
  questions: any[];
};

const hardcodedQuestions = [
  {
    type: "multipleChoice" as const,
    questionNumber: 1,
    questionText: "What is the capital of France?",
    optionValues: ["Paris", "London", "Berlin", "Madrid"],
    selectedOption: 0, // Paris is correct
    correctAnswer: "",
    allocatedPoint: 2,
  },
  {
    type: "trueFalse" as const,
    questionNumber: 2,
    questionText: "The Earth is flat.",
    optionValues: [],
    selectedOption: null,
    correctAnswer: "false",
    allocatedPoint: 1,
  },
  {
    type: "multipleChoice" as const,
    questionNumber: 3,
    questionText: "Which planet is the largest?",
    optionValues: ["Earth", "Jupiter", "Mars", "Venus"],
    selectedOption: 1, // Jupiter is correct
    correctAnswer: "",
    allocatedPoint: 3,
  },
];

const Quiz = ({ courseId: id }: { courseId: any }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentModule = searchParams.get("module");
  const courseId = searchParams.get("edit");
  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [questionData, setQuestionData] = useState<QuestionData[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizData, setQuizData] = useState<QuizData>({
    moduleId: null,
    title: "",
    description: "",
    allocatedTime: 0,
    totalPoint: 0,
    questions: [],
  });
  const [showQuestionOptions, setShowQuestionOptions] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  const { data: courseData, isFetching: isFetchingCourse } = useFetchCourseData(courseId || id as any);

  const updateSelectedModule = useCallback(
    (payload: Partial<any>) => dispatch(updateSelectedModuleData(payload)),
    [dispatch]
  );

  const handleClickModule = useCallback((module: any) => {
    setSelectedModule(module);
    setQuestions([]);
    setQuestionData([]);
    setQuizTitle("");
    setQuizData({
      moduleId: module?.id,
      title: "",
      description: "",
      allocatedTime: 30,
      totalPoint: 0,
      questions: [],
    });
    setShowQuestionOptions(false);
    setTitleError(null);
    setIsAddingQuiz(false);
    setEditingQuestionIndex(null);
    if (!courseId) {
      console.log({ module })
      router.push(`?tab=quiz&module=${module?.id}`);
    } else {
      router.push(`?tab=quiz&edit=${courseId}&module=${module?.id}`);
    }
  },
    [courseId, router]
  );

  useEffect(() => {
    if (!courseData?.data?.course?.modules?.length || selectedModule || isFetchingCourse) return;
    const initialModule = courseData?.data?.course.modules[0];
    setSelectedModule(initialModule);
    setQuizData((prev) => ({ ...prev, moduleId: initialModule.id || 1 }));
    const url = courseId
      ? `?tab=quiz&edit=${courseId}&module=${initialModule?.id}`
      : `?tab=quiz&module=${initialModule?.id}`;
    router.push(url);
  }, [courseId, courseData?.data?.course?.modules, router, selectedModule, isFetchingCourse]);

  useEffect(() => {
    if (selectedModule) {
      updateSelectedModule(selectedModule);
    }
  }, [selectedModule, updateSelectedModule]);

  const renderModulesList = useMemo(() => {
    if (isFetchingCourse) return <div className="h-[60vh] flex flex-col items-center justify-center"><Spinner /></div>;
    if (!courseData?.data?.course?.modules?.length) {
      return (
        <div className="h-full text-sm mb-4 flex flex-col justify-center items-center mt-28">
          <Clipboard />
          <p className="text-xl font-regular mt-4 font-semibold">Create module</p>
        </div>
      );
    }

    return courseData?.data?.course.modules.map((module: any, index: number) => {
      const isActive = Number(currentModule) === module?.id

      return (
        <div
          onClick={() => handleClickModule(module)}
          key={module.id}
          className={`w-full flex items-center border cursor-pointer rounded-sm ${isActive ? "border-primary-400" : "border-primary-100"}`}
        >
          <div className="p-3 flex items-center gap-2 text-left text-sm">
            <GripVertical />
            Module {index + 1}:
          </div>
          <div>
            <p className="text-sm">{module.title}</p>
          </div>
        </div>
      );
    });
  }, [courseData?.data?.course?.modules, currentModule, handleClickModule, isFetchingCourse]);

  const addQuestion = (type: "trueFalse" | "multipleChoice") => {
    const newQuestionNumber = questions.length + 1;
    setQuestions((prev) => [...prev, { type, questionNumber: newQuestionNumber }]);
    setQuestionData((prev) => [
      ...prev,
      {
        questionText: "",
        optionValues: type === "multipleChoice" ? ["", "", "", ""] : [],
        selectedOption: null,
        correctAnswer: "",
        allocatedPoint: 1,
      },
    ]);
    setShowQuestionOptions(true);
  };

  const deleteQuestion = (index: number) => {
    setQuestions((prev) => {
      const newQuestions = prev.filter((_, i) => i !== index);
      return newQuestions.map((q, i) => ({ ...q, questionNumber: i + 1 }));
    });
    setQuestionData((prev) => prev.filter((_, i) => i !== index));
  };

  const { mutate: handleAddQuizToModule, isPending: isAddingModule } = useMutation({
    mutationFn: (payload: any) => addQuizToModuleService(payload),
    onSuccess: (quiz) => {
      toast.success("Quiz added successfully");
      setQuestions([]);
      setQuestionData([]);
      setQuizTitle("");
      setShowQuestionOptions(false);
      setIsAddingQuiz(false);
    },
    onError: (error: any) => {
      toast.error(error?.data?.[0] || "Failed to create quiz");
    },
  });

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) {
      setTitleError("Quiz title is required.");
      return;
    }

    const formattedQuestions = questionData.map((data, index) => {
      const question = questions[index];
      if (question.type === "multipleChoice") {
        const options = data.optionValues.map((text, optIndex) => ({
          text,
          isCorrect: data.selectedOption === optIndex,
        }));
        const correctAnswer = data.selectedOption !== null ? data.optionValues[data.selectedOption] : "";
        return {
          text: data.questionText,
          options,
          type: "MCQ",
          correctAnswer,
          allocatedPoint: data.allocatedPoint,
        };
      } else {
        const options = [
          { text: "true", isCorrect: data.correctAnswer === "true" },
          { text: "false", isCorrect: data.correctAnswer === "false" },
        ];
        return {
          text: data.questionText,
          options,
          type: "T/F",
          correctAnswer: data.correctAnswer,
          allocatedPoint: data.allocatedPoint,
        };
      }
    });

    const totalPoint = formattedQuestions.reduce((sum, q) => sum + q.allocatedPoint, 0);
    const finalQuizData = {
      ...quizData,
      title: quizTitle,
      description: quizData.description || "No description provided",
      questions: formattedQuestions,
      retries: 3,
      totalPoint,
    };
    handleAddQuizToModule(finalQuizData);
    setTitleError(null);
  };

  const areQuestionsComplete = () => {
    return questionData.every((data, index) => {
      const question = questions[index];
      if (question.type === "trueFalse") {
        return data.questionText.trim() && (data.correctAnswer === "true" || data.correctAnswer === "false");
      } else {
        return (
          data.questionText.trim() &&
          data.optionValues.every((opt) => opt.trim()) &&
          data.selectedOption !== null
        );
      }
    });
  };

  const { data: quiz, isLoading: isFetchingQuiz } = useQuery<any>({
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

  const isSubmitDisabled = !quizTitle.trim() || questions.length === 0 || !areQuestionsComplete() || isAddingModule;

  const renderQuestions = () => {
    return questions.map((question, index) => (
      <div key={index} className="mb-4">
        {question.type === "trueFalse" ? (
          <TrueOrFalse
            questionNumber={question.questionNumber}
            questionText={questionData[index].questionText}
            setQuestionText={(text) =>
              setQuestionData((prev) =>
                prev.map((q, i) => (i === index ? { ...q, questionText: text } : q))
              )
            }
            correctAnswer={questionData[index].correctAnswer}
            setCorrectAnswer={(answer) =>
              setQuestionData((prev) =>
                prev.map((q, i) => (i === index ? { ...q, correctAnswer: answer } : q))
              )
            }
            allocatedPoint={questionData[index].allocatedPoint}
            setAllocatedPoint={(point) =>
              setQuestionData((prev) =>
                prev.map((q, i) => (i === index ? { ...q, allocatedPoint: point } : q))
              )
            }
            onDelete={() => deleteQuestion(index)}
          />
        ) : (
          <MutipleChoice
            questionNumber={question.questionNumber}
            questionText={questionData[index].questionText}
            setQuestionText={(text) =>
              setQuestionData((prev) =>
                prev.map((q, i) => (i === index ? { ...q, questionText: text } : q))
              )
            }
            optionValues={questionData[index].optionValues}
            setOptionValues={(values) =>
              setQuestionData((prev) =>
                prev.map((q, i) => (i === index ? { ...q, optionValues: values } : q))
              )
            }
            selectedOption={questionData[index].selectedOption}
            setSelectedOption={(option) =>
              setQuestionData((prev) =>
                prev.map((q, i) => (i === index ? { ...q, selectedOption: option } : q))
              )
            }
            allocatedPoint={questionData[index].allocatedPoint}
            setAllocatedPoint={(point) =>
              setQuestionData((prev) =>
                prev.map((q, i) => (i === index ? { ...q, allocatedPoint: point } : q))
              )
            }
            onDelete={() => deleteQuestion(index)}
          />
        )}
      </div>
    ));
  };

  const renderQuestionList = () => {
    if (hardcodedQuestions.length === 0) {
      return (
        <div className="h-full text-sm mb-4 flex flex-col justify-center items-center mt-10">
          <Clipboard size={48} />
          <p className="text-xl font-regular mt-4 font-semibold">No Questions Available</p>
          <p className="text-sm text-gray-500 mt-2">Add questions to create a quiz!</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {hardcodedQuestions.map((question, index) => (
          <div
            key={index}
            className="p-4 border rounded-md hover:bg-gray-50 flex justify-between items-start"
          >
            <div>
              <p className="font-semibold">Question {question.questionNumber}: {question.questionText}</p>
              {question.type === "multipleChoice" ? (
                <ul className="list-disc pl-5 text-sm text-gray-500 mt-2">
                  {question.optionValues.map((option, optIndex) => (
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
    );
  };

  return (
    <div className="flex gap-4 w-full">
      <Card className="basis-4/12 border-none px-1 max-h-[74vh] overflow-y-auto">
        <CardHeader>
          <CardContent className="px-0 min-h-[67vh]">
            <aside className="h-full space-y-2">{renderModulesList}</aside>
          </CardContent>
        </CardHeader>
      </Card>
      <Card className="flex-1 border-none px-0 py-0 max-h-[74vh] overflow-y-auto">
        <CardHeader>
          <CardContent className="px-0 py-0 flex flex-col h-full justify-between">
            <div>
              <div className="mb-4">
                <p className="font-semibold text-sm">{generalHelpers?.convertFromSlug(currentModule! || "")}</p>
              </div>
              {!isAddingQuiz ? (
                <>
                  {renderQuestionList()}
                  <div className="flex gap-4 mt-4">
                    <Button onClick={() => { setIsAddingQuiz(true); setEditingQuestionIndex(null); }} type="button">
                      Add Quiz
                    </Button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleQuizSubmit}>
                  <div className="mb-4">
                    <Input
                      placeholder="Enter quiz title"
                      label="Quiz Title"
                      value={quizTitle}
                      onChange={(e) => {
                        setQuizTitle(e.target.value);
                        if (e.target.value.trim()) setTitleError(null);
                      }}
                      className="w-full"
                    />
                    {titleError && (
                      <p className="text-red-500 text-sm mt-1">{titleError}</p>
                    )}
                  </div>
                  {renderQuestions()}
                  <div className="flex gap-4 mt-4">
                    {showQuestionOptions ? (
                      <>
                        <Button
                          onClick={() => addQuestion("multipleChoice")}
                          variant="outline"
                          type="button"
                        >
                          Multiple Choice
                        </Button>
                        <Button
                          onClick={() => addQuestion("trueFalse")}
                          variant="outline"
                          type="button"
                        >
                          True/False
                        </Button>
                        <Button
                          onClick={() => setShowQuestionOptions(true)}
                          variant="default"
                          type="button"
                        >
                          Add Question
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setShowQuestionOptions(true)} type="button">
                        Add Question
                      </Button>
                    )}
                    <Button type="submit" disabled={isSubmitDisabled}>
                      {isAddingModule ? (
                        <p className="flex items-center gap-2">
                          <Loader2 className="animate-spin" /> Please wait...
                        </p>
                      ) : (
                        "Submit Quiz"
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingQuiz(false);
                        setQuestions([]);
                        setQuestionData([]);
                        setQuizTitle("");
                        setShowQuestionOptions(false);
                        setEditingQuestionIndex(null);
                      }}
                      variant="outline"
                      type="button"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Quiz;