import { apiClient } from "@/lib/apiClient";
import { CreateModuleForm } from "@/types";

export const addModuleService = async (payload: CreateModuleForm) => {
  try {
    const { data } = await apiClient.post("/modules", {
      courseId: payload.courseId,
      modules: payload.modules,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
