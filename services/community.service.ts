import { apiClient } from "@/lib/apiClient";

export type SpacePayload = {
  communityId: string;
  name: string;
  description: string;
  logo?: string;
};

export type EditSpacePayload = {
  communityId: string;
  spaceId: string;
  name: string;
  description: string;
  logo?: string;
};

export type DeleteMessagePayload = {
  communityId: string;
  spaceId: string;
  messageId: string;
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
export type EditPostsPayload = {
  text: string;
  imageUrl?: string;
  spaceId: string;
  communityId: string;
  messageId: string;
};

export type RemoveMemberFromSpacePayload = {
  communityId: string;
  spaceId: string;
  members: string[];
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

export const editSpaceService = async (payload: EditSpacePayload) => {
  try {
    const { data } = await apiClient.patch(
      `/communities/${payload?.communityId}/spaces/${payload?.spaceId}`,
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

export const listSpaceMessagesService = async ({
  communityId,
  spaceId,
}: {
  communityId: string;
  spaceId: string;
}) => {
  try {
    const { data } = await apiClient.get(
      `/communities/${communityId}/spaces/${spaceId}/messages`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const editPostService = async (payload: EditPostsPayload) => {
  const { communityId, spaceId, messageId, ...rest } = payload;
  try {
    const { data } = await apiClient.patch(
      `/communities/${communityId}/spaces/${spaceId}/messages/${messageId}`,
      {
        ...rest,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteMessageService = async ({
  communityId,
  spaceId,
  messageId,
}: DeleteMessagePayload) => {
  try {
    const response = await apiClient.delete(
      `/communities/${communityId}/spaces/${spaceId}/messages/${messageId}`
    );
    return response;
  } catch (error: any) {
    return Promise.reject(error?.response?.data || "An error occurred");
  }
};

export const removeMemberFromSpaceService = async ({
  communityId,
  spaceId,
  members,
}: RemoveMemberFromSpacePayload) => {
  try {
    const response = await apiClient.patch(
      `/communities/${communityId}/spaces/${spaceId}/members`,
      {
        members,
      }
    );
    return response;
  } catch (error: any) {
    return Promise.reject(error?.response?.data || "An error occurred");
  }
};
