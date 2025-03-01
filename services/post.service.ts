import { apiClient } from "@/lib/apiClient";

export type CreatePostPayload = {
  title: string;
  body: string;
  thumbnailUrl: string;
  hashtags: string[];
  media: {
    url: string;
    title: string;
    description: string;
    mimeType?: string;
  }[];
  status: "ACTIVE" | "INACTIVE";
  location: any;
  deviceId: any;
};

export const createPostService = async (payload: CreatePostPayload) => {
  try {
    const { data } = await apiClient.post("/posts", {
      ...payload,
      hashtag: payload.hashtags.join(","),
    });
    return data;
  } catch (error) {
    throw error;
  }
};
