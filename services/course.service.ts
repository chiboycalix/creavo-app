import { apiClient } from "@/lib/apiClient";

export interface CreateCourseForm {
  title: string;
  description: string;
  difficultyLevel: string | undefined;
  amount?: string;
  currency?: string;
  thumbnailUrl?: string;
  isPaid: boolean;
  tags: string[];
}

export const createCourseService = async (payload: CreateCourseForm) => {
  try {
    const { data } = await apiClient.post("/courses", {
      ...payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
