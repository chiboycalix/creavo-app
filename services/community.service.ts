import { apiClient } from "@/lib/apiClient";

export type SpacePayload = {
  communityId: string;
  name: string;
  description: string;
  logo?: string;
};

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
    const { data } = await apiClient.get(`/communities`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createSpaceService = async (payload: SpacePayload) => {
  console.log("payload", payload);
  try {
    const { data } = await apiClient.post(
      `/communities/${payload?.communityId}/spaces`,
      {
        name: payload?.name,
        description: payload?.description,
        logo: payload?.logo,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
