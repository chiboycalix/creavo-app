import { apiClient } from "@/lib/apiClient";
import { CreateModuleForm } from "@/types";

export const addModuleService = async (payload: CreateModuleForm) => {
  try {
    const { data } = await apiClient.post("/add-module", {
      title: payload.moduleTitle,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
