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
      category: 'STANDARD',

    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserCourses = async (userId: number, limit = 10, page = 1) => {
  try {
    const response = await apiClient.get(`/users/${userId}/courses`, {
      params: { limit, page, category: 'STANDARD' },
    });
    console.log(response)
    return response;
  } catch (error: any) {
    console.error("Fetching user courses failed:", error.message);
    return Promise.reject(error?.response?.data || "An error occurred");
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
