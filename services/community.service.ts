import { apiClient } from "@/lib/apiClient";

export const createCommunityService = async (payload: any) => {
  try {
    const { data } = await apiClient.post(`/communities`, {
      ...payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const listCommunities = async () => {
  try {
    const { data } = await apiClient.get(`/communities/list-community`);
    return data;
  } catch (error) {
    throw error;
  }
};
