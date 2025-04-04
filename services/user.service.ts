import { apiClient } from "@/lib/apiClient";

export const fetchUsersProfileService = async (userId: number) => {
  try {
    const { data } = await apiClient.get(`/profiles/${userId}`);
    return data;
  } catch (error) {
    throw error;
  }
};
