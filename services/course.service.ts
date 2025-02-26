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
      amount: Number(payload.amount),
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetctCourseService = async ({
  courseId,
}: {
  courseId: string;
}) => {
  try {
    const { data } = await apiClient.get(
      `/courses/${courseId}/list-modules?page=1&limit=10`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
