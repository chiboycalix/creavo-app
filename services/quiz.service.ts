import { apiClient } from "@/lib/apiClient";

export const addQuizToModuleService = async (payload: any) => {
  const { moduleId, ...rest } = payload;
  try {
    const { data } = await apiClient.post(`/modules/${moduleId}/create-quiz`, {
      ...rest,
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
