import { apiClient } from "@/lib/apiClient";

export interface CreateCourseForm {
  title: string;
  categoryId: number;
  description: string;
  level: string;
  price: number;
  thumbnailUrl: string;
  language: string;
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
