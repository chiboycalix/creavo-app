"use client";
import React, { useCallback, useEffect, useState } from 'react';
import RenderQuestions from './RenderQuestions';
import RenderQuestionList from './RenderQuestionList';
import ModulesList from './ModulesList';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Pen } from 'lucide-react';
import { useFetchCourseData } from '@/hooks/courses/useFetchCourseData';
import { useAppDispatch } from '@/hooks/useStore.hook';
import { updateSelectedModuleData } from '@/redux/slices/module.slice';
import { generalHelpers } from '@/helpers';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/Input';
import { toast } from 'sonner';
import { addQuizToModuleService, updateQuizQuestionService } from '@/services/quiz.service';
import { QuestionData, QuestionType, QuizData } from '@/types';
import { RouterSpinner } from '@/components/Loaders/RouterSpinner';

const Quiz = ({ courseId: id }: { courseId: any }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient(); // Use queryClient for invalidation
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
      setIsAddingQuiz(false);
      setEditingQuestionIndex(null);
      const url = courseId
        ? `?tab=quiz&edit=${courseId}&module=${generalHelpers.convertToSlug(module.title)}`
        : `?tab=quiz&module=${generalHelpers.convertToSlug(module.title)}`;
      router.push(url);
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

  const addQuestion = (type: "trueFalse" | "multipleChoice") => {
    const newQuestionNumber = questions.length + 1;
    setQuestions((prev) => [...prev, { type, questionNumber: newQuestionNumber }]);
    setQuestionData((prev) => [
      ...prev,
      {
        questionText: "",
        optionValues: type === "multipleChoice" ? ["", "", "", ""] : [],
        selectedOption: null,
        correctAnswer: "" as "" | "true" | "false",
        allocatedPoint: 1,
        questionId: "",
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
    onSuccess: () => {
      toast.success("Quiz added successfully");
      setQuestions([]);
      setQuestionData([]);
      setQuizTitle("");
      setShowQuestionOptions(false);
      setIsAddingQuiz(false);
      queryClient.invalidateQueries({ queryKey: ["quizData", selectedModule?.id] }); // Invalidate quiz data
    },
    onError: (error: any) => {
      toast.error(error?.data?.[0] || "Failed to create quiz");
    },
  });

  const { mutate: handleUpdateQuizQuestion, isPending: isUpdatingQuizQuestion } = useMutation({
    mutationFn: (payload: any) => updateQuizQuestionService(payload),
    onSuccess: () => {
      toast.success("Question updated successfully");
      setQuestions([]);
      setQuestionData([]);
      setQuizTitle("");
      setShowQuestionOptions(false);
      setIsAddingQuiz(false);
      setEditingQuestionIndex(null);
      queryClient.invalidateQueries({ queryKey: ["quizData", selectedModule?.id] }); // Invalidate quiz data
    },
    onError: (error: any) => {
      toast.error(error?.data?.[0] || "Failed to update quiz question");
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

  const handleSubmitChanges = async () => {
    const formattedQuestions = questionData.map((data, index) => {
      const question = questions[index];
      if (question.type === "multipleChoice") {
        const options = data.optionValues.map((text, optIndex) => ({
          text,
          isCorrect: data.selectedOption === optIndex,
        }));
        const correctAnswer = data.selectedOption !== null ? data.optionValues[data.selectedOption] : "";
        return {
          questionId: data?.questionId,
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
          questionId: data?.questionId,
          text: data.questionText,
          options,
          type: "T/F",
          correctAnswer: data.correctAnswer,
          allocatedPoint: data.allocatedPoint,
        };
      }
    });
    const finalQuizData = {
      courseId: courseId || id,
      text: formattedQuestions[0]?.text,
      allocatedPoint: formattedQuestions[0]?.allocatedPoint,
      type: formattedQuestions[0]?.type,
      options: formattedQuestions[0].options,
      correctAnswer: formattedQuestions[0]?.correctAnswer,
      questionId: formattedQuestions[0]?.questionId,
    };
    handleUpdateQuizQuestion({ ...finalQuizData });
  };

  if (isUpdatingQuizQuestion) {
    return <RouterSpinner />;
  }

  const isSubmitDisabled =
    !quizTitle.trim() || questions.length === 0 || !areQuestionsComplete() || isAddingModule;

  return (
    <div className="flex gap-4 w-full">
      <Card className="basis-4/12 border-none px-1 max-h-[74vh] overflow-y-auto">
        <CardHeader>
          <CardContent className="px-0 min-h-[67vh]">
            <aside className="h-full space-y-2">
              <ModulesList
                isFetchingCourse={isFetchingCourse}
                courseData={courseData}
                currentModule={currentModule}
                handleClickModule={handleClickModule}
              />
            </aside>
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
                <RenderQuestionList
                  setIsAddingQuiz={setIsAddingQuiz}
                  setQuestions={setQuestions}
                  setQuestionData={setQuestionData}
                  setEditingQuestionIndex={setEditingQuestionIndex}
                  selectedModule={selectedModule}
                  setQuizTitle={setQuizTitle}
                />
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
                  {questions?.map((question, index) => (
                    <div key={index} className="mb-4">
                      <RenderQuestions
                        question={question}
                        setQuestionData={setQuestionData}
                        questionData={questionData}
                        index={index}
                        deleteQuestion={deleteQuestion}
                      />
                    </div>
                  ))}
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
                    {editingQuestionIndex !== null && (
                      <Button
                        onClick={() => {
                          setEditingQuestionIndex(null);
                          setQuestions([]);
                          setQuestionData([]);
                          setQuizTitle("");
                          setShowQuestionOptions(false);
                          setIsAddingQuiz(false);
                          setEditingQuestionIndex(null);
                          handleSubmitChanges();
                        }}
                        type="button"
                      >
                        Submit Edit
                      </Button>
                    )}
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