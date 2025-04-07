import { apiClient } from "@/lib/apiClient";

export type SpacePayload = {
  communityId: string;
  name: string;
  description: string;
  logo?: string;
};

export type AddMemberToSpacePayload = {
  communityId: string;
  spaceId: string;
  members: string[];
};

export type CreatePostsPayload = {
  text: string;
  imageUrl?: string;
  spaceId: string;
  communityId: string;
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

export const addMembersManuallyToSpaceService = async ({
  members,
  communityId,
  spaceId,
}: AddMemberToSpacePayload) => {
  try {
    const { data } = await apiClient.post(
      `/communities/${communityId}/spaces/${spaceId}/members`,
      {
        members,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const createPostService = async (payload: CreatePostsPayload) => {
  const { communityId, spaceId, ...rest } = payload;
  try {
    const { data } = await apiClient.post(
      `/communities/${communityId}/spaces/${spaceId}/messages`,
      {
        ...rest,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
