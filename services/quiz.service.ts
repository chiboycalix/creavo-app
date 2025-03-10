import { apiClient } from "@/lib/apiClient";

export const addQuizToModuleService = async (payload: any) => {
  try {
    const { data } = await apiClient.post(
      `/modules/${payload?.moduleId}/create-quiz`,
      {
        ...payload,
      }
    );
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
