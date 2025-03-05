import { apiClient } from "@/lib/apiClient";

export enum COURSE_CATEGORY {
  SIMPLE = "SIMPLE",
  STANDARD = "STANDARD",
}
export interface CreateCourseForm {
  title: string;
  description: string;
  difficultyLevel: string | undefined;
  amount?: string;
  currency?: string;
  promotionalUrl?: string;
  isPaid: boolean;
  tags: string[];
}

export const createCourseService = async (
  payload: CreateCourseForm,
  category: COURSE_CATEGORY
) => {
  try {
    const { data } = await apiClient.post("/courses", {
      ...payload,
      amount: Number(payload.amount),
      category: category,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserLongCourses = async (
  userId: number,
  limit = 10,
  page = 1
) => {
  try {
    const response = await apiClient.get(`/users/${userId}/courses`, {
      params: { limit, page, category: COURSE_CATEGORY.STANDARD },
    });
    return response;
  } catch (error: any) {
    console.error("Fetching user courses failed:", error.message);
    return Promise.reject(error?.response?.data || "An error occurred");
  }
};

export const getUserShortCourses = async (
  userId: number,
  limit = 10,
  page = 1
) => {
  try {
    const response = await apiClient.get(`/users/${userId}/courses`, {
      params: { limit, page, category: COURSE_CATEGORY.SIMPLE },
    });
    console.log(response);
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

export const fetchShortCourseService = async ({
  courseId,
}: {
  courseId: string;
}) => {
  try {
    const { data } = await apiClient.get(`/courses/${courseId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getCourseDetailsService = async ({
  courseId,
}: {
  courseId: number;
}) => {
  try {
    const { data } = await apiClient.get(`/courses/${courseId}`);
    return data;
  } catch (error: any) {
    console.error("Fetching user courses failed:", error.message);
    return Promise.reject(error?.response?.data || "An error occurred");
  }
};


export const fetchLearnerEngagement = async (courseId: number) => {
  try {
    const { data } = await apiClient.get(`/courses/${courseId}/trainee-progress-list?page=1&limit=10&initial=false`);
    console.log("Learner Engagement :", data);
    return data;
  } catch (error: any) {
    console.error("Fetching learner engagement details failed:", error.message);
    return Promise.reject(error?.response?.data || "An error occurred");
  }
};


export const fetchLearnerEngagementDetails = async (courseId: string) => {
  try {
    const { data } = await apiClient.get(`/courses/${courseId}/learner-course-engagement-details`);
    console.log("Learner Engagement Details:", data);
    return data;
  } catch (error: any) {
    console.error("Fetching learner engagement details failed:", error.message);
    return Promise.reject(error?.response?.data || "An error occurred");
  }
};

export const fetchUserCourses = async (userId: number) => {
  try {
    const { data } = await apiClient.get(`/users/${userId}/courses?limit=10&page=1`)
    console.log("User Courses Raw Response:", data)

    return data
  } catch (error: any) {
    console.error("Fetching user courses failed:", error.message)
    return Promise.reject(error?.response?.data || "An error occurred")
  }
}


export const getUserCourses = async (userId: number, limit = 10, page = 1) => {
  try {
    const response = await apiClient.get(`/users/${userId}/courses`, {
      params: { limit, page, category: 'STANDARD' },
    });
    return response;
  } catch (error: any) {
    console.error("Fetching user courses failed:", error.message);
    return Promise.reject(error?.response?.data || "An error occurred");
  }
};