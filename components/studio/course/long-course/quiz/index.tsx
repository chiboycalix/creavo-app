"use client";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Spinner from '@/components/Spinner';
import TrueOrFalse from './TrueOrFalse';
import MutipleChoice from './MutipleChoice';
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from 'next/navigation';
import { Clipboard, GripVertical, Loader2 } from 'lucide-react';
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

  const { data: courseData, isFetching: isFetchingCourse } = useFetchCourseData(courseId || id as any);

  const updateSelectedModule = useCallback(
    (payload: Partial<any>) => dispatch(updateSelectedModuleData(payload)),
    [dispatch]
  );

  const handleClickModule = useCallback(
    (module: any) => {
      setSelectedModule(module);
      setQuestions([]);
      setQuestionData([]);
      setQuizTitle("");
      setQuizData({
        moduleId: module.id || 1,
        title: "",
        description: "",
        allocatedTime: 30,
        totalPoint: 0,
        questions: [],
      });
      setShowQuestionOptions(false);
      setTitleError(null);
      if (!courseId) {
        router.push(`?tab=quiz&module=${generalHelpers.convertToSlug(module.title)}`);
      } else {
        router.push(`?tab=quiz&edit=${courseId}&module=${generalHelpers.convertToSlug(module.title)}`);
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
      ? `?tab=quiz&edit=${courseId}&module=${generalHelpers.convertToSlug(initialModule.title)}`
      : `?tab=quiz&module=${generalHelpers.convertToSlug(initialModule.title)}`;
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
      const isActive =
        generalHelpers.convertFromSlug(currentModule || courseData?.data?.course?.modules[0]?.title) ===
        generalHelpers.capitalizeWords(module.title);

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
      totalPoint,
    };
    console.log({ finalQuizData });
    handleAddQuizToModule({
      ...finalQuizData,
    });
    setTitleError(null);
  };

  const { data: moduleQuizData, isLoading: isModulesLoading } = useQuery<any>({
    queryKey: ["fetchQuiz"],
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

  // Check if all questions are completely filled
  const areQuestionsComplete = () => {
    return questionData.every((data, index) => {
      const question = questions[index];
      if (question.type === "trueFalse") {
        // True/False: questionText must be non-empty and correctAnswer must be "true" or "false"
        return data.questionText.trim() && (data.correctAnswer === "true" || data.correctAnswer === "false");
      } else {
        // Multiple Choice: questionText must be non-empty, all optionValues must be non-empty, and selectedOption must be set
        return (
          data.questionText.trim() &&
          data.optionValues.every((opt) => opt.trim()) &&
          data.selectedOption !== null
        );
      }
    });
  };

  const isSubmitDisabled =
    !quizTitle.trim() || questions.length === 0 || !areQuestionsComplete() || isAddingModule;

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
            <form onSubmit={handleQuizSubmit}>
              <div>
                <div className="mb-4">
                  <p className="font-semibold text-sm">{generalHelpers?.convertFromSlug(currentModule! || "")}</p>
                </div>
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
              </div>
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
              </div>
            </form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Quiz;