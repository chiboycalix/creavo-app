import { apiClient } from "@/lib/apiClient";

export interface BookmarkItem {
  id: number;
  title: string;
  description?: string;
  url?: string;
  createdAt: string;
  userId: number;
}

export const updateProfileService = async (payload: any) => {
  try {
    const { data } = await apiClient.put("/profiles", {
      ...payload,
    });
    return data;
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw error;
  }
};
