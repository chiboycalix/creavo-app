import { apiClient } from "@/lib/apiClient";

export interface BookmarkItem {
  id: number;
  title: string;
  description?: string;
  url?: string;
  createdAt: string;
  userId: number;
}

export const updateProfileService = async (payload: any, token: string) => {
  try {
    const { data } = await apiClient.put(
      "/profiles",
      { ...payload },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
