import { apiClient } from "@/lib/apiClient";

export const addQuizToModuleService = async (payload: any) => {
  const { moduleId, ...rest } = payload;
  console.log({ payload });
  const q = {
    title: "Basic Math Quiz",
    description: "This quiz covers basic arithmetic operations.",
    allocatedTime: 30, // Time in minutes
    totalPoint: 100, // Total points for the quiz
    retries: 3,
    questions: [
      {
        text: "What is 2 + 2?",
        options: [
          { text: "3", isCorrect: false },
          { text: "5", isCorrect: false },
          { text: "4", isCorrect: true },
        ],
        type: "MCQ",
        correctAnswer: "4",
        allocatedPoint: 50,
      },
      {
        text: "What is 5 - 3?",
        options: [
          { text: "1", isCorrect: false },
          { text: "2", isCorrect: true },
          { text: "3", isCorrect: false },
        ],
        type: "MCQ",
        correctAnswer: "2",
        allocatedPoint: 50,
      },
    ],
  };
  try {
    const { data } = await apiClient.post(`/modules/${moduleId}/create-quiz`, {
      ...q,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchQuizService = async (payload: any) => {
  try {
    const { data } = await apiClient.get(
      `/modules/${payload?.moduleId}/get-quiz`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
