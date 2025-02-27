import { apiClient } from "@/lib/apiClient";
import { AddMediaToModule, CreateModuleForm } from "@/types";

export const addModuleService = async (payload: CreateModuleForm) => {
  try {
    const { data } = await apiClient.post("/modules", {
      courseId: payload.courseId,
      title: payload.title,
      description: payload.description,
      difficultyLevel: payload.difficultyLevel,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const addMediaToModuleService = async (payload: AddMediaToModule) => {
  try {
    const { data } = await apiClient.put("/modules/add-media", {
      ...payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchModuleDetailsService = async (payload: {
  courseId: string;
  moduleId: string;
}) => {
  try {
    const { data } = await apiClient.get(
      `/courses/${payload?.courseId}/modules/${payload.moduleId}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
