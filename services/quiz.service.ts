import { apiClient } from "@/lib/apiClient";

export const addQuizToModuleService = async (payload: any) => {
  const { moduleId, ...rest } = payload;
  try {
    const { data } = await apiClient.post(`/modules/${moduleId}/quizes`, {
      ...rest,
      moduleId,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchQuizService = async (payload: any) => {
  try {
    const { data } = await apiClient.get(
      `/modules/${payload?.moduleId}/quizes`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateQuizQuestionService = async (payload: any) => {
  try {
    const { data } = await apiClient.patch(
      `/quizzes/${payload?.questionId}/update-question`,
      payload
    );
    return data;
  } catch (error) {
    throw error;
  }
};


export const addQuestionToQuizService = async (quizId: string | number, payload: any) => {
  try {
    const { data } = await apiClient.post(`/quizzes/${quizId}/add-quiz-question`, payload);
    return data;
  } catch (error) {
    throw error;
  }
};



