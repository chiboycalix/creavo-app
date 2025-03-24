import { apiClient } from "@/lib/apiClient";

export const createCommunityService = async (payload: any) => {
  console.log({ payload });
  try {
    const { data } = await apiClient.post(`/communities`, {
      ...payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
